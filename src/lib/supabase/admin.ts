import 'server-only';

import { createClient } from '@supabase/supabase-js';

import { getPlatformEnvironment } from '@/lib/env/server';

export function createSupabaseAdminClient() {
  const environment = getPlatformEnvironment();

  return createClient(environment.NEXT_PUBLIC_SUPABASE_URL, environment.SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
