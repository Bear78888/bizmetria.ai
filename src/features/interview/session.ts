/**
 * Starting an interview (PS-004 §9, amended 2026-08-02).
 *
 * The customer chooses how to answer: the written questionnaire or the voice
 * interview — the interview no longer requires a completed questionnaire, so
 * a web call can start straight after purchase. It is still created only for
 * the assessment's owner, and only once affirmative consent has been captured
 * in the UI — capture stays off until the consent state is true (§9.1), which
 * is why consent is a required input here rather than something the agent
 * asks for after recording has already begun.
 */

import { InterviewError, type InterviewSession, type InterviewStore } from './store';

export const INTERVIEW_CONSENT_POLICY_VERSION = 'interview-consent/en-es/1.0.0';
export const MAX_INTERVIEW_ATTEMPTS = 10;

/** The provider client surface this feature needs; a test double implements it. */
export interface InterviewRetell {
  createWebCall(input: {
    readonly agentId: string;
    readonly metadata: Record<string, string>;
  }): Promise<{ readonly callId: string; readonly accessToken: string }>;
}

const STARTABLE_ASSESSMENT_STATUSES = new Set([
  'not_started',
  'in_progress',
  'questionnaire_complete',
  'interview_ready',
]);

export type StartRejection =
  'not_found' | 'not_startable' | 'attempts_exhausted' | 'consent_missing';

export type StartOutcome =
  | {
      readonly started: true;
      readonly session: InterviewSession;
      readonly callId: string;
      readonly accessToken: string;
    }
  | { readonly started: false; readonly reason: StartRejection };

export async function startInterview(
  store: InterviewStore,
  retell: InterviewRetell,
  input: {
    readonly assessmentId: string;
    readonly customerProfileId: string;
    readonly consentGranted: boolean;
    readonly agentIdByLocale: Readonly<Record<string, string>>;
  },
): Promise<StartOutcome> {
  if (!input.consentGranted) {
    return { started: false, reason: 'consent_missing' };
  }

  const assessment = await store.findAssessmentForProfile(input);
  if (!assessment) {
    return { started: false, reason: 'not_found' };
  }
  if (!STARTABLE_ASSESSMENT_STATUSES.has(assessment.status)) {
    return { started: false, reason: 'not_startable' };
  }

  const priorAttempts = await store.countSessions(assessment.id);
  if (priorAttempts >= MAX_INTERVIEW_ATTEMPTS) {
    return { started: false, reason: 'attempts_exhausted' };
  }

  const locale = assessment.preferredLocale === 'es' ? 'es' : 'en';
  const agentId = input.agentIdByLocale[locale];
  if (!agentId) {
    throw new InterviewError(
      'agent_unconfigured',
      `No Retell agent configured for locale ${locale}.`,
    );
  }

  const session = await store.createSession({
    paidAssessmentId: assessment.id,
    preferredLocale: locale,
    attemptNumber: priorAttempts + 1,
    providerAgentId: agentId,
    consent: {
      grantedAt: new Date().toISOString(),
      policyVersion: INTERVIEW_CONSENT_POLICY_VERSION,
    },
  });

  // The session id rides in call metadata: the webhook reads it back to tie
  // provider events to this row without trusting anything client-controlled.
  const call = await retell.createWebCall({
    agentId,
    metadata: { bizmetria_interview_session_id: session.id },
  });

  await store.attachCall(session.id, call.callId);

  if (assessment.status !== 'interview_ready') {
    await store.updateAssessmentStatus(assessment.id, 'interview_ready');
  }

  return { started: true, session, callId: call.callId, accessToken: call.accessToken };
}
