import type Stripe from 'stripe';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ASSESSMENT_PRICE_CENTS,
  CHECKOUT_CONTRACT_VERSION,
  type CheckoutRequest,
} from '../../src/features/checkout/contract';
import { buildCheckoutSession } from '../../src/features/checkout/session';
import type { CheckoutStripe } from '../../src/features/checkout/stripe';

// The double records the session-create params and returns them, so tests can
// assert on exactly what would be sent to Stripe without any network.
function fakeStripe(): {
  stripe: CheckoutStripe;
  created: () => Stripe.Checkout.SessionCreateParams;
} {
  let createdParams: Stripe.Checkout.SessionCreateParams | null = null;

  const stripe: CheckoutStripe = {
    checkout: {
      sessions: {
        create: (params) => {
          createdParams = params;
          return Promise.resolve({
            id: 'cs_test_fake',
            url: 'https://checkout.stripe.com/c/pay/cs_test_fake',
            ...params,
          } as unknown as Stripe.Response<Stripe.Checkout.Session>);
        },
      },
    },
    prices: {
      list: () =>
        Promise.resolve({
          data: [
            {
              id: 'price_fake',
              unit_amount: ASSESSMENT_PRICE_CENTS,
              currency: 'usd',
            } as Stripe.Price,
          ],
        } as Stripe.Response<Stripe.ApiList<Stripe.Price>>),
    },
    promotionCodes: {
      list: () =>
        Promise.resolve({ data: [] } as unknown as Stripe.Response<
          Stripe.ApiList<Stripe.PromotionCode>
        >),
    },
  };

  return {
    stripe,
    created: () => {
      if (!createdParams) throw new Error('no session was created');
      return createdParams;
    },
  };
}

function request(): CheckoutRequest {
  return {
    contractVersion: CHECKOUT_CONTRACT_VERSION,
    locale: 'en',
    freeAssessmentId: 'a8098c1a-f86e-11da-bd1a-00112444be1e',
    idempotencyKey: 'b8098c1a-f86e-11da-bd1a-00112444be1e',
  };
}

describe('checkout session return URLs', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('sends the customer back to the live deployment origin, not the parked canonical domain', async () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'bizmetria-ai.vercel.app');
    vi.stubEnv('VERCEL_URL', 'bizmetria-abc123.vercel.app');

    const { stripe, created } = fakeStripe();
    await buildCheckoutSession(stripe, { request: request() });

    const params = created();
    expect(params.success_url).toBe(
      'https://bizmetria-ai.vercel.app/en/assessment/paid/confirmed?session_id={CHECKOUT_SESSION_ID}',
    );
    expect(params.cancel_url).toBe('https://bizmetria-ai.vercel.app/en/assessment/paid/cancelled');
  });

  it('keeps the return URLs on the request locale', async () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'bizmetria-ai.vercel.app');
    vi.stubEnv('VERCEL_URL', '');

    const { stripe, created } = fakeStripe();
    await buildCheckoutSession(stripe, { request: { ...request(), locale: 'es' } });

    expect(created().success_url).toContain('/es/assessment/paid/confirmed');
    expect(created().cancel_url).toContain('/es/assessment/paid/cancelled');
  });

  it('falls back to the canonical origin when no deployment host exists (local dev)', async () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '');
    vi.stubEnv('VERCEL_URL', '');

    const { stripe, created } = fakeStripe();
    await buildCheckoutSession(stripe, { request: request() });

    expect(created().success_url).toBe(
      'https://bizmetria.com/en/assessment/paid/confirmed?session_id={CHECKOUT_SESSION_ID}',
    );
  });
});
