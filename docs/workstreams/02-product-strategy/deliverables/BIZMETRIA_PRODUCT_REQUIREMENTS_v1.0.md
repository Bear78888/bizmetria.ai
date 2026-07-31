# BizMetria Product Requirements Baseline v1.0

**Task:** `PS-003 — Product Requirements Baseline v1.0` \
**Version:** `v1.0` \
**Status:** `APPROVED` \
**Owner:** Product Strategy \
**Prepared:** 2026-07-31 \
**Source `main`:** `acda4fb7c036660161b6f0ea4d09deed4143c7cb` \
**Branch:** `task/ws-02/PS-003-product-requirements-v1` \
**PR:** Merged [#10](https://github.com/Bear78888/bizmetria.ai/pull/10), merge SHA `68901a35e7f465ed4990881645847092e6fdd2d1`

## 1. Purpose and authority

This document converts the approved BizMetria product baseline into stable, testable requirements for downstream contracts, architecture, implementation, quality assurance, and release review. It is the canonical Phase 1 requirements baseline after approval and does not activate production commerce.

Normative authority, from highest to lowest for this task:

1. the approved [Decision Log](../../../BIZMETRIA_DECISION_LOG.md), especially `DEC-001`–`DEC-026`;
2. the approved [Owner Decision Record](../../01-master-control/deliverables/BIZMETRIA_OWNER_DECISION_RECORD_v0.1.md);
3. the approved [Owner Decision Package](BIZMETRIA_OWNER_DECISION_PACKAGE_v0.1.md) for exact `D01`–`D09` rules;
4. the approved [Product Blueprint v0.1](../BIZMETRIA_PRODUCT_BLUEPRINT_v0.1.md);
5. the approved [Legal and Data Inventory Baseline v0.1](../../11-legal-privacy-security/deliverables/BIZMETRIA_LEGAL_DATA_BASELINE_v0.1.md);
6. the approved [Master Brief](../../../BIZMETRIA_MASTER_BRIEF_v1.0.md).

If an older artifact conflicts with a later approved decision, the later approved decision controls. No requirement in this document is legal, tax, accounting, investment, or other regulated professional advice.

## 2. Requirement language and verification

- **MUST / MUST NOT** identifies a release-blocking requirement.
- **SHOULD / SHOULD NOT** identifies an expected behavior that may be waived only by a recorded decision with rationale and owner.
- **MAY** identifies an allowed behavior, not a commitment.
- **Configured** means supplied outside source code through approved content, environment, or administrative configuration.
- **Live** means capable of creating or fulfilling a real paid order using production data or credentials.
- **Test** means isolated non-production behavior using synthetic data and Stripe test mode.

Every requirement has a stable ID. Downstream contracts MUST cite the applicable IDs, and `QA-001` MUST map every `MUST` requirement to an automated test, manual verification, review artifact, or pre-live evidence item.

### 2.1 Approved-decision trace

| Decision | Requirement coverage |
|---|---|
| `DEC-001` | `PR-PROD-001` |
| `DEC-002` | `PR-PROD-002` |
| `DEC-003` | `PR-PROD-003`, `PR-LANG-001`–`004` |
| `DEC-004` | `PR-LANG-003` |
| `DEC-005` | `PR-PROD-004`, `PR-PAY-001` |
| `DEC-006` | `PR-PROD-006`, `PR-FREE-001`–`010` |
| `DEC-007` | `PR-FREE-001`, `PR-CONSENT-001`–`008` |
| `DEC-008` | `PR-FREE-002`–`007` |
| `DEC-009` | `PR-PROD-007`, `PR-PAID-*`, `PR-ANALYSIS-*`, `PR-REPORT-*`, `PR-CONSULT-*` |
| `DEC-010` | `PR-PROD-005`, `PR-IMPL-001`–`007` |
| `DEC-011` | `PR-PAY-003`, `PR-PROMO-001`–`012` |
| `DEC-012` | `PR-PROMO-004`–`009` |
| `DEC-013` | `PR-ANALYSIS-009`, `PR-REPORT-003`–`005` |
| `DEC-014` | Superseded by `DEC-016`; no active product behavior. |
| `DEC-015` | Section 25 change control and Section 26 Handoff Summary. |
| `DEC-016` | Task authority, branch ownership, and downstream handoff boundaries in Sections 1, 23, 25, and 26. |
| `DEC-017` | `PR-CAL-001`–`003`, `PR-SLA-001`–`005` |
| `DEC-018` | `PR-REFUND-001`–`007` |
| `DEC-019` | `PR-CONSULT-001`–`008` |
| `DEC-020` | `PR-PROMO-001`–`012` |
| `DEC-021` | `PR-IMPL-001`–`007` |
| `DEC-022` | `PR-KPI-001`–`005` and Section 18 targets |
| `DEC-023` | `PR-CAP-001`–`007` |
| `DEC-024` | `PR-GEO-001`–`003`, `LIVE-DEP-004` |
| `DEC-025` | `PR-ACTOR-002`–`004`, `LIVE-DEP-008` |
| `DEC-026` | `PR-PAY-003`–`014`, `LIVE-DEP-013` |

## 3. Product definition and non-goals

### 3.1 Product definition

| ID | Requirement | Verification |
|---|---|---|
| `PR-PROD-001` | The product MUST use the brand `BizMetria.ai`. | Content/configuration review. |
| `PR-PROD-002` | The product MUST support a broad cross-industry business audience; industry MAY shape recommendations but MUST NOT affect the free score. | Schema and score regression tests. |
| `PR-PROD-003` | English and Spanish MUST be first-class launch languages with equivalent product meaning, states, safeguards, and deliverables. | Paired localization and parity fixtures. |
| `PR-PROD-004` | The paid `BizMetria Business Assessment` MUST cost `$299` as a one-time purchase and MUST NOT create a subscription. | Checkout contract and Stripe test-mode assertions. |
| `PR-PROD-005` | Implementation services MUST be sold separately and MUST NOT be implied as included in the `$299` assessment. | Offer, checkout, report, and consultation copy review. |
| `PR-PROD-006` | The free `AI Opportunity Check` MUST be the primary cold-traffic path and MUST provide useful but deliberately limited output. | Journey and locked-content tests. |
| `PR-PROD-007` | The paid assessment MUST include the approved questionnaire, interview, analysis, recommendations, matrix, roadmap, report, human review, and consultation scope. | Contract trace and end-to-end staging test. |

### 3.2 Explicit non-goals

The `$299` assessment MUST NOT include:

- implementation, software configuration, data migration, or third-party fees;
- unlimited revisions, ongoing support, or employee training beyond report explanation;
- legal, tax, accounting, investment, or regulated professional advice;
- a business valuation, credit rating, certification, or guarantee of outcome;
- unsupported loss estimates, guaranteed ROI, or certainty beyond supplied evidence;
- international paid availability at launch.

The product requirements task does not select the application stack, voice provider, CRM/email provider, model provider, hosting platform, analytics provider, or detailed free-score point table. Those decisions remain routed to `BE-001`, `EN-001`, `LC-001`, `FA-001`, and `MC-004`.

## 4. Actors, eligibility, and authorization

| ID | Requirement | Verification |
|---|---|---|
| `PR-ACTOR-001` | A visitor MAY complete the free check without a paid account, subject to the approved contact and consent flow. | Public-flow test. |
| `PR-ACTOR-002` | An account holder and purchaser MUST affirm that they are an authorized business representative aged 18 or older before account/payment use. | Required server-validated representation and audit evidence. |
| `PR-ACTOR-003` | BizMetria MUST NOT intentionally design, market, or operate the paid product for minors. | Audience, copy, and account-flow review. |
| `PR-ACTOR-004` | Interview participants other than the purchaser MUST have appropriate business authorization, notice, and consent for the applicable capture method. | Voice/session evidence test. |
| `PR-ACTOR-005` | Customer, support, reviewer, consultant, finance/refund, privacy/compliance, engineering, and security roles MUST be distinct authorization concepts even if one person holds multiple roles during a pilot. | Role and authorization contract review. |
| `PR-ACTOR-006` | Privileged actions MUST be attributable to an authenticated actor and auditable. | Audit-event tests. |

Final customer-facing age, authorization, and participant wording remains subject to the pre-live legal review in `LIVE-DEP-008`.

## 5. Geography, languages, and operating calendar

| ID | Requirement | Verification |
|---|---|---|
| `PR-GEO-001` | The intended paid-service geography MUST be all 50 U.S. states and the District of Columbia. | Geography configuration test. |
| `PR-GEO-002` | International paid checkout and paid fulfillment MUST remain unavailable unless a later approved decision changes scope. | Negative geography tests. |
| `PR-GEO-003` | Nationwide live availability MUST fail closed until `LIVE-DEP-004`, `LIVE-DEP-006`, `LIVE-DEP-007`, and `LIVE-DEP-008` pass. | Release-gate evidence and negative test. |
| `PR-LANG-001` | A customer MUST be able to select English or Spanish for public pages, forms, notices, paid assessment, interview, lifecycle messages, report, consultation, and support routing. | Bilingual journey matrix. |
| `PR-LANG-002` | Language selection MUST NOT change scoring, price, promotion eligibility, capacity priority, report quality, or customer rights. | Paired fixture comparison. |
| `PR-LANG-003` | English and Spanish voice experiences MUST use separate telephone numbers and one shared canonical backend model. | Voice routing and schema tests. |
| `PR-LANG-004` | Material legal or consent text MUST be professionally reviewed for semantic equivalence before live use; machine translation alone is insufficient approval. | Pre-live localization evidence. |
| `PR-CAL-001` | Operational deadlines MUST use the IANA timezone `America/Los_Angeles`. | Clock fixture tests around date and daylight transitions. |
| `PR-CAL-002` | U.S. federal holidays MUST be excluded from the report business-day calculation using a versioned holiday calendar. | Calendar boundary vectors. |
| `PR-CAL-003` | A business-day due time MUST resolve to 5:00 p.m. in `America/Los_Angeles`. | Due-date test vectors. |

## 6. Canonical customer journey and states

The experience MAY combine screens, but the domain model MUST preserve these state distinctions:

```text
VISITOR
  → FREE_CHECK_STARTED
  → FREE_CHECK_COMPLETED
  → FREE_RESULT_AVAILABLE
  → CHECKOUT_STARTED
  → PAYMENT_CONFIRMED
  → PAID_ONBOARDING
  → PAID_QUESTIONNAIRE
  → VOICE_INTERVIEW
  → ASSESSMENT_INPUTS_COMPLETE
  → ANALYSIS
  → HUMAN_REVIEW
  → REPORT_DELIVERED
  → CONSULTATION
  → CLOSED
```

Failure, cancellation, hold, refund, deletion, and support states MUST be representable without overwriting history.

| ID | Requirement | Verification |
|---|---|---|
| `PR-STATE-001` | Each transition MUST record the order/customer reference, prior state, new state, cause, actor/system source, timestamp, environment, and idempotency reference where applicable. | Event-schema and replay tests. |
| `PR-STATE-002` | Invalid, out-of-order, duplicate, or delayed events MUST NOT silently advance fulfillment. | Negative contract tests. |
| `PR-STATE-003` | Customer-visible status MUST be derived from canonical state and MUST NOT reveal internal prompts, reviewer notes, security signals, or other customers' data. | Authorization and content tests. |
| `PR-STATE-004` | A recoverable failure MUST expose a safe retry or support path without duplicating payment, assessment, analysis, report, or message delivery. | Retry/idempotency tests. |
| `PR-STATE-005` | A customer-action hold MUST record reason category, start/end, required action, notice state, and recalculated due date. | SLA hold/resume vectors. |
| `PR-STATE-006` | Destructive or irreversible transitions, including refund execution, report approval, delivery, and deletion completion, MUST require explicit authorization and audit evidence. | Permission and audit tests. |

## 7. Free AI Opportunity Check

### 7.1 Collection and scoring

| ID | Requirement | Verification |
|---|---|---|
| `PR-FREE-001` | The free check MUST use exactly 11 scored business topics plus a separate contact/consent step. | Schema count and UI tests. |
| `PR-FREE-002` | The score MUST be deterministic from versioned answer IDs and a versioned point table. | Repeat-run and version tests. |
| `PR-FREE-003` | The score MUST remain within `0–100` and preserve block maxima `30/25/20/15/10`. | Boundary and property tests. |
| `PR-FREE-004` | Identical canonical answers MUST produce identical score and result selection in English and Spanish. | Paired regression vectors. |
| `PR-FREE-005` | Identity, email, phone, industry label, language, consent choices, campaign, and promotion data MUST NOT affect the score. | Mutation tests. |
| `PR-FREE-006` | Missing, invalid, duplicate, and incompatible answers MUST be rejected or resolved by the approved `FA-001` contract rather than guessed. | Validation tests. |
| `PR-FREE-007` | The detailed point table and result-selection rules MUST remain versioned and unapproved until `FA-001` closes `OPEN-009`. | Contract and Decision Log review. |

### 7.2 Free result boundary

The free result MUST include:

- the 0–100 score and a clear limitation statement;
- one concise observation grounded in the submitted answers;
- up to three general opportunity areas;
- a preview of locked paid depth;
- the `$299` one-time assessment offer and implementation separation.

The free result MUST NOT expose:

- a full personalized analysis or implementation architecture;
- an actionable vendor/tool list tailored to the business;
- invented financial losses, detailed ROI, or guaranteed savings;
- the complete recommendation set, Impact vs. Effort matrix, or 30–90 day roadmap;
- the paid report/PDF, full interview logic, or included consultation.

| ID | Requirement | Verification |
|---|---|---|
| `PR-FREE-008` | Locked paid content MUST be enforced by server-owned content/state rules, not visual hiding alone. | API and browser negative tests. |
| `PR-FREE-009` | The free score MUST be described as an operational opportunity indicator, not a valuation, credit score, business-quality rating, or outcome guarantee. | Claims review. |
| `PR-FREE-010` | Free-result recommendations MUST remain general, evidence-bounded, and safe when answers are sparse or contradictory. | Content fixtures and review rubric. |

## 8. Contact, notice, and communication consent

| ID | Requirement | Verification |
|---|---|---|
| `PR-CONSENT-001` | Collecting an email address or telephone number MUST NOT itself create marketing consent. | State and negative-send tests. |
| `PR-CONSENT-002` | Email marketing consent, SMS consent, Terms acceptance, privacy notice acknowledgement, and voice recording/transcription consent MUST be separate versioned states. | Consent-schema review. |
| `PR-CONSENT-003` | Consent evidence MUST record purpose, disclosure version, selected language, affirmative action, timestamp, source, and withdrawal/suppression state. | Evidence completeness test. |
| `PR-CONSENT-004` | SMS consent MUST be optional for receiving the free result and MUST NOT be a condition of purchase where prohibited. | UI and contract tests. |
| `PR-CONSENT-005` | Opt-out or withdrawal MUST suppress future messages for the applicable channel/purpose across connected vendors without erasing required minimal suppression evidence. | Lifecycle propagation test. |
| `PR-CONSENT-006` | Transactional and marketing communications MUST be modeled separately. | Trigger-matrix test. |
| `PR-CONSENT-007` | No non-essential tracker MAY receive raw answers, paid questionnaire content, transcript/audio, report content, payment-form content, email, or phone. | Analytics payload scan. |
| `PR-CONSENT-008` | Final notices and communication language MUST be approved through `LS-002`/`LS-004` and qualified review before live use. | Release evidence. |

## 9. Checkout, price, Stripe, and payment isolation

### 9.1 Commercial contract

| ID | Requirement | Verification |
|---|---|---|
| `PR-PAY-001` | Checkout MUST display `$299` one time, identify the Business Assessment, state that implementation is separate, and avoid subscription language. | Checkout content and line-item test. |
| `PR-PAY-002` | Paid access MUST NOT be granted from a client redirect alone; only a verified server-side payment state may confirm access. | Forged-redirect negative test. |
| `PR-PAY-003` | Stripe MUST be the payment processor for the assessment and approved promotion-code checkout. | Architecture/configuration review. |
| `PR-PAY-004` | Development and staging MUST use Stripe test mode, synthetic customer data, and test fixtures only. | Environment and fixture review. |
| `PR-PAY-005` | Test and live Stripe objects, secrets, endpoints, webhooks, products/prices, customers, events, and data stores MUST be distinguishable and MUST NOT cross environments. | Isolation tests. |
| `PR-PAY-006` | Stripe secret keys, restricted keys, webhook signing secrets, account exports, tax IDs, private addresses, and payment data MUST NOT be committed to source control, documentation, client bundles, logs, or analytics. | Secret scan and bundle/log inspection. |
| `PR-PAY-007` | Secrets and account identifiers MUST be referenced through protected deployment configuration and provisioned only by an authorized operator. | Deployment configuration review. |
| `PR-PAY-008` | Raw card numbers and CVC MUST NOT enter BizMetria application systems; the payment form MUST remain within the approved processor boundary. | Data-flow and network inspection. |
| `PR-PAY-009` | Webhook handling MUST verify signatures, reject invalid timestamps/signatures, support replay protection, and process each event idempotently. | Invalid, duplicate, delayed, and replay tests. |
| `PR-PAY-010` | Checkout creation and fulfillment activation MUST use idempotency controls that prevent duplicate orders or access. | Concurrency and retry tests. |
| `PR-PAY-011` | BizMetria MAY store processor references, amount, currency, promotion reference, payment/refund state, timestamps, receipt reference, and audit evidence, but not prohibited card data. | Data inventory review. |
| `PR-PAY-012` | Live checkout creation and real charges MUST fail closed unless every `LIVE-DEP` requirement is recorded as passed in the release configuration. | Pre-live gate negative test. |
| `PR-PAY-013` | Absence of a live key MUST be a normal safe configuration state; the application MUST remain buildable, testable, and deployable to staging without it. | Clean staging deployment. |
| `PR-PAY-014` | Adding live keys is a final protected activation operation and MUST NOT require source-code changes. | Activation runbook dry run. |

### 9.2 Payment states

At minimum, the payment domain MUST distinguish:

`CHECKOUT_CREATED`, `PAYMENT_PENDING`, `PAYMENT_CONFIRMED`, `PAYMENT_FAILED`, `PAYMENT_EXPIRED`, `PAYMENT_REFUND_PENDING`, `PAYMENT_PARTIALLY_REFUNDED`, `PAYMENT_REFUNDED`, and `PAYMENT_DISPUTED`.

Payment and fulfillment state MUST be related but separate. A refund or dispute MUST NOT erase the original order, payment, consent, or fulfillment evidence.

## 10. Promotions

| ID | Requirement | Verification |
|---|---|---|
| `PR-PROMO-001` | Promotion eligibility MUST be evaluated server-side against versioned campaign configuration. | API authorization tests. |
| `PR-PROMO-002` | An order MUST accept at most one promotion; stacking and manual overrides MUST be rejected. | Combination tests. |
| `PR-PROMO-003` | Promotions MUST apply only to the `$299` assessment unless a later approved decision says otherwise. | Product-scope tests. |
| `PR-PROMO-004` | Promotion value MUST be one of `$49`, `$99`, `$149`, or `$199` off and MUST never produce a negative or subscription amount. | Discount math vectors. |
| `PR-PROMO-005` | `$199` off MUST be private, unique, limited to qualifying late reactivation after at least 90 days, valid for 72 hours, and never advertised in advance. | Eligibility, expiry, and content tests. |
| `PR-PROMO-006` | `$49` MAY be used for a bounded conversion/partner campaign for seven days; no more than one public `$49` window may occur in a rolling 30-day period. | Campaign-cap tests. |
| `PR-PROMO-007` | `$99` MAY be offered after checkout abandonment of at least seven days for 72 hours through an eligible lifecycle message. | Time and lifecycle tests. |
| `PR-PROMO-008` | `$149` MAY be used privately for invite, pilot, high-intent, or at least 30-day inactive segments for 72 hours and requires owner/cap configuration. | Segment and approval tests. |
| `PR-PROMO-009` | Initial launch configuration MUST enable only approved `$49`/`$99` paths; `$149`/`$199` paths MUST default off until their tests and operating approvals pass. | Default configuration test. |
| `PR-PROMO-010` | Campaign records MUST include purpose, audience/eligibility, value, start/end, timezone, cap, owner, attribution, and stop rule. | Configuration-schema test. |
| `PR-PROMO-011` | A promotion MUST NOT change scoring, assessment depth, report quality, capacity priority, or customer rights. | Cross-domain regression test. |
| `PR-PROMO-012` | Expiration MUST use exact timestamps and the configured customer-facing timezone; retroactive application MUST be rejected. | Time-boundary vectors. |

## 11. Paid assessment and input completion

| ID | Requirement | Verification |
|---|---|---|
| `PR-PAID-001` | Paid onboarding MUST remain inaccessible until `PAYMENT_CONFIRMED` in the same environment and order. | Access-control negative test. |
| `PR-PAID-002` | The paid assessment MUST collect only fields defined with purpose, requirement level, evidence class, access, retention class, and deletion behavior in `PS-004`/`LS-002`. | Schema-to-inventory validation. |
| `PR-PAID-003` | The questionnaire MUST support saved progress, safe resume, validation, and explicit required/optional indicators. | Resume and validation tests. |
| `PR-PAID-004` | Free-text inputs MUST be bounded and accompanied by warnings against unnecessary sensitive or confidential information. | Schema and content review. |
| `PR-PAID-005` | The interview MAY last up to approximately 45 minutes and MUST follow the objectives, probing, stop, retry, and evidence contract approved downstream. | Duration and conversation fixtures. |
| `PR-PAID-006` | Before recording or transcription, the product MUST present the selected-language disclosure and capture the required affirmative consent; capture MUST fail closed without it. | Pre-capture negative test. |
| `PR-PAID-007` | If recording consent is declined or unavailable, the product MUST follow the counsel-approved fallback or support path and MUST NOT record first. | Decline/fallback test. |
| `PR-PAID-008` | Required evidence that is unavailable, contradictory, or not supplied MUST be marked explicitly rather than invented. | Evidence completeness fixtures. |
| `PR-PAID-009` | `ASSESSMENT_INPUTS_COMPLETE` MUST be entered only when the required questionnaire, interview or approved recovery path, and required follow-up are complete and no blocking fraud/safety/consent/access hold exists. | Completion-rule contract tests. |
| `PR-PAID-010` | The completion event MUST be immutable evidence for SLA calculation; corrections MUST create a new version or recorded adjustment, not rewrite history. | Audit/version test. |

## 12. Analysis, evidence, and recommendations

Every material analysis element MUST use one of these evidence states:

`CUSTOMER_FACT`, `SYSTEM_FACT`, `INFERENCE`, `ASSUMPTION`, `RECOMMENDATION`, or `UNKNOWN`.

| ID | Requirement | Verification |
|---|---|---|
| `PR-ANALYSIS-001` | Material claims MUST trace to versioned customer/system evidence or be labeled as inference, assumption, recommendation, or unknown. | Traceability validator. |
| `PR-ANALYSIS-002` | The system MUST NOT transform an assumption or inference into a fact through wording, translation, formatting, or report generation. | Adversarial content fixtures. |
| `PR-ANALYSIS-003` | The paid assessment SHOULD produce approximately 8–15 prioritized recommendations when evidence is sufficient; fewer MUST be allowed when quality would otherwise be reduced. | Output rubric. |
| `PR-ANALYSIS-004` | Recommendations MUST include rationale, evidence links, confidence/uncertainty, impact, effort, dependencies, and an appropriate next action. | Schema validation. |
| `PR-ANALYSIS-005` | The Impact vs. Effort matrix MUST be a relative planning aid and MUST NOT imply verified ROI or payback without validated customer evidence. | Claims and schema review. |
| `PR-ANALYSIS-006` | The roadmap MUST cover an appropriate 30–90 day sequence and MUST be presented as a recommendation, not a guaranteed completion or result date. | Report content fixtures. |
| `PR-ANALYSIS-007` | The system MUST block or flag invented losses, guaranteed savings, unsupported ROI, regulated advice, and claims beyond evidence. | Prompt/output regression suite. |
| `PR-ANALYSIS-008` | Structured canonical analysis MUST be language-neutral enough to support semantically equivalent English/Spanish reports. | Paired rendering fixtures. |
| `PR-ANALYSIS-009` | Every generated result MUST enter human review; automatic delivery directly from model output is prohibited. | State-machine negative test. |

## 13. Human review, report, and delivery

| ID | Requirement | Verification |
|---|---|---|
| `PR-REPORT-001` | The report MUST contain an executive summary, evidence/limitations, prioritized recommendations, Impact vs. Effort matrix, 30–90 day roadmap, next steps, and applicable disclaimers. | Report schema and fixture review. |
| `PR-REPORT-002` | Report drafts, review actions, approved versions, generated files, and deliveries MUST be versioned and linked to the source analysis version. | Version-chain test. |
| `PR-REPORT-003` | A trained human reviewer MUST explicitly approve the exact report version before delivery. | Approval-gate negative test. |
| `PR-REPORT-004` | Review MUST support approve, edit/request correction, reject, and regenerate paths with actor, reason, timestamp, and audit trail. | Reviewer workflow tests. |
| `PR-REPORT-005` | No trained reviewer available MUST stop acceptance of new real orders and prevent unreviewed delivery. | Staffing/configuration negative test. |
| `PR-REPORT-006` | The delivered report MUST be a professional downloadable PDF or approved equivalent, in the customer's selected language, with accessible customer status and recovery behavior. | Bilingual long/short/missing-data fixtures. |
| `PR-REPORT-007` | Delivery MUST be idempotent and auditable; retries MUST NOT silently create divergent approved versions. | Delivery retry tests. |
| `PR-REPORT-008` | Customer-facing disclaimers MUST state evidence limitations, no outcome guarantee, and no legal/tax/accounting/investment advice. | Claims review. |

### 13.1 Five-business-day SLA

| ID | Requirement | Verification |
|---|---|---|
| `PR-SLA-001` | The report due date MUST be five U.S. business days after `ASSESSMENT_INPUTS_COMPLETE`, ending at 5:00 p.m. `America/Los_Angeles`. | Calendar vectors. |
| `PR-SLA-002` | Payment confirmation, required questionnaire, interview or approved recovery, required follow-up, and absence of blocking holds MUST precede the completion timestamp. | Completion-rule tests. |
| `PR-SLA-003` | A documented customer-action hold MAY pause the clock; the product MUST show or communicate the required action and revised due date after resume. | Hold/resume vectors. |
| `PR-SLA-004` | Internal backlog, staffing gaps, vendor failures, or BizMetria rework MUST NOT be mislabeled as a customer-action hold. | Reason-code validation. |
| `PR-SLA-005` | SLA events, original due date, pauses, revised due date, delivery time, and breach/remedy state MUST remain auditable. | Audit-record test. |

## 14. Refund and remedy contract

`FULFILLMENT_STARTED` is the earliest recorded occurrence of:

1. submission of the required paid questionnaire;
2. start of the paid voice interview; or
3. recorded manual analysis or reviewer work.

| ID | Requirement | Verification |
|---|---|---|
| `PR-REFUND-001` | An approved cancellation before `FULFILLMENT_STARTED` MUST be eligible for a full refund, subject to mandatory rights and final counsel/accounting treatment. | State/refund vectors. |
| `PR-REFUND-002` | After fulfillment starts and before delivery, a change-of-mind request MUST NOT receive an automatic refund; BizMetria cancellation, inability to perform, missed SLA, material defect, and mandatory rights MUST route to authorized review. | Decision-table tests. |
| `PR-REFUND-003` | After delivery, change of mind MUST NOT create an automatic refund; correction, clarification, or regeneration SHOULD be evaluated first, without limiting mandatory rights. | Decision-table tests. |
| `PR-REFUND-004` | Duplicate or unauthorized payments MUST route through the approved refund/processor procedure. | Duplicate and dispute fixtures. |
| `PR-REFUND-005` | Refund requests MUST be acknowledged within one U.S. business day; approved refunds MUST be submitted promptly while processor/bank settlement timing is described as external. | Lifecycle timer tests. |
| `PR-REFUND-006` | Refund decisions and executions MUST record requester, reason, service state, amount, authorization, processor reference, timestamps, and outcome. | Audit-schema test. |
| `PR-REFUND-007` | Public Refund Policy text MUST remain unavailable for live checkout until qualified counsel approval and entity/tax facts are recorded. | `LIVE-DEP-007` gate test. |

## 15. Included consultation

| ID | Requirement | Verification |
|---|---|---|
| `PR-CONSULT-001` | Each delivered paid order MUST include one 30-minute results consultation entitlement. | Entitlement creation test. |
| `PR-CONSULT-002` | Consultation MUST default to video with a phone fallback and MUST use a provider capable of the customer's selected language. | Configuration and booking test. |
| `PR-CONSULT-003` | Booking MUST open after report delivery, remain available for 30 calendar days, and schedule the session to occur within 45 calendar days of delivery. | Time-window vectors. |
| `PR-CONSULT-004` | One reschedule MUST be allowed with at least 24 hours' notice. | Reschedule vectors. |
| `PR-CONSULT-005` | A no-show or late cancellation SHOULD consume the entitlement; one documented technical/material-hardship exception MAY be authorized and audited. | Decision-table tests. |
| `PR-CONSULT-006` | Late arrival MUST NOT extend the scheduled end time automatically. | Session timing test. |
| `PR-CONSULT-007` | Consultation scope MUST be report clarification, prioritization, and next steps; it MUST exclude new discovery, implementation, custom solution design, regulated advice, and unlimited follow-up. | Script and support review. |
| `PR-CONSULT-008` | Real booking MUST fail closed until provider identity, EN/ES coverage, hours, and scheduling configuration are assigned. | `LIVE-DEP-010` negative test. |

## 16. Separate implementation offers

| Package | Approved price | Product boundary |
|---|---:|---|
| Implementation Starter | `$1,500` fixed | One workflow, one primary integration/configuration, tests, documentation, and handoff; up to two weeks after readiness. |
| Operations Sprint | `$4,500` fixed | Up to three related improvements/integrations, tests, documentation, and handoff; approximately four to six weeks after readiness. |
| Custom Systems Build | From `$9,500` | Separately discovered and scoped custom work with milestone pricing. |

| ID | Requirement | Verification |
|---|---|---|
| `PR-IMPL-001` | Implementation interest MUST create a separate commercial opportunity and MUST NOT alter or delay the assessment deliverable. | Lifecycle/state tests. |
| `PR-IMPL-002` | Every implementation engagement MUST have separate discovery, scope, agreement, payment terms, dependencies, acceptance criteria, change control, security/data responsibilities, and third-party-fee treatment. | Contract checklist. |
| `PR-IMPL-003` | Starter and Sprint SHOULD use 50% to schedule and 50% at acceptance or the approved milestone; custom work MUST use an approved milestone plan. | Commercial configuration review. |
| `PR-IMPL-004` | Subscriptions, taxes, vendor fees, and out-of-scope work MUST remain separate unless explicitly included in the signed scope. | Quote/contract review. |
| `PR-IMPL-005` | Readiness failures and scope changes MUST use an approved hold/change-order path; no outcome guarantee may be offered. | Operations checklist. |
| `PR-IMPL-006` | The target gross margin SHOULD be at least 50%; package assumptions MUST be reviewed after the first five engagements. | Operations evidence. |
| `PR-IMPL-007` | A delivery lead MUST NOT own more than two concurrent implementation engagements without a later approved capacity change. | Capacity-control test. |

## 17. Capacity and operating guardrails

The approved planning assumption is 2.5 human hours per paid assessment plus a 20% operating reserve.

| ID | Requirement | Verification |
|---|---|---|
| `PR-CAP-001` | Initial real-order intake MUST be capped at six new paid orders per rolling seven days and two per calendar day. | Capacity boundary tests. |
| `PR-CAP-002` | Capacity MAY increase to eight per rolling seven days only after ten consecutive deliveries meet SLA, traceability, correction, and support guardrails. | Evidence-gated configuration test. |
| `PR-CAP-003` | The human-review queue MUST not exceed six and active fulfillment MUST not exceed twelve. | Queue-limit tests. |
| `PR-CAP-004` | Campaigns SHOULD pause when forecast load exceeds 80% of safe capacity. | Forecast/automation test. |
| `PR-CAP-005` | New paid intake MUST stop when an SLA miss is likely, the review queue exceeds six, a P0/P1 issue affects safe operation, on-time delivery falls below 90%, or no trained reviewer is available. | Stop-rule simulations. |
| `PR-CAP-006` | Reopening intake MUST require a recorded operations/QA check and must not be triggered solely by elapsed time. | Reopen authorization test. |
| `PR-CAP-007` | Assessment and implementation capacity MUST be planned and controlled separately. | Capacity model review. |

## 18. Product metrics and hard guardrails

### 18.1 Funnel and fulfillment targets

| Metric | Initial target |
|---|---:|
| Free-check start rate | `>= 20%` |
| Free-check completion rate | `>= 55%` |
| Contact capture among completers | `>= 70%` |
| Free-result to checkout start | `>= 8%` |
| Paid conversion | `>= 2.5%` |
| Paid questionnaire completion | `>= 80%` |
| Interview completion | `>= 75%` |
| Evidence sufficiency | `>= 85%` |
| On-time report delivery | `>= 90%` |
| First-pass human review | `>= 75%` |
| Report delivery success | `>= 98%` |
| Consultation attendance | `>= 65%` |
| Usefulness rating | `>= 4.0 / 5` average |
| Correction/complaint rate | `<= 10%` |
| Refund-request rate | `<= 8%` |
| Support effort | `<= 1.5 hours / paid order` |

Conversion metrics are directional until at least 500 qualified visits or 30 paid orders. Quality metrics are initial after 10 delivered orders and stronger after 30. Sample-size labels MUST appear with dashboards and decisions.

### 18.2 Non-negotiable guardrails

| ID | Requirement | Verification |
|---|---|---|
| `PR-KPI-001` | Traceability defects for material report claims MUST be zero at delivery. | Review and QA evidence. |
| `PR-KPI-002` | English/Spanish P0/P1 parity defects MUST be zero at release. | Paired regression suite. |
| `PR-KPI-003` | Consent, payment integrity, access control, human review, evidence traceability, and P0/P1 safety/reliability gates MUST override conversion targets. | Release decision review. |
| `PR-KPI-004` | Metrics MUST use versioned definitions, numerator/denominator, environment, time window, and exclusion rules. | Analytics contract review. |
| `PR-KPI-005` | Test/staging activity, staff activity, duplicate events, and synthetic data MUST be excluded from production business metrics. | Analytics reconciliation. |

## 19. Analytics and audit event baseline

`QA-001` and downstream contracts MAY refine names, but they MUST preserve the following measurable concepts:

- free check viewed, started, answer validated, completed, score computed, result viewed;
- contact supplied and each consent granted, declined, or withdrawn;
- checkout created, promotion evaluated/applied/rejected, payment confirmed/failed/refunded/disputed;
- paid questionnaire started/saved/completed;
- voice disclosure shown, consent decision, interview started/completed/recovered;
- inputs complete, customer hold started/ended, due date set/recalculated;
- analysis drafted/failed, review assigned/approved/rejected/corrected;
- report generated/delivered/retried;
- consultation entitlement created/booked/rescheduled/completed/no-show;
- support, privacy request, deletion, and implementation-interest milestones;
- capacity pause, stop, reopen, and pre-live-gate evaluation.

| ID | Requirement | Verification |
|---|---|---|
| `PR-EVENT-001` | Event names and properties MUST be versioned and documented before implementation. | Schema registry review. |
| `PR-EVENT-002` | Analytics events MUST contain only allowlisted non-content properties and MUST exclude raw answers, free text, transcripts/audio, reports, payment-form data, email, and phone. | Payload scanner. |
| `PR-EVENT-003` | Security/audit events and product analytics MUST be separated by purpose and access. | Data-flow review. |
| `PR-EVENT-004` | Required audit evidence MUST not depend solely on a third-party analytics tool. | Storage and recovery test. |

## 20. Data, privacy, and security boundaries

| ID | Requirement | Verification |
|---|---|---|
| `PR-DATA-001` | Contact identity, assessment content, consent evidence, payment metadata, analytics, and security logs MUST be separate data domains with least-privilege access. | Architecture and authorization tests. |
| `PR-DATA-002` | Every new field MUST declare purpose, requirement level, source, evidence class, sensitivity, access roles, retention class, deletion behavior, and downstream recipients before release. | Schema lint/review. |
| `PR-DATA-003` | Customer content MUST NOT be used to train general-purpose models by default. | Vendor/configuration evidence. |
| `PR-DATA-004` | Production data MUST NOT be used in development, staging, fixtures, demos, or source control. | Environment scan. |
| `PR-DATA-005` | Staff access MUST use strong authentication, MFA for privileged roles, server-side object authorization, and auditable role changes. | Security test evidence. |
| `PR-DATA-006` | Data MUST be encrypted in transit and at rest using maintained platform controls. | Architecture evidence. |
| `PR-DATA-007` | Logs and errors MUST redact secrets and customer content and MUST use stable correlation references instead. | Log fixture scan. |
| `PR-DATA-008` | Export, correction, deletion, communication suppression, and processor notification workflows MUST be implementable and auditable. | Rights-workflow tests. |
| `PR-DATA-009` | Retention MUST be event-based and configuration-driven; unresolved periods MUST NOT default to indefinite retention. | Retention configuration review. |
| `PR-DATA-010` | Backups MUST be encrypted, expire automatically, be restore-tested, and support deletion-on-restore handling. | Runbook and restore evidence. |
| `PR-DATA-011` | Vendors MUST NOT receive production data before approved security/privacy review, contractual treatment, and configuration evidence. | Vendor gate. |
| `PR-DATA-012` | High-risk actions—report approval, refund execution, export/deletion, role change, secret access, and production configuration—MUST be explicitly authorized and audited. | Permission and audit tests. |

Exact retention periods, legal applicability, vendor terms, and public policies remain downstream professional-review items and MUST NOT be invented by implementation defaults.

## 21. Reliability, recovery, and accessibility

| ID | Requirement | Verification |
|---|---|---|
| `PR-QUAL-001` | Customer workflows MUST be responsive and keyboard-operable and SHOULD target WCAG 2.2 AA subject to the approved UX/release contract. | Automated and manual accessibility tests. |
| `PR-QUAL-002` | English and Spanish errors, empty states, retry states, loading states, and support paths MUST be equivalent in meaning. | Paired UI fixtures. |
| `PR-QUAL-003` | Long-running work MUST expose safe progress/status without requiring the customer to keep a browser session open. | Resume/status E2E test. |
| `PR-QUAL-004` | External dependency failures MUST use bounded retries, timeouts, circuit/queue controls where appropriate, and an auditable recovery path. | Failure-injection tests. |
| `PR-QUAL-005` | Duplicate submissions and concurrency MUST NOT create duplicate charges, orders, analyses, reports, refunds, or messages. | Concurrency tests. |
| `PR-QUAL-006` | Customer-facing errors MUST be actionable without exposing stack traces, secrets, internal identifiers, security logic, or other customer data. | Error-content tests. |
| `PR-QUAL-007` | All production-impacting configuration MUST be versioned or change-audited and reversible through an approved rollback path. | Deployment/runbook evidence. |

## 22. Pre-live dependency register

Non-live contracts, architecture, implementation, automated tests, Stripe test-mode work, and staging MAY proceed while these dependencies are incomplete. Real charges, real paid-order acceptance, and public paid availability MUST remain disabled until all applicable entries pass.

| ID | Dependency | Pass evidence | Failure behavior |
|---|---|---|---|
| `LIVE-DEP-001` | Legal selling entity and entity type | Owner-approved business record reference, without sensitive IDs in GitHub | Live checkout disabled. |
| `LIVE-DEP-002` | Formation jurisdiction and public business address | Approved public business facts/configuration | Policies, receipts, and live checkout disabled. |
| `LIVE-DEP-003` | Support email and public mailing/contact path | Verified monitored channels and tested routing | Public paid availability disabled. |
| `LIVE-DEP-004` | Nationwide launch review | Qualified review of all 50 states + D.C. applicability and controls | Nationwide live geography disabled. |
| `LIVE-DEP-005` | Operating calendar configuration | Versioned `America/Los_Angeles` + U.S. federal-holiday tests | Real order intake disabled. |
| `LIVE-DEP-006` | Tax/accounting review and Stripe tax configuration decision | Qualified documented disposition and tested configuration | Live Stripe activation disabled. |
| `LIVE-DEP-007` | Refund Policy legal review | Counsel-approved public text mapped to implemented states | Live checkout disabled. |
| `LIVE-DEP-008` | 18+ authorization, Terms, privacy, and consent review | Counsel-approved public requirements and EN/ES text | Real account/payment use disabled. |
| `LIVE-DEP-009` | Primary and backup report reviewers with weekly hours | Named trained reviewers, access, schedule, capacity check, and backup | Real paid intake disabled. |
| `LIVE-DEP-010` | EN/ES consultation providers and bookable hours | Named trained providers and tested scheduling configuration | Real paid intake disabled. |
| `LIVE-DEP-011` | Security/privacy/vendor gates | Approved `LS-002`/`LS-003`, vendor evidence, incident/backup/access checks | Production data and live commerce disabled. |
| `LIVE-DEP-012` | Release qualification | Required staging E2E, payment replay, bilingual, accessibility, analytics, and P0/P1 evidence | Production promotion disabled. |
| `LIVE-DEP-013` | Protected Stripe live activation | Authorized operator provisions live identifiers/secrets and verifies signed webhooks without source changes | Test mode only; no real charge. |
| `LIVE-DEP-014` | Explicit launch go/no-go | Recorded Master Control approval after all prior dependencies pass | Live feature flag remains off. |

The release system MUST evaluate the gate from recorded configuration/evidence. A missing, expired, unknown, or inconsistent dependency MUST evaluate as failure.

## 23. Downstream contract assignments

| Consumer | Requirements to formalize | Must not change without approval |
|---|---|---|
| `FA-001` | 11-question bilingual schema, answer IDs, detailed point table, result selection, boundaries, regression vectors | `PR-FREE-*`, 0–100, caps, identity-independent score |
| `PS-004` | Paid questionnaire/interview objectives, fields, completion and partial-state rules | `PR-PAID-*`, evidence and minimization boundaries |
| `LS-002` | Implementable consent, notice, claim, rights, and data rules | `PR-CONSENT-*`, `PR-DATA-*`, legal-review flags |
| `LC-001` | Pricing, checkout, promotions, refunds, lifecycle, consultation and implementation-interest states | `PR-PAY-*`, `PR-PROMO-*`, `PR-REFUND-*`, `PR-CONSULT-*` |
| `AE-001` | Evidence schema, analysis, recommendation, matrix, roadmap and review handoff | `PR-ANALYSIS-*` |
| `RP-001` | Report schema, human review, versioning, delivery and SLA | `PR-REPORT-*`, `PR-SLA-*` |
| `QA-001` | Traceability, event taxonomy, test ownership, severity, fixtures and release evidence | Every `MUST` requirement and all hard guardrails |
| Phase 3+ | UX, voice, architecture, vendors, implementation and release | This baseline and approved downstream contracts |

## 24. Phase 1 acceptance and Gate G1 evaluation

| Check | Result in this artifact |
|---|---|
| `DEC-001`–`DEC-026` reflected without contradiction | PASS |
| Approved `D01-B`/`D02-A`/`D03-A`/`D04-B`/`D05-B`/`D06-B`/`D07-B`/`D08-A`/`D09-A` converted to testable rules | PASS |
| Free/paid and assessment/implementation boundaries stable | PASS |
| English/Spanish parity and shared-backend model stable | PASS |
| Nationwide U.S. intent and no international paid launch explicit | PASS |
| Stripe test/live, webhook, idempotency, raw-card, secret, and final activation boundaries explicit | PASS |
| Entity, support, staffing, legal/tax, vendor/security, release, and credential dependencies fail closed | PASS |
| Stack, voice, CRM/email, and detailed scoring choices remain routed rather than guessed | PASS |
| Every downstream Phase 2 contract can cite stable product requirements | PASS |
| `G1 — Product Baseline Approved` | `PASS` — independently reviewed, merged through PR #10, and resulting `main` verified |

## 25. Change control

After approval:

- editorial clarifications that do not change behavior MAY use a patch version;
- a behavior, price, scope, eligibility, consent, state, data, security, metric, or gate change MUST identify impacted requirement IDs and downstream contracts;
- a schema-breaking or customer-contract change MUST receive explicit versioning and Master Control impact review;
- a conflict with `DEC-001`–`DEC-026` requires a new approved Decision Log entry;
- no missing live dependency may be converted to `PASS` through code defaults, placeholder values, or the presence of a Stripe account alone.

## 26. Handoff Summary

- **Task:** `PS-003 — Product Requirements Baseline v1.0`
- **Status:** `APPROVED`
- **Files changed:** This requirements baseline plus synchronized Product Strategy, Master Control, and global/control state records.
- **Decisions proposed:** None.
- **Decisions approved and implemented:** `DEC-001`–`DEC-026`, including `D01-B`, `D02-A`, `D03-A`, `D04-B`, `D05-B`, `D06-B`, `D07-B`, `D08-A`, `D09-A`, and Stripe as the eventual real-payment processor.
- **Open questions:** `OPEN-004`, `OPEN-005`, `OPEN-006`, and `OPEN-009` remain assigned to their approved downstream tasks. Exact legal text, retention periods, vendor terms, and pre-live facts remain gated.
- **Dependencies:** Approved `PS-001`, `LS-001`, `PS-002`, merged `MC-003`, and Decision Log through `DEC-026`.
- **Validation performed:** 162/162 unique requirement IDs; DEC-001–DEC-026 trace; cross-domain consistency; bilingual and score invariants; Stripe/test-live/secret safety; 60 relative links; Markdown/diff checks; downstream coverage; exact remote/local equality; independent PR review; protected merge; resulting `main` verification.
- **Recommended next action:** Start `FA-001` and `PS-004` as the two non-overlapping Phase 2 tasks.
