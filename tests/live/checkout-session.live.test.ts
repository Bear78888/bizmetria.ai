import { describe, expect, it } from 'vitest';

import {
  ASSESSMENT_PRICE_CENTS,
  CHECKOUT_CONTRACT_VERSION,
  promotionTiers,
  type CheckoutRequest,
} from '@/features/checkout/contract';
import { buildCheckoutSession } from '@/features/checkout/session';
import { createStripeClient } from '@/features/checkout/stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;
const enabled = Boolean(secretKey?.startsWith('sk_test_'));

function request(overrides: Partial<CheckoutRequest> = {}): CheckoutRequest {
  return {
    contractVersion: CHECKOUT_CONTRACT_VERSION,
    locale: 'en',
    freeAssessmentId: crypto.randomUUID(),
    email: 'checkout-live-check@bizmetria.com',
    idempotencyKey: crypto.randomUUID(),
    ...overrides,
  };
}

describe.skipIf(!enabled)('checkout session against the real Stripe test account', () => {
  it('opens a session at the approved price with no promotion', async () => {
    const stripe = createStripeClient(secretKey!);
    const prepared = await buildCheckoutSession(stripe, { request: request() });

    expect(prepared.session.mode).toBe('payment');
    expect(prepared.session.livemode).toBe(false);
    expect(prepared.session.amount_total).toBe(ASSESSMENT_PRICE_CENTS);
    expect(prepared.appliedPromotionCode).toBeNull();
    expect(prepared.session.url).toMatch(/^https:\/\//u);
  });

  it('applies a publicly offered promotion and charges the discounted total', async () => {
    const stripe = createStripeClient(secretKey!);
    const prepared = await buildCheckoutSession(stripe, {
      request: request({ promotionCode: 'biz49' }),
    });

    expect(prepared.appliedPromotionCode).toBe('BIZ49');
    expect(prepared.session.amount_total).toBe(
      ASSESSMENT_PRICE_CENTS - promotionTiers.BIZ49.discountCents,
    );
  });

  it('ignores a private tier presented publicly and charges full price', async () => {
    const stripe = createStripeClient(secretKey!);
    const prepared = await buildCheckoutSession(stripe, {
      request: request({ promotionCode: 'BIZ199' }),
    });

    expect(prepared.appliedPromotionCode).toBeNull();
    expect(prepared.session.amount_total).toBe(ASSESSMENT_PRICE_CENTS);
  });

  it('applies a targeted tier only when the request is server-issued', async () => {
    const stripe = createStripeClient(secretKey!);
    const prepared = await buildCheckoutSession(stripe, {
      request: request({ promotionCode: 'BIZ99' }),
      promotionSource: 'targeted',
    });

    expect(prepared.appliedPromotionCode).toBe('BIZ99');
    expect(prepared.session.amount_total).toBe(
      ASSESSMENT_PRICE_CENTS - promotionTiers.BIZ99.discountCents,
    );
  });

  it('returns the same session for a retried idempotency key', async () => {
    const stripe = createStripeClient(secretKey!);
    const payload = request();

    const first = await buildCheckoutSession(stripe, { request: payload });
    const second = await buildCheckoutSession(stripe, { request: payload });

    expect(second.session.id).toBe(first.session.id);
  });

  it('refuses a disabled tier rather than opening a discounted session', async () => {
    const stripe = createStripeClient(secretKey!);
    // BIZ149 is approved but switched off in Stripe until the approval gate
    // passes, so it must not discount even from a targeted request.
    const prepared = await buildCheckoutSession(stripe, {
      request: request({ promotionCode: 'BIZ149' }),
      promotionSource: 'targeted',
    });

    expect(prepared.appliedPromotionCode).toBeNull();
    expect(prepared.session.amount_total).toBe(ASSESSMENT_PRICE_CENTS);
  });
});
