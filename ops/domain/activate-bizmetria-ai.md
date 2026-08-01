# Activating the `bizmetria.ai` domain

The application already treats `https://bizmetria.ai` as its public identity.
`src/lib/site.ts` holds that value once, and the sitemap, robots directives and
Open Graph metadata all derive from it, so nothing in the codebase needs to
change when the domain goes live.

Until DNS is pointed at Vercel, the site is served from its Vercel host and
authentication callbacks follow whatever `NEXT_PUBLIC_APP_URL` (or Vercel's own
`VERCEL_URL`) resolves to. That is why the two values are deliberately separate:

| Value                 | Meaning                                         | Changes on activation |
| --------------------- | ----------------------------------------------- | --------------------- |
| `CANONICAL_SITE_URL`  | What the site claims to search engines          | no — already correct  |
| `NEXT_PUBLIC_APP_URL` | Where this deployment actually answers requests | yes                   |

## Activation steps

1. **Add the domain in Vercel** — project `bizmetria-ai` → Settings → Domains →
   add `bizmetria.ai` and `www.bizmetria.ai`. Vercel then shows the required DNS
   records.
2. **Point DNS at Vercel** at the registrar, using exactly the records Vercel
   displays. Wait for Vercel to report the domain as valid.
3. **Set the production application URL** so authentication links resolve for the
   person clicking them:
   `NEXT_PUBLIC_APP_URL=https://bizmetria.ai` for the Production environment.
4. **Add the domain to Supabase Auth** — canonical project
   `rbndiytodvoyiejassnw` → Authentication → URL Configuration: set the site URL
   to `https://bizmetria.ai` and add `https://bizmetria.ai/auth/callback` as a
   redirect URL. Sign-up confirmation links break without this.
5. **Redeploy production.** Environment variables are captured when a deployment
   is created, so an existing deployment keeps the previous value.
6. **Verify:** `https://bizmetria.ai/en` and `/es` both load, `/sitemap.xml`
   lists both locales on the canonical origin, and `/robots.txt` points at that
   sitemap.

## Not part of activation

Enabling database writes is a separate decision. Production runs with
`ASSESSMENT_STORAGE_MODE` unset, which means the mock adapter, and the canonical
database holds no rows. Pointing a domain at the site does not change that.
