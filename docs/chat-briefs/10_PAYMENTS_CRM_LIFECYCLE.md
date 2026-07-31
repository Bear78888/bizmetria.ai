# 10 — Payments, CRM and Lifecycle

Status: **APPROVED / RECOVERED**

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

## GitHub workflow

Read current `main`; create an assigned-task branch; store the complete specification and test matrix; open a draft PR; report only PR, branch, paths, status, and blockers.

The primary deliverable must include a `## Handoff Summary`.

Do not merge the PR. Master Control controls approval.
