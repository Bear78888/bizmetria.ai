import { describe, expect, it } from 'vitest';

import { buildPublicResult } from '../../src/features/free-assessment/result';
import {
  freeAssessmentSubmissionSchema,
  type AssessmentAnswers,
} from '../../src/features/free-assessment/schema';
import { scoreAssessment } from '../../src/features/free-assessment/score';

const baseAnswers: AssessmentAnswers = {
  Q01: 'professional_services',
  Q02: 'solo',
  Q03: 'zero_to_10',
  Q04: ['email'],
  Q05: 'within_5_minutes',
  Q06: 'integrated_crm',
  Q07: ['none'],
  Q08: 'automated_multi_step_follow_up',
  Q09: 'other',
  Q10: 'other',
  Q11: 'just_exploring',
};

const boundaryVectors: readonly [
  string,
  Partial<AssessmentAnswers>,
  readonly [number, number, number, number, number, number, string],
][] = [
  ['FA-V000', {}, [0, 0, 0, 0, 0, 0, 'FOCUSED']],
  [
    'FA-V024',
    {
      Q06: 'basic_or_partially_used_crm',
      Q09: 'limited_visibility_or_reporting',
      Q10: 'improve_customer_experience',
      Q11: 'start_now',
    },
    [0, 0, 5, 15, 4, 24, 'FOCUSED'],
  ],
  [
    'FA-V025',
    {
      Q06: 'inbox_notes_or_multiple_places',
      Q09: 'limited_visibility_or_reporting',
      Q10: 'improve_customer_experience',
      Q11: 'within_6_to_12_months',
    },
    [0, 0, 15, 4, 6, 25, 'MODERATE'],
  ],
  [
    'FA-V044',
    {
      Q06: 'inbox_notes_or_multiple_places',
      Q07: ['lead_intake'],
      Q09: 'limited_visibility_or_reporting',
      Q10: 'improve_customer_experience',
      Q11: 'start_now',
    },
    [0, 6, 15, 15, 8, 44, 'MODERATE'],
  ],
  [
    'FA-V045',
    { Q06: 'no_consistent_system', Q07: ['lead_intake'], Q11: 'start_now' },
    [0, 6, 20, 15, 4, 45, 'STRONG'],
  ],
  [
    'FA-V064',
    {
      Q06: 'no_consistent_system',
      Q07: ['lead_intake', 'scheduling', 'data_entry', 'reporting'],
      Q11: 'start_now',
    },
    [0, 25, 20, 15, 4, 64, 'STRONG'],
  ],
  [
    'FA-V065',
    {
      Q04: ['phone', 'email', 'website_form'],
      Q06: 'inbox_notes_or_multiple_places',
      Q07: ['lead_intake', 'scheduling', 'data_entry', 'reporting'],
      Q09: 'limited_visibility_or_reporting',
      Q10: 'improve_customer_experience',
      Q11: 'start_now',
    },
    [0, 25, 15, 15, 10, 65, 'HIGH'],
  ],
  [
    'FA-V079',
    {
      Q06: 'inbox_notes_or_multiple_places',
      Q07: ['lead_intake', 'scheduling', 'data_entry', 'reporting'],
      Q08: 'no_defined_follow_up',
      Q09: 'limited_visibility_or_reporting',
      Q10: 'improve_customer_experience',
      Q11: 'start_now',
    },
    [14, 25, 15, 15, 10, 79, 'HIGH'],
  ],
  [
    'FA-V080',
    {
      Q06: 'no_consistent_system',
      Q07: ['lead_intake', 'scheduling', 'data_entry', 'reporting'],
      Q08: 'no_defined_follow_up',
      Q11: 'start_now',
    },
    [14, 25, 20, 15, 6, 80, 'VERY_HIGH'],
  ],
  [
    'FA-V100',
    {
      Q05: 'next_day_or_later',
      Q06: 'no_consistent_system',
      Q07: ['lead_intake', 'scheduling', 'data_entry', 'reporting'],
      Q08: 'no_defined_follow_up',
      Q09: 'limited_visibility_or_reporting',
      Q11: 'start_now',
    },
    [30, 25, 20, 15, 10, 100, 'VERY_HIGH'],
  ],
];

describe('AI Opportunity Score', () => {
  it.each(boundaryVectors)(
    '%s matches the approved score boundary',
    (_name, overrides, expected) => {
      const score = scoreAssessment({ ...baseAnswers, ...overrides });

      expect([
        score.leadResponseFollowUp,
        score.manualWork,
        score.systemsData,
        score.strategicPriorityUrgency,
        score.opportunityBreadth,
        score.totalScore,
        score.scoreBand,
      ]).toEqual(expected);
      expect(score.opportunityAreas.length).toBeLessThanOrEqual(3);
    },
  );

  it('is deterministic and keeps fixed block priority for normalized ties', () => {
    const answers: AssessmentAnswers = {
      ...baseAnswers,
      Q06: 'no_consistent_system',
      Q07: ['lead_intake', 'scheduling', 'data_entry', 'reporting'],
    };
    const results = Array.from({ length: 100 }, () => scoreAssessment(answers));

    expect(new Set(results.map((result) => JSON.stringify(result))).size).toBe(1);
    expect(results[0]?.opportunityAreas.map((area) => area.id)).toEqual([
      'manual_work',
      'systems_data',
      'opportunity_breadth',
    ]);
  });

  it('rejects duplicate and incompatible multi-select answers', () => {
    const payload = {
      schemaVersion: 'free-audit-schema/1.0.0',
      locale: 'en',
      idempotencyKey: crypto.randomUUID(),
      answers: { ...baseAnswers, Q04: ['email', 'email'], Q07: ['none', 'lead_intake'] },
      contact: {
        contactName: 'Synthetic Person',
        businessName: 'Synthetic Business',
        email: 'synthetic@example.invalid',
        website: '',
        phone: '',
        preferredLanguage: 'en',
      },
      consent: {
        emailMarketing: false,
        smsMarketing: false,
        policyVersion: 'consent-copy/en-es/1.0.0',
      },
      companyWebsite: '',
    };

    const validation = freeAssessmentSubmissionSchema.safeParse(payload);
    expect(validation.success).toBe(false);
  });

  it('returns only the approved free result boundary', () => {
    const score = scoreAssessment({
      ...baseAnswers,
      Q05: 'next_day_or_later',
      Q06: 'no_consistent_system',
      Q07: ['lead_intake', 'scheduling', 'data_entry', 'reporting'],
      Q08: 'no_defined_follow_up',
      Q09: 'limited_visibility_or_reporting',
      Q11: 'start_now',
    });
    const result = buildPublicResult('synthetic-assessment', 'en', score);
    const serialized = JSON.stringify(result);

    expect(result.score.total).toBe(100);
    expect(result.lockedSections).toHaveLength(6);
    expect(result.opportunityAreas).toHaveLength(3);
    expect(serialized).not.toContain('Q01');
    expect(serialized).not.toContain('professional_services');
    expect(result.offer).toMatchObject({ amount: 299, implementationIncluded: false });
  });
});
