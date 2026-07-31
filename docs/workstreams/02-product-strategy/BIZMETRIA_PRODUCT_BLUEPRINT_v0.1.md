# BizMetria Product Blueprint v0.1

**Task:** `PS-001 — Product Blueprint v0.1` \
**Version:** `v0.1` \
**Status:** `APPROVED` \
**Owner workstream:** 02 — Product Strategy \
**Prepared:** 2026-07-30 \
**Source baseline:** `main` at `9f589ba69aaa202ddb5890cfc9a5d56890b85dc8`

## 1. Document authority and interpretation

This is a new Product Blueprint assembled from the current approved repository baseline. It is not represented as the unavailable historical Product Blueprint.

The following labels apply throughout:

- **Approved** — already established by `DEC-001`–`DEC-016` or the Master Brief.
- **Requirement** — a testable product consequence of an approved decision.
- **Proposal** — a recommendation that still requires the routed owner decision.
- **Open** — unresolved and not safe to implement as a final commercial or policy rule.

If this document conflicts with a later approved Decision Log entry, the Decision Log controls.

## 2. Product definition

### 2.1 Approved definition

**BizMetria Business Assessment** is a bilingual, cross-industry business assessment that gathers structured operational evidence, analyzes practical AI and automation opportunities, and delivers a prioritized action plan.

The assessment costs **$299 one time** and is not a subscription. Implementation is a separate service and is not included in the $299 price.

### 2.2 Customer problem

Small and midsize businesses often know that AI or automation may help but do not know:

- where work is being lost, delayed, duplicated, or handled manually;
- which opportunity should be addressed first;
- what can realistically be improved without replacing every existing system;
- how to separate a useful project from a generic AI suggestion;
- what evidence, owners, systems, and sequence an implementation would require.

BizMetria turns fragmented business context into an organized opportunity map and a practical priority order.

### 2.3 Customer outcome

The paid customer receives:

- a structured view of current operational friction;
- approximately 8–15 evidence-linked recommendations;
- an Impact vs. Effort Matrix;
- a 30–90 day action roadmap;
- a professionally rendered PDF;
- mandatory human review during MVP;
- a results consultation, with exact format still open;
- a clear boundary between the assessment and any separately purchased implementation.

The outcome is a decision-support deliverable. It is not a financial valuation, legal opinion, tax opinion, guaranteed savings calculation, or guarantee of implementation results.

### 2.4 Why the customer pays $299

The paid value is the combination of:

1. structured evidence gathered across an extended questionnaire and adaptive interview;
2. cross-functional analysis rather than a single generic answer;
3. prioritization and sequencing, not only a list of ideas;
4. traceability from material conclusions to customer-provided evidence;
5. a usable report and roadmap;
6. human quality control before delivery;
7. a consultation to clarify the result without including implementation work.

The price is justified only when these components work together. A questionnaire alone, an unreviewed model response, or a generic checklist does not satisfy the paid product.

### 2.5 Differentiation

| Alternative | Typical limitation | BizMetria requirement |
|---|---|---|
| Generic AI chat | Depends on prompt quality; may invent details; no stable process | Structured inputs, evidence links, controlled schemas, and human review |
| Static online quiz | Produces a shallow score or generic result | Free score is only the entry point; paid assessment gathers deeper evidence |
| Traditional discovery call | Quality and format vary by consultant | Repeatable bilingual workflow plus structured report and roadmap |
| Vendor sales consultation | Recommendations may favor one tool or service | Vendor-neutral analysis unless a later approved implementation scope names a vendor |
| DIY automation checklist | Does not prioritize around the customer’s constraints | Impact, effort, dependency, risk, and 30–90 day sequencing |

## 3. Ideal customer profile

### 3.1 Primary profile

The primary customer is an owner, operator, or senior manager of an operating small or midsize business who:

- has real recurring workflows, customers, leads, staff, contractors, or operational handoffs;
- can describe current processes and provide enough evidence for analysis;
- experiences missed follow-up, manual work, disconnected systems, limited reporting, or scaling friction;
- wants a prioritized plan before purchasing implementation;
- can involve the people who understand sales, service delivery, operations, or administration.

The product remains cross-industry. Industry affects context and recommendation relevance but does not affect the AI Opportunity Score.

### 3.2 Strong-fit signals

- Consistent lead or customer volume.
- Repeated manual data entry or copy/paste work.
- Slow or inconsistent response and follow-up.
- Important information spread across inboxes, spreadsheets, notes, or disconnected tools.
- Growth constrained by coordination or administrative work.
- A decision-maker willing to provide approximately 45 minutes for the interview.
- A clear 30–90 day improvement horizon.

### 3.3 Weak-fit or non-target signals

- The business is only an idea and has no operating workflow to assess.
- The user wants guaranteed revenue, guaranteed cost savings, a valuation, legal advice, tax advice, or financial advice.
- The user wants implementation included in the $299 assessment.
- The user cannot provide meaningful operating context or authorize access to required participants.
- The primary need is emergency troubleshooting, custom software delivery, or procurement rather than assessment.
- The submitted material would require BizMetria to process prohibited or unnecessarily sensitive information.

### 3.4 Buyer and participant roles

| Role | Typical responsibility |
|---|---|
| Buyer | Purchases the assessment and accepts commercial terms |
| Primary participant | Completes the questionnaire and interview |
| Business stakeholder | Provides missing operational evidence when invited |
| BizMetria reviewer | Reviews, edits, approves, or rejects the draft report |
| Consultation participant | Reviews priorities and next steps after delivery |

One person may hold several roles. Role and access rules must be implemented explicitly rather than inferred from an email address.

## 4. Jobs to be done

### Functional jobs

- Identify the most valuable AI and automation opportunities.
- Understand which operational problems deserve attention first.
- Compare opportunities by expected impact and implementation effort.
- Obtain a realistic order of work for the next 30–90 days.
- Decide what to handle internally, buy from a vendor, or discuss as a separate implementation.

### Emotional and confidence jobs

- Reduce uncertainty about where to begin.
- Replace an overwhelming list of tools with a bounded plan.
- Gain confidence that important context was reviewed by a human during MVP.

### Organizational jobs

- Create a document stakeholders can discuss.
- Establish a shared vocabulary for problems, evidence, priorities, and owners.
- Preserve a record of what was known, assumed, and recommended at the time of assessment.

## 5. Product architecture

BizMetria has three deliberately separate layers:

1. **Free AI Opportunity Check** — limited discovery and conversion product.
2. **$299 BizMetria Business Assessment** — complete assessment deliverable.
3. **Separate implementation offer** — optional work estimated and contracted independently.

No customer-facing flow may blur these layers.

## 6. Free AI Opportunity Check

### 6.1 Approved scope

The free check contains 11 questions plus a contact form and produces a deterministic AI Opportunity Score from 0–100.

The score uses five approved blocks:

| Block | Maximum |
|---|---:|
| Lead Response and Follow-Up | 30 |
| Manual Work | 25 |
| Systems and Data | 20 |
| Strategic Priority and Urgency | 15 |
| Opportunity Breadth | 10 |
| **Total** | **100** |

Industry, name, email, phone, preferred language, and promotion code do not affect the score. Identical canonical answers must produce identical results.

The detailed question wording, answer options, point table, and result-selection rules remain recovered draft material until `FA-001` formally tests and approves or replaces them.

### 6.2 Free result boundary

The free result may show:

- total score and score level;
- a visible non-financial disclaimer;
- one general observation;
- no more than three general opportunity areas;
- locked previews of paid report sections;
- the $299 one-time offer.

The free result must not disclose:

- the full problem inventory;
- a specific solution architecture;
- a complete vendor or service list;
- unsupported financial-loss estimates;
- ready-to-execute implementation instructions;
- the full roadmap;
- a PDF report;
- a consultation.

### 6.3 Free-product success condition

The free check succeeds when the user understands:

1. that meaningful opportunity may exist;
2. the general categories where it may exist;
3. that the score is not a business-quality or financial rating;
4. why deeper evidence is required for a useful plan;
5. what the paid assessment includes and costs.

It fails if it gives away the paid solution or uses fear, invented losses, or misleading precision to force a purchase.

## 7. Paid assessment scope

### 7.1 Component contract

| Component | Customer receives | Purpose | Limitation |
|---|---|---|---|
| Extended questionnaire | Structured business, workflow, system, and objective context | Prepare the interview and reduce repeated questions | Exact field contract belongs to `PS-004`; unnecessary sensitive data is prohibited |
| Adaptive AI interview | Guided interview up to approximately 45 minutes | Clarify processes, exceptions, evidence, and priorities | Requires disclosure/consent; missing evidence must remain marked missing |
| Analysis | Evidence-linked problem and opportunity model | Convert inputs into prioritized findings | Must separate facts, inferences, assumptions, and recommendations |
| Recommendations | Approximately 8–15 prioritized recommendations | Explain what to consider and why | Count may vary within the approved range; no invented guarantee |
| Impact vs. Effort Matrix | Relative placement of recommended opportunities | Support sequencing and tradeoffs | Relative planning tool, not a promised ROI calculation |
| 30–90 day roadmap | Ordered actions, dependencies, owners/roles, and checkpoints | Make the result operationally useful | Not implementation delivery or a fixed performance promise |
| Professional PDF | Versioned, readable final report | Create a durable decision document | Must not be delivered before human approval |
| Human review | MVP quality-control pass | Catch unsupported claims, contradictions, and poor recommendations | Review checklist and capacity controls remain to be specified |
| Results consultation | Guided review of findings and next steps | Improve comprehension and decision quality | Exact duration, channel, scheduling, and no-show rules remain open |

### 7.2 Recommendation quality requirements

Every material recommendation must identify:

- the observed evidence or customer statement supporting it;
- the problem or opportunity addressed;
- expected operational benefit expressed without unsupported financial promises;
- effort band and principal dependencies;
- relevant risks or missing information;
- recommended owner or role;
- suggested place in the 30–90 day sequence;
- whether the recommendation is assessment-only or may lead to a separate implementation discussion.

### 7.3 Evidence states

The analysis and report must distinguish:

- `CUSTOMER_FACT` — explicitly provided by the customer;
- `SYSTEM_FACT` — deterministically derived from structured input;
- `INFERENCE` — reasoned interpretation that may require confirmation;
- `ASSUMPTION` — temporary premise used because evidence is missing;
- `RECOMMENDATION` — proposed action;
- `UNKNOWN` — evidence not collected or not reliable enough.

An `UNKNOWN` must never be silently converted into a fact.

## 8. Explicit exclusions from $299

The $299 assessment does not include:

- implementation or project delivery;
- custom software development;
- configuration of third-party tools;
- purchase of software, subscriptions, phone numbers, or usage credits;
- data migration or data cleanup;
- continuing support or managed services;
- employee training beyond explanation of the report;
- legal, tax, accounting, investment, or regulated financial advice;
- a financial valuation of the business;
- guaranteed savings, revenue, conversion, productivity, or other outcome;
- security certification or compliance certification;
- unlimited revisions;
- additional discovery outside the approved questionnaire, interview, review, and consultation scope.

These exclusions must appear before payment, in Terms, and in the delivered report where relevant.

## 9. End-to-end customer journey

| Stage | Entry | Required product behavior | Exit |
|---|---|---|---|
| Discover | Ad, search, referral, or direct visit | Clear bilingual positioning without guarantees | User chooses language or leaves |
| Free check | English or Spanish funnel | 11 canonical questions; accessible progress; deterministic validation | Valid submission |
| Contact and consent | Before result/lifecycle enrollment | Contact fields separate from assessment; email/SMS permissions separate | Consent evidence stored |
| Free result | Valid score | Limited result boundary and $299 offer | Checkout, lifecycle follow-up, or exit |
| Checkout | User elects paid assessment | One-time $299 price; only eligible approved promotion | Confirmed payment or recoverable failure |
| Paid onboarding | Successful payment | Explain scope, exclusions, data handling, and next steps | Questionnaire started |
| Questionnaire | Authorized customer | Save/resume and required/optional distinction | Completion threshold met |
| Voice interview | Questionnaire ready | Language-specific number, disclosure, adaptive prompts, recovery | Completed, partial, rescheduled, or failed |
| Analysis | Sufficient evidence | Structured evidence processing and recommendation generation | Draft analysis validates |
| Human review | Draft report exists | Reviewer can edit, reject, request regeneration, or approve | Explicit approval |
| Delivery | Approved report | Versioned PDF and auditable delivery | Customer access confirmed |
| Consultation | Eligible delivered order | Approved scheduling and scope boundaries | Completed, rescheduled, no-show, or waived |
| Implementation interest | Customer requests help | Separate discovery, estimate, contract, and payment | Separate opportunity |

Every stage requires explicit success, failure, retry, abandonment, and support states in later contracts.

## 10. Bilingual product model

English and Spanish are first-class launch experiences.

### Requirements

- One English telephone number and one Spanish telephone number.
- One shared backend and shared business logic.
- Identical canonical question IDs, answer IDs, validation codes, event names, score fields, and output schemas.
- Equivalent, not mechanically literal, customer-facing meaning.
- Language-specific templates and prompts are versioned.
- A language switch does not create a second order or alter score logic.
- Equivalent evidence in either language yields equivalent structured output and prioritization.
- Reports and lifecycle messages use the customer’s approved language state.
- A fallback or handoff must preserve the original language and transcript context.

Spanish parity is not complete merely because English copy was machine-translated.

## 11. Operating model

### 11.1 MVP service workflow

1. Payment and order are confirmed.
2. Questionnaire completion is validated.
3. Voice interview is completed or a documented recovery path is used.
4. Inputs are normalized into a language-neutral evidence model.
5. Analysis and report draft are generated.
6. Automated validation checks schema, required sections, prohibited claims, and traceability.
7. A human reviewer edits, rejects, regenerates, or approves.
8. Only the approved report version can be delivered.
9. Consultation and separate implementation-interest workflows follow.

### 11.2 Human-review control

During MVP, report delivery must be technically impossible without an explicit human approval event tied to:

- reviewer identity;
- report and analysis versions;
- approval timestamp;
- review checklist version;
- edits or rejection reason;
- delivery eligibility state.

### 11.3 Capacity principle

Advertising volume must not exceed the team’s ability to:

- review every report within the approved deadline;
- handle failed interviews and payment exceptions;
- answer support requests;
- deliver consultations under the approved scheduling rules.

Capacity assumptions and launch caps belong in `PS-002`, operations runbooks, and the release gate.

## 12. Commercial architecture

### 12.1 Approved rules

- List price: $299 one time.
- No assessment subscription.
- Stripe Coupons and Promotion Codes.
- Discounts between $49 and $199 off.
- The $199 discount is late-reactivation-only and is not advertised in advance.
- Implementation is separate.

### 12.2 Open commercial rules

The following are intentionally not finalized here:

- promotion names, eligibility, cadence, expiration, reuse, and stacking;
- refund eligibility and process;
- consultation duration, format, scheduling, rescheduling, and no-show treatment;
- report delivery deadline;
- implementation packages and prices.

They are routed to `PS-002` and `MC-003`.

### 12.3 Unit-economics framework

The assessment must be evaluated per order with:

`contribution margin = net collected price - payment fees - variable AI/voice/transcription/PDF cost - human review cost - consultation cost - support/refund allowance`

The model must show at least:

- list-price order;
- $49, $99, $149, and $199 discount scenarios;
- standard and high-manual-review cases;
- consultation attendance and no-show cases;
- refund allowance;
- maximum sustainable acquisition cost.

No provider price is approved by this document. Current vendor quotes and measured labor time are required before a numeric margin or minimum price is approved.

## 13. Product metrics

### 13.1 Funnel metrics

| Metric | Definition |
|---|---|
| Free-check start rate | Eligible visits that start Q01 |
| Free-check completion rate | Starts that submit all required scoring inputs |
| Contact completion rate | Free-check completions with valid required contact fields |
| Result-to-checkout rate | Unique free results that open checkout |
| Paid conversion rate | Eligible free results that become confirmed paid orders |
| Average collected price | Net confirmed assessment revenue divided by paid orders |
| Promotion utilization | Paid orders by promotion and discount amount |

### 13.2 Fulfillment metrics

| Metric | Definition |
|---|---|
| Questionnaire completion | Paid orders reaching questionnaire completion |
| Interview completion | Eligible orders with a completed interview |
| Evidence sufficiency rate | Interviews meeting the analysis minimum without manual recollection |
| Report turnaround | Confirmed start event to approved report delivery |
| Review first-pass approval | Drafts approved without regeneration |
| Traceability defect rate | Material findings lacking valid supporting evidence |
| Report delivery success | Approved reports successfully made available |
| Consultation attendance | Booked consultations completed |

### 13.3 Outcome and quality metrics

- Customer-reported clarity of priorities.
- Customer-reported usefulness of recommendations.
- Report correction or complaint rate.
- Refund request and refund completion rate.
- Implementation-interest rate.
- Paid implementation conversion, measured separately from assessment quality.
- English/Spanish parity defect rate.
- Support contacts per completed order.

Numeric targets remain a `PS-002` owner decision. Metrics must be defined before targets are selected so targets cannot change the meaning of success.

## 14. Acceptance tests for the product baseline

1. A customer can identify the price as $299 one time before checkout.
2. No surface implies that implementation is included.
3. The free result never reveals paid-only architecture, roadmap, PDF, or consultation.
4. Industry, contact data, language, and promotion code cannot change the score.
5. Equivalent English and Spanish canonical answers produce identical score inputs.
6. A paid order cannot reach delivery without a recorded human approval.
7. The report clearly distinguishes evidence, inference, assumption, recommendation, and unknown.
8. Unsupported guaranteed outcomes or financial-loss claims are blocked.
9. Promotion logic cannot expose or advertise the $199 late-reactivation discount in advance.
10. Email and SMS consent are represented separately.
11. Payment, interview, analysis, review, delivery, and consultation each have failure/recovery states.
12. The report and consultation do not become free implementation.

## 15. Downstream handoffs

| Workstream | Actionable input from this blueprint |
|---|---|
| UX | Stage/state inventory, free/paid boundary, role model, bilingual requirements, error/recovery requirement |
| Free Audit | Approved score boundaries and content boundary; recovered detailed rules still require formal testing |
| English Voice | Interview purpose, evidence states, duration ceiling, recovery and disclosure needs |
| Spanish Voice | Canonical parity and equivalent-output requirement |
| AI Analysis | Evidence taxonomy, recommendation contract, prohibited claims, prioritization outputs |
| Report/PDF | Required sections, versioning, human-approval gate, delivery boundary |
| Backend | Domain states, role/access concepts, auditability, idempotent recovery needs |
| Payments/Lifecycle | Price, discount boundary, checkout/lifecycle stages, separate consent and implementation interest |
| Legal | Data surfaces, exclusions, claims, consent points, voice recording, user-rights and policy dependencies |
| Marketing | Value proposition, fit/non-fit, approved claims, prohibited promises, offer hierarchy |
| QA | Twelve baseline acceptance tests and metric definitions |

## 16. Risks and controls

| Risk | Product control |
|---|---|
| Generic recommendations | Require evidence links, business-specific rationale, and reviewer rejection path |
| Hallucinated facts or losses | Typed evidence states, prohibited-claim validation, human review |
| Free result replaces paid product | Enforce explicit content boundary and locked paid sections |
| Assessment appears to be implementation | Repeat exclusions before payment and in report/consultation |
| Spanish experience is lower quality | Canonical parity fixtures and human localization review |
| Manual review becomes bottleneck | Capacity limits, review-time metrics, controlled advertising |
| Promotions train users to wait | Keep eligibility/rules controlled; never pre-advertise $199 late reactivation |
| Sensitive data is overshared | Field minimization, instructions not to submit unnecessary sensitive data, access controls |
| Vendor lock-in | Language-neutral schemas and replaceable adapters in technical architecture |
| Customer interprets score as business quality | Visible non-financial/non-quality disclaimer |

## 17. Open decision register

| ID | Decision still required | Recommended next treatment | Blocking point |
|---|---|---|---|
| `OPEN-001` | Paid-report delivery deadline | Compare service-speed/capacity options in `PS-002` | `MC-003` |
| `OPEN-002` | Refund Policy | Joint Product/Legal options with payment-state triggers | `MC-003` |
| `OPEN-003` | Consultation format, duration, scheduling, no-show | Compare bounded consultation models | `MC-003` |
| `OPEN-004` | Technology stack | Architecture ADRs | `MC-004` |
| `OPEN-005` | Voice/telephony vendor | Voice requirements plus vendor ADR | `MC-004` |
| `OPEN-006` | CRM and email vendor | Lifecycle contract plus vendor ADR | `MC-004` |
| `OPEN-007` | Promotion names, cadence, eligibility, expiration, stacking | Commercial option table in `PS-002` | `MC-003` |
| `OPEN-008` | Implementation packages and prices | Separate-scope package options in `PS-002` | `MC-003` |
| `OPEN-009` | Tested detailed score table | Formal deterministic contract and regression tests | `FA-001` / `G2` |

No item in this table is approved by this document.

## 18. Handoff Summary

- **Task:** `PS-001 — Product Blueprint v0.1`
- **Status:** `APPROVED`
- **Files changed:** Product Blueprint plus Workstream 02 state, task queue, artifact index, handoff, and changelog.
- **Decisions proposed:** None approved here. The blueprint proposes typed evidence states, a role model, quality requirements, metric definitions, and decision-package structure as downstream requirements subject to review.
- **Decisions approved:** Existing `DEC-001`–`DEC-013`, `DEC-015`, and `DEC-016`; `DEC-014` remains superseded.
- **Open questions:** `OPEN-001`–`OPEN-009`, with Product Strategy focus on `OPEN-001`, `OPEN-002`, `OPEN-003`, `OPEN-007`, and `OPEN-008`.
- **Dependencies:** Approved `G0`, Master Brief, Decision Log, recovered free-audit and score drafts, and current legal/data baseline work running separately as `LS-001`.
- **Validation performed:** Approved-constraint trace, free/paid boundary review, bilingual parity review, downstream coverage review, open-decision scan, and Handoff completeness review.
- **Recommended next task:** Execute `PS-002 — Owner Decision Package` from the approved PS-001 and LS-001 inputs; preserve every decision as open until `MC-003`.
