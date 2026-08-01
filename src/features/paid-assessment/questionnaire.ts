/**
 * Questionnaire save/resume and submission (PS-004 §8).
 *
 * A draft accumulates field by field in `paid_assessments.questionnaire_data`.
 * Every save validates only the fields it carries — each against its own
 * schema — so one bad answer never blocks saving the good ones; the response
 * names the rejected fields without echoing their values. Submission then
 * validates the *stored* draft against the full questionnaire schema,
 * including its cross-field rules, and is the only path to
 * `questionnaire_complete`.
 *
 * Concurrency uses an optimistic version held in `completion_state.version`:
 * a save or submit carries the version it read, and a mismatch means another
 * tab or device wrote first — the caller reloads instead of overwriting.
 */

import { z } from 'zod';

import { PaidAssessmentError } from './claim';
import { PAID_ASSESSMENT_SCHEMA_VERSION, paidQuestionnaireSchema } from './schema';

export { PAID_ASSESSMENT_SCHEMA_VERSION };

const fieldSchemas = paidQuestionnaireSchema.shape;

export type QuestionnaireFieldId = keyof typeof fieldSchemas;

const EDITABLE_FIELD_IDS = (Object.keys(fieldSchemas) as QuestionnaireFieldId[]).filter(
  // Not answers: the schema version is pinned by the server at submission,
  // and the locale comes from the assessment row, not the client.
  (field) => field !== 'schemaVersion' && field !== 'locale',
);

export interface QuestionnaireState {
  readonly assessmentId: string;
  readonly status: string;
  readonly version: number;
  readonly data: Record<string, unknown>;
  readonly preferredLocale: string;
}

export interface QuestionnaireStore {
  /** Loads the questionnaire state for an assessment the profile owns. */
  loadQuestionnaire(input: {
    readonly assessmentId: string;
    readonly customerProfileId: string;
  }): Promise<QuestionnaireState | null>;

  /**
   * Persists merged draft data if — and only if — the stored version still
   * equals `expectedVersion`. Returns false on a version conflict.
   */
  writeQuestionnaire(input: {
    readonly assessmentId: string;
    readonly customerProfileId: string;
    readonly expectedVersion: number;
    readonly data: Record<string, unknown>;
    readonly newVersion: number;
    readonly status: string;
    readonly markStarted: boolean;
    readonly markSubmitted: boolean;
  }): Promise<boolean>;
}

export type SaveRejection = 'not_found' | 'version_conflict' | 'not_editable';

export interface SaveOutcome {
  readonly saved: boolean;
  readonly reason?: SaveRejection;
  /** Field ids whose values failed validation; their old values are kept. */
  readonly rejectedFields: readonly string[];
  readonly acceptedFields: readonly string[];
  readonly version: number;
  readonly status: string;
}

const SAVEABLE_STATUSES = new Set(['not_started', 'in_progress', 'correction_required']);

export async function saveQuestionnaireDraft(
  store: QuestionnaireStore,
  input: {
    readonly assessmentId: string;
    readonly customerProfileId: string;
    readonly expectedVersion: number;
    readonly fields: Record<string, unknown>;
  },
): Promise<SaveOutcome> {
  const state = await store.loadQuestionnaire(input);
  if (!state) {
    return {
      saved: false,
      reason: 'not_found',
      rejectedFields: [],
      acceptedFields: [],
      version: 0,
      status: 'unknown',
    };
  }
  if (!SAVEABLE_STATUSES.has(state.status)) {
    return {
      saved: false,
      reason: 'not_editable',
      rejectedFields: [],
      acceptedFields: [],
      version: state.version,
      status: state.status,
    };
  }
  if (state.version !== input.expectedVersion) {
    return {
      saved: false,
      reason: 'version_conflict',
      rejectedFields: [],
      acceptedFields: [],
      version: state.version,
      status: state.status,
    };
  }

  // Per-field validation: last confirmed valid values are preserved, and only
  // the offending fields are rejected (PS-004 §8).
  const accepted: Record<string, unknown> = {};
  const rejectedFields: string[] = [];
  for (const [field, value] of Object.entries(input.fields)) {
    if (!(EDITABLE_FIELD_IDS as readonly string[]).includes(field)) {
      rejectedFields.push(field);
      continue;
    }
    const parsed = fieldSchemas[field as QuestionnaireFieldId].safeParse(value);
    if (parsed.success) {
      accepted[field] = parsed.data;
    } else {
      rejectedFields.push(field);
    }
  }

  if (Object.keys(accepted).length === 0) {
    return {
      saved: false,
      rejectedFields,
      acceptedFields: [],
      version: state.version,
      status: state.status,
    };
  }

  const newVersion = state.version + 1;
  const newStatus = state.status === 'not_started' ? 'in_progress' : state.status;
  const written = await store.writeQuestionnaire({
    assessmentId: input.assessmentId,
    customerProfileId: input.customerProfileId,
    expectedVersion: input.expectedVersion,
    data: { ...state.data, ...accepted },
    newVersion,
    status: newStatus,
    markStarted: state.status === 'not_started',
    markSubmitted: false,
  });

  if (!written) {
    return {
      saved: false,
      reason: 'version_conflict',
      rejectedFields,
      acceptedFields: [],
      version: state.version,
      status: state.status,
    };
  }

  return {
    saved: true,
    rejectedFields,
    acceptedFields: Object.keys(accepted),
    version: newVersion,
    status: newStatus,
  };
}

export interface SubmitIssue {
  /** Dot path of the failing field — never its value. */
  readonly path: string;
  readonly message: string;
}

export type SubmitOutcome =
  | { readonly submitted: true; readonly version: number; readonly status: string }
  | {
      readonly submitted: false;
      readonly reason: 'not_found' | 'version_conflict' | 'not_editable' | 'invalid';
      readonly issues: readonly SubmitIssue[];
      readonly version: number;
      readonly status: string;
    };

export async function submitQuestionnaire(
  store: QuestionnaireStore,
  input: {
    readonly assessmentId: string;
    readonly customerProfileId: string;
    readonly expectedVersion: number;
  },
): Promise<SubmitOutcome> {
  const state = await store.loadQuestionnaire(input);
  if (!state) {
    return { submitted: false, reason: 'not_found', issues: [], version: 0, status: 'unknown' };
  }
  // Re-submitting a completed questionnaire is a no-op, not an error: a
  // double-click or a retried request must not fail.
  if (state.status === 'questionnaire_complete') {
    return { submitted: true, version: state.version, status: state.status };
  }
  if (!SAVEABLE_STATUSES.has(state.status)) {
    return {
      submitted: false,
      reason: 'not_editable',
      issues: [],
      version: state.version,
      status: state.status,
    };
  }
  if (state.version !== input.expectedVersion) {
    return {
      submitted: false,
      reason: 'version_conflict',
      issues: [],
      version: state.version,
      status: state.status,
    };
  }

  // The submission is the stored draft, not a client payload: what was saved
  // is what gets validated, pinned to the schema version the server knows.
  const candidate = {
    ...state.data,
    schemaVersion: PAID_ASSESSMENT_SCHEMA_VERSION,
    locale: state.preferredLocale === 'es' ? 'es' : 'en',
  };
  const parsed = paidQuestionnaireSchema.safeParse(candidate);
  if (!parsed.success) {
    return {
      submitted: false,
      reason: 'invalid',
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
      version: state.version,
      status: state.status,
    };
  }

  const newVersion = state.version + 1;
  const written = await store.writeQuestionnaire({
    assessmentId: input.assessmentId,
    customerProfileId: input.customerProfileId,
    expectedVersion: input.expectedVersion,
    data: parsed.data as unknown as Record<string, unknown>,
    newVersion,
    status: 'questionnaire_complete',
    markStarted: state.status === 'not_started',
    markSubmitted: true,
  });

  if (!written) {
    return {
      submitted: false,
      reason: 'version_conflict',
      issues: [],
      version: state.version,
      status: state.status,
    };
  }

  return { submitted: true, version: newVersion, status: 'questionnaire_complete' };
}

/** Request schema for the save endpoint. */
export const saveRequestSchema = z.object({
  assessmentId: z.uuid(),
  expectedVersion: z.number().int().min(0),
  fields: z.record(z.string(), z.unknown()),
});

/** Request schema for the submit endpoint. */
export const submitRequestSchema = z.object({
  assessmentId: z.uuid(),
  expectedVersion: z.number().int().min(0),
});

export { PaidAssessmentError };
