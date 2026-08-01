import { NextResponse } from 'next/server';
import { Retell } from 'retell-sdk';
import { z } from 'zod';

import { startInterview, type InterviewRetell } from '@/features/interview/session';
import { createSupabaseInterviewStore } from '@/features/interview/supabase-store';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const MAX_REQUEST_BYTES = 16 * 1024;

const startRequestSchema = z.object({
  assessmentId: z.uuid(),
  /**
   * §9.1: capture stays off until affirmative consent is true. The consent
   * checkbox state travels explicitly; a request without it never reaches
   * the provider.
   */
  consentGranted: z.literal(true),
});

function interviewEnabled(): boolean {
  return (
    process.env.CHECKOUT_MODE === 'stripe' &&
    process.env.ASSESSMENT_STORAGE_MODE === 'supabase' &&
    Boolean(process.env.RETELL_API_KEY)
  );
}

function agentIdByLocale(): Record<string, string> {
  const agents: Record<string, string> = {};
  const english = process.env.RETELL_AGENT_ID_EN;
  const spanish = process.env.RETELL_AGENT_ID_ES;
  if (english) agents.en = english;
  if (spanish) agents.es = spanish;
  return agents;
}

function createRetellAdapter(apiKey: string): InterviewRetell {
  const client = new Retell({ apiKey });
  return {
    async createWebCall({ agentId, metadata }) {
      const call = await client.call.createWebCall({ agent_id: agentId, metadata });
      return { callId: call.call_id, accessToken: call.access_token };
    },
  };
}

export async function POST(request: Request) {
  if (!interviewEnabled()) {
    return NextResponse.json({ error: 'interview_unavailable' }, { status: 503 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
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

  const parsed = startRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  try {
    const outcome = await startInterview(
      createSupabaseInterviewStore(),
      createRetellAdapter(process.env.RETELL_API_KEY as string),
      {
        assessmentId: parsed.data.assessmentId,
        customerProfileId: user.id,
        consentGranted: parsed.data.consentGranted,
        agentIdByLocale: agentIdByLocale(),
      },
    );

    if (!outcome.started) {
      const status = outcome.reason === 'not_found' ? 404 : 409;
      return NextResponse.json({ error: outcome.reason }, { status });
    }

    return NextResponse.json({
      sessionId: outcome.session.id,
      callId: outcome.callId,
      // The browser SDK needs this to join the web call room; it is scoped
      // to this single call and expires with it.
      accessToken: outcome.accessToken,
      attemptNumber: outcome.session.attemptNumber,
    });
  } catch (error) {
    console.error('interview start failed', error);
    return NextResponse.json({ error: 'interview_unavailable' }, { status: 503 });
  }
}
