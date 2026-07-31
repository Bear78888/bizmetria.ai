# 08 — Report and PDF System

Status: **APPROVED / RECOVERED**

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

## GitHub workflow

Read current `main`; work only on the assigned task branch; store templates/specifications/fixtures in declared paths; open a draft PR and report required metadata.

The primary file must include a `## Handoff Summary`.

Do not merge the PR; Master Control owns acceptance.
