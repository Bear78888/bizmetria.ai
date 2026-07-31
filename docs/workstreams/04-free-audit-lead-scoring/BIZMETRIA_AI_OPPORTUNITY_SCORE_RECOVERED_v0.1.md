# BizMetria AI Opportunity Score — RECOVERED v0.1

Status: **RECOVERED BASELINE — REQUIRES WORKSTREAM 04 TESTING**  
Recovered: 2026-07-30

## Recovery notice

The 0–100 total, five block maxima, score bands, exclusions, and interpretation limits are approved/recovered. The detailed point mapping and result-selection thresholds below are reconstructed for deterministic testing and are not final approved historical rules.

## Approved scoring contract

| Block | Maximum |
|---|---:|
| Lead Response and Follow-Up | 30 |
| Manual Work | 25 |
| Systems and Data | 20 |
| Strategic Priority and Urgency | 15 |
| Opportunity Breadth | 10 |
| **Total** | **100** |

The score:

- Is not a financial valuation.
- Does not assess whether a business is good or bad.
- Is not affected by industry.
- Is not affected by name, email, phone, preferred language, or promotion code.
- Must be identical for identical canonical answers.
- Must not contain random numbers or model-generated point assignments.

## Recovered deterministic point table

### 1. Lead Response and Follow-Up — maximum 30

#### Q05 `first_response_speed` — maximum 16

| Answer ID | Points |
|---|---:|
| `within_5_minutes` | 0 |
| `six_to_15_minutes` | 3 |
| `sixteen_to_60_minutes` | 6 |
| `one_to_4_hours` | 10 |
| `same_day` | 13 |
| `next_day_or_later` | 16 |

#### Q08 `unconverted_lead_follow_up` — maximum 14

| Answer ID | Points |
|---|---:|
| `automated_multi_step_follow_up` | 0 |
| `consistent_manual_follow_up` | 4 |
| `occasional_follow_up` | 8 |
| `no_defined_follow_up` | 14 |

Block formula:

`lead_response_follow_up = q05_points + q08_points`

### 2. Manual Work — maximum 25

Q07 `manual_work_areas` counts selected values other than `none`. Duplicate selections are removed before counting.

| Number of qualifying areas | Points |
|---:|---:|
| 0 | 0 |
| 1 | 6 |
| 2 | 12 |
| 3 | 18 |
| 4 or more | 25 |

Block formula:

`manual_work = manual_area_points`

This mapping measures the reported breadth of manual burden, not cost, staff performance, or business quality.

### 3. Systems and Data — maximum 20

#### Q06 `customer_tracking_system`

| Answer ID | Points |
|---|---:|
| `integrated_crm` | 0 |
| `basic_or_partially_used_crm` | 5 |
| `spreadsheet_or_project_tool` | 10 |
| `inbox_notes_or_multiple_places` | 15 |
| `no_consistent_system` | 20 |

Block formula:

`systems_data = q06_points`

### 4. Strategic Priority and Urgency — maximum 15

#### Q11 `improvement_urgency`

| Answer ID | Points |
|---|---:|
| `just_exploring` | 0 |
| `within_6_to_12_months` | 4 |
| `within_3_to_6_months` | 8 |
| `within_1_to_3_months` | 12 |
| `start_now` | 15 |

Block formula:

`strategic_priority_urgency = q11_points`

The label “Strategic Priority” must not be interpreted as financial readiness or purchasing intent.

### 5. Opportunity Breadth — maximum 10

Create a set of detected opportunity domains using fixed rules:

| Domain | Detection rule |
|---|---|
| `lead_response` | Q05 is `sixteen_to_60_minutes`, `one_to_4_hours`, `same_day`, or `next_day_or_later`. |
| `follow_up` | Q08 is `occasional_follow_up` or `no_defined_follow_up`. |
| `manual_operations` | Q07 contains at least one value other than `none`. |
| `systems_data` | Q06 is `spreadsheet_or_project_tool`, `inbox_notes_or_multiple_places`, or `no_consistent_system`. |
| `channel_coordination` | Q04 contains three or more channels. |
| `stated_problem` | Q09 maps to a domain not already present. |
| `desired_outcome` | Q10 maps to a domain not already present. |

Q09 and Q10 mappings must use a fixed lookup table approved in TASK-002; free text may map only through a deterministic reviewed category, otherwise it contributes no domain.

| Unique detected domains | Points |
|---:|---:|
| 0 | 0 |
| 1 | 2 |
| 2 | 4 |
| 3 | 6 |
| 4 | 8 |
| 5 or more | 10 |

Block formula:

`opportunity_breadth = min(10, unique_domain_count * 2)`

### Total

```text
total =
  lead_response_follow_up
  + manual_work
  + systems_data
  + strategic_priority_urgency
  + opportunity_breadth
```

The implementation must validate every block cap and then validate `0 <= total <= 100`.

## Approved score levels

| Total | Level |
|---:|---|
| 0–24 | Focused AI Opportunity |
| 25–44 | Moderate AI Opportunity |
| 45–64 | Strong AI Opportunity |
| 65–79 | High AI Opportunity |
| 80–100 | Very High AI Opportunity |

## Free-result selection rules — recovered baseline

The free result contains exactly:

1. Total AI Opportunity Score and level.
2. A visible statement that the score is not a financial valuation.
3. One general observation selected from an approved template by score level.
4. No more than three opportunity areas.
5. Locked previews of the full report.
6. The BizMetria Business Assessment offer at **$299 one time**.

### Opportunity-area selection

1. Normalize each block as `block_points / block_maximum`.
2. Exclude blocks with zero points.
3. Sort descending by normalized value.
4. Resolve ties with this fixed priority:
   1. Lead Response and Follow-Up.
   2. Manual Work.
   3. Systems and Data.
   4. Strategic Priority and Urgency.
   5. Opportunity Breadth.
5. Display the first three blocks at most.
6. Use general category language only; do not disclose the full issue list or implementation solution.

The exact display threshold and copy require TASK-002/UX testing. The algorithm must never ask a language model to choose areas without deterministic constraints.

### Locked full-report sections

The result may preview locked labels for:

- Full personalized analysis.
- Complete recommendations.
- Impact vs. Effort Matrix.
- 30–90 day roadmap.
- Professional PDF report.
- Results consultation.

### Prohibited free-result content

- Full list of problems.
- Specific architecture.
- Complete service/vendor list.
- Exact financial-loss claims without sufficient data.
- Ready-to-execute instructions.
- Full roadmap.
- PDF.
- Consultation.

## Required test vectors

TASK-002 must include:

- All-minimum answers produce 0 plus only deterministically detected breadth, if any.
- All-maximum scoring answers cannot exceed 100.
- Score boundaries 24/25, 44/45, 64/65, and 79/80 map correctly.
- Every individual answer maps to the documented points.
- Reordered multi-select inputs produce the same score.
- Duplicate multi-select inputs do not add points.
- English and Spanish labels with the same canonical IDs produce the same score.
- Changing industry, contact data, language, or promotion code leaves the score unchanged.
- Unknown or missing IDs produce a validation result, not random/fallback points.
- Opportunity-area tie ordering is stable.

## Calibration questions

- Should Q02 team size or Q03 inquiry volume influence any block after empirical testing?
- Are the Q05 and Q08 weights sufficiently balanced?
- Does manual-area counting overstate opportunity for broadly worded selections?
- Should opportunity-area display require a minimum normalized block threshold?
- What fixed Q09/Q10-to-domain lookup should be approved?
- How will incomplete answers be handled?

## Handoff Summary

- Task: Recovered score baseline for TASK-002.
- Status: RECOVERED DRAFT; approved maxima/bands with proposed detailed mapping.
- Files changed: this score baseline and companion question baseline.
- Decisions proposed: deterministic point table, breadth rules, and free-result ranking for testing.
- Decisions approved: 0–100 structure, 30/25/20/15/10 blocks, score bands, exclusions, interpretation, deterministic requirement, and free-result boundary.
- Open questions: calibration, Q09/Q10 domain lookup, incomplete inputs, display threshold, and possible Q02/Q03 use.
- Dependencies: Product Blueprint, formal question schema, UX, Legal, Backend, and QA.
- Validation performed: arithmetic caps total 100; exclusion and determinism requirements documented; boundary tests specified.
- Recommended next task: TASK-002 Formal Free Audit Specification.
