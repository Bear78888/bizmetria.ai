# 04 — Free Audit and Lead Scoring Workstream

**Number:** 04
**Task prefix:** `FA`
**Canonical path:** `docs/workstreams/04-free-audit-lead-scoring/`
**Legacy source:** [`docs/chat-briefs/04_FREE_AUDIT_LEAD_SCORING.md`](../../chat-briefs/04_FREE_AUDIT_LEAD_SCORING.md)
**Status:** Canonical workstream brief after the architecture migration is merged

This file preserves the operational meaning of the recovered legacy brief and adds the permanent GitHub workstream contract. Global policy is linked instead of duplicated.

## Role

Owner of the free AI Opportunity Check, deterministic scoring model, and free-result selection boundary.

## Mission

Formalize a bilingual, deterministic 11-question assessment that gives limited value, accurately calculates a 0–100 opportunity score, and converts qualified users to the $299 full assessment.

## Responsibilities

- Define canonical question and answer IDs.
- Maintain English/Spanish semantic parity.
- Specify validation, conditional behavior, and contact consent fields.
- Test the five-block scoring algorithm and score bands.
- Define how one observation and up to three opportunity areas are selected.
- Define locked paid sections and disclaimers.
- Protect the free/paid information boundary.

## Required input documents

- Master Brief, Decision Log, Product Blueprint, Task Queue.
- Recovered free-audit questions and score documents.
- UX, legal, analytics, and backend requirements when available.

## Required outputs

- Formal canonical question schema.
- Tested deterministic score specification.
- Free-result selection rules.
- Boundary, parity, and regression test vectors.
- Handoff contracts for UX, backend, analysis, marketing, and QA.

## Constraints

- Exactly 11 approved question topics plus contact form unless a new decision is approved.
- Five maxima remain 30/25/20/15/10.
- Industry, contact data, language, and promotion code do not affect score.
- No randomness.
- Score is not financial valuation or business-quality judgment.
- Free result cannot include full analysis, architecture, services, unsupported losses, instructions, roadmap, PDF, or consultation.

## Dependencies

Depends on Product Strategy and Legal. Supplies canonical schemas to voice, analysis, backend, UX, lifecycle, and QA.

## Acceptance criteria

- Identical canonical inputs always produce identical output.
- Minimum, maximum, boundary, missing-data, and bilingual-equivalence tests pass.
- Score always remains 0–100 and block caps cannot be exceeded.
- Free result displays no more than three areas and always includes the $299 offer/disclaimer.

## Out of scope

Product pricing changes, non-deterministic scoring, vendor selection, and paid report architecture.

## Downstream consumers

UX, Voice, Analysis, Backend, Lifecycle, Marketing, Legal, and QA.

## Prohibited independent decisions

Do not change 30/25/20/15/10 maxima or let industry, contacts, language, or promotions affect score.

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
- Standard branch format: `task/ws-04/FA-###-short-description`.
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
