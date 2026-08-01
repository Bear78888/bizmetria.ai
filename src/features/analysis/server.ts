import 'server-only';

import type { AssessmentAnswers, AssessmentLocale } from '@/features/free-assessment/schema';
import type { OpportunityScore } from '@/features/free-assessment/score';

import { AnalysisProviderError, createStructuredAnalysisCall } from './claude';
import type { BusinessAnalysis } from './contract';
import { analysisEnvironment, generateAnalysis, resolveAnalysisProviderId } from './index';
import { buildAnalysisInput } from './input';

/**
 * The server entry point for the paid assessment analysis.
 *
 * Only the questionnaire and its score reach the provider — `buildAnalysisInput`
 * carries no contact details, so submitted personal data never leaves this
 * application.
 */
export async function analyseSubmission(
  locale: AssessmentLocale,
  answers: AssessmentAnswers,
  score: OpportunityScore,
): Promise<BusinessAnalysis> {
  const providerId = resolveAnalysisProviderId(analysisEnvironment());
  const apiKey = analysisEnvironment().ANTHROPIC_API_KEY;

  if (providerId === 'claude' && !apiKey) {
    throw new AnalysisProviderError(
      'ANALYSIS_PROVIDER is set to claude but ANTHROPIC_API_KEY is not configured.',
    );
  }

  return generateAnalysis(buildAnalysisInput(locale, answers, score), {
    providerId,
    call: apiKey ? createStructuredAnalysisCall(apiKey) : undefined,
  });
}
