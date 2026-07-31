# Current State

**Workstream:** 10 — Payments, CRM and Lifecycle
**Status:** `READY`
**Last updated:** 2026-07-31
**Current task:** `LC-001 — Commercial and Lifecycle Contract` — `READY`
**Current branch:** None; planned `task/ws-10/LC-001-commercial-lifecycle-contract`
**Current PR:** None

## Approved baseline

$299 one-time checkout, Stripe as the eventual processor, Stripe promotion codes, $49–$199 discount range, late-reactivation-only $199, separate implementation offers, nationwide U.S. intent, `America/Los_Angeles`, and U.S. federal-holiday exclusions for the five-business-day report SLA.

## Completed

Both named LC-001 inputs are approved: PS-003 through PR [#10](https://github.com/Bear78888/bizmetria.ai/pull/10) and LS-002 through PR [#15](https://github.com/Bear78888/bizmetria.ai/pull/15) at `a60597ebd3a17c06c923150fb9cf76f24c3a437c`.

## In progress

No task branch is active. LC-001 is ready for a scoped specification branch.

## Not started

The commercial/lifecycle contract, checkout/entitlement implementation, Stripe adapter, CRM/vendor selection, messaging integrations, refund operations, consultation scheduling, and implementation-sales workflow.

## Open decisions

CRM/email/SMS vendors, exact qualified Refund Policy text, promotion names/timing, tax configuration, support identity, and implementation-sales operating details. Stripe is approved as the eventual real-payment processor; live credentials are intentionally deferred to the final protected activation stage.

## Blockers

No dependency blocker remains for LC-001. Real charging and public paid launch remain blocked by entity/account ownership, support, legal/tax review, exact policies, vendors/security, staffing, release qualification, webhook verification, and protected Stripe live secrets.

## Dependencies

Approved PS-003 and LS-002. UX, Backend, Marketing, QA, and vendor work consume LC-001 later; they are not inputs required to start this contract.

## Files currently relevant

- `WORKSTREAM_BRIEF.md`
- `TASK_QUEUE.md`
- `DECISIONS.md`
- `ARTIFACT_INDEX.md`
- `HANDOFF.md`
- `CHANGELOG.md`
- `deliverables/README.md`
- [Global Task Queue](../../BIZMETRIA_TASK_QUEUE.md)
- [Active Work](../../control/ACTIVE_WORK.md)

## Exact next action

Start LC-001 from verified `main` on `task/ws-10/LC-001-commercial-lifecycle-contract`, author `deliverables/BIZMETRIA_LIFECYCLE_CONTRACT_v1.0.md`, keep Stripe test-mode only with placeholder environment-variable names, and open one draft PR.

## Latest session checkpoint

On 2026-07-31, LS-002 merged through PR #15. LC-001 became dependency-ready; no credential, live payment, real order, or production customer data was introduced.
