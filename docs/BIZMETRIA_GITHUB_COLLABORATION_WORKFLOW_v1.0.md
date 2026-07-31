# BizMetria GitHub Collaboration Workflow v1.0

Status: **APPROVED / RECOVERED**

## Protected-branch rule

No specialized workstream changes `main` directly. All work starts from current `main`, uses a dedicated branch, and reaches `main` through a reviewed pull request.

## Standard workflow

1. Read current `main`.
2. Read `docs/BIZMETRIA_TASK_QUEUE.md`.
3. Read the Master Brief, Decision Log, Project Status, this workflow, and the assigned chat brief.
4. Execute only the assigned task.
5. Create a feature branch from current `main`.
6. Save the complete result in the required GitHub path.
7. Include a Handoff Summary in the main deliverable file.
8. Validate paths, links, facts, and acceptance criteria.
9. Open a draft PR targeting `main`.
10. Report only the PR number/link, branch, file paths, status, and blockers.
11. Do not merge the PR.
12. Master Control reviews the complete diff, requests corrections, or merges it.
13. After approval, Master Control updates the Decision Log, Project Status, Task Queue, and next dependent task.

## Branch naming

Preferred patterns:

- `workstream/<number>-<short-task>`
- `recovery/<short-purpose>`
- `fix/<short-purpose>`

One branch should represent one bounded task or one intentionally bundled recovery.

## Commit policy

- Batch related files into one coherent commit whenever practical.
- Use the minimum number of commits needed for safe review.
- Do not create one API commit per file.
- Commit messages describe the outcome, not the chat activity.
- Do not mix unrelated changes.

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

## Recovery resilience

The project must maintain:

- An external repository mirror controlled independently of the primary GitHub account.
- Periodic `git bundle` backups containing all refs.
- A documented restoration test.
- A preference for batched writes during recovery to reduce API commit volume and partial states.
