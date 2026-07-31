# BizMetria Free Audit Questions — RECOVERED v0.1

Status: **RECOVERED DRAFT — REQUIRES TASK-002 REVIEW**  
Recovered: 2026-07-30

## Recovery notice

The 11 approved topics and contact-field requirements are recoverable from project context. Exact historical wording, answer options, branching, validations, and translations are not available. The canonical IDs and options below are a reconstructed baseline for Workstream 04 testing, not an approved reproduction of the previous file.

## Schema principles

- English and Spanish use the same canonical question and answer IDs.
- Display copy is localized; stored values and output schema are language-neutral.
- Question order is stable unless TASK-002 approves branching.
- Contact and consent fields are stored separately from assessment answers.
- Industry, name, email, phone, preferred language, and promotion code never affect the score.
- Optional free text is evidence/context and must not be converted into score points without an approved deterministic rule.

## Eleven-question structure

### Q01 — Business type

- Canonical ID: `business_type`
- Approved topic: type of business.
- Recovered draft input: searchable category plus `other` free text.
- Score use: none; context and recommendation relevance only.

### Q02 — Team size

- Canonical ID: `team_size`
- Approved topic: size of team.
- Recovered draft options:
  - `solo`
  - `team_2_5`
  - `team_6_10`
  - `team_11_25`
  - `team_26_50`
  - `team_51_plus`
- Score use in recovered v0.1: none; calibration context only.

### Q03 — New inquiries per month

- Canonical ID: `monthly_new_inquiries`
- Approved topic: number of new inquiries per month.
- Recovered draft options:
  - `zero_to_10`
  - `eleven_to_30`
  - `thirty_one_to_100`
  - `one_hundred_one_to_300`
  - `over_300`
  - `unknown`
- Score use in recovered v0.1: none; volume context only.

### Q04 — New-customer communication channels

- Canonical ID: `lead_channels`
- Approved topic: channels used to communicate with new customers.
- Recovered draft multi-select:
  - `phone`
  - `sms`
  - `email`
  - `website_form`
  - `web_chat`
  - `social_direct_messages`
  - `marketplace_platform`
  - `in_person`
  - `other`
- Score use: communication-fragmentation signal for Opportunity Breadth only.

### Q05 — Response speed

- Canonical ID: `first_response_speed`
- Approved topic: speed of response to a new inquiry.
- Recovered draft options:
  - `within_5_minutes`
  - `six_to_15_minutes`
  - `sixteen_to_60_minutes`
  - `one_to_4_hours`
  - `same_day`
  - `next_day_or_later`
- Score use: Lead Response and Follow-Up.

### Q06 — Lead and customer tracking

- Canonical ID: `customer_tracking_system`
- Approved topic: where leads and customers are tracked.
- Recovered draft options:
  - `integrated_crm`
  - `basic_or_partially_used_crm`
  - `spreadsheet_or_project_tool`
  - `inbox_notes_or_multiple_places`
  - `no_consistent_system`
- Score use: Systems and Data.

### Q07 — Excessive manual work

- Canonical ID: `manual_work_areas`
- Approved topic: tasks requiring too much manual work.
- Recovered draft multi-select:
  - `lead_intake`
  - `follow_up`
  - `scheduling`
  - `quotes_or_proposals`
  - `data_entry`
  - `customer_support`
  - `billing_or_collections`
  - `reporting`
  - `marketing`
  - `internal_coordination`
  - `other`
  - `none`
- Validation: `none` is mutually exclusive with all other values.
- Score use: Manual Work and Opportunity Breadth.

### Q08 — Follow-up when a customer does not respond or buy

- Canonical ID: `unconverted_lead_follow_up`
- Approved topic: what happens with a customer who does not answer or buy immediately.
- Recovered draft options:
  - `automated_multi_step_follow_up`
  - `consistent_manual_follow_up`
  - `occasional_follow_up`
  - `no_defined_follow_up`
- Score use: Lead Response and Follow-Up and Opportunity Breadth.

### Q09 — Main current business problem

- Canonical ID: `primary_business_problem`
- Approved topic: main current business problem.
- Recovered draft options:
  - `slow_lead_response`
  - `lost_or_untracked_leads`
  - `too_much_manual_work`
  - `inconsistent_follow_up`
  - `disconnected_systems`
  - `limited_visibility_or_reporting`
  - `customer_service_capacity`
  - `marketing_or_sales_consistency`
  - `other`
- Score use: Opportunity Breadth classification only; the selected category does not carry direct points.

### Q10 — Desired result in the next 90 days

- Canonical ID: `desired_90_day_outcome`
- Approved topic: desired result over the next 90 days.
- Recovered draft options:
  - `respond_faster`
  - `convert_more_existing_leads`
  - `reduce_manual_work`
  - `improve_customer_experience`
  - `organize_data_and_systems`
  - `improve_reporting`
  - `scale_without_equivalent_hiring`
  - `identify_best_ai_priorities`
  - `other`
- Score use: Opportunity Breadth classification only; no direct points.

### Q11 — Urgency

- Canonical ID: `improvement_urgency`
- Approved topic: urgency to begin improvements.
- Recovered draft options:
  - `just_exploring`
  - `within_6_to_12_months`
  - `within_3_to_6_months`
  - `within_1_to_3_months`
  - `start_now`
- Score use: Strategic Priority and Urgency.

## Contact form

| Field | Canonical ID | Required | Score impact |
|---|---|---:|---|
| Name | `contact_name` | Yes | None |
| Business name | `business_name` | Yes | None |
| Website | `business_website` | No | None |
| Email | `email` | Yes | None |
| Phone | `phone` | No | None |
| Preferred language | `preferred_language` (`en`/`es`) | Yes | None |
| Email consent | `email_consent` | Separate explicit field | None |
| SMS consent | `sms_consent` | Separate and optional | None |

Consent records must include the applicable notice/version and timestamp under the formal legal/data specification. Consent must not be inferred from supplying an email or phone number.

## Validation baseline

- All 11 assessment answers are required for scoring unless TASK-002 approves an incomplete-result rule.
- Multi-select values must be unique canonical IDs.
- Unknown IDs are rejected, not silently mapped.
- `preferred_language` affects presentation only.
- Email must pass basic format validation.
- Website and phone remain optional.
- SMS consent cannot be required to receive the free result.

## Bilingual contract

The English and Spanish user interfaces must emit the same:

- Question IDs.
- Answer IDs.
- Field types.
- Validation codes.
- Score inputs.
- Analytics events.
- Result schema.

Localization review must validate meaning rather than word-for-word translation.

## Items requiring TASK-002 approval

- Exact English and Spanish copy.
- Exact answer labels and whether any option should be added/removed.
- Whether Q02/Q03 affect a later calibrated score.
- Branching, progress behavior, and save/resume.
- Consent wording and required legal metadata.
- Accessibility copy and error messages.
- Final analytics taxonomy.

## Handoff Summary

- Task: Recovered baseline for TASK-002 Formal Free Audit Specification.
- Status: RECOVERED DRAFT.
- Files changed: this question baseline and companion score baseline.
- Decisions proposed: canonical IDs and draft answer options for testing.
- Decisions approved: 11 topics, contact fields, separate consents, bilingual canonical parity, non-scoring identity/language data.
- Open questions: exact copy/options, branching, incomplete-response behavior, legal consent text, and calibration use of Q02/Q03.
- Dependencies: Product Blueprint review, Legal and Data Inventory, UX, backend schemas.
- Validation performed: 11 topics and all required contact fields represented; scoring exclusions documented.
- Recommended next task: TASK-002.
