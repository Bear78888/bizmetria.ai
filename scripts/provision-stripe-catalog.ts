/**
 * Provisions the BizMetria checkout catalog in Stripe test mode.
 *
 * Idempotent: every object carries a stable lookup key or idempotency key, so
 * running this twice reuses what exists instead of creating duplicates.
 *
 * Refuses to run against a live key. The product decision (DEC-026) permits
 * building test/live separation now and activating live only as a separate,
 * owner-approved step, so this script must never be the thing that creates a
 * live object by accident.
 *
 *   STRIPE_SECRET_KEY=sk_test_... node --experimental-strip-types \
 *     scripts/provision-stripe-catalog.ts
 */

export {};

const STRIPE_API = 'https://api.stripe.com/v1';

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY is required.');
}

if (!secretKey.startsWith('sk_test_')) {
  throw new Error(
    'Refusing to run: STRIPE_SECRET_KEY is not a test key. This script never touches live mode.',
  );
}

const ASSESSMENT_PRICE_CENTS = 29_900;

// Stripe's "Consulting Services" code. What is sold is a paid business
// assessment with human review and a live consultation — a professional
// service delivered with digital tooling, not a SaaS subscription or a
// downloadable digital good, which carry different treatment in several US
// states.
//
// A product tax code is mandatory on this account because Managed Payments is
// enabled, which makes Stripe the merchant of record. Both that choice and this
// classification need confirmation from a qualified tax advisor before live
// mode, and that review is already a recorded pre-live dependency (DEC-024).
const ASSESSMENT_TAX_CODE = 'txcd_20060048';

// The approved promotion ladder (D04-B / DEC-012, DEC-020). `enabled` reflects
// the launch rule: start with $49 and $99, keep $149 and $199 switched off
// until payment, attribution and suppression tests pass. `maxRedemptions`
// implements the required cap on the two approval-gated tiers.
//
// Expiry is deliberately absent. The approved windows (7 days for $49, 72
// hours for the rest) run from the moment a code is issued to a specific
// person, which a permanently-dated Stripe object cannot express. Eligibility
// and expiry are enforced server-side at checkout.
const promotions = [
  { code: 'BIZ49', amountOffCents: 4_900, enabled: true, maxRedemptions: undefined },
  { code: 'BIZ99', amountOffCents: 9_900, enabled: true, maxRedemptions: undefined },
  { code: 'BIZ149', amountOffCents: 14_900, enabled: false, maxRedemptions: 25 },
  { code: 'BIZ199', amountOffCents: 19_900, enabled: false, maxRedemptions: 25 },
] as const;

interface StripeObject {
  readonly id: string;
  readonly [key: string]: unknown;
}

function encode(form: Record<string, string | number | boolean | undefined>): string {
  const parameters = new URLSearchParams();
  for (const [key, value] of Object.entries(form)) {
    if (value !== undefined) parameters.set(key, String(value));
  }
  return parameters.toString();
}

async function stripe(
  method: 'GET' | 'POST',
  path: string,
  form?: Record<string, string | number | boolean | undefined>,
  idempotencyKey?: string,
): Promise<StripeObject> {
  const headers: Record<string, string> = { Authorization: `Bearer ${secretKey}` };
  let url = `${STRIPE_API}${path}`;
  let body: string | undefined;

  if (method === 'POST') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    body = encode(form ?? {});
    if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  } else if (form) {
    url += `?${encode(form)}`;
  }

  const response = await fetch(url, { method, headers, body: body ?? null });
  const payload = (await response.json()) as StripeObject & {
    error?: { message?: string; type?: string };
  };

  if (!response.ok) {
    throw new Error(
      `Stripe ${method} ${path} failed with ${response.status}: ${payload.error?.message ?? 'unknown error'}`,
    );
  }

  return payload;
}

async function findByLookup(path: string, predicate: (item: StripeObject) => boolean) {
  const list = (await stripe('GET', path, { limit: 100 })) as StripeObject & {
    data?: StripeObject[];
  };
  return list.data?.find(predicate);
}

async function main() {
  const account = await stripe('GET', '/account');
  console.info(`Account: ${account.id} (${String(account.business_profile ?? '')})`);

  // Product
  const existingProduct = await findByLookup(
    '/products',
    (item) => (item.metadata as Record<string, string> | undefined)?.bizmetria_sku === 'assessment',
  );
  const product =
    existingProduct ??
    (await stripe(
      'POST',
      '/products',
      {
        name: 'BizMetria Business Assessment',
        description:
          'One-time bilingual business assessment: personalized analysis, recommendations, impact/effort matrix and a 30-90 day roadmap. Implementation services are separate.',
        tax_code: ASSESSMENT_TAX_CODE,
        'metadata[bizmetria_sku]': 'assessment',
      },
      'bizmetria-product-assessment-v1',
    ));
  console.info(`Product: ${product.id}${existingProduct ? ' (existing)' : ' (created)'}`);

  // Converge the tax code on a product that predates it. Without one, Checkout
  // rejects every session on a Managed Payments account, so this is not
  // cosmetic — it is what makes the product sellable.
  if (product.tax_code !== ASSESSMENT_TAX_CODE) {
    await stripe('POST', `/products/${product.id}`, { tax_code: ASSESSMENT_TAX_CODE });
    console.info(`Product tax code set to ${ASSESSMENT_TAX_CODE} (Consulting Services).`);
  }

  // Price — one-time, USD. lookup_key makes it findable without storing the id.
  const existingPrice = await findByLookup(
    '/prices',
    (item) => item.lookup_key === 'bizmetria_assessment_usd_299',
  );
  const price =
    existingPrice ??
    (await stripe(
      'POST',
      '/prices',
      {
        product: product.id,
        unit_amount: ASSESSMENT_PRICE_CENTS,
        currency: 'usd',
        lookup_key: 'bizmetria_assessment_usd_299',
        'metadata[bizmetria_sku]': 'assessment',
      },
      'bizmetria-price-assessment-usd-299-v1',
    ));
  console.info(`Price: ${price.id}${existingPrice ? ' (existing)' : ' (created)'} — $299.00 USD`);

  // Coupons and promotion codes
  for (const promotion of promotions) {
    const dollars = promotion.amountOffCents / 100;
    const couponIdempotency = `bizmetria-coupon-${promotion.code.toLowerCase()}-v1`;

    const existingCoupon = await findByLookup(
      '/coupons',
      (item) =>
        (item.metadata as Record<string, string> | undefined)?.bizmetria_tier === promotion.code,
    );
    const coupon =
      existingCoupon ??
      (await stripe(
        'POST',
        '/coupons',
        {
          name: `BizMetria $${dollars} off`,
          amount_off: promotion.amountOffCents,
          currency: 'usd',
          duration: 'once',
          'applies_to[products][0]': product.id,
          'metadata[bizmetria_tier]': promotion.code,
        },
        couponIdempotency,
      ));

    const existingCode = await findByLookup(
      '/promotion_codes',
      (item) => item.code === promotion.code,
    );
    const promotionCode =
      existingCode ??
      (await stripe(
        'POST',
        '/promotion_codes',
        {
          // The promotion a code points at is a nested object on the current
          // API, not a flat `coupon` parameter.
          'promotion[type]': 'coupon',
          'promotion[coupon]': coupon.id,
          code: promotion.code,
          active: promotion.enabled,
          max_redemptions: promotion.maxRedemptions,
          'metadata[bizmetria_tier]': promotion.code,
        },
        `bizmetria-promocode-${promotion.code.toLowerCase()}-v1`,
      ));

    // A pre-existing code may carry the wrong active flag; converge it.
    if (existingCode && existingCode.active !== promotion.enabled) {
      await stripe('POST', `/promotion_codes/${promotionCode.id}`, { active: promotion.enabled });
    }

    console.info(
      `Promotion ${promotion.code}: coupon ${coupon.id}, code ${promotionCode.id} — ` +
        `$${dollars} off, ${promotion.enabled ? 'ACTIVE' : 'disabled (awaiting approval gate)'}` +
        `${promotion.maxRedemptions ? `, cap ${promotion.maxRedemptions}` : ''}`,
    );
  }
}

await main();
