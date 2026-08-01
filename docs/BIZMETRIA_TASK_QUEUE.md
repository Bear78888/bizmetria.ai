# BizMetria Task Queue

As of: 2026-07-31

## Sequencing rules

- Master Orchestrator assigns tasks in dependency order.
- A temporary Workstream Chat performs only its assigned task.
- Every output is saved to GitHub with a Handoff Summary and draft PR.
- Temporary Workstream Chats do not merge their own PRs.
- A task becomes `READY` only when every named dependency is merged and verified.
- Standard execution IDs use the owning workstream prefix and branches use `task/ws-XX/PREFIX-###-short-description`.
- Existing global `TASK-###` recovery IDs remain historical portfolio references; the [Delivery Roadmap](control/DELIVERY_ROADMAP.md) supplies bounded execution IDs.
- Default WIP is no more than two execution tasks plus one PR review.

## `MC-001 — Master Orchestrator and Workstream Architecture Migration`

- **Owner:** Master Orchestrator
- **Status:** `APPROVED`
- **Result:** One Master Orchestrator, thirteen permanent GitHub workstreams, temporary task branches/chats, control documents, live-lock rules, and continuity policy.
- **Evidence:** PR [#2](https://github.com/Bear78888/bizmetria.ai/pull/2), merge SHA `473ee6c042bd5224bec75dbc18fa803e9b148aa3`.

## `MC-002 — Delivery Roadmap and Phase Gates`

- **Owner:** Master Orchestrator
- **Status:** `APPROVED`
- **Priority:** High
- **Historical branch:** `task/ws-01/MC-002-delivery-roadmap`
- **Evidence:** PR [#3](https://github.com/Bear78888/bizmetria.ai/pull/3), merge SHA `713c17e2ca854ce65125d65382dedee3fcec6d9c`.
- **Objective:** Define the complete dependency-ordered path from the approved governance baseline to a bilingual production product ready for controlled advertising.
- **Required inputs:** Approved MC-001 architecture, merged recovery product baseline, Decision Log, all workstream briefs/state, and the owner's requested phase plan.
- **Expected outputs:** Canonical roadmap, gates `G0`–`G10`, bounded task catalog, targets, dependencies, acceptance criteria, WIP rules, `AD READY` checklist, and synchronized control/WS01 state.
- **Target:** `docs/control/DELIVERY_ROADMAP.md`.
- **Dependencies:** `MC-001`.
- **Acceptance:** Every phase is executable in dependency order; downstream work cannot start without its inputs; no open product decision is silently resolved; links, task IDs, invariants, and safety checks pass.
- **Review status:** Independently reviewed, explicitly authorized, merged, and verified.

## Gate `G0 — Governance Ready`

- **Status:** `PASS`
- **Recorded:** 2026-07-30
- **Evidence:** MC-001 and MC-002 are merged and verified; the required canonical status records agree; `PS-001` and `LS-001` are the only initial execution assignments.

## Phase 1 approved inputs

### `PS-001 — Product Blueprint v0.1`

- **Owner:** Product Strategy
- **Status:** `APPROVED`
- **Target:** `docs/workstreams/02-product-strategy/BIZMETRIA_PRODUCT_BLUEPRINT_v0.1.md`
- **Dependency:** `G0` passed.
- **Outcome:** Current Product Blueprint covering customers, value, journey, free/paid boundary, paid deliverables, bilingual model, implementation boundary, operating assumptions, metrics, risks, and open decisions.
- **Guardrail:** Do not reconstruct unavailable historical wording or approve open commercial/policy choices.
- **Evidence:** PR [#5](https://github.com/Bear78888/bizmetria.ai/pull/5), merge SHA `21d223223180e7a7d617f28648674efb613c4a92`.
- **Review status:** Independently reviewed, explicitly authorized, merged, and verified.

### `LS-001 — Legal and Data Inventory Baseline`

- **Owner:** Legal, Privacy and Security
- **Status:** `APPROVED`
- **Target:** `docs/workstreams/11-legal-privacy-security/deliverables/BIZMETRIA_LEGAL_DATA_BASELINE_v0.1.md`
- **Dependency:** `G0` passed.
- **Outcome:** Field-level data inventory, consent baseline, purpose/access/retention/deletion matrix, disclaimer inventory, and security/legal issue register.
- **Concurrency:** May run in parallel with PS-001 because the file scope is separate and both use the same approved baseline.
- **Evidence:** PR [#6](https://github.com/Bear78888/bizmetria.ai/pull/6), merge SHA `b6174f1325136bc69a9859925c570e5770972991`.
- **Review status:** Independently reviewed, explicitly authorized, merged, and verified.

## Current execution window

### `PS-002 — Owner Decision Package`

- **Owner:** Product Strategy, coordinated by Master Orchestrator
- **Status:** `APPROVED`
- **Target:** `docs/workstreams/02-product-strategy/deliverables/BIZMETRIA_OWNER_DECISION_PACKAGE_v0.1.md`
- **Dependencies:** Approved `PS-001` and `LS-001`.
- **Outcome:** Independently answerable options, tradeoffs, recommendations, and downstream impact for report timing, Refund Policy, consultation rules, implementation packages/prices, promotion rules, MVP KPIs, capacity assumptions, and related owner/legal triggers.
- **Guardrail:** The package may recommend choices but cannot approve them. `OPEN-001`–`OPEN-009` remain open until their named tasks/gates close them.
- **Historical branch:** `task/ws-02/PS-002-owner-decision-package`.
- **Evidence:** PR [#8](https://github.com/Bear78888/bizmetria.ai/pull/8), merge SHA `66be062629a9b11670d1b76d202a30474eff98f7`.
- **Review status:** Independently reviewed, merged, and verified; the package approves no option.

### `MC-003 — Owner Decision Gate`

- **Owner:** Master Orchestrator and project owner
- **Status:** `APPROVED`
- **Dependency:** Approved `PS-002`.
- **Outcome:** Record explicit owner decisions, update the Decision Log, freeze Product Requirements v1.0 through `PS-003`, and evaluate `G1`.
- **Historical branch after merge:** `task/ws-01/MC-003-owner-decision-gate`.
- **Evidence:** PR [#9](https://github.com/Bear78888/bizmetria.ai/pull/9), merge SHA `acda4fb7c036660161b6f0ea4d09deed4143c7cb`.
- **Target:** `docs/workstreams/01-master-control/deliverables/BIZMETRIA_OWNER_DECISION_RECORD_v0.1.md`.
- **Approved selections:** `D01-B`, `D02-A`, `D03-A`, `D04-B`, `D05-B`, `D06-B`, `D07-B`, `D08-A`, and `D09-A`; Stripe approved for eventual live one-time payments.
- **Deferrals:** Entity/address, support identity, tax/legal review, staffing, and live Stripe credentials are named pre-live dependencies. They do not block PS-003 or non-live build/staging work and do block real charging and public paid launch.
- **Review status:** Independently reviewed, merged, and verified.

### `PS-003 — Product Requirements Baseline v1.0`

- **Owner:** Product Strategy
- **Status:** `APPROVED`
- **Dependency:** Approved and merged `MC-003`, merge SHA `acda4fb7c036660161b6f0ea4d09deed4143c7cb`.
- **Outcome:** Convert the approved decisions, customer journey, legal boundaries, Stripe-ready rule, KPIs, capacity, and pre-live deferrals into stable, testable product requirements.
- **Target:** `docs/workstreams/02-product-strategy/deliverables/BIZMETRIA_PRODUCT_REQUIREMENTS_v1.0.md`.
- **Historical branch:** `task/ws-02/PS-003-product-requirements-v1`.
- **Evidence:** PR [#10](https://github.com/Bear78888/bizmetria.ai/pull/10), merge SHA `68901a35e7f465ed4990881645847092e6fdd2d1`.
- **Guardrail:** `G1` was not passed until PS-003 was independently reviewed and merged; no live payment activation was part of PS-003.
- **Review status:** Independently reviewed, merged, and verified; no live payment activation was performed.

## Gate `G1 — Product Baseline Approved`

- **Status:** `PASS`
- **Recorded:** 2026-07-31
- **Evidence:** Approved MC-003, approved LS-001, and independently reviewed PS-003 merged through PR [#10](https://github.com/Bear78888/bizmetria.ai/pull/10) at `68901a35e7f465ed4990881645847092e6fdd2d1`.
- **Result:** Stable product requirements are available to every downstream Phase 2 contract.
- **Guardrail:** `G1` authorizes contract work only; it does not activate live Stripe, real paid orders, or public paid availability.

## Phase 2 approved inputs and next execution

### `FA-001 — Free Audit and Score Contract`

- **Owner:** Free Audit and Lead Scoring
- **Status:** `APPROVED`
- **Dependency:** `G1 — PASS`.
- **Target:** `docs/workstreams/04-free-audit-lead-scoring/deliverables/BIZMETRIA_FREE_AUDIT_CONTRACT_v1.0.md`.
- **Outcome:** Canonical bilingual 11-question schema, deterministic point table, result-selection rules, locked-content boundary, and regression vectors.
- **Historical branch:** `task/ws-04/FA-001-free-audit-score-contract`.
- **Evidence:** PR [#12](https://github.com/Bear78888/bizmetria.ai/pull/12), merge SHA `97446522cf9eba8e63fe1b1887439fb77adabf5f`.
- **Review status:** Independently reviewed, merged, and verified; OPEN-009 is closed.

### `PS-004 — Paid Assessment Content Contract`

- **Owner:** Product Strategy
- **Status:** `APPROVED`
- **Dependency:** `G1 — PASS`.
- **Target:** `docs/workstreams/02-product-strategy/deliverables/BIZMETRIA_PAID_ASSESSMENT_CONTRACT_v1.0.md`.
- **Outcome:** Extended questionnaire, interview objectives, evidence requirements, fields, partial-completion behavior, completion criteria, and customer-facing scope.
- **Historical branch:** `task/ws-02/PS-004-paid-assessment-contract`.
- **Evidence:** PR [#13](https://github.com/Bear78888/bizmetria.ai/pull/13), merge SHA `1ed5a2a190fdfef03c7d1fcdec5320ec817c596b`.
- **Review status:** Independently reviewed, merged, and verified.

### `LS-002 — Consent, Claims, and Data Requirements`

- **Owner:** Legal, Privacy and Security.
- **Status:** `APPROVED`
- **Dependencies:** `G1 — PASS` plus approved FA-001 and PS-004.
- **Target:** `docs/workstreams/11-legal-privacy-security/deliverables/BIZMETRIA_CONSENT_CLAIMS_REQUIREMENTS_v1.0.md`.
- **Outcome:** Implementable consent/notice requirements, data lifecycle and rights rules, approved/prohibited claims, production review triggers, and exact field-inventory adoption.
- **Historical branch:** `task/ws-11/LS-002-consent-claims-data-requirements`.
- **Boundary:** This task may define testable requirements and draft product copy, but cannot claim qualified legal approval or enable real payments/public launch.
- **Evidence:** PR [#15](https://github.com/Bear78888/bizmetria.ai/pull/15), merge SHA `a60597ebd3a17c06c923150fb9cf76f24c3a437c`.
- **Review status:** Independently reviewed, merged, and verified; qualified legal review and every pre-live dependency remain separate.

### `LC-001 — Commercial and Lifecycle Contract`

- **Owner:** Payments, CRM and Lifecycle.
- **Status:** `APPROVED`
- **Dependencies:** Approved PS-003 and approved LS-002.
- **Target:** `docs/workstreams/10-payments-crm-lifecycle/deliverables/BIZMETRIA_LIFECYCLE_CONTRACT_v1.0.md`.
- **Outcome:** Deterministic pricing, discount, checkout, payment/order, CRM, consent-aware messaging, refund, reactivation, consultation, and implementation-interest states.
- **Historical branch:** `task/ws-10/LC-001-commercial-lifecycle-contract`.
- **Boundary:** Stripe test mode and synthetic data only; no vendor selection, live secret, real charge, final Refund Policy, or public paid activation.
- **Evidence:** PR [#17](https://github.com/Bear78888/bizmetria.ai/pull/17), merge SHA `7677bee1b0791bb4f954f058aa9e959d4796985a`.
- **Review status:** Independently reviewed, merged, and verified from current GitHub.

### `AE-001 — Analysis and Evidence Contract`

- **Owner:** AI Analysis Engine.
- **Status:** `READY`
- **Dependencies:** Approved FA-001, PS-004, and LS-002.
- **Target:** `docs/workstreams/07-ai-analysis-engine/deliverables/BIZMETRIA_ANALYSIS_CONTRACT_v1.0.md`.
- **Outcome:** Language-neutral evidence/input/output schemas, confidence and uncertainty, traceable recommendations, prioritization, matrix/roadmap rules, prohibited-claim handling, and human-review handoff.
- **Planned branch:** `task/ws-07/AE-001-analysis-evidence-contract`.
- **Boundary:** No model/vendor selection or production customer data; every material claim remains traceable and every report remains human-review gated.

### `BE-002 — Platform Foundation`

- **Owner:** Backend, Data and Integrations / Master Orchestrator.
- **Status:** `APPROVED`
- **Priority:** Critical
- **Dependency:** Verified remote `main` at `7677bee1b0791bb4f954f058aa9e959d4796985a`; AE-001 is explicitly not a blocker.
- **Branch:** `task/ws-09/BE-002-platform-foundation`.
- **Outcome:** Executable Next.js/strict-TypeScript foundation, environment validation, Supabase schema/migrations, Auth, RLS, private Storage, synthetic seed, CI/test foundation, and successful native preview evidence.
- **Boundary:** Synthetic/sandbox only; no live Stripe, real payments, production Retell numbers/email/data, production Supabase changes, or final-domain launch.
- **Review status:** Merged through PR [#18](https://github.com/Bear78888/bizmetria.ai/pull/18) at `ddfafe0079972b48540b35b4ee3cf4cfce3e68fd`.

### `BE-003 — Public Website and Free Assessment`

- **Owner:** Backend, Data and Integrations / Brand, Website and UX / Free Audit.
- **Status:** `REVIEW`
- **Priority:** Critical
- **Dependency:** BE-002 and approved FA-001/LS-002 contracts.
- **Branch:** `task/ws-09/BE-003-public-site-free-assessment-v2`.
- **Outcome:** Responsive English/Spanish website, 11-question check, deterministic 0–100 score, contact and separate optional consent choices, server persistence adapter, result and locked paid boundary, $299 CTA, Resend adapter, unit tests, Playwright E2E, target guard, and incident record.
- **Boundary:** Preview uses a mock adapter until the correct Supabase Preview Branch variables replace the unrelated Vercel-managed integration; production database writes, live payments, and live marketing messages remain disabled.
- **Review status:** Local format, lint, typecheck, unit, migration-contract, and build gates pass; draft PR and native previews pending.

## Planned delivery catalog

The full authoritative catalog—covering `PS`, `FA`, `UX`, `EN`, `ES`, `AE`, `RP`, `BE`, `LC`, `LS`, `MS`, `QA`, and later `MC` gates—is maintained in [`docs/control/DELIVERY_ROADMAP.md`](control/DELIVERY_ROADMAP.md). Do not copy the complete list here; use this queue for current and immediately next assignments.

## Historical recovery references

- `TASK-000` — governance baseline: approved/recovered through PR #1.
- `TASK-001` — historical Product Blueprint portfolio need: now executed as `PS-001`.
- `TASK-002` — historical formal free-audit portfolio need: now executed as `FA-001`.
- `TASK-003` — historical product-experience portfolio need: now executed as `UX-001`.
- `TASK-004` — historical legal/data baseline need: now executed as `LS-001`.

## Unscheduled operational follow-up

External repository mirror and Git bundle backup automation remains a separate authorized task under the Backup and Continuity Policy. It is not implied to be complete by MC-002.
