import { NextResponse, type NextRequest } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

function safeNextPath(value: string | null) {
  if (value) {
    try {
      const safeBase = new URL('https://bizmetria.invalid');
      const candidate = new URL(value, safeBase);

      if (candidate.origin === safeBase.origin && candidate.pathname.startsWith('/')) {
        return `${candidate.pathname}${candidate.search}${candidate.hash}`;
      }
    } catch {
      // Invalid or external return paths fall through to the safe account route.
    }
  }

  return '/en/account';
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const nextPath = safeNextPath(request.nextUrl.searchParams.get('next'));

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(nextPath, request.url));
    }
  }

  return NextResponse.redirect(new URL('/en/auth?error=callback_failed', request.url));
}
