# BizMetria Master Brief v1.0

Status: **APPROVED / RECOVERED**  
Recovery date: 2026-07-30  
Canonical repository: `Bear78888/bizmetria.ai`

## Purpose

This document is the canonical recovered product and operating baseline for BizMetria.ai. It distinguishes approved decisions from recovered drafts and unresolved questions. Specialized workstreams may elaborate the baseline but may not silently change it.

## Product definition

BizMetria.ai serves businesses across industries. Its primary product, **BizMetria Business Assessment**, examines operations, customer handling, systems, data, and automation opportunities and returns a prioritized action plan.

The paid assessment costs **$299 one time** and is not a subscription. Implementation is a separate offer and is not included in the $299 price.

## Launch model

- Customer languages: English and Spanish.
- Telephony: one English number and one Spanish number.
- Backend: shared CRM, payment, analysis, reporting, and administration services.
- Localization contract: both language versions use identical canonical question IDs, answer IDs, event names, score fields, and output schemas.
- Language-specific copy may differ while business logic remains equivalent.

## Customer journey

1. Cold traffic reaches the free **AI Opportunity Check**.
2. The user completes 11 questions and a contact form.
3. A deterministic AI Opportunity Score from 0–100 is produced.
4. The free result shows the score, a non-financial disclaimer, one general observation, no more than three opportunity areas, locked full-report sections, and the $299 full-assessment offer.
5. An email follow-up sequence begins only under the applicable consent and lifecycle rules.
6. The customer may purchase the full assessment for $299 or use an eligible Stripe Promotion Code.
7. The customer completes the extended questionnaire and an adaptive AI interview of up to approximately 45 minutes.
8. The analysis engine prepares approximately 8–15 recommendations, an Impact vs. Effort Matrix, and a 30–90 day roadmap.
9. During MVP, a human reviewer checks every paid report before delivery.
10. The customer receives a professional PDF and a consultation in a format still to be approved.
11. Implementation may be offered and priced separately.

## Paid assessment: approved baseline

- Extended questionnaire.
- Adaptive AI interview, up to approximately 45 minutes.
- Personalized business analysis.
- Approximately 8–15 recommendations.
- Impact vs. Effort Matrix.
- 30–90 day roadmap.
- Professional PDF report.
- Manual review for every report during MVP.
- Results consultation.

## Free assessment boundaries

The free result may show:

- AI Opportunity Score.
- A statement that the score is not a financial valuation.
- One general observation.
- Up to three detected opportunity areas.
- Locked previews of full-report sections.
- An offer for the $299 BizMetria Business Assessment.

The free result must not disclose:

- The full problem inventory.
- A specific solution architecture.
- A complete vendor or service list.
- Precise financial-loss claims unsupported by customer data.
- Ready-to-execute implementation instructions.
- The full roadmap.
- A PDF report.
- A consultation.

## Score baseline

The AI Opportunity Score has five blocks:

| Block | Maximum |
|---|---:|
| Lead Response and Follow-Up | 30 |
| Manual Work | 25 |
| Systems and Data | 20 |
| Strategic Priority and Urgency | 15 |
| Opportunity Breadth | 10 |
| **Total** | **100** |

Industry, name, email, phone, preferred language, and promotion code do not affect the score. The score is neither a financial valuation nor an assessment of business quality. Identical canonical answers must produce identical results; randomness is prohibited.

## Commercial baseline

- List price: $299 one time.
- Billing model: no subscription for the assessment.
- Discounts: Stripe Coupons and Promotion Codes.
- Allowed discount amounts: $49–$199 off the $299 price.
- The $199 discount is reserved for late reactivation and must not be promoted in advance.
- Implementation: excluded from the assessment and priced separately.

## Operating architecture

The project uses one **Master Orchestrator** and thirteen permanent GitHub-backed workstreams. Each workstream keeps its canonical brief, current state, local task queue, local decisions, artifact index, handoff, changelog, and deliverables policy under `docs/workstreams/`.

Specialized chats are temporary executors for one bounded task. They use one temporary task branch and one draft PR, may modify only the assigned files, and may not merge their own work. Long-lived workstream branches are prohibited. `main` remains the only approved repository state.

Global orchestration is defined in [`docs/control/`](control/README.md). The recovered files in `docs/chat-briefs/` are preserved as legacy source material and are not parallel canonical workstream instructions.

## Open decisions

The following are explicitly unresolved:

- Final paid-report delivery deadline.
- Final Refund Policy.
- Exact consultation format and duration.
- Technology stack.
- Voice/telephony vendor.
- CRM and email vendor.
- Final promotion names, eligibility, cadence, and expiration.
- Implementation packages and prices.
- Final tested point table for the AI Opportunity Score.

## Authority order

When documents conflict, use this order:

1. Latest approved Decision Log entries.
2. Master Brief.
3. Approved task deliverables merged to `main`.
4. Project Status and Task Queue.
5. Recovered drafts.
6. Chat discussion that has not been recorded in GitHub.

## Change control

Any change to approved product foundations requires a proposed Decision Log entry and Master Control approval. A specialized workstream may recommend a change but may not present it as approved before merge.
