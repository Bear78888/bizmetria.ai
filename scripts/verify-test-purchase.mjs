// Drives a complete REAL test-mode purchase against production: submits a
// free assessment, opens checkout with the public promotion code, pays the
// hosted Stripe page with the standard test card, and prints the ids for
// database verification. Test mode only; no real charge is possible.
import { chromium } from '@playwright/test';

const BASE = 'https://bizmetria-ai.vercel.app';
const uuid = crypto.randomUUID();

// 1) Real free assessment so the order has a lead to attach to.
const submission = {
  schemaVersion: 'free-audit-schema/1.0.0',
  locale: 'en',
  idempotencyKey: uuid,
  contact: {
    contactName: 'Purchase Verification',
    businessName: 'BizMetria Purchase Check',
    email: 'verify+purchase@bizmetria.com',
    phone: '',
    website: '',
    preferredLanguage: 'en',
  },
  consent: {
    emailMarketing: false,
    smsMarketing: false,
    policyVersion: 'consent-copy/en-es/1.0.0',
  },
  answers: {
    Q01: 'professional_services',
    Q02: 'solo',
    Q03: 'zero_to_10',
    Q04: ['email'],
    Q05: 'within_5_minutes',
    Q06: 'integrated_crm',
    Q07: ['none'],
    Q08: 'automated_multi_step_follow_up',
    Q09: 'limited_visibility_or_reporting',
    Q10: 'improve_reporting',
    Q11: 'just_exploring',
  },
};
const assessmentResponse = await fetch(`${BASE}/api/free-assessment`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(submission),
});
const assessment = await assessmentResponse.json();
if (!assessmentResponse.ok) throw new Error(`assessment: ${JSON.stringify(assessment)}`);
const freeAssessmentId = assessment.result.assessmentId;
console.log('free assessment:', freeAssessmentId, 'storage:', assessment.storageMode);

// 2) Open the checkout with the public BIZ49 code so the redemption path runs too.
const checkoutResponse = await fetch(`${BASE}/api/checkout`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contractVersion: 'checkout/1.0.0',
    locale: 'en',
    freeAssessmentId,
    promotionCode: 'BIZ49',
    idempotencyKey: crypto.randomUUID(),
  }),
});
const checkout = await checkoutResponse.json();
if (!checkoutResponse.ok) throw new Error(`checkout: ${JSON.stringify(checkout)}`);
console.log(
  'order:',
  checkout.orderId,
  'total cents:',
  checkout.amountTotalCents,
  'promo:',
  checkout.appliedPromotionCode,
);

// 3) Pay on the hosted Stripe page with the standard test card.
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(checkout.checkoutUrl, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);

// Payment fields may live on the page or inside Stripe iframes, behind a
// collapsed "Card" accordion. Find them wherever they are, and dump what is
// visible if they cannot be found.
async function fillEverywhere(selector, value) {
  for (const frame of page.frames()) {
    const field = frame.locator(selector).first();
    if ((await field.count()) && (await field.isVisible().catch(() => false))) {
      await field.fill(value);
      return true;
    }
  }
  return false;
}
await fillEverywhere('input[name="email"]', 'verify+purchase@bizmetria.com');

// Payment methods are an accordion; the card fields only exist after the
// card item is expanded. Labels vary, so click items until the field appears.
async function cardFieldVisible() {
  for (const frame of page.frames()) {
    const field = frame.locator('input[name="cardNumber"]').first();
    if ((await field.count()) && (await field.isVisible().catch(() => false))) return true;
  }
  return false;
}
const accordionItems = page.locator('[name="payment-method-accordion-item-title"]');
const itemCount = await accordionItems.count();
for (let index = 0; index < itemCount && !(await cardFieldVisible()); index += 1) {
  await accordionItems
    .nth(index)
    .click()
    .catch(() => {});
  await page.waitForTimeout(1500);
}

const filledCard = await fillEverywhere('input[name="cardNumber"]', '4242424242424242');
if (!filledCard) {
  for (const frame of page.frames()) {
    const names = await frame
      .$$eval('input, button[type="submit"]', (els) => els.map((el) => el.name || el.id || el.type))
      .catch(() => []);
    if (names.length) console.log('frame', frame.url().slice(0, 90), names.join(','));
  }
  throw new Error('card number field not found anywhere');
}
await fillEverywhere('input[name="cardExpiry"]', '12 / 34');
await fillEverywhere('input[name="cardCvc"]', '123');
await fillEverywhere('input[name="billingName"]', 'Purchase Verification');
await fillEverywhere('input[name="billingPostalCode"]', '90210');

// A country select can gate submission, and the Link save-my-info checkbox
// makes a phone number mandatory when left on. Neutralise both.
for (const frame of page.frames()) {
  const country = frame.locator('select[name="billingCountry"]').first();
  if (await country.count()) await country.selectOption('US').catch(() => {});
  const stripePass = frame.locator('input[name="enableStripePass"]').first();
  if ((await stripePass.count()) && (await stripePass.isChecked().catch(() => false))) {
    await stripePass.uncheck().catch(() => {});
  }
}

await page.click('button[type="submit"], .SubmitButton');
// success_url is built on the deployment origin, so payment completion should
// land on the confirmed page. Database state (via the webhook) remains the
// source of truth for "paid" — this checks the customer-visible redirect.
try {
  await page.waitForURL((url) => !url.hostname.includes('checkout.stripe.com'), {
    timeout: 90000,
    waitUntil: 'commit',
  });
} catch (error) {
  console.log('still on:', page.url());
  for (const frame of page.frames()) {
    const alerts = await frame
      .$$eval('[role="alert"], .FieldError, [id$="-error"]', (els) =>
        els.map((el) => el.textContent?.trim()).filter(Boolean),
      )
      .catch(() => []);
    if (alerts.length) console.log('validation:', alerts.join(' | '));
  }
  throw error;
}
console.log('landed on:', page.url());
const landing = new URL(page.url());
if (!landing.pathname.endsWith('/assessment/paid/confirmed')) {
  throw new Error(`redirect landed on ${page.url()}, not the confirmed page`);
}
await page.waitForLoadState('domcontentloaded').catch(() => {});
await browser.close();
console.log('PURCHASE COMPLETE');
console.log('cleanup-order-id:', checkout.orderId);
console.log('cleanup-assessment-id:', freeAssessmentId);
