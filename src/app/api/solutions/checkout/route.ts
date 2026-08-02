import { NextResponse } from 'next/server';
import { z } from 'zod';

import { startSolutionCheckout } from '@/features/solutions/checkout';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const MAX_REQUEST_BYTES = 8 * 1024;

const solutionCheckoutRequestSchema = z.object({
  contractVersion: z.literal('solution-checkout/1.0.0'),
  solutionCode: z
    .string()
    .min(3)
    .max(64)
    .regex(/^[a-z][a-z0-9_]*$/u),
  locale: z.enum(['en', 'es']),
  idempotencyKey: z.uuid(),
  paidAssessmentId: z.uuid().optional(),
});

function solutionsCheckoutEnabled(): boolean {
  return (
    process.env.CHECKOUT_MODE === 'stripe' && process.env.ASSESSMENT_STORAGE_MODE === 'supabase'
  );
}

export async function POST(request: Request) {
  if (!solutionsCheckoutEnabled()) {
    return NextResponse.json({ error: 'checkout_unavailable' }, { status: 503 });
  }

  // A solution order belongs to an account from the first moment: delivery
  // (accesses, files, instructions) lands in the cabinet, so an anonymous
  // purchase would have nowhere to go.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'authentication_required' }, { status: 401 });
  }

  let payload: unknown;
  try {
    const rawPayload = await request.text();
    if (rawPayload.length > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: 'invalid_request' }, { status: 413 });
    }
    payload = JSON.parse(rawPayload);
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const parsed = solutionCheckoutRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'invalid_checkout_request',
        fields: parsed.error.issues.map((issue) => issue.path.join('.')).filter(Boolean),
      },
      { status: 400 },
    );
  }

  try {
    const result = await startSolutionCheckout({
      customerProfileId: user.id,
      customerEmail: user.email ?? null,
      solutionCode: parsed.data.solutionCode,
      locale: parsed.data.locale,
      idempotencyKey: parsed.data.idempotencyKey,
      paidAssessmentId: parsed.data.paidAssessmentId,
    });

    if (!result.ok) {
      const status = result.error === 'unknown_solution' ? 404 : 503;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({
      checkoutUrl: result.checkoutUrl,
      solutionOrderId: result.solutionOrderId,
    });
  } catch (error) {
    // Server-side only; the client response stays generic.
    console.error('solution checkout request failed', error);
    return NextResponse.json({ error: 'checkout_unavailable' }, { status: 503 });
  }
}
