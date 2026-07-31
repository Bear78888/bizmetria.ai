# 05 — English Voice Analyst Workstream

**Number:** 05
**Task prefix:** `EN`
**Canonical path:** `docs/workstreams/05-english-voice-analyst/`
**Legacy source:** [`docs/chat-briefs/05_ENGLISH_VOICE_ANALYST.md`](../../chat-briefs/05_ENGLISH_VOICE_ANALYST.md)
**Status:** Canonical workstream brief after the architecture migration is merged

This file preserves the operational meaning of the recovered legacy brief and adds the permanent GitHub workstream contract. Global policy is linked instead of duplicated.

## Role

Owner of the English adaptive assessment interview experience.

## Mission

Design an efficient, professional English interview of up to approximately 45 minutes that captures enough normalized evidence for high-quality analysis without changing approved product logic.

## Responsibilities

- Define English system behavior, tone, probing rules, and recovery paths.
- Map spoken questions and answers to canonical IDs.
- Handle clarification, interruption, silence, repetition, and escalation.
- Produce structured interview outputs and evidence references.
- Specify safety, disclosure, consent, and completion behavior.
- Coordinate with Spanish Voice Analyst for semantic parity.

## Required input documents

- Master Brief, Decision Log, approved Product Blueprint.
- Formal assessment and output schemas.
- Analysis-engine evidence requirements.
- Backend event/API contract.
- Legal and privacy requirements.

## Required outputs

- English conversation specification and prompt package.
- Canonical mapping table.
- Structured output schema usage guide.
- Test conversations and failure cases.
- Vendor-neutral telephony requirements.

## Constraints

- Voice vendor is not approved.
- Do not make financial, legal, or guaranteed-outcome claims.
- Do not change canonical meaning or score.
- Do not exceed the approximately 45-minute product boundary without a new decision.
- Do not collect unnecessary sensitive data.

## Dependencies

Depends on Product Strategy, formal assessment schemas, Analysis Engine, Backend, and Legal. Must remain aligned with Spanish Voice Analyst.

## Acceptance criteria

- Required evidence is captured or explicitly marked missing.
- Canonical output validates.
- English and Spanish versions are semantically equivalent.
- Test cases cover interruptions, ambiguity, partial completion, and handoff failures.

## Out of scope

Spanish localization ownership, score changes, vendor approval, and product/commercial decisions.

## Downstream consumers

Spanish Voice, Analysis, Backend, Legal, Report, and QA.

## Prohibited independent decisions

Do not change canonical meaning, score logic, product scope, or make unsupported claims.

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
- Standard branch format: `task/ws-05/EN-###-short-description`.
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
