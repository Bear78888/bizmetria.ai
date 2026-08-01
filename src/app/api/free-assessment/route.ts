import { NextResponse } from 'next/server';

import { sendResultEmail } from '@/features/free-assessment/email';
import { buildPublicResult } from '@/features/free-assessment/result';
import { freeAssessmentSubmissionSchema } from '@/features/free-assessment/schema';
import { scoreAssessment } from '@/features/free-assessment/score';
import { storeAssessment } from '@/features/free-assessment/storage';

export const runtime = 'nodejs';

const MAX_REQUEST_BYTES = 64 * 1024;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 413 });
  }

  let payload: unknown;
  try {
    const rawPayload = await request.text();
    if (rawPayload.length > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: 'invalid_request' }, { status: 413 });
    }
    payload = JSON.parse(rawPayload);
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const submission = freeAssessmentSubmissionSchema.safeParse(payload);
  if (!submission.success) {
    return NextResponse.json(
      {
        error: 'invalid_assessment',
        fields: submission.error.issues.map((issue) => issue.path.join('.')).filter(Boolean),
      },
      { status: 400 },
    );
  }

  try {
    const score = scoreAssessment(submission.data.answers);
    const stored = await storeAssessment(submission.data, score);
    const result = buildPublicResult(stored.assessmentId, submission.data.locale, score);
    const delivery = await sendResultEmail(submission.data.contact.email, result);

    return NextResponse.json({ result, delivery, storageMode: stored.storageMode });
  } catch (error) {
    // Server-side only: the client response stays generic so nothing internal
    // leaks, but a swallowed failure here is otherwise impossible to diagnose.
    console.error('free-assessment request failed', error);
    return NextResponse.json({ error: 'assessment_unavailable' }, { status: 503 });
  }
}
