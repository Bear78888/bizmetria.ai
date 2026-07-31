# Service Account Registry

**Last updated:** 2026-07-31
**Boundary:** Account identifiers and credential values are intentionally absent.

| Service | Repository integration | Application use | Current allowed mode | Owner action before live use |
|---|---|---|---|---|
| GitHub | Canonical source repository | Source, CI, reviews | Active | Maintain branch protection and reviews |
| Vercel | Native GitHub integration | Next.js runtime and previews | Preview/sandbox | Approve final domain publication separately |
| Supabase | Native GitHub integration | Postgres, Auth, Storage, Edge Functions | Preview/sandbox | Approve production migrations and customer data separately |
| Stripe | Application adapter in PR 3 | One-time checkout and promotions | Test only | Approve live activation and real payments separately |
| Retell AI | Application adapter in PR 4 | EN/ES interview calls | Development only | Approve production agents and phone numbers separately |
| OpenAI | Server-side adapter in PR 4 | Structured analysis and report data | Synthetic/development | Approve production data processing through release gate |
| Resend | Application adapter in PR 2/5 | Transactional/lifecycle email | Sandbox/development recipient | Verify sender domain and approve production delivery |

Native integrations own deployment. The repository must not add duplicate Vercel or Supabase deployment workflows while those integrations are healthy.
