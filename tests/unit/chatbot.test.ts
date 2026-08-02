import { describe, expect, it } from 'vitest';

import { METRIA_OPENING_MESSAGE, METRIA_SYSTEM_PROMPT } from '../../src/features/chatbot/prompt';
import {
  CHAT_LIMITS,
  admitChatRequest,
  decideWindow,
  type RateLimitStore,
  type RateWindow,
} from '../../src/features/chatbot/rate-limit';

describe('Metria system prompt', () => {
  it('pins the approved facts', () => {
    expect(METRIA_SYSTEM_PROMPT).toContain('11 focused questions');
    expect(METRIA_SYSTEM_PROMPT).toContain('$299 one-time');
    expect(METRIA_SYSTEM_PROMPT).toContain('Never invent statistics');
    expect(METRIA_SYSTEM_PROMPT).toContain('Never collect payment information in chat');
  });

  it('links only to the site’s own paths', () => {
    const links = [...METRIA_SYSTEM_PROMPT.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]);
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link).toMatch(/^\/(en|es)(\/assessment)?$/);
    }
  });

  it('carries the approved opening lines in both languages', () => {
    expect(METRIA_OPENING_MESSAGE.en).toContain("I'm Metria");
    expect(METRIA_OPENING_MESSAGE.es).toContain('Soy Metria');
  });
});

describe('decideWindow', () => {
  const now = new Date('2026-08-02T12:00:00Z');
  const limit = { windowSeconds: 3600, maxRequests: 3 };

  const window = (overrides: Partial<RateWindow>): RateWindow => ({
    windowStartedAt: '2026-08-02T11:30:00Z',
    windowSeconds: 3600,
    requestCount: 1,
    ...overrides,
  });

  it('starts a window when none exists', () => {
    expect(decideWindow(null, now, limit)).toBe('start');
  });

  it('increments inside an open window under the cap', () => {
    expect(decideWindow(window({ requestCount: 2 }), now, limit)).toBe('increment');
  });

  it('denies at the cap', () => {
    expect(decideWindow(window({ requestCount: 3 }), now, limit)).toBe('deny');
  });

  it('replaces an expired window even when it was full', () => {
    const expired = window({ windowStartedAt: '2026-08-02T10:00:00Z', requestCount: 99 });
    expect(decideWindow(expired, now, limit)).toBe('start');
  });

  it('treats a malformed timestamp as expired rather than open forever', () => {
    expect(decideWindow(window({ windowStartedAt: 'garbage' }), now, limit)).toBe('start');
  });
});

describe('admitChatRequest', () => {
  function memoryStore(): RateLimitStore & { windows: Map<string, RateWindow> } {
    const windows = new Map<string, RateWindow>();
    const key = (hash: string, route: string) => `${hash}:${route}`;
    return {
      windows,
      findWindow: (hash, route) => Promise.resolve(windows.get(key(hash, route)) ?? null),
      startWindow: (hash, route, now, windowSeconds) => {
        windows.set(key(hash, route), {
          windowStartedAt: now.toISOString(),
          windowSeconds,
          requestCount: 1,
        });
        return Promise.resolve();
      },
      incrementWindow: (hash, route) => {
        const existing = windows.get(key(hash, route));
        if (existing) {
          windows.set(key(hash, route), {
            ...existing,
            requestCount: existing.requestCount + 1,
          });
        }
        return Promise.resolve();
      },
    };
  }

  it('denies a visitor past the per-visitor cap while others continue', async () => {
    const store = memoryStore();
    const now = new Date('2026-08-02T12:00:00Z');

    for (let i = 0; i < CHAT_LIMITS.perVisitor.maxRequests; i += 1) {
      expect(await admitChatRequest(store, 'visitor-a', now)).toBe(true);
    }
    expect(await admitChatRequest(store, 'visitor-a', now)).toBe(false);
    expect(await admitChatRequest(store, 'visitor-b', now)).toBe(true);
  });

  it('a denied visitor does not consume global budget', async () => {
    const store = memoryStore();
    const now = new Date('2026-08-02T12:00:00Z');

    for (let i = 0; i < CHAT_LIMITS.perVisitor.maxRequests; i += 1) {
      await admitChatRequest(store, 'visitor-a', now);
    }
    const globalBefore = store.windows.get(`global:${CHAT_LIMITS.global.routeKey}`)?.requestCount;
    await admitChatRequest(store, 'visitor-a', now);
    const globalAfter = store.windows.get(`global:${CHAT_LIMITS.global.routeKey}`)?.requestCount;
    expect(globalAfter).toBe(globalBefore);
  });
});
