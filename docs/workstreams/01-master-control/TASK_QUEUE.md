# Workstream Task Queue

**Workstream:** 01 — Master Control  
**Task prefix:** `MC`  
**Last updated:** 2026-07-30

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

## Planned Master Control gates

| Task | Purpose | Dependency |
|---|---|---|
| `MC-003` | Record the owner decisions needed to freeze the product baseline. | Approved `PS-002` |
| `MC-004` | Approve stack, vendors, cost envelope, account owners, and provisioning actions. | Phase 3 architecture/vendor inputs |
| `MC-005` | Publish executable operations and support runbooks. | `G6`, reliability, and security work |
| `MC-006` | Make the explicit pilot go/no-go decision. | Completed pilot, findings, and remediation |
| `MC-007` | Record `AD READY` and the separate hold/stop/iterate/scale decision. | Stable controlled-launch evidence |

Full definitions are canonical in [`../../control/DELIVERY_ROADMAP.md`](../../control/DELIVERY_ROADMAP.md).

## Required task record

Every future task records a unique ID, title, status, priority, objective, required inputs, expected outputs, branch, acceptance criteria, dependencies, owner, and review status.
