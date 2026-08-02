import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/admin';

import type { RateLimitStore } from './rate-limit';

/**
 * rate_limit_windows mapping. Precision under concurrency is not the goal —
 * a burst can slip one or two requests past the cap — the goal is that the
 * caps hold at the scale that matters for a public model-backed endpoint.
 */
export function createSupabaseRateLimitStore(): RateLimitStore {
  const supabase = createSupabaseAdminClient();

  return {
    async findWindow(keyHash, routeKey) {
      const { data, error } = await supabase
        .from('rate_limit_windows')
        .select('window_started_at, window_seconds, request_count')
        .eq('key_hash', keyHash)
        .eq('route_key', routeKey)
        .order('window_started_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(`rate window lookup failed (${error.code})`);
      if (!data) return null;
      return {
        windowStartedAt: data.window_started_at,
        windowSeconds: data.window_seconds,
        requestCount: data.request_count,
      };
    },

    async startWindow(keyHash, routeKey, now, windowSeconds) {
      // One row per key: expired windows are replaced, not accumulated.
      const { error: deleteError } = await supabase
        .from('rate_limit_windows')
        .delete()
        .eq('key_hash', keyHash)
        .eq('route_key', routeKey);
      if (deleteError) throw new Error(`rate window reset failed (${deleteError.code})`);

      const { error } = await supabase.from('rate_limit_windows').insert({
        key_hash: keyHash,
        route_key: routeKey,
        window_started_at: now.toISOString(),
        window_seconds: windowSeconds,
        request_count: 1,
      });
      if (error) throw new Error(`rate window start failed (${error.code})`);
    },

    async incrementWindow(keyHash, routeKey) {
      // Read-modify-write; see the module note on concurrency tolerance.
      const { data, error } = await supabase
        .from('rate_limit_windows')
        .select('id, request_count')
        .eq('key_hash', keyHash)
        .eq('route_key', routeKey)
        .order('window_started_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error || !data) throw new Error(`rate window read failed (${error?.code ?? 'missing'})`);

      const { error: updateError } = await supabase
        .from('rate_limit_windows')
        .update({ request_count: data.request_count + 1 })
        .eq('id', data.id);
      if (updateError) throw new Error(`rate window increment failed (${updateError.code})`);
    },
  };
}
