import { observationFor, resultContent } from './content';
import type { AssessmentLocale } from './schema';
import type { OpportunityScore, ScoreBlockId } from './score';

export const RESULT_CONTRACT_VERSION = 'free-result/1.0.0';
export const COPY_CONTRACT_VERSION = 'free-audit-copy/en-es/1.0.0';

const lockedIds = [
  'full_personalized_analysis',
  'complete_recommendations',
  'impact_effort_matrix',
  'implementation_sprint_30_day',
  'professional_pdf_report',
  'results_consultation',
] as const;

export interface PublicAssessmentResult {
  readonly assessmentId: string;
  readonly locale: AssessmentLocale;
  readonly versions: {
    readonly result: typeof RESULT_CONTRACT_VERSION;
    readonly score: OpportunityScore['algorithmVersion'];
    readonly copy: typeof COPY_CONTRACT_VERSION;
  };
  readonly score: {
    readonly total: number;
    readonly band: OpportunityScore['scoreBand'];
    readonly blocks: Readonly<Record<ScoreBlockId, number>>;
  };
  readonly observation: string;
  readonly opportunityAreas: readonly {
    readonly id: ScoreBlockId;
    readonly label: string;
  }[];
  readonly lockedSections: readonly {
    readonly id: (typeof lockedIds)[number];
    readonly label: string;
    readonly locked: true;
  }[];
  readonly offer: {
    readonly productCode: 'business_assessment';
    readonly currency: 'USD';
    readonly amount: 299;
    readonly billingType: 'one_time';
    readonly implementationIncluded: false;
  };
  readonly limitation: string;
}

export function buildPublicResult(
  assessmentId: string,
  locale: AssessmentLocale,
  opportunityScore: OpportunityScore,
): PublicAssessmentResult {
  const copy = resultContent[locale];

  return {
    assessmentId,
    locale,
    versions: {
      result: RESULT_CONTRACT_VERSION,
      score: opportunityScore.algorithmVersion,
      copy: COPY_CONTRACT_VERSION,
    },
    score: {
      total: opportunityScore.totalScore,
      band: opportunityScore.scoreBand,
      blocks: {
        lead_response_follow_up: opportunityScore.leadResponseFollowUp,
        manual_work: opportunityScore.manualWork,
        systems_data: opportunityScore.systemsData,
        strategic_priority_urgency: opportunityScore.strategicPriorityUrgency,
        opportunity_breadth: opportunityScore.opportunityBreadth,
      },
    },
    observation: observationFor(locale, opportunityScore.scoreBand),
    opportunityAreas: opportunityScore.opportunityAreas.map((area) => ({
      id: area.id,
      label: copy.areaLabels[area.id],
    })),
    lockedSections: lockedIds.map((id, index) => ({
      id,
      label: copy.locked[index] ?? id,
      locked: true as const,
    })),
    offer: {
      productCode: 'business_assessment',
      currency: 'USD',
      amount: 299,
      billingType: 'one_time',
      implementationIncluded: false,
    },
    limitation: copy.limitation,
  };
}
