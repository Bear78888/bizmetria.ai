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
  };
}

export function GET() {
  const environment = checkServerEnvironment('platform');

  return NextResponse.json(
    {
      status: environment.ok ? 'ok' : 'configuration_error',
      service: 'bizmetria-web',
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
