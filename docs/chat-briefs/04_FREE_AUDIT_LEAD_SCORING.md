# 04 — Free Audit and Lead Scoring

Status: **APPROVED / RECOVERED**

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

## GitHub workflow

Read current `main` and TASK-002; branch from `main`; update formal specifications and tests together; batch related files; open a draft PR; report required metadata only.

The primary specification must include a `## Handoff Summary`.

Do not merge the PR. Master Control reviews and merges.
