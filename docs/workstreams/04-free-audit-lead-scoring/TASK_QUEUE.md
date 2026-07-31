# Workstream Task Queue

**Workstream:** 04 — Free Audit and Lead Scoring
**Task prefix:** `FA`
**Last updated:** 2026-07-31


## `FA-001 — Free Audit and Score Contract`

- **Status:** `REVIEW`
- **Priority:** High
- **Objective:** Convert the recovered free-audit inputs and approved PS-003 boundaries into the canonical bilingual scoring contract.
- **Required inputs:** `G1 — PASS`, approved PS-003, approved LS-001, `BIZMETRIA_FREE_AUDIT_QUESTIONS_RECOVERED_v0.1.md`, and `BIZMETRIA_AI_OPPORTUNITY_SCORE_RECOVERED_v0.1.md`.
- **Expected output:** `docs/workstreams/04-free-audit-lead-scoring/deliverables/BIZMETRIA_FREE_AUDIT_CONTRACT_v1.0.md`.
- **Must define:** 11-question bilingual schema, stable answer IDs, validation, deterministic point table, result-selection rules, score bands, locked-content boundary, versioning, and regression vectors.
- **Acceptance criteria:** Score is always 0–100; block caps 30/25/20/15/10 hold; identical canonical answers are deterministic across languages; test vectors cover 0, 24/25, 44/45, 64/65, 79/80, and 100; identity/contact/language/promotion never affect score; recovered drafts are explicitly approved, corrected, or replaced.
- **Dependencies:** `G1 — PASS`.
- **Planned branch:** `task/ws-04/FA-001-free-audit-score-contract`.
- **Owner:** Free Audit and Lead Scoring.
- **Concurrency:** May run with PS-004 because the targets and local operating files do not overlap.
- **Review status:** Contract drafted and locally validated on `task/ws-04/FA-001-free-audit-score-contract`; under review in draft PR [#12](https://github.com/Bear78888/bizmetria.ai/pull/12).


## Global portfolio reference

- **ID:** `TASK-002`
- **Status:** See [Global Task Queue](../../BIZMETRIA_TASK_QUEUE.md).
- **Execution mapping:** `FA-001`.
- **Assignment:** FA-001 is active on its isolated branch; the global reference remains historical until merge and closeout.
- **Rule:** Execution occurs under FA-001; the global TASK-002 ID remains a historical portfolio reference.



## Required task record

Every future task records a unique ID, title, status, priority, objective, required inputs, expected outputs, branch, acceptance criteria, dependencies, owner, and review status.
