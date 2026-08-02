# BizMetria Decision Log

Status: **APPROVED / RECOVERED**  
Recovered: 2026-07-30  
Last updated: 2026-08-01

This log records approved decisions recoverable from the available project context and later owner-approved governance changes. It does not claim to reproduce the exact wording of unavailable historical repository content.

| ID | Decision | Status | Notes |
|---|---|---|---|
| DEC-001 | The brand is `BizMetria.ai`. | APPROVED / RECOVERED | Canonical project name. |
| DEC-002 | BizMetria serves a broad, cross-industry business audience. | APPROVED / RECOVERED | Industry can shape recommendations but not the score. |
| DEC-003 | Launch languages are English and Spanish. | APPROVED / RECOVERED | Both are first-class customer experiences. |
| DEC-004 | English and Spanish use separate telephone numbers. | APPROVED / RECOVERED | Both connect to one shared backend. |
| DEC-005 | BizMetria Business Assessment costs $299 one time and is not a subscription. | APPROVED / RECOVERED | Implementation excluded. |
| DEC-006 | The free AI Opportunity Check is the primary cold-traffic funnel. | APPROVED / RECOVERED | Free result is deliberately limited and converts to paid assessment. |
| DEC-007 | The free audit uses 11 questions plus a contact form. | APPROVED / RECOVERED | Separate email and optional SMS consent. |
| DEC-008 | AI Opportunity Score is 0–100 across five blocks: 30/25/20/15/10. | APPROVED / RECOVERED | Deterministic; not a financial or business-quality score. |
| DEC-009 | Paid baseline includes extended questionnaire, adaptive interview up to approximately 45 minutes, personalized analysis, approximately 8–15 recommendations, matrix, roadmap, PDF, manual MVP review, and consultation. | APPROVED / RECOVERED | Consultation format is resolved by DEC-019. |
| DEC-010 | Implementation is sold separately. | APPROVED / RECOVERED | It is not included in $299; package pricing is resolved by DEC-021. |
| DEC-011 | Discounts use Stripe Coupons and Promotion Codes. | APPROVED / RECOVERED | Discount mechanism baseline; payment-processor approval is recorded separately in DEC-026. |
| DEC-012 | Discounts range from $49 to $199 off $299; $199 is late-reactivation-only and is not advertised in advance. | APPROVED / RECOVERED | Operating cadence and eligibility are resolved by DEC-020; campaign creative names remain downstream and must stay within that contract. |
| DEC-013 | Every paid report receives manual review during MVP before delivery. | APPROVED / RECOVERED | Review checklist remains to be specified. |
| DEC-014 | Work was recovered as thirteen specialized chats. | SUPERSEDED | Preserved as the legacy operating model; superseded by DEC-016 after MC-001 merged. |
| DEC-015 | GitHub-native handoffs are mandatory. | APPROVED / RECOVERED | Deliverable in file, Handoff Summary, draft PR, no self-merge. |
| DEC-016 | One Master Orchestrator coordinates thirteen permanent GitHub workstream directories; specialized chats are temporary task executors, and permanent workstream branches are prohibited. | APPROVED | Approved through PR [#2](https://github.com/Bear78888/bizmetria.ai/pull/2), merged at `473ee6c042bd5224bec75dbc18fa803e9b148aa3`. |
| DEC-017 | A paid report is due within five U.S. business days after all required customer inputs are complete. | APPROVED | Uses `America/Los_Angeles` and the U.S. federal-holiday calendar; approved as `D01-B` through MC-003. |
| DEC-018 | Refund handling uses the stage-based `D02-A` model. | APPROVED WITH PRE-LAUNCH LEGAL DEPENDENCY | Full refund before `FULFILLMENT_STARTED`; later remedies depend on service state, BizMetria fault, mandatory rights, and qualified counsel-approved public wording. |
| DEC-019 | One bounded 30-minute results consultation is included with each delivered paid assessment. | APPROVED | Booking, rescheduling, no-show, scope, and timing rules follow `D03-A`; the provider and available hours must be assigned before real paid fulfillment. |
| DEC-020 | Promotions use the controlled lifecycle ladder in `D04-B`. | APPROVED | One promotion per order, no stacking, private late-reactivation `$199` offer, server-side eligibility, expiration, caps, attribution, and stop rules. |
| DEC-021 | Implementation is sold separately as `$1,500` Starter, `$4,500` Operations Sprint, and custom work starting at `$9,500`. | APPROVED | Exact scope, readiness, payment milestones, third-party fees, change control, and separate agreement follow `D05-B`. |
| DEC-022 | MVP performance is governed by the balanced KPI and hard-guardrail set in `D06-B`. | APPROVED | Sample-size labels apply; quality, consent, payment integrity, traceability, human review, and P0/P1 rules override conversion targets. |
| DEC-023 | Initial paid-assessment capacity is six new orders per rolling seven days, increasing to eight only after the approved evidence threshold. | APPROVED | Two-per-day, review-queue, active-fulfillment, campaign-pause, and stop rules follow `D07-B`; staffing must be assigned before real orders. |
| DEC-024 | BizMetria's intended paid-service geography is all 50 U.S. states and the District of Columbia. | APPROVED WITH PRE-LAUNCH LEGAL/TAX DEPENDENCY | Approved as `D08-A`; live checkout and advertising remain disabled until qualified legal and tax review confirms the required nationwide controls. No international paid launch is approved. |
| DEC-025 | Account holders and purchasers must be authorized business representatives aged 18 or older. | APPROVED WITH PRE-LAUNCH LEGAL DEPENDENCY | Approved as `D09-A`; final Terms, privacy handling, representations, and enforcement require qualified counsel review before live use. |
| DEC-026 | Stripe is the approved processor for BizMetria's real one-time payments and promotion-code checkout. | APPROVED | Build test/live separation, webhook verification, idempotency, refunds, receipts, and externalized secrets now; add account identifiers and live keys only during the final protected activation step. No Stripe secret may be committed to GitHub. |
| DEC-027 | Claude (Anthropic) is the analysis provider for the paid Business Assessment; OpenAI is withdrawn from the project. | APPROVED | Owner decision, 2026-08-01. `OPENAI_API_KEY` is removed from the environment contract and replaced by `ANTHROPIC_API_KEY`. The free AI Opportunity Check stays deterministic and model-free. Implementation and the offline fallback provider are documented in [`docs/architecture/analysis-provider.md`](architecture/analysis-provider.md). |
| DEC-028 | BizMetria uses its own Stripe account, separate from any other business the owner operates. | APPROVED | Owner created `acct_1TzfDfReWI4VeYwH` on 2026-08-01. Stripe requires separate accounts for independently operating businesses; sharing one would put BizMetria charges under another business's statement descriptor and tax identity. Test catalog: [`ops/stripe/test-catalog.md`](../ops/stripe/test-catalog.md). Live activation remains gated by DEC-026. |
| DEC-029 | The public site runs on `bizmetria.com` during the test phase; `bizmetria.ai` is deferred, not dropped. | APPROVED | Owner decision, 2026-08-01. Aligns the site origin with the `noreply@bizmetria.com` sender domain, which mailbox providers weigh in deliverability. `CANONICAL_SITE_URL` is a single constant, so adopting `.ai` later is one line plus DNS — cheap while the site has no search presence. |
| DEC-030 | Customer cabinet with a soft gate: the free 0–100 score shows immediately (the "no email wall" promise holds); the detailed breakdown, mini-report PDF and email delivery require creating an account. | APPROVED | Owner decision, 2026-08-02. First registration touchpoint; the cabinet becomes the product hub (journey stepper, documents, 30-day plan, solutions). |
| DEC-031 | Post-report implementation upsells come from a curated, owner-priced catalog (docs/BIZMETRIA_SOLUTIONS_CATALOG.md); AI matches recommendations to catalog items but never invents scope or price. One-click purchase; calls optional, never mandatory; report stays useful without buying. | APPROVED IN PRINCIPLE | Owner concept 2026-08-02; catalog draft v0.1 awaits owner sign-off on items and prices before customer exposure. |
| DEC-032 | The paid report's plan becomes a 30-Day Implementation Sprint (weeks 1–4 with a cabinet tracker), replacing the 30–90 day roadmap. Plan promises a sequence, not guaranteed business outcomes. | APPROVED | Owner decision, 2026-08-02. Requires updating the analysis prompt/contract copy, report template and homepage sample page. |
| DEC-033 | Transactional email delivery switches on (RESEND_DELIVERY_MODE=send) as part of cabinet Phase 1: free-score mini-report email first; strictly transactional, no marketing sends. | APPROVED | Owner decision, 2026-08-02. Resend domain records for bizmetria.com already verified in DNS. |

## Open decision register

| Proposed ID | Question | Owner | Status | Roadmap routing |
|---|---|---|---|---|
| OPEN-001 | What is the final paid-report delivery deadline? | Product Strategy / Operations | CLOSED | DEC-017; `D01-B` approved through `MC-003`. |
| OPEN-002 | What is the final Refund Policy? | Legal + Product Strategy | CLOSED FOR PRODUCT CONTRACT / LEGAL TEXT DEFERRED | DEC-018; `D02-A` approved. Qualified counsel must approve customer-facing text before live payment. |
| OPEN-003 | What is the exact consultation format, duration, and scheduling rule? | Product Strategy | CLOSED | DEC-019; `D03-A` approved. Provider assignment remains a pre-live operations dependency. |
| OPEN-004 | What technology stack will be used? | Backend, Data and Integrations | OPEN | `BE-001` → `MC-004` |
| OPEN-005 | Which voice/telephony vendor will be used? | Voice + Backend | OPEN | `EN-001`, `BE-001` → `MC-004` |
| OPEN-006 | Which CRM and email vendor will be used? | Payments, CRM and Lifecycle | OPEN | `LC-001`, `BE-001` → `MC-004` |
| OPEN-007 | What are the final promotion names, cadence, eligibility, and expiration rules? | Payments + Marketing | CLOSED FOR CONTRACT | DEC-020; `D04-B` approved, with exact implementation in `LC-001`. |
| OPEN-008 | What are the implementation packages and prices? | Product Strategy | CLOSED | DEC-021; `D05-B` approved through `MC-003`. |
| OPEN-009 | What tested detailed point table replaces or approves the recovered score baseline? | Free Audit and Lead Scoring | CLOSED | `ai-opportunity-score/1.0.0` approved through FA-001, PR [#12](https://github.com/Bear78888/bizmetria.ai/pull/12), merge SHA `97446522cf9eba8e63fe1b1887439fb77adabf5f`. |

## Change rule

New decisions require a proposed entry, evidence or rationale, affected-workstream review, and Master Control/owner approval. Until merged as approved, they remain proposals. The [Delivery Roadmap](control/DELIVERY_ROADMAP.md) routes open questions but does not approve their answers.
