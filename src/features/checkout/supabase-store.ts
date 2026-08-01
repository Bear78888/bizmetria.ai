import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/admin';

import { CheckoutError } from './contract';
import type { CheckoutStore, EventAdmission, EventOutcome, NewOrder, StoredOrder } from './store';

interface OrderRow {
  readonly id: string;
  readonly status: string;
  readonly amount_subtotal: number;
  readonly amount_discount: number;
  readonly amount_total: number;
}

function toStoredOrder(row: OrderRow): StoredOrder {
  return {
    id: row.id,
    status: row.status,
    amountSubtotalCents: row.amount_subtotal,
    amountDiscountCents: row.amount_discount,
    amountTotalCents: row.amount_total,
  };
}

function storeError(
  step: string,
  cause: { code?: string; message?: string } | null,
): CheckoutError {
  // Postgres code and message only; `details`/`hint` can echo the row.
  const detail = cause ? ` (${cause.code ?? 'unknown'}: ${cause.message ?? 'no message'})` : '';
  return new CheckoutError('store_failure', `Checkout persistence failed at ${step}.${detail}`);
}

export function createSupabaseCheckoutStore(): CheckoutStore {
  const supabase = createSupabaseAdminClient();

  return {
    async findLeadForFreeAssessment(freeAssessmentId) {
      const { data, error } = await supabase
        .from('free_assessments')
        .select('lead_id')
        .eq('id', freeAssessmentId)
        .maybeSingle();
      if (error) throw storeError('lead lookup', error);
      return data?.lead_id ?? null;
    },

    async createOrder(order: NewOrder) {
      const { data, error } = await supabase
        .from('orders')
        .upsert(
          {
            lead_id: order.leadId,
            status: 'checkout_open',
            amount_discount: order.amountDiscountCents,
            stripe_checkout_session_id: order.stripeCheckoutSessionId,
            idempotency_key: order.idempotencyKey,
            checkout_expires_at: order.checkoutExpiresAt,
          },
          { onConflict: 'idempotency_key' },
        )
        .select('id, status, amount_subtotal, amount_discount, amount_total')
        .single();
      if (error || !data) throw storeError('order', error);
      return toStoredOrder(data as OrderRow);
    },

    async beginWebhookEvent(input): Promise<EventAdmission> {
      const { data: existing, error: lookupError } = await supabase
        .from('webhook_events')
        .select('id, processing_status, attempt_count')
        .eq('provider', 'stripe')
        .eq('external_event_id', input.externalEventId)
        .maybeSingle();
      if (lookupError) throw storeError('event lookup', lookupError);

      if (!existing) {
        const { error } = await supabase.from('webhook_events').insert({
          provider: 'stripe',
          external_event_id: input.externalEventId,
          event_type: input.eventType,
          signature_verified: true,
          payload_hash: input.payloadHash,
          sanitized_payload: input.sanitizedPayload,
          processing_status: 'processing',
          attempt_count: 1,
        });
        if (error) {
          // Unique violation: a concurrent delivery inserted first. Treat it
          // as already admitted elsewhere rather than double-processing.
          if (error.code === '23505') return 'duplicate';
          throw storeError('event insert', error);
        }
        return 'new';
      }

      if (existing.processing_status === 'processed' || existing.processing_status === 'ignored') {
        return 'duplicate';
      }

      const { error } = await supabase
        .from('webhook_events')
        .update({
          processing_status: 'processing',
          attempt_count: Math.min((existing.attempt_count ?? 0) + 1, 20),
        })
        .eq('id', existing.id);
      if (error) throw storeError('event retry', error);
      return 'retry';
    },

    async finishWebhookEvent(externalEventId, outcome: EventOutcome, errorCode) {
      const { error } = await supabase
        .from('webhook_events')
        .update({
          processing_status: outcome,
          error_code: errorCode ?? null,
          processed_at: outcome === 'processed' ? new Date().toISOString() : null,
        })
        .eq('provider', 'stripe')
        .eq('external_event_id', externalEventId);
      if (error) throw storeError('event finish', error);
    },

    async findOrderByCheckoutSession(sessionId) {
      const { data, error } = await supabase
        .from('orders')
        .select('id, status, amount_subtotal, amount_discount, amount_total')
        .eq('stripe_checkout_session_id', sessionId)
        .maybeSingle();
      if (error) throw storeError('order lookup', error);
      return data ? toStoredOrder(data as OrderRow) : null;
    },

    async markOrderPaid(orderId, paid) {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          paid_at: paid.paidAt,
          stripe_customer_id: paid.stripeCustomerId,
        })
        .eq('id', orderId);
      if (error) throw storeError('order paid', error);
    },

    async recordPayment(payment) {
      const { error } = await supabase.from('payments').upsert(
        {
          order_id: payment.orderId,
          stripe_payment_intent_id: payment.stripePaymentIntentId,
          amount: payment.amountCents,
          status: 'succeeded',
          processed_at: payment.processedAt,
        },
        { onConflict: 'stripe_payment_intent_id' },
      );
      if (error) throw storeError('payment', error);
    },

    async recordPromotionRedemption(redemption) {
      const { error } = await supabase.from('promotion_redemptions').upsert(
        {
          order_id: redemption.orderId,
          stripe_promotion_code_id: redemption.stripePromotionCodeId,
          stripe_coupon_id: redemption.stripeCouponId,
          discount_amount: redemption.discountCents,
          status: 'consumed',
        },
        { onConflict: 'order_id,stripe_promotion_code_id' },
      );
      if (error) throw storeError('promotion redemption', error);
    },
  };
}
