/**
 * Persistence boundary for the Retell interview flow.
 *
 * Mirrors the checkout design: the webhook processor and session logic are
 * pure functions over this interface, testable with an in-memory double,
 * while the Supabase implementation stays a thin mapping onto tables whose
 * constraints (test-mode-only, status registries) already encode the rules.
 */

export class InterviewError extends Error {
  readonly code: string;

  constructor(code: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'InterviewError';
    this.code = code;
  }
}

export interface InterviewAssessment {
  readonly id: string;
  readonly customerProfileId: string;
  readonly status: string;
  readonly preferredLocale: string;
}

export interface InterviewSession {
  readonly id: string;
  readonly paidAssessmentId: string;
  readonly status: string;
  readonly attemptNumber: number;
  readonly preferredLocale: string;
}

export type EventAdmission = 'new' | 'retry' | 'duplicate';

export interface InterviewStore {
  /** Loads an assessment the profile owns, or null. */
  findAssessmentForProfile(input: {
    readonly assessmentId: string;
    readonly customerProfileId: string;
  }): Promise<InterviewAssessment | null>;

  /** Counts prior interview sessions for the assessment (for attempt_number). */
  countSessions(assessmentId: string): Promise<number>;

  createSession(input: {
    readonly paidAssessmentId: string;
    readonly preferredLocale: string;
    readonly attemptNumber: number;
    readonly providerAgentId: string;
    /** Consent captured in the UI before any call exists (PS-004 §9.1). */
    readonly consent: { readonly grantedAt: string; readonly policyVersion: string };
  }): Promise<InterviewSession>;

  /** Attaches the provider call id once the web call is created. */
  attachCall(sessionId: string, providerCallId: string): Promise<void>;

  findSessionById(sessionId: string): Promise<InterviewSession | null>;

  updateSessionStatus(
    sessionId: string,
    status: string,
    timestamps?: { readonly startedAt?: string; readonly endedAt?: string },
  ): Promise<void>;

  /** Marks the owning assessment's status (interview_ready / interview_complete). */
  updateAssessmentStatus(assessmentId: string, status: string): Promise<void>;

  /** Upserts the call record for a provider call. Returns its id. */
  recordCall(input: {
    readonly interviewSessionId: string;
    readonly providerCallId: string;
    readonly status: string;
    readonly startedAt: string | null;
    readonly endedAt: string | null;
  }): Promise<string>;

  /** Stores the transcript for a call record; idempotent per call record. */
  recordTranscript(input: {
    readonly callRecordId: string;
    readonly preferredLocale: string;
    readonly transcriptText: string;
    readonly transcriptSegments: readonly Record<string, unknown>[];
  }): Promise<void>;

  /** Webhook dedupe, same semantics as the Stripe store. */
  beginWebhookEvent(input: {
    readonly externalEventId: string;
    readonly eventType: string;
    readonly payloadHash: string;
    readonly sanitizedPayload: Record<string, unknown>;
  }): Promise<EventAdmission>;

  finishWebhookEvent(
    externalEventId: string,
    outcome: 'processed' | 'ignored' | 'failed',
    errorCode?: string,
  ): Promise<void>;
}
