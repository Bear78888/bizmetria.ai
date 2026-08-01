# Service Account Registry

**Last updated:** 2026-07-31
**Boundary:** Account identifiers and credential values are intentionally absent.

| Service | Repository integration | Application use | Current allowed mode | Owner action before live use |
|---|---|---|---|---|
| GitHub | Canonical source repository | Source, CI, reviews | Active | Maintain branch protection and reviews |
| Vercel | Native GitHub integration | Next.js runtime and previews | Preview/sandbox | Approve final domain publication separately |
| Supabase (`bizmetria.ai`, ref `rbndiytodvoyiejassnw`) | Native GitHub integration | Postgres, Auth, Storage, Edge Functions | Preview/sandbox | Keep `SUPABASE_PROJECT_REF` as a non-secret Vercel/GitHub variable; verify the exact project URL and both project-scoped keys before enabling writes |
| Stripe (`acct_1TzfDfReWI4VeYwH`) | Application adapter in PR 3 | One-time checkout and promotions | Test only — the test catalog exists; live mode is unprovisioned | Complete business verification, then approve live activation and real payments separately |
| Retell AI | Application adapter in PR 4 | EN/ES interview calls | Development only | Approve production agents and phone numbers separately |
| Anthropic (Claude) | Server-side adapter in `src/features/analysis` | Structured analysis and report data for the paid assessment | Synthetic/development | Approve production data processing through release gate |
| Resend | Application adapter in PR 2/5 | Transactional/lifecycle email | Sandbox/development recipient | Verify sender domain and approve production delivery |

Native integrations own deployment. The repository must not add duplicate Vercel or Supabase deployment workflows while those integrations are healthy.

The fixed root URL is `https://rbndiytodvoyiejassnw.supabase.co`. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY` must both originate from that same project; their values are never recorded in this registry.
