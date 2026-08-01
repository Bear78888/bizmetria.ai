import { NextResponse } from 'next/server';

import { resolveAnalysisProviderId } from '@/features/analysis';
import { checkServerEnvironment } from '@/lib/env/server';

export const dynamic = 'force-dynamic';

/**
 * Reports which adapters this deployment is actually running.
 *
 * A deployment can be perfectly healthy and still be discarding every
 * submission, because `ASSESSMENT_STORAGE_MODE` defaults to the mock adapter.
 * From outside there is otherwise no way to tell the two apart, so the answer
 * is stated here. These are configuration choices, not credentials — no value,
 * host, key or project reference is exposed.
 */
function activeAdapters() {
  let analysisProvider: string;
  try {
    analysisProvider = resolveAnalysisProviderId();
  } catch {
    analysisProvider = 'misconfigured';
  }

  return {
    assessmentStorage: process.env.ASSESSMENT_STORAGE_MODE === 'supabase' ? 'supabase' : 'mock',
    analysisProvider,
    resultEmail: process.env.RESEND_DELIVERY_MODE === 'send' ? 'send' : 'skipped',
    checkout:
      process.env.CHECKOUT_MODE === 'stripe' && process.env.ASSESSMENT_STORAGE_MODE === 'supabase'
        ? 'stripe'
        : 'disabled',
  };
}

/**
 * Which commit is actually serving.
 *
 * Without this, "is the fix deployed yet?" can only be answered by guessing
 * from behaviour — and a wrong guess sends you debugging code that is not
 * running. A commit SHA is public information in a public repository.
 */
function deployedRevision(): string {
  return process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'unknown';
}

export function GET() {
  const environment = checkServerEnvironment('platform');

  return NextResponse.json(
    {
      status: environment.ok ? 'ok' : 'configuration_error',
      service: 'bizmetria-web',
      revision: deployedRevision(),
      adapters: activeAdapters(),
    },
    {
      status: environment.ok ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
