import { z } from 'zod';

import type { AssessmentLocale } from '@/features/free-assessment/schema';
import { scoreBlockOrder } from '@/features/free-assessment/score';

export const ANALYSIS_CONTRACT_VERSION = 'business-analysis/1.0.0';

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
  roadmap: z.object({
    days1To30: z.array(z.string()),
    days31To60: z.array(z.string()),
    days61To90: z.array(z.string()),
  }),
});

export type AnalysisContent = z.infer<typeof analysisContentSchema>;
export type AnalysisFinding = AnalysisContent['findings'][number];
export type AnalysisRecommendation = AnalysisContent['recommendations'][number];

export const roadmapPhases = ['days1To30', 'days31To60', 'days61To90'] as const;
export type RoadmapPhase = (typeof roadmapPhases)[number];

export const analysisLimits = {
  findings: 6,
  recommendations: 8,
  roadmapItemsPerPhase: 6,
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

  const roadmap = {
    days1To30: cleanLines(content.roadmap.days1To30, analysisLimits.roadmapItemsPerPhase),
    days31To60: cleanLines(content.roadmap.days31To60, analysisLimits.roadmapItemsPerPhase),
    days61To90: cleanLines(content.roadmap.days61To90, analysisLimits.roadmapItemsPerPhase),
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
  if (roadmapPhases.every((phase) => roadmap[phase].length === 0)) {
    throw new AnalysisContractError('Analysis roadmap is empty in every phase.');
  }

  return { executiveSummary, findings, recommendations, roadmap };
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
