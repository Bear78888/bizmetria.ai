# BizMetria Owner Decision Record v0.1

**Task:** `MC-003 — Product Decision Gate` \
**Version:** `v0.1` \
**Status:** `APPROVED — implementation may proceed; live launch dependencies deferred` \
**Owner:** Project owner and Master Orchestrator \
**Prepared:** 2026-07-30 \
**Source baseline:** `main` at `66be062629a9b11670d1b76d202a30474eff98f7`

## 1. Purpose

This record is the controlled approval surface for the options prepared in the approved [Owner Decision Package](../../02-product-strategy/deliverables/BIZMETRIA_OWNER_DECISION_PACKAGE_v0.1.md).

It does not infer consent from prior requests to continue the project. A recommendation becomes an approved product decision only when the project owner explicitly selects it or supplies a bounded replacement. Legal, tax, entity, jurisdiction, reviewer, and consultation facts must be supplied or verified by the named responsible party.

The project owner supplied explicit authority on 2026-07-31. This record therefore closes the product-decision portion of `MC-003` and gives `PS-003` stable implementation inputs. Missing entity, support, staffing, tax, and legal-review facts are validly deferred as named pre-live dependencies; they do not authorize real charges or public commercial launch.

After this record is merged:

- `MC-003` is `APPROVED`;
- `OPEN-001`, `OPEN-003`, and `OPEN-008` are closed;
- `OPEN-002` and `OPEN-007` are closed for product-contract purposes while their legal copy and implementation remain assigned downstream;
- `PS-003` becomes `READY`;
- `G1` remains not passed until `PS-003` is independently reviewed and merged;
- architecture, contracts, implementation, staging, and Stripe test-mode work may proceed;
- live Stripe charges, real paid orders, and public paid availability remain disabled until every pre-live dependency in Section 4 is satisfied.

## 2. Approved input evidence

| Input | Status | Evidence |
|---|---|---|
| `PS-001 — Product Blueprint v0.1` | APPROVED | PR [#5](https://github.com/Bear78888/bizmetria.ai/pull/5), merge SHA `21d223223180e7a7d617f28648674efb613c4a92` |
| `LS-001 — Legal and Data Inventory Baseline v0.1` | APPROVED | PR [#6](https://github.com/Bear78888/bizmetria.ai/pull/6), merge SHA `b6174f1325136bc69a9859925c570e5770972991` |
| `PS-002 — Owner Decision Package v0.1` | APPROVED | PR [#8](https://github.com/Bear78888/bizmetria.ai/pull/8), merge SHA `66be062629a9b11670d1b76d202a30474eff98f7` |

## 3. Owner decision ballot

The owner approved the recommended bundle on 2026-07-31, with one explicit geography override: `D08-A` replaces recommended `D08-B`.

| ID | Decision | Recommended option | Owner selection | Status |
|---|---|---|---|---|
| `D01` | Paid-report delivery service level | `D01-B` — within five U.S. business days after inputs complete | `D01-B` | APPROVED |
| `D02` | Refund Policy model | `D02-A` — stage-based, subject to counsel review | `D02-A` | APPROVED; public text requires counsel |
| `D03` | Included consultation | `D03-A` — one bounded 30-minute session | `D03-A` | APPROVED |
| `D04` | Promotion operating model | `D04-B` — controlled lifecycle ladder | `D04-B` | APPROVED |
| `D05` | Separate implementation packages/prices | `D05-B` — `$1,500`, `$4,500`, and custom from `$9,500` | `D05-B` | APPROVED |
| `D06` | MVP KPI target set | `D06-B` — balanced pilot targets | `D06-B` | APPROVED |
| `D07` | Fulfillment capacity | `D07-B` — six orders/week, then eight after clean evidence | `D07-B` | APPROVED |
| `D08` | MVP service geography | `D08-B` — counsel-cleared U.S. state allowlist | `D08-A` — all 50 U.S. states and D.C. | APPROVED; live nationwide availability requires legal/tax clearance |
| `D09` | Customer age eligibility | `D09-A` — authorized business representatives aged 18+ | `D09-A` | APPROVED; final legal text requires counsel |

Decision evidence: the owner's 2026-07-31 instruction approved recommended `D01`–`D09`, explicitly changed the intended first geography from a state-by-state launch to nationwide United States, confirmed `America/Los_Angeles` plus the U.S. federal-holiday calendar, and selected Stripe for eventual real payments with credentials supplied only at the final integration stage.

## 4. Required factual confirmations

These values cannot be inferred from the decision bundle.

| ID | Required value/evidence | Current value | Status |
|---|---|---|---|
| `F01` | Full legal selling-entity name and entity type | No legal selling entity has been formed or selected yet. | DEFERRED — required before live Stripe activation or a real paid order |
| `F02` | Formation country/state and principal business address | No formation jurisdiction or public business address has been established yet. | DEFERRED — required before live policies, receipts, or a real paid order |
| `F03` | Customer-facing support email and mailing address | Not assigned. Implement as environment/content configuration with non-production placeholders only. | DEFERRED — required before public production availability |
| `F04` | Intended initial paid-order states; final allowlist requires counsel | All 50 U.S. states and the District of Columbia; no international paid launch. | CONFIRMED — live enablement requires nationwide legal/tax clearance |
| `F05` | Operating timezone and business-holiday calendar | `America/Los_Angeles`; U.S. federal-holiday calendar. | CONFIRMED |
| `F06` | Sales-tax review and collection plan | Not arranged. Architecture must support configurable tax treatment and retain test/live separation. | DEFERRED — qualified review required before live Stripe activation |
| `F07` | Refund-policy review result | Not arranged. `D02-A` supplies the product rule; customer-facing wording remains draft. | DEFERRED — qualified counsel required before live payment/publication |
| `F08` | Age-eligibility review result | Not arranged. `D09-A` supplies the product rule; final Terms/privacy treatment remains draft. | DEFERRED — qualified counsel required before real account/payment use |
| `F09` | Primary and backup report reviewers plus weekly available hours | Not assigned. Capacity architecture uses the approved 20–25-hour assumption and must fail closed when no trained reviewer is available. | DEFERRED — names/hours required before first real paid order |
| `F10` | Consultation provider(s), language coverage, and bookable hours | Not assigned. Scheduling must be configuration-driven and unavailable to real customers until provider/language/hours are assigned. | DEFERRED — required before first real paid order |

Owner input recorded on 2026-07-31 confirms that no legal entity exists and the tax, Refund Policy, and age-eligibility reviews have not been organized. The owner also confirmed that a Stripe account exists and real Stripe payments are intended. That intent authorizes Stripe-ready architecture and test-mode implementation, not exposure of credentials or premature live charging.

Sensitive personal details, credentials, tax IDs, payment information, or private counsel documents must not be committed to GitHub. The record needs only business-facing facts and a reference to completed professional review.

## 5. Stripe architecture directive

- Stripe is the approved payment processor for the `$299` one-time assessment and approved Promotion Codes.
- Development and staging use Stripe test mode and synthetic fixtures.
- Test and live secrets, webhook signing secrets, account identifiers, and restricted keys are stored only in the deployment platform's protected secret manager or environment variables.
- No key, account export, tax ID, personal address, or payment data may be committed to GitHub or pasted into project documentation.
- Checkout creation, webhook verification, idempotency, replay protection, refund state, receipt references, promotion eligibility, and test/live isolation are required architecture boundaries.
- Live credentials are provisioned only in the final protected activation step after the entity, tax, policy, support, staffing, security, and release gates are satisfied.

## 6. Gate evaluation

| Gate condition | Current result |
|---|---|
| PS-002 approved and available in `main` | PASS |
| Explicit choice for `D01`–`D09` | PASS — `D01-B`, `D02-A`, `D03-A`, `D04-B`, `D05-B`, `D06-B`, `D07-B`, `D08-A`, `D09-A` |
| Stable geography, timezone, commercial, capacity, and consultation implementation requirements | PASS |
| Missing entity, support, staffing, qualified legal/tax review, and live Stripe credentials | VALIDLY DEFERRED — blocks live activation, not PS-003 or non-live build work |
| Decision Log updated with approved entries | PASS — DEC-017 through DEC-026 proposed in this PR |
| `MC-003 — Product Decision Gate` | APPROVED on merge of PR #9 |
| `PS-003` product requirements merged | NOT STARTED — becomes READY after PR #9 merge |
| `G1 — Product Baseline Approved` | NOT PASSED |

## 7. Completion procedure

Completion result:

1. all selected options and the `D08-A` replacement are recorded;
2. cross-decision consistency passes for product-contract work;
3. every missing professional/operational fact has an explicit owner category, safety effect, and pre-live trigger;
4. DEC-017 through DEC-026 record the approved decisions and Stripe directive;
5. `OPEN-001`, `OPEN-002`, `OPEN-003`, `OPEN-007`, and `OPEN-008` have product-contract dispositions;
6. PR #9 still requires independent final review before merge;
7. `PS-003` starts only from the verified post-merge `main`;
8. `G1` cannot pass until `PS-003` is reviewed and merged;
9. no real charge or paid customer is accepted while a Section 4 pre-live dependency remains unmet.

## 8. Handoff Summary

- **Task:** `MC-003 — Product Decision Gate`
- **Status:** `APPROVED — pending independent PR review and merge`
- **Approved inputs:** PS-001, LS-001, and PS-002.
- **Decisions approved by this checkpoint:** `D01-B`, `D02-A`, `D03-A`, `D04-B`, `D05-B`, `D06-B`, `D07-B`, `D08-A`, `D09-A`, plus Stripe as the eventual real-payment processor with externalized secrets and final-stage live activation.
- **Open decisions:** `OPEN-004`, `OPEN-005`, `OPEN-006`, and `OPEN-009` remain routed to later gates. The Phase 1 product decisions are closed or given downstream implementation/legal dispositions.
- **Technical blocker:** None.
- **Authority blocker:** None for product requirements or non-live implementation.
- **Confirmed live-launch blockers:** No legal entity/business address; support identity unassigned; tax, Refund Policy, and age-rule reviews not arranged; report reviewers and consultation providers unassigned; live Stripe credentials intentionally not provisioned.
- **Checkpoint PR:** Draft [#9](https://github.com/Bear78888/bizmetria.ai/pull/9).
- **Next action:** Independently review and merge PR #9, verify the resulting `main`, then execute `PS-003 — Product Requirements Baseline v1.0` without enabling real payments.
