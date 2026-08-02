import { createHash } from 'node:crypto';

import type Stripe from 'stripe';

import type { CheckoutStore } from './store';

export type WebhookResult =
  | { readonly outcome: 'processed'; readonly orderId: string }
  | { readonly outcome: 'ignored'; readonly reason: string }
  | { readonly outcome: 'duplicate' };

export class WebhookProcessingError extends Error {
  readonly code: string;
  /** Whether a Stripe retry could plausibly succeed. */
  readonly retryable: boolean;

  constructor(code: string, message: string, retryable: boolean) {
    super(message);
    this.name = 'WebhookProcessingError';
    this.code = code;
    this.retryable = retryable;
  }
}

export function payloadHash(rawPayload: string): string {
  return createHash('sha256').update(rawPayload).digest('hex');
}

/**
 * What gets persisted alongside the event for diagnosis. Deliberately tiny:
 * identifiers and amounts only, never the customer's email or name, which the
 * full session object carries.
 */
function sanitize(event: Stripe.Event): Record<string, unknown> {
  const object = event.data.object as { id?: string; amount_total?: number | null };
  return {
    type: event.type,
    object_id: object.id ?? null,
    amount_total: object.amount_total ?? null,
  };
}

/**
 * Processes one verified Stripe event.
 *
 * Signature verification has already happened — this function trusts the
 * event's authenticity but nothing else about it. Everything money-shaped is
 * re-checked against the order this application created: a paid session whose
 * total does not equal the order's stored total is a discrepancy that fails
 * loudly, never a value to adopt.
 */
export async function processStripeEvent(
  event: Stripe.Event,
  rawPayload: string,
  store: CheckoutStore,
): Promise<WebhookResult> {
  const admission = await store.beginWebhookEvent({
    externalEventId: event.id,
    eventType: event.type,
    payloadHash: payloadHash(rawPayload),
    sanitizedPayload: sanitize(event),
  });

  if (admission === 'duplicate') {
    return { outcome: 'duplicate' };
  }
  // 'new' and 'retry' both proceed: a retry exists precisely because the
  // previous attempt did not finish successfully.

  if (event.type !== 'checkout.session.completed') {
    await store.finishWebhookEvent(event.id, 'ignored');
    return { outcome: 'ignored', reason: 'unhandled_event_type' };
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session;

    // A session this application did not create carries none of our metadata.
    // Not an error — the account may serve other tooling — but nothing to do.
    if (!session.metadata?.bizmetria_idempotency_key) {
      await store.finishWebhookEvent(event.id, 'ignored');
      return { outcome: 'ignored', reason: 'foreign_session' };
    }

    if (session.payment_status !== 'paid') {
      // Completed-but-unpaid covers delayed payment methods. The paid
      // transition then arrives as async_payment_succeeded, which is not
      // wired yet; card payments — the only method offered — settle here.
      await store.finishWebhookEvent(event.id, 'ignored');
      return { outcome: 'ignored', reason: 'not_paid' };
    }

    // Solution orders (catalog implementations) share the webhook but live in
    // their own table with their own lifecycle; the session metadata this
    // application wrote at creation says which flow the payment belongs to.
    if (session.metadata.bizmetria_kind === 'solution_order') {
      const solutionOrder = await store.findSolutionOrderByCheckoutSession(session.id);
      if (!solutionOrder) {
        // The order upsert and the webhook race; a retry lands after commit.
        throw new WebhookProcessingError('solution_order_not_found', 'No solution order.', true);
      }

      if (session.amount_total !== solutionOrder.amountTotalCents) {
        throw new WebhookProcessingError(
          'amount_mismatch',
          `Session total ${session.amount_total} does not equal solution order total ${solutionOrder.amountTotalCents}.`,
          false,
        );
      }

      if (['created', 'checkout_open', 'checkout_expired'].includes(solutionOrder.status)) {
        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : (session.payment_intent?.id ?? null);
        await store.markSolutionOrderPaid(solutionOrder.id, {
          paidAt: new Date(event.created * 1000).toISOString(),
          stripePaymentIntentId: paymentIntentId,
        });
      }

      await store.finishWebhookEvent(event.id, 'processed');
      return { outcome: 'processed', orderId: solutionOrder.id };
    }

    const order = await store.findOrderByCheckoutSession(session.id);
    if (!order) {
      // The order insert and the webhook race; a retry lands after commit.
      throw new WebhookProcessingError('order_not_found', `No order for session.`, true);
    }

    if (session.amount_total !== order.amountTotalCents) {
      throw new WebhookProcessingError(
        'amount_mismatch',
        `Session total ${session.amount_total} does not equal order total ${order.amountTotalCents}.`,
        false,
      );
    }

    if (order.status !== 'paid') {
      await store.markOrderPaid(order.id, {
        paidAt: new Date(event.created * 1000).toISOString(),
        stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
      });
    }

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id;
    if (paymentIntentId) {
      await store.recordPayment({
        orderId: order.id,
        stripePaymentIntentId: paymentIntentId,
        amountCents: order.amountTotalCents,
        processedAt: new Date(event.created * 1000).toISOString(),
      });
    }

    // Which promotion applied travels in the session metadata this
    // application wrote at creation; the discount amount comes from the
    // order, which the database constrains to the approved range.
    const promotionCodeId = session.metadata.bizmetria_promotion_code_id;
    if (order.amountDiscountCents > 0 && promotionCodeId) {
      await store.recordPromotionRedemption({
        orderId: order.id,
        stripePromotionCodeId: promotionCodeId,
        stripeCouponId: session.metadata.bizmetria_coupon_id ?? null,
        discountCents: order.amountDiscountCents,
      });
    }

    await store.finishWebhookEvent(event.id, 'processed');
    return { outcome: 'processed', orderId: order.id };
  } catch (error) {
    const code = error instanceof WebhookProcessingError ? error.code : 'processing_error';
    await store.finishWebhookEvent(event.id, 'failed', code);
    throw error;
  }
}
