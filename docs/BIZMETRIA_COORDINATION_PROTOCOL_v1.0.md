# BizMetria Coordination Protocol v1.0

Status: **APPROVED / RECOVERED**

## Objective

Coordinate thirteen specialized ChatGPT workstreams through GitHub without losing decisions, duplicating work, or allowing chat-only outputs to become the project record.

## Roles

### User / product owner

- Makes business decisions that require owner authority.
- Reviews questions escalated by Master Control.
- Authorizes material scope or commercial changes.

### Master Control

- Reads the full current project state.
- Owns Task Queue sequencing and dependencies.
- Assigns one bounded task to the correct workstream.
- Reviews every specialized draft PR for scope, consistency, and acceptance criteria.
- Requests corrections or merges approved work.
- After approval, updates the Decision Log, Project Status, Task Queue, and next assignment.
- Does not invent unresolved owner decisions.

### Specialized workstream

- Reads current `main` and required inputs.
- Executes only the assigned Task Queue item.
- Stores the complete deliverable in the required GitHub path.
- Includes a Handoff Summary in the deliverable.
- Opens a draft PR and does not merge it.
- Escalates missing decisions as open questions rather than assumptions.

## Single source of truth

Merged files in `main` are the operating record. A chat message, local file, or unmerged branch is not an approved source of truth. The Decision Log is the authoritative register of approved product decisions.

## Assignment packet

Every assignment must specify:

- Task ID and title.
- Owner workstream.
- Required input files.
- Target output path or paths.
- Acceptance criteria.
- Known constraints and dependencies.
- Decisions that are explicitly out of scope.

## Handoff contract

Each substantive deliverable ends with:

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

“Decisions approved” must cite existing Decision Log entries or say `None`. A specialized chat cannot approve its own new decision.

## Review protocol

Master Control verifies:

1. The branch starts from current `main`.
2. The PR contains only the assigned scope.
3. Required input documents were used.
4. Acceptance criteria are satisfied.
5. Approved facts match the Decision Log and Master Brief.
6. Recovered or speculative material is labeled.
7. No secrets or personal data were committed.
8. The Handoff Summary is complete.
9. Cross-workstream dependencies are explicit.

The outcome is either requested changes or approval/merge by Master Control. Specialized chats never merge their own PRs.

## Dependency handling

- A blocked task stays open and records the missing decision or file.
- Downstream work may proceed only with explicit provisional assumptions labeled as such.
- Shared schemas require review by every affected workstream before approval.
- English and Spanish assets must retain matching canonical IDs and output contracts.

## Status vocabulary

- `QUEUED`: ready but not started.
- `IN PROGRESS`: assigned and being prepared.
- `REVIEW`: draft PR open.
- `CHANGES REQUESTED`: review corrections required.
- `BLOCKED`: cannot proceed without a dependency or decision.
- `APPROVED`: merged and accepted.
- `APPROVED / RECOVERED`: approved baseline restored from available context.
- `NEEDS RECOVERY REVIEW`: available content is incomplete or approximate.

## Recovery and backup

- Batch related changes into one commit or the minimum practical number.
- Maintain an external remote mirror.
- Create periodic Git bundle backups that include all branches and tags.
- Record the backup date and restoration test outside the primary GitHub account.
- Never store tokens, passwords, or personal data in the repository.
