# BizMetria.ai

BizMetria.ai is a cross-industry business assessment platform that identifies practical AI and automation opportunities and turns them into a prioritized implementation roadmap.

## Current confirmed status

- Recovery PR [#1](https://github.com/Bear78888/bizmetria.ai/pull/1) was reviewed and merged.
- `MC-001` architecture PR [#2](https://github.com/Bear78888/bizmetria.ai/pull/2) was independently reviewed and merged.
- Verified current `main` after MC-001: `473ee6c042bd5224bec75dbc18fa803e9b148aa3`.
- The one-Master/13-workstream operating system is now canonical.
- `MC-002` Delivery Roadmap is in review in draft PR [#3](https://github.com/Bear78888/bizmetria.ai/pull/3) from `task/ws-01/MC-002-delivery-roadmap`.
- Product execution has not started. After MC-002 approval, the first execution window is `PS-001` plus `LS-001`.

## Approved product foundation

- Product: **BizMetria Business Assessment** for businesses across industries.
- Price: **$299 one time**, not a subscription.
- Implementation is separate and is not included in $299.
- Launch languages: **English and Spanish**, with one separate telephone number per language and one shared backend.
- Cold traffic starts with the free **AI Opportunity Check**.
- The free result provides limited value and directs the user to the paid assessment.
- Discounts use Stripe Coupons and Promotion Codes from $49 to $199 off; $199 is reserved for late reactivation and is not advertised in advance.
- Every paid MVP report is manually reviewed before delivery.

The complete product baseline and unresolved decisions are in the [Master Brief](docs/BIZMETRIA_MASTER_BRIEF_v1.0.md) and [Decision Log](docs/BIZMETRIA_DECISION_LOG.md).

## Source of Truth

Merged `main` is the only approved repository state. Open branches and PRs are working context, not approved state.

Use this hierarchy:

1. Explicit current user instructions.
2. Actual state of `Bear78888/bizmetria.ai`.
3. Canonical documents merged to `main`.
4. Approved merged deliverables and Decision Log history.
5. Open branches and PRs as unapproved working context.
6. Legacy briefs and recovered drafts as source material only.

## Master Orchestrator control system

- [Control system map](docs/control/README.md)
- [Delivery Roadmap](docs/control/DELIVERY_ROADMAP.md)
- [Master Orchestrator Brief](docs/control/MASTER_ORCHESTRATOR_BRIEF.md)
- [Master Continuation](docs/control/MASTER_CONTINUATION.md)
- [Workstream Registry](docs/control/WORKSTREAM_REGISTRY.md)
- [Active Work](docs/control/ACTIVE_WORK.md)
- [GitHub Safe Operating Policy](docs/control/GITHUB_SAFE_OPERATING_POLICY.md)
- [Backup and Continuity Policy](docs/control/BACKUP_AND_CONTINUITY_POLICY.md)
- [Start a New Master Chat](docs/control/START_NEW_MASTER_CHAT.md)
- [Start a Temporary Workstream Chat](docs/control/START_WORKSTREAM_CHAT.md)
- [MC-001 Migration Report](docs/control/MIGRATION_REPORT.md)

For continuity, begin with [Master Continuation](docs/control/MASTER_CONTINUATION.md); it links to the complete Required Startup Reading.

## Thirteen permanent workstreams

| # | Workstream | Prefix | Operating directory |
|---:|---|---|---|
| 01 | Master Control | `MC` | [`docs/workstreams/01-master-control/`](docs/workstreams/01-master-control/WORKSTREAM_BRIEF.md) |
| 02 | Product Strategy | `PS` | [`docs/workstreams/02-product-strategy/`](docs/workstreams/02-product-strategy/WORKSTREAM_BRIEF.md) |
| 03 | Brand, Website and UX | `UX` | [`docs/workstreams/03-brand-website-ux/`](docs/workstreams/03-brand-website-ux/WORKSTREAM_BRIEF.md) |
| 04 | Free Audit and Lead Scoring | `FA` | [`docs/workstreams/04-free-audit-lead-scoring/`](docs/workstreams/04-free-audit-lead-scoring/WORKSTREAM_BRIEF.md) |
| 05 | English Voice Analyst | `EN` | [`docs/workstreams/05-english-voice-analyst/`](docs/workstreams/05-english-voice-analyst/WORKSTREAM_BRIEF.md) |
| 06 | Spanish Voice Analyst | `ES` | [`docs/workstreams/06-spanish-voice-analyst/`](docs/workstreams/06-spanish-voice-analyst/WORKSTREAM_BRIEF.md) |
| 07 | AI Analysis Engine | `AE` | [`docs/workstreams/07-ai-analysis-engine/`](docs/workstreams/07-ai-analysis-engine/WORKSTREAM_BRIEF.md) |
| 08 | Report and PDF System | `RP` | [`docs/workstreams/08-report-pdf-system/`](docs/workstreams/08-report-pdf-system/WORKSTREAM_BRIEF.md) |
| 09 | Backend, Data and Integrations | `BE` | [`docs/workstreams/09-backend-data-integrations/`](docs/workstreams/09-backend-data-integrations/WORKSTREAM_BRIEF.md) |
| 10 | Payments, CRM and Lifecycle | `LC` | [`docs/workstreams/10-payments-crm-lifecycle/`](docs/workstreams/10-payments-crm-lifecycle/WORKSTREAM_BRIEF.md) |
| 11 | Legal, Privacy and Security | `LS` | [`docs/workstreams/11-legal-privacy-security/`](docs/workstreams/11-legal-privacy-security/WORKSTREAM_BRIEF.md) |
| 12 | Marketing, Content and Sales | `MS` | [`docs/workstreams/12-marketing-content-sales/`](docs/workstreams/12-marketing-content-sales/WORKSTREAM_BRIEF.md) |
| 13 | QA, Analytics and Release | `QA` | [`docs/workstreams/13-qa-analytics-release/`](docs/workstreams/13-qa-analytics-release/WORKSTREAM_BRIEF.md) |

Each directory contains a canonical brief, current state, local task queue, local decisions, artifact index, handoff, changelog, and deliverables policy.

## Task branches

Standard format:

`task/ws-XX/PREFIX-###-short-description`

One task uses one temporary branch and one draft PR. Long-lived workstream branches are prohibited. A remote task branch is the canonical live-lock. Never write directly to `main`, reuse a merged task branch, force push, or self-merge.

The completed fixed MC-001 migration branch was a one-time cross-functional exception.

## Starting work

- New or replacement Master Chat: use [Start a New Master Chat](docs/control/START_NEW_MASTER_CHAT.md).
- Temporary specialist chat: Master Orchestrator fills and issues [Start a Temporary Workstream Chat](docs/control/START_WORKSTREAM_CHAT.md).

No chat writes before verifying current `main`, real branches/PRs, live-lock, required inputs, allowed files, and acceptance criteria.

## Governance documents

- [Master Brief](docs/BIZMETRIA_MASTER_BRIEF_v1.0.md)
- [Coordination Protocol](docs/BIZMETRIA_COORDINATION_PROTOCOL_v1.0.md)
- [GitHub Collaboration Workflow](docs/BIZMETRIA_GITHUB_COLLABORATION_WORKFLOW_v1.0.md)
- [Decision Log](docs/BIZMETRIA_DECISION_LOG.md)
- [Project Status](docs/BIZMETRIA_PROJECT_STATUS.md)
- [Global Task Queue](docs/BIZMETRIA_TASK_QUEUE.md)

## Deliverables and recovered specifications

New deliverables belong in the relevant workstream's `deliverables/` directory and must be indexed in its `ARTIFACT_INDEX.md`. Existing approved/recovered files remain in place until a separate migration task explicitly moves them.

- [Free Audit Questions — Recovered Draft](docs/workstreams/04-free-audit-lead-scoring/BIZMETRIA_FREE_AUDIT_QUESTIONS_RECOVERED_v0.1.md)
- [AI Opportunity Score — Recovered Baseline](docs/workstreams/04-free-audit-lead-scoring/BIZMETRIA_AI_OPPORTUNITY_SCORE_RECOVERED_v0.1.md)
- Product Blueprint v0.1 is not present and must not be reconstructed as a historical original.

## Legacy compatibility

`docs/chat-briefs/` is preserved as legacy source material. Canonical workstream instructions are under `docs/workstreams/*/WORKSTREAM_BRIEF.md`; do not update both paths in parallel. The dated recovery continuation file is historical context, while `docs/control/MASTER_CONTINUATION.md` is the current operational snapshot.

Follow the [GitHub Safe Operating Policy](docs/control/GITHUB_SAFE_OPERATING_POLICY.md) for all automation and the [Backup and Continuity Policy](docs/control/BACKUP_AND_CONTINUITY_POLICY.md) for off-platform resilience.
