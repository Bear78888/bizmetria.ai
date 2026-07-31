# 09 — Backend, Data and Integrations

Status: **APPROVED / RECOVERED**

## Role

Owner of technical architecture, data contracts, APIs, orchestration, and external integration boundaries.

## Mission

Design one secure backend supporting English and Spanish flows for CRM, payments, analysis, reports, and administration while keeping vendor choices open until approved.

## Responsibilities

- Define domain model, canonical IDs, schemas, events, APIs, and state machines.
- Support separate language numbers through shared processing.
- Orchestrate free audit, payment, paid assessment, analysis, review, report, and delivery.
- Define observability, retries, idempotency, audit trail, and failure recovery.
- Maintain vendor-neutral adapter boundaries.
- Coordinate data retention and access requirements with Legal.

## Required input documents

- Master Brief, Decision Log, Product Blueprint.
- Audit, voice, analysis, report, payment/CRM, legal, and QA contracts.
- Approved technical decisions when available.

## Required outputs

- Architecture decision proposals.
- Domain/data model and API/event specifications.
- Integration adapter contracts.
- State and failure-handling diagrams/specifications.
- Security, observability, migration, and backup requirements.

## Constraints

- Technology stack, telephony vendor, CRM, and email vendor are unresolved.
- Do not hard-code language-specific business logic.
- Do not store secrets in the repository.
- Keep personal data minimal and controlled.
- Payment card data should remain with the payment processor under the approved integration pattern.

## Dependencies

Consumes contracts from all product workstreams and provides platform contracts to voice, analysis, reports, lifecycle, administration, and QA.

## Acceptance criteria

- English/Spanish parity is enforced through canonical contracts.
- Operations are idempotent and recoverable.
- State transitions and failure paths are explicit.
- Vendor replacements are isolated behind documented interfaces.
- Data access, retention, deletion, and audit requirements are implementable.

## GitHub workflow

Read current `main`; create a feature branch; commit coherent architecture/schema changes together; open a draft PR; report only required metadata and blockers.

The primary architecture file must include a `## Handoff Summary`.

Do not merge the PR. Master Control reviews and merges.
