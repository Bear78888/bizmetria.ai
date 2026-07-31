# 07 — AI Analysis Engine

Status: **APPROVED / RECOVERED**

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

## GitHub workflow

Read current `main` and assigned task; branch; store specification, schemas, and evaluation cases together; open a draft PR; report required metadata only.

The main deliverable must include a `## Handoff Summary`.

Do not merge the PR; Master Control reviews it.
