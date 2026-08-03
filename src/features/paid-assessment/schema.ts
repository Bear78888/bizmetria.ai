import { z } from 'zod';

/**
 * The paid questionnaire. Field IDs, enum IDs and bounds come from the PS-004
 * contract; 1.1.0 relaxes it so that only a small core is required and a
 * partially filled repeater row never blocks saving — the interview covers
 * whatever the customer leaves blank.
 */
export const PAID_ASSESSMENT_SCHEMA_VERSION = 'paid-assessment-schema/1.1.0';

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

// Rows are tolerant on purpose: a half-filled row still saves, and whatever
// is missing gets covered in the interview instead of blocking the form.
const baselineMetricSchema = z.object({
  metric_id: z
    .enum(successMeasures.filter((id) => id !== 'not_currently_measured') as never)
    .optional(),
  value_band_or_text: optionalTrimmed(80),
  unit: optionalTrimmed(40),
  period: optionalTrimmed(40),
  quality: z.enum(['measured', 'estimated']).optional(),
});

const workflowStepSchema = z.object({
  step_id: trimmed(1, 80),
  sequence: z.number().int().min(1),
  step_label: optionalTrimmed(80),
  owner_role: optionalTrimmed(80),
  work_mode: z.enum(workModes).optional(),
  system_category: z.enum(systemCategories).optional(),
});

const systemInventoryItemSchema = z.object({
  category_id: z.enum(systemCategories.filter((id) => id !== 'none') as never).optional(),
  product_label: optionalTrimmed(80),
  purpose: optionalTrimmed(120),
});

// --- The questionnaire ---

const questionnaireObject = z.object({
  schemaVersion: z.literal(PAID_ASSESSMENT_SCHEMA_VERSION),
  locale: z.enum(['en', 'es']),

  // §6.2 Participant and scope. Only the participant's role and the industry
  // are required — without them the analysis has no frame at all.
  participant_role: z.enum(participantRoles),
  decision_authority: z.enum(decisionAuthorities).optional(),
  assessment_scope: z.enum(assessmentScopes).optional(),
  industry_category: z.enum(industryCategories),
  business_model: multi(businessModels, 1, 3).optional(),
  service_delivery_mode: z.enum(serviceDeliveryModes).optional(),

  // §6.3 Objectives and success
  primary_objective: z.enum(objectives),
  objective_detail: optionalTrimmed(500),
  priority_horizon: z.enum(priorityHorizons).optional(),
  target_outcomes: multi(objectives, 1, 3).optional(),
  success_measure_ids: multi(successMeasures, 1, 5, ['not_currently_measured']).optional(),
  baseline_availability: z.enum(baselineAvailabilities).optional(),
  baseline_metrics: z.array(baselineMetricSchema).max(5).optional(),
  nonnegotiable_constraints: multi(constraints, 1, 8, ['none']).optional(),

  // §6.4 Primary workflow
  workflow_focus_areas: multi(workflowAreas, 1, 3).optional(),
  primary_workflow_name: trimmed(3, 80),
  workflow_trigger: optionalTrimmed(300),
  workflow_desired_outcome: optionalTrimmed(300),
  workflow_steps: z.array(workflowStepSchema).max(12).optional(),
  workflow_frequency: z.enum(workflowFrequencies).optional(),
  workflow_volume_band: z.enum(workflowVolumes).optional(),
  handoff_count_band: z.enum(handoffCounts).optional(),
  exception_frequency: z.enum(exceptionFrequencies).optional(),
  primary_bottleneck: z.enum(bottlenecks).optional(),
  bottleneck_detail: optionalTrimmed(500),
  delay_band: z.enum(delayBands).optional(),
  manual_effort_band: z.enum(manualEfforts).optional(),
  rework_frequency: z.enum(reworkFrequencies).optional(),

  // §6.5 Systems and data
  system_categories: multi(systemCategories, 1, 10, ['none']).optional(),
  system_inventory: z.array(systemInventoryItemSchema).max(10).optional(),
  integration_state: z.enum(integrationStates).optional(),
  data_source_categories: multi(dataSources, 1, 10, ['none']).optional(),
  data_quality_state: z.enum(dataQualityStates).optional(),
  data_access_state: z.enum(dataAccessStates).optional(),
  regulated_data_categories: multi(regulatedDataCategories, 1, 8, ['none']).optional(),

  // §6.6 Capacity and constraints
  process_owner_role: optionalTrimmed(80),
  change_capacity: z.enum(changeCapacities).optional(),
  implementation_timing: z.enum(implementationTimings).optional(),
  investment_constraint: z.enum(investmentConstraints).optional(),
  // Blank rows are dropped rather than rejected: an extra empty "Add" row
  // must never invalidate the whole field.
  stakeholder_roles: z
    .array(z.string().trim().max(80))
    .max(8)
    .transform((roles) => {
      const filled = roles.filter((role) => role.length > 0);
      return filled.length > 0 ? filled : undefined;
    })
    .optional(),
  known_dependencies: optionalTrimmed(500),
  known_risks: optionalTrimmed(500),

  // §6.7 Final context and acknowledgement
  additional_context: optionalTrimmed(1000),
  prohibited_data_acknowledgement: z.literal(true),
});

export const paidQuestionnaireSchema = questionnaireObject.superRefine((value, context) => {
  // §6.8: step ids must be unique — the client generates them, so a clash is
  // a bug, not a customer mistake.
  const steps = value.workflow_steps ?? [];
  const stepIds = new Set(steps.map((step) => step.step_id));
  if (stepIds.size !== steps.length) {
    context.addIssue({
      code: 'custom',
      path: ['workflow_steps'],
      message: 'Step ids must be unique.',
    });
  }

  // §7: for regulated_data, none and unknown are mutually exclusive (none is
  // already exclusive with everything via the multi helper).
  const regulated = value.regulated_data_categories ?? [];
  if (regulated.includes('none') && regulated.includes('unknown')) {
    context.addIssue({
      code: 'custom',
      path: ['regulated_data_categories'],
      message: '"none" and "unknown" are mutually exclusive.',
    });
  }
});

export type PaidQuestionnaire = z.infer<typeof paidQuestionnaireSchema>;
