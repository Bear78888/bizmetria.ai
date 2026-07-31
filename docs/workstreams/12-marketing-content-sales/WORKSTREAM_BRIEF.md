# 12 — Marketing, Content and Sales Workstream

**Number:** 12
**Task prefix:** `MS`
**Canonical path:** `docs/workstreams/12-marketing-content-sales/`
**Legacy source:** [`docs/chat-briefs/12_MARKETING_CONTENT_SALES.md`](../../chat-briefs/12_MARKETING_CONTENT_SALES.md)
**Status:** Canonical workstream brief after the architecture migration is merged

This file preserves the operational meaning of the recovered legacy brief and adds the permanent GitHub workstream contract. Global policy is linked instead of duplicated.

## Role

Owner of acquisition strategy, marketing content, sales enablement, funnel messaging, and experiment design.

## Mission

Bring cross-industry English- and Spanish-speaking businesses into the free AI Opportunity Check and convert appropriate prospects to the $299 assessment using clear, supportable claims.

## Responsibilities

- Define audiences, channels, messaging pillars, and campaigns.
- Create English/Spanish content with canonical offer parity.
- Build free-check and paid-assessment sales assets.
- Coordinate email lifecycle content and promotion presentation.
- Define experiment hypotheses, metrics, and stopping rules.
- Feed objections and insights back to Product Strategy.

## Required input documents

- Master Brief, Decision Log, Product Blueprint.
- UX and free-result rules.
- Payment/promotion and CRM lifecycle specification.
- Legal claim/consent requirements.
- Analytics taxonomy.

## Required outputs

- Marketing and sales strategy.
- Channel/content plan and bilingual message matrix.
- Sales scripts and objection handling.
- Experiment backlog and measurement plan.
- Approved-claim and prohibited-claim checklist.

## Constraints

- Price is $299 one time; no subscription framing.
- Implementation is not included.
- Do not advertise the $199 late-reactivation discount in advance.
- Do not reveal paid-only content through free marketing assets.
- Do not promise financial results, guaranteed outcomes, or an unapproved delivery deadline.
- Final promotion names and timing are unresolved.

## Dependencies

Depends on Product Strategy, UX, Free Audit, Payments/Lifecycle, Legal, and Analytics. Provides market learning to Master Control and Product Strategy.

## Acceptance criteria

- Messaging matches approved product facts in both languages.
- Every campaign has audience, offer, CTA, consent path, metric, and test design.
- Claims are supportable and legally reviewed where required.
- Promotion rules cannot conflict with checkout enforcement.

## Out of scope

Changing product scope, legal approval, lifecycle enforcement, or advertising reserved discounts.

## Downstream consumers

Product Strategy, UX, Lifecycle, Legal, and QA/Analytics.

## Prohibited independent decisions

Do not promise guaranteed outcomes, unsupported savings, unapproved timing, or the $199 discount in advance.

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
- Standard branch format: `task/ws-12/MS-###-short-description`.
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
