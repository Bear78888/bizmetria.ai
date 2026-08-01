/**
 * Running the paid analysis (PS-004): questionnaire + transcript → draft
 * analysis for human review.
 *
 * Pure orchestration over a store interface. One successful run per
 * assessment: a repeat request is a no-op, and a run already in flight is
 * reported rather than raced. Success moves the assessment to `under_review`
 * — never to `completed`, because PS-004 requires a human reviewer between
 * the model and the customer.
 */

import { parseAnalysisContent, type AnalysisContent } from '@/features/analysis/contract';
import { AnalysisProviderError, type StructuredAnalysisCall } from '@/features/analysis/claude';
import { CLAUDE_ANALYSIS_MODEL } from '@/features/analysis/claude';

import { buildPaidAnalysisInput, describeInputEvidence } from './input';
import {
  PAID_ANALYSIS_PROMPT_VERSION,
  PAID_ANALYSIS_SYSTEM_PROMPT,
  buildPaidAnalysisPrompt,
} from './prompt';

export const MAX_ANALYSIS_ATTEMPTS = 5;

export interface AnalysableAssessment {
  readonly id: string;
  readonly customerProfileId: string;
  readonly status: string;
  readonly preferredLocale: string;
  readonly questionnaireData: Readonly<Record<string, unknown>>;
}

export interface AnalysableTranscript {
  readonly id: string;
  readonly transcriptText: string;
}

export interface AnalysisRunRecord {
  readonly id: string;
  readonly status: string;
  readonly attemptNumber: number;
}

export interface PaidAnalysisStore {
  findAssessmentForProfile(input: {
    readonly assessmentId: string;
    readonly customerProfileId: string;
  }): Promise<AnalysableAssessment | null>;

  /** Latest transcript across the assessment's interview sessions, or null. */
  findLatestTranscript(assessmentId: string): Promise<AnalysableTranscript | null>;

  /** All runs for the assessment, newest first. */
  listRuns(assessmentId: string): Promise<readonly AnalysisRunRecord[]>;

  createRun(input: {
    readonly assessmentId: string;
    readonly transcriptId: string;
    readonly attemptNumber: number;
    readonly promptVersion: string;
    readonly modelVersion: string;
    readonly inputEvidence: readonly Record<string, unknown>[];
  }): Promise<string>;

  finishRun(
    runId: string,
    outcome:
      | { readonly status: 'succeeded'; readonly structuredOutput: AnalysisContent }
      | { readonly status: 'failed'; readonly errorCode: string },
  ): Promise<void>;

  updateAssessmentStatus(assessmentId: string, status: string): Promise<void>;
}

export type RunRejection =
  | 'not_found'
  | 'interview_incomplete'
  | 'transcript_missing'
  | 'already_succeeded'
  | 'run_in_progress'
  | 'attempts_exhausted';

export type RunOutcome =
  | { readonly ran: true; readonly runId: string; readonly status: 'succeeded' }
  | { readonly ran: false; readonly reason: RunRejection }
  | {
      readonly ran: true;
      readonly runId: string;
      readonly status: 'failed';
      readonly errorCode: string;
    };

const ANALYSABLE_STATUSES = new Set(['interview_complete', 'analysis_pending']);

export async function runPaidAnalysis(
  store: PaidAnalysisStore,
  call: StructuredAnalysisCall,
  input: { readonly assessmentId: string; readonly customerProfileId: string },
): Promise<RunOutcome> {
  const assessment = await store.findAssessmentForProfile(input);
  if (!assessment) return { ran: false, reason: 'not_found' };
  if (!ANALYSABLE_STATUSES.has(assessment.status)) {
    return { ran: false, reason: 'interview_incomplete' };
  }

  const runs = await store.listRuns(assessment.id);
  if (runs.some((run) => run.status === 'succeeded')) {
    return { ran: false, reason: 'already_succeeded' };
  }
  if (runs.some((run) => run.status === 'queued' || run.status === 'running')) {
    return { ran: false, reason: 'run_in_progress' };
  }
  if (runs.length >= MAX_ANALYSIS_ATTEMPTS) {
    return { ran: false, reason: 'attempts_exhausted' };
  }

  const transcript = await store.findLatestTranscript(assessment.id);
  if (!transcript || transcript.transcriptText.trim().length === 0) {
    return { ran: false, reason: 'transcript_missing' };
  }

  const analysisInput = buildPaidAnalysisInput({
    locale: assessment.preferredLocale,
    questionnaireData: assessment.questionnaireData,
    transcriptText: transcript.transcriptText,
  });

  const runId = await store.createRun({
    assessmentId: assessment.id,
    transcriptId: transcript.id,
    attemptNumber: runs.length + 1,
    promptVersion: PAID_ANALYSIS_PROMPT_VERSION,
    modelVersion: CLAUDE_ANALYSIS_MODEL,
    inputEvidence: describeInputEvidence(analysisInput, transcript.id),
  });
  await store.updateAssessmentStatus(assessment.id, 'analysis_pending');

  try {
    const raw = await call({
      system: PAID_ANALYSIS_SYSTEM_PROMPT,
      prompt: buildPaidAnalysisPrompt(analysisInput),
    });
    if (raw === null || raw === undefined) {
      throw new AnalysisProviderError('The model returned no structured output.');
    }
    const content = parseAnalysisContent(raw);

    await store.finishRun(runId, { status: 'succeeded', structuredOutput: content });
    // Human review is mandatory between the model and the customer (PS-004),
    // so success parks the assessment at under_review, never completed.
    await store.updateAssessmentStatus(assessment.id, 'under_review');
    return { ran: true, runId, status: 'succeeded' };
  } catch (error) {
    const errorCode =
      error instanceof AnalysisProviderError ? 'provider_failure' : 'contract_failure';
    await store.finishRun(runId, { status: 'failed', errorCode }).catch(() => undefined);
    return { ran: true, runId, status: 'failed', errorCode };
  }
}
