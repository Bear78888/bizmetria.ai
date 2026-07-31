# BizMetria Task Queue

As of: 2026-07-30

## Sequencing rules

- Master Control assigns tasks in dependency order.
- A specialized chat performs only its assigned task.
- Every output is saved to GitHub with a Handoff Summary and draft PR.
- Specialized chats do not merge their own PRs.
- `QUEUED` tasks may depend on the approval or re-creation of earlier tasks.

## TASK-000 — Project Governance Baseline

- Owner: Master Control
- Status: **APPROVED / RECOVERED**
- Result: Master Brief, Coordination Protocol, GitHub workflow, Decision Log, Project Status, Task Queue, startup instructions, continuation context, and thirteen workstream briefs.
- Acceptance: approved product facts preserved; uncertain detail labeled; GitHub-native governance restored.

## TASK-001 — Product Blueprint v0.1

- Owner: Product Strategy
- Status: **NEEDS RECOVERY REVIEW**
- Target: `docs/workstreams/02-product-strategy/BIZMETRIA_PRODUCT_BLUEPRINT_v0.1.md`
- Dependency: recovery baseline approved.
- Required outcome: re-create a complete Product Blueprint using current approved decisions; identify proposals separately from approvals; include a Handoff Summary.
- Recovery note: the exact historical Product Blueprint text is unavailable in this repository and was not reconstructed from guesses.

Acceptance criteria:

- Covers target customer, value proposition, customer journey, free/paid boundary, paid deliverables, bilingual model, implementation boundary, lifecycle, risks, and open decisions.
- Preserves $299 one-time pricing.
- Does not resolve report timing, Refund Policy, consultation format, vendors, stack, promotions, or implementation pricing without approval.
- Opens a draft PR and is not self-merged.

## TASK-002 — Formal Free Audit Specification

- Owner: Free Audit and Lead Scoring
- Status: **QUEUED**
- Targets:
  - Canonical question schema.
  - Tested score specification.
  - Free-result selection rules.
- Inputs: recovered Workstream 04 documents, Decision Log, approved Product Blueprint when available.
- Dependency: TASK-001 review; may conduct isolated scoring tests earlier without changing approved product scope.

Acceptance criteria:

- English and Spanish share canonical IDs and output schema.
- Score is deterministic and totals 0–100.
- Point table is tested against boundary and identical-input cases.
- Free result respects the information boundary and $299 offer.

## TASK-003 — Product Experience Architecture

- Owner: Brand, Website and UX
- Status: **QUEUED**
- Outcome: end-to-end web and product UX for the free check, paid conversion, assessment, status, and delivery.
- Dependencies: TASK-001 and stable TASK-002 schema.

## TASK-004 — Legal and Data Inventory Baseline

- Owner: Legal, Privacy and Security
- Status: **QUEUED**
- Outcome: data inventory, consent model, retention/deletion baseline, disclaimer needs, and open Refund Policy requirements.
- Dependencies: current customer journey and provisional data flows.

## Unscheduled follow-ups

- Select technical stack and vendors.
- Define paid-report SLA and operational review checklist.
- Approve consultation format.
- Approve promotion calendar and implementation pricing.
- Establish external repository mirror and Git bundle backup schedule.
