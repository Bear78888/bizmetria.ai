# 10 — Payments, CRM and Lifecycle Workstream

**Number:** 10
**Task prefix:** `LC`
**Canonical path:** `docs/workstreams/10-payments-crm-lifecycle/`
**Legacy source:** [`docs/chat-briefs/10_PAYMENTS_CRM_LIFECYCLE.md`](../../chat-briefs/10_PAYMENTS_CRM_LIFECYCLE.md)
**Status:** Canonical workstream brief after the architecture migration is merged

This file preserves the operational meaning of the recovered legacy brief and adds the permanent GitHub workstream contract. Global policy is linked instead of duplicated.

## Role

Owner of checkout, Stripe discount mechanics, CRM state, email/SMS lifecycle, and post-audit conversion operations.

## Mission

Create a compliant lifecycle from free-audit contact through $299 purchase, paid fulfillment, reactivation, and separate implementation interest.

## Responsibilities

- Define checkout and payment states for a one-time $299 product.
- Specify Stripe Coupons and Promotion Codes.
- Enforce discount amounts from $49 to $199 off.
- Reserve $199 discount for late reactivation without advance advertising.
- Define CRM stages, lifecycle events, email sequences, and consent checks.
- Separate assessment purchase from implementation offers.
- Define refund-state integration once policy is approved.

## Required input documents

- Master Brief, Decision Log, Product Blueprint.
- Free-audit/contact schema.
- UX, backend, legal, marketing, and analytics requirements.

## Required outputs

- Payment and discount specification.
- CRM lifecycle/state model.
- Email/SMS trigger matrix.
- Promotion eligibility and conflict rules proposal.
- Failure, refund, cancellation, and reactivation flows.

## Constraints

- Assessment is $299 one time, not a subscription.
- Implementation is separate.
- $199 discount is not advertised in advance.
- Final promotion names/timing, CRM/email vendor, and Refund Policy are unresolved.
- Email and SMS require their respective consent and legal basis.
- Do not store payment credentials or secrets in GitHub.

## Dependencies

Depends on Product Strategy, Free Audit, UX, Legal, Backend, and Marketing. Provides states/events to QA and administration.

## Acceptance criteria

- All pricing and discount calculations are deterministic and tested.
- Promotion stacking, expiration, invalid-code, and recovery behavior are explicit.
- Consent is independently enforced for email and SMS.
- CRM state matches customer journey and fulfillment status.
- No flow implies implementation is included.

## Out of scope

Changing product price, advertising the $199 reactivation discount, legal approval, or stack selection.

## Downstream consumers

UX, Backend, Marketing, Legal, Administration, and QA.

## Prohibited independent decisions

Do not imply subscription, include implementation, stack unapproved discounts, or ignore consent.

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
- Standard branch format: `task/ws-10/LC-###-short-description`.
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
