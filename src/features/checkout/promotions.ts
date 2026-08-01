import {
  isPromotionCode,
  promotionTiers,
  type PromotionCode,
  type PromotionRejection,
} from './contract';

export type PromotionDecision =
  | { readonly applied: true; readonly code: PromotionCode; readonly discountCents: number }
  | { readonly applied: false; readonly reason: PromotionRejection };

/**
 * How a promotion code reached the request. A code typed into the public
 * checkout form is `public`; one that the server itself issued to a named
 * recipient through a lifecycle message is `targeted`.
 *
 * This distinction is the whole point of the approved ladder: the deeper
 * discounts must not be obtainable by guessing a code, so their eligibility
 * cannot be decided by the client.
 */
export type PromotionSource = 'public' | 'targeted';

/**
 * Decides whether a promotion may be applied, before Stripe is involved.
 *
 * Implements `DEC-020` / `D04-B`: one promotion per order, no stacking, and
 * the $99, $149 and $199 tiers reachable only through targeted eligibility
 * rather than a reusable site-wide code.
 *
 * A privately-offered code presented publicly is rejected as `unknown_code`
 * on purpose — telling the customer "that code exists but is not for you"
 * would confirm which private tiers exist and invite guessing the rest.
 */
export function decidePromotion(
  candidate: string | undefined,
  source: PromotionSource = 'public',
): PromotionDecision | null {
  if (candidate === undefined) return null;

  const code = candidate.trim().toUpperCase();
  if (code.length === 0) return null;

  if (!isPromotionCode(code)) {
    return { applied: false, reason: 'unknown_code' };
  }

  const tier = promotionTiers[code];

  if (source === 'public' && !tier.publiclyOffered) {
    return { applied: false, reason: 'unknown_code' };
  }

  return { applied: true, code, discountCents: tier.discountCents };
}

/**
 * The discount the order should record. Stripe remains the authority on what
 * was actually charged — this is what we expect, and a mismatch at webhook
 * time is treated as a discrepancy rather than silently accepted.
 */
export function expectedDiscountCents(decision: PromotionDecision | null): number {
  return decision?.applied ? decision.discountCents : 0;
}
