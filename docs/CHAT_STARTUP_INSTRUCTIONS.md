# BizMetria Chat Startup Instructions

**Status:** `LEGACY COMPATIBILITY ENTRYPOINT`
**Last updated:** 2026-07-30

The former permanent-chat startup process has been replaced by one Master Orchestrator plus temporary task-scoped Workstream Chats.

Use the canonical control templates:

- New or replacement Master Chat: [`docs/control/START_NEW_MASTER_CHAT.md`](control/START_NEW_MASTER_CHAT.md)
- Temporary specialist chat: [`docs/control/START_WORKSTREAM_CHAT.md`](control/START_WORKSTREAM_CHAT.md)
- Permanent Master role: [`docs/control/MASTER_ORCHESTRATOR_BRIEF.md`](control/MASTER_ORCHESTRATOR_BRIEF.md)
- Current recovery snapshot: [`docs/control/MASTER_CONTINUATION.md`](control/MASTER_CONTINUATION.md)
- Safe GitHub policy: [`docs/control/GITHUB_SAFE_OPERATING_POLICY.md`](control/GITHUB_SAFE_OPERATING_POLICY.md)

## Required startup boundary

Before any write, every chat must:

1. verify the actual current `main` SHA;
2. inspect real remote branches and relevant PRs;
3. reconcile live-locks with [`docs/control/ACTIVE_WORK.md`](control/ACTIVE_WORK.md);
4. read the global governance documents;
5. read the assigned workstream's canonical `WORKSTREAM_BRIEF.md`, `CURRENT_STATE.md`, local `TASK_QUEUE.md`, `DECISIONS.md`, and `ARTIFACT_INDEX.md`;
6. read task-specific dependencies in full;
7. confirm task ID, branch, allowed/prohibited files, deliverable, acceptance criteria, owner, and handoff target.

## Operating boundary

- One task uses one temporary branch and one draft PR.
- Standard branch: `task/ws-XX/PREFIX-###-short-description`.
- No permanent workstream branches.
- No direct writes to `main`.
- No self-merge or auto-merge.
- No unrecorded decision, owner, deadline, approval, check, or historical claim.
- Open branches and PRs are not approved state.

The recovered files under `docs/chat-briefs/` remain legacy source material. Canonical workstream instructions are under `docs/workstreams/*/WORKSTREAM_BRIEF.md`.
