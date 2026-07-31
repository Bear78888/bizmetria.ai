# BizMetria Decision Log

Status: **APPROVED / RECOVERED**  
Recovered: 2026-07-30  
Last updated: 2026-07-30

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
| DEC-009 | Paid baseline includes extended questionnaire, adaptive interview up to approximately 45 minutes, personalized analysis, approximately 8–15 recommendations, matrix, roadmap, PDF, manual MVP review, and consultation. | APPROVED / RECOVERED | Exact consultation format unresolved. |
| DEC-010 | Implementation is sold separately. | APPROVED / RECOVERED | It is not included in $299; price unresolved. |
| DEC-011 | Discounts use Stripe Coupons and Promotion Codes. | APPROVED / RECOVERED | Vendor choice applies to discount mechanism only. |
| DEC-012 | Discounts range from $49 to $199 off $299; $199 is late-reactivation-only and is not advertised in advance. | APPROVED / RECOVERED | Final campaign timing and names unresolved. |
| DEC-013 | Every paid report receives manual review during MVP before delivery. | APPROVED / RECOVERED | Review checklist remains to be specified. |
| DEC-014 | Work was recovered as thirteen specialized chats. | SUPERSEDED | Preserved as the legacy operating model; superseded by DEC-016 after MC-001 merged. |
| DEC-015 | GitHub-native handoffs are mandatory. | APPROVED / RECOVERED | Deliverable in file, Handoff Summary, draft PR, no self-merge. |
| DEC-016 | One Master Orchestrator coordinates thirteen permanent GitHub workstream directories; specialized chats are temporary task executors, and permanent workstream branches are prohibited. | APPROVED | Approved through PR [#2](https://github.com/Bear78888/bizmetria.ai/pull/2), merged at `473ee6c042bd5224bec75dbc18fa803e9b148aa3`. |

## Open decision register

| Proposed ID | Question | Owner | Status | Roadmap routing |
|---|---|---|---|---|
| OPEN-001 | What is the final paid-report delivery deadline? | Product Strategy / Operations | OPEN | `PS-002` → `MC-003` |
| OPEN-002 | What is the final Refund Policy? | Legal + Product Strategy | OPEN | `LS-001`, `PS-002` → `MC-003` |
| OPEN-003 | What is the exact consultation format, duration, and scheduling rule? | Product Strategy | OPEN | `PS-002` → `MC-003` |
| OPEN-004 | What technology stack will be used? | Backend, Data and Integrations | OPEN | `BE-001` → `MC-004` |
| OPEN-005 | Which voice/telephony vendor will be used? | Voice + Backend | OPEN | `EN-001`, `BE-001` → `MC-004` |
| OPEN-006 | Which CRM and email vendor will be used? | Payments, CRM and Lifecycle | OPEN | `LC-001`, `BE-001` → `MC-004` |
| OPEN-007 | What are the final promotion names, cadence, eligibility, and expiration rules? | Payments + Marketing | OPEN | `PS-002` → `MC-003`; implementation in `LC-001` |
| OPEN-008 | What are the implementation packages and prices? | Product Strategy | OPEN | `PS-002` → `MC-003` |
| OPEN-009 | What tested detailed point table replaces or approves the recovered score baseline? | Free Audit and Lead Scoring | OPEN | `FA-001` → `G2` |

## Change rule

New decisions require a proposed entry, evidence or rationale, affected-workstream review, and Master Control/owner approval. Until merged as approved, they remain proposals. The [Delivery Roadmap](control/DELIVERY_ROADMAP.md) routes open questions but does not approve their answers.
