# 07 — AI Analysis Engine Workstream

**Number:** 07
**Task prefix:** `AE`
**Canonical path:** `docs/workstreams/07-ai-analysis-engine/`
**Legacy source:** [`docs/chat-briefs/07_AI_ANALYSIS_ENGINE.md`](../../chat-briefs/07_AI_ANALYSIS_ENGINE.md)
**Status:** Canonical workstream brief after the architecture migration is merged

This file preserves the operational meaning of the recovered legacy brief and adds the permanent GitHub workstream contract. Global policy is linked instead of duplicated.

## Role

Owner of normalized assessment interpretation, recommendation generation, prioritization, and evidence traceability.

## Mission

Convert structured questionnaire and interview evidence into a consistent, auditable business analysis with approximately 8–15 useful recommendations, an Impact vs. Effort Matrix, and a 30–90 day roadmap.

## Responsibilities

- Define normalized input and output contracts.
- Separate evidence, inference, uncertainty, and recommendation.
- Specify recommendation selection, deduplication, prioritization, and confidence.
- Prevent unsupported financial-loss claims.
- Produce report-ready structured data.
- Support human review and revision during MVP.
- Maintain language-neutral canonical outputs.

## Required input documents

- Master Brief, Decision Log, approved Product Blueprint.
- Formal audit/interview schemas.
- Report schema and editorial rules.
- Backend orchestration contract.
- Legal, security, and QA requirements.

## Required outputs

- Analysis pipeline specification.
- Recommendation and roadmap schemas.
- Impact/Effort rules.
- Evidence and uncertainty model.
- Evaluation dataset, rubrics, and failure cases.
- Human-review handoff contract.

## Constraints

- Technology/model stack is not approved.
- Do not present estimates as verified facts.
- Do not generate exact financial losses without sufficient customer data and approved methodology.
- Preserve 8–15 recommendation target approximately, not as a forced count.
- Do not bypass MVP manual review.

## Dependencies

Depends on Product Strategy, audit/voice schemas, and Legal. Supplies structured output to Report/PDF, Backend, and QA.

## Acceptance criteria

- Every material claim traces to evidence or is labeled as inference.
- Output validates against schema.
- Recommendations are non-duplicative, prioritized, and actionable at the appropriate level.
- English/Spanish inputs with equivalent canonical evidence produce equivalent analysis objects.
- Human reviewers can approve, edit, or reject items.

## Out of scope

Final PDF rendering, customer-facing policy approval, vendor selection, and bypassing review.

## Downstream consumers

Report/PDF, Backend, Legal, Marketing, and QA.

## Prohibited independent decisions

Do not fabricate financial losses, force unsupported claims, or bypass MVP manual review.

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
- Standard branch format: `task/ws-07/AE-###-short-description`.
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
