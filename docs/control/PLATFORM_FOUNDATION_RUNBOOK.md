# Platform Foundation Runbook

## Local verification

1. Use Node.js 22 and run `npm ci`.
2. Copy `.env.example` to ignored `.env.local` and configure only sandbox values.
3. Ensure `NEXT_PUBLIC_SUPABASE_URL` is a root project URL.
4. Run `npm run ci`.
5. Run `npm run test:e2e` where Playwright Chromium is available.

## Native preview verification

1. Open a PR from `task/ws-09/BE-002-platform-foundation` to current `main`.
2. Wait for GitHub CI and the existing Vercel Preview status.
3. Confirm the English and Spanish routes, authentication surface, and `/api/health` status. The public health response exposes neither environment names nor values.
4. Treat a successful Vercel build as the full expected-name check: Vercel builds validate the eight integration names and test-mode Stripe boundary before compiling.
5. Confirm the native Supabase integration validates `supabase/migrations/20260731000100_platform_foundation.sql` against a preview branch when available.
6. Do not run `supabase db push`, deploy Edge Functions, or create another Vercel project/workflow.

## Rollback

- Application preview: close the PR or redeploy the preceding Git commit through the native Vercel integration.
- Database preview: discard the Supabase preview branch through the native integration.
- Production rollback is out of scope until production migration permission and a verified backup/rollback plan exist.
