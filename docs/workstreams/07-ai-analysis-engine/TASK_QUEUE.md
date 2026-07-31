# Workstream Task Queue

**Workstream:** 07 — AI Analysis Engine
**Task prefix:** `AE`
**Last updated:** 2026-07-31

## `AE-001 — Analysis and Evidence Contract`

- **Status:** `READY`
- **Priority:** High
- **Objective:** Define the deterministic, vendor-neutral contract that converts approved free and paid inputs into evidence-linked findings, scores, recommendations, matrix, roadmap, unknowns, and a human-review handoff.
- **Required inputs:** Approved FA-001, PS-004, and LS-002.
- **Expected output:** `docs/workstreams/07-ai-analysis-engine/deliverables/BIZMETRIA_ANALYSIS_CONTRACT_v1.0.md` with an embedded Handoff Summary.
- **Must define:** Typed evidence and claim states; analysis stages; contradiction and unknown handling; recommendation/prioritization rules; output schemas; traceability; safety/claims boundaries; review states; reproducibility; error states; evaluation fixtures; provider-neutral interfaces.
- **Acceptance criteria:** Every output traces to source evidence, assumption, or explicit unknown; score v1 remains immutable; unsupported claims fail closed; no raw customer content enters analytics/logs; human approval is mandatory before delivery; deterministic fixtures cover success, contradiction, incomplete, unsafe-claim, and provider-failure paths; no provider or model is silently selected.
- **Dependencies:** FA-001 approved through PR [#12](https://github.com/Bear78888/bizmetria.ai/pull/12); PS-004 approved through PR [#13](https://github.com/Bear78888/bizmetria.ai/pull/13); LS-002 approved through PR [#15](https://github.com/Bear78888/bizmetria.ai/pull/15).
- **Planned branch:** `task/ws-07/AE-001-analysis-evidence-contract`.
- **Owner:** AI Analysis Engine.
- **Review status:** Ready; no branch or PR created yet.

New local tasks must use `AE-###`, must not reuse an existing ID, and must link to any related global portfolio task.

## Required task record

Every future task records a unique ID, title, status, priority, objective, required inputs, expected outputs, branch, acceptance criteria, dependencies, owner, and review status.
