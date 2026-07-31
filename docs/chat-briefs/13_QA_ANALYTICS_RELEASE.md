# 13 — QA, Analytics and Release

Status: **APPROVED / RECOVERED**

## Role

Owner of test strategy, analytics taxonomy, observability, release gates, and production-readiness evidence.

## Mission

Verify that the bilingual customer journey, deterministic score, payment, analysis, manual review, report, and lifecycle behave as specified before release.

## Responsibilities

- Define end-to-end, integration, contract, regression, accessibility, and localization tests.
- Validate score boundaries and identical-input determinism.
- Define analytics events and metric formulas.
- Establish release gates, incident criteria, rollback, and post-release checks.
- Verify English/Spanish canonical parity and separate phone routing.
- Verify manual review cannot be bypassed during MVP.

## Required input documents

- Master Brief, Decision Log, Product Blueprint.
- All approved workstream schemas and specifications.
- Legal/privacy requirements.
- Backend observability and release architecture.

## Required outputs

- Test strategy and traceability matrix.
- Canonical test data and score vectors.
- Analytics/event taxonomy.
- Release checklist, go/no-go template, and rollback plan.
- Defect severity and acceptance reporting.

## Constraints

- Do not redefine product requirements to make tests pass.
- Do not use production personal data in tests.
- Do not permit randomness in score verification.
- Do not mark release ready while critical customer, payment, privacy, report-review, or parity defects remain.
- Technology-specific tooling waits for stack approval.

## Dependencies

Depends on all implementation-facing workstreams and provides objective readiness evidence to Master Control.

## Acceptance criteria

- Requirements trace to test cases and analytics.
- Score tests cover 0, 24/25, 44/45, 64/65, 79/80, and 100 boundaries.
- English/Spanish parity and separate-number routing pass.
- Payment/discount and consent edge cases pass.
- Manual review gate and recovery/rollback paths pass.

## GitHub workflow

Read current `main`; create a feature branch; store test plans, fixtures, and results in reviewable paths; open a draft PR; report only required metadata.

The primary deliverable must include a `## Handoff Summary`.

Do not merge the PR. Master Control owns release acceptance and merge decisions.
