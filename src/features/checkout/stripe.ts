import Stripe from 'stripe';

import { CheckoutError } from './contract';

/**
 * Test mode is a hard boundary, not a convention.
 *
 * The database refuses to store an order or payment whose `provider_mode` is
 * anything but `test` (`orders_test_mode_only_check`), so a live key would
 * produce charges that the application then cannot record. Failing here makes
 * that impossible rather than merely unlikely.
 */
export function assertTestModeKey(secretKey: string): void {
  if (!secretKey.startsWith('sk_test_')) {
    throw new CheckoutError(
      'live_mode_refused',
      'Refusing to use a Stripe key that is not a test key. Live activation is a separate, approved step.',
    );
  }
}

export function createStripeClient(secretKey: string): Stripe {
  assertTestModeKey(secretKey);
  return new Stripe(secretKey);
}

/**
 * The subset of Stripe this feature uses, so tests can supply a double without
 * standing up the whole SDK surface.
 */
export interface CheckoutStripe {
  readonly checkout: {
    readonly sessions: {
      create(
        params: Stripe.Checkout.SessionCreateParams,
        options?: Stripe.RequestOptions,
      ): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    };
  };
  readonly prices: {
    list(params: Stripe.PriceListParams): Promise<Stripe.Response<Stripe.ApiList<Stripe.Price>>>;
  };
  readonly promotionCodes: {
    list(
      params: Stripe.PromotionCodeListParams,
    ): Promise<Stripe.Response<Stripe.ApiList<Stripe.PromotionCode>>>;
  };
}
