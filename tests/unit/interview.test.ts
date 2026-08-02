import { describe, expect, it } from 'vitest';

import { startInterview, type InterviewRetell } from '../../src/features/interview/session';
import type {
  InterviewAssessment,
  InterviewSession,
  InterviewStore,
} from '../../src/features/interview/store';
import { InterviewError } from '../../src/features/interview/store';
import { processRetellEvent, type RetellEvent } from '../../src/features/interview/webhook';

const ASSESSMENT_ID = '44444444-4444-4444-8444-444444444444';
const PROFILE = '11111111-1111-4111-8111-111111111111';
const AGENTS = { en: 'agent_en_123', es: 'agent_es_123' };

interface MemoryState {
  assessment: InterviewAssessment | null;
  sessions: (InterviewSession & { providerCallId?: string })[];
  calls: {
    id: string;
    interviewSessionId: string;
    providerCallId: string;
    status: string;
  }[];
  transcripts: { callRecordId: string; transcriptText: string; segments: number }[];
  events: Map<string, { status: string; errorCode?: string }>;
  assessmentStatusLog: string[];
}

function memoryState(overrides: Partial<InterviewAssessment> = {}): MemoryState {
  return {
    assessment: {
      id: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      status: 'questionnaire_complete',
      preferredLocale: 'en',
      ...overrides,
    },
    sessions: [],
    calls: [],
    transcripts: [],
    events: new Map(),
    assessmentStatusLog: [],
  };
}

function memoryStore(state: MemoryState): InterviewStore {
  let nextId = 1;
  return {
    findAssessmentForProfile: (input) =>
      Promise.resolve(
        state.assessment &&
          state.assessment.id === input.assessmentId &&
          state.assessment.customerProfileId === input.customerProfileId
          ? state.assessment
          : null,
      ),
    countSessions: (assessmentId) =>
      Promise.resolve(state.sessions.filter((s) => s.paidAssessmentId === assessmentId).length),
    createSession: (input) => {
      const session = {
        id: `session-${nextId++}`,
        paidAssessmentId: input.paidAssessmentId,
        status: 'created',
        attemptNumber: input.attemptNumber,
        preferredLocale: input.preferredLocale,
      };
      state.sessions.push(session);
      return Promise.resolve(session);
    },
    attachCall: (sessionId, providerCallId) => {
      const session = state.sessions.find((s) => s.id === sessionId);
      if (session) session.providerCallId = providerCallId;
      return Promise.resolve();
    },
    findSessionById: (sessionId) =>
      Promise.resolve(state.sessions.find((s) => s.id === sessionId) ?? null),
    updateSessionStatus: (sessionId, status) => {
      const session = state.sessions.find((s) => s.id === sessionId);
      if (session) (session as { status: string }).status = status;
      return Promise.resolve();
    },
    updateAssessmentStatus: (assessmentId, status) => {
      if (state.assessment?.id === assessmentId) {
        state.assessment = { ...state.assessment, status };
        state.assessmentStatusLog.push(status);
      }
      return Promise.resolve();
    },
    recordCall: (input) => {
      let call = state.calls.find((c) => c.providerCallId === input.providerCallId);
      if (!call) {
        call = {
          id: `call-${nextId++}`,
          interviewSessionId: input.interviewSessionId,
          providerCallId: input.providerCallId,
          status: input.status,
        };
        state.calls.push(call);
      } else {
        call.status = input.status;
      }
      return Promise.resolve(call.id);
    },
    recordTranscript: (input) => {
      const existing = state.transcripts.find((t) => t.callRecordId === input.callRecordId);
      const record = {
        callRecordId: input.callRecordId,
        transcriptText: input.transcriptText,
        segments: input.transcriptSegments.length,
      };
      if (existing) Object.assign(existing, record);
      else state.transcripts.push(record);
      return Promise.resolve();
    },
    beginWebhookEvent: (input) => {
      const existing = state.events.get(input.externalEventId);
      if (existing) {
        if (existing.status === 'processed' || existing.status === 'ignored') {
          return Promise.resolve('duplicate' as const);
        }
        existing.status = 'processing';
        return Promise.resolve('retry' as const);
      }
      state.events.set(input.externalEventId, { status: 'processing' });
      return Promise.resolve('new' as const);
    },
    finishWebhookEvent: (externalEventId, outcome, errorCode) => {
      const entry = state.events.get(externalEventId);
      if (entry) {
        entry.status = outcome;
        if (errorCode !== undefined) entry.errorCode = errorCode;
      }
      return Promise.resolve();
    },
  };
}

function fakeRetell(
  calls: { agentId: string; metadata: Record<string, string> }[],
): InterviewRetell {
  return {
    createWebCall: (input) => {
      calls.push(input);
      return Promise.resolve({ callId: `call_${calls.length}`, accessToken: 'token_abc' });
    },
  };
}

describe('startInterview', () => {
  it('creates a session and web call for a completed questionnaire', async () => {
    const state = memoryState();
    const webCalls: { agentId: string; metadata: Record<string, string> }[] = [];

    const outcome = await startInterview(memoryStore(state), fakeRetell(webCalls), {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      consentGranted: true,
      agentIdByLocale: AGENTS,
    });

    expect(outcome.started).toBe(true);
    if (outcome.started) {
      expect(outcome.session.attemptNumber).toBe(1);
      expect(outcome.accessToken).toBe('token_abc');
    }
    expect(webCalls[0]?.agentId).toBe(AGENTS.en);
    // The session id travels in call metadata for the webhook to read back.
    expect(webCalls[0]?.metadata.bizmetria_interview_session_id).toBe(state.sessions[0]?.id);
    expect(state.sessions[0]?.providerCallId).toBe('call_1');
    expect(state.assessment?.status).toBe('interview_ready');
  });

  it('never reaches the provider without affirmative consent', async () => {
    const state = memoryState();
    const webCalls: { agentId: string; metadata: Record<string, string> }[] = [];

    const outcome = await startInterview(memoryStore(state), fakeRetell(webCalls), {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      consentGranted: false,
      agentIdByLocale: AGENTS,
    });

    expect(outcome).toEqual({ started: false, reason: 'consent_missing' });
    expect(webCalls).toHaveLength(0);
    expect(state.sessions).toHaveLength(0);
  });

  it('treats another profile’s assessment as missing', async () => {
    const state = memoryState();
    const outcome = await startInterview(memoryStore(state), fakeRetell([]), {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: '99999999-9999-4999-8999-999999999999',
      consentGranted: true,
      agentIdByLocale: AGENTS,
    });
    expect(outcome).toEqual({ started: false, reason: 'not_found' });
  });

  it('starts straight after purchase: the questionnaire is optional', async () => {
    const state = memoryState({ status: 'in_progress' });
    const outcome = await startInterview(memoryStore(state), fakeRetell([]), {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      consentGranted: true,
      agentIdByLocale: AGENTS,
    });
    expect(outcome.started).toBe(true);
    expect(state.assessmentStatusLog).toContain('interview_ready');
  });

  it('refuses once the assessment has moved past the interview stage', async () => {
    const state = memoryState({ status: 'under_review' });
    const outcome = await startInterview(memoryStore(state), fakeRetell([]), {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      consentGranted: true,
      agentIdByLocale: AGENTS,
    });
    expect(outcome).toEqual({ started: false, reason: 'not_startable' });
  });

  it('stops at the attempt ceiling', async () => {
    const state = memoryState({ status: 'interview_ready' });
    const store = memoryStore(state);
    for (let attempt = 1; attempt <= 10; attempt += 1) {
      state.sessions.push({
        id: `session-existing-${attempt}`,
        paidAssessmentId: ASSESSMENT_ID,
        status: 'interrupted',
        attemptNumber: attempt,
        preferredLocale: 'en',
      });
    }

    const outcome = await startInterview(store, fakeRetell([]), {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      consentGranted: true,
      agentIdByLocale: AGENTS,
    });
    expect(outcome).toEqual({ started: false, reason: 'attempts_exhausted' });
  });

  it('selects the Spanish agent for a Spanish assessment', async () => {
    const state = memoryState({ preferredLocale: 'es' });
    const webCalls: { agentId: string; metadata: Record<string, string> }[] = [];

    await startInterview(memoryStore(state), fakeRetell(webCalls), {
      assessmentId: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      consentGranted: true,
      agentIdByLocale: AGENTS,
    });

    expect(webCalls[0]?.agentId).toBe(AGENTS.es);
    expect(state.sessions[0]?.preferredLocale).toBe('es');
  });

  it('throws loudly when the locale has no configured agent', async () => {
    const state = memoryState({ preferredLocale: 'es' });
    await expect(
      startInterview(memoryStore(state), fakeRetell([]), {
        assessmentId: ASSESSMENT_ID,
        customerProfileId: PROFILE,
        consentGranted: true,
        agentIdByLocale: { en: AGENTS.en },
      }),
    ).rejects.toThrowError(InterviewError);
  });
});

function callEvent(
  eventType: string,
  overrides: Partial<NonNullable<RetellEvent['call']>> = {},
): { raw: string; event: RetellEvent } {
  const event: RetellEvent = {
    event: eventType,
    call: {
      call_id: 'call_abc',
      metadata: { bizmetria_interview_session_id: 'session-1' },
      ...overrides,
    },
  };
  return { raw: JSON.stringify(event), event };
}

async function stateWithSession(): Promise<{ state: MemoryState; store: InterviewStore }> {
  const state = memoryState({ status: 'interview_ready' });
  const store = memoryStore(state);
  await startInterview(store, fakeRetell([]), {
    assessmentId: ASSESSMENT_ID,
    customerProfileId: PROFILE,
    consentGranted: true,
    agentIdByLocale: AGENTS,
  });
  return { state, store };
}

describe('processRetellEvent', () => {
  it('moves the session to in_progress on call_started', async () => {
    const { state, store } = await stateWithSession();
    const { raw, event } = callEvent('call_started', { start_timestamp: 1_754_000_000_000 });

    const outcome = await processRetellEvent(store, raw, event);

    expect(outcome).toEqual({ outcome: 'processed' });
    expect(state.sessions[0]?.status).toBe('in_progress');
    expect(state.events.get('call_started:call_abc')?.status).toBe('processed');
  });

  it('stores the transcript and completes the flow on call_ended', async () => {
    const { state, store } = await stateWithSession();
    const { raw, event } = callEvent('call_ended', {
      transcript: 'Agent: Hello.\nUser: Hi.',
      transcript_object: [{ role: 'agent', content: 'Hello.' }],
      end_timestamp: 1_754_000_100_000,
    });

    const outcome = await processRetellEvent(store, raw, event);

    expect(outcome).toEqual({ outcome: 'processed' });
    expect(state.calls[0]).toMatchObject({ providerCallId: 'call_abc', status: 'ended' });
    expect(state.transcripts[0]).toMatchObject({
      transcriptText: 'Agent: Hello.\nUser: Hi.',
      segments: 1,
    });
    expect(state.sessions[0]?.status).toBe('completed');
    expect(state.assessment?.status).toBe('interview_complete');
  });

  it('marks the session interrupted when a call ends without a transcript', async () => {
    const { state, store } = await stateWithSession();
    const { raw, event } = callEvent('call_ended', { end_timestamp: 1_754_000_100_000 });

    const outcome = await processRetellEvent(store, raw, event);

    expect(outcome).toEqual({ outcome: 'processed' });
    expect(state.sessions[0]?.status).toBe('interrupted');
    expect(state.transcripts).toHaveLength(0);
    // The assessment stays ready for another attempt.
    expect(state.assessment?.status).toBe('interview_ready');
  });

  it('upserts the transcript again on call_analyzed', async () => {
    const { state, store } = await stateWithSession();
    await processRetellEvent(
      store,
      ...(({ raw, event }) => [raw, event] as const)(
        callEvent('call_ended', { transcript: 'rough transcript' }),
      ),
    );

    const { raw, event } = callEvent('call_analyzed', {
      transcript: 'полный analysed transcript',
      transcript_object: [{}, {}],
    });
    const outcome = await processRetellEvent(store, raw, event);

    expect(outcome).toEqual({ outcome: 'processed' });
    expect(state.transcripts).toHaveLength(1);
    expect(state.transcripts[0]?.transcriptText).toBe('полный analysed transcript');
    expect(state.calls[0]?.status).toBe('analyzed');
  });

  it('ignores a duplicate delivery of the same lifecycle event', async () => {
    const { store } = await stateWithSession();
    const { raw, event } = callEvent('call_started');
    await processRetellEvent(store, raw, event);

    const outcome = await processRetellEvent(store, raw, event);
    expect(outcome).toEqual({ outcome: 'ignored', reason: 'duplicate' });
  });

  it('permanently ignores calls this application did not create', async () => {
    const { state, store } = await stateWithSession();
    const { raw, event } = callEvent('call_started', { metadata: {} });

    const outcome = await processRetellEvent(store, raw, event);

    expect(outcome).toEqual({ outcome: 'ignored', reason: 'foreign_call' });
    expect(state.events.get('call_started:call_abc')?.status).toBe('ignored');
  });

  it('asks for a retry when the session row is not there yet', async () => {
    const { store } = await stateWithSession();
    const { raw, event } = callEvent('call_started', {
      metadata: { bizmetria_interview_session_id: 'session-missing' },
    });

    const outcome = await processRetellEvent(store, raw, event);
    expect(outcome).toEqual({ outcome: 'failed', reason: 'session_not_found', retryable: true });
  });

  it('ignores unhandled event types without touching bookkeeping', async () => {
    const { state, store } = await stateWithSession();
    const { raw, event } = callEvent('transcript_updated');

    const outcome = await processRetellEvent(store, raw, event);

    expect(outcome).toEqual({ outcome: 'ignored', reason: 'unhandled_event' });
    expect(state.events.size).toBe(0);
  });
});
