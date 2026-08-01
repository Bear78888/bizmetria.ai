# Environment Matrix

**Last updated:** 2026-07-31

| Environment | Data | Credentials | Deploy mechanism | Allowed behavior |
|---|---|---|---|---|
| Local development | Synthetic | Local ignored `.env.local` | Developer process | Platform and sandbox fixtures only |
| GitHub CI | Synthetic | GitHub Environment names where a later integration test requires them | GitHub Actions tests only | Quality, build, migration-contract, and browser tests; no deploy commands |
| Vercel Preview | Synthetic/sandbox | Vercel Preview variables | Native GitHub–Vercel integration | Preview application and test-mode integrations |
| Supabase Preview | Synthetic | Native integration-managed | Native GitHub–Supabase integration | Migration validation/preview branch when available |
| Production | No customer traffic authorized yet | Vercel Production variables | Existing native integrations | Build may deploy from `main`; live payments, production calls/email/data, and final domain launch remain disabled |

The canonical non-secret target is `SUPABASE_PROJECT_REF=rbndiytodvoyiejassnw`, and the matching root URL is `https://rbndiytodvoyiejassnw.supabase.co`. Vercel Production and Preview plus GitHub CI must carry this ref. Database-write scripts and elevated server writes must run `scripts/verify-supabase-target.ts` first. A Supabase CLI write also requires `supabase link --project-ref rbndiytodvoyiejassnw` and a successful linked-ref verification.

## Required Platform Foundation names

The runtime expects the following names without reading or exposing their values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_PROJECT_REF`

The complete expected Vercel name set is maintained in `src/lib/env/schema.ts`. `NEXT_PUBLIC_SUPABASE_URL` is rejected when it contains `/rest/v1/` or any other path.
