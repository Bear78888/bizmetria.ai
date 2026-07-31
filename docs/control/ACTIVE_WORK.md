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
| 01 Master Control (cross-functional) | MC-001 | Master Orchestrator | `architecture/master-orchestrator-workstreams-v1` | [#2](https://github.com/Bear78888/bizmetria.ai/pull/2) | `README.md`; selected global governance files; `docs/control/**`; `docs/chat-briefs/README.md`; required operating files under all `docs/workstreams/**` directories | 2026-07-30 | REVIEW | Validated draft PR for independent review; no self-merge |

## Reconciliation procedure

1. List real remote branches and open PRs.
2. Match task IDs, head branches, owners, and affected paths.
3. Add missing real work to this index through a scoped task.
4. Mark a row complete only after verifying merge/closure and the resulting `main`.
5. Never free or delete an uncertain branch automatically.
