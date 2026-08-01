# Master Continuation

**Repository:** `Bear78888/bizmetria.ai`  
**Current phase:** Sandbox implementation — Public Website and Free Assessment \
**Last updated:** 2026-08-01 \
**Verified starting `main` SHA:** `ddfafe0079972b48540b35b4ee3cf4cfce3e68fd` \
**Current task:** `BE-003 — Public Website and Free Assessment` — `REVIEW` \
**Current execution branch:** `task/ws-09/BE-003-public-site-free-assessment-v2` \
**Current execution PR:** PR [#21](https://github.com/Bear78888/bizmetria.ai/pull/21)

## 2026-08-01 status update (supersedes earlier "mock / preview-blocked" notes)

The following items elsewhere in this file and in the other control/workstream
status documents are now out of date and superseded by this section:

- **CI is green** for PR #21: `Quality and build` and `Browser smoke tests` pass
  (format, lint, typecheck, 33 unit + 5 migration-contract tests, build, and 4
  Playwright E2E). The earlier Prettier failure is fixed.
- **Supabase Branching root cause:** the canonical org `zgthongawzokxqvmsvmt`
  (owner of `rbndiytodvoyiejassnw`) is on the **Free** plan, so native Preview
  Branches return HTTP 402. The fragile per-push branch-provisioning workflow was
  retired.
- **Isolated dev target:** a standalone free-tier project `bizmetria-be003-dev`
  (`bwmyzkufqrufjimtfwow`) now holds the Platform Foundation schema (27 tables,
  RLS forced, 58 policies, 8 functions, private `reports` bucket). A real
  non-mock assessment write was verified end-to-end and then removed; the project
  holds no data. See `ops/preview/isolated-dev-target.md`.
- **Target guard / env schema** accept this dev ref only under an explicit
  `SUPABASE_TARGET_ENV=preview` flag; production stays pinned to the canonical ref
  and the wrong-project incident refs remain refused.
- **Vercel Preview** for this branch is wired to the dev project by
  `.github/workflows/wire-be003-preview.yml`, and a **live end-to-end write is
  verified**: the workflow submits a real assessment through the protected
  Preview URL, requires `storageMode=supabase`, confirms the row in the dev
  project, deletes it and checks none remain.
- **The Vercel Marketplace Supabase integration overwrites the `SUPABASE_*`
  variables** on every deployment with another project's credentials. Proved by
  a guard refusal naming the foreign host and by a direct key probe that
  succeeded while the deployment reported `Invalid API key`. Mitigated in the
  application: the elevated origin is derived from the verified project ref, and
  the service-role key is read from `BIZMETRIA_SUPABASE_SECRET_KEY`. Disconnecting
  the integration from the Vercel project remains an owner dashboard action.
- **A production-affecting defect was found and fixed:** consent rows were sent
  with an explicit null primary key, so `consents` were never stored for any
  submission (`23502`).
- **Still owner-gated:** merging PR #21 (a production deploy), any live Stripe /
  Retell / production Resend action, and rotation of the temporary credentials.

## BizMetria in brief

BizMetria.ai is a cross-industry English/Spanish business assessment platform. The paid `BizMetria Business Assessment` costs **$299 one time**, is not a subscription, and excludes separately sold implementation. Cold traffic starts with a free `AI Opportunity Check`. The canonical product baseline is the [Master Brief](../BIZMETRIA_MASTER_BRIEF_v1.0.md); do not duplicate or silently alter it here.

## Approved product foundation

- English and Spanish launch with separate language numbers and one shared backend.
- Free check: eleven topics plus contact form and separate email/SMS consent treatment.
- Deterministic `AI Opportunity Score` from 0 to 100 with block maxima 30/25/20/15/10.
- Industry, contact data, language, and promotion code do not affect score.
- Paid scope includes an extended questionnaire, adaptive interview up to approximately 45 minutes, personalized analysis, approximately 8–15 recommendations, matrix, 30–90 day roadmap, professional PDF, MVP manual review, and consultation.
- Stripe Coupons and Promotion Codes support $49–$199 off; $199 is late-reactivation-only and is not advertised in advance.
- MC-003 selects `D01-B`, `D02-A`, `D03-A`, `D04-B`, `D05-B`, `D06-B`, `D07-B`, `D08-A`, and `D09-A`; all 50 states plus D.C. are the intended paid-service geography.
- The operating clock is `America/Los_Angeles` and U.S. federal holidays are excluded from the five-business-day report SLA.
- Stripe is approved for real one-time payments. Build test/live separation now; provision account identifiers and live secrets only during final protected activation and never commit them to GitHub.

## Approved operating architecture

PR [#2](https://github.com/Bear78888/bizmetria.ai/pull/2) approved `MC-001` and merged at `473ee6c042bd5224bec75dbc18fa803e9b148aa3`. PR [#3](https://github.com/Bear78888/bizmetria.ai/pull/3) approved `MC-002` and merged at `713c17e2ca854ce65125d65382dedee3fcec6d9c`. One Master Orchestrator coordinates thirteen permanent workstream directories. Temporary chats execute one bounded task on one temporary branch and one draft PR. Permanent workstream branches are prohibited. The recovered `docs/chat-briefs/` directory remains legacy source material.

## Current delivery state

- `MC-001`: `APPROVED`; architecture is canonical in `main`.
- `MC-002`: `APPROVED`; the canonical dependency-ordered roadmap is in `main`.
- `G0 — Governance Ready`: `PASS`.
- `PS-001`: `APPROVED`; Product Blueprint v0.1 merged through PR #5.
- `LS-001`: `APPROVED`; Legal and Data Baseline v0.1 merged through PR #6.
- `PS-002`: `APPROVED`; Owner Decision Package v0.1 merged through PR #8.
- `MC-003`: `APPROVED`; decision record and valid pre-live deferrals merged through PR #9 at `acda4fb7c036660161b6f0ea4d09deed4143c7cb`.
- `PS-003`: `APPROVED`; Product Requirements Baseline v1.0 merged through PR #10 at `68901a35e7f465ed4990881645847092e6fdd2d1`.
- `G1 — Product Baseline Approved`: `PASS`.
- Workstream 02: `PS-004` is `APPROVED` through PR #13.
- Workstream 04: `FA-001` is `APPROVED` through PR #12; OPEN-009 is closed.
- Workstream 11: `LS-002` is `APPROVED` through PR #15 at `a60597ebd3a17c06c923150fb9cf76f24c3a437c`.
- Workstream 10: `LC-001` is `APPROVED` through PR #17 at `7677bee1b0791bb4f954f058aa9e959d4796985a`.
- Workstream 07: `AE-001` is `READY` because FA-001, PS-004, and LS-002 are approved.
- Workstream 09: `BE-002` is `APPROVED` through PR #18; `BE-003` is in review on a clean branch from its merge SHA.
- `G2` and all later tasks remain `PLANNED` behind named dependencies and phase gates.
- Workstream 04 preserves two recovered inputs as historical evidence; implementations use the approved v1 contract.

See the [Delivery Roadmap](DELIVERY_ROADMAP.md) for the complete critical path and the [Workstream Registry](WORKSTREAM_REGISTRY.md) for exact current state.

## Active work

- BE-003 is active on `task/ws-09/BE-003-public-site-free-assessment-v2`, based on verified remote `main` `ddfafe0079972b48540b35b4ee3cf4cfce3e68fd`.
- Supabase target `bizmetria.ai / rbndiytodvoyiejassnw` is verified. Its foundation migration is present and the application tables contain no rows.
- Vercel Preview is still attached to an unrelated Supabase integration; BE-003 therefore uses the mock persistence adapter until the owner replaces the three Preview project variables.
- Entity/address, support identity, legal/tax review, report-review staffing, consultation staffing, and live Stripe credentials are explicit pre-live dependencies; they do not block PS-003, architecture, implementation, or staging.
- The merged recovery, architecture, and MC-002 branches are historical, not live-locks.
- The PS-001 and LS-001 branches are historical after PR #5 and PR #6 merged.
- `test/chatgpt-write-access` remains preserved and untouched.

## Latest completed actions

- Recovery PR #1 was reviewed and merged.
- Architecture PR #2 was independently checked, authorized, and merged.
- Ten delivery phases, gates `G0`–`G10`, task dependencies, acceptance criteria, operating limits, and the `AD READY` checklist were defined.
- Delivery Roadmap PR #3 was independently checked, authorized, and merged.
- Product Blueprint PR #5 was independently checked, authorized, and merged at `21d223223180e7a7d617f28648674efb613c4a92`.
- Legal/Data Baseline PR #6 was independently checked, updated non-destructively to current `main`, authorized, and merged at `b6174f1325136bc69a9859925c570e5770972991`.
- Owner Decision Package PR #8 was independently checked and merged at `66be062629a9b11670d1b76d202a30474eff98f7`.
- MC-003 PR #9 was independently checked and merged at `acda4fb7c036660161b6f0ea4d09deed4143c7cb`.
- PS-003 converted the approved baseline into 162 unique stable requirements and 14 fail-closed pre-live dependencies, passed independent review, and merged through PR #10 at `68901a35e7f465ed4990881645847092e6fdd2d1`.
- Gate `G1` passed.
- FA-001 created the bilingual deterministic free-audit/score contract, passed independent review, and merged through PR #12 at `97446522cf9eba8e63fe1b1887439fb77adabf5f`.
- PS-004 created the minimized paid questionnaire, interview/evidence, recovery, and completion contract, passed independent review, and merged through PR #13 at `1ed5a2a190fdfef03c7d1fcdec5320ec817c596b`.
- OPEN-009 is closed; LS-002 is approved; LC-001 and AE-001 are ready; G2 remains unpassed.
- LS-002 defined consent, claims, field/data-class adoption, rights, retention, and review triggers and merged through PR #15 at `a60597ebd3a17c06c923150fb9cf76f24c3a437c`.

## Current blockers

No code blocker prevents BE-003 preview work. The only infrastructure blocker is the unrelated Vercel Preview Supabase integration; it blocks Preview database writes, not frontend, score, validation, result, or E2E work. Missing entity/operations and qualified legal/tax/vendor/security/release evidence still block live payments and production marketing communications.

## Exact next action

Publish BE-003 as one draft PR, verify CI and Vercel Preview, then replace the Preview Supabase variables with the correct native Preview Branch values before enabling write-mode integration tests. Keep production writes and Resend delivery disabled until project-scoped keys are owner-verified.

## Required Startup Reading

1. [`START_NEW_MASTER_CHAT.md`](START_NEW_MASTER_CHAT.md)
2. [`MASTER_ORCHESTRATOR_BRIEF.md`](MASTER_ORCHESTRATOR_BRIEF.md)
3. [`README.md`](README.md)
4. [`DELIVERY_ROADMAP.md`](DELIVERY_ROADMAP.md)
5. [`WORKSTREAM_REGISTRY.md`](WORKSTREAM_REGISTRY.md)
6. [`ACTIVE_WORK.md`](ACTIVE_WORK.md)
7. [`GITHUB_SAFE_OPERATING_POLICY.md`](GITHUB_SAFE_OPERATING_POLICY.md)
8. [Root README](../../README.md)
9. [Master Brief](../BIZMETRIA_MASTER_BRIEF_v1.0.md)
10. [Coordination Protocol](../BIZMETRIA_COORDINATION_PROTOCOL_v1.0.md)
11. [GitHub Collaboration Workflow](../BIZMETRIA_GITHUB_COLLABORATION_WORKFLOW_v1.0.md)
12. [Decision Log](../BIZMETRIA_DECISION_LOG.md)
13. [Project Status](../BIZMETRIA_PROJECT_STATUS.md)
14. [Global Task Queue](../BIZMETRIA_TASK_QUEUE.md)
15. Actual current GitHub `main` SHA, branches, PRs, checks, and relevant diffs.
