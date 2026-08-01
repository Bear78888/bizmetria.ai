import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { getPlatformEnvironment } from '@/lib/env/server';

export async function createSupabaseServerClient() {
  const environment = getPlatformEnvironment();
  const cookieStore = await cookies();

  return createServerClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components cannot write cookies. Route handlers and Server Actions can.
          }
        },
      },
    },
  );
}
