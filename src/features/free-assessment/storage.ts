import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/admin';

import { QUESTION_IDS, type FreeAssessmentSubmission, type QuestionId } from './schema';
import type { OpportunityScore } from './score';

export type AssessmentStorageMode = 'mock' | 'supabase';

export interface StoredAssessment {
  readonly assessmentId: string;
  readonly storageMode: AssessmentStorageMode;
}

interface PersistenceFailure {
  readonly code?: string;
  readonly message?: string;
}

// Includes the Postgres error code and message so a failed write is diagnosable.
// `details` and `hint` are deliberately excluded: they can echo the offending
// row, which carries submitted contact data.
function persistenceError(step: string, cause: PersistenceFailure | null): Error {
  const detail = cause ? ` (${cause.code ?? 'unknown'}: ${cause.message ?? 'no message'})` : '';
  return new Error(`Unable to persist assessment ${step}.${detail}`);
}

function canonicalAnswerIds(
  questionId: QuestionId,
  answers: FreeAssessmentSubmission['answers'],
): readonly string[] {
  const answer = answers[questionId];
  return Array.isArray(answer) ? [...answer].sort() : [answer];
}

function answerValue(questionId: QuestionId, answers: FreeAssessmentSubmission['answers']) {
  if (questionId === 'Q01') {
    return {
      selected: answers.Q01,
      ...(answers.Q01 === 'other' ? { context: answers.businessTypeOther } : {}),
    };
  }

  const answer = answers[questionId];
  return Array.isArray(answer) ? [...answer].sort() : answer;
}

async function persistToSupabase(
  submission: FreeAssessmentSubmission,
  score: OpportunityScore,
): Promise<string> {
  // createSupabaseAdminClient verifies the target ref before returning a client.
  const supabase = createSupabaseAdminClient();
  const timestamp = new Date().toISOString();

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .upsert(
      {
        name: submission.contact.contactName,
        business_name: submission.contact.businessName,
        website: submission.contact.website || null,
        email: submission.contact.email,
        phone: submission.contact.phone || null,
        preferred_locale: submission.contact.preferredLanguage,
        source: 'public_free_assessment',
        status: 'captured',
        idempotency_key: `${submission.idempotencyKey}:lead`,
      },
      { onConflict: 'idempotency_key' },
    )
    .select('id')
    .single();

  if (leadError || !lead) throw persistenceError('lead', leadError);

  const { data: assessment, error: assessmentError } = await supabase
    .from('free_assessments')
    .upsert(
      {
        lead_id: lead.id,
        preferred_locale: submission.locale,
        contract_version: submission.schemaVersion,
        status: 'scored',
        idempotency_key: `${submission.idempotencyKey}:assessment`,
        submitted_at: timestamp,
        scored_at: timestamp,
      },
      { onConflict: 'idempotency_key' },
    )
    .select('id')
    .single();

  if (assessmentError || !assessment) throw persistenceError('record', assessmentError);

  const answerRows = QUESTION_IDS.map((questionId) => ({
    free_assessment_id: assessment.id,
    question_id: questionId,
    answer_value: answerValue(questionId, submission.answers),
    canonical_answer_ids: canonicalAnswerIds(questionId, submission.answers),
  }));
  const { error: answersError } = await supabase
    .from('free_assessment_answers')
    .upsert(answerRows, { onConflict: 'free_assessment_id,question_id' });
  if (answersError) throw persistenceError('answers', answersError);

  const { error: scoreError } = await supabase.from('opportunity_scores').upsert(
    {
      free_assessment_id: assessment.id,
      lead_response_follow_up: score.leadResponseFollowUp,
      manual_work: score.manualWork,
      systems_data: score.systemsData,
      strategic_priority_urgency: score.strategicPriorityUrgency,
      opportunity_breadth: score.opportunityBreadth,
      score_band: score.scoreBand,
      opportunity_areas: score.opportunityAreas,
      algorithm_version: score.algorithmVersion,
    },
    { onConflict: 'free_assessment_id' },
  );
  if (scoreError) throw persistenceError('score', scoreError);

  const consentChoices = [
    { channel: 'transactional', granted: true },
    { channel: 'email_marketing', granted: submission.consent.emailMarketing },
    { channel: 'sms_marketing', granted: submission.consent.smsMarketing },
  ] as const;

  const { data: existingConsents, error: existingConsentsError } = await supabase
    .from('consents')
    .select('id, channel')
    .eq('lead_id', lead.id)
    .in(
      'channel',
      consentChoices.map((choice) => choice.channel),
    );
  if (existingConsentsError) throw persistenceError('consent lookup', existingConsentsError);

  // Never send an `id` for a new consent. supabase-js pads a bulk payload so
  // every row shares the same keys, so an `id: undefined` becomes an explicit
  // null, which suppresses the column default and violates its not-null
  // constraint. Insert new rows without the column and update existing ones by id.
  const newConsents: Record<string, unknown>[] = [];
  const existingUpdates: { id: string; patch: Record<string, unknown> }[] = [];

  for (const { channel, granted } of consentChoices) {
    const row = {
      lead_id: lead.id,
      channel,
      status: granted ? 'granted' : 'denied',
      policy_version: submission.consent.policyVersion,
      capture_source: 'public_free_assessment_contact',
      evidence: {
        affirmative_choice: granted,
        locale: submission.locale,
        service_message: channel === 'transactional',
      },
      granted_at: granted ? timestamp : null,
      revoked_at: null,
    };

    const existingId = existingConsents?.find((consent) => consent.channel === channel)?.id;
    if (existingId) {
      existingUpdates.push({ id: existingId, patch: row });
    } else {
      newConsents.push(row);
    }
  }

  if (newConsents.length > 0) {
    const { error: consentError } = await supabase.from('consents').insert(newConsents);
    if (consentError) throw persistenceError('consent', consentError);
  }

  for (const { id, patch } of existingUpdates) {
    const { error: consentUpdateError } = await supabase
      .from('consents')
      .update(patch)
      .eq('id', id);
    if (consentUpdateError) throw persistenceError('consent update', consentUpdateError);
  }

  return assessment.id;
}

export async function storeAssessment(
  submission: FreeAssessmentSubmission,
  score: OpportunityScore,
): Promise<StoredAssessment> {
  if (process.env.ASSESSMENT_STORAGE_MODE !== 'supabase') {
    return {
      assessmentId: `preview-${submission.idempotencyKey}`,
      storageMode: 'mock',
    };
  }

  return {
    assessmentId: await persistToSupabase(submission, score),
    storageMode: 'supabase',
  };
}
