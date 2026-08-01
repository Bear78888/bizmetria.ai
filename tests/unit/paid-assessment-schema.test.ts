import { describe, expect, it } from 'vitest';

import {
  PAID_ASSESSMENT_SCHEMA_VERSION,
  paidQuestionnaireSchema,
} from '@/features/paid-assessment/schema';

/** A submission that satisfies every rule in the contract. */
function validQuestionnaire() {
  return {
    schemaVersion: PAID_ASSESSMENT_SCHEMA_VERSION,
    locale: 'en',
    participant_role: 'owner_executive',
    decision_authority: 'final_decision',
    assessment_scope: 'single_workflow',
    industry_category: 'home_field_services',
    business_model: ['b2c'],
    service_delivery_mode: 'field',
    primary_objective: 'respond_faster',
    objective_detail: 'New enquiries wait too long for a first reply and some never hear back.',
    priority_horizon: 'now_to_30_days',
    target_outcomes: ['respond_faster', 'convert_more'],
    success_measure_ids: ['response_time', 'conversion_rate'],
    baseline_availability: 'estimated',
    baseline_metrics: [
      {
        metric_id: 'response_time',
        value_band_or_text: 'about one business day',
        unit: 'hours',
        period: 'per enquiry',
        quality: 'estimated',
      },
    ],
    nonnegotiable_constraints: ['budget', 'staff_capacity'],
    workflow_focus_areas: ['lead_intake', 'follow_up'],
    primary_workflow_name: 'New enquiry handling',
    workflow_trigger: 'A prospect calls, emails or submits the website form.',
    workflow_desired_outcome: 'The enquiry is answered and booked or explicitly closed.',
    workflow_steps: [
      {
        step_id: 'step-1',
        sequence: 1,
        step_label: 'Receive enquiry',
        owner_role: 'Office coordinator',
        work_mode: 'manual',
        system_category: 'email',
      },
      {
        step_id: 'step-2',
        sequence: 2,
        step_label: 'Reply and schedule',
        owner_role: 'Office coordinator',
        work_mode: 'manual',
        system_category: 'calendar',
      },
    ],
    workflow_frequency: 'daily',
    workflow_volume_band: 'eleven_to_50',
    handoff_count_band: 'one_to_2',
    exception_frequency: 'sometimes',
    primary_bottleneck: 'inconsistent_follow_up',
    system_categories: ['email', 'calendar', 'spreadsheet'],
    system_inventory: [
      { category_id: 'spreadsheet', product_label: 'Google Sheets', purpose: 'Job tracking list' },
    ],
    integration_state: 'manual_transfer',
    data_source_categories: ['email', 'forms'],
    data_quality_state: 'minor_gaps',
    data_access_state: 'authorized_available',
    regulated_data_categories: ['personal_contact'],
    process_owner_role: 'Operations manager',
    change_capacity: 'two_to_5_hours_week',
    implementation_timing: 'now_to_30_days',
    prohibited_data_acknowledgement: true,
  };
}

function expectRejected(mutate: (questionnaire: Record<string, unknown>) => void): string[] {
  const questionnaire = validQuestionnaire() as Record<string, unknown>;
  mutate(questionnaire);
  const result = paidQuestionnaireSchema.safeParse(questionnaire);
  expect(result.success).toBe(false);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join('.'));
}

describe('paid questionnaire schema', () => {
  it('accepts a fully valid submission', () => {
    const result = paidQuestionnaireSchema.safeParse(validQuestionnaire());
    expect(result.success).toBe(true);
  });

  it('requires every R field', () => {
    const paths = expectRejected((questionnaire) => {
      delete questionnaire.objective_detail;
      delete questionnaire.process_owner_role;
    });
    expect(paths).toContain('objective_detail');
    expect(paths).toContain('process_owner_role');
  });

  it('rejects unknown enum ids', () => {
    expectRejected((questionnaire) => {
      questionnaire.primary_bottleneck = 'gremlins';
    });
  });

  it('keeps "none" exclusive in constraint-style multi selects', () => {
    expectRejected((questionnaire) => {
      questionnaire.nonnegotiable_constraints = ['none', 'budget'];
    });
    expectRejected((questionnaire) => {
      questionnaire.system_categories = ['none', 'email'];
    });
  });

  it('keeps not_currently_measured exclusive among success measures', () => {
    expectRejected((questionnaire) => {
      questionnaire.success_measure_ids = ['not_currently_measured', 'response_time'];
    });
  });

  it('treats none and unknown as mutually exclusive for regulated data', () => {
    expectRejected((questionnaire) => {
      questionnaire.regulated_data_categories = ['none', 'unknown'];
    });
  });

  it('rejects duplicate multi-select values', () => {
    expectRejected((questionnaire) => {
      questionnaire.target_outcomes = ['respond_faster', 'respond_faster'];
    });
  });

  it('rejects baseline metrics when no baseline is available', () => {
    const paths = expectRejected((questionnaire) => {
      questionnaire.baseline_availability = 'not_measured';
    });
    expect(paths).toContain('baseline_metrics');
  });

  it('rejects a metric claiming the not_currently_measured id', () => {
    expectRejected((questionnaire) => {
      (questionnaire.baseline_metrics as Record<string, unknown>[])[0]!.metric_id =
        'not_currently_measured';
    });
  });

  it('rejects non-contiguous or duplicate step sequences', () => {
    expectRejected((questionnaire) => {
      (questionnaire.workflow_steps as Record<string, unknown>[])[1]!.sequence = 3;
    });
    expectRejected((questionnaire) => {
      (questionnaire.workflow_steps as Record<string, unknown>[])[1]!.sequence = 1;
    });
  });

  it('rejects duplicate step ids', () => {
    expectRejected((questionnaire) => {
      (questionnaire.workflow_steps as Record<string, unknown>[])[1]!.step_id = 'step-1';
    });
  });

  it('requires at least two workflow steps', () => {
    expectRejected((questionnaire) => {
      questionnaire.workflow_steps = (questionnaire.workflow_steps as unknown[]).slice(0, 1);
    });
  });

  it('rejects an inventory row whose category was not selected', () => {
    const paths = expectRejected((questionnaire) => {
      questionnaire.system_inventory = [{ category_id: 'crm', purpose: 'Customer records' }];
    });
    expect(paths).toContain('system_inventory.0.category_id');
  });

  it('rejects "none" as an inventory category outright', () => {
    expectRejected((questionnaire) => {
      questionnaire.system_categories = ['email', 'none'];
    });
    expectRejected((questionnaire) => {
      questionnaire.system_inventory = [{ category_id: 'none', purpose: 'Nothing' }];
    });
  });

  it('enforces text bounds', () => {
    expectRejected((questionnaire) => {
      questionnaire.objective_detail = 'too short';
    });
    expectRejected((questionnaire) => {
      questionnaire.additional_context = 'x'.repeat(1001);
    });
  });

  it('drops blank optional text instead of storing empty strings', () => {
    const questionnaire = validQuestionnaire() as Record<string, unknown>;
    questionnaire.bottleneck_detail = '   ';
    const result = paidQuestionnaireSchema.safeParse(questionnaire);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.bottleneck_detail).toBeUndefined();
    }
  });

  it('requires the prohibited-data acknowledgement to be literally true', () => {
    expectRejected((questionnaire) => {
      questionnaire.prohibited_data_acknowledgement = false;
    });
  });

  it('pins the contract version', () => {
    expectRejected((questionnaire) => {
      questionnaire.schemaVersion = 'paid-assessment-schema/2.0.0';
    });
  });
});
