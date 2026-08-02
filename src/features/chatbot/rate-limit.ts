/**
 * Fixed-window rate limiting for the public chatbot endpoint.
 *
 * The endpoint is unauthenticated and each request spends model tokens, so
 * two independent caps protect it: per-visitor (hashed IP) and a global
 * daily budget that bounds the worst case regardless of how many addresses
 * an abuser rotates through. Decisions are pure; the store is a thin
 * mapping onto rate_limit_windows.
 */

export interface RateWindow {
  readonly windowStartedAt: string;
  readonly windowSeconds: number;
  readonly requestCount: number;
}

export interface RateLimitStore {
  /** Current window for the key, or null. */
  findWindow(keyHash: string, routeKey: string): Promise<RateWindow | null>;
  /** Starts a new window at `now` with count 1 (replacing any expired one). */
  startWindow(keyHash: string, routeKey: string, now: Date, windowSeconds: number): Promise<void>;
  /** Increments the current window's count. */
  incrementWindow(keyHash: string, routeKey: string): Promise<void>;
}

export const CHAT_LIMITS = {
  perVisitor: { routeKey: 'chatbot:visitor', windowSeconds: 3600, maxRequests: 30 },
  global: { routeKey: 'chatbot:global', windowSeconds: 86_400, maxRequests: 1000 },
} as const;

export type WindowDecision = 'start' | 'increment' | 'deny';

/** Pure decision: what to do with the stored window at `now` under a cap. */
export function decideWindow(
  window: RateWindow | null,
  now: Date,
  limit: { windowSeconds: number; maxRequests: number },
): WindowDecision {
  if (!window) return 'start';
  const startedAt = Date.parse(window.windowStartedAt);
  const expired =
    !Number.isFinite(startedAt) || now.getTime() - startedAt >= window.windowSeconds * 1000;
  if (expired) return 'start';
  return window.requestCount >= limit.maxRequests ? 'deny' : 'increment';
}

async function admitKey(
  store: RateLimitStore,
  keyHash: string,
  limit: { routeKey: string; windowSeconds: number; maxRequests: number },
  now: Date,
): Promise<boolean> {
  const window = await store.findWindow(keyHash, limit.routeKey);
  const decision = decideWindow(window, now, limit);
  if (decision === 'deny') return false;
  if (decision === 'start') {
    await store.startWindow(keyHash, limit.routeKey, now, limit.windowSeconds);
  } else {
    await store.incrementWindow(keyHash, limit.routeKey);
  }
  return true;
}

/** Both caps must admit; the global one is checked first so a denied visitor
 * does not consume global budget. */
export async function admitChatRequest(
  store: RateLimitStore,
  visitorKeyHash: string,
  now: Date = new Date(),
): Promise<boolean> {
  const visitorAllowed = await admitKey(store, visitorKeyHash, CHAT_LIMITS.perVisitor, now);
  if (!visitorAllowed) return false;
  return admitKey(store, 'global', CHAT_LIMITS.global, now);
}
