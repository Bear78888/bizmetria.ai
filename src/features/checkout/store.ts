/**
 * Persistence boundary for the checkout flow.
 *
 * The webhook processor is pure logic over this interface, so its behaviour —
 * deduplication, the paid transition, amount verification — is testable with
 * an in-memory implementation, while the Supabase implementation stays a thin
 * mapping onto tables whose constraints already encode the business rules.
 */

export interface StoredOrder {
  readonly id: string;
  readonly status: string;
  readonly amountSubtotalCents: number;
  readonly amountDiscountCents: number;
  readonly amountTotalCents: number;
}

export interface NewOrder {
  readonly leadId: string;
  readonly idempotencyKey: string;
  readonly stripeCheckoutSessionId: string;
  readonly amountDiscountCents: number;
  readonly checkoutExpiresAt: string | null;
}

/**
 * `new` — first sighting; `retry` — seen before but not successfully handled
 * (failed or interrupted), so it must be processed again; `duplicate` — already
 * processed or deliberately ignored, nothing to do.
 */
export type EventAdmission = 'new' | 'retry' | 'duplicate';

export type EventOutcome = 'processed' | 'ignored' | 'failed';

export interface CheckoutStore {
  /** Resolves the lead a free assessment belongs to, or null. */
  findLeadForFreeAssessment(freeAssessmentId: string): Promise<string | null>;

  /**
   * Records the order for a just-created checkout session. Idempotent on the
   * request's idempotency key: a retry returns the existing order.
   */
  createOrder(order: NewOrder): Promise<StoredOrder>;

  /**
   * Admits a webhook event. Stripe retries deliveries, and a retry after a
   * processing failure must be handled again — only an event that reached
   * `processed` or `ignored` is a true duplicate.
   */
  beginWebhookEvent(input: {
    readonly externalEventId: string;
    readonly eventType: string;
    readonly payloadHash: string;
    readonly sanitizedPayload: Record<string, unknown>;
  }): Promise<EventAdmission>;

  finishWebhookEvent(
    externalEventId: string,
    outcome: EventOutcome,
    errorCode?: string,
  ): Promise<void>;

  findOrderByCheckoutSession(sessionId: string): Promise<StoredOrder | null>;

  markOrderPaid(
    orderId: string,
    paid: { paidAt: string; stripeCustomerId: string | null },
  ): Promise<void>;

  recordPayment(payment: {
    readonly orderId: string;
    readonly stripePaymentIntentId: string;
    readonly amountCents: number;
    readonly processedAt: string;
  }): Promise<void>;

  recordPromotionRedemption(redemption: {
    readonly orderId: string;
    readonly stripePromotionCodeId: string;
    readonly stripeCouponId: string | null;
    readonly discountCents: number;
  }): Promise<void>;
}
