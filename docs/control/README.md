# BizMetria Control System

`docs/control/` is the global orchestration layer for one Master Orchestrator coordinating thirteen permanent GitHub workstreams. It does not replace product specifications or local workstream state.

## Control document map

| Document | Purpose |
|---|---|
| [`MASTER_ORCHESTRATOR_BRIEF.md`](MASTER_ORCHESTRATOR_BRIEF.md) | Permanent role, authority, startup, assignment, review, merge, conflict, and handoff rules. |
| [`MASTER_CONTINUATION.md`](MASTER_CONTINUATION.md) | Compact current snapshot for restoring the project in a new Master Chat. |
| [`WORKSTREAM_REGISTRY.md`](WORKSTREAM_REGISTRY.md) | Structured index of all thirteen workstreams. |
| [`ACTIVE_WORK.md`](ACTIVE_WORK.md) | Human-readable live-lock index checked against real remote branches and PRs. |
| [`GITHUB_SAFE_OPERATING_POLICY.md`](GITHUB_SAFE_OPERATING_POLICY.md) | Safe, low-volume GitHub automation policy. |
| [`BACKUP_AND_CONTINUITY_POLICY.md`](BACKUP_AND_CONTINUITY_POLICY.md) | Off-platform mirror, bundle, restore, and continuity requirements. |
| [`START_NEW_MASTER_CHAT.md`](START_NEW_MASTER_CHAT.md) | Ready-to-use startup instructions for a replacement Master Chat. |
| [`START_WORKSTREAM_CHAT.md`](START_WORKSTREAM_CHAT.md) | Assignment template for a temporary specialist chat. |
| [`MIGRATION_REPORT.md`](MIGRATION_REPORT.md) | Evidence, mapping, validation, risks, and rollback for MC-001. |
| [`README.md`](README.md) | This map and operating overview. |

## Source-of-truth hierarchy

1. Explicit current user instructions.
2. Actual state of `Bear78888/bizmetria.ai`.
3. Merged canonical documents in current `main`.
4. Approved merged deliverables and Decision Log history.
5. Open branches and PRs as unapproved working context.
6. Legacy briefs and recovered drafts as source material only.

`main` is the only source of approved repository state. Open PR content must never be presented as approved.

## Start the Master Orchestrator

1. Use [`START_NEW_MASTER_CHAT.md`](START_NEW_MASTER_CHAT.md).
2. Read [`MASTER_CONTINUATION.md`](MASTER_CONTINUATION.md) and every item in its Required Startup Reading.
3. Verify the current `main` SHA, branches, PRs, and checks.
4. Reconcile [`ACTIVE_WORK.md`](ACTIVE_WORK.md) with real remote branches.
5. Do not write until startup review is complete.

## Start a temporary Workstream Chat

1. Master Orchestrator selects one approved task and verifies its dependencies.
2. Master Orchestrator checks remote branches/PRs for a live-lock.
3. Use [`START_WORKSTREAM_CHAT.md`](START_WORKSTREAM_CHAT.md) with exact allowed/prohibited files and acceptance criteria.
4. The temporary chat works on one task branch, updates the local workstream state/handoff, and opens one draft PR.
5. The temporary chat never merges its own PR.

## Thirteen workstreams

01. [Master Control](../workstreams/01-master-control/WORKSTREAM_BRIEF.md) — `MC`
02. [Product Strategy](../workstreams/02-product-strategy/WORKSTREAM_BRIEF.md) — `PS`
03. [Brand, Website and UX](../workstreams/03-brand-website-ux/WORKSTREAM_BRIEF.md) — `UX`
04. [Free Audit and Lead Scoring](../workstreams/04-free-audit-lead-scoring/WORKSTREAM_BRIEF.md) — `FA`
05. [English Voice Analyst](../workstreams/05-english-voice-analyst/WORKSTREAM_BRIEF.md) — `EN`
06. [Spanish Voice Analyst](../workstreams/06-spanish-voice-analyst/WORKSTREAM_BRIEF.md) — `ES`
07. [AI Analysis Engine](../workstreams/07-ai-analysis-engine/WORKSTREAM_BRIEF.md) — `AE`
08. [Report and PDF System](../workstreams/08-report-pdf-system/WORKSTREAM_BRIEF.md) — `RP`
09. [Backend, Data and Integrations](../workstreams/09-backend-data-integrations/WORKSTREAM_BRIEF.md) — `BE`
10. [Payments, CRM and Lifecycle](../workstreams/10-payments-crm-lifecycle/WORKSTREAM_BRIEF.md) — `LC`
11. [Legal, Privacy and Security](../workstreams/11-legal-privacy-security/WORKSTREAM_BRIEF.md) — `LS`
12. [Marketing, Content and Sales](../workstreams/12-marketing-content-sales/WORKSTREAM_BRIEF.md) — `MS`
13. [QA, Analytics and Release](../workstreams/13-qa-analytics-release/WORKSTREAM_BRIEF.md) — `QA`

## State update rules

- Global portfolio priority and dependencies: [`BIZMETRIA_TASK_QUEUE.md`](../BIZMETRIA_TASK_QUEUE.md).
- Global decisions: [`BIZMETRIA_DECISION_LOG.md`](../BIZMETRIA_DECISION_LOG.md).
- Aggregate status: [`BIZMETRIA_PROJECT_STATUS.md`](../BIZMETRIA_PROJECT_STATUS.md).
- Workstream operational state: each `CURRENT_STATE.md`.
- Workstream detailed tasks: each `TASK_QUEUE.md`.
- Workstream local decisions only: each `DECISIONS.md`.
- Existing outputs: each `ARTIFACT_INDEX.md`.
- Active remote locks: actual branches first, then [`ACTIVE_WORK.md`](ACTIVE_WORK.md) as an index.
- Project recovery snapshot: [`MASTER_CONTINUATION.md`](MASTER_CONTINUATION.md).

Update the canonical detail once and use links in secondary indexes. Do not create competing decision, task, or state records.
