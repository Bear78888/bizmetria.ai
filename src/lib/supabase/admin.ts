import 'server-only';

import { createClient } from '@supabase/supabase-js';

import { getPlatformEnvironment } from '@/lib/env/server';
import { verifySupabaseEnvironmentTarget } from '@/lib/supabase/target';

export function createSupabaseAdminClient() {
  verifySupabaseEnvironmentTarget();
  const environment = getPlatformEnvironment();

  return createClient(environment.NEXT_PUBLIC_SUPABASE_URL, environment.SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
