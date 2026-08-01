import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/admin';

import { QUESTION_IDS, type FreeAssessmentSubmission, type QuestionId } from './schema';
import type { OpportunityScore } from './score';

export type AssessmentStorageMode = 'mock' | 'supabase';

export interface StoredAssessment {
  readonly assessmentId: string;
  readonly storageMode: AssessmentStorageMode;
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

  if (leadError || !lead) throw new Error('Unable to persist assessment lead.');

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

  if (assessmentError || !assessment) throw new Error('Unable to persist assessment.');

  const answerRows = QUESTION_IDS.map((questionId) => ({
    free_assessment_id: assessment.id,
    question_id: questionId,
    answer_value: answerValue(questionId, submission.answers),
    canonical_answer_ids: canonicalAnswerIds(questionId, submission.answers),
  }));
  const { error: answersError } = await supabase
    .from('free_assessment_answers')
    .upsert(answerRows, { onConflict: 'free_assessment_id,question_id' });
  if (answersError) throw new Error('Unable to persist assessment answers.');

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
  if (scoreError) throw new Error('Unable to persist assessment score.');

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
  if (existingConsentsError) throw new Error('Unable to verify assessment consent.');

  const consentRows = consentChoices.map(({ channel, granted }) => ({
    id: existingConsents?.find((consent) => consent.channel === channel)?.id,
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
  }));
  const { error: consentError } = await supabase.from('consents').upsert(consentRows);
  if (consentError) throw new Error('Unable to persist assessment consent.');

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
