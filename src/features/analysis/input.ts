import { assessmentContent } from '@/features/free-assessment/content';
import {
  QUESTION_IDS,
  type AssessmentAnswers,
  type AssessmentLocale,
  type QuestionId,
} from '@/features/free-assessment/schema';
import type { OpportunityScore, ScoreBlockId } from '@/features/free-assessment/score';

export interface AnalysedAnswer {
  readonly questionId: QuestionId;
  readonly question: string;
  /** Human-readable option labels in the respondent's locale. */
  readonly selected: readonly string[];
}

export interface AnalysisInput {
  readonly locale: AssessmentLocale;
  readonly score: {
    readonly total: number;
    readonly band: OpportunityScore['scoreBand'];
    readonly blocks: Readonly<Record<ScoreBlockId, number>>;
  };
  /** Highest-signal score blocks, already ordered by the scoring algorithm. */
  readonly opportunityAreas: readonly ScoreBlockId[];
  readonly answers: readonly AnalysedAnswer[];
  /**
   * The one free-text field in the questionnaire: the respondent's own words
   * for their business category when no listed category fits.
   */
  readonly businessTypeNote: string | null;
}

function selectedLabels(
  locale: AssessmentLocale,
  questionId: QuestionId,
  answers: AssessmentAnswers,
): readonly string[] {
  const question = assessmentContent[locale].questions.find((entry) => entry.id === questionId);
  const answer = answers[questionId];
  const values = Array.isArray(answer) ? answer : [answer];

  return values.map(
    (value) => question?.options.find((option) => option.value === value)?.label ?? value,
  );
}

/**
 * Reduces a submission to the material the analysis actually reasons about.
 *
 * Contact details are structurally absent: name, business name, email, phone
 * and website never enter this object, so no analysis provider can receive
 * them. What remains is the questionnaire — answers the respondent chose from
 * a fixed list, plus the deterministic score computed from them.
 */
export function buildAnalysisInput(
  locale: AssessmentLocale,
  answers: AssessmentAnswers,
  score: OpportunityScore,
): AnalysisInput {
  const businessTypeNote =
    answers.Q01 === 'other' ? answers.businessTypeOther?.trim() || null : null;

  return {
    locale,
    score: {
      total: score.totalScore,
      band: score.scoreBand,
      blocks: {
        lead_response_follow_up: score.leadResponseFollowUp,
        manual_work: score.manualWork,
        systems_data: score.systemsData,
        strategic_priority_urgency: score.strategicPriorityUrgency,
        opportunity_breadth: score.opportunityBreadth,
      },
    },
    opportunityAreas: score.opportunityAreas.map((area) => area.id),
    answers: QUESTION_IDS.map((questionId) => ({
      questionId,
      question:
        assessmentContent[locale].questions.find((entry) => entry.id === questionId)?.title ??
        questionId,
      selected: selectedLabels(locale, questionId, answers),
    })),
    businessTypeNote,
  };
}
