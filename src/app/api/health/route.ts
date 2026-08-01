import { NextResponse } from 'next/server';

import { checkServerEnvironment } from '@/lib/env/server';

export const dynamic = 'force-dynamic';

export function GET() {
  const environment = checkServerEnvironment('platform');

  return NextResponse.json(
    {
      status: environment.ok ? 'ok' : 'configuration_error',
      service: 'bizmetria-web',
    },
    {
      status: environment.ok ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
