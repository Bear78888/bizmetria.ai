# BizMetria Task Queue

As of: 2026-07-30

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
- **Status:** `REVIEW`
- **Target:** `docs/workstreams/02-product-strategy/deliverables/BIZMETRIA_OWNER_DECISION_PACKAGE_v0.1.md`
- **Dependencies:** Approved `PS-001` and `LS-001`.
- **Outcome:** Independently answerable options, tradeoffs, recommendations, and downstream impact for report timing, Refund Policy, consultation rules, implementation packages/prices, promotion rules, MVP KPIs, capacity assumptions, and related owner/legal triggers.
- **Guardrail:** The package may recommend choices but cannot approve them. `OPEN-001`–`OPEN-009` remain open until their named tasks/gates close them.
- **Assignment state:** Active on `task/ws-02/PS-002-owner-decision-package`; draft PR pending creation and independent review.

### `MC-003 — Owner Decision Gate`

- **Owner:** Master Orchestrator and project owner
- **Status:** `PLANNED`
- **Dependency:** Approved `PS-002`.
- **Outcome:** Record explicit owner decisions, update the Decision Log, freeze Product Requirements v1.0 through `PS-003`, and evaluate `G1`.

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
