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
- **Branch:** `task/ws-09/BE-002-platform-foundation`
- **PR:** Draft PR [#18](https://github.com/Bear78888/bizmetria.ai/pull/18)
- **Dependencies:** Current `main`; AE-001 is not a blocker for this task.
- **Owner:** Master Orchestrator / Backend, Data and Integrations
- **Acceptance:** Local gate, CI, Vercel Preview, Supabase preview validation when supported, secret scan, and production-boundary checks pass.
- **Review status:** Merged through PR #18 at `ddfafe0079972b48540b35b4ee3cf4cfce3e68fd`.

## `BE-003 — Public Website and Free Assessment`

- **Status:** `REVIEW`
- **Priority:** Critical
- **Objective:** Deliver the first public bilingual product flow on the merged foundation.
- **Outputs:** EN/ES homepages, mobile UI, 11 canonical questions, 0–100 score, contact and separate optional consents, guarded persistence, result/locked boundary, $299 CTA, Resend adapter, unit and Playwright tests, and Vercel Preview.
- **Branch:** `task/ws-09/BE-003-public-site-free-assessment-v2`
- **PR:** Draft PR pending
- **Dependencies:** Approved BE-002, FA-001, LS-002, and exact Supabase target `rbndiytodvoyiejassnw`.
- **Acceptance:** Local and CI gates, Vercel Preview, correct Preview database credentials before write-mode validation, no raw answers/contact in result payloads, and no production/live activation.
- **Review status:** Local non-browser gate passed; draft PR and native preview evidence pending.
