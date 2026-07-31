# BizMetria Owner Decision Package v0.1

**Task:** `PS-002 — Owner Decision Package` \
**Version:** `v0.1` \
**Status:** `REVIEW — proposals only` \
**Owner workstream:** 02 — Product Strategy \
**Coordinating workstream:** 01 — Master Control \
**Prepared:** 2026-07-30 \
**Source baseline:** `main` at `608ef46e382f86d557168ab2396b56e21e88cf75`

## 1. Purpose and decision boundary

This package turns the remaining Phase 1 owner questions into independently answerable choices. It supplies options, tradeoffs, a recommendation, an exact proposed rule, and downstream consequences. It does not approve any option.

The project owner approves or rejects choices only through `MC-003`. Master Control then records approved decisions in the global Decision Log. Until that happens:

- `OPEN-001`, `OPEN-002`, `OPEN-003`, `OPEN-007`, and `OPEN-008` remain `OPEN`;
- the KPI and capacity values below remain proposals;
- legal, tax, entity, jurisdiction, and age-eligibility statements remain unapproved;
- `G1` remains incomplete;
- no customer-facing promise may quote a proposed service level, refund rule, promotion, implementation price, or consultation rule.

This package is product planning and legal issue-spotting, not legal, tax, or accounting advice. The Refund Policy, launch jurisdictions, entity details, tax treatment, recording flow, and public legal text require qualified review before launch.

## 2. Approved constraints that no option may change

Every option must preserve the following:

- BizMetria Business Assessment costs `$299` one time and is not a subscription.
- The free product is the bilingual `AI Opportunity Check`.
- The paid assessment includes the approved questionnaire, interview, analysis, approximately 8–15 recommendations, matrix, 30–90 day roadmap, PDF, human review, and one results consultation.
- Every MVP report requires explicit human approval before delivery.
- Implementation is a separate scope, agreement, and payment.
- English and Spanish are first-class experiences with equivalent rules.
- Discounts use Stripe Coupons and Promotion Codes.
- Every proposed discount remains within the approved `$49`–`$199` range.
- The `$199` discount is late-reactivation-only and cannot be advertised in advance.
- No option may promise guaranteed savings, revenue, conversion, productivity, or other outcomes.
- Identity, contact, industry, language, payment, and promotion data cannot change the score.

## 3. How to answer

Each decision can be answered separately with an option ID. A complete response can use this compact form:

```text
D01-B
D02-A
D03-A
D04-B
D05-B
D06-B
D07-B
D08-B
D09-A
```

An owner may instead write a bounded modification, for example: `D03-A, but booking window = 21 days`. Any modification must retain the approved constraints and must be rechecked for downstream and legal impact.

`MC-003` also needs the factual confirmations in Section 14. Those facts cannot be inferred from an option code.

## 4. Decision summary

| ID | Decision | Options | Recommendation | Open item / gate | Status |
|---|---|---|---|---|---|
| `D01` | Paid-report delivery service level | A / B / C | `D01-B` — five business days | `OPEN-001`, `MC-003` | PROPOSED |
| `D02` | Refund Policy model | A / B / C | `D02-A` — stage-based | `OPEN-002`, `MC-003` | PROPOSED; counsel review |
| `D03` | Included consultation rules | A / B / C | `D03-A` — bounded 30-minute session | `OPEN-003`, `MC-003` | PROPOSED |
| `D04` | Promotion operating model | A / B / C | `D04-B` — controlled lifecycle ladder | `OPEN-007`, `MC-003` | PROPOSED |
| `D05` | Implementation packages and prices | A / B / C | `D05-B` — three bounded tiers | `OPEN-008`, `MC-003` | PROPOSED |
| `D06` | MVP KPI target set | A / B / C | `D06-B` — balanced targets | `MC-003` | PROPOSED |
| `D07` | Fulfillment capacity and launch cap | A / B / C | `D07-B` — staged six-to-eight orders/week | `MC-003` | PROPOSED |
| `D08` | MVP service geography | A / B / C | `D08-B` — counsel-cleared U.S. state allowlist | `LS-ISSUE-001`, `MC-003` | PROPOSED; entity facts required |
| `D09` | Customer age eligibility | A / B / C | `D09-A` — authorized business representatives aged 18+ | `LS-ISSUE-011`, `MC-003` | PROPOSED; counsel review |

## 5. `D01` — Paid-report delivery service level

### Decision question

What deadline may BizMetria promise for delivery of the human-approved paid report?

### Shared clock definition

For every option, the service-level clock starts at `ASSESSMENT_INPUTS_COMPLETE`, which occurs only when all of the following are true:

1. payment is confirmed and not disputed;
2. the required paid questionnaire is complete;
3. the interview is complete or an approved recovery path supplies sufficient evidence;
4. required customer follow-up items are received;
5. no fraud, safety, consent, or access hold blocks fulfillment.

The deadline uses U.S. business days and the approved operating timezone. The clock pauses only for a recorded customer-action hold or an exceptional event allowed by the final Terms. A pause and resume must create auditable events and a revised customer-visible due date.

### Options

| Option | Customer promise | Capacity effect | Main advantage | Main risk |
|---|---|---|---|---|
| `D01-A` | Within 3 business days | Requires spare reviewer capacity and strong exception handling | Strong speed message | High missed-deadline and quality risk during MVP |
| `D01-B` | Within 5 business days | Supports bounded human review and one regeneration cycle | Balanced promise and quality buffer | Slower than aggressive competitors |
| `D01-C` | Within 7 business days | Lowest launch pressure | Safer with one reviewer | May weaken conversion and urgency |

### Recommendation: `D01-B`

Proposed exact rule:

> BizMetria will make the human-reviewed report available within five U.S. business days after `ASSESSMENT_INPUTS_COMPLETE`. The customer sees the calculated due date. Recorded customer-action holds pause the clock. If BizMetria expects to miss the date, support must notify the customer before the deadline and offer the approved remedy.

Use 5:00 p.m. in the approved operating timezone as the end-of-day boundary. Do not publish a timezone until Section 14 confirms it.

### Downstream impact

- `PS-003`: customer-facing promise and exception states.
- `RP-001`: due-date, hold, review, approval, and delivery states.
- `LC-001`: service emails and missed-deadline remedy.
- `BE-003`: auditable SLA timestamps and pause reasons.
- `QA`: boundary tests across weekends, holidays, holds, and retries.
- `MS`: only the approved deadline may appear in advertising.

## 6. `D02` — Refund Policy model

### Decision question

Which commercial refund model should Product and qualified counsel convert into final checkout and Terms language?

### Required event model

The final policy must distinguish:

- `PAYMENT_CONFIRMED`;
- `FULFILLMENT_NOT_STARTED`;
- `FULFILLMENT_STARTED`;
- `REPORT_APPROVED`;
- `REPORT_DELIVERED`;
- `BIZMETRIA_SLA_MISSED`;
- duplicate, suspected unauthorized, disputed, and processor-reversed payments;
- customer withdrawal, customer-action hold, and BizMetria cancellation.

`FULFILLMENT_STARTED` should be an auditable event, not an estimate. Under the recommended model it is the earliest of:

1. submission of the required paid questionnaire;
2. start of the paid voice interview;
3. manual analysis or reviewer work recorded against the order.

Merely opening the questionnaire does not start fulfillment.

### Options

| Option | Rule | Customer friendliness | Operational cost | Main risk |
|---|---|---:|---:|---|
| `D02-A` | Stage-based: full refund before fulfillment starts; defined remedies afterward | High | Medium | Requires reliable state tracking and carefully reviewed language |
| `D02-B` | Unconditional refund request window, such as 24 hours, then stage-based | Highest | Medium–high | Work may begin inside the unconditional window |
| `D02-C` | All sales final except duplicate/unauthorized charge, law, or BizMetria non-delivery | Low | Low short-term | Higher trust, complaint, and chargeback risk |

### Recommendation: `D02-A`

Proposed policy logic for counsel review:

1. **Before `FULFILLMENT_STARTED`:** customer-requested cancellation receives a full refund to the original payment method.
2. **After `FULFILLMENT_STARTED` and before delivery:** no automatic change-of-mind refund; support evaluates:
   - BizMetria cancellation;
   - inability to provide the purchased service;
   - missed approved SLA;
   - material service defect that cannot be corrected;
   - mandatory legal rights.
3. **After delivery:** no automatic change-of-mind refund; BizMetria first offers correction, clarification, or regeneration where appropriate, while preserving mandatory rights.
4. **Duplicate or confirmed unauthorized charge:** refund or processor remedy under the approved fraud and dispute procedure.
5. **Third-party processor fees and taxes:** treatment must follow the processor, accounting, and legal determination; the public policy must not promise retention of an amount that applicable rules require returning.
6. **Timing:** acknowledge requests within one business day and issue an approved refund promptly through the original payment method; the final policy states that bank posting time is outside BizMetria’s control.
7. **Evidence:** preserve order state, request reason, decision, approver, amount, processor reference, and customer notice.

No customer-facing wording should use this draft directly. `LS-002` and qualified counsel must produce the implementable rule and text.

### Downstream impact

- `PS-003`: final service boundary and remedies.
- `LS-002` / `LS-004`: policy requirements and public legal text.
- `LC-001`: state-dependent refund eligibility and communications.
- `BE-003`: idempotent refund state machine and audit evidence.
- `QA`: event ordering, partial failures, replay, dispute, and duplicate-charge tests.

## 7. `D03` — Included consultation model

### Decision question

What exact consultation is included in the `$299` assessment?

### Options

| Option | Included service | Capacity per completed order | Main advantage | Main risk |
|---|---|---:|---|---|
| `D03-A` | One 30-minute video session; phone fallback | Approximately 30–45 staff minutes | Balanced value and capacity | Requires strict scope control |
| `D03-B` | One 45-minute video or phone session | Approximately 45–60 staff minutes | More discussion time | Reduces weekly order capacity |
| `D03-C` | Asynchronous written Q&A with bounded response window | Approximately 20–40 staff minutes | Easier scheduling | Less personal; threads can expand |

### Recommendation: `D03-A`

Proposed exact rule:

- one 30-minute results consultation is included per delivered paid order;
- default channel is an approved video meeting; phone is an accessibility or technical fallback;
- customer may book after report delivery;
- booking must occur within 30 calendar days of delivery;
- the appointment must occur within 45 calendar days of delivery, subject to available slots;
- one reschedule is allowed with at least 24 hours’ notice;
- a no-show or cancellation inside 24 hours normally uses the included session;
- support may grant one exception for documented technical failure or material hardship;
- arriving late does not extend the scheduled end time;
- scope is clarification, prioritization, and next-step discussion based on the approved report;
- new discovery, implementation work, custom design, legal/tax advice, and unlimited follow-up are excluded;
- implementation interest creates a separate sales opportunity and never changes the assessment deliverable.

The scheduling system must show the language, timezone, cancellation rule, scope, and remaining entitlement before confirmation.

### Downstream impact

- `PS-003`: included scope and exclusions.
- `UX-001`: booking, rescheduling, no-show, timezone, and accessibility states.
- `LC-001`: reminders and entitlement messages.
- `BE-003`: consultation entitlement and lifecycle events.
- `QA`: timezone, duplicate booking, no-show, and language-parity tests.

## 8. `D04` — Promotion operating model

### Decision question

How should discount amounts within the approved `$49`–`$199` range be used without training customers to wait for discounts or making the `$199` late-reactivation offer public?

### Rules shared by every option

- one promotion per order;
- no stacking with another promotion or manual price override;
- assessment-only unless a later decision explicitly covers implementation;
- one redemption per customer and payment instrument where technically and legally appropriate;
- eligibility is evaluated server-side before checkout confirmation;
- expiration uses an exact timestamp and customer-visible timezone;
- no retroactive application after a completed purchase;
- canceled or refunded use follows an approved reuse rule;
- promotion data never changes score, analysis, prioritization, or report quality;
- the `$199` discount remains private, late-reactivation-only, and absent from public copy.

### Options

| Option | Model | Advantage | Risk |
|---|---|---|---|
| `D04-A` | No launch discounts; retain codes only for support exceptions | Clean unit-economics baseline | Slower learning about offer elasticity |
| `D04-B` | Controlled lifecycle ladder with narrow eligibility | Tests several moments without permanent public discounting | More lifecycle logic and QA |
| `D04-C` | Recurring public promotion calendar | More promotional traffic | Price anchoring, margin loss, and claim/cadence complexity |

### Recommendation: `D04-B`

Proposed ladder:

| Discount | Working internal purpose | Earliest eligibility | Expiration | Public treatment |
|---:|---|---|---|---|
| `$49` | First bounded conversion test or owner-approved partner cohort | New qualified lead or named cohort | 7 days | May be shown only in the approved campaign |
| `$99` | Abandoned-checkout recovery | At least 7 days after eligible checkout abandonment | 72 hours | Direct lifecycle message only |
| `$149` | Invite-only pilot/research or high-intent recovery | Owner-approved cohort or at least 30 days inactive | 72 hours | Not an always-on public offer |
| `$199` | Late reactivation | At least 90 days after last eligible activity | 72 hours | Private unique code; never advertised in advance |

Additional proposed controls:

- only one public `$49` campaign window in any rolling 30-day period during MVP;
- `$99`, `$149`, and `$199` offers use targeted eligibility, not a reusable site-wide code;
- `$149` and `$199` require campaign-owner approval and a redemption cap;
- every campaign records purpose, audience, start/end, code type, redemption cap, owner, and stop rule;
- launch with `$49` and `$99` enabled; keep `$149` and `$199` disabled until payment, attribution, and suppression tests pass;
- report margin by discount level before repeating a campaign.

### Downstream impact

- `PS-003`: approved commercial rules.
- `LC-001`: coupon, eligibility, expiration, reuse, refund, and stacking contract.
- `MS-001`: permitted message matrix.
- `BE-003`: promotion state and idempotent checkout application.
- `QA`: boundary timestamps, reuse, refunds, stacking, and private-offer exposure.

## 9. `D05` — Implementation packages and prices

### Decision question

What separately sold implementation menu should BizMetria use during MVP?

### Shared boundary

No implementation option is included in the `$299` assessment. Every implementation engagement requires:

- separate discovery and written scope;
- separate agreement and payment;
- customer access and dependency checklist;
- named deliverables and acceptance criteria;
- change-control rule;
- security and data review;
- explicit third-party fee treatment;
- no guaranteed business outcome.

### Options

| Option | Commercial model | Main advantage | Main risk |
|---|---|---|---|
| `D05-A` | Custom quote only | Maximum scope flexibility | Slow sales cycle and inconsistent pricing |
| `D05-B` | Two fixed-scope packages plus a custom tier | Clear buyer path and bounded delivery | Requires disciplined scope and change control |
| `D05-C` | One low-price starter package only | Simplest initial operations | Misses larger qualified work and may underprice complexity |

### Recommendation: `D05-B`

Proposed package menu:

| Package | Proposed price | Included boundary | Target delivery window | Not included |
|---|---:|---|---|---|
| Implementation Starter | `$1,500` fixed | One approved workflow improvement, one primary system connection or configuration, test, documentation, and handoff | Up to 2 weeks after readiness | Custom platform build, data cleanup, subscription fees, ongoing support |
| Operations Sprint | `$4,500` fixed | Up to three related workflow improvements/integrations, testing, operating documentation, and one team handoff session | 4–6 weeks after readiness | Major migration, custom enterprise platform, recurring managed service |
| Custom Systems Build | Starting at `$9,500` | Individually scoped system, integration, migration, or automation program under milestones | Per statement of work | Anything absent from the signed statement of work |

Proposed payment and margin controls:

- Starter and Sprint: 50% to schedule, 50% on acceptance or agreed milestone;
- Custom: milestone schedule in the statement of work;
- software subscriptions, usage, taxes, and vendor fees are separate unless expressly included;
- work begins only after payment, access, scope, and customer dependencies are ready;
- scope changes require a written change order;
- do not sell a fixed package if the readiness checklist shows custom risk;
- target gross margin is at least 50% before commissions and fixed overhead;
- measure actual delivery hours on every engagement and reprice after the first five completed implementations;
- MVP capacity is no more than two active implementation engagements per delivery lead unless a later release gate approves more.

These prices are proposals, not public prices, until the owner approves them and the cost model confirms that scope, labor, support, and liability are sustainable.

### Downstream impact

- `PS-003`: package boundary and separate-sale rule.
- `LC-001`: separate opportunity, quote, agreement, payment, and lifecycle.
- `LS`: implementation agreement, claims, data, and liability review.
- `MS`: approved package descriptions without guarantees.
- operations: scope checklist, change orders, access controls, and delivery runbooks.

## 10. `D06` — MVP KPI target set

### Decision question

Which numeric target set should govern the pilot and controlled advertising?

### Measurement rules

- A metric definition cannot change after a target is selected without a versioned decision.
- Conversion metrics are directional until at least 500 eligible visits and 30 paid orders are observed.
- Quality metrics become an initial signal after 10 delivered reports and a stronger release signal after 30.
- Safety, traceability, payment integrity, human-review, consent, and P0/P1 defect requirements are hard gates at every sample size.
- English and Spanish are reported separately and combined; aggregate performance cannot hide a material language gap.

### Options

| Option | Use | Advantage | Risk |
|---|---|---|---|
| `D06-A` | Learning-only targets until 30 paid orders | Avoids premature funnel conclusions | Weak early go/no-go discipline |
| `D06-B` | Balanced target set with sample-size labels | Creates operational discipline while preserving uncertainty | Requires accurate analytics from the start |
| `D06-C` | Stretch conversion and turnaround targets | Encourages aggressive optimization | Can drive overpromising and poor-quality decisions |

### Recommendation: `D06-B`

Proposed pilot targets:

| Metric | Proposed target / guardrail | Gate treatment |
|---|---:|---|
| Free-check start rate | `>= 20%` of eligible landing visits | Diagnostic until sample threshold |
| Free-check completion rate | `>= 55%` of starts | Optimize before scale if below |
| Contact completion rate | `>= 70%` of free completions | Optimize notice/form friction if below |
| Result-to-checkout rate | `>= 8%` | Diagnostic until sample threshold |
| Paid conversion rate | `>= 2.5%` of eligible free results | Diagnostic until 30 paid orders |
| Questionnaire completion | `>= 80%` of confirmed orders | Investigate every preventable failure |
| Interview completion | `>= 75%` of eligible orders | Recovery flow required if below |
| Evidence sufficiency | `>= 85%` of completed interviews | No scale if repeated recollection is required |
| On-time report delivery | `>= 90%`; no unnotified miss | Hard operating guardrail |
| Review first-pass approval | `>= 75%` | Prompt/schema review if below |
| Material traceability defects | `0` delivered | Hard release gate |
| Report delivery success | `>= 98%` | Hard reliability guardrail |
| Consultation attendance | `>= 65%` of booked sessions | Adjust reminders/booking rules if below |
| Customer usefulness rating | Average `>= 4.0/5` | Initial signal after 10 reports |
| Correction or complaint rate | `<= 10%` of delivered reports | Stop and investigate clustered defects |
| Refund request rate | `<= 8%` of paid orders | Review by reason and discount |
| P0/P1 English–Spanish parity defects | `0` open at launch/scale | Hard gate |
| Support contacts | `<= 1.5` per completed order | Capacity diagnostic |

Scaling requires all hard gates plus stable fulfillment; meeting a conversion target never overrides quality or capacity.

### Downstream impact

- `PS-003`: approved success criteria.
- `QA-001`: event definitions, denominators, cohorts, and release thresholds.
- `MS`: controlled-spend stop and scale rules.
- operations: staffing and remediation triggers.

## 11. `D07` — Fulfillment capacity and launch cap

### Decision question

How many new paid orders may enter fulfillment each week during MVP?

### Planning model

The initial planning allowance per paid order is:

| Human activity | Planning minutes |
|---|---:|
| Review, edit, or regeneration decision | 75 |
| Consultation, preparation, and notes | 40 |
| Support, payment, or interview exception allowance | 25 |
| Fulfillment administration and QA sampling | 10 |
| **Total planning allowance** | **150 minutes / 2.5 hours** |

Weekly safe capacity is:

`floor(available fulfillment hours × 0.80 / 2.5)`

The 20% reserve covers clustering, retries, absences, and high-review cases. Measured time replaces the planning allowance after ten delivered reports.

### Options

| Option | New paid-order cap | Staffing assumption | Main tradeoff |
|---|---:|---|---|
| `D07-A` | 4/week | One reviewer with approximately 12.5 available fulfillment hours | Safest learning pace; slow revenue learning |
| `D07-B` | 6/week initially, then 8/week | One reviewer with 20–25 available fulfillment hours | Balanced pilot and controlled scale |
| `D07-C` | 10/week | Two trained reviewers or at least 32 safe fulfillment hours | Faster learning; coordination and quality risk |

### Recommendation: `D07-B`

Proposed operating rule:

- begin with at most six new paid orders per rolling seven days and two per calendar day;
- raise to eight per week only after ten consecutive delivered orders meet the SLA, traceability, correction, and support guardrails;
- cap orders awaiting human review at six;
- cap all paid orders in active fulfillment at twelve;
- pause paid acquisition and checkout-driving campaigns when projected demand exceeds 80% of safe capacity;
- automatically stop new paid campaign spend when:
  - an order is likely to miss the approved SLA;
  - the review queue exceeds six;
  - a P0/P1 fulfillment, consent, payment, or data defect is open;
  - on-time delivery falls below 90% in the rolling cohort;
  - no trained reviewer is available;
- reopening requires a recorded operations/QA check;
- implementation capacity is separate and cannot consume assessment review capacity without a revised cap.

### Downstream impact

- `BE` / `LC`: capacity flag and campaign/checkout controls.
- `MS`: spend caps and stop rules.
- `RP`: review queue telemetry.
- operations: staffing calendar, backup reviewer, and exception runbook.
- `QA`: synthetic overload and recovery tests.

## 12. `D08` — MVP service geography

### Decision question

Where may BizMetria accept paid orders during MVP?

### Options

| Option | Service geography | Advantage | Risk |
|---|---|---|---|
| `D08-A` | All U.S. states and D.C. at launch | Largest immediate market | Broad privacy, recording, tax, and contract review |
| `D08-B` | U.S.-only, using a counsel-cleared state allowlist that expands in versions | Bounded legal and operational review | Smaller initial addressable market |
| `D08-C` | U.S. plus international orders | Largest reach | Tax, privacy, consumer, transfer, language, and contract complexity |

### Recommendation: `D08-B`

The owner supplies the legal entity and intended initial states. Qualified counsel and an accountant clear the first allowlist before checkout opens. The website may provide general information outside the allowlist, but paid checkout must enforce the approved service geography and must not imply availability everywhere.

This recommendation does not identify the initial states; that list depends on the actual entity, business location, customer type, recording model, tax treatment, and counsel review.

### Downstream impact

- `PS-003`: customer eligibility.
- `LS`: Terms, Privacy Policy, recording, rights, and jurisdiction analysis.
- `LC` / `BE`: address or business-location eligibility and tax handling.
- `MS`: ad targeting and availability language.
- `QA`: allowlist, blocked-order, and language tests.

## 13. `D09` — Customer age eligibility

### Decision question

Who may create an account, buy an assessment, or participate in the business interview?

### Options

| Option | Eligibility | Advantage | Risk |
|---|---|---|---|
| `D09-A` | Authorized business representatives aged 18 or older | Clear B2B boundary and lower minor-data risk | Excludes legitimate younger operators |
| `D09-B` | Ages 16–17 with documented adult and business authorization | Broader access | Material consent, privacy, contract, and verification complexity |
| `D09-C` | No age restriction | Lowest form friction | Unacceptable uncertainty for contracts and personal data |

### Recommendation: `D09-A`

Proposed rule:

- the service is intended for businesses;
- account holders and purchasers must be at least 18 and authorized to act for the named business;
- interview participants may be employees or contractors only when the account holder is authorized to provide their participation details and the approved notice/consent is completed;
- BizMetria does not intentionally market to or create accounts for children;
- support escalates suspected underage use without collecting unnecessary identity documents.

Qualified counsel must approve the final representation, enforcement, and privacy handling.

### Downstream impact

- `PS-003`: eligibility and account rules.
- `LS-002` / `LS-004`: notices, Terms, and escalation.
- `UX`: age/business-authority representation.
- `BE`: eligibility state and restricted support path.
- `MS`: B2B targeting.

## 14. Required factual confirmations for `MC-003`

Option codes cannot replace these facts. The owner must provide or commission them before `G1` can pass.

| ID | Required fact or evidence | Why it is required | Responsible review |
|---|---|---|---|
| `F01` | Full legal selling-entity name and entity type | Contracts, receipts, refunds, policies | Owner + counsel |
| `F02` | State/country of formation and principal business address | Governing law, notices, tax, privacy | Owner + counsel/accountant |
| `F03` | Customer-facing support email and mailing address | Refund, Terms, Privacy, email compliance | Owner + legal/operations |
| `F04` | Initial paid-order state allowlist | Checkout eligibility and legal scope | Owner + counsel |
| `F05` | Approved operating timezone and business-holiday calendar | SLA, promotion expiry, support promises | Owner + operations |
| `F06` | Sales-tax treatment and registration/collection plan | Correct checkout and accounting | Qualified accountant/tax adviser |
| `F07` | Refund-policy legal review result | Public policy and payment implementation | Qualified counsel |
| `F08` | Age-eligibility legal review result | Terms, privacy, account handling | Qualified counsel |
| `F09` | Named primary and backup human reviewers with weekly available hours | Capacity cap and continuity | Owner + operations |
| `F10` | Named consultation provider(s) and bookable hours | Consultation promise and capacity | Owner + operations |

If a fact is not yet known, `MC-003` records it as a blocker rather than inventing it.

## 15. Cross-decision consistency checks

Master Control must reject a combination that fails any check below:

1. `D01` deadline fits the measured capacity in `D07`.
2. `D03` consultation minutes are included in the `D07` capacity calculation.
3. `D04` discounts preserve an acceptable contribution-margin range.
4. `D05` implementation capacity does not consume the reviewer hours assumed by `D07` without recalculation.
5. `D02` refund states can be derived from the same lifecycle events used by checkout and fulfillment.
6. `D08` geography matches legal, tax, recording, privacy, advertising, and support review.
7. `D09` eligibility matches the Terms, privacy notices, account model, and marketing targeting.
8. KPI definitions in `D06` remain identical across Product, Analytics, Marketing, QA, and Operations.
9. Spanish and English receive the same price, eligibility, remedy, service level, and included consultation.
10. No decision changes the approved score or free/paid information boundary.

## 16. Recommended combined baseline

The recommended combination is:

`D01-B / D02-A / D03-A / D04-B / D05-B / D06-B / D07-B / D08-B / D09-A`

This combination is recommended because it:

- gives customers a concrete service without an aggressive MVP deadline;
- provides a more defensible refund journey than an undefined or all-sales-final rule;
- keeps the included consultation useful but bounded;
- tests promotions without making deep discounts the public price;
- makes implementation separately purchasable with explicit scope;
- provides measurable pilot thresholds;
- caps demand to the human-review bottleneck;
- narrows geography and age eligibility until qualified review is complete.

It remains unapproved until `MC-003`.

## 17. `MC-003` acceptance checklist

`MC-003` may close only when:

- one option or explicit bounded alternative is recorded for `D01`–`D09`;
- factual confirmations `F01`–`F10` are present or a roadmap-approved deferral proves that the item does not block `G1`;
- counsel/accountant-dependent items are not represented as legally final without the named review evidence;
- the global Decision Log contains new approved IDs, rationale, affected workstreams, and confirming source;
- `OPEN-001`, `OPEN-002`, `OPEN-003`, `OPEN-007`, and `OPEN-008` are closed or explicitly deferred without blocking Phase 2;
- `PS-003` receives stable requirements for checkout, fulfillment, consultation, refunds, promotions, implementation, KPIs, and capacity;
- downstream workstreams acknowledge the selected rules;
- `G1` is not marked `PASS` until `PS-003` is independently reviewed and merged.

## 18. Handoff Summary

- **Task:** `PS-002 — Owner Decision Package`
- **Status:** `REVIEW — proposals only`
- **Files changed:** This decision package plus synchronized Product Strategy and control records.
- **Decisions proposed:** Options `D01`–`D09`, recommendations, KPI targets, capacity model, factual confirmation checklist, and cross-decision checks.
- **Decisions approved:** None.
- **Open questions:** Every decision and factual confirmation in this package remains pending `MC-003`; `OPEN-004`, `OPEN-005`, `OPEN-006`, and `OPEN-009` remain routed to later architecture or contract tasks.
- **Dependencies:** Approved `PS-001`, approved `LS-001`, and verified `main` SHA `608ef46e382f86d557168ab2396b56e21e88cf75`.
- **Validation required:** Approved-constraint trace, option completeness, independent answerability, downstream coverage, legal-boundary review, cross-decision consistency, relative-link validation, and full diff review.
- **Recommended next task:** Independently review and merge `PS-002`; then run `MC-003` with explicit owner answers and factual confirmations.
