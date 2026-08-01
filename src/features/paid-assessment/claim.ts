/**
 * Claiming a paid order into an authenticated account.
 *
 * Checkout is deliberately account-less: the order attaches to a lead, not a
 * profile. The paid questionnaire, however, requires an account —
 * `paid_assessments.customer_profile_id` is NOT NULL and row-level security is
 * keyed on it. This module is the bridge: a signed-in customer claims their
 * paid order, which attaches the order to their profile and creates the
 * `paid_assessments` row the questionnaire then lives in.
 *
 * Authorization is the email match. The Stripe checkout session id merely
 * locates the order — it travels through a success URL and can leak into
 * browser history, so knowing it must not be enough. The claimant's
 * authenticated email has to match the lead email the purchase was made under;
 * Supabase only issues a session once that address is confirmed.
 */

export class PaidAssessmentError extends Error {
  readonly code: string;

  constructor(code: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'PaidAssessmentError';
    this.code = code;
  }
}

export interface ClaimableOrder {
  readonly id: string;
  readonly status: string;
  readonly customerProfileId: string | null;
  readonly leadEmail: string | null;
  readonly leadLocale: string | null;
}

export interface Claimant {
  readonly profileId: string;
  /** The authenticated (confirmed) email from the auth session. */
  readonly email: string;
}

export interface PaidAssessmentSummary {
  readonly id: string;
  readonly orderId: string;
  readonly customerProfileId: string;
  readonly status: string;
  readonly preferredLocale: string;
}

export interface PaidAssessmentStore {
  /** Locates an order (with its lead's email and locale) by checkout session id. */
  findOrderForClaim(checkoutSessionId: string): Promise<ClaimableOrder | null>;

  /**
   * Attaches an unowned order to a profile. Must only set
   * `customer_profile_id` when it is currently null, so a concurrent claim
   * cannot re-own an order; losing that race is detected afterwards via
   * {@link ensurePaidAssessment}.
   */
  attachOrderToProfile(orderId: string, profileId: string): Promise<void>;

  /**
   * Creates the paid assessment for an order if none exists, then returns the
   * row. Idempotent on the order (unique `order_id`): a repeat claim returns
   * the existing assessment unchanged.
   */
  ensurePaidAssessment(input: {
    readonly orderId: string;
    readonly customerProfileId: string;
    readonly preferredLocale: string;
  }): Promise<PaidAssessmentSummary>;
}

export type ClaimRejection =
  'order_not_found' | 'order_not_paid' | 'owned_by_another_account' | 'email_mismatch';

export type ClaimResult =
  | { readonly claimed: true; readonly assessment: PaidAssessmentSummary }
  | { readonly claimed: false; readonly reason: ClaimRejection };

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Pure eligibility decision, separated so the rules are testable without a
 * database: paid order, not owned by someone else, emails match.
 */
export function decideClaim(
  order: ClaimableOrder | null,
  claimant: Claimant,
): ClaimRejection | null {
  if (!order) return 'order_not_found';
  // A still-open or expired checkout has nothing to claim; the webhook is the
  // only authority on "paid".
  if (order.status !== 'paid') return 'order_not_paid';
  if (order.customerProfileId && order.customerProfileId !== claimant.profileId) {
    return 'owned_by_another_account';
  }
  if (!order.leadEmail || normalizeEmail(order.leadEmail) !== normalizeEmail(claimant.email)) {
    return 'email_mismatch';
  }
  return null;
}

export async function claimPaidOrder(
  store: PaidAssessmentStore,
  input: { readonly checkoutSessionId: string; readonly claimant: Claimant },
): Promise<ClaimResult> {
  const order = await store.findOrderForClaim(input.checkoutSessionId);

  const rejection = decideClaim(order, input.claimant);
  if (rejection) return { claimed: false, reason: rejection };
  const claimable = order as ClaimableOrder;

  if (!claimable.customerProfileId) {
    await store.attachOrderToProfile(claimable.id, input.claimant.profileId);
  }

  const assessment = await store.ensurePaidAssessment({
    orderId: claimable.id,
    customerProfileId: input.claimant.profileId,
    preferredLocale: claimable.leadLocale === 'es' ? 'es' : 'en',
  });

  // A concurrent claim can win the attach race; the assessment row is the
  // arbiter, so a row owned by someone else means this claim lost.
  if (assessment.customerProfileId !== input.claimant.profileId) {
    return { claimed: false, reason: 'owned_by_another_account' };
  }

  return { claimed: true, assessment };
}
