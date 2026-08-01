import type Stripe from 'stripe';

import { canonicalPath } from '@/lib/site';

import {
  ASSESSMENT_CURRENCY,
  ASSESSMENT_PRICE_CENTS,
  ASSESSMENT_PRICE_LOOKUP_KEY,
  CheckoutError,
  type CheckoutRequest,
  type PromotionCode,
} from './contract';
import { decidePromotion, type PromotionDecision, type PromotionSource } from './promotions';
import type { CheckoutStripe } from './stripe';

export interface PreparedCheckoutSession {
  readonly session: Stripe.Checkout.Session;
  readonly appliedPromotionCode: PromotionCode | null;
  readonly expectedDiscountCents: number;
}

async function resolvePriceId(stripe: CheckoutStripe): Promise<string> {
  const prices = await stripe.prices.list({
    lookup_keys: [ASSESSMENT_PRICE_LOOKUP_KEY],
    active: true,
    limit: 1,
  });

  const price = prices.data[0];
  if (!price) {
    throw new CheckoutError(
      'price_missing',
      `No active price with lookup key ${ASSESSMENT_PRICE_LOOKUP_KEY}. Run scripts/provision-stripe-catalog.ts.`,
    );
  }

  // The catalog is provisioned by script, but a price is editable in the
  // dashboard. Selling at anything other than the approved amount would be
  // invisible otherwise, and the database would reject the resulting order.
  if (price.unit_amount !== ASSESSMENT_PRICE_CENTS || price.currency !== ASSESSMENT_CURRENCY) {
    throw new CheckoutError(
      'price_mismatch',
      `Price ${price.id} is ${price.unit_amount} ${price.currency}, not ${ASSESSMENT_PRICE_CENTS} ${ASSESSMENT_CURRENCY}.`,
    );
  }

  return price.id;
}

/**
 * Resolves an approved code to its Stripe promotion code id.
 *
 * Eligibility was already decided locally; this checks that Stripe agrees the
 * code is currently active. The two can disagree — a tier is switched off in
 * Stripe while remaining in the approved ladder — and Stripe wins, because it
 * is what actually applies the discount.
 */
async function resolvePromotionCode(
  stripe: CheckoutStripe,
  code: PromotionCode,
): Promise<{ id: string; couponId: string | null } | null> {
  const codes = await stripe.promotionCodes.list({ code, active: true, limit: 1 });
  const found = codes.data[0];
  if (!found) return null;
  const coupon = (found as { coupon?: string | { id?: string } }).coupon;
  return {
    id: found.id,
    couponId: typeof coupon === 'string' ? coupon : (coupon?.id ?? null),
  };
}

export interface BuildCheckoutSessionOptions {
  readonly request: CheckoutRequest;
  readonly promotionSource?: PromotionSource;
}

export async function buildCheckoutSession(
  stripe: CheckoutStripe,
  { request, promotionSource = 'public' }: BuildCheckoutSessionOptions,
): Promise<PreparedCheckoutSession> {
  const priceId = await resolvePriceId(stripe);

  const decision: PromotionDecision | null = decidePromotion(
    request.promotionCode,
    promotionSource,
  );

  let promotion: { id: string; couponId: string | null } | null = null;
  let appliedPromotionCode: PromotionCode | null = null;
  let discountCents = 0;

  if (decision?.applied) {
    promotion = await resolvePromotionCode(stripe, decision.code);
    if (promotion) {
      appliedPromotionCode = decision.code;
      discountCents = decision.discountCents;
    }
    // An approved-but-inactive code simply does not apply. The customer is not
    // blocked from buying at full price over a promotion problem.
  }

  const returnBase = canonicalPath(`/${request.locale}/assessment/paid`);

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    ...(request.email ? { customer_email: request.email } : {}),
    locale: request.locale,
    client_reference_id: request.freeAssessmentId,
    success_url: `${returnBase}/confirmed?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${returnBase}/cancelled`,
    // BizMetria is the merchant of record, so it is responsible for its own
    // sales-tax registration and remittance.
    //
    // This is not a preference — the account has Managed Payments enabled by
    // default, and Managed Payments rejects this product: what is sold is a
    // consulting service with human review and a live consultation
    // (`txcd_20060048`), which is not an eligible category. Keeping Managed
    // Payments would mean misclassifying the product to qualify.
    //
    // Whether to restructure the offering so Stripe can act as merchant of
    // record is a genuine question for the pending tax review (DEC-024), since
    // it would remove multi-state sales-tax handling from BizMetria. It is a
    // business decision, not one this code should make silently.
    managed_payments: { enabled: false },
    // Never both: the ladder allows one promotion per order and no stacking,
    // and Stripe rejects a session that sets `discounts` alongside the
    // customer-entered promotion code field.
    ...(promotion
      ? { discounts: [{ promotion_code: promotion.id }] }
      : { allow_promotion_codes: false }),
    // The webhook reads these back: they are how a completed session is tied
    // to this application's order and applied promotion without trusting
    // anything client-controlled.
    metadata: {
      bizmetria_free_assessment_id: request.freeAssessmentId,
      bizmetria_idempotency_key: request.idempotencyKey,
      bizmetria_locale: request.locale,
      ...(appliedPromotionCode && promotion
        ? {
            bizmetria_promotion_code: appliedPromotionCode,
            bizmetria_promotion_code_id: promotion.id,
            ...(promotion.couponId ? { bizmetria_coupon_id: promotion.couponId } : {}),
          }
        : {}),
    },
  };

  // Stripe deduplicates on this key, so a retried request returns the original
  // session instead of opening a second checkout for the same purchase.
  const session = await stripe.checkout.sessions.create(params, {
    idempotencyKey: `checkout:${request.idempotencyKey}`,
  });

  return { session, appliedPromotionCode, expectedDiscountCents: discountCents };
}
