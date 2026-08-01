# Workstream Task Queue

**Workstream:** 09 — Backend, Data and Integrations
**Task prefix:** `BE`
**Last updated:** 2026-07-31

## `BE-002 — Platform Foundation`

- **Status:** `REVIEW`
- **Priority:** Critical
- **Objective:** Establish the executable sandbox platform required by all product features.
- **Required inputs:** Current remote `main`, approved product/data/commercial contracts, and owner technical directive dated 2026-07-31.
- **Outputs:** Next.js app, strict TypeScript, environment validation, Supabase schema/migration, Auth/RLS/Storage, synthetic seed, CI/tests, runbook, and successful Preview evidence.
- **Branch:** `task/ws-09/BE-002-platform-foundation`
- **PR:** Draft PR [#18](https://github.com/Bear78888/bizmetria.ai/pull/18)
- **Dependencies:** Current `main`; AE-001 is not a blocker for this task.
- **Owner:** Master Orchestrator / Backend, Data and Integrations
- **Acceptance:** Local gate, CI, Vercel Preview, Supabase preview validation when supported, secret scan, and production-boundary checks pass.
- **Review status:** Local gate passed; awaiting remote CI, Vercel Preview, and Supabase integration evidence in PR #18.
