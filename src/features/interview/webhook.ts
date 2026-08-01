/**
 * Retell webhook processing, pure over the store interface.
 *
 * Retell events carry no event id, so the dedupe key is `${event}:${call_id}`
 * — each lifecycle stage of a call is processed once. The interview session
 * is identified from call metadata written at creation time, never from
 * anything the caller controls. Sanitized payloads keep event type and call
 * id only: transcripts and any spoken content go to their own tables, not
 * into webhook bookkeeping (PS-004 §5 prohibits content in logs).
 */

import { createHash } from 'node:crypto';

import type { InterviewStore } from './store';

export interface RetellCallPayload {
  readonly call_id?: string;
  readonly call_status?: string;
  readonly start_timestamp?: number;
  readonly end_timestamp?: number;
  readonly transcript?: string;
  readonly transcript_object?: readonly Record<string, unknown>[];
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface RetellEvent {
  readonly event?: string;
  readonly call?: RetellCallPayload;
}

export type WebhookOutcome =
  | { readonly outcome: 'processed' }
  | { readonly outcome: 'ignored'; readonly reason: string }
  | { readonly outcome: 'failed'; readonly reason: string; readonly retryable: boolean };

const HANDLED_EVENTS = new Set(['call_started', 'call_ended', 'call_analyzed']);

function toIso(timestampMs: number | undefined): string | null {
  return typeof timestampMs === 'number' ? new Date(timestampMs).toISOString() : null;
}

export async function processRetellEvent(
  store: InterviewStore,
  rawBody: string,
  event: RetellEvent,
): Promise<WebhookOutcome> {
  const eventType = event.event ?? 'unknown';
  const callId = event.call?.call_id;

  if (!HANDLED_EVENTS.has(eventType) || !callId) {
    return { outcome: 'ignored', reason: 'unhandled_event' };
  }

  const externalEventId = `${eventType}:${callId}`;
  const admission = await store.beginWebhookEvent({
    externalEventId,
    eventType,
    payloadHash: createHash('sha256').update(rawBody).digest('hex'),
    sanitizedPayload: { event: eventType, call_id: callId },
  });
  if (admission === 'duplicate') {
    return { outcome: 'ignored', reason: 'duplicate' };
  }

  try {
    const sessionId = event.call?.metadata?.bizmetria_interview_session_id;
    if (typeof sessionId !== 'string' || sessionId.length === 0) {
      // A call this application did not create (another integration on the
      // same Retell account). Nothing to do, permanently.
      await store.finishWebhookEvent(externalEventId, 'ignored', 'foreign_call');
      return { outcome: 'ignored', reason: 'foreign_call' };
    }

    const session = await store.findSessionById(sessionId);
    if (!session) {
      // The session insert may still be in flight; Retell retries.
      await store.finishWebhookEvent(externalEventId, 'failed', 'session_not_found');
      return { outcome: 'failed', reason: 'session_not_found', retryable: true };
    }

    const startedAt = toIso(event.call?.start_timestamp);
    const endedAt = toIso(event.call?.end_timestamp);

    if (eventType === 'call_started') {
      await store.updateSessionStatus(sessionId, 'in_progress', {
        ...(startedAt ? { startedAt } : {}),
      });
      await store.finishWebhookEvent(externalEventId, 'processed');
      return { outcome: 'processed' };
    }

    // call_ended and call_analyzed both persist the call record; the
    // transcript lands with whichever event carries it (analysis usually
    // supersedes the raw end-of-call transcript).
    const callRecordId = await store.recordCall({
      interviewSessionId: sessionId,
      providerCallId: callId,
      status: eventType === 'call_analyzed' ? 'analyzed' : 'ended',
      startedAt,
      endedAt,
    });

    const transcriptText = event.call?.transcript;
    if (typeof transcriptText === 'string' && transcriptText.length > 0) {
      await store.recordTranscript({
        callRecordId,
        preferredLocale: session.preferredLocale,
        transcriptText,
        transcriptSegments: event.call?.transcript_object ?? [],
      });
      await store.updateSessionStatus(sessionId, 'completed', {
        ...(endedAt ? { endedAt } : {}),
      });
      await store.updateAssessmentStatus(session.paidAssessmentId, 'interview_complete');
    } else if (eventType === 'call_ended') {
      // Ended without any transcript: the customer never spoke or the call
      // failed to connect. The session is closed but the assessment stays
      // ready for another attempt.
      await store.updateSessionStatus(sessionId, 'interrupted', {
        ...(endedAt ? { endedAt } : {}),
      });
    }

    await store.finishWebhookEvent(externalEventId, 'processed');
    return { outcome: 'processed' };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown_error';
    await store
      .finishWebhookEvent(externalEventId, 'failed', 'store_failure')
      .catch(() => undefined);
    return { outcome: 'failed', reason, retryable: true };
  }
}
