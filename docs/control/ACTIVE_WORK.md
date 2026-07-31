# Active Work

**Last updated:** 2026-07-30

## Live-lock rules

- An active remote task branch is the canonical live-lock.
- This file is a human-readable index, not a replacement for checking GitHub.
- Absence from this file does not cancel a real remote branch.
- A second executor must not start the same task ID or overlapping files.
- Conflicts are escalated to the Master Orchestrator.
- A stale branch is not deleted or declared free until its PR, commits, purpose, and owner are verified.
- One task uses one branch and one draft PR.

## Active task index

| Workstream | Task ID | Owner | Branch | PR | Affected files | Start date | Status | Expected handoff |
|---|---|---|---|---|---|---|---|---|
| 01 — Master Control | `MC-003` | Project owner / Master Orchestrator | `task/ws-01/MC-003-owner-decision-gate` | [#9](https://github.com/Bear78888/bizmetria.ai/pull/9) | Owner Decision Record; Decision Log after owner input; global/control and WS01/02 state | 2026-07-30 | BLOCKED | Explicit owner selections/facts, qualified-review state, complete decision record, and independently reviewed PR |

`PS-001`, `LS-001`, and `PS-002` are merged and approved. MC-003 owns the only active branch and is blocked on explicit authority inputs. `PS-003`, `G1`, and Phase 2 remain gated.

## Non-active preserved branches

- `architecture/master-orchestrator-workstreams-v1` — merged through PR #2; historical.
- `recovery/restore-bizmetria-project` — merged through PR #1; historical.
- `task/ws-01/MC-002-delivery-roadmap` — merged through PR #3; historical.
- `task/ws-01/phase1-inputs-closeout` — merged through PR #7; historical.
- `task/ws-02/PS-001-product-blueprint-v0-1` — merged through PR #5; historical.
- `task/ws-02/PS-002-owner-decision-package` — merged through PR #8; historical.
- `task/ws-11/LS-001-legal-data-baseline` — merged through PR #6; historical.
- `test/chatgpt-write-access` — preserved test branch; do not modify or delete.

## Reconciliation procedure

1. List real remote branches and open PRs.
2. Match task IDs, head branches, owners, and affected paths.
3. Add missing real work to this index through a scoped task.
4. Mark a row complete only after verifying merge/closure and the resulting `main`.
5. Never free or delete an uncertain branch automatically.
