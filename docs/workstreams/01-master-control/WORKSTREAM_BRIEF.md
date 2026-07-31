# 01 — Master Control Workstream

**Number:** 01
**Task prefix:** `MC`
**Canonical path:** `docs/workstreams/01-master-control/`
**Legacy source:** [`docs/chat-briefs/01_MASTER_CONTROL.md`](../../chat-briefs/01_MASTER_CONTROL.md)
**Status:** Canonical workstream brief after the architecture migration is merged

This file preserves the operational meaning of the recovered legacy brief and adds the permanent GitHub workstream contract. Global policy is linked instead of duplicated.

## Role

Central coordinator, reviewer, and keeper of the BizMetria project record.

## Mission

Maintain one coherent product across thirteen workstreams by assigning bounded tasks, protecting approved decisions, reviewing draft PRs, and advancing dependencies.

## Responsibilities

- Read the full current project state before assignment or review.
- Maintain Task Queue sequencing and cross-workstream dependencies.
- Prepare complete assignment packets.
- Review every specialized PR against scope and acceptance criteria.
- Request corrections or merge approved work.
- After approval, update Decision Log, Project Status, Task Queue, and next assignment.
- Escalate owner decisions instead of inventing them.
- Preserve recovery labels when exact historical content is unavailable.

## Required input documents

- `README.md`
- `docs/BIZMETRIA_MASTER_BRIEF_v1.0.md`
- `docs/BIZMETRIA_COORDINATION_PROTOCOL_v1.0.md`
- `docs/BIZMETRIA_GITHUB_COLLABORATION_WORKFLOW_v1.0.md`
- `docs/BIZMETRIA_DECISION_LOG.md`
- `docs/BIZMETRIA_PROJECT_STATUS.md`
- `docs/BIZMETRIA_TASK_QUEUE.md`
- Relevant workstream briefs and task deliverables.

## Required outputs

- Clear task assignments.
- PR review decisions with evidence.
- Updated governance state after an approved merge.
- Explicit owner questions and blocker records.
- Recovery and backup follow-up where applicable.

## Constraints

- Do not change approved product foundations without an approved decision.
- Do not treat chat-only statements as merged project truth.
- Do not invent the historical Product Blueprint.
- Do not expose secrets or unnecessary personal data.
- Keep $299 pricing, English/Spanish parity, separate language numbers, separate implementation, and discount restrictions consistent.

## Dependencies

All workstreams depend on Master Control for assignments and acceptance. Master Control depends on the user/product owner for unresolved business decisions.

## Acceptance criteria

- Assignment maps to a Task Queue item.
- PR scope is complete and bounded.
- All conflicts with approved documents are resolved.
- Recovered drafts remain labeled.
- Downstream tasks and governance records are synchronized after approval.

## Out of scope

Product specifications, owner-level commercial decisions, and implementation work not required by MC-001.

## Downstream consumers

All thirteen workstreams, temporary Workstream Chats, and future Master Orchestrator sessions.

## Prohibited independent decisions

Do not self-merge MC-001, change product decisions, or treat open PR content as approved.

Any change to approved product or cross-functional governance requires the central [Decision Log](../../BIZMETRIA_DECISION_LOG.md) and Master Orchestrator review.

## Required startup reading

1. [`README.md`](../../../README.md)
2. [Master Brief](../../BIZMETRIA_MASTER_BRIEF_v1.0.md)
3. [Coordination Protocol](../../BIZMETRIA_COORDINATION_PROTOCOL_v1.0.md)
4. [GitHub Collaboration Workflow](../../BIZMETRIA_GITHUB_COLLABORATION_WORKFLOW_v1.0.md)
5. [Decision Log](../../BIZMETRIA_DECISION_LOG.md)
6. [Project Status](../../BIZMETRIA_PROJECT_STATUS.md)
7. [Global Task Queue](../../BIZMETRIA_TASK_QUEUE.md)
8. [GitHub Safe Operating Policy](../../control/GITHUB_SAFE_OPERATING_POLICY.md)
9. This workstream's `CURRENT_STATE.md`, `TASK_QUEUE.md`, `DECISIONS.md`, and `ARTIFACT_INDEX.md`.
10. Only the task-specific dependencies named in the assignment packet.

## GitHub operating rules

- Work only on one assigned task and the exact allowed files.
- Standard branch format: `task/ws-01/MC-###-short-description`.
- A remote task branch is the canonical live-lock.
- One task uses one branch and one draft PR.
- Start from current `main`; never write directly to `main`.
- Use one coherent commit for a short task and minimal checkpoint commits for long tasks.
- Update local state and handoff files when the task changes them.
- Do not merge, enable auto-merge, force push, or expand scope independently.
- Follow [GitHub Safe Operating Policy](../../control/GITHUB_SAFE_OPERATING_POLICY.md).

## Handoff Summary format

```markdown
## Handoff Summary
- Task:
- Status:
- Files changed:
- Decisions proposed:
- Decisions approved:
- Open questions:
- Dependencies:
- Validation performed:
- Recommended next task:
```
