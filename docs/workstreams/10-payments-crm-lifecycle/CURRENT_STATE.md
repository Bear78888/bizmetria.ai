# Current State

**Workstream:** 10 — Payments, CRM and Lifecycle
**Status:** `REVIEW`
**Last updated:** 2026-07-31
**Current task:** `LC-001 — Commercial and Lifecycle Contract` — `REVIEW`
**Current branch:** `task/ws-10/LC-001-commercial-lifecycle-contract`
**Current PR:** Draft PR [#17](https://github.com/Bear78888/bizmetria.ai/pull/17)

## Approved baseline

$299 one-time checkout, Stripe as the eventual processor, Stripe promotion codes, $49–$199 discount range, late-reactivation-only $199, separate implementation offers, nationwide U.S. intent, `America/Los_Angeles`, and U.S. federal-holiday exclusions for the five-business-day report SLA.

## Completed

Both named LC-001 inputs are approved: PS-003 through PR [#10](https://github.com/Bear78888/bizmetria.ai/pull/10) and LS-002 through PR [#15](https://github.com/Bear78888/bizmetria.ai/pull/15) at `a60597ebd3a17c06c923150fb9cf76f24c3a437c`.

## In progress

LC-001 is complete as a review candidate on `task/ws-10/LC-001-commercial-lifecycle-contract`. It defines money and promotion math, Stripe test/live isolation and activation, payment/order/entitlement states, capacity, federal-holiday SLA, refunds, CRM projections, consent-aware communications, consultation, separate implementation opportunities, error codes, and 50 acceptance vectors.

## Not started

Independent review, draft PR publication, and merge of LC-001 are not complete. Checkout/entitlement implementation, concrete Stripe configuration, CRM/vendor selection, messaging integrations, refund operations, consultation scheduling, and implementation-sales workflow remain downstream.

## Open decisions

CRM/email/SMS vendors, exact qualified Refund Policy text, promotion names/timing, tax configuration, support identity, and implementation-sales operating details. Stripe is approved as the eventual real-payment processor; live credentials are intentionally deferred to the final protected activation stage.

## Blockers

No content dependency blocker remains for LC-001 review. Real charging and public paid launch remain blocked by entity/account ownership, support, legal/tax review, exact policies, vendors/security, staffing, release qualification, verified implementation, and protected Stripe live secrets.

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

Validate and publish the six-file LC-001 review candidate in one draft PR; merge only after independent remote review passes.

## Latest session checkpoint

On 2026-07-31, LC-001 was prepared from verified main `5dd223f8e11509ec305b2791c3b15c43ca33e097`. It remains vendor-neutral and test-mode only; no credential, live payment, real order, legal/tax approval, or production customer data was introduced.
