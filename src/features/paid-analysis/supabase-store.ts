import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/admin';

import type {
  AnalysableAssessment,
  AnalysableTranscript,
  AnalysisRunRecord,
  PaidAnalysisStore,
} from './run';

class PaidAnalysisStoreError extends Error {
  constructor(step: string, cause: { code?: string; message?: string } | null) {
    // Postgres code and message only; `details`/`hint` can echo the row.
    const detail = cause ? ` (${cause.code ?? 'unknown'}: ${cause.message ?? 'no message'})` : '';
    super(`Paid analysis persistence failed at ${step}.${detail}`);
    this.name = 'PaidAnalysisStoreError';
  }
}

export function createSupabasePaidAnalysisStore(): PaidAnalysisStore {
  const supabase = createSupabaseAdminClient();

  return {
    async findAssessmentForProfile(input): Promise<AnalysableAssessment | null> {
      const { data, error } = await supabase
        .from('paid_assessments')
        .select('id, customer_profile_id, status, preferred_locale, questionnaire_data')
        .eq('id', input.assessmentId)
        .eq('customer_profile_id', input.customerProfileId)
        .is('deleted_at', null)
        .maybeSingle();
      if (error) throw new PaidAnalysisStoreError('assessment lookup', error);
      if (!data) return null;
      return {
        id: data.id,
        customerProfileId: data.customer_profile_id,
        status: data.status,
        preferredLocale: data.preferred_locale,
        questionnaireData: (data.questionnaire_data ?? {}) as Record<string, unknown>,
      };
    },

    async findLatestTranscript(assessmentId): Promise<AnalysableTranscript | null> {
      const { data, error } = await supabase
        .from('transcripts')
        .select(
          'id, transcript_text, created_at, call_records!inner(interview_sessions!inner(paid_assessment_id))',
        )
        .eq('call_records.interview_sessions.paid_assessment_id', assessmentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new PaidAnalysisStoreError('transcript lookup', error);
      if (!data) return null;
      return { id: data.id, transcriptText: data.transcript_text };
    },

    async listRuns(assessmentId): Promise<readonly AnalysisRunRecord[]> {
      const { data, error } = await supabase
        .from('analysis_runs')
        .select('id, status, attempt_number')
        .eq('paid_assessment_id', assessmentId)
        .order('created_at', { ascending: false });
      if (error) throw new PaidAnalysisStoreError('run listing', error);
      return (data ?? []).map((row) => ({
        id: row.id,
        status: row.status,
        attemptNumber: row.attempt_number,
      }));
    },

    async createRun(input): Promise<string> {
      const { data, error } = await supabase
        .from('analysis_runs')
        .insert({
          paid_assessment_id: input.assessmentId,
          transcript_id: input.transcriptId,
          status: 'running',
          prompt_version: input.promptVersion,
          model_version: input.modelVersion,
          input_evidence: input.inputEvidence,
          attempt_number: Math.min(input.attemptNumber, 5),
          started_at: new Date().toISOString(),
        })
        .select('id')
        .single();
      if (error || !data) throw new PaidAnalysisStoreError('run insert', error);
      return data.id;
    },

    async finishRun(runId, outcome) {
      const { error } = await supabase
        .from('analysis_runs')
        .update(
          outcome.status === 'succeeded'
            ? {
                status: 'succeeded',
                structured_output: outcome.structuredOutput,
                completed_at: new Date().toISOString(),
              }
            : {
                status: 'failed',
                error_code: outcome.errorCode,
                completed_at: new Date().toISOString(),
              },
        )
        .eq('id', runId);
      if (error) throw new PaidAnalysisStoreError('run finish', error);
    },

    async updateAssessmentStatus(assessmentId, status) {
      const { error } = await supabase
        .from('paid_assessments')
        .update({ status })
        .eq('id', assessmentId);
      if (error) throw new PaidAnalysisStoreError('assessment status', error);
    },
  };
}
