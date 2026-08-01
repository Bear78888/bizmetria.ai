import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { createSupabaseCheckoutStore } from '@/features/checkout/supabase-store';
import { WebhookProcessingError, processStripeEvent } from '@/features/checkout/webhook';

export const runtime = 'nodejs';

/**
 * Stripe webhook receiver.
 *
 * Fails closed: without a configured signing secret nothing is processed,
 * because an unverifiable event is indistinguishable from a forged one. The
 * signature check runs on the raw request body — any parsing first would
 * invalidate it.
 */
export async function POST(request: Request) {
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signingSecret || !signingSecret.startsWith('whsec_')) {
    console.error('stripe webhook received without a configured signing secret');
    return NextResponse.json({ error: 'webhook_unconfigured' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'missing_signature' }, { status: 400 });
  }

  const rawPayload = await request.text();

  let event: Stripe.Event;
  try {
    // Verification needs no API key; the placeholder client only hosts the
    // webhook helper, and never talks to the network here.
    event = await new Stripe('sk_test_signature_verification_only').webhooks.constructEventAsync(
      rawPayload,
      signature,
      signingSecret,
    );
  } catch {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  try {
    const result = await processStripeEvent(event, rawPayload, createSupabaseCheckoutStore());
    return NextResponse.json({ received: true, outcome: result.outcome });
  } catch (error) {
    console.error('stripe webhook processing failed', error);
    const retryable = !(error instanceof WebhookProcessingError) || error.retryable;
    // 5xx makes Stripe retry; 422 stops retries for a discrepancy that a
    // retry cannot fix but that stays recorded as failed for a human.
    return NextResponse.json({ error: 'processing_failed' }, { status: retryable ? 500 : 422 });
  }
}
