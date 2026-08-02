import { z } from 'zod';

import type { AssessmentLocale } from '@/features/free-assessment/schema';
import { scoreBlockOrder } from '@/features/free-assessment/score';

// 2.0.0: the 30/60/90-day roadmap became the 30-day implementation sprint
// (DEC-032) — four weeks of sequenced work, promising order of execution,
// never outcomes.
export const ANALYSIS_CONTRACT_VERSION = 'business-analysis/2.0.0';

export const analysisProviderIds = ['claude', 'deterministic'] as const;
export type AnalysisProviderId = (typeof analysisProviderIds)[number];

export const impactEffortLevels = ['low', 'medium', 'high'] as const;
export type ImpactEffortLevel = (typeof impactEffortLevels)[number];

// The shape the analysis provider is asked to return.
//
// Deliberately free of length bounds and optional members. Structured outputs
// constrain the model to this schema, and every constraint expressed here is
// one the model can fail to satisfy — a run that produces four findings instead
// of five is a usable analysis, not a failed request. Counts are trimmed to
// product limits afterwards by `normalizeAnalysisContent`.
export const analysisContentSchema = z.object({
  executiveSummary: z.string(),
  findings: z.array(
    z.object({
      area: z.enum(scoreBlockOrder),
      title: z.string(),
      detail: z.string(),
    }),
  ),
  recommendations: z.array(
    z.object({
      title: z.string(),
      rationale: z.string(),
      impact: z.enum(impactEffortLevels),
      effort: z.enum(impactEffortLevels),
      firstStep: z.string(),
    }),
  ),
  sprint: z.object({
    week1: z.array(z.string()),
    week2: z.array(z.string()),
    week3: z.array(z.string()),
    week4: z.array(z.string()),
  }),
});

export type AnalysisContent = z.infer<typeof analysisContentSchema>;
export type AnalysisFinding = AnalysisContent['findings'][number];
export type AnalysisRecommendation = AnalysisContent['recommendations'][number];

export const sprintWeeks = ['week1', 'week2', 'week3', 'week4'] as const;
export type SprintWeek = (typeof sprintWeeks)[number];

export const analysisLimits = {
  findings: 6,
  recommendations: 8,
  sprintItemsPerWeek: 5,
} as const;

export interface BusinessAnalysis {
  readonly contractVersion: typeof ANALYSIS_CONTRACT_VERSION;
  readonly providerId: AnalysisProviderId;
  /** The provider's model identifier, or null for providers that use no model. */
  readonly model: string | null;
  readonly locale: AssessmentLocale;
  readonly content: AnalysisContent;
}

export class AnalysisContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnalysisContractError';
  }
}

function cleanLines(values: readonly string[], limit: number): string[] {
  return values
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .slice(0, limit);
}

/**
 * Brings provider output onto the product contract: whitespace is normalised,
 * empty entries are dropped, and each collection is capped at the number of
 * items the report renders. Throws when nothing usable survives, so a
 * degenerate response fails here rather than reaching a paying customer.
 */
export function normalizeAnalysisContent(content: AnalysisContent): AnalysisContent {
  const executiveSummary = content.executiveSummary.trim();

  const findings = content.findings
    .map((finding) => ({
      area: finding.area,
      title: finding.title.trim(),
      detail: finding.detail.trim(),
    }))
    .filter((finding) => finding.title.length > 0 && finding.detail.length > 0)
    .slice(0, analysisLimits.findings);

  const recommendations = content.recommendations
    .map((recommendation) => ({
      title: recommendation.title.trim(),
      rationale: recommendation.rationale.trim(),
      impact: recommendation.impact,
      effort: recommendation.effort,
      firstStep: recommendation.firstStep.trim(),
    }))
    .filter(
      (recommendation) =>
        recommendation.title.length > 0 &&
        recommendation.rationale.length > 0 &&
        recommendation.firstStep.length > 0,
    )
    .slice(0, analysisLimits.recommendations);

  const sprint = {
    week1: cleanLines(content.sprint.week1, analysisLimits.sprintItemsPerWeek),
    week2: cleanLines(content.sprint.week2, analysisLimits.sprintItemsPerWeek),
    week3: cleanLines(content.sprint.week3, analysisLimits.sprintItemsPerWeek),
    week4: cleanLines(content.sprint.week4, analysisLimits.sprintItemsPerWeek),
  };

  if (executiveSummary.length === 0) {
    throw new AnalysisContractError('Analysis is missing an executive summary.');
  }
  if (findings.length === 0) {
    throw new AnalysisContractError('Analysis contains no usable findings.');
  }
  if (recommendations.length === 0) {
    throw new AnalysisContractError('Analysis contains no usable recommendations.');
  }
  if (sprintWeeks.every((week) => sprint[week].length === 0)) {
    throw new AnalysisContractError('Analysis sprint plan is empty in every week.');
  }

  return { executiveSummary, findings, recommendations, sprint };
}

/**
 * Validates and normalises an untyped provider response. Parse failures carry
 * only the offending field paths — never the response body, which is derived
 * from submitted answers.
 */
export function parseAnalysisContent(candidate: unknown): AnalysisContent {
  const parsed = analysisContentSchema.safeParse(candidate);

  if (!parsed.success) {
    const fields = [
      ...new Set(parsed.error.issues.map((issue) => issue.path.join('.')).filter(Boolean)),
    ].sort();
    throw new AnalysisContractError(
      `Analysis response did not match ${ANALYSIS_CONTRACT_VERSION}: ${fields.join(', ') || 'unknown field'}`,
    );
  }

  return normalizeAnalysisContent(parsed.data);
}
