import { describe, expect, it } from 'vitest';

import {
  saveQuestionnaireDraft,
  submitQuestionnaire,
  type QuestionnaireState,
  type QuestionnaireStore,
} from '../../src/features/paid-assessment/questionnaire';

const ASSESSMENT_ID = '44444444-4444-4444-8444-444444444444';
const PROFILE = '11111111-1111-4111-8111-111111111111';

interface MemoryRow {
  status: string;
  version: number;
  data: Record<string, unknown>;
  startedAt: string | null;
  submittedAt: string | null;
}

function memoryStore(row: MemoryRow | null): QuestionnaireStore & { row: MemoryRow | null } {
  const store = {
    row,
    loadQuestionnaire(input: {
      assessmentId: string;
      customerProfileId: string;
    }): Promise<QuestionnaireState | null> {
      if (
        !store.row ||
        input.assessmentId !== ASSESSMENT_ID ||
        input.customerProfileId !== PROFILE
      ) {
        return Promise.resolve(null);
      }
      return Promise.resolve({
        assessmentId: ASSESSMENT_ID,
        status: store.row.status,
        version: store.row.version,
        data: store.row.data,
        preferredLocale: 'en',
      });
    },
    writeQuestionnaire(input: {
      expectedVersion: number;
      data: Record<string, unknown>;
      newVersion: number;
      status: string;
      markStarted: boolean;
      markSubmitted: boolean;
    }): Promise<boolean> {
      if (!store.row || store.row.version !== input.expectedVersion) return Promise.resolve(false);
      store.row = {
        status: input.status,
        version: input.newVersion,
        data: input.data,
        startedAt: input.markStarted ? 'now' : store.row.startedAt,
        submittedAt: input.markSubmitted ? 'now' : store.row.submittedAt,
      };
      return Promise.resolve(true);
    },
  };
  return store;
}

function freshRow(overrides: Partial<MemoryRow> = {}): MemoryRow {
  return {
    status: 'not_started',
    version: 0,
    data: {},
    startedAt: null,
    submittedAt: null,
    ...overrides,
  };
}

/** A complete, schema-valid questionnaire answer set. */
function completeAnswers(): Record<string, unknown> {
  return {
    participant_role: 'owner_executive',
    decision_authority: 'final_decision',
    assessment_scope: 'entire_business',
    industry_category: 'professional_services',
    business_model: ['b2b'],
    service_delivery_mode: 'hybrid',
    primary_objective: 'reduce_manual_work',
    objective_detail:
      'Reduce the manual effort involved in intake and follow-up for new client requests.',
    priority_horizon: 'days_31_to_90',
    target_outcomes: ['reduce_manual_work'],
    success_measure_ids: ['response_time'],
    baseline_availability: 'estimated',
    baseline_metrics: [
      {
        metric_id: 'response_time',
        value_band_or_text: 'about 4 hours',
        unit: 'hours',
        period: 'per_request',
        quality: 'estimated',
      },
    ],
    nonnegotiable_constraints: ['none'],
    workflow_focus_areas: ['lead_intake'],
    primary_workflow_name: 'New client intake',
    workflow_trigger: 'A prospect submits the contact form or calls the office.',
    workflow_desired_outcome: 'The prospect is qualified and booked for a consultation.',
    workflow_steps: [
      {
        step_id: 'intake',
        sequence: 1,
        step_label: 'Capture the request',
        owner_role: 'Office manager',
        work_mode: 'manual',
        system_category: 'email',
      },
      {
        step_id: 'qualify',
        sequence: 2,
        step_label: 'Qualify and book',
        owner_role: 'Office manager',
        work_mode: 'manual',
        system_category: 'calendar',
      },
    ],
    workflow_frequency: 'daily',
    workflow_volume_band: 'eleven_to_50',
    handoff_count_band: 'one_to_2',
    exception_frequency: 'sometimes',
    primary_bottleneck: 'waiting',
    system_categories: ['email', 'calendar'],
    integration_state: 'mostly_separate',
    data_source_categories: ['email'],
    data_quality_state: 'minor_gaps',
    data_access_state: 'authorized_available',
    regulated_data_categories: ['none'],
    process_owner_role: 'Office manager',
    change_capacity: 'two_to_5_hours_week',
    implementation_timing: 'days_31_to_90',
    prohibited_data_acknowledgement: true,
  };
}

describe('saveQuestionnaireDraft', () => {
  it('accepts valid fields, moves not_started to in_progress and bumps the version', async () => {
    const store = memoryStore(freshRow());

    const outcome = await saveQuestionnaireDraft(store, {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      expectedVersion: 0,
      fields: { participant_role: 'owner_executive', priority_horizon: 'days_31_to_90' },
    });

    expect(outcome).toMatchObject({
      saved: true,
      version: 1,
      status: 'in_progress',
      acceptedFields: ['participant_role', 'priority_horizon'],
      rejectedFields: [],
    });
    expect(store.row).toMatchObject({
      status: 'in_progress',
      version: 1,
      startedAt: 'now',
      data: { participant_role: 'owner_executive' },
    });
  });

  it('keeps valid fields while naming the rejected ones, without echoing values', async () => {
    const store = memoryStore(freshRow());

    const outcome = await saveQuestionnaireDraft(store, {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      expectedVersion: 0,
      fields: {
        participant_role: 'owner_executive',
        decision_authority: 'not_a_real_enum_value',
        unknown_field: 'anything',
      },
    });

    expect(outcome.saved).toBe(true);
    expect(outcome.acceptedFields).toEqual(['participant_role']);
    expect(outcome.rejectedFields).toEqual(['decision_authority', 'unknown_field']);
    expect(store.row?.data).toEqual({ participant_role: 'owner_executive' });
  });

  it('rejects schemaVersion and locale as fields: they are server-owned', async () => {
    const store = memoryStore(freshRow());

    const outcome = await saveQuestionnaireDraft(store, {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      expectedVersion: 0,
      fields: { schemaVersion: 'paid-assessment-schema/1.0.0', locale: 'en' },
    });

    expect(outcome.saved).toBe(false);
    expect(outcome.rejectedFields).toEqual(['schemaVersion', 'locale']);
    expect(store.row?.version).toBe(0);
  });

  it('preserves previously saved values when a later save rejects a field', async () => {
    const store = memoryStore(
      freshRow({
        status: 'in_progress',
        version: 3,
        data: { participant_role: 'owner_executive' },
      }),
    );

    const outcome = await saveQuestionnaireDraft(store, {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      expectedVersion: 3,
      fields: { participant_role: 'bogus', assessment_scope: 'entire_business' },
    });

    expect(outcome.saved).toBe(true);
    expect(outcome.rejectedFields).toEqual(['participant_role']);
    expect(store.row?.data).toEqual({
      participant_role: 'owner_executive',
      assessment_scope: 'entire_business',
    });
  });

  it('returns a version conflict instead of overwriting a newer draft', async () => {
    const store = memoryStore(freshRow({ status: 'in_progress', version: 5 }));

    const outcome = await saveQuestionnaireDraft(store, {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      expectedVersion: 4,
      fields: { assessment_scope: 'entire_business' },
    });

    expect(outcome).toMatchObject({ saved: false, reason: 'version_conflict', version: 5 });
    expect(store.row?.version).toBe(5);
  });

  it('refuses to edit a submitted questionnaire', async () => {
    const store = memoryStore(freshRow({ status: 'questionnaire_complete', version: 9 }));

    const outcome = await saveQuestionnaireDraft(store, {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      expectedVersion: 9,
      fields: { assessment_scope: 'entire_business' },
    });

    expect(outcome).toMatchObject({ saved: false, reason: 'not_editable' });
  });

  it('reports not_found for another profile’s assessment', async () => {
    const store = memoryStore(freshRow());

    const outcome = await saveQuestionnaireDraft(store, {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: '99999999-9999-4999-8999-999999999999',
      expectedVersion: 0,
      fields: { assessment_scope: 'entire_business' },
    });

    expect(outcome).toMatchObject({ saved: false, reason: 'not_found' });
  });
});

describe('submitQuestionnaire', () => {
  it('submits a complete stored draft and transitions to questionnaire_complete', async () => {
    const store = memoryStore(
      freshRow({ status: 'in_progress', version: 7, data: completeAnswers() }),
    );

    const outcome = await submitQuestionnaire(store, {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      expectedVersion: 7,
    });

    expect(outcome).toEqual({ submitted: true, version: 8, status: 'questionnaire_complete' });
    expect(store.row).toMatchObject({
      status: 'questionnaire_complete',
      version: 8,
      submittedAt: 'now',
    });
    // The stored submission is the schema-pinned parse, not the raw draft.
    expect(store.row?.data.schemaVersion).toBe('paid-assessment-schema/1.1.0');
    expect(store.row?.data.locale).toBe('en');
  });

  it('returns field paths — never values — when the draft is incomplete', async () => {
    const incomplete = completeAnswers();
    delete incomplete.prohibited_data_acknowledgement;
    delete incomplete.primary_workflow_name;
    const store = memoryStore(freshRow({ status: 'in_progress', version: 2, data: incomplete }));

    const outcome = await submitQuestionnaire(store, {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      expectedVersion: 2,
    });

    expect(outcome.submitted).toBe(false);
    if (!outcome.submitted) {
      expect(outcome.reason).toBe('invalid');
      const paths = outcome.issues.map((issue) => issue.path);
      expect(paths).toContain('prohibited_data_acknowledgement');
      expect(paths).toContain('primary_workflow_name');
      const serialized = JSON.stringify(outcome.issues);
      expect(serialized).not.toContain('owner_executive');
      expect(serialized).not.toContain('New client intake');
    }
    expect(store.row?.status).toBe('in_progress');
  });

  it('accepts a draft that only carries the required core', async () => {
    const store = memoryStore(
      freshRow({
        status: 'in_progress',
        version: 1,
        data: {
          participant_role: 'owner_executive',
          industry_category: 'home_field_services',
          primary_objective: 'respond_faster',
          primary_workflow_name: 'New enquiry handling',
          prohibited_data_acknowledgement: true,
        },
      }),
    );

    const outcome = await submitQuestionnaire(store, {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      expectedVersion: 1,
    });

    expect(outcome).toMatchObject({ submitted: true, status: 'questionnaire_complete' });
  });

  it('treats a repeat submission as a no-op success', async () => {
    const store = memoryStore(freshRow({ status: 'questionnaire_complete', version: 8 }));

    const outcome = await submitQuestionnaire(store, {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      expectedVersion: 8,
    });

    expect(outcome).toEqual({ submitted: true, version: 8, status: 'questionnaire_complete' });
  });

  it('returns a version conflict when the draft moved underneath the submit', async () => {
    const store = memoryStore(
      freshRow({ status: 'in_progress', version: 4, data: completeAnswers() }),
    );

    const outcome = await submitQuestionnaire(store, {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      expectedVersion: 3,
    });

    expect(outcome).toMatchObject({ submitted: false, reason: 'version_conflict', version: 4 });
  });
});
