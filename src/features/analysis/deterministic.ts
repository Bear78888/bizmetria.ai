import { resultContent } from '@/features/free-assessment/content';
import {
  blockMaximums,
  scoreBlockOrder,
  type ScoreBlockId,
} from '@/features/free-assessment/score';

import {
  ANALYSIS_CONTRACT_VERSION,
  normalizeAnalysisContent,
  type AnalysisContent,
  type BusinessAnalysis,
} from './contract';
import { blockCopy, summaryCopy, type Severity } from './deterministic-copy';
import type { AnalysisInput } from './input';

const HIGH_SEVERITY_THRESHOLD = 0.6;

/**
 * Orders every scoring block that contributed to the total: the algorithm's own
 * top areas first, then the remaining contributing blocks in canonical order.
 */
function contributingBlocks(input: AnalysisInput): readonly ScoreBlockId[] {
  const leading = input.opportunityAreas.filter((area) => input.score.blocks[area] > 0);
  const rest = scoreBlockOrder.filter(
    (block) => input.score.blocks[block] > 0 && !leading.includes(block),
  );
  return [...leading, ...rest];
}

function severityFor(input: AnalysisInput, block: ScoreBlockId): Severity {
  return input.score.blocks[block] / blockMaximums[block] >= HIGH_SEVERITY_THRESHOLD
    ? 'high'
    : 'moderate';
}

function executiveSummary(input: AnalysisInput, blocks: readonly ScoreBlockId[]): string {
  const copy = summaryCopy[input.locale];
  const labels = resultContent[input.locale].areaLabels;
  const named = blocks.slice(0, 3).map((block) => labels[block]);

  const areasSentence = named.length > 0 ? `${copy.areasLead}: ${named.join(', ')}.` : copy.noAreas;

  return [
    copy.lead(input.score.total),
    copy.band[input.score.band],
    areasSentence,
    copy.close,
  ].join(' ');
}

function buildContent(input: AnalysisInput): AnalysisContent {
  const copy = blockCopy[input.locale];
  const blocks = contributingBlocks(input);
  const sprintBlocks = blocks.slice(0, 3);

  return normalizeAnalysisContent({
    executiveSummary: executiveSummary(input, blocks),
    findings: blocks.map((block) => ({
      area: block,
      title: copy[block].findingTitle,
      detail: copy[block].finding[severityFor(input, block)],
    })),
    recommendations: blocks.map((block) => ({
      title: copy[block].recommendationTitle,
      rationale: copy[block].rationale,
      impact: copy[block].impact,
      effort: copy[block].effort,
      firstStep: copy[block].firstStep,
    })),
    // The 30-day sprint sequences the same steps by dependency: set up first,
    // then automate, then extend — closing on verification and handover.
    sprint: {
      week1: sprintBlocks.map((block) => copy[block].roadmap[0]),
      week2: sprintBlocks.map((block) => copy[block].roadmap[1]),
      week3: sprintBlocks.map((block) => copy[block].roadmap[2]),
      week4: [summaryCopy[input.locale].sprintClose],
    },
  });
}

/**
 * Produces an analysis from the score alone, with no model call and no network
 * access. Two roles: it is the provider used when no Anthropic credential is
 * configured, and it is the reference implementation the contract tests hold
 * the Claude provider to.
 *
 * Output is a pure function of the input, so the same submission always yields
 * the same analysis.
 */
export function analyseDeterministically(input: AnalysisInput): BusinessAnalysis {
  return {
    contractVersion: ANALYSIS_CONTRACT_VERSION,
    providerId: 'deterministic',
    model: null,
    locale: input.locale,
    content: buildContent(input),
  };
}
