// The single canonical public origin for BizMetria. Sitemap entries, robots
// directives and Open Graph metadata must all agree on this value, so it lives
// in one place: pointing the product at a different domain is a one-line change
// here rather than an edit spread across several files.
//
// This is deliberately independent of NEXT_PUBLIC_APP_URL. That variable tracks
// wherever a given deployment actually runs (a Vercel preview host, localhost),
// and is what authentication callbacks must use so links resolve for the person
// clicking them. The value below is what the site claims as its public identity
// to search engines, which stays constant across deployments.
//
// Owner decision, 2026-08-01: the test phase runs on bizmetria.com, so the site
// origin and the transactional email sender domain (noreply@bizmetria.com) are
// the same registrable domain — which is what mailbox providers expect. The
// bizmetria.ai brand domain is unaffected and can take over later by changing
// this one line, before the site has any search presence to preserve.
export const CANONICAL_SITE_URL = 'https://bizmetria.com';

export function canonicalPath(path: string): string {
  return new URL(path, CANONICAL_SITE_URL).toString();
}
