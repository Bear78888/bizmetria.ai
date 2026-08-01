# Current State

**Workstream:** 09 — Backend, Data and Integrations
**Status:** `REVIEW`
**Last updated:** 2026-07-31
**Current task:** `BE-003 — Public Website and Free Assessment`
**Current branch:** `task/ws-09/BE-003-public-site-free-assessment-v2`
**Current PR:** Draft PR [#21](https://github.com/Bear78888/bizmetria.ai/pull/21)

## Confirmed starting point

Remote `main` is `ddfafe0079972b48540b35b4ee3cf4cfce3e68fd`, the merge of Platform Foundation PR #18. Reconciliation PR #20 is closed without merge and its migration is absent from `main`.

The canonical Supabase project is `bizmetria.ai / rbndiytodvoyiejassnw` at `https://rbndiytodvoyiejassnw.supabase.co`. One read-only audit found the canonical foundation migration `20260731000100 platform_foundation`, 27 empty public tables with forced RLS, 56 public plus 2 Storage policies, the required helper functions/triggers, zero Auth users, and one empty private `reports` bucket. No legacy `disputes` object or reconciliation history exists.

## Implemented

- responsive English and Spanish public homepages;
- 11-question canonical free assessment and separate contact/consent step;
- deterministic `ai-opportunity-score/1.0.0` engine and approved free-result boundary;
- server-side validation and score recomputation;
- guarded Supabase service-role persistence adapter plus safe Preview mock adapter;
- result page, up to three opportunity areas, six locked sections, and $299 one-time CTA;
- fail-closed Resend service-email adapter;
- Supabase target guard in scripts, runtime, environment examples, and CI;
- unit, migration-contract, and Playwright E2E coverage;
- non-destructive wrong-target incident record.

## Current boundary

Vercel Production keeps the canonical root URL and project-ref variable and stays on `ASSESSMENT_STORAGE_MODE=mock`. This branch's Vercel Preview is wired (via `.github/workflows/wire-be003-preview.yml`) to the isolated free-tier development project `bizmetria-be003-dev` (`bwmyzkufqrufjimtfwow`) under an explicit `SUPABASE_TARGET_ENV=preview` flag with `ASSESSMENT_STORAGE_MODE=supabase`; that project holds the Platform Foundation schema and no data. Native Supabase Preview Branches are unavailable because the canonical org is on the Free plan (HTTP 402). Resend delivery remains disabled and no production database operation was performed in BE-003. See `ops/preview/isolated-dev-target.md`.

## Acceptance gate

Local and remote format, lint, typecheck, 33 unit tests, five migration-contract tests, and production build pass. GitHub CI installs Chromium (now cached across runs) and owns the authoritative E2E result: the `Quality and build` and `Browser smoke tests` jobs are green on PR #21, and the Vercel Preview is Ready with the isolated dev-project environment.
