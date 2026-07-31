# Workstream Task Queue

**Workstream:** 02 — Product Strategy
**Task prefix:** `PS`
**Last updated:** 2026-07-31


## `PS-001 — Product Blueprint v0.1`

- **Status:** `APPROVED`
- **Priority:** High
- **Objective:** Create the complete current Product Blueprint as a new version, not as a reconstruction of unavailable historical wording.
- **Required inputs:** Approved Master Brief and Decision Log; approved Delivery Roadmap; recovered product baseline; all relevant open-decision entries; gate `G0`.
- **Expected output:** `docs/workstreams/02-product-strategy/BIZMETRIA_PRODUCT_BLUEPRINT_v0.1.md` with an embedded Handoff Summary.
- **Must define:** Target customers, jobs, value proposition, free/paid boundary, customer journey, paid deliverables, bilingual model, implementation boundary, operating model, risks, metrics, and open decisions.
- **Acceptance criteria:** Preserve every approved product constraint; separate proposals from approved facts; provide actionable downstream inputs; do not silently approve any open commercial or policy decision.
- **Dependencies:** `G0` — `PASS`.
- **Planned branch:** `task/ws-02/PS-001-product-blueprint-v0-1`
- **Historical branch:** `task/ws-02/PS-001-product-blueprint-v0-1`
- **Owner:** Product Strategy
- **Evidence:** PR [#5](https://github.com/Bear78888/bizmetria.ai/pull/5), merge SHA `21d223223180e7a7d617f28648674efb613c4a92`.
- **Review status:** Independently reviewed, explicitly authorized, merged, and verified.


## `PS-002 — Owner Decision Package`

- **Status:** `APPROVED`
- **Priority:** High
- **Objective:** Present independently answerable options, tradeoffs, recommendations, and downstream impact for the open owner-level product decisions.
- **Required inputs:** Merged `PS-001` and `LS-001`.
- **Expected output:** `docs/workstreams/02-product-strategy/deliverables/BIZMETRIA_OWNER_DECISION_PACKAGE_v0.1.md`.
- **Must cover:** Report deadline, Refund Policy, consultation rules, implementation packages/prices, promotion rules, MVP KPIs, and capacity assumptions.
- **Dependencies:** Approved `PS-001` and `LS-001`.
- **Planned branch:** `task/ws-02/PS-002-owner-decision-package`
- **Historical branch:** `task/ws-02/PS-002-owner-decision-package`
- **Owner:** Product Strategy, coordinated by Master Orchestrator.
- **Evidence:** PR [#8](https://github.com/Bear78888/bizmetria.ai/pull/8), merge SHA `66be062629a9b11670d1b76d202a30474eff98f7`.
- **Review status:** Independently reviewed, merged, and verified. No option is approved by the package.


## `PS-003 — Product Requirements Baseline v1.0`

- **Status:** `REVIEW`
- **Priority:** High
- **Objective:** Incorporate approved MC-003 decisions into stable Phase 1 product requirements.
- **Dependency:** Approved and merged `MC-003`, PR [#9](https://github.com/Bear78888/bizmetria.ai/pull/9), merge SHA `acda4fb7c036660161b6f0ea4d09deed4143c7cb`.
- **Expected output:** `docs/workstreams/02-product-strategy/deliverables/BIZMETRIA_PRODUCT_REQUIREMENTS_v1.0.md`.
- **Required inputs:** DEC-001–DEC-026, Product Blueprint v0.1, Legal/Data Baseline v0.1, Owner Decision Package v0.1, and Owner Decision Record v0.1.
- **Acceptance criteria:** Stable testable requirements for every approved product/commercial rule; explicit pre-live dependencies; Stripe test/live and secret boundaries; no unresolved Phase 1 ambiguity; complete Handoff Summary.
- **Branch:** `task/ws-02/PS-003-product-requirements-v1`.
- **PR:** Draft [#10](https://github.com/Bear78888/bizmetria.ai/pull/10).
- **Review status:** Published; independent PR review pending. `G1` is not passed.


## Global portfolio reference

- **ID:** `TASK-001`
- **Status:** See [Global Task Queue](../../BIZMETRIA_TASK_QUEUE.md).
- **Execution mapping:** `PS-001`.
- **Assignment:** Historical execution mapping complete through approved PS-001; current Product Strategy task is PS-003 after MC-003 merge.
- **Rule:** The global task ID remains a historical portfolio reference; work is performed and reviewed under `PS-001`.



## Required task record

Every future task records a unique ID, title, status, priority, objective, required inputs, expected outputs, branch, acceptance criteria, dependencies, owner, and review status.
