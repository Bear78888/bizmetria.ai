import { NextResponse } from 'next/server';

import { submitQuestionnaire, submitRequestSchema } from '@/features/paid-assessment/questionnaire';
import { createSupabaseQuestionnaireStore } from '@/features/paid-assessment/supabase-store';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const MAX_REQUEST_BYTES = 16 * 1024;

function paidFlowEnabled(): boolean {
  return (
    process.env.CHECKOUT_MODE === 'stripe' && process.env.ASSESSMENT_STORAGE_MODE === 'supabase'
  );
}

export async function POST(request: Request) {
  if (!paidFlowEnabled()) {
    return NextResponse.json({ error: 'paid_assessment_unavailable' }, { status: 503 });
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

  const parsed = submitRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  try {
    const outcome = await submitQuestionnaire(createSupabaseQuestionnaireStore(), {
      assessmentId: parsed.data.assessmentId,
      customerProfileId: user.id,
      expectedVersion: parsed.data.expectedVersion,
    });

    if (!outcome.submitted) {
      const status =
        outcome.reason === 'not_found' ? 404 : outcome.reason === 'invalid' ? 422 : 409;
      return NextResponse.json(
        {
          error: outcome.reason,
          version: outcome.version,
          status: outcome.status,
          // Paths and rule messages only — answer values never leave the row.
          issues: outcome.issues,
        },
        { status },
      );
    }

    return NextResponse.json({
      submitted: true,
      version: outcome.version,
      status: outcome.status,
    });
  } catch (error) {
    // Server-side only; the client response stays generic.
    console.error('questionnaire submit failed', error);
    return NextResponse.json({ error: 'paid_assessment_unavailable' }, { status: 503 });
  }
}
