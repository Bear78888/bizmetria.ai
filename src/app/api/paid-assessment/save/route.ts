import { NextResponse } from 'next/server';

import {
  saveQuestionnaireDraft,
  saveRequestSchema,
} from '@/features/paid-assessment/questionnaire';
import { createSupabaseQuestionnaireStore } from '@/features/paid-assessment/supabase-store';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

// The full questionnaire is large (structured objects, free text up to 1000
// characters), but nowhere near this bound; anything bigger is not a save.
const MAX_REQUEST_BYTES = 256 * 1024;

function paidFlowEnabled(): boolean {
  return (
    process.env.CHECKOUT_MODE === 'stripe' && process.env.ASSESSMENT_STORAGE_MODE === 'supabase'
  );
}

export async function POST(request: Request) {
  if (!paidFlowEnabled()) {
    return NextResponse.json({ error: 'paid_assessment_unavailable' }, { status: 503 });
  }

  // The route authenticates; the store then scopes every read and write to
  // this profile, so another customer's assessment id is indistinguishable
  // from a missing one.
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

  const parsed = saveRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  try {
    const outcome = await saveQuestionnaireDraft(createSupabaseQuestionnaireStore(), {
      assessmentId: parsed.data.assessmentId,
      customerProfileId: user.id,
      expectedVersion: parsed.data.expectedVersion,
      fields: parsed.data.fields,
    });

    if (!outcome.saved && outcome.reason === 'not_found') {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    if (!outcome.saved && outcome.reason === 'version_conflict') {
      return NextResponse.json(
        { error: 'version_conflict', version: outcome.version },
        { status: 409 },
      );
    }
    if (!outcome.saved && outcome.reason === 'not_editable') {
      return NextResponse.json({ error: 'not_editable', status: outcome.status }, { status: 409 });
    }

    return NextResponse.json({
      saved: outcome.saved,
      version: outcome.version,
      status: outcome.status,
      acceptedFields: outcome.acceptedFields,
      rejectedFields: outcome.rejectedFields,
    });
  } catch (error) {
    // Server-side only; the client response stays generic.
    console.error('questionnaire save failed', error);
    return NextResponse.json({ error: 'paid_assessment_unavailable' }, { status: 503 });
  }
}
