# Workstream Task Queue

**Workstream:** 02 — Product Strategy
**Task prefix:** `PS`
**Last updated:** 2026-07-30


## `PS-001 — Product Blueprint v0.1`

- **Status:** `REVIEW`
- **Priority:** High
- **Objective:** Create the complete current Product Blueprint as a new version, not as a reconstruction of unavailable historical wording.
- **Required inputs:** Approved Master Brief and Decision Log; approved Delivery Roadmap; recovered product baseline; all relevant open-decision entries; gate `G0`.
- **Expected output:** `docs/workstreams/02-product-strategy/BIZMETRIA_PRODUCT_BLUEPRINT_v0.1.md` with an embedded Handoff Summary.
- **Must define:** Target customers, jobs, value proposition, free/paid boundary, customer journey, paid deliverables, bilingual model, implementation boundary, operating model, risks, metrics, and open decisions.
- **Acceptance criteria:** Preserve every approved product constraint; separate proposals from approved facts; provide actionable downstream inputs; do not silently approve any open commercial or policy decision.
- **Dependencies:** `G0` — `PASS`.
- **Planned branch:** `task/ws-02/PS-001-product-blueprint-v0-1`
- **Branch:** `task/ws-02/PS-001-product-blueprint-v0-1`
- **Owner:** Product Strategy temporary executor
- **Review status:** Draft [#5](https://github.com/Bear78888/bizmetria.ai/pull/5) is open for independent review.


## `PS-002 — Owner Decision Package`

- **Status:** `PLANNED`
- **Priority:** High
- **Objective:** Present independently answerable options, tradeoffs, recommendations, and downstream impact for the open owner-level product decisions.
- **Required inputs:** Merged `PS-001` and `LS-001`.
- **Expected output:** `docs/workstreams/02-product-strategy/deliverables/BIZMETRIA_OWNER_DECISION_PACKAGE_v0.1.md`.
- **Must cover:** Report deadline, Refund Policy, consultation rules, implementation packages/prices, promotion rules, MVP KPIs, and capacity assumptions.
- **Dependencies:** Approved `PS-001` and `LS-001`.
- **Owner:** Product Strategy, coordinated by Master Orchestrator.
- **Review status:** Blocked until both dependencies merge.


## Global portfolio reference

- **ID:** `TASK-001`
- **Status:** See [Global Task Queue](../../BIZMETRIA_TASK_QUEUE.md).
- **Execution mapping:** `PS-001`.
- **Assignment:** The execution task is ready; no temporary executor is currently registered.
- **Rule:** The global task ID remains a historical portfolio reference; work is performed and reviewed under `PS-001`.



## Required task record

Every future task records a unique ID, title, status, priority, objective, required inputs, expected outputs, branch, acceptance criteria, dependencies, owner, and review status.
