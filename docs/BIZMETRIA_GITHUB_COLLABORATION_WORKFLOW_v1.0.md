# BizMetria GitHub Collaboration Workflow v1.0

Status: **APPROVED / RECOVERED**

## Protected-branch rule

No specialized workstream changes `main` directly. All work starts from current `main`, uses a dedicated branch, and reaches `main` through a reviewed pull request.

## Standard workflow

1. Read current `main`.
2. Read `docs/control/MASTER_CONTINUATION.md`, `docs/control/ACTIVE_WORK.md`, and the real remote branch/PR state.
3. Read `docs/BIZMETRIA_TASK_QUEUE.md`.
4. Read the Master Brief, Decision Log, Project Status, this workflow, the assigned workstream's `WORKSTREAM_BRIEF.md`, `CURRENT_STATE.md`, local `TASK_QUEUE.md`, `DECISIONS.md`, and `ARTIFACT_INDEX.md`.
5. Verify no live-lock exists for the same task ID or overlapping files.
6. Execute only the assigned task.
7. Create a temporary task branch from current `main`.
8. Save the complete result in the required GitHub path.
9. Update affected workstream state/handoff/index files.
10. Include a Handoff Summary in the main deliverable file.
11. Validate paths, links, facts, and acceptance criteria.
12. Open one draft PR targeting `main`.
13. Report only the PR number/link, branch, file paths, status, and blockers.
14. Do not merge the PR.
15. Master Orchestrator reviews the complete diff, requests corrections, or merges it only with required authority.
16. After approval, synchronize the affected global and local state records.

## Branch naming

Standard task branch:

`task/ws-XX/PREFIX-###-short-description`

Examples:

- `task/ws-02/PS-001-product-blueprint`
- `task/ws-04/FA-002-score-validation`
- `task/ws-05/EN-001-interview-schema`

One branch represents one bounded task, one workstream, and one draft PR. Permanent workstream branches and reuse of merged task branches are prohibited. A cross-functional branch requires explicit Master Orchestrator assignment, one coordinating owner, and an exact allowed-file list.

`architecture/master-orchestrator-workstreams-v1` is a one-time authorized MC-001 exception.

## Commit policy

- Batch related files into one coherent commit whenever practical.
- Use the minimum number of commits needed for safe review.
- Do not create one API commit per file.
- Commit messages describe the outcome, not the chat activity.
- Do not mix unrelated changes.
- Do not force push.
- Follow `docs/control/GITHUB_SAFE_OPERATING_POLICY.md`.

## Draft PR requirements

The PR must include:

- Task ID and owner.
- Summary of changes.
- Paths changed.
- Approved decisions relied on.
- Recovered-draft or provisional material.
- Validation performed.
- Open questions, risks, and dependencies.
- Explicit statement that the PR is not self-approved.

## Handoff Summary requirement

Every primary workstream deliverable must include a Handoff Summary covering task, status, changed files, decisions, open questions, dependencies, validation, and recommended next task.

## Review and merge authority

- Specialized workstreams may update their branch after review comments.
- They may not merge, enable automatic merge, or directly modify governance files unless the assigned task requires it.
- Master Control is the normal merge authority and governance updater.
- Owner decisions must be recorded in the Decision Log before downstream work treats them as approved.

## Safety and repository hygiene

- Never commit secrets, access tokens, passwords, production credentials, or unnecessary personal data.
- Keep canonical IDs stable across English and Spanish.
- Do not present recovered drafts as exact historical originals.
- Preserve existing files unless the task explicitly replaces them.
- Leave the test branch `test/chatgpt-write-access` untouched unless a later, explicit cleanup task authorizes removal.
- Treat a real remote task branch as the canonical live-lock and reconcile it with `docs/control/ACTIVE_WORK.md`.

## Recovery resilience

The project must maintain:

- An external repository mirror controlled independently of the primary GitHub account.
- Periodic `git bundle` backups containing all refs.
- A documented restoration test.
- A preference for batched writes during recovery to reduce API commit volume and partial states.
