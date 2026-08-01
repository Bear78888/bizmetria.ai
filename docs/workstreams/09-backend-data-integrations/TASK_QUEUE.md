# Workstream Task Queue

**Workstream:** 09 — Backend, Data and Integrations
**Task prefix:** `BE`
**Last updated:** 2026-07-31

## `BE-002 — Platform Foundation`

- **Status:** `APPROVED`
- **Priority:** Critical
- **Objective:** Establish the executable sandbox platform required by all product features.
- **Required inputs:** Current remote `main`, approved product/data/commercial contracts, and owner technical directive dated 2026-07-31.
- **Outputs:** Next.js app, strict TypeScript, environment validation, Supabase schema/migration, Auth/RLS/Storage, synthetic seed, CI/tests, runbook, and successful Preview evidence.
- **Historical branch:** `task/ws-09/BE-002-platform-foundation`
- **PR:** Merged PR [#18](https://github.com/Bear78888/bizmetria.ai/pull/18), merge SHA `ddfafe0079972b48540b35b4ee3cf4cfce3e68fd`
- **Dependencies:** Current `main`; AE-001 is not a blocker for this task.
- **Owner:** Master Orchestrator / Backend, Data and Integrations
- **Acceptance:** Local gate, CI, Vercel Preview, Supabase preview validation when supported, secret scan, and production-boundary checks pass.
- **Review status:** All acceptance checks passed. The synthetic Preview branch was removed after merge; production Supabase remained unchanged.

## `BE-003 — Public Website and Free Assessment`

- **Status:** `READY`
- **Priority:** Critical
- **Objective:** Deliver the first working bilingual customer funnel on the approved sandbox foundation.
- **Required inputs:** Approved BE-002, PS-003, FA-001, and LS-002.
- **Outputs:** English/Spanish public pages, canonical 11-question assessment, deterministic score, contact/consent capture, Supabase Preview persistence, result page, basic Resend flow, and unit/E2E coverage.
- **Planned branch:** `task/ws-09/BE-003-public-site-free-assessment`
- **Owner:** Master Orchestrator / Backend, Data and Integrations
- **Boundary:** Preview/synthetic only; no production Supabase migration, real customer traffic, live payment, or unrestricted production email.
