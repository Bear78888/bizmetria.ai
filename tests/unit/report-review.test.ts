import { describe, expect, it } from 'vitest';

import {
  approveReport,
  requestChanges,
  type ReportReviewStore,
  type ReviewableReport,
  type ReviewerRole,
} from '../../src/features/report-review/review';

const REPORT_ID = '66666666-6666-4666-8666-666666666666';
const ASSESSMENT_ID = '44444444-4444-4444-8444-444444444444';
const REVIEWER = '77777777-7777-4777-8777-777777777777';

interface MemoryState {
  roles: Map<string, ReviewerRole>;
  report: (ReviewableReport & { approvedBy?: string; notes?: string[] }) | null;
  assessmentStatus: string;
  reviewLog: string[];
}

function memoryState(overrides: Partial<MemoryState> = {}): MemoryState {
  return {
    roles: new Map([[REVIEWER, 'admin']]),
    report: {
      id: REPORT_ID,
      assessmentId: ASSESSMENT_ID,
      status: 'NEEDS_REVIEW',
      preferredLocale: 'en',
      reportData: {
        executiveSummary: 's',
        findings: [{ area: 'manual_work', title: 't', detail: 'd' }],
        recommendations: [
          { title: 't', rationale: 'r', impact: 'high', effort: 'low', firstStep: 'f' },
        ],
        sprint: { week1: ['a'], week2: [], week3: [], week4: [] },
      },
    },
    assessmentStatus: 'under_review',
    reviewLog: [],
    ...overrides,
  };
}

function memoryStore(state: MemoryState): ReportReviewStore {
  return {
    findReviewerRole: (profileId) => Promise.resolve(state.roles.get(profileId) ?? null),
    listReviewQueue: () => Promise.resolve([]),
    ensureReport: () => Promise.resolve(state.report),
    findReportById: (reportId) =>
      Promise.resolve(state.report && state.report.id === reportId ? state.report : null),
    approveReport: (input) => {
      if (state.report) {
        state.report = {
          ...state.report,
          status: 'DELIVERED',
          approvedBy: input.reviewerProfileId,
        };
      }
      state.reviewLog.push('approved');
      return Promise.resolve();
    },
    requestChanges: (input) => {
      if (state.report) {
        state.report = {
          ...state.report,
          status: 'CHANGES_REQUESTED',
          notes: [...(state.report.notes ?? []), input.notes],
        };
      }
      state.reviewLog.push('changes_requested');
      return Promise.resolve();
    },
    updateAssessmentStatus: (_assessmentId, status) => {
      state.assessmentStatus = status;
      return Promise.resolve();
    },
  };
}

describe('approveReport', () => {
  it('delivers the report and completes the assessment', async () => {
    const state = memoryState();

    const rejection = await approveReport(memoryStore(state), {
      reportId: REPORT_ID,
      reviewerProfileId: REVIEWER,
    });

    expect(rejection).toBeNull();
    expect(state.report).toMatchObject({ status: 'DELIVERED', approvedBy: REVIEWER });
    expect(state.assessmentStatus).toBe('completed');
    expect(state.reviewLog).toEqual(['approved']);
  });

  it('refuses a profile without an active reviewer role', async () => {
    const state = memoryState({ roles: new Map() });

    const rejection = await approveReport(memoryStore(state), {
      reportId: REPORT_ID,
      reviewerProfileId: REVIEWER,
    });

    expect(rejection).toBe('not_authorized');
    expect(state.report?.status).toBe('NEEDS_REVIEW');
    expect(state.assessmentStatus).toBe('under_review');
  });

  it('does not approve twice', async () => {
    const state = memoryState();
    state.report = { ...(state.report as ReviewableReport), status: 'DELIVERED' };

    const rejection = await approveReport(memoryStore(state), {
      reportId: REPORT_ID,
      reviewerProfileId: REVIEWER,
    });

    expect(rejection).toBe('not_reviewable');
    expect(state.reviewLog).toEqual([]);
  });

  it('reports a missing report', async () => {
    const state = memoryState({ report: null });
    const rejection = await approveReport(memoryStore(state), {
      reportId: REPORT_ID,
      reviewerProfileId: REVIEWER,
    });
    expect(rejection).toBe('report_not_found');
  });
});

describe('requestChanges', () => {
  it('records the request and keeps the assessment under review', async () => {
    const state = memoryState();

    const rejection = await requestChanges(memoryStore(state), {
      reportId: REPORT_ID,
      reviewerProfileId: REVIEWER,
      notes: 'The roadmap ignores the stated no-new-tools constraint.',
    });

    expect(rejection).toBeNull();
    expect(state.report).toMatchObject({ status: 'CHANGES_REQUESTED' });
    expect(state.report?.notes).toEqual([
      'The roadmap ignores the stated no-new-tools constraint.',
    ]);
    expect(state.assessmentStatus).toBe('under_review');
  });

  it('requires an active reviewer role', async () => {
    const state = memoryState({ roles: new Map([[REVIEWER, 'reviewer']]) });
    state.roles.delete(REVIEWER);

    const rejection = await requestChanges(memoryStore(state), {
      reportId: REPORT_ID,
      reviewerProfileId: REVIEWER,
      notes: 'n',
    });
    expect(rejection).toBe('not_authorized');
  });

  it('a reviewer role (not only admin) may decide', async () => {
    const state = memoryState({ roles: new Map([[REVIEWER, 'reviewer']]) });

    const rejection = await approveReport(memoryStore(state), {
      reportId: REPORT_ID,
      reviewerProfileId: REVIEWER,
    });
    expect(rejection).toBeNull();
  });
});
