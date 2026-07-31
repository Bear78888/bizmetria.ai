# Active Work

**Last updated:** 2026-07-31

## Live-lock rules

- An active remote task branch is the canonical live-lock.
- This file is a human-readable index, not a replacement for checking GitHub.
- Absence from this file does not cancel a real remote branch.
- A second executor must not start the same task ID or overlapping files.
- Conflicts are escalated to the Master Orchestrator.
- A stale branch is not deleted or declared free until its PR, commits, purpose, and owner are verified.
- One task uses one branch and one draft PR.

## Active task index

No execution task is active in the approved post-`G1` state. `FA-001` and `PS-004` are `READY`, not started; each requires its own branch and draft PR before becoming active. The service branch that publishes this closeout is historical when this record reaches `main`.

`PS-001`, `LS-001`, `PS-002`, `MC-003`, and `PS-003` are merged and approved. `G1` is `PASS`. Live payment, real-order, and public-launch work remains blocked by the named pre-live gates.

## Non-active preserved branches

- `architecture/master-orchestrator-workstreams-v1` — merged through PR #2; historical.
- `recovery/restore-bizmetria-project` — merged through PR #1; historical.
- `task/ws-01/MC-002-delivery-roadmap` — merged through PR #3; historical.
- `task/ws-01/phase1-inputs-closeout` — merged through PR #7; historical.
- `task/ws-01/MC-003-owner-decision-gate` — merged through PR #9; historical.
- `task/ws-02/PS-001-product-blueprint-v0-1` — merged through PR #5; historical.
- `task/ws-02/PS-002-owner-decision-package` — merged through PR #8; historical.
- `task/ws-02/PS-003-product-requirements-v1` — merged through PR #10; historical.
- `task/ws-11/LS-001-legal-data-baseline` — merged through PR #6; historical.
- `test/chatgpt-write-access` — preserved test branch; do not modify or delete.

## Reconciliation procedure

1. List real remote branches and open PRs.
2. Match task IDs, head branches, owners, and affected paths.
3. Add missing real work to this index through a scoped task.
4. Mark a row complete only after verifying merge/closure and the resulting `main`.
5. Never free or delete an uncertain branch automatically.
