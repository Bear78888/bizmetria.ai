import { describe, expect, it } from 'vitest';

import type { StructuredAnalysisCall } from '../../src/features/analysis/claude';
import { buildPaidAnalysisInput } from '../../src/features/paid-analysis/input';
import {
  PAID_ANALYSIS_SYSTEM_PROMPT,
  buildPaidAnalysisPrompt,
} from '../../src/features/paid-analysis/prompt';
import {
  runPaidAnalysis,
  type AnalysableAssessment,
  type PaidAnalysisStore,
} from '../../src/features/paid-analysis/run';

const ASSESSMENT_ID = '44444444-4444-4444-8444-444444444444';
const PROFILE = '11111111-1111-4111-8111-111111111111';
const TRANSCRIPT_ID = '55555555-5555-4555-8555-555555555555';

function validContent() {
  return {
    executiveSummary: 'The intake workflow is the highest-leverage area.',
    findings: [
      {
        area: 'lead_response_follow_up',
        title: 'Slow first response',
        detail: 'The customer estimates about four hours to first response.',
      },
    ],
    recommendations: [
      {
        title: 'Automate intake acknowledgement',
        rationale: 'Both the questionnaire and the interview identify waiting as the bottleneck.',
        impact: 'high',
        effort: 'low',
        firstStep: 'Map the current intake steps end to end.',
      },
    ],
    sprint: {
      week1: ['Document the intake workflow.'],
      week2: ['Pilot an automated acknowledgement.'],
      week3: ['Review results against the response-time goal.'],
      week4: ['Verify against the baseline and hand over documentation.'],
    },
  };
}

interface MemoryRun {
  id: string;
  status: string;
  attemptNumber: number;
  structuredOutput?: unknown;
  errorCode?: string;
  promptVersion?: string;
  inputEvidence?: readonly Record<string, unknown>[];
}

interface MemoryState {
  assessment: AnalysableAssessment | null;
  transcript: { id: string; transcriptText: string } | null;
  runs: MemoryRun[];
  statusLog: string[];
}

function memoryState(overrides: Partial<MemoryState> = {}): MemoryState {
  return {
    assessment: {
      id: ASSESSMENT_ID,
      customerProfileId: PROFILE,
      status: 'interview_complete',
      preferredLocale: 'en',
      questionnaireData: {
        schemaVersion: 'paid-assessment-schema/1.0.0',
        locale: 'en',
        participant_role: 'owner_executive',
        primary_workflow_name: 'New client intake',
      },
    },
    transcript: { id: TRANSCRIPT_ID, transcriptText: 'Agent: Hello.\nUser: Hi.' },
    runs: [],
    statusLog: [],
    ...overrides,
  };
}

function memoryStore(state: MemoryState): PaidAnalysisStore {
  let next = 1;
  return {
    findAssessmentForProfile: (input) =>
      Promise.resolve(
        state.assessment &&
          state.assessment.id === input.assessmentId &&
          state.assessment.customerProfileId === input.customerProfileId
          ? state.assessment
          : null,
      ),
    findLatestTranscript: () => Promise.resolve(state.transcript),
    listRuns: () => Promise.resolve([...state.runs]),
    createRun: (input) => {
      const id = `run-${next++}`;
      state.runs.unshift({
        id,
        status: 'running',
        attemptNumber: input.attemptNumber,
        promptVersion: input.promptVersion,
        inputEvidence: input.inputEvidence,
      });
      return Promise.resolve(id);
    },
    finishRun: (runId, outcome) => {
      const run = state.runs.find((entry) => entry.id === runId);
      if (run) {
        run.status = outcome.status;
        if (outcome.status === 'succeeded') run.structuredOutput = outcome.structuredOutput;
        else run.errorCode = outcome.errorCode;
      }
      return Promise.resolve();
    },
    updateAssessmentStatus: (assessmentId, status) => {
      if (state.assessment?.id === assessmentId) {
        state.assessment = { ...state.assessment, status };
        state.statusLog.push(status);
      }
      return Promise.resolve();
    },
  };
}

describe('buildPaidAnalysisInput', () => {
  it('strips server-owned keys and sorts fields deterministically', () => {
    const input = buildPaidAnalysisInput({
      locale: 'en',
      questionnaireData: {
        schemaVersion: 'paid-assessment-schema/1.0.0',
        locale: 'en',
        zebra_field: 1,
        alpha_field: 2,
      },
      transcriptText: 't',
    });
    expect(input.questionnaire.map((entry) => entry.field)).toEqual(['alpha_field', 'zebra_field']);
  });

  it('includes questionnaire and transcript in the prompt', () => {
    const input = buildPaidAnalysisInput({
      locale: 'es',
      questionnaireData: { participant_role: 'owner_executive' },
      transcriptText: 'Agente: Hola.',
    });
    const prompt = buildPaidAnalysisPrompt(input);
    expect(prompt).toContain('Spanish');
    expect(prompt).toContain('participant_role: "owner_executive"');
    expect(prompt).toContain('Agente: Hola.');
  });

  it('system prompt pins the review boundary and evidence rules', () => {
    expect(PAID_ANALYSIS_SYSTEM_PROMPT).toContain('human reviewer');
    expect(PAID_ANALYSIS_SYSTEM_PROMPT).toContain('Never invent numbers');
  });
});

describe('runPaidAnalysis', () => {
  const claimant = { assessmentId: ASSESSMENT_ID, customerProfileId: PROFILE };

  it('runs the analysis and parks the assessment at under_review', async () => {
    const state = memoryState();
    const calls: { system: string; prompt: string }[] = [];
    const call: StructuredAnalysisCall = (request) => {
      calls.push(request);
      return Promise.resolve(validContent());
    };

    const outcome = await runPaidAnalysis(memoryStore(state), call, claimant);

    expect(outcome).toMatchObject({ ran: true, status: 'succeeded' });
    expect(state.runs[0]).toMatchObject({ status: 'succeeded' });
    expect(state.runs[0]?.structuredOutput).toMatchObject({
      executiveSummary: expect.stringContaining('intake'),
    });
    // analysis_pending while running, under_review after success — never completed.
    expect(state.statusLog).toEqual(['analysis_pending', 'under_review']);
    // The prompt carries the evidence, not the raw row.
    expect(calls[0]?.prompt).toContain('primary_workflow_name');
    expect(calls[0]?.prompt).toContain('Agent: Hello.');
  });

  it('records a failed run and leaves the assessment at analysis_pending', async () => {
    const state = memoryState();
    const call: StructuredAnalysisCall = () => Promise.reject(new Error('boom'));

    const outcome = await runPaidAnalysis(memoryStore(state), call, claimant);

    expect(outcome).toMatchObject({ ran: true, status: 'failed' });
    expect(state.runs[0]).toMatchObject({ status: 'failed' });
    expect(state.statusLog).toEqual(['analysis_pending']);
  });

  it('rejects malformed model output as a failed run', async () => {
    const state = memoryState();
    const call: StructuredAnalysisCall = () =>
      Promise.resolve({
        executiveSummary: '',
        findings: [],
        recommendations: [],
        sprint: { week1: [], week2: [], week3: [], week4: [] },
      });

    const outcome = await runPaidAnalysis(memoryStore(state), call, claimant);
    expect(outcome).toMatchObject({ ran: true, status: 'failed', errorCode: 'contract_failure' });
  });

  it('is a no-op when a run already succeeded', async () => {
    const state = memoryState();
    state.runs.push({ id: 'run-old', status: 'succeeded', attemptNumber: 1 });

    const outcome = await runPaidAnalysis(
      memoryStore(state),
      () => Promise.reject(new Error('must not be called')),
      claimant,
    );
    expect(outcome).toEqual({ ran: false, reason: 'already_succeeded' });
  });

  it('does not race a run already in flight', async () => {
    const state = memoryState();
    state.runs.push({ id: 'run-live', status: 'running', attemptNumber: 1 });

    const outcome = await runPaidAnalysis(
      memoryStore(state),
      () => Promise.reject(new Error('must not be called')),
      claimant,
    );
    expect(outcome).toEqual({ ran: false, reason: 'run_in_progress' });
  });

  it('stops at the attempt ceiling', async () => {
    const state = memoryState();
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      state.runs.push({ id: `run-${attempt}`, status: 'failed', attemptNumber: attempt });
    }
    const outcome = await runPaidAnalysis(
      memoryStore(state),
      () => Promise.reject(new Error('must not be called')),
      claimant,
    );
    expect(outcome).toEqual({ ran: false, reason: 'attempts_exhausted' });
  });

  it('requires a completed interview', async () => {
    const state = memoryState();
    state.assessment = { ...(state.assessment as AnalysableAssessment), status: 'in_progress' };
    const outcome = await runPaidAnalysis(
      memoryStore(state),
      () => Promise.resolve(validContent()),
      claimant,
    );
    expect(outcome).toEqual({ ran: false, reason: 'interview_incomplete' });
  });

  it('requires a transcript with content', async () => {
    const state = memoryState({ transcript: { id: TRANSCRIPT_ID, transcriptText: '   ' } });
    const outcome = await runPaidAnalysis(
      memoryStore(state),
      () => Promise.resolve(validContent()),
      claimant,
    );
    expect(outcome).toEqual({ ran: false, reason: 'transcript_missing' });
  });

  it('treats another profile’s assessment as missing', async () => {
    const state = memoryState();
    const outcome = await runPaidAnalysis(
      memoryStore(state),
      () => Promise.resolve(validContent()),
      {
        assessmentId: ASSESSMENT_ID,
        customerProfileId: '99999999-9999-4999-8999-999999999999',
      },
    );
    expect(outcome).toEqual({ ran: false, reason: 'not_found' });
  });
});
