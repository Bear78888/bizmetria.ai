import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';

import {
  ANALYSIS_CONTRACT_VERSION,
  analysisContentSchema,
  parseAnalysisContent,
  type BusinessAnalysis,
} from './contract';
import type { AnalysisInput } from './input';
import { ANALYSIS_SYSTEM_PROMPT, buildAnalysisPrompt } from './prompt';

export const CLAUDE_ANALYSIS_MODEL = 'claude-opus-5';

const MAX_OUTPUT_TOKENS = 16000;

/**
 * The single call the Claude provider makes, isolated so tests can supply a
 * recorded response instead of reaching the network.
 */
export type StructuredAnalysisCall = (request: {
  readonly system: string;
  readonly prompt: string;
}) => Promise<unknown>;

export class AnalysisProviderError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'AnalysisProviderError';
  }
}

function describeApiError(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) {
    return 'ANTHROPIC_API_KEY was rejected.';
  }
  if (error instanceof Anthropic.RateLimitError) {
    return 'The Anthropic API rate limit was reached.';
  }
  if (error instanceof Anthropic.APIError) {
    return `The Anthropic API returned status ${error.status ?? 'unknown'}.`;
  }
  return 'The Anthropic API call failed.';
}

export function createStructuredAnalysisCall(apiKey: string): StructuredAnalysisCall {
  const client = new Anthropic({ apiKey });

  return async ({ system, prompt }) => {
    const response = await client.messages.parse({
      model: CLAUDE_ANALYSIS_MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      thinking: { type: 'adaptive' },
      output_config: {
        effort: 'high',
        format: zodOutputFormat(analysisContentSchema),
      },
      // Constant across requests, so the prefix stays cacheable.
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: prompt }],
    });

    if (response.stop_reason === 'refusal') {
      throw new AnalysisProviderError('The analysis request was declined by the model.');
    }

    return response.parsed_output;
  };
}

/**
 * Generates the assessment analysis with Claude.
 *
 * Failures are never papered over with a substituted result: a caller that
 * wants the deterministic analysis instead must ask for it explicitly, because
 * silently downgrading a paid report would be invisible to both the customer
 * and the operator.
 */
export async function analyseWithClaude(
  input: AnalysisInput,
  call: StructuredAnalysisCall,
): Promise<BusinessAnalysis> {
  let raw: unknown;

  try {
    raw = await call({
      system: ANALYSIS_SYSTEM_PROMPT,
      prompt: buildAnalysisPrompt(input),
    });
  } catch (error) {
    if (error instanceof AnalysisProviderError) throw error;
    throw new AnalysisProviderError(describeApiError(error), { cause: error });
  }

  if (raw === null || raw === undefined) {
    throw new AnalysisProviderError(
      `The model returned no output matching ${ANALYSIS_CONTRACT_VERSION}.`,
    );
  }

  return {
    contractVersion: ANALYSIS_CONTRACT_VERSION,
    providerId: 'claude',
    model: CLAUDE_ANALYSIS_MODEL,
    locale: input.locale,
    content: parseAnalysisContent(raw),
  };
}
