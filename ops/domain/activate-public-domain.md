# Activating the public domain

The application treats `https://bizmetria.com` as its public identity for the
test phase. `src/lib/site.ts` holds that value once, and the sitemap, robots
directives and Open Graph metadata all derive from it, so moving the product to
`bizmetria.ai` later is a one-line change there rather than an edit spread
across several files.

Why `.com` during testing: transactional email sends from
`noreply@bizmetria.com`, and mailbox providers treat a From domain that matches
the site's registrable domain more favourably than one that does not. Aligning
them removes a deliverability variable while nothing is at stake.

## Current DNS state (checked 2026-08-01)

| Host            | State                                                                     |
| --------------- | ------------------------------------------------------------------------- |
| `bizmetria.com` | registered, serving the registrar's parking page (redirects to `/lander`) |
| `bizmetria.ai`  | does not resolve                                                          |

Neither points at Vercel yet, so the site is still served from its Vercel host.

## Two values, deliberately separate

| Value                 | Meaning                                         | Changes on activation |
| --------------------- | ----------------------------------------------- | --------------------- |
| `CANONICAL_SITE_URL`  | What the site claims to search engines          | no — already correct  |
| `NEXT_PUBLIC_APP_URL` | Where this deployment actually answers requests | yes                   |

Authentication callbacks follow `NEXT_PUBLIC_APP_URL` (or Vercel's own
`VERCEL_URL`), because a confirmation link has to resolve for the person
clicking it, not for a crawler.

## Activation steps

1. **Add the domain in Vercel** — project `bizmetria-ai` → Settings → Domains →
   add `bizmetria.com` and `www.bizmetria.com`. Vercel then shows the required
   DNS records.
2. **Point DNS at Vercel** at the registrar, using exactly the records Vercel
   displays. This replaces the parking page. Wait for Vercel to report the
   domain as valid.
3. **Set the production application URL** so authentication links resolve:
   `NEXT_PUBLIC_APP_URL=https://bizmetria.com` for the Production environment.
4. **Add the domain to Supabase Auth** — canonical project
   `rbndiytodvoyiejassnw` → Authentication → URL Configuration: set the site URL
   to `https://bizmetria.com` and add `https://bizmetria.com/auth/callback` as a
   redirect URL. Sign-up confirmation links break without this.
5. **Redeploy production.** Environment variables are captured when a deployment
   is created, so an existing deployment keeps the previous value.
6. **Verify:** `https://bizmetria.com/en` and `/es` both load, `/sitemap.xml`
   lists both locales on the canonical origin, and `/robots.txt` points at that
   sitemap.

## Moving to `bizmetria.ai` later

Change `CANONICAL_SITE_URL` in `src/lib/site.ts`, update the test that pins it,
then repeat the steps above for the new domain and keep `bizmetria.com`
redirecting to it in Vercel. Doing this before the site has search presence
costs nothing; doing it afterwards means a redirect map and re-indexing.

## Not part of activation

Enabling database writes and enabling email delivery are separate switches.
Pointing a domain at the site changes neither.
