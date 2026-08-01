import { afterEach, describe, expect, it, vi } from 'vitest';

import robots from '../../src/app/robots';
import sitemap from '../../src/app/sitemap';
import {
  CANONICAL_SITE_URL,
  canonicalPath,
  deploymentOrigin,
  deploymentPath,
} from '../../src/lib/site';

describe('canonical site origin', () => {
  it('is the test-phase production domain, without a trailing slash or path', () => {
    expect(CANONICAL_SITE_URL).toBe('https://bizmetria.com');
  });

  it('builds absolute URLs on the canonical origin', () => {
    expect(canonicalPath('/en')).toBe('https://bizmetria.com/en');
    expect(canonicalPath('/sitemap.xml')).toBe('https://bizmetria.com/sitemap.xml');
  });

  it('keeps the sitemap and robots directives on that one origin', () => {
    const origins = sitemap().map((entry) => new URL(entry.url).origin);
    expect(new Set(origins)).toEqual(new Set([CANONICAL_SITE_URL]));

    const sitemapUrl = robots().sitemap;
    expect(typeof sitemapUrl).toBe('string');
    expect(new URL(sitemapUrl as string).origin).toBe(CANONICAL_SITE_URL);
  });

  it('covers both public locales in the sitemap', () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);
    expect(paths).toContain('/en');
    expect(paths).toContain('/es');
  });
});

describe('deployment origin', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefers an explicit NEXT_PUBLIC_APP_URL over everything else', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://staging.example.com/some/path');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'bizmetria-ai.vercel.app');
    vi.stubEnv('VERCEL_URL', 'bizmetria-abc123.vercel.app');

    expect(deploymentOrigin()).toBe('https://staging.example.com');
  });

  it('falls back to the stable production alias before the per-deployment host', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'bizmetria-ai.vercel.app');
    vi.stubEnv('VERCEL_URL', 'bizmetria-abc123.vercel.app');

    expect(deploymentOrigin()).toBe('https://bizmetria-ai.vercel.app');
  });

  it('uses the per-deployment host when only VERCEL_URL is present', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '');
    vi.stubEnv('VERCEL_URL', 'bizmetria-abc123.vercel.app');

    expect(deploymentOrigin()).toBe('https://bizmetria-abc123.vercel.app');
  });

  it('rejects Vercel host values outside vercel.app instead of redirecting there', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'evil.example.com');
    vi.stubEnv('VERCEL_URL', 'also-evil.example.com');

    expect(deploymentOrigin()).toBe(CANONICAL_SITE_URL);
  });

  it('survives a malformed NEXT_PUBLIC_APP_URL by falling through', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'not a url');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'bizmetria-ai.vercel.app');
    vi.stubEnv('VERCEL_URL', '');

    expect(deploymentOrigin()).toBe('https://bizmetria-ai.vercel.app');
  });

  it('is the canonical origin when no platform host is available (local dev)', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '');
    vi.stubEnv('VERCEL_URL', '');

    expect(deploymentOrigin()).toBe(CANONICAL_SITE_URL);
  });

  it('builds absolute paths on the resolved origin', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'bizmetria-ai.vercel.app');
    vi.stubEnv('VERCEL_URL', '');

    expect(deploymentPath('/en/assessment/paid')).toBe(
      'https://bizmetria-ai.vercel.app/en/assessment/paid',
    );
  });
});
