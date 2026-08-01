import { NextResponse } from 'next/server';

import { checkoutRequestSchema } from '@/features/checkout/contract';
import { buildCheckoutSession } from '@/features/checkout/session';
import { createSupabaseCheckoutStore } from '@/features/checkout/supabase-store';
import { createStripeClient } from '@/features/checkout/stripe';

export const runtime = 'nodejs';

const MAX_REQUEST_BYTES = 16 * 1024;

/**
 * The paid flow has its own switch, separate from lead storage: enabling one
 * must not silently enable the other. Checkout also requires real storage —
 * an order has to attach to a stored lead, which the mock adapter never has.
 */
function checkoutEnabled(): boolean {
  return (
    process.env.CHECKOUT_MODE === 'stripe' && process.env.ASSESSMENT_STORAGE_MODE === 'supabase'
  );
}

export async function POST(request: Request) {
  if (!checkoutEnabled()) {
    return NextResponse.json({ error: 'checkout_unavailable' }, { status: 503 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: 'checkout_unavailable' }, { status: 503 });
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

  const parsed = checkoutRequestSchema.safeParse(payload);
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
    const store = createSupabaseCheckoutStore();

    // The purchase must follow from a real free assessment: that is what ties
    // the order to a lead, and it stops the endpoint being usable to open
    // arbitrary checkout sessions against guessed identifiers.
    const leadId = await store.findLeadForFreeAssessment(parsed.data.freeAssessmentId);
    if (!leadId) {
      return NextResponse.json({ error: 'unknown_assessment' }, { status: 404 });
    }

    const stripe = createStripeClient(secretKey);
    // Requests from this public route are always 'public': the deeper
    // promotion tiers cannot be reached from here regardless of what was typed.
    const prepared = await buildCheckoutSession(stripe, { request: parsed.data });

    const order = await store.createOrder({
      leadId,
      idempotencyKey: parsed.data.idempotencyKey,
      stripeCheckoutSessionId: prepared.session.id,
      amountDiscountCents: prepared.expectedDiscountCents,
      checkoutExpiresAt: prepared.session.expires_at
        ? new Date(prepared.session.expires_at * 1000).toISOString()
        : null,
    });

    return NextResponse.json({
      orderId: order.id,
      checkoutUrl: prepared.session.url,
      amountSubtotalCents: order.amountSubtotalCents,
      amountDiscountCents: order.amountDiscountCents,
      amountTotalCents: order.amountTotalCents,
      appliedPromotionCode: prepared.appliedPromotionCode,
    });
  } catch (error) {
    // Server-side only; the client response stays generic.
    console.error('checkout request failed', error);
    return NextResponse.json({ error: 'checkout_unavailable' }, { status: 503 });
  }
}
