# BizMetria Commercial and Lifecycle Contract v1.0

**Task:** LC-001 — Commercial and Lifecycle Contract \
**Version:** 1.0.0 \
**Status:** REVIEW \
**Owner workstream:** 10 — Payments, CRM and Lifecycle \
**Prepared:** 2026-07-31 \
**Source baseline:** main at 5dd223f8e11509ec305b2791c3b15c43ca33e097 \
**Branch:** task/ws-10/LC-001-commercial-lifecycle-contract \
**Pull request:** Pending creation

## 1. Purpose and authority

This contract turns the approved product and legal/data requirements into deterministic commercial, payment, entitlement, CRM, communication, refund, delivery-SLA, consultation, and implementation-interest behavior. It is an implementation contract, not final customer-facing legal text, tax advice, accounting advice, or authorization to charge a real payment.

Normative inputs:

- [Product Requirements v1.0](../../02-product-strategy/deliverables/BIZMETRIA_PRODUCT_REQUIREMENTS_v1.0.md);
- [Consent, Claims, and Data Requirements v1.0](../../11-legal-privacy-security/deliverables/BIZMETRIA_CONSENT_CLAIMS_REQUIREMENTS_v1.0.md);
- [Decision Log](../../../BIZMETRIA_DECISION_LOG.md), especially DEC-005, DEC-010–DEC-012, and DEC-017–DEC-026;
- [Owner Decision Record](../../01-master-control/deliverables/BIZMETRIA_OWNER_DECISION_RECORD_v0.1.md).

This document may specify test-mode interfaces and placeholder configuration names. It MUST NOT contain a real Stripe key, webhook secret, account ID, customer record, tax ID, private address, or payment credential.

## 2. Requirement language and boundary

- **MUST / MUST NOT** are release-blocking requirements.
- **SHOULD / SHOULD NOT** require a documented exception.
- **MAY** denotes an allowed option that remains subject to the same gates.
- All money uses integer minor units and ISO currency codes. Floating-point money is prohibited.
- All timestamps are immutable UTC instants with a separate IANA timezone where customer-facing interpretation matters.
- `test` means Stripe test objects, synthetic identities, non-deliverable or approved test destinations, and no production customer content.
- `live` means real Stripe objects and real customer commerce; it is disabled until every applicable pre-live dependency passes.

The contract separates six domains. A transition in one domain MUST NOT silently overwrite another:

1. customer/contact and consent;
2. campaign and promotion eligibility;
3. checkout, order, payment, refund, and dispute;
4. paid entitlement and fulfillment;
5. CRM/lifecycle and communication delivery;
6. consultation and separate implementation opportunities.

## 3. Approved commercial invariants

| ID | Invariant | Required behavior |
|---|---|---|
| `LC-COM-001` | Product | One `BizMetria Business Assessment` purchase |
| `LC-COM-002` | Base amount | `29900` USD cents (`$299`) |
| `LC-COM-003` | Recurrence | One time; no subscription, trial-to-subscription, or recurring renewal |
| `LC-COM-004` | Processor | Stripe for assessment checkout and approved Promotion Codes |
| `LC-COM-005` | Implementation | Separate opportunity, agreement, scope, and payment; never included in `$299` |
| `LC-COM-006` | Geography | Intended for all 50 U.S. states plus D.C.; not a public availability claim before the nationwide gate |
| `LC-COM-007` | Languages | English and Spanish have equivalent price, eligibility, states, rights, and service depth |
| `LC-COM-008` | Operating calendar | `America/Los_Angeles`; versioned U.S. federal-holiday dates |
| `LC-COM-009` | Capacity | Initially six new real orders per rolling seven days and two per local calendar day |
| `LC-COM-010` | Promotion count | At most one promotion per order; no stacking or manual price override |
| `LC-COM-011` | Price independence | Language, score, industry, consent choice, geography, and contact fields do not alter base price |
| `LC-COM-012` | Service parity | A promotion does not reduce assessment depth, report quality, priority, consultation, or rights |

Any change to these invariants requires versioned impact review. Price, subscription, tax, refund, promotion, or implementation-scope changes additionally trigger `RV-009` from LS-002.

### 3.1 Upstream trace

| Upstream requirement group | Implemented here |
|---|---|
| `PR-STATE-001`–`006` | Sections 6–8, 11–12, 17–18 |
| `PR-CONSENT-001`–`008` | Sections 13–14, 17, 19 |
| `PR-PAY-001`–`014` | Sections 4–8, 17–20 |
| `PR-PROMO-001`–`012` | Sections 4, 9–10, 14, 20 |
| `PR-SLA-001`–`005` | Sections 11–12 and acceptance vectors |
| `PR-REFUND-001`–`007` | Sections 11–12, 17–20 |
| `PR-CONSULT-001`–`008` | Sections 14–15 and acceptance vectors |
| `PR-IMPL-001`–`007` | Sections 3, 16–17 and acceptance vectors |
| `PR-CAP-001`–`007` | Sections 10, 17, 19–20 |
| `PR-KPI-001`–`005` | Sections 10, 17, 19–20 |
| LS-002 consent, template, suppression, claims, data, retention, vendor, and live-gate requirements | Sections 2, 5, 13–14, 17–20 |

QA owns the later requirement-to-test matrix, but no upstream group may be dropped when LC-001 is implemented.

## 4. Money, quote, and line-item contract

### 4.1 Canonical calculation

```text
base_amount_minor = 29900
discount_amount_minor ∈ {0, 4900, 9900, 14900, 19900}
assessment_subtotal_minor = base_amount_minor - discount_amount_minor
tax_amount_minor = approved_tax_engine(assessment_subtotal_minor, jurisdiction_context)
order_total_minor = assessment_subtotal_minor + tax_amount_minor
currency = USD
```

Approved discount vectors:

| Promotion value | Discount cents | Assessment subtotal | Default launch state |
|---:|---:|---:|---|
| None | `0` | `$299` / `29900` | Enabled subject to checkout gates |
| `$49 off` | `4900` | `$250` / `25000` | Eligible configured paths only |
| `$99 off` | `9900` | `$200` / `20000` | Eligible configured paths only |
| `$149 off` | `14900` | `$150` / `15000` | Disabled until operating approval |
| `$199 off` | `19900` | `$100` / `10000` | Disabled until late-reactivation approval |

`tax_amount_minor` is not guessed. Test fixtures MAY use an explicit synthetic tax value or `tax_treatment=TEST_DISABLED`; live checkout MUST fail with `LC_ERR_TAX_GATE` until the approved tax configuration, evidence version, and responsible owner are present.

### 4.2 Quote snapshot

Every checkout MUST freeze a server-created `commercial_snapshot` containing:

- `commercial_contract_version`;
- `product_key`, `price_version`, base amount, currency, and recurrence;
- promotion campaign/version/reference and discount amount, or explicit none;
- tax configuration/version and computed amount;
- order total;
- selected language and customer-facing timezone;
- Terms, Privacy, Refund, eligibility, and notice versions presented;
- environment and Stripe object mode;
- creation and expiration instants;
- immutable calculation trace and idempotency reference.

The client may display this snapshot but MUST NOT supply authoritative amounts, eligibility, tax, product, price, or entitlement values.

## 5. Stripe adapter and environment isolation

### 5.1 Provider boundary

Stripe is the approved payment processor. The application integrates through a narrow `PaymentGateway` boundary so that domain state is not a copy of provider state. The adapter MUST support:

- create or reuse an idempotent one-time Checkout Session or approved hosted equivalent;
- attach the server-approved Price and at most one approved Promotion Code;
- retrieve a payment/session by opaque provider reference;
- verify and normalize signed webhook events;
- submit a full or partial authorized refund;
- retrieve safe receipt and refund references;
- expose provider mode without exposing a secret.

Raw card number and CVC MUST stay inside the Stripe-hosted payment boundary. BizMetria endpoints, logs, analytics, support tools, and databases MUST reject or redact prohibited payment fields.

### 5.2 Configuration names

Implementations MAY use the following placeholder names; values live only in protected deployment configuration:

| Placeholder | Purpose | Repository value allowed? |
|---|---|---:|
| `COMMERCE_MODE` | `test` or `live`; default `test` | Example name/value only |
| `STRIPE_TEST_SECRET_KEY` | Server-side test credential | No value |
| `STRIPE_TEST_WEBHOOK_SECRET` | Test webhook verification | No value |
| `STRIPE_TEST_PRICE_ID` | Test `$299` Price reference | Synthetic/example only |
| `STRIPE_LIVE_SECRET_KEY` | Server-side live credential | No value |
| `STRIPE_LIVE_WEBHOOK_SECRET` | Live webhook verification | No value |
| `STRIPE_LIVE_PRICE_ID` | Live approved Price reference | No real value before activation |
| `LIVE_COMMERCE_ENABLED` | Explicit activation flag; default false | Safe default only |
| `LIVE_GATE_BUNDLE_VERSION` | Approved release-gate evidence bundle | Placeholder only |
| `LIVE_ACTIVATION_ID` | Authorized activation record | Placeholder only |

Client bundles MUST receive only a mode-matched publishable identifier if needed. Server secrets, restricted keys, webhook secrets, account identifiers, and gate evidence MUST never be serialized to a client.

### 5.3 Activation predicate

Live checkout is enabled only when every clause is true:

```text
environment == production
AND COMMERCE_MODE == live
AND LIVE_COMMERCE_ENABLED == true
AND valid(LIVE_ACTIVATION_ID)
AND valid(LIVE_GATE_BUNDLE_VERSION)
AND all_applicable_LIVE_DEP == PASS
AND stripe_live_configuration_complete == true
AND stripe_mode_consistency_check == PASS
AND release_kill_switch == ARMED
```

The presence of a live key, Price ID, account, or successful Stripe API response is never sufficient. If any clause fails, checkout returns `LC_ERR_LIVE_GATE` before creating a provider object. Missing live credentials are a normal safe state: build, tests, local development, preview, and staging MUST continue in test mode.

The system MUST NOT fall back from an attempted live operation to test mode or from a failed test operation to live mode. An environment mismatch is a hard error and produces no cross-mode side effect.

## 6. Domain identifiers and idempotency

Opaque identifiers are environment-scoped:

- `customer_ref` — internal subject reference, not email/phone;
- `lead_ref` — free-funnel lifecycle reference;
- `checkout_ref` — one commercial snapshot and checkout intent;
- `order_ref` — immutable commercial order identity;
- `payment_ref` — internal payment aggregate;
- `entitlement_ref` — paid-assessment access;
- `fulfillment_ref` — service delivery aggregate;
- `refund_ref` — one authorized refund attempt/decision chain;
- `consultation_ref` — one included entitlement;
- `implementation_opportunity_ref` — separate commercial lead.

All mutation commands MUST accept a stable idempotency key scoped by environment, actor, command type, and aggregate. Reusing a key with the same normalized request returns the original outcome. Reusing it with different content returns `LC_ERR_IDEMPOTENCY_CONFLICT`.

Provider event IDs, normalized event kind, object mode, aggregate reference, payload digest, received time, processing result, and handler version MUST be retained as minimized audit evidence. Raw provider payloads MUST NOT be sent to analytics or ordinary application logs.

## 7. Checkout, order, and payment states

### 7.1 Checkout intent

`CHECKOUT_DRAFT → CHECKOUT_ELIGIBLE → CHECKOUT_CREATED → CHECKOUT_COMPLETED`

Terminal/recovery states: `CHECKOUT_BLOCKED`, `CHECKOUT_EXPIRED`, `CHECKOUT_ABANDONED`, `CHECKOUT_REPLACED`.

Checkout eligibility requires:

1. supported product/version and selected language;
2. valid age/authority affirmation and required policy acceptance evidence;
3. geography allowed by the active environment policy;
4. capacity reservation available for live mode;
5. server-approved promotion or explicit none;
6. tax configuration valid for live mode;
7. same-environment Stripe configuration;
8. live predicate passed for live mode.

### 7.2 Order state

`ORDER_PENDING_PAYMENT → ORDER_PAID → ORDER_FULFILLING → ORDER_DELIVERED → ORDER_CLOSED`

Alternative states: `ORDER_PAYMENT_FAILED`, `ORDER_CANCEL_REVIEW`, `ORDER_CANCELLED`, `ORDER_REFUND_REVIEW`, `ORDER_PARTIALLY_REFUNDED`, `ORDER_REFUNDED`, `ORDER_DISPUTED`, `ORDER_ON_HOLD`.

An order record is never deleted merely because payment failed, expired, was refunded, or was disputed. Lifecycle retention and privacy treatment follow LS-002 and the approved retention schedule.

### 7.3 Payment state

The payment aggregate uses the approved minimum states:

`CHECKOUT_CREATED`, `PAYMENT_PENDING`, `PAYMENT_CONFIRMED`, `PAYMENT_FAILED`, `PAYMENT_EXPIRED`, `PAYMENT_REFUND_PENDING`, `PAYMENT_PARTIALLY_REFUNDED`, `PAYMENT_REFUNDED`, `PAYMENT_DISPUTED`.

Only a verified, same-environment, server-normalized Stripe event or an authorized server reconciliation may enter `PAYMENT_CONFIRMED`. Success URLs, client state, screenshots, emails, or unverified callbacks never grant access.

### 7.4 Paid entitlement

`ENTITLEMENT_LOCKED → ENTITLEMENT_ACTIVE → ENTITLEMENT_IN_USE → ENTITLEMENT_FULFILLED`

Exceptional states: `ENTITLEMENT_SUSPENDED`, `ENTITLEMENT_REVOKED`, `ENTITLEMENT_SUPPORT_REVIEW`.

- `PAYMENT_CONFIRMED` may activate exactly one paid-assessment entitlement for the same environment and order.
- A duplicate confirmation MUST return the existing entitlement.
- A full pre-fulfillment refund revokes unused access after authorized decision evidence.
- A refund after fulfillment starts does not silently erase delivered artifacts or history; the authorized refund decision specifies access/remedy treatment.
- A dispute routes the entitlement to reviewed configuration, not an unconditional automated deletion.

## 8. Webhook normalization and reconciliation

### 8.1 Required processing sequence

1. Read the raw request only inside the payment ingress boundary.
2. Resolve expected environment and endpoint before parsing business content.
3. Verify Stripe signature and allowed timestamp tolerance.
4. Reject mode/object mismatch.
5. Persist or claim the provider event ID idempotently.
6. Map only allowlisted event types to a versioned internal command.
7. load the internal aggregate by stored provider reference, never by client input;
8. validate legal transition and amount/currency/product invariants;
9. commit domain state and outbox event atomically;
10. acknowledge only after durable idempotent processing or a recorded safe duplicate.

Unknown event types are recorded as minimized `IGNORED_UNSUPPORTED`, not treated as success. Invalid signatures, stale/replayed requests outside policy, mismatched modes, missing aggregates, and amount/product mismatches create no entitlement.

### 8.2 Reconciliation

An authorized reconciliation job MAY compare internal state with Stripe using provider references. Reconciliation MUST be read-first, idempotent, environment-scoped, auditable, and unable to invent an order or promotion. Any destructive correction or refund requires an authorized command and reason.

## 9. Promotion campaign contract

### 9.1 Campaign schema

Each campaign record contains:

- `campaign_id`, version, status, owner, purpose, and public/private classification;
- exact discount in minor units from the approved set;
- eligible product/version;
- audience and server-verifiable eligibility predicate;
- start and end instants plus `America/Los_Angeles` presentation;
- redemption cap, per-subject/order limits, attribution, and budget guardrail;
- approved languages/templates and marketing-purpose requirements;
- stop/pause rule, review evidence, and rollback switch;
- Stripe test/live Promotion Code references stored separately by environment.

Campaign states: `DRAFT`, `REVIEW`, `SCHEDULED`, `ACTIVE`, `PAUSED`, `EXHAUSTED`, `EXPIRED`, `STOPPED`, `ARCHIVED`.

Only `ACTIVE` may produce an eligible promotion. Expiry and cap evaluation are atomic at checkout creation and revalidated before the provider session is created.

### 9.2 Controlled ladder

| Value | Eligibility | Window | Visibility | Default |
|---:|---|---|---|---|
| `$49` | Approved bounded conversion/partner audience | Seven days; at most one public window per rolling 30 days | Public or private as approved | Eligible path may be enabled |
| `$99` | Checkout abandoned for at least seven full days | 72 hours | Eligible lifecycle message | Eligible path may be enabled |
| `$149` | Private invite, pilot, high-intent, or inactive for at least 30 days | 72 hours | Private only | Off until owner/cap approval |
| `$199` | Qualifying late reactivation after at least 90 days | 72 hours | Private, unique, never advertised in advance | Off until full operating approval |

All thresholds use exact instants. A lifecycle message cannot create eligibility; it only communicates previously evaluated eligibility. Expired, future, paused, exhausted, wrong-product, wrong-environment, reused, stacked, or retroactive codes are rejected.

## 10. Capacity and reservation rules

Real checkout creation MUST use an atomic capacity reservation before a payment session is created. Test-mode fixtures do not consume real capacity.

| Limit | Initial value | Failure behavior |
|---|---:|---|
| New paid orders per rolling seven days | 6 | New live checkout unavailable; waitlist/support path |
| New paid orders per local calendar day | 2 | New live checkout unavailable until next eligible capacity |
| Human-review queue | 6 | Campaigns pause; new live intake blocked when safe capacity is exceeded |
| Active fulfillment | 12 | New live intake blocked |
| Forecast load | 80% | Campaigns should pause before hard limit |

Capacity may increase from six to eight per rolling seven days only after ten consecutive deliveries meet approved SLA, traceability, correction, support, and quality guardrails. The change is a versioned operator action with evidence; it is not automatic from order count alone.

A reservation has `HELD`, `CONSUMED`, `RELEASED`, or `EXPIRED` state. Payment confirmation consumes it exactly once. Failed/expired checkout releases it idempotently. Overselling under concurrent requests is prohibited.

New paid intake MUST stop when any of these is true: an SLA miss is forecast as likely, the human-review queue exceeds six, active fulfillment exceeds twelve, a P0/P1 issue affects safe operation, on-time delivery falls below 90% for the approved measurement window, no trained reviewer is available, or a live integrity/security gate fails. Campaign pause does not replace checkout blocking. Reopening requires a recorded Operations/QA authorization and corrected evidence; elapsed time alone cannot reopen intake.

## 11. Fulfillment and business-calendar SLA

### 11.1 Completion boundary

`ASSESSMENT_INPUTS_COMPLETE` is accepted only from the approved paid-assessment completion predicate and requires confirmed payment, required questionnaire, interview or approved recovery, required follow-up, and no blocking hold. LC-001 consumes this immutable event; it does not recalculate assessment completeness.

`FULFILLMENT_STARTED` is the earliest immutable occurrence of required questionnaire submission, paid interview start, or recorded manual analysis/reviewer work.

### 11.2 Business-day calculation

The calendar service uses:

- IANA timezone `America/Los_Angeles`;
- Monday through Friday as candidate business dates;
- a versioned set of U.S. federal-holiday observed dates;
- explicit calendar version on every computed deadline;
- timezone-library behavior for daylight-saving transitions.

For the five-business-day report SLA:

1. convert the immutable completion instant to the operating local date;
2. do not count that local date;
3. count the next date only if it is Monday–Friday and absent from the versioned holiday set;
4. select the fifth qualifying date;
5. set the due instant to 5:00 p.m. `America/Los_Angeles` on that date;
6. persist UTC instant, local representation, calendar version, and calculation trace.

The calendar is data, not a hard-coded “add weekdays” shortcut. A missing or unsupported holiday-calendar version fails with `LC_ERR_CALENDAR_VERSION`.

### 11.3 Holds, breach, and remedy

Only a documented customer-action dependency may create `SLA_CUSTOMER_HOLD`. The customer must receive the required action and resulting deadline treatment through an eligible service route.

- A hold beginning before the current business date's 5:00 p.m. cutoff prevents that date from being consumed.
- A hold beginning at or after the cutoff does not uncount an elapsed business date.
- Resume calculation starts with the first qualifying business date strictly after the resume local date.
- Internal backlog, staffing, vendor failure, rework, or reviewer unavailability cannot use a customer-hold reason.
- Original due date, hold/resume events, counted dates, revised due date, delivery instant, breach, and remedy state remain immutable and auditable.

The same calendar service computes the one-business-day acknowledgement target for refund requests.

## 12. Refund and remedy state machine

### 12.1 States and authority

`REFUND_REQUESTED → REFUND_ACKNOWLEDGED → REFUND_REVIEW → REFUND_APPROVED → REFUND_SUBMITTED → REFUND_SUCCEEDED`

Alternative states: `REFUND_INFO_NEEDED`, `REFUND_PARTIALLY_APPROVED`, `REFUND_DENIED`, `REFUND_FAILED`, `REFUND_CANCELLED`, `REFUND_ESCALATED`.

Refund review and refund execution are separate permissions. Every decision records requester, reason, service state, amount, currency, authorization, policy version, mandatory-rights/counsel route where applicable, processor reference, timestamps, and outcome.

### 12.2 Product decision table

| Condition | Default route | Automatic? |
|---|---|---:|
| Approved cancellation before `FULFILLMENT_STARTED` | Full-refund eligible, subject to approved legal/accounting treatment | Decision required; amount deterministic |
| Change of mind after fulfillment starts, before delivery | Authorized review; no automatic refund | No |
| BizMetria cancellation or inability to perform | Authorized remedy/refund review | No |
| Missed SLA or material defect | Authorized remedy/refund review | No |
| After delivery, change of mind | Correction/clarification/regeneration considered first; mandatory rights preserved | No |
| Duplicate payment | Verified duplicate-payment procedure | No destructive shortcut |
| Reported unauthorized payment | Processor/dispute/security procedure | No admission or auto-delete |
| Mandatory right or counsel override | Qualified policy route | Per approved policy |

The public Refund Policy and automated live execution stay disabled until entity, tax/accounting, and qualified counsel evidence pass. Test mode MUST exercise all states without a real refund.

## 13. CRM and lifecycle projection

CRM is a replaceable projection of canonical domain events, not the source of truth for payment, consent, entitlement, fulfillment, or refund state.

### 13.1 Lifecycle stages

`ANONYMOUS_VISITOR`, `FREE_AUDIT_STARTED`, `FREE_AUDIT_COMPLETED`, `CONTACT_IDENTIFIED`, `FREE_RESULT_AVAILABLE`, `ASSESSMENT_OFFERED`, `CHECKOUT_STARTED`, `CHECKOUT_ABANDONED`, `CUSTOMER_PAID`, `ONBOARDING_ACTIVE`, `INPUTS_INCOMPLETE`, `INPUTS_COMPLETE`, `FULFILLMENT_ACTIVE`, `REPORT_REVIEW`, `REPORT_DELIVERED`, `CONSULTATION_AVAILABLE`, `CONSULTATION_BOOKED`, `CONSULTATION_COMPLETED`, `ASSESSMENT_CLOSED`, `IMPLEMENTATION_INTEREST`, `IMPLEMENTATION_QUALIFICATION`, `SUPPRESSED`, `PRIVACY_HOLD`.

Stages may coexist with separate payment/refund/consent states; they MUST NOT collapse history. Projection updates are idempotent, ordered by aggregate sequence, and retryable. A stale callback cannot move a lifecycle stage backwards or restore a suppression.

### 13.2 Projection fields

Allowed CRM projection data is minimized: opaque references, locale, lifecycle stage, consent/suppression state references, campaign attribution, order/fulfillment status summary, safe timestamps, assigned owner/team, and approved next-action reason. Raw questionnaire answers, transcripts/audio, report content, payment payloads, secrets, and prohibited sensitive data MUST NOT enter the CRM projection.

## 14. Communication eligibility and suppression

### 14.1 Precedence

Before each queue and again before each send, evaluate in this order:

1. global legal/security/privacy or subject suppression;
2. channel suppression, bounce, complaint, STOP, unsubscribe, or vendor block;
3. purpose-specific withdrawal/denial/expiry;
4. jurisdiction and communication-policy configuration;
5. approved template, language, sender, vendor, and version;
6. message classification and necessity;
7. current consent where required;
8. lifecycle/campaign eligibility, frequency, cap, and expiry;
9. destination validation and environment routing.

Any denial wins. Repeated or reordered opt-out callbacks produce one idempotent suppression state. Vendor propagation failure blocks further non-essential sends and creates an operational alert without logging message content.

### 14.2 Message classes

| Trigger | Class / purpose | Default route | Eligibility boundary |
|---|---|---|---|
| Free result ready | Service delivery | Email when requested; on-site status | No marketing consent inferred |
| Checkout created | Service/account | On-site; email only if approved as necessary | No promotional content |
| Checkout abandoned | Marketing | Email; SMS only if separately approved | Current purpose consent, campaign eligibility, suppression pass |
| Payment confirmed / receipt | Service transaction | Stripe/service email and on-site | Same-environment verified payment |
| Payment failed/expired | Service recovery | On-site; approved service email | No unrelated promotion |
| Paid inputs incomplete | Service fulfillment | Approved service email; SMS disabled by default | Active order, necessary action, suppression/legal config |
| Customer-action hold | Service fulfillment | Approved service email/status | Exact required action and revised SLA treatment |
| Report delivered | Service delivery | Approved service email/status | Exact approved report/delivery version |
| Consultation available | Service entitlement | Approved service email/status | Delivered order and active consultation entitlement |
| Refund acknowledged/decided | Service transaction | Approved service email/status | Authorized refund event |
| `$49/$99/$149/$199` offer | Marketing | Approved eligible channel/template | Campaign plus purpose consent; private rules enforced |
| Implementation interest follow-up | Separate sales purpose | Approved channel | Explicit interest or valid marketing basis; never bundled into assessment |

`service_email` and `service_sms` are classifications, not blanket consent. Operational SMS remains disabled until counsel, vendor, sender, template, frequency, and recovery configuration pass. A transactional template containing promotion is blocked or reclassified as marketing.

Messages MUST be semantically equivalent in English and Spanish, use a versioned approved template, and store only safe delivery evidence: template/purpose/language/version, opaque recipient reference, status, timestamp, provider reference, and reason code.

## 15. Included consultation entitlement

Each delivered paid order creates exactly one 30-minute results-consultation entitlement:

`CONSULT_NOT_AVAILABLE → CONSULT_AVAILABLE → CONSULT_BOOKED → CONSULT_COMPLETED`

Alternative states: `CONSULT_RESCHEDULED`, `CONSULT_NO_SHOW`, `CONSULT_LATE_CANCEL`, `CONSULT_EXCEPTION_REVIEW`, `CONSULT_EXPIRED`, `CONSULT_CANCELLED`.

Rules:

- availability begins only after report delivery;
- booking remains open for 30 calendar days;
- the session must be scheduled to occur within 45 calendar days of delivery;
- default is video with phone fallback;
- provider must support the selected language;
- one reschedule is allowed with at least 24 hours' notice;
- no-show/late cancellation normally consumes the entitlement, with one auditable technical/material-hardship exception route;
- late arrival does not extend the scheduled end automatically;
- scope is report clarification, prioritization, and next steps, excluding new discovery, implementation, custom design, regulated advice, and unlimited follow-up.

Real booking fails with `LC_ERR_CONSULTATION_GATE` until provider identity, EN/ES coverage, hours, scheduling method, support path, and production configuration are approved.

## 16. Separate implementation opportunities

Implementation interest creates a new `implementation_opportunity_ref`; it never changes assessment price, entitlement, SLA, report, recommendation priority, consultation, or refund state.

Approved catalog references:

| Offer | Price | Boundary |
|---|---:|---|
| Implementation Starter | `$1,500` fixed | One workflow and one primary integration/configuration, tests, docs, handoff; up to two weeks after readiness |
| Operations Sprint | `$4,500` fixed | Up to three related improvements/integrations, tests, docs, handoff; approximately four to six weeks after readiness |
| Custom Systems Build | From `$9,500` | Separate discovery/scope and approved milestone plan |

Opportunity states: `INTEREST_RECORDED`, `QUALIFICATION_PENDING`, `QUALIFIED`, `DISCOVERY`, `PROPOSAL`, `AGREEMENT_PENDING`, `WON`, `LOST`, `ON_HOLD`, `WITHDRAWN`.

No implementation payment may use the assessment Price, promotion, entitlement, or refund aggregate. Every engagement requires separate scope, agreement, milestones, dependencies, acceptance, change control, security/data responsibilities, tax/fee treatment, and approved payment configuration. Target margin and capacity rules are operational evidence, not a customer outcome guarantee.

Starter and Sprint SHOULD use a separately approved 50% scheduling milestone and 50% acceptance/approved-milestone balance; custom work requires its own approved milestone plan. Subscriptions, taxes, third-party/vendor fees, and out-of-scope work remain separate unless expressly included in the signed scope. The planning gross-margin target is at least 50%, assumptions are reviewed after the first five engagements, and one delivery lead may not own more than two concurrent implementation engagements without a later approved capacity change.

## 17. Event and audit contract

### 17.1 Allowlisted event families

- commercial snapshot created/expired/rejected;
- promotion eligibility evaluated/reserved/redeemed/rejected/expired;
- capacity reserved/consumed/released/blocked;
- checkout created/completed/expired/abandoned/blocked;
- payment pending/confirmed/failed/expired/disputed;
- entitlement activated/suspended/revoked/fulfilled;
- fulfillment started, inputs completed, SLA calculated/held/resumed/breached/delivered;
- refund requested/acknowledged/reviewed/approved/submitted/succeeded/failed;
- message eligibility evaluated/queued/sent/failed/suppressed;
- consultation available/booked/rescheduled/completed/expired;
- implementation interest and opportunity stage changed;
- live gate evaluated and kill switch changed.

Allowed analytics/audit properties are opaque references, environment, versions, states, reason codes, integer amounts where approved, locale, timestamps, campaign/template/purpose IDs, and processor status. Prohibited properties include contact data, raw answers, free text, audio/transcript, report content, card/payment payloads, secrets, and legal/privacy-request content.

### 17.2 Outbox and ordering

Domain state and its outbox event MUST commit atomically. Consumers are at-least-once and idempotent. Each aggregate has a monotonically increasing sequence; consumers reject or defer gaps and ignore safe duplicates. CRM and messaging failures MUST NOT roll back confirmed payment or create duplicate entitlements.

## 18. Error contract

| Code | Condition | Safe result |
|---|---|---|
| `LC_ERR_ENVIRONMENT` | Test/live mismatch | No provider/domain mutation |
| `LC_ERR_LIVE_GATE` | One or more live conditions absent | Real checkout disabled |
| `LC_ERR_SECRET_CONFIG` | Required protected configuration absent/invalid | Affected operation disabled |
| `LC_ERR_PRODUCT_VERSION` | Unsupported product/price version | Checkout blocked |
| `LC_ERR_TAX_GATE` | Live tax treatment unapproved/missing | Live checkout blocked |
| `LC_ERR_POLICY_VERSION` | Required policy/notice version missing | Protected action blocked |
| `LC_ERR_ELIGIBILITY` | Age/authority/geography condition not met | Checkout blocked/support route |
| `LC_ERR_CAPACITY` | Safe intake capacity unavailable | No live provider object; waitlist/status route |
| `LC_ERR_PROMOTION` | Invalid/ineligible/expired promotion | Reject promotion; do not silently change quote |
| `LC_ERR_STACKING` | Multiple promotions/override attempted | Checkout rejected |
| `LC_ERR_IDEMPOTENCY_CONFLICT` | Same key, different command | No mutation; conflict audit |
| `LC_ERR_WEBHOOK_SIGNATURE` | Invalid signature/timestamp | No processing |
| `LC_ERR_WEBHOOK_REPLAY` | Unsafe replay/duplicate conflict | No duplicate effect |
| `LC_ERR_PAYMENT_INVARIANT` | Amount/currency/product mismatch | No entitlement; security review |
| `LC_ERR_CALENDAR_VERSION` | Missing/unknown holiday calendar | SLA calculation blocked |
| `LC_ERR_SUPPRESSED` | Channel/purpose suppression applies | Message not queued/sent |
| `LC_ERR_TEMPLATE` | Template/class/language not approved | Message disabled |
| `LC_ERR_REFUND_AUTH` | Refund authority/evidence incomplete | No provider refund |
| `LC_ERR_CONSULTATION_GATE` | Provider/language/hours missing | Real booking disabled |
| `LC_ERR_VENDOR_GATE` | CRM/message/payment data flow not approved | Production transfer disabled |

Errors shown to customers use approved bilingual safe messages and correlation IDs, never raw provider errors or secrets.

## 19. Pre-live dependency bundle

The live activation bundle MUST reference current evidence for:

1. legal selling entity, trade name, public address, and authorized Stripe account owner;
2. support email/path and escalation ownership;
3. qualified nationwide legal applicability/control matrix for 50 states plus D.C.;
4. tax/accounting configuration and evidence;
5. counsel-approved Terms, Privacy, Refund, age/authority, consent, and checkout copy in EN/ES;
6. exact retention schedules with no active `TBD` production class;
7. approved Stripe/CRM/email/SMS/scheduling vendor reviews and production configurations;
8. consent, suppression, GPC, privacy-rights, incident, access, backup, and deletion evidence;
9. assigned report reviewers, consultation providers, support, refund authority, engineering, and security owners;
10. capacity and campaign configuration, monitoring, stop rules, and kill switches;
11. test/live isolation, webhook signature/replay/idempotency, reconciliation, refund, and receipt tests;
12. QA/release approval and an authorized final activation record;
13. protected live account identifiers/secrets provisioned outside source control;
14. rollback procedure proving live checkout can be disabled without data loss.

Failure of any applicable item keeps `LIVE_COMMERCE_ENABLED=false`. This contract does not pass any item merely by naming it.

## 20. Required acceptance vectors

| Vector | Scenario | Expected result |
|---|---|---|
| `LC-V001` | No promotion, zero synthetic tax | `29900` USD cents |
| `LC-V002` | `$49` approved promotion | `25000` subtotal |
| `LC-V003` | `$99` approved promotion | `20000` subtotal |
| `LC-V004` | `$149` approved promotion | `15000` subtotal |
| `LC-V005` | `$199` approved late-reactivation promotion | `10000` subtotal |
| `LC-V006` | Two codes or manual amount override | `LC_ERR_STACKING`; no checkout |
| `LC-V007` | Client alters amount/product/recurrence | Server snapshot wins or request rejected |
| `LC-V008` | `$199` shown publicly in advance | Campaign/content release blocked |
| `LC-V009` | `$199` used at 89 days 23:59 | Ineligible |
| `LC-V010` | `$99` abandonment offer before seven full days | Ineligible |
| `LC-V011` | Promotion expires during checkout creation | Atomic revalidation rejects; no retroactive application |
| `LC-V012` | A second public `$49` campaign window starts within the same rolling 30 days | Campaign scheduling blocked |
| `LC-V013` | Live key absent | Build/test/staging pass; real checkout off |
| `LC-V014` | Live key present, gate bundle missing | `LC_ERR_LIVE_GATE`; no Stripe object |
| `LC-V015` | Test event hits live endpoint | `LC_ERR_ENVIRONMENT`; no effect |
| `LC-V016` | Forged success redirect | No payment confirmation or entitlement |
| `LC-V017` | Valid payment webhook delivered three times | One payment transition and one entitlement |
| `LC-V018` | Same idempotency key with different order content | `LC_ERR_IDEMPOTENCY_CONFLICT` |
| `LC-V019` | Webhook has invalid signature or stale timestamp | Rejected before business processing |
| `LC-V020` | Payment amount/currency differs from snapshot | No entitlement; security/reconciliation alert |
| `LC-V021` | Seven-day or two-per-day capacity exceeded concurrently | Atomic block; no oversell |
| `LC-V022` | Ten clean deliveries not established | Capacity remains six |
| `LC-V023` | Completion Friday before Monday federal holiday | Count begins next eligible business date; holiday excluded |
| `LC-V024` | Completion on a federal-holiday local date | That date is day zero; next eligible date begins count |
| `LC-V025` | DST changes within SLA window | Due remains 5:00 p.m. local with correct UTC instant |
| `LC-V026` | Unknown holiday-calendar version | `LC_ERR_CALENDAR_VERSION` |
| `LC-V027` | Customer hold before 5:00 p.m. cutoff | Current candidate date not consumed; trace retained |
| `LC-V028` | Internal staffing failure labeled customer hold | Reason rejected; SLA continues |
| `LC-V029` | Cancellation approved before fulfillment starts | Full-refund-eligible review path and unused entitlement revocation |
| `LC-V030` | Change of mind after fulfillment starts | No automatic refund; authorized review |
| `LC-V031` | Duplicate-payment report | Processor/refund verification path; order history preserved |
| `LC-V032` | Refund command lacks authorized actor/evidence | `LC_ERR_REFUND_AUTH`; no Stripe refund |
| `LC-V033` | Email supplied without marketing consent | Service eligibility only; no marketing send |
| `LC-V034` | Email consent yes, SMS consent no | Eligible email may send; SMS suppressed |
| `LC-V035` | Transactional template contains a promotion | Block/reclassify; marketing eligibility required |
| `LC-V036` | STOP/unsubscribe callbacks repeated out of order | One suppression; no later non-essential send |
| `LC-V037` | Stale CRM callback follows suppression | Suppression remains; stage not resurrected |
| `LC-V038` | Spanish customer receives same lifecycle event | Same state/amount/eligibility; approved Spanish template |
| `LC-V039` | Report delivered twice through retry | One consultation entitlement |
| `LC-V040` | Booking provider lacks Spanish support | `LC_ERR_CONSULTATION_GATE` for Spanish route |
| `LC-V041` | Reschedule requested 25 hours before session | One reschedule allowed |
| `LC-V042` | Reschedule requested under 24 hours | Late-cancel rule/exception route; no silent extension |
| `LC-V043` | Implementation interest selected | Separate opportunity; assessment order/SLA unchanged |
| `LC-V044` | Raw card/contact/answer content enters analytics event | Payload rejected; security alert |
| `LC-V045` | Kill switch changes off during live incident | New checkout blocked; existing audit/order history retained |
| `LC-V046` | Forecast shows likely SLA miss or on-time delivery is below 90% | New paid intake stops; campaigns pause |
| `LC-V047` | No trained reviewer or a P0/P1 safe-operation issue exists | New paid intake stops regardless of conversion target |
| `LC-V048` | Operator attempts to reopen intake solely because time elapsed | Reopen rejected; Operations/QA evidence required |
| `LC-V049` | Implementation quote omits separate agreement/milestones or reuses assessment payment state | Quote/payment activation blocked |
| `LC-V050` | Test, staging, staff, duplicate, or synthetic events enter production KPI | Metric pipeline rejects/excludes them with audit evidence |

QA MUST trace every `LC-*` requirement and vector to automated, manual, qualified-review, or pre-live evidence. Negative tests MUST prove missing configuration is restrictive, not permissive.

## 21. Downstream assignments

| Consumer | Required adoption |
|---|---|
| UX-001/UX-002 | Quote states, checkout/eligibility/capacity errors, consent-aware status, SLA/hold, refund, consultation, EN/ES parity |
| BE-001 and Backend implementation | Domain aggregates, Stripe adapter, outbox, idempotency, webhook/reconciliation, gates, projections |
| QA-001 and later QA | Requirement trace, 45 vectors, environment/secret scans, calendar/concurrency/failure tests |
| MS-001 | Approved offer hierarchy, promotion visibility, transactional/marketing separation, nationwide-claim gate |
| RP-001 | Delivery event, SLA evidence, consultation entitlement creation |
| LS-003/LS-004 | Retention/security controls and qualified live policy/copy approvals |
| LC-002 | Concrete Stripe/CRM/messaging implementation and vendor evidence |
| MC-004 and Release | Vendor/account/configuration approvals and protected live activation |

## 22. Acceptance checklist

- [x] `$299` one-time price, no subscription, and separate implementation are immutable.
- [x] Discount math produces `$250`, `$200`, `$150`, and `$100` assessment subtotals.
- [x] Campaign eligibility, caps, stacking, expiration, and late-reactivation privacy are deterministic.
- [x] Stripe test/live objects, configuration, webhooks, data stores, and secrets cannot cross.
- [x] Live keys are optional for build/staging and insufficient for activation.
- [x] Checkout, payment, entitlement, fulfillment, refund, CRM, consultation, and implementation states are separated.
- [x] Server confirmation, signature verification, replay protection, idempotency, and reconciliation are specified.
- [x] Nationwide intent and federal-holiday calendar are implemented without premature public availability.
- [x] Capacity, five-business-day SLA, holds, breach, and refund acknowledgement are deterministic.
- [x] Consent/suppression precedence and message classes adopt LS-002.
- [x] Refund logic preserves qualified-review and mandatory-rights boundaries.
- [x] Consultation and implementation opportunities remain separate and bounded.
- [x] Analytics, logs, CRM, and events exclude prohibited content and secrets.
- [x] Fifty acceptance vectors cover normal, boundary, failure, concurrency, capacity, KPI, and live-gate behavior.
- [x] Entity, legal/tax, support, staffing, retention, vendor/security, release, and protected live configuration remain fail-closed.

## Handoff Summary

- **Task:** LC-001 — Commercial and Lifecycle Contract.
- **Status:** REVIEW on `task/ws-10/LC-001-commercial-lifecycle-contract`; PR pending creation.
- **Files changed:** This deliverable and five Workstream 10 operating records.
- **Decisions proposed:** Vendor-neutral payment/lifecycle domains, exact promotion and price calculations, Stripe adapter/configuration boundary, activation predicate, state machines, capacity reservation, federal-holiday SLA algorithm, refund workflow, CRM projection, consent-aware trigger matrix, consultation/implementation separation, error codes, and 50 acceptance vectors.
- **Decisions approved:** Existing `$299` one-time assessment, Stripe processor, promotion ladder, staged refund product rule, 30-minute consultation, separate implementation offers, capacity, all-50-states-plus-D.C. intent, operating calendar, and final-stage live secrets. LC-001 adds no legal/tax/vendor/live approval.
- **Open questions:** Legal entity/address, support identity, qualified nationwide/tax/refund/age review, final EN/ES policies/copy, retention durations, vendors, sender identities, consultation staffing, refund authority, security/release evidence, exact Stripe account configuration, and protected live credentials.
- **Dependencies:** Approved PS-003 PR #10 and LS-002 PR #15; source main `5dd223f8e11509ec305b2791c3b15c43ca33e097`.
- **Validation performed:** Commercial math, state separation, Stripe environment and secret boundaries, webhook/idempotency/replay paths, promotion windows/caps, calendar/SLA edge cases, consent/suppression precedence, refund/consultation/implementation boundaries, data minimization, pre-live negative behavior, relative links, and Markdown diff.
- **Recommended next task:** Independently review and merge LC-001. Continue AE-001 separately; after both are approved, run RP-001 and QA-001 according to their dependencies. G2 remains not passed.
