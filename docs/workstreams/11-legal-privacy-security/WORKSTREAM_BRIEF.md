# 11 — Legal, Privacy and Security Workstream

**Number:** 11
**Task prefix:** `LS`
**Canonical path:** `docs/workstreams/11-legal-privacy-security/`
**Legacy source:** [`docs/chat-briefs/11_LEGAL_PRIVACY_SECURITY.md`](../../chat-briefs/11_LEGAL_PRIVACY_SECURITY.md)
**Status:** Canonical workstream brief after the architecture migration is merged

This file preserves the operational meaning of the recovered legacy brief and adds the permanent GitHub workstream contract. Global policy is linked instead of duplicated.

## Role

Owner of legal issue-spotting, privacy requirements, consent, security baseline, and policy dependencies.

## Mission

Define implementable safeguards and disclosures for the bilingual assessment journey without presenting unresolved policy choices as legal conclusions.

## Responsibilities

- Inventory collected, generated, shared, retained, and deleted data.
- Define email and optional SMS consent requirements.
- Identify privacy notice, terms, disclaimer, and Refund Policy requirements.
- Define role-based access, audit, incident, retention, and deletion baselines.
- Review score, report, marketing, and consultation claims.
- Coordinate vendor/data-processing requirements.
- Escalate jurisdiction-specific questions for qualified legal review.

## Required input documents

- Master Brief, Decision Log, Product Blueprint/customer journey.
- Free audit, voice, analysis, report, backend, payment/lifecycle, marketing, and QA specifications.

## Required outputs

- Legal and Data Inventory Baseline.
- Consent and notice requirements.
- Security and access-control baseline.
- Policy issue register and review checklist.
- Vendor due-diligence/data-processing requirements.

## Constraints

- Final Refund Policy is unresolved.
- Do not claim the score is a financial valuation or business-quality rating.
- Do not approve unsupported guarantees or loss estimates.
- Minimize sensitive and personal data.
- Do not store secrets or production personal data in GitHub.
- Legal issue-spotting is not a substitute for qualified counsel where required.

## Dependencies

Consumes the full customer/data journey and constrains UX, voice, backend, lifecycle, reports, marketing, and release.

## Acceptance criteria

- Every data field has purpose, source, access, retention, and deletion treatment.
- Email and SMS permissions are separate.
- User-facing claims and disclaimers are mapped to surfaces.
- High-risk unknowns and required professional review are explicit.
- Security controls are testable.

## Out of scope

Providing final legal advice, approving commercial policy alone, or implementing other workstreams.

## Downstream consumers

Every customer-facing and implementation workstream.

## Prohibited independent decisions

Do not present issue spotting as counsel, approve unsupported claims, or store sensitive data.

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
- Standard branch format: `task/ws-11/LS-###-short-description`.
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
