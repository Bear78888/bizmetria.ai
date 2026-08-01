import 'server-only';

import { createClient } from '@supabase/supabase-js';

import { getPlatformEnvironment } from '@/lib/env/server';
import { resolveSupabaseAdminUrl } from '@/lib/supabase/target';

export function createSupabaseAdminClient() {
  // Derive the origin from the verified server-owned ref instead of reading the
  // public NEXT_PUBLIC_SUPABASE_URL, which an external integration can overwrite.
  const projectUrl = resolveSupabaseAdminUrl();
  const environment = getPlatformEnvironment();

  // A Vercel Marketplace Supabase integration owns the `SUPABASE_*` names and
  // overwrites them with its own project's credentials. Prefer a namespaced
  // variable no third party manages, falling back to the standard name so
  // environments without that collision keep working unchanged.
  const secretKey = process.env.BIZMETRIA_SUPABASE_SECRET_KEY || environment.SUPABASE_SECRET_KEY;

  return createClient(projectUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
