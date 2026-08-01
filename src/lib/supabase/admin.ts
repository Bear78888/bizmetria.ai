import 'server-only';

import { createClient } from '@supabase/supabase-js';

import { getPlatformEnvironment } from '@/lib/env/server';
import { resolveSupabaseAdminUrl } from '@/lib/supabase/target';

export function createSupabaseAdminClient() {
  // Derive the origin from the verified server-owned ref instead of reading the
  // public NEXT_PUBLIC_SUPABASE_URL, which an external integration can overwrite.
  const projectUrl = resolveSupabaseAdminUrl();
  const environment = getPlatformEnvironment();

  return createClient(projectUrl, environment.SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
