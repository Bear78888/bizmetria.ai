/**
 * Declarative layout of the questionnaire form: sections in contract order
 * (PS-004 §6.2–6.7), each field with its control kind and the §7 registry its
 * options come from. The Zod schema remains the validation authority — this
 * file only decides how a field is presented.
 */

import {
  assessmentScopes,
  baselineAvailabilities,
  bottlenecks,
  businessModels,
  changeCapacities,
  constraints,
  dataAccessStates,
  dataQualityStates,
  dataSources,
  decisionAuthorities,
  delayBands,
  exceptionFrequencies,
  handoffCounts,
  implementationTimings,
  industryCategories,
  integrationStates,
  investmentConstraints,
  manualEfforts,
  objectives,
  participantRoles,
  priorityHorizons,
  regulatedDataCategories,
  reworkFrequencies,
  serviceDeliveryModes,
  successMeasures,
  systemCategories,
  workflowAreas,
  workflowFrequencies,
  workflowVolumes,
} from './schema';

export type FieldControl =
  | { readonly kind: 'select'; readonly registry: string; readonly options: readonly string[] }
  | {
      readonly kind: 'multi';
      readonly registry: string;
      readonly options: readonly string[];
      readonly max: number;
    }
  | { readonly kind: 'text'; readonly maxLength: number }
  | { readonly kind: 'textarea'; readonly maxLength: number }
  | { readonly kind: 'roles'; readonly max: number }
  | { readonly kind: 'metrics' }
  | { readonly kind: 'steps' }
  | { readonly kind: 'inventory' }
  | { readonly kind: 'acknowledgement' };

export interface FieldConfig {
  readonly id: string;
  readonly required: boolean;
  readonly control: FieldControl;
  /** Renders only when the predicate over current answers holds. */
  readonly visibleWhen?: (answers: Record<string, unknown>) => boolean;
}

export interface SectionConfig {
  readonly id: string;
  readonly fields: readonly FieldConfig[];
}

const metricsVisible = (answers: Record<string, unknown>) =>
  answers.baseline_availability === 'measured' || answers.baseline_availability === 'estimated';

export const formSections: readonly SectionConfig[] = [
  {
    id: 'participant',
    fields: [
      {
        id: 'participant_role',
        required: true,
        control: { kind: 'select', registry: 'participant_role', options: participantRoles },
      },
      {
        id: 'decision_authority',
        required: true,
        control: { kind: 'select', registry: 'decision_authority', options: decisionAuthorities },
      },
      {
        id: 'assessment_scope',
        required: true,
        control: { kind: 'select', registry: 'assessment_scope', options: assessmentScopes },
      },
      {
        id: 'industry_category',
        required: true,
        control: { kind: 'select', registry: 'industry_category', options: industryCategories },
      },
      {
        id: 'business_model',
        required: true,
        control: { kind: 'multi', registry: 'business_model', options: businessModels, max: 3 },
      },
      {
        id: 'service_delivery_mode',
        required: true,
        control: {
          kind: 'select',
          registry: 'service_delivery_mode',
          options: serviceDeliveryModes,
        },
      },
    ],
  },
  {
    id: 'objectives',
    fields: [
      {
        id: 'primary_objective',
        required: true,
        control: { kind: 'select', registry: 'objective', options: objectives },
      },
      { id: 'objective_detail', required: true, control: { kind: 'textarea', maxLength: 500 } },
      {
        id: 'priority_horizon',
        required: true,
        control: { kind: 'select', registry: 'priority_horizon', options: priorityHorizons },
      },
      {
        id: 'target_outcomes',
        required: true,
        control: { kind: 'multi', registry: 'objective', options: objectives, max: 3 },
      },
      {
        id: 'success_measure_ids',
        required: true,
        control: { kind: 'multi', registry: 'success_measure', options: successMeasures, max: 5 },
      },
      {
        id: 'baseline_availability',
        required: true,
        control: {
          kind: 'select',
          registry: 'baseline_availability',
          options: baselineAvailabilities,
        },
      },
      {
        id: 'baseline_metrics',
        required: false,
        control: { kind: 'metrics' },
        visibleWhen: metricsVisible,
      },
      {
        id: 'nonnegotiable_constraints',
        required: true,
        control: { kind: 'multi', registry: 'constraint', options: constraints, max: 8 },
      },
    ],
  },
  {
    id: 'workflow',
    fields: [
      {
        id: 'workflow_focus_areas',
        required: true,
        control: { kind: 'multi', registry: 'workflow_area', options: workflowAreas, max: 3 },
      },
      { id: 'primary_workflow_name', required: true, control: { kind: 'text', maxLength: 80 } },
      { id: 'workflow_trigger', required: true, control: { kind: 'textarea', maxLength: 300 } },
      {
        id: 'workflow_desired_outcome',
        required: true,
        control: { kind: 'textarea', maxLength: 300 },
      },
      { id: 'workflow_steps', required: true, control: { kind: 'steps' } },
      {
        id: 'workflow_frequency',
        required: true,
        control: { kind: 'select', registry: 'workflow_frequency', options: workflowFrequencies },
      },
      {
        id: 'workflow_volume_band',
        required: true,
        control: { kind: 'select', registry: 'workflow_volume', options: workflowVolumes },
      },
      {
        id: 'handoff_count_band',
        required: true,
        control: { kind: 'select', registry: 'handoff_count', options: handoffCounts },
      },
      {
        id: 'exception_frequency',
        required: true,
        control: { kind: 'select', registry: 'exception_frequency', options: exceptionFrequencies },
      },
      {
        id: 'primary_bottleneck',
        required: true,
        control: { kind: 'select', registry: 'bottleneck', options: bottlenecks },
      },
      { id: 'bottleneck_detail', required: false, control: { kind: 'textarea', maxLength: 500 } },
      {
        id: 'delay_band',
        required: false,
        control: { kind: 'select', registry: 'delay_band', options: delayBands },
      },
      {
        id: 'manual_effort_band',
        required: false,
        control: { kind: 'select', registry: 'manual_effort', options: manualEfforts },
      },
      {
        id: 'rework_frequency',
        required: false,
        control: { kind: 'select', registry: 'rework_frequency', options: reworkFrequencies },
      },
    ],
  },
  {
    id: 'systems',
    fields: [
      {
        id: 'system_categories',
        required: true,
        control: { kind: 'multi', registry: 'system_category', options: systemCategories, max: 10 },
      },
      { id: 'system_inventory', required: false, control: { kind: 'inventory' } },
      {
        id: 'integration_state',
        required: true,
        control: { kind: 'select', registry: 'integration_state', options: integrationStates },
      },
      {
        id: 'data_source_categories',
        required: true,
        control: { kind: 'multi', registry: 'data_source', options: dataSources, max: 10 },
      },
      {
        id: 'data_quality_state',
        required: true,
        control: { kind: 'select', registry: 'data_quality_state', options: dataQualityStates },
      },
      {
        id: 'data_access_state',
        required: true,
        control: { kind: 'select', registry: 'data_access_state', options: dataAccessStates },
      },
      {
        id: 'regulated_data_categories',
        required: true,
        control: {
          kind: 'multi',
          registry: 'regulated_data',
          options: regulatedDataCategories,
          max: 8,
        },
      },
    ],
  },
  {
    id: 'capacity',
    fields: [
      { id: 'process_owner_role', required: true, control: { kind: 'text', maxLength: 80 } },
      {
        id: 'change_capacity',
        required: true,
        control: { kind: 'select', registry: 'change_capacity', options: changeCapacities },
      },
      {
        id: 'implementation_timing',
        required: true,
        control: { kind: 'select', registry: 'priority_horizon', options: implementationTimings },
      },
      {
        id: 'investment_constraint',
        required: false,
        control: {
          kind: 'select',
          registry: 'investment_constraint',
          options: investmentConstraints,
        },
      },
      { id: 'stakeholder_roles', required: false, control: { kind: 'roles', max: 8 } },
      { id: 'known_dependencies', required: false, control: { kind: 'textarea', maxLength: 500 } },
      { id: 'known_risks', required: false, control: { kind: 'textarea', maxLength: 500 } },
    ],
  },
  {
    id: 'final',
    fields: [
      { id: 'additional_context', required: false, control: { kind: 'textarea', maxLength: 1000 } },
      {
        id: 'prohibited_data_acknowledgement',
        required: true,
        control: { kind: 'acknowledgement' },
      },
    ],
  },
];
