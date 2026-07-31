# Workstream Task Queue

**Workstream:** 10 — Payments, CRM and Lifecycle
**Task prefix:** `LC`
**Last updated:** 2026-07-31

## `LC-001 — Commercial and Lifecycle Contract`

- **Status:** `REVIEW`
- **Priority:** High
- **Objective:** Define the vendor-neutral, consent-aware contract for price presentation, Stripe test/live isolation, checkout, order and entitlement states, promotions, staged refund logic, customer messaging, report delivery SLA, consultation, reactivation, and separate implementation opportunities.
- **Required inputs:** Approved PS-003 and LS-002.
- **Expected output:** `docs/workstreams/10-payments-crm-lifecycle/deliverables/BIZMETRIA_LIFECYCLE_CONTRACT_v1.0.md` with an embedded Handoff Summary.
- **Must define:** Commercial invariants; state machines; Stripe adapter boundary; idempotency/webhook rules; promotion and refund calculations; purpose/channel eligibility and suppression; operating calendar; event schemas; CRM projection; consultation/implementation separation; error states; acceptance vectors; pre-live gates.
- **Acceptance criteria:** $299 base price and approved promotion/refund rules are unambiguous; live checkout cannot activate from source code or key presence alone; no secrets are committed; test and live objects cannot cross; webhook-driven entitlement is idempotent; consent and suppression precedence match LS-002; federal-holiday SLA behavior is deterministic; all 50 states plus D.C. remain intended scope rather than a public legal claim; missing entity/legal/tax/support/vendor/staffing/security/release inputs fail closed.
- **Dependencies:** PS-003 approved through PR [#10](https://github.com/Bear78888/bizmetria.ai/pull/10); LS-002 approved through PR [#15](https://github.com/Bear78888/bizmetria.ai/pull/15).
- **Branch:** `task/ws-10/LC-001-commercial-lifecycle-contract`.
- **Owner:** Payments, CRM and Lifecycle.
- **Evidence:** `deliverables/BIZMETRIA_LIFECYCLE_CONTRACT_v1.0.md` in draft PR [#17](https://github.com/Bear78888/bizmetria.ai/pull/17).
- **Review status:** Content and five operating records prepared; local validation, independent remote review, and merge pending.

New local tasks must use `LC-###`, must not reuse an existing ID, and must link to any related global portfolio task.

## Required task record

Every future task records a unique ID, title, status, priority, objective, required inputs, expected outputs, branch, acceptance criteria, dependencies, owner, and review status.
