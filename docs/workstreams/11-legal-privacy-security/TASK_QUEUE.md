# Workstream Task Queue

**Workstream:** 11 — Legal, Privacy and Security
**Task prefix:** `LS`
**Last updated:** 2026-07-30


## `LS-001 — Legal and Data Inventory Baseline`

- **Status:** `READY`
- **Priority:** High
- **Objective:** Create the MVP legal, privacy, security, and field-level data baseline needed for later product and architecture decisions.
- **Required inputs:** Approved Master Brief and Decision Log; approved Delivery Roadmap; current recovered customer journey; known contact/consent and assessment inputs; gate `G0`.
- **Expected output:** `docs/workstreams/11-legal-privacy-security/deliverables/BIZMETRIA_LEGAL_DATA_BASELINE_v0.1.md` with an embedded Handoff Summary.
- **Must define:** Field-level data inventory; purpose/access/retention/deletion matrix; separate email/SMS consent baseline; disclaimer inventory; policy issue register; security-risk register.
- **Acceptance criteria:** Data minimization is explicit; unresolved legal questions are flagged for qualified review; no content claims to be final legal advice; no vendor, jurisdiction, retention period, Refund Policy, or legal conclusion is silently approved.
- **Dependencies:** `G0` — `PASS`; current recovered customer journey.
- **Concurrency:** May run in parallel with `PS-001` because the target files do not overlap.
- **Planned branch:** `task/ws-11/LS-001-legal-data-baseline`
- **Owner:** `UNASSIGNED`
- **Review status:** Not started; no branch or PR exists.


## Global portfolio reference

- **ID:** `TASK-004`
- **Status:** See [Global Task Queue](../../BIZMETRIA_TASK_QUEUE.md).
- **Execution mapping:** `LS-001`.
- **Assignment:** The execution task is ready; no temporary executor is currently registered.
- **Rule:** The global task ID remains a historical portfolio reference; work is performed and reviewed under `LS-001`.



## Required task record

Every future task records a unique ID, title, status, priority, objective, required inputs, expected outputs, branch, acceptance criteria, dependencies, owner, and review status.
