import { analyseWithClaude, AnalysisProviderError, type StructuredAnalysisCall } from './claude';
import { analysisProviderIds, type AnalysisProviderId, type BusinessAnalysis } from './contract';
import { analyseDeterministically } from './deterministic';
import type { AnalysisInput } from './input';

export * from './contract';
export { buildAnalysisInput, type AnalysisInput } from './input';
export { analyseDeterministically } from './deterministic';
export {
  analyseWithClaude,
  AnalysisProviderError,
  CLAUDE_ANALYSIS_MODEL,
  createStructuredAnalysisCall,
  type StructuredAnalysisCall,
} from './claude';
export { ANALYSIS_SYSTEM_PROMPT, buildAnalysisPrompt } from './prompt';

type EnvironmentInput = Readonly<Record<string, string | undefined>>;

/**
 * Reads the analysis variables by their literal names.
 *
 * This indirection is not decoration. The bundler only preserves environment
 * variables it can see referenced literally, so reading them off a passed-in
 * `process.env` object silently yields `undefined` for any name that appears
 * nowhere else in the source. That is exactly what happened: a configured
 * `ANTHROPIC_API_KEY` was invisible at runtime while directly-referenced
 * variables in the same deployment resolved fine.
 */
export function analysisEnvironment(): EnvironmentInput {
  return {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    ANALYSIS_PROVIDER: process.env.ANALYSIS_PROVIDER,
  };
}

function isProviderId(value: string | undefined): value is AnalysisProviderId {
  return analysisProviderIds.includes(value as AnalysisProviderId);
}

/**
 * Claude is the analysis provider for this product. It is selected whenever a
 * credential exists, and `ANALYSIS_PROVIDER` only ever narrows that:
 *
 * - `ANALYSIS_PROVIDER=claude` demands Claude and fails loudly without a key,
 *   which is what a production environment should do.
 * - `ANALYSIS_PROVIDER=deterministic` pins the offline provider, for CI and for
 *   reproducing an analysis without spending tokens.
 * - Unset falls back to the deterministic provider only while no key is
 *   configured, so the feature is developable before the credential exists.
 */
export function resolveAnalysisProviderId(
  environment: EnvironmentInput = analysisEnvironment(),
): AnalysisProviderId {
  const configured = environment.ANALYSIS_PROVIDER?.trim();

  if (configured && configured.length > 0) {
    if (!isProviderId(configured)) {
      throw new AnalysisProviderError(
        `ANALYSIS_PROVIDER must be one of ${analysisProviderIds.join(', ')}.`,
      );
    }
    return configured;
  }

  return environment.ANTHROPIC_API_KEY ? 'claude' : 'deterministic';
}

export interface GenerateAnalysisOptions {
  readonly providerId: AnalysisProviderId;
  /** Required when `providerId` is `claude`. */
  readonly call?: StructuredAnalysisCall | undefined;
}

export async function generateAnalysis(
  input: AnalysisInput,
  options: GenerateAnalysisOptions,
): Promise<BusinessAnalysis> {
  if (options.providerId === 'deterministic') {
    return analyseDeterministically(input);
  }

  if (!options.call) {
    throw new AnalysisProviderError(
      'The Claude analysis provider was selected without a configured ANTHROPIC_API_KEY.',
    );
  }

  return analyseWithClaude(input, options.call);
}
