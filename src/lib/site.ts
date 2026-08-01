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

// Vercel host variables carry no protocol and are attacker-neutral platform
// values, but the guard keeps a mis-set variable from ever becoming a redirect
// target on someone else's domain.
const VERCEL_HOST_PATTERN = /^[a-z0-9.-]+\.vercel\.app$/iu;

/**
 * The origin where this deployment actually serves traffic — for URLs that a
 * person is sent back to, such as Stripe checkout return pages and
 * authentication callbacks.
 *
 * This is distinct from {@link CANONICAL_SITE_URL} on purpose: until DNS
 * points the canonical domain at Vercel, a link built on it lands on the
 * registrar's parking page. Preference order:
 *
 * 1. `NEXT_PUBLIC_APP_URL` — an explicit operator choice always wins.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` — the project's stable production alias.
 * 3. `VERCEL_URL` — the per-deployment host, correct but ephemeral.
 * 4. The canonical origin, which is right once DNS activation is done
 *    (`ops/domain/activate-public-domain.md`) and is the only option locally.
 *
 * The `process.env` reads stay literal so the bundler keeps them.
 */
export function deploymentOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // A malformed override falls through to the platform-provided hosts.
    }
  }

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionHost && VERCEL_HOST_PATTERN.test(productionHost)) {
    return `https://${productionHost}`;
  }

  const deploymentHost = process.env.VERCEL_URL;
  if (deploymentHost && VERCEL_HOST_PATTERN.test(deploymentHost)) {
    return `https://${deploymentHost}`;
  }

  return CANONICAL_SITE_URL;
}

export function deploymentPath(path: string): string {
  return new URL(path, deploymentOrigin()).toString();
}
