# BizMetria Owner Decision Record v0.1

**Task:** `MC-003 — Product Decision Gate` \
**Version:** `v0.1` \
**Status:** `BLOCKED — awaiting explicit owner input` \
**Owner:** Project owner and Master Orchestrator \
**Prepared:** 2026-07-30 \
**Source baseline:** `main` at `66be062629a9b11670d1b76d202a30474eff98f7`

## 1. Purpose

This record is the controlled approval surface for the options prepared in the approved [Owner Decision Package](../../02-product-strategy/deliverables/BIZMETRIA_OWNER_DECISION_PACKAGE_v0.1.md).

It does not infer consent from prior requests to continue the project. A recommendation becomes an approved product decision only when the project owner explicitly selects it or supplies a bounded replacement. Legal, tax, entity, jurisdiction, reviewer, and consultation facts must be supplied or verified by the named responsible party.

Until this record is complete and merged:

- `MC-003` remains `BLOCKED`;
- `OPEN-001`, `OPEN-002`, `OPEN-003`, `OPEN-007`, and `OPEN-008` remain open;
- `PS-003` cannot start;
- `G1` remains not passed;
- Phase 2 work cannot start.

## 2. Approved input evidence

| Input | Status | Evidence |
|---|---|---|
| `PS-001 — Product Blueprint v0.1` | APPROVED | PR [#5](https://github.com/Bear78888/bizmetria.ai/pull/5), merge SHA `21d223223180e7a7d617f28648674efb613c4a92` |
| `LS-001 — Legal and Data Inventory Baseline v0.1` | APPROVED | PR [#6](https://github.com/Bear78888/bizmetria.ai/pull/6), merge SHA `b6174f1325136bc69a9859925c570e5770972991` |
| `PS-002 — Owner Decision Package v0.1` | APPROVED | PR [#8](https://github.com/Bear78888/bizmetria.ai/pull/8), merge SHA `66be062629a9b11670d1b76d202a30474eff98f7` |

## 3. Owner decision ballot

The recommendations below are copied for convenience. The `Owner selection` column is intentionally unresolved.

| ID | Decision | Recommended option | Owner selection | Status |
|---|---|---|---|---|
| `D01` | Paid-report delivery service level | `D01-B` — within five U.S. business days after inputs complete | `AWAITING OWNER` | OPEN |
| `D02` | Refund Policy model | `D02-A` — stage-based, subject to counsel review | `AWAITING OWNER` | OPEN |
| `D03` | Included consultation | `D03-A` — one bounded 30-minute session | `AWAITING OWNER` | OPEN |
| `D04` | Promotion operating model | `D04-B` — controlled lifecycle ladder | `AWAITING OWNER` | OPEN |
| `D05` | Separate implementation packages/prices | `D05-B` — `$1,500`, `$4,500`, and custom from `$9,500` | `AWAITING OWNER` | OPEN |
| `D06` | MVP KPI target set | `D06-B` — balanced pilot targets | `AWAITING OWNER` | OPEN |
| `D07` | Fulfillment capacity | `D07-B` — six orders/week, then eight after clean evidence | `AWAITING OWNER` | OPEN |
| `D08` | MVP service geography | `D08-B` — counsel-cleared U.S. state allowlist | `AWAITING OWNER` | OPEN |
| `D09` | Customer age eligibility | `D09-A` — authorized business representatives aged 18+ | `AWAITING OWNER` | OPEN |

The owner may approve the recommended bundle by writing:

```text
APPROVE RECOMMENDED D01–D09
```

Any exception must name the replacement, for example:

```text
APPROVE RECOMMENDED EXCEPT D03-B AND D07-A
```

## 4. Required factual confirmations

These values cannot be inferred from the decision bundle.

| ID | Required value/evidence | Current value | Status |
|---|---|---|---|
| `F01` | Full legal selling-entity name and entity type | `AWAITING OWNER` | BLOCKED |
| `F02` | Formation country/state and principal business address | `AWAITING OWNER` | BLOCKED |
| `F03` | Customer-facing support email and mailing address | `AWAITING OWNER` | BLOCKED |
| `F04` | Intended initial paid-order states; final allowlist requires counsel | `AWAITING OWNER` | BLOCKED |
| `F05` | Operating timezone and business-holiday calendar | Proposed: `America/Los_Angeles`, U.S. federal-holiday calendar; `AWAITING OWNER` | BLOCKED |
| `F06` | Sales-tax review and collection plan | `AWAITING QUALIFIED ACCOUNTING REVIEW` | BLOCKED |
| `F07` | Refund-policy review result | `AWAITING QUALIFIED COUNSEL` | BLOCKED |
| `F08` | Age-eligibility review result | `AWAITING QUALIFIED COUNSEL` | BLOCKED |
| `F09` | Primary and backup report reviewers plus weekly available hours | `AWAITING OWNER` | BLOCKED |
| `F10` | Consultation provider(s), language coverage, and bookable hours | `AWAITING OWNER` | BLOCKED |

Sensitive personal details, credentials, tax IDs, payment information, or private counsel documents must not be committed to GitHub. The record needs only business-facing facts and a reference to completed professional review.

## 5. Minimal owner response template

```text
Decisions: APPROVE RECOMMENDED D01–D09
F01 legal entity/type:
F02 formation location and business mailing address:
F03 support email and public mailing address:
F04 intended first launch states:
F05 timezone/holiday calendar:
F09 primary + backup reviewer and weekly hours:
F10 consultation provider, EN/ES coverage, and weekly hours:
F06 tax review: completed / scheduled / not arranged
F07 refund counsel review: completed / scheduled / not arranged
F08 age-rule counsel review: completed / scheduled / not arranged
```

The owner may omit a public address from chat and instead state that it will be supplied directly to qualified counsel. That omission remains a launch blocker and must not be filled with private data in GitHub.

## 6. Gate evaluation

| Gate condition | Current result |
|---|---|
| PS-002 approved and available in `main` | PASS |
| Explicit choice for `D01`–`D09` | BLOCKED |
| Required entity, geography, support, capacity, and consultation facts | BLOCKED |
| Qualified refund, age, and tax review evidence | BLOCKED |
| Decision Log updated with approved entries | NOT STARTED |
| `PS-003` product requirements merged | NOT STARTED |
| `G1 — Product Baseline Approved` | NOT PASSED |

## 7. Completion procedure

After owner input:

1. record each selected option or bounded replacement;
2. run the cross-decision consistency checks from PS-002;
3. mark professional-review dependencies explicitly as complete or blocking;
4. create proposed global Decision Log entries with rationale and affected workstreams;
5. update `OPEN-001`, `OPEN-002`, `OPEN-003`, `OPEN-007`, and `OPEN-008`;
6. independently review the full `MC-003` diff;
7. merge only when every blocking choice/fact is satisfied or validly deferred;
8. start `PS-003` only from the verified post-merge `main`;
9. do not mark `G1` as passed until PS-003 is reviewed and merged.

## 8. Handoff Summary

- **Task:** `MC-003 — Product Decision Gate`
- **Status:** `BLOCKED — awaiting explicit owner input`
- **Approved inputs:** PS-001, LS-001, and PS-002.
- **Decisions approved by this checkpoint:** None.
- **Open decisions:** `D01`–`D09` and `F01`–`F10`.
- **Technical blocker:** None.
- **Authority blocker:** Owner selections, business facts, and named professional reviews.
- **Checkpoint PR:** Draft [#9](https://github.com/Bear78888/bizmetria.ai/pull/9).
- **Next action:** Obtain the minimal owner response, update this record and the Decision Log, then evaluate MC-003.
