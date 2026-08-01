import { z } from 'zod';

/**
 * The paid questionnaire, transcribed from the approved PS-004 contract
 * (paid-assessment-schema/1.0.0). Field IDs, enum IDs, bounds and the
 * cross-field rules all come from that document — nothing here is invented,
 * and a change to this file that is not a change to the contract is a bug.
 */
export const PAID_ASSESSMENT_SCHEMA_VERSION = 'paid-assessment-schema/1.0.0';

// --- Canonical enum registry (contract §7). IDs are language-neutral. ---

export const participantRoles = [
  'owner_executive',
  'department_leader',
  'manager',
  'operator',
  'advisor',
  'other',
] as const;
export const decisionAuthorities = [
  'final_decision',
  'shared_decision',
  'recommender',
  'contributor',
] as const;
export const assessmentScopes = [
  'entire_business',
  'department',
  'single_workflow',
  'single_location',
  'other',
] as const;
export const industryCategories = [
  'professional_services',
  'home_field_services',
  'health_wellness',
  'retail_ecommerce',
  'hospitality_food',
  'real_estate_property',
  'financial_insurance',
  'education_training',
  'manufacturing_distribution',
  'nonprofit_community',
  'technology_software',
  'other',
] as const;
export const businessModels = [
  'b2b',
  'b2c',
  'b2g',
  'nonprofit',
  'internal_service',
  'marketplace',
  'other',
] as const;
export const serviceDeliveryModes = [
  'onsite',
  'field',
  'remote',
  'ecommerce',
  'hybrid',
  'other',
] as const;
export const objectives = [
  'respond_faster',
  'convert_more',
  'reduce_manual_work',
  'improve_customer_experience',
  'organize_systems_data',
  'improve_reporting',
  'scale_capacity',
  'reduce_errors_rework',
  'identify_ai_priorities',
  'other',
] as const;
export const priorityHorizons = [
  'now_to_30_days',
  'days_31_to_90',
  'months_3_to_6',
  'months_6_to_12',
  'exploring',
] as const;
export const successMeasures = [
  'response_time',
  'conversion_rate',
  'cycle_time',
  'manual_hours',
  'error_rate',
  'customer_satisfaction',
  'on_time_completion',
  'throughput',
  'data_completeness',
  'visibility',
  'not_currently_measured',
  'other',
] as const;
export const baselineAvailabilities = ['measured', 'estimated', 'not_measured', 'unknown'] as const;
export const constraints = [
  'budget',
  'timeline',
  'staff_capacity',
  'security',
  'privacy',
  'regulatory',
  'customer_experience',
  'system_limit',
  'vendor_contract',
  'change_readiness',
  'other',
  'none',
] as const;
export const workflowAreas = [
  'lead_intake',
  'follow_up',
  'scheduling',
  'sales_quotes',
  'customer_service',
  'billing_collections',
  'reporting',
  'marketing',
  'data_entry',
  'internal_coordination',
  'other',
] as const;
export const workflowFrequencies = [
  'ad_hoc',
  'daily',
  'weekly',
  'monthly',
  'seasonal',
  'continuous',
  'unknown',
] as const;
export const workflowVolumes = [
  'zero_to_10',
  'eleven_to_50',
  'fifty_one_to_200',
  'two_hundred_one_to_1000',
  'over_1000',
  'unknown',
] as const;
export const handoffCounts = ['zero', 'one_to_2', 'three_to_5', 'six_plus', 'unknown'] as const;
export const exceptionFrequencies = [
  'rare',
  'sometimes',
  'often',
  'most_cases',
  'unknown',
] as const;
export const bottlenecks = [
  'waiting',
  'manual_entry',
  'duplicate_work',
  'missing_information',
  'approval_delay',
  'system_switching',
  'inconsistent_follow_up',
  'staff_capacity',
  'quality_rework',
  'limited_reporting',
  'other',
  'unknown',
] as const;
export const delayBands = [
  'under_15_minutes',
  'fifteen_to_60_minutes',
  'one_to_4_hours',
  'same_day',
  'one_to_3_days',
  'over_3_days',
  'unknown',
  'not_applicable',
] as const;
export const manualEfforts = [
  'under_2_hours_week',
  'two_to_5_hours_week',
  'six_to_10_hours_week',
  'eleven_to_20_hours_week',
  'over_20_hours_week',
  'unknown',
] as const;
export const reworkFrequencies = ['rare', 'monthly', 'weekly', 'daily', 'unknown'] as const;
export const systemCategories = [
  'crm',
  'spreadsheet',
  'email',
  'calendar',
  'phone_messaging',
  'project_work',
  'helpdesk',
  'marketing',
  'sales',
  'ecommerce',
  'finance_billing',
  'document_storage',
  'custom_database',
  'other',
  'none',
] as const;
export const integrationStates = [
  'fully_integrated',
  'partially_integrated',
  'mostly_separate',
  'manual_transfer',
  'not_applicable',
  'unknown',
] as const;
export const dataSources = [
  'crm',
  'forms',
  'email',
  'spreadsheet',
  'calendar',
  'phone_messages',
  'finance',
  'ecommerce',
  'website_analytics',
  'support',
  'documents',
  'other',
  'none',
] as const;
export const dataQualityStates = [
  'reliable',
  'minor_gaps',
  'significant_gaps',
  'not_assessed',
  'unknown',
] as const;
export const dataAccessStates = [
  'authorized_available',
  'authorized_partial',
  'owner_approval_needed',
  'unavailable',
  'unknown',
] as const;
export const regulatedDataCategories = [
  'personal_contact',
  'customer_financial',
  'health_related',
  'children',
  'biometric',
  'government_id',
  'precise_location',
  'credentials',
  'other',
  'none',
  'unknown',
] as const;
export const changeCapacities = [
  'none_available',
  'under_2_hours_week',
  'two_to_5_hours_week',
  'six_to_10_hours_week',
  'over_10_hours_week',
  'unknown',
] as const;
export const implementationTimings = priorityHorizons;
export const investmentConstraints = [
  'no_budget_planned',
  'high_cost_sensitivity',
  'estimate_needed',
  'approved_budget_exists',
  'prefer_no_new_tools',
  'unknown',
] as const;
export const workModes = ['manual', 'mixed', 'automated'] as const;

// --- Shared building blocks ---

const trimmed = (min: number, max: number) => z.string().trim().min(min).max(max);
const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    // Optional text is absent when blank; empty strings are never stored.
    .transform((value) => (value.length === 0 ? undefined : value))
    .optional();

/** Multi-select: bounded, unique, with an optional value no other may join. */
function multi<T extends readonly [string, ...string[]]>(
  values: T,
  min: number,
  max: number,
  exclusiveIds: readonly string[] = [],
) {
  return z
    .array(z.enum(values))
    .min(min)
    .max(max)
    .superRefine((selected, context) => {
      if (new Set(selected).size !== selected.length) {
        context.addIssue({ code: 'custom', message: 'Values must be unique.' });
      }
      for (const exclusiveId of exclusiveIds) {
        if (selected.includes(exclusiveId as T[number]) && selected.length > 1) {
          context.addIssue({
            code: 'custom',
            message: `"${exclusiveId}" cannot be combined with other values.`,
          });
        }
      }
    });
}

// --- Structured objects (contract §6.8) ---

const baselineMetricSchema = z.object({
  metric_id: z.enum(successMeasures.filter((id) => id !== 'not_currently_measured') as never),
  value_band_or_text: trimmed(1, 80),
  unit: trimmed(1, 40),
  period: trimmed(1, 40),
  quality: z.enum(['measured', 'estimated']),
});

const workflowStepSchema = z.object({
  step_id: trimmed(1, 80),
  sequence: z.number().int().min(1),
  step_label: trimmed(2, 80),
  owner_role: trimmed(2, 80),
  work_mode: z.enum(workModes),
  system_category: z.enum(systemCategories),
});

const systemInventoryItemSchema = z.object({
  category_id: z.enum(systemCategories.filter((id) => id !== 'none') as never),
  product_label: optionalTrimmed(80).pipe(z.string().min(2).optional()),
  purpose: trimmed(2, 120),
});

// --- The questionnaire ---

const questionnaireObject = z.object({
  schemaVersion: z.literal(PAID_ASSESSMENT_SCHEMA_VERSION),
  locale: z.enum(['en', 'es']),

  // §6.2 Participant and scope
  participant_role: z.enum(participantRoles),
  decision_authority: z.enum(decisionAuthorities),
  assessment_scope: z.enum(assessmentScopes),
  industry_category: z.enum(industryCategories),
  business_model: multi(businessModels, 1, 3),
  service_delivery_mode: z.enum(serviceDeliveryModes),

  // §6.3 Objectives and success
  primary_objective: z.enum(objectives),
  objective_detail: trimmed(20, 500),
  priority_horizon: z.enum(priorityHorizons),
  target_outcomes: multi(objectives, 1, 3),
  success_measure_ids: multi(successMeasures, 1, 5, ['not_currently_measured']),
  baseline_availability: z.enum(baselineAvailabilities),
  baseline_metrics: z.array(baselineMetricSchema).max(5).optional(),
  nonnegotiable_constraints: multi(constraints, 1, 8, ['none']),

  // §6.4 Primary workflow
  workflow_focus_areas: multi(workflowAreas, 1, 3),
  primary_workflow_name: trimmed(3, 80),
  workflow_trigger: trimmed(10, 300),
  workflow_desired_outcome: trimmed(10, 300),
  workflow_steps: z.array(workflowStepSchema).min(2).max(12),
  workflow_frequency: z.enum(workflowFrequencies),
  workflow_volume_band: z.enum(workflowVolumes),
  handoff_count_band: z.enum(handoffCounts),
  exception_frequency: z.enum(exceptionFrequencies),
  primary_bottleneck: z.enum(bottlenecks),
  bottleneck_detail: optionalTrimmed(500),
  delay_band: z.enum(delayBands).optional(),
  manual_effort_band: z.enum(manualEfforts).optional(),
  rework_frequency: z.enum(reworkFrequencies).optional(),

  // §6.5 Systems and data
  system_categories: multi(systemCategories, 1, 10, ['none']),
  system_inventory: z.array(systemInventoryItemSchema).max(10).optional(),
  integration_state: z.enum(integrationStates),
  data_source_categories: multi(dataSources, 1, 10, ['none']),
  data_quality_state: z.enum(dataQualityStates),
  data_access_state: z.enum(dataAccessStates),
  regulated_data_categories: multi(regulatedDataCategories, 1, 8, ['none']),

  // §6.6 Capacity and constraints
  process_owner_role: trimmed(2, 80),
  change_capacity: z.enum(changeCapacities),
  implementation_timing: z.enum(implementationTimings),
  investment_constraint: z.enum(investmentConstraints).optional(),
  stakeholder_roles: z.array(trimmed(2, 80)).max(8).optional(),
  known_dependencies: optionalTrimmed(500),
  known_risks: optionalTrimmed(500),

  // §6.7 Final context and acknowledgement
  additional_context: optionalTrimmed(1000),
  prohibited_data_acknowledgement: z.literal(true),
});

export const paidQuestionnaireSchema = questionnaireObject.superRefine((value, context) => {
  // §6.8: metrics are only meaningful against a measured or estimated baseline.
  if (
    (value.baseline_availability === 'not_measured' || value.baseline_availability === 'unknown') &&
    value.baseline_metrics !== undefined &&
    value.baseline_metrics.length > 0
  ) {
    context.addIssue({
      code: 'custom',
      path: ['baseline_metrics'],
      message: 'baseline_metrics must be absent when no baseline is available.',
    });
  }

  // §6.8: step sequences must be exactly 1..n with no duplicates or gaps, and
  // step ids must be unique.
  const sequences = value.workflow_steps.map((step) => step.sequence).sort((a, b) => a - b);
  const contiguous = sequences.every((sequence, index) => sequence === index + 1);
  if (!contiguous) {
    context.addIssue({
      code: 'custom',
      path: ['workflow_steps'],
      message: 'Step sequences must be contiguous integers starting at 1.',
    });
  }
  const stepIds = new Set(value.workflow_steps.map((step) => step.step_id));
  if (stepIds.size !== value.workflow_steps.length) {
    context.addIssue({
      code: 'custom',
      path: ['workflow_steps'],
      message: 'Step ids must be unique.',
    });
  }

  // §6.8: an inventory row must belong to a selected system category.
  for (const [index, item] of (value.system_inventory ?? []).entries()) {
    if (!value.system_categories.includes(item.category_id)) {
      context.addIssue({
        code: 'custom',
        path: ['system_inventory', index, 'category_id'],
        message: 'Inventory category must be one of the selected system categories.',
      });
    }
  }

  // §7: for regulated_data, none and unknown are mutually exclusive (none is
  // already exclusive with everything via the multi helper).
  if (
    value.regulated_data_categories.includes('none') &&
    value.regulated_data_categories.includes('unknown')
  ) {
    context.addIssue({
      code: 'custom',
      path: ['regulated_data_categories'],
      message: '"none" and "unknown" are mutually exclusive.',
    });
  }

  // Stakeholder roles must be unique like every multi-value field.
  const roles = value.stakeholder_roles ?? [];
  if (new Set(roles).size !== roles.length) {
    context.addIssue({
      code: 'custom',
      path: ['stakeholder_roles'],
      message: 'Stakeholder roles must be unique.',
    });
  }
});

export type PaidQuestionnaire = z.infer<typeof paidQuestionnaireSchema>;
