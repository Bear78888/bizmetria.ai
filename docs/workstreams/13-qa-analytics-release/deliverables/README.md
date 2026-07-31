# QA, Analytics and Release Deliverables

This directory stores substantive, versioned outputs produced by Workstream 13. Operating files remain one directory above.

## Naming convention

Use descriptive uppercase names with a semantic or numbered version when appropriate, for example:

`QA_DESCRIPTIVE_DELIVERABLE_v0.1.md`

Preserve stable canonical names when an approved specification defines one.

## Status vocabulary

- `Draft` — active work not ready for review.
- `Review` — included in an open draft PR.
- `Approved` — merged to `main` and accepted through the authorized process.
- `Deprecated` — retained for history but replaced by a named artifact.

## Versioning and traceability

- Do not overwrite an approved version as though its prior state never existed; create a new version.
- Every deliverable must link to a real task ID and branch/PR.
- Update [`ARTIFACT_INDEX.md`](../ARTIFACT_INDEX.md) in the same task.
- Record supersession explicitly.
- Never treat an unmerged branch or PR as approved.
