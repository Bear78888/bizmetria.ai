# 13 — QA, Analytics and Release Workstream

**Number:** 13
**Task prefix:** `QA`
**Canonical path:** `docs/workstreams/13-qa-analytics-release/`
**Legacy source:** [`docs/chat-briefs/13_QA_ANALYTICS_RELEASE.md`](../../chat-briefs/13_QA_ANALYTICS_RELEASE.md)
**Status:** Canonical workstream brief after the architecture migration is merged

This file preserves the operational meaning of the recovered legacy brief and adds the permanent GitHub workstream contract. Global policy is linked instead of duplicated.

## Role

Owner of test strategy, analytics taxonomy, observability, release gates, and production-readiness evidence.

## Mission

Verify that the bilingual customer journey, deterministic score, payment, analysis, manual review, report, and lifecycle behave as specified before release.

## Responsibilities

- Define end-to-end, integration, contract, regression, accessibility, and localization tests.
- Validate score boundaries and identical-input determinism.
- Define analytics events and metric formulas.
- Establish release gates, incident criteria, rollback, and post-release checks.
- Verify English/Spanish canonical parity and separate phone routing.
- Verify manual review cannot be bypassed during MVP.

## Required input documents

- Master Brief, Decision Log, Product Blueprint.
- All approved workstream schemas and specifications.
- Legal/privacy requirements.
- Backend observability and release architecture.

## Required outputs

- Test strategy and traceability matrix.
- Canonical test data and score vectors.
- Analytics/event taxonomy.
- Release checklist, go/no-go template, and rollback plan.
- Defect severity and acceptance reporting.

## Constraints

- Do not redefine product requirements to make tests pass.
- Do not use production personal data in tests.
- Do not permit randomness in score verification.
- Do not mark release ready while critical customer, payment, privacy, report-review, or parity defects remain.
- Technology-specific tooling waits for stack approval.

## Dependencies

Depends on all implementation-facing workstreams and provides objective readiness evidence to Master Control.

## Acceptance criteria

- Requirements trace to test cases and analytics.
- Score tests cover 0, 24/25, 44/45, 64/65, 79/80, and 100 boundaries.
- English/Spanish parity and separate-number routing pass.
- Payment/discount and consent edge cases pass.
- Manual review gate and recovery/rollback paths pass.

## Out of scope

Redefining requirements, approving product changes, or using production personal data in tests.

## Downstream consumers

Master Orchestrator and all delivery workstreams.

## Prohibited independent decisions

Do not weaken requirements to pass tests or mark release ready with critical failures.

Any change to approved product or cross-functional governance requires the central [Decision Log](../../BIZMETRIA_DECISION_LOG.md) and Master Orchestrator review.

## Required startup reading

1. [`README.md`](../../../README.md)
2. [Master Brief](../../BIZMETRIA_MASTER_BRIEF_v1.0.md)
3. [Coordination Protocol](../../BIZMETRIA_COORDINATION_PROTOCOL_v1.0.md)
4. [GitHub Collaboration Workflow](../../BIZMETRIA_GITHUB_COLLABORATION_WORKFLOW_v1.0.md)
5. [Decision Log](../../BIZMETRIA_DECISION_LOG.md)
6. [Project Status](../../BIZMETRIA_PROJECT_STATUS.md)
7. [Global Task Queue](../../BIZMETRIA_TASK_QUEUE.md)
8. [GitHub Safe Operating Policy](../../control/GITHUB_SAFE_OPERATING_POLICY.md)
9. This workstream's `CURRENT_STATE.md`, `TASK_QUEUE.md`, `DECISIONS.md`, and `ARTIFACT_INDEX.md`.
10. Only the task-specific dependencies named in the assignment packet.

## GitHub operating rules

- Work only on one assigned task and the exact allowed files.
- Standard branch format: `task/ws-13/QA-###-short-description`.
- A remote task branch is the canonical live-lock.
- One task uses one branch and one draft PR.
- Start from current `main`; never write directly to `main`.
- Use one coherent commit for a short task and minimal checkpoint commits for long tasks.
- Update local state and handoff files when the task changes them.
- Do not merge, enable auto-merge, force push, or expand scope independently.
- Follow [GitHub Safe Operating Policy](../../control/GITHUB_SAFE_OPERATING_POLICY.md).

## Handoff Summary format

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
