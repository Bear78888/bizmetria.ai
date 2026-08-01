import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createStructuredAnalysisCall } from '@/features/analysis/claude';
import { runPaidAnalysis } from '@/features/paid-analysis/run';
import { createSupabasePaidAnalysisStore } from '@/features/paid-analysis/supabase-store';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
// A high-effort structured analysis over a full questionnaire and transcript
// legitimately runs for minutes; the platform default would cut it off.
export const maxDuration = 300;

const MAX_REQUEST_BYTES = 16 * 1024;

const runRequestSchema = z.object({
  assessmentId: z.uuid(),
});

function analysisEnabled(): boolean {
  return (
    process.env.ASSESSMENT_STORAGE_MODE === 'supabase' && Boolean(process.env.ANTHROPIC_API_KEY)
  );
}

export async function POST(request: Request) {
  if (!analysisEnabled()) {
    return NextResponse.json({ error: 'analysis_unavailable' }, { status: 503 });
  }

  // The customer can only start analysis of their own assessment; the store
  // scopes every read to their profile, so a foreign id reads as missing.
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

  const parsed = runRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  try {
    const outcome = await runPaidAnalysis(
      createSupabasePaidAnalysisStore(),
      createStructuredAnalysisCall(process.env.ANTHROPIC_API_KEY as string),
      { assessmentId: parsed.data.assessmentId, customerProfileId: user.id },
    );

    if (!outcome.ran) {
      const status =
        outcome.reason === 'not_found'
          ? 404
          : outcome.reason === 'already_succeeded' || outcome.reason === 'run_in_progress'
            ? 200
            : 409;
      return NextResponse.json({ started: false, reason: outcome.reason }, { status });
    }

    if (outcome.status === 'failed') {
      return NextResponse.json(
        { started: true, runId: outcome.runId, status: 'failed' },
        { status: 502 },
      );
    }

    return NextResponse.json({ started: true, runId: outcome.runId, status: 'succeeded' });
  } catch (error) {
    // Server-side only; the client response stays generic.
    console.error('paid analysis run failed', error);
    return NextResponse.json({ error: 'analysis_unavailable' }, { status: 503 });
  }
}
