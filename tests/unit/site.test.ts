import { describe, expect, it } from 'vitest';

import robots from '../../src/app/robots';
import sitemap from '../../src/app/sitemap';
import { CANONICAL_SITE_URL, canonicalPath } from '../../src/lib/site';

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
