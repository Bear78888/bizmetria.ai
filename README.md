# BizMetria.ai

BizMetria.ai is a cross-industry business assessment platform that identifies practical AI and automation opportunities and turns them into a prioritized implementation roadmap.

## Approved product foundation

- Brand: **BizMetria.ai**
- Primary product: **BizMetria Business Assessment**
- Price: **$299 one time**; this is not a subscription.
- Implementation is not included in the $299 assessment and is sold separately.
- Launch languages: **English and Spanish**.
- English and Spanish use separate telephone numbers, one for each language.
- Both language experiences share one backend for CRM, payments, analysis, reports, and administration.
- The cold-traffic journey starts with a free **AI Opportunity Check**.
- The free result reveals limited, useful information and directs the user to the full assessment.
- An email sequence follows the free audit.
- Discounts use Stripe Coupons and Promotion Codes. Allowed discount amounts are $49–$199 off $299; the $199 discount is reserved for late reactivation and is not advertised in advance.
- Every paid report is manually reviewed before delivery during MVP.
- English and Spanish versions use the same canonical IDs and output schemas.

The approved paid-assessment baseline includes an extended questionnaire, an adaptive AI interview of up to approximately 45 minutes, personalized analysis, approximately 8–15 recommendations, an Impact vs. Effort Matrix, a 30–90 day roadmap, a professional PDF report, MVP manual review, and a results consultation.

The report delivery deadline, final refund policy, exact consultation format, technology stack, telephony vendor, CRM/email vendor, final promotion names and timing, and implementation pricing remain open decisions.

## Documentation

### Governance and continuity

- [Master Brief](docs/BIZMETRIA_MASTER_BRIEF_v1.0.md)
- [Coordination Protocol](docs/BIZMETRIA_COORDINATION_PROTOCOL_v1.0.md)
- [GitHub Collaboration Workflow](docs/BIZMETRIA_GITHUB_COLLABORATION_WORKFLOW_v1.0.md)
- [Decision Log](docs/BIZMETRIA_DECISION_LOG.md)
- [Project Status](docs/BIZMETRIA_PROJECT_STATUS.md)
- [Task Queue](docs/BIZMETRIA_TASK_QUEUE.md)
- [Chat Startup Instructions](docs/CHAT_STARTUP_INSTRUCTIONS.md)
- [Continuation Context — 2026-07-30](docs/BIZMETRIA_CHAT_CONTINUATION_CONTEXT_2026-07-30.md)

### Recovered specifications

- [Free Audit Questions — RECOVERED DRAFT](docs/workstreams/04-free-audit-lead-scoring/BIZMETRIA_FREE_AUDIT_QUESTIONS_RECOVERED_v0.1.md)
- [AI Opportunity Score — RECOVERED DRAFT](docs/workstreams/04-free-audit-lead-scoring/BIZMETRIA_AI_OPPORTUNITY_SCORE_RECOVERED_v0.1.md)
- Product Blueprint v0.1: pending exact re-creation under `TASK-001`; no substitute has been presented as approved.

## Thirteen working chats

1. [Master Control](docs/chat-briefs/01_MASTER_CONTROL.md)
2. [Product Strategy](docs/chat-briefs/02_PRODUCT_STRATEGY.md)
3. [Brand, Website and UX](docs/chat-briefs/03_BRAND_WEBSITE_UX.md)
4. [Free Audit and Lead Scoring](docs/chat-briefs/04_FREE_AUDIT_LEAD_SCORING.md)
5. [English Voice Analyst](docs/chat-briefs/05_ENGLISH_VOICE_ANALYST.md)
6. [Spanish Voice Analyst](docs/chat-briefs/06_SPANISH_VOICE_ANALYST.md)
7. [AI Analysis Engine](docs/chat-briefs/07_AI_ANALYSIS_ENGINE.md)
8. [Report and PDF System](docs/chat-briefs/08_REPORT_PDF_SYSTEM.md)
9. [Backend, Data and Integrations](docs/chat-briefs/09_BACKEND_DATA_INTEGRATIONS.md)
10. [Payments, CRM and Lifecycle](docs/chat-briefs/10_PAYMENTS_CRM_LIFECYCLE.md)
11. [Legal, Privacy and Security](docs/chat-briefs/11_LEGAL_PRIVACY_SECURITY.md)
12. [Marketing, Content and Sales](docs/chat-briefs/12_MARKETING_CONTENT_SALES.md)
13. [QA, Analytics and Release](docs/chat-briefs/13_QA_ANALYTICS_RELEASE.md)

## Starting a new working chat

1. Open [Chat Startup Instructions](docs/CHAT_STARTUP_INSTRUCTIONS.md).
2. Give the new chat its matching brief from `docs/chat-briefs/`.
3. Instruct it to read the latest `main`, the Master Brief, Decision Log, Project Status, Task Queue, GitHub workflow, and its assigned brief.
4. Assign only the relevant queued task.
5. Require the full result and a Handoff Summary in the target file, a feature branch, and a draft PR.
6. Do not allow a specialized chat to merge its own PR.

## GitHub-native workflow

Specialized chats read current `main`, take one assigned task from the Task Queue, create a feature branch, store the complete result in GitHub, include a Handoff Summary, and open a draft PR. They report only the PR number, branch, paths, status, and blockers. Master Control reviews the diff, requests corrections or merges it, and after approval updates the Decision Log, Project Status, Task Queue, and the next dependent assignment.

Batch related files into one commit or the minimum practical number of commits. Maintain an external mirror and periodic Git bundle backup so that GitHub access loss does not destroy project continuity.
