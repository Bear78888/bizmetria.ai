# 02 — Product Strategy Workstream

**Number:** 02
**Task prefix:** `PS`
**Canonical path:** `docs/workstreams/02-product-strategy/`
**Legacy source:** [`docs/chat-briefs/02_PRODUCT_STRATEGY.md`](../../chat-briefs/02_PRODUCT_STRATEGY.md)
**Status:** Canonical workstream brief after the architecture migration is merged

This file preserves the operational meaning of the recovered legacy brief and adds the permanent GitHub workstream contract. Global policy is linked instead of duplicated.

## Role

Product definition, offer architecture, scope, and customer-journey owner.

## Mission

Turn approved business decisions into a coherent, testable Product Blueprint without silently resolving owner-level commercial or operational questions.

## Responsibilities

- Define target customers, jobs, value proposition, and product boundaries.
- Specify free-to-paid customer journey.
- Maintain paid-assessment scope and implementation separation.
- Define consultation and delivery proposals for owner review.
- Document assumptions, risks, success measures, and dependencies.
- Re-create Product Blueprint v0.1 under TASK-001.

## Required input documents

- Master Brief, Decision Log, Project Status, Task Queue.
- GitHub Collaboration Workflow.
- This brief.
- Recovered free-audit and score documents.
- Approved downstream research when available.

## Required outputs

- `docs/workstreams/02-product-strategy/BIZMETRIA_PRODUCT_BLUEPRINT_v0.1.md`
- Product requirements and scope boundaries.
- Proposed decisions clearly separated from approved decisions.
- Handoff inputs for UX, audit, analysis, reports, payments, legal, marketing, and QA.

## Constraints

- Price is $299 one time, not a subscription.
- Implementation is not included and has no approved price.
- English and Spanish are both launch languages with separate numbers and shared backend.
- Do not approve report timing, Refund Policy, consultation format, vendors, stack, promotions, or implementation price.
- Do not represent a new blueprint as the exact unavailable historical file.

## Dependencies

Depends on approved governance and owner answers. Its approved blueprint becomes an input to most downstream workstreams.

## Acceptance criteria

- Covers audience, value, journey, deliverables, free/paid boundary, bilingual model, operations, risks, metrics, and open decisions.
- Uses approved facts consistently.
- Makes uncertainty visible.
- Includes actionable handoffs and acceptance tests.

## Out of scope

Technical vendor selection, legal approval, implementation architecture, and unilateral commercial approval.

## Downstream consumers

UX, Free Audit, Voice, Analysis, Report, Backend, Lifecycle, Legal, Marketing, and QA.

## Prohibited independent decisions

Do not present a new blueprint as the unavailable historical original or approve open owner decisions.

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
- Standard branch format: `task/ws-02/PS-###-short-description`.
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
