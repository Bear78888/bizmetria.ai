import { z } from 'zod';

const localeSchema = z.enum(['en', 'es']);

export const CHECKOUT_CONTRACT_VERSION = 'checkout/1.0.0';

/** The one thing this application sells. Fixed by DEC-005: $299, one time. */
export const ASSESSMENT_PRICE_CENTS = 29_900;
export const ASSESSMENT_PRICE_LOOKUP_KEY = 'bizmetria_assessment_usd_299';
export const ASSESSMENT_CURRENCY = 'usd';

/**
 * The approved promotion ladder (DEC-012, DEC-020 / `D04-B`).
 *
 * `publiclyOffered` is what decides whether a code may be typed into a public
 * form. The $199 tier is late-reactivation-only and must never be advertised,
 * so it can only ever be applied from a targeted, server-issued grant.
 */
export const promotionTiers = {
  BIZ49: { discountCents: 4_900, publiclyOffered: true },
  BIZ99: { discountCents: 9_900, publiclyOffered: false },
  BIZ149: { discountCents: 14_900, publiclyOffered: false },
  BIZ199: { discountCents: 19_900, publiclyOffered: false },
} as const satisfies Record<string, { discountCents: number; publiclyOffered: boolean }>;

export type PromotionCode = keyof typeof promotionTiers;

export const promotionCodes = Object.keys(promotionTiers) as PromotionCode[];

export function isPromotionCode(value: string): value is PromotionCode {
  return Object.hasOwn(promotionTiers, value);
}

export const checkoutRequestSchema = z.object({
  contractVersion: z.literal(CHECKOUT_CONTRACT_VERSION),
  locale: localeSchema,
  /**
   * The free assessment this purchase follows from. Required: the paid
   * assessment builds on the free result, and the order has to attach to a
   * lead so it is reachable without an account.
   */
  freeAssessmentId: z.uuid(),
  email: z.email(),
  /**
   * Optional. Case is normalised before lookup — Stripe treats promotion codes
   * case-insensitively and a customer typing `biz49` means `BIZ49`.
   */
  promotionCode: z
    .string()
    .trim()
    .max(64)
    .transform((value) => value.toUpperCase())
    .optional(),
  idempotencyKey: z.uuid(),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export interface CheckoutSessionResult {
  readonly orderId: string;
  readonly checkoutUrl: string;
  readonly amountSubtotalCents: number;
  readonly amountDiscountCents: number;
  readonly amountTotalCents: number;
  readonly appliedPromotionCode: PromotionCode | null;
}

/**
 * Why a promotion was not applied. The customer-facing message never explains
 * which private tiers exist, so a rejected private code is reported exactly
 * like an unknown one.
 */
export type PromotionRejection = 'unknown_code' | 'not_publicly_offered' | 'inactive_in_stripe';

export class CheckoutError extends Error {
  readonly code: string;

  constructor(code: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'CheckoutError';
    this.code = code;
  }
}
