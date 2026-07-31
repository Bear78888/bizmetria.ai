# Secrets Inventory

**Last updated:** 2026-07-31
**Rule:** This file records names and handling boundaries only. Values, prefixes, fragments, and fingerprints must never be committed or logged.

| Variable | Exposure | Required stage | Runtime owner | Activation boundary |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser-safe | Platform Foundation | Vercel | Must be the root `https://<project-ref>.supabase.co` URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe | Platform Foundation | Vercel | Preview/sandbox project only until production approval |
| `SUPABASE_SECRET_KEY` | Server-only | Platform Foundation | Vercel | Never import into a client module |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Browser-safe | PR 3 | Vercel | Test-mode key only before production activation |
| `STRIPE_SECRET_KEY` | Server-only | PR 3 | Vercel | Test mode only; live charging is prohibited |
| `OPENAI_API_KEY` | Server-only | PR 4 | Vercel | Synthetic/development inputs until release approval |
| `RETELL_API_KEY` | Server-only | PR 4 | Vercel | Development agents only; no production numbers |
| `RESEND_API_KEY` | Server-only | PR 2/5 | Vercel | Sandbox or approved development recipient only |

Later-stage variables are listed by name in [`.env.example`](../../.env.example). Their absence must fail only the feature scope that consumes them, not documentation or unrelated build jobs.

## Enforcement

- Environment parsing reports variable names only.
- Public variables are isolated from server-only variables.
- Stripe integration validation accepts test-mode prefixes only.
- `.env*` is ignored except for `.env.example`.
- CI uses synthetic values; real credentials must not appear in workflow files or artifacts.
