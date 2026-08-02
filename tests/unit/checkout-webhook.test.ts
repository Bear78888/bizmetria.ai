import Stripe from 'stripe';
import { describe, expect, it } from 'vitest';

import type {
  CheckoutStore,
  EventAdmission,
  EventOutcome,
  NewOrder,
  StoredOrder,
  StoredSolutionOrder,
} from '@/features/checkout/store';
import { WebhookProcessingError, processStripeEvent } from '@/features/checkout/webhook';

interface EventRow {
  status: 'processing' | EventOutcome;
  errorCode?: string | undefined;
  attempts: number;
}

/**
 * In-memory implementation of the same contract the Supabase store fulfils,
 * so the processor's behaviour is asserted without a database.
 */
function memoryStore() {
  const events = new Map<string, EventRow>();
  const orders = new Map<string, StoredOrder & { sessionId: string }>();
  const solutionOrders = new Map<string, StoredSolutionOrder & { sessionId: string }>();
  const payments: { orderId: string; paymentIntentId: string; amountCents: number }[] = [];
  const redemptions: { orderId: string; codeId: string; discountCents: number }[] = [];
  const paidOrders = new Set<string>();
  const paidSolutionOrders = new Map<string, string | null>();

  const store: CheckoutStore = {
    async findLeadForFreeAssessment() {
      return null;
    },
    async createOrder(order: NewOrder) {
      throw new Error(`unexpected createOrder for ${order.idempotencyKey}`);
    },
    async beginWebhookEvent({ externalEventId, eventType }): Promise<EventAdmission> {
      const existing = events.get(externalEventId);
      if (!existing) {
        events.set(externalEventId, { status: 'processing', attempts: 1 });
        return 'new';
      }
      if (existing.status === 'processed' || existing.status === 'ignored') {
        return 'duplicate';
      }
      existing.status = 'processing';
      existing.attempts += 1;
      void eventType;
      return 'retry';
    },
    async finishWebhookEvent(externalEventId, outcome, errorCode) {
      const row = events.get(externalEventId);
      if (!row) throw new Error('finish before begin');
      row.status = outcome;
      row.errorCode = errorCode;
    },
    async findOrderByCheckoutSession(sessionId) {
      for (const order of orders.values()) {
        if (order.sessionId === sessionId) return order;
      }
      return null;
    },
    async markOrderPaid(orderId) {
      paidOrders.add(orderId);
    },
    async recordPayment(payment) {
      payments.push({
        orderId: payment.orderId,
        paymentIntentId: payment.stripePaymentIntentId,
        amountCents: payment.amountCents,
      });
    },
    async recordPromotionRedemption(redemption) {
      redemptions.push({
        orderId: redemption.orderId,
        codeId: redemption.stripePromotionCodeId,
        discountCents: redemption.discountCents,
      });
    },
    async findSolutionOrderByCheckoutSession(sessionId) {
      for (const order of solutionOrders.values()) {
        if (order.sessionId === sessionId) return order;
      }
      return null;
    },
    async markSolutionOrderPaid(solutionOrderId, paid) {
      paidSolutionOrders.set(solutionOrderId, paid.stripePaymentIntentId);
    },
  };

  return {
    store,
    events,
    payments,
    redemptions,
    paidOrders,
    paidSolutionOrders,
    addOrder(order: StoredOrder & { sessionId: string }) {
      orders.set(order.id, order);
    },
    addSolutionOrder(order: StoredSolutionOrder & { sessionId: string }) {
      solutionOrders.set(order.id, order);
    },
  };
}

function completedSessionEvent(overrides: {
  eventId?: string;
  sessionId?: string;
  amountTotal?: number;
  paymentStatus?: string;
  metadata?: Record<string, string> | null;
  paymentIntent?: string | null;
  type?: string;
}): Stripe.Event {
  return {
    id: overrides.eventId ?? 'evt_test_1',
    type: overrides.type ?? 'checkout.session.completed',
    created: 1_754_000_000,
    data: {
      object: {
        id: overrides.sessionId ?? 'cs_test_1',
        amount_total: overrides.amountTotal ?? 29_900,
        payment_status: overrides.paymentStatus ?? 'paid',
        payment_intent:
          overrides.paymentIntent === undefined ? 'pi_test_1' : overrides.paymentIntent,
        customer: 'cus_test_1',
        metadata:
          overrides.metadata === undefined
            ? { bizmetria_idempotency_key: 'idem-1', bizmetria_locale: 'en' }
            : overrides.metadata,
      },
    },
  } as unknown as Stripe.Event;
}

const fullPriceOrder: StoredOrder & { sessionId: string } = {
  id: 'order-1',
  sessionId: 'cs_test_1',
  status: 'checkout_open',
  amountSubtotalCents: 29_900,
  amountDiscountCents: 0,
  amountTotalCents: 29_900,
};

describe('stripe webhook processing', () => {
  it('marks the order paid and records the payment for a paid session', async () => {
    const context = memoryStore();
    context.addOrder(fullPriceOrder);

    const result = await processStripeEvent(completedSessionEvent({}), '{}', context.store);

    expect(result).toEqual({ outcome: 'processed', orderId: 'order-1' });
    expect(context.paidOrders.has('order-1')).toBe(true);
    expect(context.payments).toEqual([
      { orderId: 'order-1', paymentIntentId: 'pi_test_1', amountCents: 29_900 },
    ]);
    expect(context.redemptions).toEqual([]);
    expect(context.events.get('evt_test_1')?.status).toBe('processed');
  });

  it('records the promotion redemption when a discount applied', async () => {
    const context = memoryStore();
    context.addOrder({
      ...fullPriceOrder,
      amountDiscountCents: 4_900,
      amountTotalCents: 25_000,
    });

    await processStripeEvent(
      completedSessionEvent({
        amountTotal: 25_000,
        metadata: {
          bizmetria_idempotency_key: 'idem-1',
          bizmetria_promotion_code: 'BIZ49',
          bizmetria_promotion_code_id: 'promo_abc',
        },
      }),
      '{}',
      context.store,
    );

    expect(context.redemptions).toEqual([
      { orderId: 'order-1', codeId: 'promo_abc', discountCents: 4_900 },
    ]);
  });

  it('does nothing twice for a duplicate delivery', async () => {
    const context = memoryStore();
    context.addOrder(fullPriceOrder);

    await processStripeEvent(completedSessionEvent({}), '{}', context.store);
    const second = await processStripeEvent(completedSessionEvent({}), '{}', context.store);

    expect(second).toEqual({ outcome: 'duplicate' });
    expect(context.payments).toHaveLength(1);
  });

  it('reprocesses a retry after a failed attempt', async () => {
    const context = memoryStore();

    // First delivery: the order insert has not committed yet.
    await expect(
      processStripeEvent(completedSessionEvent({}), '{}', context.store),
    ).rejects.toMatchObject({ code: 'order_not_found', retryable: true });
    expect(context.events.get('evt_test_1')?.status).toBe('failed');

    // Stripe retries after the order exists: the same event id must process.
    context.addOrder(fullPriceOrder);
    const retry = await processStripeEvent(completedSessionEvent({}), '{}', context.store);

    expect(retry).toEqual({ outcome: 'processed', orderId: 'order-1' });
    expect(context.events.get('evt_test_1')?.attempts).toBe(2);
  });

  it('fails non-retryably when the charged total disagrees with the order', async () => {
    const context = memoryStore();
    context.addOrder(fullPriceOrder);

    await expect(
      processStripeEvent(completedSessionEvent({ amountTotal: 1_00 }), '{}', context.store),
    ).rejects.toMatchObject({ code: 'amount_mismatch', retryable: false });
    expect(context.paidOrders.size).toBe(0);
    expect(context.events.get('evt_test_1')?.errorCode).toBe('amount_mismatch');
  });

  it('ignores sessions this application did not create', async () => {
    const context = memoryStore();

    const result = await processStripeEvent(
      completedSessionEvent({ metadata: null }),
      '{}',
      context.store,
    );

    expect(result).toEqual({ outcome: 'ignored', reason: 'foreign_session' });
  });

  it('ignores completed-but-unpaid sessions', async () => {
    const context = memoryStore();
    context.addOrder(fullPriceOrder);

    const result = await processStripeEvent(
      completedSessionEvent({ paymentStatus: 'unpaid' }),
      '{}',
      context.store,
    );

    expect(result).toEqual({ outcome: 'ignored', reason: 'not_paid' });
    expect(context.paidOrders.size).toBe(0);
  });

  it('ignores event types it does not handle', async () => {
    const context = memoryStore();

    const result = await processStripeEvent(
      completedSessionEvent({ type: 'charge.refunded' }),
      '{}',
      context.store,
    );

    expect(result).toEqual({ outcome: 'ignored', reason: 'unhandled_event_type' });
  });

  it('keeps a thrown processing error typed', () => {
    const error = new WebhookProcessingError('x', 'y', true);
    expect(error.retryable).toBe(true);
  });

  it('marks a solution order paid when the session says solution_order', async () => {
    const context = memoryStore();
    context.addSolutionOrder({
      id: 'sol-1',
      sessionId: 'cs_sol_1',
      status: 'checkout_open',
      amountTotalCents: 39_000,
    });

    const result = await processStripeEvent(
      completedSessionEvent({
        sessionId: 'cs_sol_1',
        amountTotal: 39_000,
        metadata: {
          bizmetria_idempotency_key: 'idem-sol-1',
          bizmetria_kind: 'solution_order',
          bizmetria_solution_code: 'intake_autoreply',
        },
      }),
      '{}',
      context.store,
    );

    expect(result).toEqual({ outcome: 'processed', orderId: 'sol-1' });
    expect(context.paidSolutionOrders.get('sol-1')).toBe('pi_test_1');
    expect(context.paidOrders.size).toBe(0);
  });

  it('never re-pays a solution order already in build or delivered', async () => {
    const context = memoryStore();
    context.addSolutionOrder({
      id: 'sol-2',
      sessionId: 'cs_sol_2',
      status: 'in_build',
      amountTotalCents: 39_000,
    });

    const result = await processStripeEvent(
      completedSessionEvent({
        eventId: 'evt_sol_2',
        sessionId: 'cs_sol_2',
        amountTotal: 39_000,
        metadata: {
          bizmetria_idempotency_key: 'idem-sol-2',
          bizmetria_kind: 'solution_order',
        },
      }),
      '{}',
      context.store,
    );

    expect(result).toEqual({ outcome: 'processed', orderId: 'sol-2' });
    expect(context.paidSolutionOrders.size).toBe(0);
  });

  it('fails non-retryably when the charged total disagrees with the solution order', async () => {
    const context = memoryStore();
    context.addSolutionOrder({
      id: 'sol-3',
      sessionId: 'cs_sol_3',
      status: 'checkout_open',
      amountTotalCents: 39_000,
    });

    await expect(
      processStripeEvent(
        completedSessionEvent({
          eventId: 'evt_sol_3',
          sessionId: 'cs_sol_3',
          amountTotal: 1_000,
          metadata: {
            bizmetria_idempotency_key: 'idem-sol-3',
            bizmetria_kind: 'solution_order',
          },
        }),
        '{}',
        context.store,
      ),
    ).rejects.toMatchObject({ code: 'amount_mismatch', retryable: false });
    expect(context.paidSolutionOrders.size).toBe(0);
  });

  it('retries when the solution order row has not landed yet', async () => {
    const context = memoryStore();

    await expect(
      processStripeEvent(
        completedSessionEvent({
          eventId: 'evt_sol_4',
          sessionId: 'cs_sol_4',
          metadata: {
            bizmetria_idempotency_key: 'idem-sol-4',
            bizmetria_kind: 'solution_order',
          },
        }),
        '{}',
        context.store,
      ),
    ).rejects.toMatchObject({ code: 'solution_order_not_found', retryable: true });
  });
});

describe('stripe webhook signatures', () => {
  const webhooks = new Stripe('sk_test_signature_verification_only').webhooks;
  const secret = 'whsec_test_secret';

  it('accepts a genuinely signed payload', async () => {
    const payload = JSON.stringify(completedSessionEvent({}));
    const header = webhooks.generateTestHeaderString({ payload, secret });

    const event = await webhooks.constructEventAsync(payload, header, secret);
    expect(event.id).toBe('evt_test_1');
  });

  it('rejects a payload altered after signing', async () => {
    const payload = JSON.stringify(completedSessionEvent({}));
    const header = webhooks.generateTestHeaderString({ payload, secret });
    const tampered = payload.replace('29900', '100');

    await expect(webhooks.constructEventAsync(tampered, header, secret)).rejects.toThrow();
  });

  it('rejects a signature made with a different secret', async () => {
    const payload = JSON.stringify(completedSessionEvent({}));
    const header = webhooks.generateTestHeaderString({ payload, secret: 'whsec_other' });

    await expect(webhooks.constructEventAsync(payload, header, secret)).rejects.toThrow();
  });
});
