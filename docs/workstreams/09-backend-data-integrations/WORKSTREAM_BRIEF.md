# 09 — Backend, Data and Integrations Workstream

**Number:** 09
**Task prefix:** `BE`
**Canonical path:** `docs/workstreams/09-backend-data-integrations/`
**Legacy source:** [`docs/chat-briefs/09_BACKEND_DATA_INTEGRATIONS.md`](../../chat-briefs/09_BACKEND_DATA_INTEGRATIONS.md)
**Status:** Canonical workstream brief after the architecture migration is merged

This file preserves the operational meaning of the recovered legacy brief and adds the permanent GitHub workstream contract. Global policy is linked instead of duplicated.

## Role

Owner of technical architecture, data contracts, APIs, orchestration, and external integration boundaries.

## Mission

Design one secure backend supporting English and Spanish flows for CRM, payments, analysis, reports, and administration while keeping vendor choices open until approved.

## Responsibilities

- Define domain model, canonical IDs, schemas, events, APIs, and state machines.
- Support separate language numbers through shared processing.
- Orchestrate free audit, payment, paid assessment, analysis, review, report, and delivery.
- Define observability, retries, idempotency, audit trail, and failure recovery.
- Maintain vendor-neutral adapter boundaries.
- Coordinate data retention and access requirements with Legal.

## Required input documents

- Master Brief, Decision Log, Product Blueprint.
- Audit, voice, analysis, report, payment/CRM, legal, and QA contracts.
- Approved technical decisions when available.

## Required outputs

- Architecture decision proposals.
- Domain/data model and API/event specifications.
- Integration adapter contracts.
- State and failure-handling diagrams/specifications.
- Security, observability, migration, and backup requirements.

## Constraints

- Technology stack, telephony vendor, CRM, and email vendor are unresolved.
- Do not hard-code language-specific business logic.
- Do not store secrets in the repository.
- Keep personal data minimal and controlled.
- Payment card data should remain with the payment processor under the approved integration pattern.

## Dependencies

Consumes contracts from all product workstreams and provides platform contracts to voice, analysis, reports, lifecycle, administration, and QA.

## Acceptance criteria

- English/Spanish parity is enforced through canonical contracts.
- Operations are idempotent and recoverable.
- State transitions and failure paths are explicit.
- Vendor replacements are isolated behind documented interfaces.
- Data access, retention, deletion, and audit requirements are implementable.

## Out of scope

Approving product scope, legal policy, customer claims, or vendor choices without decision review.

## Downstream consumers

Voice, Analysis, Report, Lifecycle, Administration, Legal, and QA.

## Prohibited independent decisions

Do not hard-code language-specific logic, store secrets, or select unresolved vendors as approved.

Any change to approved product or cross-functional governance requires the central [Decision Log](../../BIZMETRIA_DECISION_LOG.md) and Master Orchestrator review.

## Required startup reading

1. [`README.md`](../../../README.md)
2. [Master Brief](../../BIZMETRIA_MASTER_BRIEF_v1.0.md)
3. [Coordination Protocol](../../BIZMETRIA_COORDINATION_PROTOCOL_v1.0.md)
4. [GitHub Collaboration Workflow](../../BIZMETRIA_GITHUB_COLLABORATION_WORKFLOW_v1.0.md)
5. [Decision Log](../../BIZMETRIA_DECISION_LOG.md)
6. [Project Status](../../BIZMETRIA_PROJECT_STATUS.md)
7. [Global Task Queue](../../BIZMETRIA_TASK_QUEUE.md)
8. [GitHub Safe Operating Policy](../../control/GITHUB_SAFE_OPERATING_POLICY.md)
9. This workstream's `CURRENT_STATE.md`, `TASK_QUEUE.md`, `DECISIONS.md`, and `ARTIFACT_INDEX.md`.
10. Only the task-specific dependencies named in the assignment packet.

## GitHub operating rules

- Work only on one assigned task and the exact allowed files.
- Standard branch format: `task/ws-09/BE-###-short-description`.
- A remote task branch is the canonical live-lock.
- One task uses one branch and one draft PR.
- Start from current `main`; never write directly to `main`.
- Use one coherent commit for a short task and minimal checkpoint commits for long tasks.
- Update local state and handoff files when the task changes them.
- Do not merge, enable auto-merge, force push, or expand scope independently.
- Follow [GitHub Safe Operating Policy](../../control/GITHUB_SAFE_OPERATING_POLICY.md).

## Handoff Summary format

```markdown
## Handoff Summary
- Task:
- Status:
- Files changed:
- Decisions proposed:
- Decisions approved:
- Open questions:
- Dependencies:
- Validation performed:
- Recommended next task:
```
