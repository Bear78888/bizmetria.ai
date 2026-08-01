import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/admin';

import {
  PaidAssessmentError,
  type ClaimableOrder,
  type PaidAssessmentStore,
  type PaidAssessmentSummary,
} from './claim';
import {
  PAID_ASSESSMENT_SCHEMA_VERSION,
  type QuestionnaireState,
  type QuestionnaireStore,
} from './questionnaire';

function storeError(step: string, cause: { code?: string; message?: string } | null) {
  // Postgres code and message only; `details`/`hint` can echo the row.
  const detail = cause ? ` (${cause.code ?? 'unknown'}: ${cause.message ?? 'no message'})` : '';
  return new PaidAssessmentError(
    'store_failure',
    `Paid assessment persistence failed at ${step}.${detail}`,
  );
}

interface AssessmentRow {
  readonly id: string;
  readonly order_id: string;
  readonly customer_profile_id: string;
  readonly status: string;
  readonly preferred_locale: string;
}

function toSummary(row: AssessmentRow): PaidAssessmentSummary {
  return {
    id: row.id,
    orderId: row.order_id,
    customerProfileId: row.customer_profile_id,
    status: row.status,
    preferredLocale: row.preferred_locale,
  };
}

// RLS allows the customer to read and update their own paid assessment, but
// creating one — and attaching the order to their profile — is a server
// decision made after the email check, so those writes go through the service
// role here rather than through any user-scoped client.
export function createSupabasePaidAssessmentStore(): PaidAssessmentStore {
  const supabase = createSupabaseAdminClient();

  return {
    async findOrderForClaim(checkoutSessionId): Promise<ClaimableOrder | null> {
      const { data, error } = await supabase
        .from('orders')
        .select('id, status, customer_profile_id, leads (email, preferred_locale)')
        .eq('stripe_checkout_session_id', checkoutSessionId)
        .is('deleted_at', null)
        .maybeSingle();
      if (error) throw storeError('order lookup', error);
      if (!data) return null;

      // orders.lead_id is a many-to-one relation, so at runtime the nested
      // select yields a single object (or null for an orphaned order) — but
      // the untyped client cannot know the cardinality and types it as an
      // array, so both shapes are accepted here.
      const rawLead = data.leads as unknown;
      const lead = (Array.isArray(rawLead) ? rawLead[0] : rawLead) as {
        email: string | null;
        preferred_locale: string | null;
      } | null;
      return {
        id: data.id,
        status: data.status,
        customerProfileId: data.customer_profile_id,
        leadEmail: lead?.email ?? null,
        leadLocale: lead?.preferred_locale ?? null,
      };
    },

    async attachOrderToProfile(orderId, profileId) {
      // The null filter makes this first-writer-wins: a second concurrent
      // claim matches zero rows instead of silently re-owning the order.
      const { error } = await supabase
        .from('orders')
        .update({ customer_profile_id: profileId })
        .eq('id', orderId)
        .eq('status', 'paid')
        .is('customer_profile_id', null);
      if (error) throw storeError('order attach', error);
    },

    async ensurePaidAssessment(input) {
      const { error: insertError } = await supabase.from('paid_assessments').upsert(
        {
          order_id: input.orderId,
          customer_profile_id: input.customerProfileId,
          preferred_locale: input.preferredLocale,
        },
        { onConflict: 'order_id', ignoreDuplicates: true },
      );
      if (insertError) throw storeError('assessment insert', insertError);

      const { data, error } = await supabase
        .from('paid_assessments')
        .select('id, order_id, customer_profile_id, status, preferred_locale')
        .eq('order_id', input.orderId)
        .is('deleted_at', null)
        .maybeSingle();
      if (error) throw storeError('assessment lookup', error);
      if (!data) throw storeError('assessment lookup', null);
      return toSummary(data as AssessmentRow);
    },
  };
}

export function createSupabaseQuestionnaireStore(): QuestionnaireStore {
  const supabase = createSupabaseAdminClient();

  return {
    async loadQuestionnaire(input): Promise<QuestionnaireState | null> {
      const { data, error } = await supabase
        .from('paid_assessments')
        .select('id, status, questionnaire_data, completion_state, preferred_locale')
        .eq('id', input.assessmentId)
        .eq('customer_profile_id', input.customerProfileId)
        .is('deleted_at', null)
        .maybeSingle();
      if (error) throw storeError('questionnaire load', error);
      if (!data) return null;

      const completion = (data.completion_state ?? {}) as { version?: unknown };
      const version = typeof completion.version === 'number' ? completion.version : 0;
      return {
        assessmentId: data.id,
        status: data.status,
        version,
        data: (data.questionnaire_data ?? {}) as Record<string, unknown>,
        preferredLocale: data.preferred_locale,
      };
    },

    async writeQuestionnaire(input): Promise<boolean> {
      let query = supabase
        .from('paid_assessments')
        .update({
          questionnaire_data: input.data,
          completion_state: {
            version: input.newVersion,
            schema_version: PAID_ASSESSMENT_SCHEMA_VERSION,
            ...(input.markSubmitted ? { submitted_version: input.newVersion } : {}),
          },
          status: input.status,
          ...(input.markStarted ? { started_at: new Date().toISOString() } : {}),
          ...(input.markSubmitted ? { submitted_at: new Date().toISOString() } : {}),
        })
        .eq('id', input.assessmentId)
        .eq('customer_profile_id', input.customerProfileId)
        .is('deleted_at', null);

      // Optimistic concurrency at the database, not just in the read: the
      // update only matches while the stored version is still the one the
      // caller read. A fresh row has no version key at all, which counts as 0.
      query =
        input.expectedVersion === 0
          ? query.or('completion_state->>version.is.null,completion_state->>version.eq.0')
          : query.eq('completion_state->>version', String(input.expectedVersion));

      const { data, error } = await query.select('id');
      if (error) throw storeError('questionnaire write', error);
      return (data ?? []).length > 0;
    },
  };
}
