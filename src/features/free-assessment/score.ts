import type { AssessmentAnswers } from './schema';

export const SCORE_ALGORITHM_VERSION = 'ai-opportunity-score/1.0.0';

export const scoreBlockOrder = [
  'lead_response_follow_up',
  'manual_work',
  'systems_data',
  'strategic_priority_urgency',
  'opportunity_breadth',
] as const;

export type ScoreBlockId = (typeof scoreBlockOrder)[number];
export type ScoreBand = 'FOCUSED' | 'MODERATE' | 'STRONG' | 'HIGH' | 'VERY_HIGH';

export interface OpportunityArea {
  readonly id: ScoreBlockId;
  readonly score: number;
  readonly maxScore: number;
  readonly normalizedScore: number;
}

export interface OpportunityScore {
  readonly algorithmVersion: typeof SCORE_ALGORITHM_VERSION;
  readonly leadResponseFollowUp: number;
  readonly manualWork: number;
  readonly systemsData: number;
  readonly strategicPriorityUrgency: number;
  readonly opportunityBreadth: number;
  readonly totalScore: number;
  readonly scoreBand: ScoreBand;
  readonly opportunityAreas: readonly OpportunityArea[];
}

const firstResponseScores: Record<AssessmentAnswers['Q05'], number> = {
  within_5_minutes: 0,
  six_to_15_minutes: 3,
  sixteen_to_60_minutes: 6,
  one_to_4_hours: 10,
  same_day: 13,
  next_day_or_later: 16,
};

const followUpScores: Record<AssessmentAnswers['Q08'], number> = {
  automated_multi_step_follow_up: 0,
  consistent_manual_follow_up: 4,
  occasional_follow_up: 8,
  no_defined_follow_up: 14,
};

const systemsScores: Record<AssessmentAnswers['Q06'], number> = {
  integrated_crm: 0,
  basic_or_partially_used_crm: 5,
  spreadsheet_or_project_tool: 10,
  inbox_notes_or_multiple_places: 15,
  no_consistent_system: 20,
};

const urgencyScores: Record<AssessmentAnswers['Q11'], number> = {
  just_exploring: 0,
  within_6_to_12_months: 4,
  within_3_to_6_months: 8,
  within_1_to_3_months: 12,
  start_now: 15,
};

const blockMaximums: Record<ScoreBlockId, number> = {
  lead_response_follow_up: 30,
  manual_work: 25,
  systems_data: 20,
  strategic_priority_urgency: 15,
  opportunity_breadth: 10,
};

function scoreManualWork(answers: AssessmentAnswers): number {
  const count = answers.Q07.filter((answer) => answer !== 'none').length;
  if (count === 0) return 0;
  if (count === 1) return 6;
  if (count === 2) return 12;
  if (count === 3) return 18;
  return 25;
}

function scoreOpportunityBreadth(answers: AssessmentAnswers): number {
  const domains = new Set<string>();

  if (answers.Q04.length >= 3) domains.add('channel_coordination');
  if (
    ['sixteen_to_60_minutes', 'one_to_4_hours', 'same_day', 'next_day_or_later'].includes(
      answers.Q05,
    )
  ) {
    domains.add('lead_response');
  }
  if (
    [
      'spreadsheet_or_project_tool',
      'inbox_notes_or_multiple_places',
      'no_consistent_system',
    ].includes(answers.Q06)
  ) {
    domains.add('systems_data');
  }
  if (answers.Q07.some((answer) => answer !== 'none')) domains.add('manual_operations');
  if (['occasional_follow_up', 'no_defined_follow_up'].includes(answers.Q08)) {
    domains.add('follow_up');
  }

  const problemDomains: Partial<Record<AssessmentAnswers['Q09'], string>> = {
    slow_lead_response: 'lead_response',
    lost_or_untracked_leads: 'systems_data',
    too_much_manual_work: 'manual_operations',
    inconsistent_follow_up: 'follow_up',
    disconnected_systems: 'systems_data',
    limited_visibility_or_reporting: 'reporting_visibility',
    customer_service_capacity: 'service_capacity',
    marketing_or_sales_consistency: 'marketing_sales',
  };
  const problemDomain = problemDomains[answers.Q09];
  if (problemDomain) domains.add(problemDomain);

  const outcomeDomains: Partial<Record<AssessmentAnswers['Q10'], string>> = {
    respond_faster: 'lead_response',
    convert_more_existing_leads: 'follow_up',
    reduce_manual_work: 'manual_operations',
    improve_customer_experience: 'customer_experience',
    organize_data_and_systems: 'systems_data',
    improve_reporting: 'reporting_visibility',
    scale_without_equivalent_hiring: 'scaling_capacity',
    identify_best_ai_priorities: 'ai_prioritization',
  };
  const outcomeDomain = outcomeDomains[answers.Q10];
  if (outcomeDomain) domains.add(outcomeDomain);

  return Math.min(domains.size * 2, 10);
}

export function bandForScore(score: number): ScoreBand {
  if (score <= 24) return 'FOCUSED';
  if (score <= 44) return 'MODERATE';
  if (score <= 64) return 'STRONG';
  if (score <= 79) return 'HIGH';
  return 'VERY_HIGH';
}

export function scoreAssessment(answers: AssessmentAnswers): OpportunityScore {
  const scores: Record<ScoreBlockId, number> = {
    lead_response_follow_up: firstResponseScores[answers.Q05] + followUpScores[answers.Q08],
    manual_work: scoreManualWork(answers),
    systems_data: systemsScores[answers.Q06],
    strategic_priority_urgency: urgencyScores[answers.Q11],
    opportunity_breadth: scoreOpportunityBreadth(answers),
  };

  const totalScore = scoreBlockOrder.reduce((total, block) => total + scores[block], 0);
  const opportunityAreas = scoreBlockOrder
    .filter((block) => scores[block] > 0)
    .map((block) => ({
      id: block,
      score: scores[block],
      maxScore: blockMaximums[block],
      normalizedScore: scores[block] / blockMaximums[block],
    }))
    .sort((left, right) => {
      const scoreDifference = right.normalizedScore - left.normalizedScore;
      return scoreDifference === 0
        ? scoreBlockOrder.indexOf(left.id) - scoreBlockOrder.indexOf(right.id)
        : scoreDifference;
    })
    .slice(0, 3);

  return {
    algorithmVersion: SCORE_ALGORITHM_VERSION,
    leadResponseFollowUp: scores.lead_response_follow_up,
    manualWork: scores.manual_work,
    systemsData: scores.systems_data,
    strategicPriorityUrgency: scores.strategic_priority_urgency,
    opportunityBreadth: scores.opportunity_breadth,
    totalScore,
    scoreBand: bandForScore(totalScore),
    opportunityAreas,
  };
}
