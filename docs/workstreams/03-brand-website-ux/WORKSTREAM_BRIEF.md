# 03 — Brand, Website and UX Workstream

**Number:** 03
**Task prefix:** `UX`
**Canonical path:** `docs/workstreams/03-brand-website-ux/`
**Legacy source:** [`docs/chat-briefs/03_BRAND_WEBSITE_UX.md`](../../chat-briefs/03_BRAND_WEBSITE_UX.md)
**Status:** Canonical workstream brief after the architecture migration is merged

This file preserves the operational meaning of the recovered legacy brief and adds the permanent GitHub workstream contract. Global policy is linked instead of duplicated.

## Role

Owner of brand expression, website information architecture, interaction design, and conversion experience.

## Mission

Create a clear bilingual experience that moves a cold visitor through the free AI Opportunity Check toward the $299 Business Assessment without overpromising or revealing the paid deliverable for free.

## Responsibilities

- Define brand and interface principles.
- Map landing, audit, result, checkout, assessment, status, report, and consultation experiences.
- Specify responsive and accessible states.
- Design English and Spanish copy/content contracts using canonical IDs.
- Define locked-result presentation and transparent $299 pricing.
- Coordinate consent, analytics, and error states.

## Required input documents

- Master Brief, Decision Log, Product Blueprint, Project Status, Task Queue.
- Formal free-audit schema and score/result rules.
- Legal notices and data requirements.
- Payment/lifecycle and analytics contracts.

## Required outputs

- Product Experience Architecture.
- Page and state inventory.
- User flows and wireframe-level requirements.
- Content/canonical-ID mapping for English and Spanish.
- Accessibility and responsive acceptance criteria.

## Constraints

- Do not imply a subscription.
- Do not imply implementation is included.
- Do not expose prohibited free-result content.
- Do not advertise the $199 late-reactivation discount in advance.
- Do not make unsupported savings, outcome, or delivery claims.
- Preserve separate English/Spanish phone routing and shared backend contracts.

## Dependencies

Depends on TASK-001 Product Blueprint, TASK-002 schemas, legal requirements, and payment/lifecycle rules. Supplies requirements to backend, reports, marketing, and QA.

## Acceptance criteria

- Every customer journey state has entry, action, success, error, and recovery behavior.
- English and Spanish experiences have canonical parity.
- Price, consent, and product boundaries are unambiguous.
- Accessibility and mobile behavior are testable.

## Out of scope

Changing product pricing, score logic, legal policy, backend implementation, or promotion eligibility.

## Downstream consumers

Backend, Lifecycle, Marketing, Report/PDF, Legal, and QA.

## Prohibited independent decisions

Do not imply a subscription, include implementation in $299, or expose paid-only content for free.

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
- Standard branch format: `task/ws-03/UX-###-short-description`.
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
