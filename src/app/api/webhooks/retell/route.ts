import { NextResponse } from 'next/server';
import { Retell } from 'retell-sdk';

import { createSupabaseInterviewStore } from '@/features/interview/supabase-store';
import { processRetellEvent, type RetellEvent } from '@/features/interview/webhook';

export const runtime = 'nodejs';

/**
 * Retell delivery endpoint. Fail-closed: without the API key no signature can
 * be verified, so nothing is processed. Signatures are checked on the raw
 * body with the SDK's verify helper — the API key doubles as the webhook
 * signing key in Retell's model.
 */
export async function POST(request: Request) {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'webhook_unconfigured' }, { status: 503 });
  }

  const signature = request.headers.get('x-retell-signature');
  if (!signature) {
    return NextResponse.json({ error: 'missing_signature' }, { status: 400 });
  }

  const rawBody = await request.text();
  if (!Retell.verify(rawBody, apiKey, signature)) {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  let event: RetellEvent;
  try {
    event = JSON.parse(rawBody) as RetellEvent;
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  try {
    const result = await processRetellEvent(createSupabaseInterviewStore(), rawBody, event);
    if (result.outcome === 'failed') {
      // Non-2xx makes Retell retry (up to 3 times within its window).
      return NextResponse.json({ error: result.reason }, { status: 500 });
    }
    return NextResponse.json({ received: true, outcome: result.outcome });
  } catch (error) {
    console.error('retell webhook processing failed', error);
    return NextResponse.json({ error: 'processing_failed' }, { status: 500 });
  }
}
