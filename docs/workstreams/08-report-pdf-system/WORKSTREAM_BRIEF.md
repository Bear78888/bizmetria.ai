# 08 — Report and PDF System Workstream

**Number:** 08
**Task prefix:** `RP`
**Canonical path:** `docs/workstreams/08-report-pdf-system/`
**Legacy source:** [`docs/chat-briefs/08_REPORT_PDF_SYSTEM.md`](../../chat-briefs/08_REPORT_PDF_SYSTEM.md)
**Status:** Canonical workstream brief after the architecture migration is merged

This file preserves the operational meaning of the recovered legacy brief and adds the permanent GitHub workstream contract. Global policy is linked instead of duplicated.

## Role

Owner of report information architecture, editorial quality, rendering, and delivery-ready PDF requirements.

## Mission

Transform approved structured analysis into a professional, readable bilingual report that communicates priorities, recommendations, an Impact vs. Effort Matrix, and a 30–90 day roadmap.

## Responsibilities

- Define report sections and structured content contract.
- Specify hierarchy, charts/tables, page behavior, and accessibility.
- Define English/Spanish rendering and overflow rules.
- Establish editorial and manual-review checklists.
- Specify versioning, approval, correction, and final-delivery states.
- Prevent unsupported or inconsistent claims from reaching the customer.

## Required input documents

- Master Brief, Decision Log, Product Blueprint.
- Analysis-engine output schema.
- Brand/UX system.
- Legal disclaimers and data restrictions.
- Backend delivery and QA requirements.

## Required outputs

- Report content schema and template specification.
- PDF rendering requirements.
- Manual-review checklist.
- Sample fixtures for English and Spanish.
- Error, revision, and delivery-state handling.

## Constraints

- A professional PDF is paid-only.
- Every MVP report requires human review before delivery.
- Report deadline and exact consultation format are unresolved.
- No unsupported financial estimates or guaranteed outcomes.
- Technology and rendering vendor are not approved.

## Dependencies

Depends on Analysis Engine, Brand/UX, Legal, and Backend. Supplies testable artifacts and requirements to QA and customer lifecycle.

## Acceptance criteria

- All required paid components are represented.
- Long content, missing data, tables, and bilingual variants render correctly.
- Human approval is a mandatory state.
- Claims are traceable and disclaimers are present.
- PDF version and source analysis version can be audited.

## Out of scope

Analysis generation, pricing changes, vendor approval, and removal of manual review.

## Downstream consumers

Backend, Lifecycle, Legal, Marketing, and QA.

## Prohibited independent decisions

Do not publish paid reports without review or include unsupported/guaranteed claims.

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
- Standard branch format: `task/ws-08/RP-###-short-description`.
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
