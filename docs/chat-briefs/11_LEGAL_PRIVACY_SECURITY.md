# 11 — Legal, Privacy and Security

Status: **APPROVED / RECOVERED**

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

## GitHub workflow

Read current `main` and TASK-004; create a feature branch; save the complete baseline and issue register; open a draft PR; report required metadata only.

The primary file must include a `## Handoff Summary`.

Do not merge the PR. Master Control reviews and merges.
