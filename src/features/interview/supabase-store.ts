import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/admin';

import {
  InterviewError,
  type EventAdmission,
  type InterviewSession,
  type InterviewStore,
} from './store';

function storeError(step: string, cause: { code?: string; message?: string } | null) {
  // Postgres code and message only; `details`/`hint` can echo the row.
  const detail = cause ? ` (${cause.code ?? 'unknown'}: ${cause.message ?? 'no message'})` : '';
  return new InterviewError('store_failure', `Interview persistence failed at ${step}.${detail}`);
}

interface SessionRow {
  readonly id: string;
  readonly paid_assessment_id: string;
  readonly status: string;
  readonly attempt_number: number;
  readonly preferred_locale: string;
}

function toSession(row: SessionRow): InterviewSession {
  return {
    id: row.id,
    paidAssessmentId: row.paid_assessment_id,
    status: row.status,
    attemptNumber: row.attempt_number,
    preferredLocale: row.preferred_locale,
  };
}

export function createSupabaseInterviewStore(): InterviewStore {
  const supabase = createSupabaseAdminClient();

  return {
    async findAssessmentForProfile(input) {
      const { data, error } = await supabase
        .from('paid_assessments')
        .select('id, customer_profile_id, status, preferred_locale')
        .eq('id', input.assessmentId)
        .eq('customer_profile_id', input.customerProfileId)
        .is('deleted_at', null)
        .maybeSingle();
      if (error) throw storeError('assessment lookup', error);
      if (!data) return null;
      return {
        id: data.id,
        customerProfileId: data.customer_profile_id,
        status: data.status,
        preferredLocale: data.preferred_locale,
      };
    },

    async countSessions(assessmentId) {
      const { count, error } = await supabase
        .from('interview_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('paid_assessment_id', assessmentId);
      if (error) throw storeError('session count', error);
      return count ?? 0;
    },

    async createSession(input) {
      const { data, error } = await supabase
        .from('interview_sessions')
        .insert({
          paid_assessment_id: input.paidAssessmentId,
          preferred_locale: input.preferredLocale,
          provider: 'retell',
          provider_mode: 'test',
          provider_agent_id: input.providerAgentId,
          status: 'created',
          attempt_number: input.attemptNumber,
          // §9.1: the consent state that authorized capture, recorded with
          // the session it authorizes.
          metadata: {
            consent_granted_at: input.consent.grantedAt,
            consent_policy_version: input.consent.policyVersion,
          },
        })
        .select('id, paid_assessment_id, status, attempt_number, preferred_locale')
        .single();
      if (error || !data) throw storeError('session insert', error);
      return toSession(data as SessionRow);
    },

    async attachCall(sessionId, providerCallId) {
      const { data: existing, error: readError } = await supabase
        .from('interview_sessions')
        .select('metadata')
        .eq('id', sessionId)
        .single();
      if (readError) throw storeError('session read', readError);
      const metadata = (existing?.metadata ?? {}) as Record<string, unknown>;
      const { error } = await supabase
        .from('interview_sessions')
        .update({ metadata: { ...metadata, provider_call_id: providerCallId } })
        .eq('id', sessionId);
      if (error) throw storeError('call attach', error);
    },

    async findSessionById(sessionId) {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('id, paid_assessment_id, status, attempt_number, preferred_locale')
        .eq('id', sessionId)
        .maybeSingle();
      if (error) throw storeError('session lookup', error);
      return data ? toSession(data as SessionRow) : null;
    },

    async updateSessionStatus(sessionId, status, timestamps) {
      const { error } = await supabase
        .from('interview_sessions')
        .update({
          status,
          ...(timestamps?.startedAt ? { started_at: timestamps.startedAt } : {}),
          ...(timestamps?.endedAt ? { ended_at: timestamps.endedAt } : {}),
        })
        .eq('id', sessionId);
      if (error) throw storeError('session status', error);
    },

    async updateAssessmentStatus(assessmentId, status) {
      const { error } = await supabase
        .from('paid_assessments')
        .update({ status })
        .eq('id', assessmentId);
      if (error) throw storeError('assessment status', error);
    },

    async recordCall(input) {
      const { data, error } = await supabase
        .from('call_records')
        .upsert(
          {
            interview_session_id: input.interviewSessionId,
            provider_call_id: input.providerCallId,
            status: input.status,
            started_at: input.startedAt,
            ended_at: input.endedAt,
          },
          { onConflict: 'provider_call_id' },
        )
        .select('id')
        .single();
      if (error || !data) throw storeError('call record', error);
      return data.id;
    },

    async recordTranscript(input) {
      const { error } = await supabase.from('transcripts').upsert(
        {
          call_record_id: input.callRecordId,
          preferred_locale: input.preferredLocale,
          transcript_text: input.transcriptText,
          transcript_segments: input.transcriptSegments,
          redaction_status: 'pending',
        },
        { onConflict: 'call_record_id' },
      );
      if (error) throw storeError('transcript', error);
    },

    async beginWebhookEvent(input): Promise<EventAdmission> {
      const { data: existing, error: lookupError } = await supabase
        .from('webhook_events')
        .select('id, processing_status, attempt_count')
        .eq('provider', 'retell')
        .eq('external_event_id', input.externalEventId)
        .maybeSingle();
      if (lookupError) throw storeError('event lookup', lookupError);

      if (!existing) {
        const { error } = await supabase.from('webhook_events').insert({
          provider: 'retell',
          external_event_id: input.externalEventId,
          event_type: input.eventType,
          signature_verified: true,
          payload_hash: input.payloadHash,
          sanitized_payload: input.sanitizedPayload,
          processing_status: 'processing',
          attempt_count: 1,
        });
        if (error) {
          if (error.code === '23505') return 'duplicate';
          throw storeError('event insert', error);
        }
        return 'new';
      }

      if (existing.processing_status === 'processed' || existing.processing_status === 'ignored') {
        return 'duplicate';
      }

      const { error } = await supabase
        .from('webhook_events')
        .update({
          processing_status: 'processing',
          attempt_count: Math.min((existing.attempt_count ?? 0) + 1, 20),
        })
        .eq('id', existing.id);
      if (error) throw storeError('event retry', error);
      return 'retry';
    },

    async finishWebhookEvent(externalEventId, outcome, errorCode) {
      const { error } = await supabase
        .from('webhook_events')
        .update({
          processing_status: outcome,
          error_code: errorCode ?? null,
          processed_at: outcome === 'processed' ? new Date().toISOString() : null,
        })
        .eq('provider', 'retell')
        .eq('external_event_id', externalEventId);
      if (error) throw storeError('event finish', error);
    },
  };
}
