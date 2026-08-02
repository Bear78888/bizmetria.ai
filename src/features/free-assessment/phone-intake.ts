import 'server-only';

import { createHash } from 'node:crypto';

import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';

import { sendResultEmail } from './email';
import { buildPublicResult } from './result';
import { answersSchema, freeAssessmentSubmissionSchema } from './schema';
import { scoreAssessment } from './score';
import { storeAssessment } from './storage';

/**
 * Free check by phone: the caller answered the 11 questions in conversation
 * with the free-check agent; this module turns the transcript into the same
 * deterministic submission the web form produces — extraction only maps
 * spoken answers onto the canonical option ids, the score stays rule-based.
 */

const EXTRACTION_MODEL = 'claude-opus-5';

// Structured outputs need every property present, so the extraction shape
// mirrors the answers schema with required fields; emptiness is expressed as
// '' and cleaned up before the real submission schema validates.
const extractionSchema = z.object({
  locale: z.enum(['en', 'es']),
  answers: z.object({
    Q01: answersSchema.shape.Q01,
    businessTypeOther: z.string(),
    Q02: answersSchema.shape.Q02,
    Q03: answersSchema.shape.Q03,
    Q04: answersSchema.shape.Q04,
    Q05: answersSchema.shape.Q05,
    Q06: answersSchema.shape.Q06,
    Q07: answersSchema.shape.Q07,
    Q08: answersSchema.shape.Q08,
    Q09: answersSchema.shape.Q09,
    Q10: answersSchema.shape.Q10,
    Q11: answersSchema.shape.Q11,
  }),
  contact: z.object({
    contactName: z.string(),
    businessName: z.string(),
    email: z.string(),
  }),
  /** False when the caller never gave an address or declined the email. */
  emailCaptured: z.boolean(),
});

const EXTRACTION_SYSTEM = `You turn a transcript of BizMetria's free AI-opportunity phone check into structured data.

Rules:
- Map each spoken answer onto the closest canonical option id from the schema. Prefer what the caller actually said over what the agent suggested.
- Multi-select questions (Q04 lead channels, Q07 manual work areas) collect every option the caller named; never invent ones they did not mention. Q07 "none" stands alone.
- If a question was genuinely not answered, choose the most conservative option the conversation supports; never fabricate specifics.
- businessTypeOther is filled only when Q01 is "other", else empty string.
- Contact: the caller's name, business name, and email exactly as confirmed in the call (the agent spells emails back). If no email was confirmed, set email to an empty string and emailCaptured to false.
- locale is the language the conversation was mainly held in.`;

/** Deterministic UUID derived from the provider call id, so retries collapse. */
export function callIdempotencyKey(callId: string): string {
  const hex = createHash('sha256').update(`bizmetria-free-phone:${callId}`).digest('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `4${hex.slice(13, 16)}`,
    `8${hex.slice(17, 20)}`,
    hex.slice(20, 32),
  ].join('-');
}

export type PhoneIntakeOutcome =
  | { readonly outcome: 'processed'; readonly assessmentId: string; readonly delivery: string }
  | { readonly outcome: 'skipped'; readonly reason: string };

export async function processFreeCheckCall(input: {
  readonly callId: string;
  readonly transcript: string;
  readonly callerNumber: string | null;
}): Promise<PhoneIntakeOutcome> {
  if (input.transcript.trim().length < 200) {
    return { outcome: 'skipped', reason: 'transcript_too_short' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { outcome: 'skipped', reason: 'extraction_unconfigured' };

  const client = new Anthropic({ apiKey });
  const response = await client.messages.parse({
    model: EXTRACTION_MODEL,
    max_tokens: 2_000,
    system: EXTRACTION_SYSTEM,
    messages: [{ role: 'user', content: `TRANSCRIPT:\n${input.transcript}` }],
    output_config: { format: zodOutputFormat(extractionSchema) },
  });
  const extracted = response.parsed_output;
  if (!extracted) return { outcome: 'skipped', reason: 'extraction_unparseable' };

  if (!extracted.emailCaptured || !extracted.contact.email.trim()) {
    // Without a confirmed address there is nowhere to deliver the result and
    // no service-message consent; the call is not stored as a lead.
    return { outcome: 'skipped', reason: 'no_confirmed_email' };
  }

  const phone = input.callerNumber?.trim() ?? '';
  const submission = freeAssessmentSubmissionSchema.safeParse({
    schemaVersion: 'free-audit-schema/1.0.0',
    locale: extracted.locale,
    idempotencyKey: callIdempotencyKey(input.callId),
    answers: {
      ...extracted.answers,
      ...(extracted.answers.businessTypeOther.trim()
        ? { businessTypeOther: extracted.answers.businessTypeOther.trim() }
        : { businessTypeOther: undefined }),
    },
    contact: {
      contactName: extracted.contact.contactName.trim(),
      businessName: extracted.contact.businessName.trim(),
      email: extracted.contact.email.trim().toLowerCase(),
      website: '',
      ...(phone && /^\+?[0-9 ()-]{7,20}$/u.test(phone) ? { phone } : { phone: '' }),
      preferredLanguage: extracted.locale,
    },
    consent: {
      // The agent asks permission to email the result; that is the
      // transactional service message only — marketing stays opt-in elsewhere.
      emailMarketing: false,
      smsMarketing: false,
      policyVersion: 'consent-copy/en-es/1.0.0',
    },
  });

  if (!submission.success) {
    const fields = submission.error.issues.map((issue) => issue.path.join('.')).join(', ');
    return { outcome: 'skipped', reason: `extraction_invalid: ${fields}` };
  }

  const score = scoreAssessment(submission.data.answers);
  const stored = await storeAssessment(submission.data, score);
  const result = buildPublicResult(stored.assessmentId, submission.data.locale, score);
  const delivery = await sendResultEmail(submission.data.contact.email, result);

  return { outcome: 'processed', assessmentId: stored.assessmentId, delivery };
}
