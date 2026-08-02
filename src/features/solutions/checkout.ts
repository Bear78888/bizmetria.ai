import 'server-only';

import type Stripe from 'stripe';

import { createStripeClient } from '@/features/checkout/stripe';
import { deploymentPath } from '@/lib/site';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

import { findSolution } from './catalog';

/**
 * One-click purchase of a catalog implementation (DEC-031).
 *
 * Requires a signed-in customer: the order row is keyed on the profile, and
 * delivery (accesses, files, instructions) lands in that account. The amount
 * always comes from the code-side catalog — a request only names a code, so
 * there is nothing price-shaped for a client to tamper with.
 */

export type SolutionCheckoutError = 'unknown_solution' | 'unavailable';

export type SolutionCheckoutResult =
  | { readonly ok: true; readonly checkoutUrl: string; readonly solutionOrderId: string }
  | { readonly ok: false; readonly error: SolutionCheckoutError };

export interface SolutionCheckoutInput {
  readonly customerProfileId: string;
  readonly customerEmail: string | null;
  readonly solutionCode: string;
  readonly locale: 'en' | 'es';
  readonly idempotencyKey: string;
  readonly paidAssessmentId?: string | undefined;
}

export async function startSolutionCheckout(
  input: SolutionCheckoutInput,
): Promise<SolutionCheckoutResult> {
  const solution = findSolution(input.solutionCode);
  if (!solution) return { ok: false, error: 'unknown_solution' };

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return { ok: false, error: 'unavailable' };

  const stripe = createStripeClient(secretKey);
  const returnBase = deploymentPath(`/${input.locale}/account`);

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    // Cards only, same reasoning as the assessment checkout: the webhook
    // treats checkout.session.completed as the paid transition, which is only
    // sound while no delayed payment method is offered.
    payment_method_types: ['card'],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: solution.priceCents,
          product_data: {
            name: solution.title[input.locale],
            description: solution.outcome[input.locale],
          },
        },
      },
    ],
    ...(input.customerEmail ? { customer_email: input.customerEmail } : {}),
    locale: input.locale,
    success_url: `${returnBase}?solution=confirmed`,
    cancel_url: `${returnBase}?solution=cancelled`,
    metadata: {
      bizmetria_kind: 'solution_order',
      bizmetria_solution_code: solution.code,
      bizmetria_idempotency_key: input.idempotencyKey,
    },
  };

  const session = await stripe.checkout.sessions.create(params);
  if (!session.url) return { ok: false, error: 'unavailable' };

  // Upsert on the idempotency key: a retried request replaces the session
  // reference, so the webhook always finds the row for the session that
  // actually gets paid.
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('solution_orders')
    .upsert(
      {
        customer_profile_id: input.customerProfileId,
        paid_assessment_id: input.paidAssessmentId ?? null,
        solution_code: solution.code,
        amount_total: solution.priceCents,
        status: 'checkout_open',
        stripe_checkout_session_id: session.id,
        idempotency_key: input.idempotencyKey,
      },
      { onConflict: 'idempotency_key' },
    )
    .select('id')
    .single();

  if (error || !data) {
    // Postgres code and message only; `details`/`hint` can echo the row.
    console.error(
      `solution order persistence failed (${error?.code ?? 'unknown'}: ${error?.message ?? 'no message'})`,
    );
    return { ok: false, error: 'unavailable' };
  }

  return { ok: true, checkoutUrl: session.url, solutionOrderId: data.id };
}
