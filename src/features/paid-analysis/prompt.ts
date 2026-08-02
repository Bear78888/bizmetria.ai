/**
 * Prompting for the paid assessment analysis (PS-004).
 *
 * The draft produced here is reviewer-facing, not customer-facing: PS-004
 * requires human review before anything reaches the customer, so the model is
 * instructed as an analyst preparing material for that review. Evidence
 * boundaries are the contract's: customer-asserted facts stay assertions,
 * unknowns stay unknown, and nothing may be promised or invented.
 */

import type { PaidAnalysisInput } from './input';

// 2.0.0: the 30/60/90-day roadmap became the 30-day implementation sprint
// (DEC-032).
export const PAID_ANALYSIS_PROMPT_VERSION = 'paid-analysis-prompt/2.0.0';

export const PAID_ANALYSIS_SYSTEM_PROMPT = `You are a senior business operations analyst at BizMetria preparing the draft analysis of a paid business assessment. Your draft goes to a human reviewer before the customer ever sees it.

Your evidence is exactly two artifacts: the customer's structured questionnaire and the transcript of their assessment interview. Rules that are never violated:

- Every finding and recommendation must be traceable to the questionnaire or the transcript. If the evidence does not support a claim, do not make it.
- Values the customer marked as estimated or unknown stay that way. Never invent numbers, baselines, savings, percentages, or ROI figures.
- Do not promise outcomes, timelines as guarantees, or specific vendor products. Recommendations describe capability categories and first steps, not purchases.
- Where the questionnaire and the interview contradict each other, surface the contradiction explicitly in a finding instead of silently choosing a side.
- Respect stated constraints (budget, tools, regulation, capacity): a recommendation that conflicts with a stated constraint is wrong even if generically sensible.
- The customer may have shared sensitive details in conversation; never repeat credentials, personal identifiers, or customer-of-customer specifics in your output. Refer to them only at category level.
- Write the entire output in the language requested. Keep it specific to this business — no generic filler.`;

function formatQuestionnaire(entries: readonly { field: string; value: unknown }[]): string {
  return entries.map((entry) => `${entry.field}: ${JSON.stringify(entry.value)}`).join('\n');
}

export function buildPaidAnalysisPrompt(input: PaidAnalysisInput): string {
  const language = input.locale === 'es' ? 'Spanish' : 'English';

  return [
    `Write the draft analysis in ${language}.`,
    '',
    'QUESTIONNAIRE (canonical field ids and the customer’s answers):',
    formatQuestionnaire(input.questionnaire),
    '',
    'INTERVIEW TRANSCRIPT:',
    input.transcript,
    '',
    'Produce the draft analysis now: an executive summary grounded in this specific business, findings tied to the assessment areas, prioritized recommendations with impact and effort, and a 30-day implementation sprint — four weeks of concrete steps in dependency order (set up before automate, automate before extend; week 4 is verification against baselines and handover). The sprint commits to a sequence of work, never to outcomes, and every step must respect the stated capacity and constraints.',
  ].join('\n');
}
