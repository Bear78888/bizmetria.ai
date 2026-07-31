# Workstream Task Queue

**Workstream:** 01 — Master Control  
**Task prefix:** `MC`  
**Last updated:** 2026-07-31

## `MC-001 — Master Orchestrator and Workstream Architecture Migration`

- **Status:** `APPROVED`
- **Priority:** High
- **Result:** One Master Orchestrator, thirteen persistent GitHub workstreams, temporary task branches/chats, control documents, live-lock rules, and continuity policy.
- **Evidence:** PR [#2](https://github.com/Bear78888/bizmetria.ai/pull/2), merge SHA `473ee6c042bd5224bec75dbc18fa803e9b148aa3`.
- **Owner:** Master Orchestrator
- **Review status:** Reviewed, explicitly authorized, and merged.

## `MC-002 — Delivery Roadmap and Phase Gates`

- **Status:** `APPROVED`
- **Priority:** High
- **Objective:** Create the complete dependency-ordered route from approved governance to a bilingual production product ready for controlled advertising.
- **Required inputs:** Approved MC-001 architecture, recovery product baseline, Decision Log, all workstream briefs/state, and the owner's phase-plan request.
- **Expected outputs:** Canonical roadmap, gates `G0`–`G10`, task catalog, dependencies, targets, acceptance criteria, WIP rules, `AD READY` checklist, synchronized control/global/WS01 records, and one draft PR.
- **Historical branch:** `task/ws-01/MC-002-delivery-roadmap`
- **Evidence:** PR [#3](https://github.com/Bear78888/bizmetria.ai/pull/3), merge SHA `713c17e2ca854ce65125d65382dedee3fcec6d9c`.
- **Acceptance criteria:** Complete dependency chain; unique task IDs; no task can begin before inputs exist; all open decisions remain explicit; links/invariants/safety validation passes; no self-merge.
- **Dependencies:** Approved `MC-001`, merge SHA `473ee6c042bd5224bec75dbc18fa803e9b148aa3`.
- **Owner:** Master Orchestrator
- **Review status:** Independently reviewed, explicitly authorized, merged, and verified.

## Gate `G0 — Governance Ready`

- **Status:** `PASS`
- **Recorded:** 2026-07-30
- **Evidence:** MC-001 and MC-002 merged and verified; canonical status records synchronized; `PS-001` and `LS-001` are the only initial execution assignments.

## Phase 1 input approval checkpoint

- **Status:** `PASS`
- **Recorded:** 2026-07-30
- **Evidence:** `PS-001` merged through PR [#5](https://github.com/Bear78888/bizmetria.ai/pull/5) at `21d223223180e7a7d617f28648674efb613c4a92`; `LS-001` merged through PR [#6](https://github.com/Bear78888/bizmetria.ai/pull/6) at `b6174f1325136bc69a9859925c570e5770972991`.
- **Next authorized task:** `PS-002 — Owner Decision Package`.
- **Guardrail:** This checkpoint approves the two input documents only. It does not pass `G1` or resolve any owner, legal, vendor, timing, promotion, implementation-pricing, or score-table decision.

## `MC-003 — Product Decision Gate`

- **Status:** `APPROVED`
- **Priority:** High
- **Objective:** Record explicit owner decisions from the approved PS-002 package, update the Decision Log, and provide stable inputs for PS-003.
- **Required inputs:** Approved PS-002 plus owner selections and bounded dispositions for `F01`–`F10` — complete in PR #9.
- **Expected output:** `docs/workstreams/01-master-control/deliverables/BIZMETRIA_OWNER_DECISION_RECORD_v0.1.md`, updated Decision Log, synchronized state, and a reviewable gate result.
- **Historical branch after merge:** `task/ws-01/MC-003-owner-decision-gate`.
- **Evidence:** PR [#9](https://github.com/Bear78888/bizmetria.ai/pull/9), merge SHA `acda4fb7c036660161b6f0ea4d09deed4143c7cb`.
- **Acceptance criteria:** No authority is inferred; selected rules are internally consistent; qualified-review dependencies are explicit; blocking open decisions are closed or validly deferred; PS-003 receives stable requirements.
- **Dependencies:** Approved PS-002, PR [#8](https://github.com/Bear78888/bizmetria.ai/pull/8), merge SHA `66be062629a9b11670d1b76d202a30474eff98f7`.
- **Owner:** Project owner and Master Orchestrator.
- **Approved result:** D01-B/D02-A/D03-A/D04-B/D05-B/D06-B/D07-B/D08-A/D09-A, nationwide U.S. intent, confirmed operating calendar, and Stripe-ready test/live architecture.
- **Review status:** Independently reviewed, merged, and verified. Pre-live dependencies remain enforceable launch blockers.

## Gate `G1 — Product Baseline Approved`

- **Status:** `PASS`
- **Recorded:** 2026-07-31
- **Evidence:** MC-003 and LS-001 approved; PS-003 independently reviewed and merged through PR [#10](https://github.com/Bear78888/bizmetria.ai/pull/10), merge SHA `68901a35e7f465ed4990881645847092e6fdd2d1`.
- **Result:** `FA-001` and `PS-004` became `READY` at G1 and are now `APPROVED`; `LS-002` is `READY`; later Phase 2 tasks retain their named dependencies.
- **Boundary:** No real payment, public paid launch, or live Stripe activation is authorized.

## Phase 2 input contracts checkpoint

- **Status:** `PASS`
- **Recorded:** 2026-07-31
- **Evidence:** FA-001 independently reviewed and merged through PR [#12](https://github.com/Bear78888/bizmetria.ai/pull/12) at `97446522cf9eba8e63fe1b1887439fb77adabf5f`; PS-004 independently reviewed and merged through PR [#13](https://github.com/Bear78888/bizmetria.ai/pull/13) at `1ed5a2a190fdfef03c7d1fcdec5320ec817c596b`.
- **Result:** `OPEN-009` is `CLOSED`; `LS-002` is `READY`.
- **Guardrail:** `G2` is not passed. Live payment, real paid orders, production data, and public launch remain blocked by their named dependencies.

## LS-002 contract checkpoint

- **Status:** `PASS`
- **Recorded:** 2026-07-31
- **Evidence:** LS-002 independently reviewed and merged through PR [#15](https://github.com/Bear78888/bizmetria.ai/pull/15) at `a60597ebd3a17c06c923150fb9cf76f24c3a437c`.
- **Result:** `LC-001` and `AE-001` are `READY` and may proceed independently on non-overlapping workstream files.
- **Guardrail:** `G2` remains `NOT PASSED`. Stripe remains test-mode only; no real order, production customer data, nationwide public claim, or public paid launch is authorized.

## Planned Master Control gates

| Task | Purpose | Dependency |
|---|---|---|
| `MC-004` | Approve stack, vendors, cost envelope, account owners, and provisioning actions. | Phase 3 architecture/vendor inputs |
| `MC-005` | Publish executable operations and support runbooks. | `G6`, reliability, and security work |
| `MC-006` | Make the explicit pilot go/no-go decision. | Completed pilot, findings, and remediation |
| `MC-007` | Record `AD READY` and the separate hold/stop/iterate/scale decision. | Stable controlled-launch evidence |

Full definitions are canonical in [`../../control/DELIVERY_ROADMAP.md`](../../control/DELIVERY_ROADMAP.md).

## Required task record

Every future task records a unique ID, title, status, priority, objective, required inputs, expected outputs, branch, acceptance criteria, dependencies, owner, and review status.
