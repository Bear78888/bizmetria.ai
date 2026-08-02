import { z } from 'zod';

export const answerIds = {
  businessType: [
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
  ],
  teamSize: ['solo', 'team_2_5', 'team_6_10', 'team_11_25', 'team_26_50', 'team_51_plus'],
  monthlyNewInquiries: [
    'zero_to_10',
    'eleven_to_30',
    'thirty_one_to_100',
    'one_hundred_one_to_300',
    'over_300',
    'unknown',
  ],
  leadChannels: [
    'phone',
    'sms',
    'email',
    'website_form',
    'web_chat',
    'social_direct_messages',
    'marketplace_platform',
    'in_person',
    'other',
  ],
  firstResponseSpeed: [
    'within_5_minutes',
    'six_to_15_minutes',
    'sixteen_to_60_minutes',
    'one_to_4_hours',
    'same_day',
    'next_day_or_later',
  ],
  customerTrackingSystem: [
    'integrated_crm',
    'basic_or_partially_used_crm',
    'spreadsheet_or_project_tool',
    'inbox_notes_or_multiple_places',
    'no_consistent_system',
  ],
  manualWorkAreas: [
    'lead_intake',
    'follow_up',
    'scheduling',
    'quotes_or_proposals',
    'data_entry',
    'customer_support',
    'billing_or_collections',
    'reporting',
    'marketing',
    'internal_coordination',
    'other',
    'none',
  ],
  unconvertedLeadFollowUp: [
    'automated_multi_step_follow_up',
    'consistent_manual_follow_up',
    'occasional_follow_up',
    'no_defined_follow_up',
  ],
  primaryBusinessProblem: [
    'slow_lead_response',
    'lost_or_untracked_leads',
    'too_much_manual_work',
    'inconsistent_follow_up',
    'disconnected_systems',
    'limited_visibility_or_reporting',
    'customer_service_capacity',
    'marketing_or_sales_consistency',
    'other',
  ],
  desired90DayOutcome: [
    'respond_faster',
    'convert_more_existing_leads',
    'reduce_manual_work',
    'improve_customer_experience',
    'organize_data_and_systems',
    'improve_reporting',
    'scale_without_equivalent_hiring',
    'identify_best_ai_priorities',
    'other',
  ],
  improvementUrgency: [
    'just_exploring',
    'within_6_to_12_months',
    'within_3_to_6_months',
    'within_1_to_3_months',
    'start_now',
  ],
} as const;

export const answersSchema = z
  .strictObject({
    Q01: z.enum(answerIds.businessType),
    businessTypeOther: z.string().trim().max(80).optional(),
    Q02: z.enum(answerIds.teamSize),
    Q03: z.enum(answerIds.monthlyNewInquiries),
    Q04: z.array(z.enum(answerIds.leadChannels)).min(1).max(9),
    Q05: z.enum(answerIds.firstResponseSpeed),
    Q06: z.enum(answerIds.customerTrackingSystem),
    Q07: z.array(z.enum(answerIds.manualWorkAreas)).min(1).max(12),
    Q08: z.enum(answerIds.unconvertedLeadFollowUp),
    Q09: z.enum(answerIds.primaryBusinessProblem),
    Q10: z.enum(answerIds.desired90DayOutcome),
    Q11: z.enum(answerIds.improvementUrgency),
  })
  .superRefine((answers, context) => {
    if (
      answers.Q01 === 'other' &&
      (!answers.businessTypeOther || answers.businessTypeOther.length < 2)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['businessTypeOther'],
        message: 'A business type is required when Other is selected.',
      });
    }

    if (answers.Q07.includes('none') && answers.Q07.length > 1) {
      context.addIssue({
        code: 'custom',
        path: ['Q07'],
        message: 'None cannot be combined with another manual-work answer.',
      });
    }

    for (const questionId of ['Q04', 'Q07'] as const) {
      if (new Set(answers[questionId]).size !== answers[questionId].length) {
        context.addIssue({
          code: 'custom',
          path: [questionId],
          message: 'Multi-select answers cannot contain duplicate values.',
        });
      }
    }
  });

const optionalWebsite = z.union([z.literal(''), z.url()]).optional();
const optionalPhone = z
  .union([
    z.literal(''),
    z
      .string()
      .trim()
      .regex(/^\+?[0-9 ()-]{7,20}$/u),
  ])
  .optional();

export const freeAssessmentSubmissionSchema = z
  .strictObject({
    schemaVersion: z.literal('free-audit-schema/1.0.0'),
    locale: z.enum(['en', 'es']),
    idempotencyKey: z.uuid(),
    answers: answersSchema,
    contact: z.strictObject({
      contactName: z.string().trim().min(2).max(100),
      businessName: z.string().trim().min(2).max(140),
      email: z.string().trim().email().max(254),
      website: optionalWebsite,
      phone: optionalPhone,
      preferredLanguage: z.enum(['en', 'es']),
    }),
    consent: z.strictObject({
      emailMarketing: z.boolean(),
      smsMarketing: z.boolean(),
      policyVersion: z.literal('consent-copy/en-es/1.0.0'),
    }),
    companyWebsite: z.string().max(0).optional(),
  })
  .superRefine((submission, context) => {
    if (submission.consent.smsMarketing && !submission.contact.phone) {
      context.addIssue({
        code: 'custom',
        path: ['contact', 'phone'],
        message: 'A valid phone number is required for SMS consent.',
      });
    }
  });

export type FreeAssessmentSubmission = z.infer<typeof freeAssessmentSubmissionSchema>;
export type AssessmentAnswers = FreeAssessmentSubmission['answers'];
export type AssessmentLocale = FreeAssessmentSubmission['locale'];

export const QUESTION_IDS = [
  'Q01',
  'Q02',
  'Q03',
  'Q04',
  'Q05',
  'Q06',
  'Q07',
  'Q08',
  'Q09',
  'Q10',
  'Q11',
] as const;

export type QuestionId = (typeof QUESTION_IDS)[number];
