/**
 * Human review of the drafted analysis (PS-004).
 *
 * The reviewer stands between the model and the customer: a report becomes
 * customer-visible only through an explicit approval recorded here, and
 * row-level security enforces the same boundary independently (owners can
 * select only APPROVED/DELIVERED reports). Every decision leaves a
 * report_reviews row, so the review trail survives the people involved.
 */

import type { AnalysisContent } from '@/features/analysis/contract';

export type ReviewerRole = 'admin' | 'reviewer';

export interface ReviewQueueEntry {
  readonly assessmentId: string;
  readonly assessmentStatus: string;
  readonly preferredLocale: string;
  readonly reportId: string | null;
  readonly reportStatus: string | null;
  readonly analysisCompletedAt: string | null;
}

export interface ReviewableReport {
  readonly id: string;
  readonly assessmentId: string;
  readonly status: string;
  readonly preferredLocale: string;
  readonly reportData: AnalysisContent;
}

export interface ReportReviewStore {
  /** Role of the profile, or null when the profile has no active role. */
  findReviewerRole(profileId: string): Promise<ReviewerRole | null>;

  /** Assessments whose analysis awaits review, plus their report state. */
  listReviewQueue(): Promise<readonly ReviewQueueEntry[]>;

  /**
   * Ensures a report row exists for the assessment's latest succeeded
   * analysis run. Idempotent: an existing non-superseded report is returned
   * unchanged. Returns null when no succeeded run exists yet.
   */
  ensureReport(assessmentId: string): Promise<ReviewableReport | null>;

  findReportById(reportId: string): Promise<ReviewableReport | null>;

  approveReport(input: {
    readonly reportId: string;
    readonly reviewerProfileId: string;
  }): Promise<void>;

  requestChanges(input: {
    readonly reportId: string;
    readonly reviewerProfileId: string;
    readonly notes: string;
  }): Promise<void>;

  updateAssessmentStatus(assessmentId: string, status: string): Promise<void>;
}

export type ReviewDecisionRejection = 'not_authorized' | 'report_not_found' | 'not_reviewable';

const REVIEWABLE_STATUSES = new Set(['NEEDS_REVIEW', 'CHANGES_REQUESTED', 'AI_GENERATED', 'DRAFT']);

/**
 * Approves a report: it becomes DELIVERED (visible to the customer under the
 * owner-select policy) and the assessment completes.
 */
export async function approveReport(
  store: ReportReviewStore,
  input: { readonly reportId: string; readonly reviewerProfileId: string },
): Promise<ReviewDecisionRejection | null> {
  const role = await store.findReviewerRole(input.reviewerProfileId);
  if (!role) return 'not_authorized';

  const report = await store.findReportById(input.reportId);
  if (!report) return 'report_not_found';
  if (!REVIEWABLE_STATUSES.has(report.status)) return 'not_reviewable';

  await store.approveReport(input);
  await store.updateAssessmentStatus(report.assessmentId, 'completed');
  return null;
}

export async function requestChanges(
  store: ReportReviewStore,
  input: {
    readonly reportId: string;
    readonly reviewerProfileId: string;
    readonly notes: string;
  },
): Promise<ReviewDecisionRejection | null> {
  const role = await store.findReviewerRole(input.reviewerProfileId);
  if (!role) return 'not_authorized';

  const report = await store.findReportById(input.reportId);
  if (!report) return 'report_not_found';
  if (!REVIEWABLE_STATUSES.has(report.status)) return 'not_reviewable';

  await store.requestChanges(input);
  // The assessment stays under_review: the queue keeps showing it until a
  // corrected report is approved.
  return null;
}
