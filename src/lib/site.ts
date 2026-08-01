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
export const CANONICAL_SITE_URL = 'https://bizmetria.ai';

export function canonicalPath(path: string): string {
  return new URL(path, CANONICAL_SITE_URL).toString();
}
