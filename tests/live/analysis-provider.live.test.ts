import { describe, expect, it } from 'vitest';

import {
  CLAUDE_ANALYSIS_MODEL,
  analyseWithClaude,
  analysisLimits,
  buildAnalysisInput,
  createStructuredAnalysisCall,
  sprintWeeks,
} from '@/features/analysis';
import type { AssessmentAnswers } from '@/features/free-assessment/schema';
import { scoreAssessment, scoreBlockOrder } from '@/features/free-assessment/score';

// A mid-sized field-services business with slow response, no CRM and broad
// manual work — the profile the paid assessment exists to serve.
const answers: AssessmentAnswers = {
  Q01: 'home_field_services',
  Q02: 'team_6_10',
  Q03: 'thirty_one_to_100',
  Q04: ['phone', 'email', 'website_form', 'social_direct_messages'],
  Q05: 'next_day_or_later',
  Q06: 'no_consistent_system',
  Q07: ['lead_intake', 'follow_up', 'scheduling', 'data_entry'],
  Q08: 'no_defined_follow_up',
  Q09: 'slow_lead_response',
  Q10: 'respond_faster',
  Q11: 'start_now',
};

const apiKey = process.env.ANTHROPIC_API_KEY;

describe.skipIf(!apiKey)('Claude analysis provider against the real API', () => {
  it.for(['en', 'es'] as const)('returns a contract-satisfying analysis in %s', async (locale) => {
    const input = buildAnalysisInput(locale, answers, scoreAssessment(answers));
    const analysis = await analyseWithClaude(input, createStructuredAnalysisCall(apiKey!));

    expect(analysis.providerId).toBe('claude');
    expect(analysis.model).toBe(CLAUDE_ANALYSIS_MODEL);
    expect(analysis.locale).toBe(locale);

    expect(analysis.content.executiveSummary.length).toBeGreaterThan(80);

    expect(analysis.content.findings.length).toBeGreaterThan(1);
    expect(analysis.content.findings.length).toBeLessThanOrEqual(analysisLimits.findings);
    for (const finding of analysis.content.findings) {
      expect(scoreBlockOrder).toContain(finding.area);
    }

    expect(analysis.content.recommendations.length).toBeGreaterThan(2);
    for (const recommendation of analysis.content.recommendations) {
      expect(['low', 'medium', 'high']).toContain(recommendation.impact);
      expect(['low', 'medium', 'high']).toContain(recommendation.effort);
      expect(recommendation.firstStep.length).toBeGreaterThan(20);
    }

    for (const week of sprintWeeks) {
      expect(analysis.content.sprint[week].length).toBeGreaterThan(0);
    }

    // The questionnaire never supplied revenue or currency, and the report
    // must not imply a financial return it cannot support.
    const prose = [
      analysis.content.executiveSummary,
      ...analysis.content.findings.map((finding) => finding.detail),
      ...analysis.content.recommendations.map((recommendation) => recommendation.rationale),
    ].join(' ');
    expect(prose).not.toMatch(/\$\s?\d/u);

    console.info(
      `[${locale}] ${analysis.content.findings.length} findings, ` +
        `${analysis.content.recommendations.length} recommendations, ` +
        `sprint ${sprintWeeks.map((week) => analysis.content.sprint[week].length).join('/')}`,
    );
    console.info(`[${locale}] summary: ${analysis.content.executiveSummary}`);
    console.info(
      `[${locale}] first recommendation: ${analysis.content.recommendations[0]?.title} ` +
        `(impact ${analysis.content.recommendations[0]?.impact}, effort ${analysis.content.recommendations[0]?.effort})`,
    );
  });
});
