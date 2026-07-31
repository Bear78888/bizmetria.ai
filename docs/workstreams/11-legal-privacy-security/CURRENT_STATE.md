# Current State

**Workstream:** 11 — Legal, Privacy and Security
**Status:** `REVIEW`
**Last updated:** 2026-07-31
**Current task:** `LS-002 — Consent, Claims, and Data Requirements` — `REVIEW`
**Current branch:** `task/ws-11/LS-002-consent-claims-data-requirements`
**Current PR:** Pending creation

## Approved baseline

Separate email/SMS consent, data minimization, non-financial score disclaimer, no secrets/production personal data in GitHub, approved Delivery Roadmap, and gate `G0` as `PASS`.

## Completed

A complete Legal and Data Inventory Baseline v0.1 was independently reviewed and merged through PR [#6](https://github.com/Bear78888/bizmetria.ai/pull/6) at `b6174f1325136bc69a9859925c570e5770972991`. It remains issue-spotting and implementable guardrails, not final legal advice.

FA-001 merged through PR [#12](https://github.com/Bear78888/bizmetria.ai/pull/12), and PS-004 merged through PR [#13](https://github.com/Bear78888/bizmetria.ai/pull/13). Both named LS-002 inputs are approved.

## In progress

`LS-002` is complete as a review candidate on `task/ws-11/LS-002-consent-claims-data-requirements`. It defines versioned purpose/consent evidence, suppression, customer notice surfaces, semantic English/Spanish copy modules, claims rules, exact field adoption, stored data classes, rights handling, retention fail-closed behavior, review triggers, and acceptance vectors.

## Not started

Independent review, draft PR publication, and merge of `LS-002` are not complete. `LC-001`, `AE-001`, and their downstream tasks remain behind the named dependency.

## Open decisions

Refund Policy, jurisdiction-specific review, vendors/processors, and retention periods.

## Blockers

No specification dependency blocker remains. Qualified review of flagged legal questions is still required before applicable production gates; entity/address, support path, exact retention, nationwide applicability, Refund Policy, SMS/voice treatment, vendors, staffing, security/release evidence, and protected Stripe live activation remain open.

## Dependencies

`G1 — PASS`; approved FA-001 PR [#12](https://github.com/Bear78888/bizmetria.ai/pull/12), merge SHA `97446522cf9eba8e63fe1b1887439fb77adabf5f`; approved PS-004 PR [#13](https://github.com/Bear78888/bizmetria.ai/pull/13), merge SHA `1ed5a2a190fdfef03c7d1fcdec5320ec817c596b`. Later vendor contracts and qualified reviews remain future inputs.

## Files currently relevant

- `WORKSTREAM_BRIEF.md`
- `TASK_QUEUE.md`
- `DECISIONS.md`
- `ARTIFACT_INDEX.md`
- `HANDOFF.md`
- `CHANGELOG.md`
- `deliverables/README.md`
- [Global Task Queue](../../BIZMETRIA_TASK_QUEUE.md)
- [Active Work](../../control/ACTIVE_WORK.md)

## Exact next action

Publish one draft PR for the six-file LS-002 package, independently review the exact remote diff, and merge only if all requirements and fail-closed boundaries pass.

## Latest session checkpoint

On 2026-07-31, LS-002 was prepared from verified main `71a925375cfc4232f6ca87b6b744938a43608855`. Official FTC, FCC, CPPA, California Attorney General, and California statutory sources were rechecked. The document remains implementation issue-spotting; no jurisdiction, legal conclusion, retention period, Refund Policy text, vendor role, final legal copy, or live-payment authorization was approved.
