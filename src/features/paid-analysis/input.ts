/**
 * Assembling the paid-analysis input from stored evidence.
 *
 * The questionnaire carries no contact fields by design (PS-004 §6), so the
 * analysis provider receives canonical field ids and answers as stored. The
 * transcript is included as spoken: it is the interview evidence the analysis
 * exists to reason about, and the prompt forbids echoing sensitive specifics
 * into the output.
 */

export interface QuestionnaireEvidence {
  readonly field: string;
  readonly value: unknown;
}

export interface PaidAnalysisInput {
  readonly locale: 'en' | 'es';
  readonly questionnaire: readonly QuestionnaireEvidence[];
  readonly transcript: string;
}

/** Server-owned bookkeeping keys that are not answers. */
const NON_EVIDENCE_KEYS = new Set(['schemaVersion', 'locale']);

export function buildPaidAnalysisInput(input: {
  readonly locale: string;
  readonly questionnaireData: Readonly<Record<string, unknown>>;
  readonly transcriptText: string;
}): PaidAnalysisInput {
  const questionnaire = Object.entries(input.questionnaireData)
    .filter(([field, value]) => !NON_EVIDENCE_KEYS.has(field) && value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([field, value]) => ({ field, value }));

  return {
    locale: input.locale === 'es' ? 'es' : 'en',
    questionnaire,
    transcript: input.transcriptText,
  };
}

/**
 * What lands in `analysis_runs.input_evidence`: the questionnaire field ids
 * and the transcript reference — enough to audit what the run saw without
 * duplicating the content into a second table.
 */
export function describeInputEvidence(
  input: PaidAnalysisInput,
  transcriptId: string,
): readonly Record<string, unknown>[] {
  return [
    { kind: 'questionnaire_fields', fields: input.questionnaire.map((entry) => entry.field) },
    { kind: 'transcript', transcript_id: transcriptId, characters: input.transcript.length },
  ];
}
