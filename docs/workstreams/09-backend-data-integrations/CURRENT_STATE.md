# Current State

**Workstream:** 09 — Backend, Data and Integrations
**Status:** `REVIEW`
**Last updated:** 2026-07-31
**Current task:** `BE-003 — Public Website and Free Assessment`
**Current branch:** `task/ws-09/BE-003-public-site-free-assessment-v2`
**Current PR:** Draft PR pending

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

Vercel Production has the canonical root URL and project-ref variable. Existing Preview Supabase variables are integration-managed by unrelated project `rxdlnszottdnouudkgvb`; they are not used for writes. Publishable/secret key provenance cannot be confirmed from the masked UI. `ASSESSMENT_STORAGE_MODE` remains `mock`, Resend delivery remains disabled, and no production database operation was performed in BE-003.

## Acceptance gate

Local format, lint, typecheck, 26 unit tests, five migration-contract tests, and production build pass. The local browser binary download is blocked by the execution network proxy; GitHub CI installs Chromium and owns the authoritative E2E result. Native Vercel/Supabase preview evidence remains pending until the draft PR is opened.
