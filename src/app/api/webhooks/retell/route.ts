import { NextResponse } from 'next/server';
import { Retell } from 'retell-sdk';

import { processFreeCheckCall } from '@/features/free-assessment/phone-intake';
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
  // Retell.verify is asynchronous — an unawaited call returns a Promise,
  // which is always truthy and would accept every signature.
  const signatureValid = await Retell.verify(rawBody, apiKey, signature);
  if (!signatureValid) {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  let event: RetellEvent;
  try {
    event = JSON.parse(rawBody) as RetellEvent;
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  // Free-check phone calls: inbound calls to the free agent carry no session
  // metadata — they are recognised by agent id and processed as a spoken
  // submission of the 11-question check once the final transcript arrives.
  const freeAgentId = process.env.RETELL_FREE_AGENT_ID;
  const call = event.call as
    { agent_id?: string; call_id?: string; transcript?: string; from_number?: string } | undefined;
  if (freeAgentId && call?.agent_id === freeAgentId) {
    if (event.event !== 'call_analyzed' || !call.call_id) {
      return NextResponse.json({ received: true, outcome: 'ignored' });
    }
    try {
      const intake = await processFreeCheckCall({
        callId: call.call_id,
        transcript: call.transcript ?? '',
        callerNumber: call.from_number ?? null,
      });
      if (intake.outcome === 'skipped') {
        // Server-side detail only; Retell just needs a 2xx so it stops.
        console.warn(`free-check call ${call.call_id} skipped: ${intake.reason}`);
      }
      return NextResponse.json({ received: true, outcome: intake.outcome });
    } catch (error) {
      console.error('free-check phone intake failed', error);
      // Non-2xx makes Retell retry; the idempotency key collapses repeats.
      return NextResponse.json({ error: 'processing_failed' }, { status: 500 });
    }
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
