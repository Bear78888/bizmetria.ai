import 'server-only';

import { parseAnalysisContent, type AnalysisContent } from '@/features/analysis/contract';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

import type { ReportReviewStore, ReviewQueueEntry, ReviewableReport, ReviewerRole } from './review';

class ReportReviewStoreError extends Error {
  constructor(step: string, cause: { code?: string; message?: string } | null) {
    // Postgres code and message only; `details`/`hint` can echo the row.
    const detail = cause ? ` (${cause.code ?? 'unknown'}: ${cause.message ?? 'no message'})` : '';
    super(`Report review persistence failed at ${step}.${detail}`);
    this.name = 'ReportReviewStoreError';
  }
}

interface ReportRow {
  readonly id: string;
  readonly paid_assessment_id: string;
  readonly status: string;
  readonly preferred_locale: string;
  readonly report_data: unknown;
}

function toReviewable(row: ReportRow): ReviewableReport {
  return {
    id: row.id,
    assessmentId: row.paid_assessment_id,
    status: row.status,
    preferredLocale: row.preferred_locale,
    // The stored data was contract-validated at analysis time; validating
    // again here keeps a manually edited row from breaking the pages.
    reportData: parseAnalysisContent(row.report_data) as AnalysisContent,
  };
}

export function createSupabaseReportReviewStore(): ReportReviewStore {
  const supabase = createSupabaseAdminClient();

  return {
    async findReviewerRole(profileId): Promise<ReviewerRole | null> {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('role, is_active')
        .eq('profile_id', profileId)
        .eq('is_active', true)
        .in('role', ['admin', 'reviewer']);
      if (error) throw new ReportReviewStoreError('role lookup', error);
      const roles = (data ?? []).map((row) => row.role as ReviewerRole);
      return roles.includes('admin') ? 'admin' : (roles[0] ?? null);
    },

    async listReviewQueue(): Promise<readonly ReviewQueueEntry[]> {
      const { data, error } = await supabase
        .from('paid_assessments')
        .select(
          'id, status, preferred_locale, analysis_runs (id, status, completed_at), reports (id, status, created_at)',
        )
        .in('status', ['analysis_pending', 'under_review'])
        .is('deleted_at', null)
        .order('updated_at', { ascending: true });
      if (error) throw new ReportReviewStoreError('queue listing', error);

      return (data ?? []).map((row) => {
        const runs = (row.analysis_runs ?? []) as {
          status: string;
          completed_at: string | null;
        }[];
        const succeeded = runs
          .filter((run) => run.status === 'succeeded')
          .sort((a, b) => (b.completed_at ?? '').localeCompare(a.completed_at ?? ''));
        const reports = (
          (row.reports ?? []) as { id: string; status: string; created_at: string }[]
        )
          .filter((report) => report.status !== 'SUPERSEDED')
          .sort((a, b) => b.created_at.localeCompare(a.created_at));
        return {
          assessmentId: row.id,
          assessmentStatus: row.status,
          preferredLocale: row.preferred_locale,
          reportId: reports[0]?.id ?? null,
          reportStatus: reports[0]?.status ?? null,
          analysisCompletedAt: succeeded[0]?.completed_at ?? null,
        };
      });
    },

    async ensureReport(assessmentId): Promise<ReviewableReport | null> {
      const { data: existing, error: existingError } = await supabase
        .from('reports')
        .select('id, paid_assessment_id, status, preferred_locale, report_data')
        .eq('paid_assessment_id', assessmentId)
        .neq('status', 'SUPERSEDED')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (existingError) throw new ReportReviewStoreError('report lookup', existingError);
      if (existing) return toReviewable(existing as ReportRow);

      const { data: run, error: runError } = await supabase
        .from('analysis_runs')
        .select('id, structured_output, paid_assessments!inner (preferred_locale)')
        .eq('paid_assessment_id', assessmentId)
        .eq('status', 'succeeded')
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (runError) throw new ReportReviewStoreError('run lookup', runError);
      if (!run || !run.structured_output) return null;

      const assessment = run.paid_assessments as unknown as { preferred_locale: string };
      const { data: created, error: createError } = await supabase
        .from('reports')
        .insert({
          paid_assessment_id: assessmentId,
          analysis_run_id: run.id,
          preferred_locale: assessment.preferred_locale,
          status: 'NEEDS_REVIEW',
          report_data: run.structured_output,
        })
        .select('id, paid_assessment_id, status, preferred_locale, report_data')
        .single();
      if (createError || !created) throw new ReportReviewStoreError('report insert', createError);
      return toReviewable(created as ReportRow);
    },

    async findReportById(reportId): Promise<ReviewableReport | null> {
      const { data, error } = await supabase
        .from('reports')
        .select('id, paid_assessment_id, status, preferred_locale, report_data')
        .eq('id', reportId)
        .is('deleted_at', null)
        .maybeSingle();
      if (error) throw new ReportReviewStoreError('report lookup', error);
      return data ? toReviewable(data as ReportRow) : null;
    },

    async approveReport(input) {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('reports')
        .update({
          status: 'DELIVERED',
          approved_by: input.reviewerProfileId,
          approved_at: now,
          delivered_at: now,
        })
        .eq('id', input.reportId);
      if (error) throw new ReportReviewStoreError('report approve', error);

      const { error: reviewError } = await supabase.from('report_reviews').insert({
        report_id: input.reportId,
        reviewer_profile_id: input.reviewerProfileId,
        action: 'approved',
      });
      if (reviewError) throw new ReportReviewStoreError('review record', reviewError);
    },

    async requestChanges(input) {
      const { error } = await supabase
        .from('reports')
        .update({ status: 'CHANGES_REQUESTED' })
        .eq('id', input.reportId);
      if (error) throw new ReportReviewStoreError('report changes', error);

      const { error: reviewError } = await supabase.from('report_reviews').insert({
        report_id: input.reportId,
        reviewer_profile_id: input.reviewerProfileId,
        action: 'changes_requested',
        notes: input.notes,
      });
      if (reviewError) throw new ReportReviewStoreError('review record', reviewError);
    },

    async updateAssessmentStatus(assessmentId, status) {
      const { error } = await supabase
        .from('paid_assessments')
        .update({ status })
        .eq('id', assessmentId);
      if (error) throw new ReportReviewStoreError('assessment status', error);
    },
  };
}
