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
| 01 Master Control | MC-002 | Master Orchestrator | `task/ws-01/MC-002-delivery-roadmap` | [#3](https://github.com/Bear78888/bizmetria.ai/pull/3) | `README.md`; `docs/BIZMETRIA_DECISION_LOG.md`; `docs/BIZMETRIA_PROJECT_STATUS.md`; `docs/BIZMETRIA_TASK_QUEUE.md`; selected `docs/control/**`; selected state/index files under `docs/workstreams/01-master-control/**` | 2026-07-30 | REVIEW | Independent review and separate owner merge decision; no self-merge |

## Non-active preserved branches

- `architecture/master-orchestrator-workstreams-v1` — merged through PR #2; historical.
- `recovery/restore-bizmetria-project` — merged through PR #1; historical.
- `test/chatgpt-write-access` — preserved test branch; do not modify or delete.

## Reconciliation procedure

1. List real remote branches and open PRs.
2. Match task IDs, head branches, owners, and affected paths.
3. Add missing real work to this index through a scoped task.
4. Mark a row complete only after verifying merge/closure and the resulting `main`.
5. Never free or delete an uncertain branch automatically.
