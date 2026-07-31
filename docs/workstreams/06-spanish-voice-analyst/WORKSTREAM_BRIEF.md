# 06 — Spanish Voice Analyst Workstream

**Number:** 06
**Task prefix:** `ES`
**Canonical path:** `docs/workstreams/06-spanish-voice-analyst/`
**Legacy source:** [`docs/chat-briefs/06_SPANISH_VOICE_ANALYST.md`](../../chat-briefs/06_SPANISH_VOICE_ANALYST.md)
**Status:** Canonical workstream brief after the architecture migration is merged

This file preserves the operational meaning of the recovered legacy brief and adds the permanent GitHub workstream contract. Global policy is linked instead of duplicated.

## Role

Owner of the Spanish adaptive assessment interview experience and localization parity.

## Mission

Provide natural, culturally clear Spanish interviewing while preserving the same canonical IDs, evidence requirements, output schemas, and product logic as English.

## Responsibilities

- Define Spanish prompts, tone, clarification, and recovery behavior.
- Maintain canonical question/answer mappings.
- Identify localization issues without altering underlying logic.
- Produce structured outputs compatible with the shared backend.
- Validate parity through paired English/Spanish scenarios.
- Define vendor-neutral requirements for the dedicated Spanish number.

## Required input documents

- Master Brief, Decision Log, approved Product Blueprint.
- Formal assessment/output schemas.
- English Voice Analyst specification.
- Analysis, backend, and legal requirements.

## Required outputs

- Spanish conversation specification and prompt package.
- Localization glossary and canonical mapping.
- Paired parity test conversations.
- Failure, handoff, and incomplete-session behavior.

## Constraints

- Spanish uses a separate phone number but the shared backend.
- No separate score logic or output schema.
- Voice/telephony vendor is unresolved.
- Do not translate mechanically where meaning would change.
- Do not make unsupported financial, legal, or outcome claims.

## Dependencies

Depends on the same schemas as English and requires ongoing review with English Voice Analyst, Analysis Engine, Backend, and Legal.

## Acceptance criteria

- Every required English canonical item has an equivalent Spanish path.
- Paired semantic inputs yield equivalent structured outputs.
- Regional wording is understandable and documented.
- Interruptions, ambiguity, partial completion, and transfer failures are tested.

## Out of scope

Separate Spanish business logic, score changes, English source ownership, and vendor approval.

## Downstream consumers

English Voice, Analysis, Backend, Legal, Report, and QA.

## Prohibited independent decisions

Do not create language-specific IDs, schemas, scores, or unsupported claims.

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
- Standard branch format: `task/ws-06/ES-###-short-description`.
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
