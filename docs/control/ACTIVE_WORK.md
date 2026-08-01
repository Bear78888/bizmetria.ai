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

| Task | Status | Branch | PR | Scope |
|---|---|---|---|---|
| `BE-003 — Public Website and Free Assessment` | REVIEW | `task/ws-09/BE-003-public-site-free-assessment-v2` | Draft PR pending | Bilingual public website, deterministic free assessment, result/email adapters, target guard, CI/E2E, and native previews |

`BE-002` is merged through PR #18. Incorrect draft PR #20 is closed without merge and its branch is frozen as incident evidence. `AE-001` remains unfinished and is not a blocker for BE-003. Live payments, production marketing communications, and production assessment writes remain fail-closed.

## Non-active preserved branches

- `architecture/master-orchestrator-workstreams-v1` — merged through PR #2; historical.
- `recovery/restore-bizmetria-project` — merged through PR #1; historical.
- `task/ws-01/MC-002-delivery-roadmap` — merged through PR #3; historical.
- `task/ws-01/phase1-inputs-closeout` — merged through PR #7; historical.
- `task/ws-01/MC-003-owner-decision-gate` — merged through PR #9; historical.
- `task/ws-02/PS-001-product-blueprint-v0-1` — merged through PR #5; historical.
- `task/ws-02/PS-002-owner-decision-package` — merged through PR #8; historical.
- `task/ws-02/PS-003-product-requirements-v1` — merged through PR #10; historical.
- `task/ws-01/G1-product-baseline-closeout` — merged through PR #11; historical.
- `task/ws-04/FA-001-free-audit-score-contract` — merged through PR #12; historical.
- `task/ws-02/PS-004-paid-assessment-contract` — merged through PR #13; historical.
- `task/ws-01/phase2-input-contracts-closeout` — service branch; historical when its closeout reaches `main`.
- `task/ws-11/LS-001-legal-data-baseline` — merged through PR #6; historical.
- `task/ws-11/LS-002-consent-claims-data-requirements` — merged through PR #15; historical.
- `task/ws-01/LS-002-phase2-closeout` — service branch; historical when its closeout reaches `main`.
- `task/ws-10/LC-001-commercial-lifecycle-contract` — merged through PR #17; historical.
- `task/ws-09/BE-002-platform-foundation` — merged through PR #18; historical.
- `task/ws-09/BE-003-public-site-free-assessment` — PR #20 closed without merge; frozen incident branch, not reusable.
- `test/chatgpt-write-access` — preserved test branch; do not modify or delete.

## Reconciliation procedure

1. List real remote branches and open PRs.
2. Match task IDs, head branches, owners, and affected paths.
3. Add missing real work to this index through a scoped task.
4. Mark a row complete only after verifying merge/closure and the resulting `main`.
5. Never free or delete an uncertain branch automatically.
