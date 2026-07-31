# Workstream Task Queue

**Workstream:** 11 — Legal, Privacy and Security
**Task prefix:** `LS`
**Last updated:** 2026-07-31


## `LS-001 — Legal and Data Inventory Baseline`

- **Status:** `APPROVED`
- **Priority:** High
- **Objective:** Create the MVP legal, privacy, security, and field-level data baseline needed for later product and architecture decisions.
- **Required inputs:** Approved Master Brief and Decision Log; approved Delivery Roadmap; current recovered customer journey; known contact/consent and assessment inputs; gate `G0`.
- **Expected output:** `docs/workstreams/11-legal-privacy-security/deliverables/BIZMETRIA_LEGAL_DATA_BASELINE_v0.1.md` with an embedded Handoff Summary.
- **Must define:** Field-level data inventory; purpose/access/retention/deletion matrix; separate email/SMS consent baseline; disclaimer inventory; policy issue register; security-risk register.
- **Acceptance criteria:** Data minimization is explicit; unresolved legal questions are flagged for qualified review; no content claims to be final legal advice; no vendor, jurisdiction, retention period, Refund Policy, or legal conclusion is silently approved.
- **Dependencies:** `G0` — `PASS`; current recovered customer journey.
- **Concurrency:** May run in parallel with `PS-001` because the target files do not overlap.
- **Planned branch:** `task/ws-11/LS-001-legal-data-baseline`
- **Historical branch:** `task/ws-11/LS-001-legal-data-baseline`
- **Owner:** Legal, Privacy and Security
- **Evidence:** PR [#6](https://github.com/Bear78888/bizmetria.ai/pull/6), merge SHA `b6174f1325136bc69a9859925c570e5770972991`.
- **Review status:** Independently reviewed, explicitly authorized, merged, and verified.


## `LS-002 — Consent, Claims, and Data Requirements`

- **Status:** `READY`
- **Priority:** High
- **Objective:** Convert the approved product, audit, and paid-assessment contracts into implementable consent text requirements, data lifecycle constraints, rights handling, and claims rules.
- **Required inputs:** `G1 — PASS` plus approved `FA-001` and approved `PS-004`.
- **Expected output:** `docs/workstreams/11-legal-privacy-security/deliverables/BIZMETRIA_CONSENT_CLAIMS_REQUIREMENTS_v1.0.md`.
- **Dependencies:** `G1 — PASS`; FA-001 approved through PR [#12](https://github.com/Bear78888/bizmetria.ai/pull/12); PS-004 approved through PR [#13](https://github.com/Bear78888/bizmetria.ai/pull/13).
- **Planned branch:** `task/ws-11/LS-002-consent-claims-data-requirements`.
- **Owner:** Legal, Privacy and Security.
- **Review status:** All named dependencies merged and verified; no branch or PR exists yet.


## Global portfolio reference

- **ID:** `TASK-004`
- **Status:** See [Global Task Queue](../../BIZMETRIA_TASK_QUEUE.md).
- **Execution mapping:** `LS-001`.
- **Assignment:** Historical execution mapping complete through approved LS-001; LS-002 is the current ready task.
- **Rule:** The global task ID remains a historical portfolio reference; work is performed and reviewed under `LS-001`.



## Required task record

Every future task records a unique ID, title, status, priority, objective, required inputs, expected outputs, branch, acceptance criteria, dependencies, owner, and review status.
