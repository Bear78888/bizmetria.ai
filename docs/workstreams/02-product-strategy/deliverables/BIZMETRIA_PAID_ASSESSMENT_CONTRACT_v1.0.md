# BizMetria Paid Assessment Content Contract v1.0

**Task:** PS-004 — Paid Assessment Content Contract \
**Version:** 1.0.0 \
**Status:** REVIEW \
**Owner workstream:** 02 — Product Strategy \
**Prepared:** 2026-07-31 \
**Source baseline:** main at 97446522cf9eba8e63fe1b1887439fb77adabf5f \
**Branch:** task/ws-02/PS-004-paid-assessment-contract \
**Pull request:** [#13](https://github.com/Bear78888/bizmetria.ai/pull/13)

## 1. Purpose and authority

This contract defines the minimum paid questionnaire, interview objectives, evidence model, recovery behavior, and deterministic completion rule required to produce the approved $299 BizMetria Business Assessment.

It operationalizes PR-PAID-001 through PR-PAID-010 and the evidence, report, SLA, language, data, security, and audit requirements that depend on paid-assessment inputs.

This contract does not:

- activate real payment or contain a Stripe identifier or secret;
- define public legal, privacy, recording, refund, or retention wording;
- select a voice, model, analytics, storage, or other vendor;
- authorize collection of credentials, payment-card data, sensitive files, or unrestricted uploads;
- promise implementation, ROI, savings, revenue, or another outcome.

Legal notice, recording/transcription treatment, retention periods, vendor terms, and public Spanish legal copy remain subject to LS-002 and qualified review. Production remains fail closed until every applicable live dependency passes.

## 2. Contract versions and normative language

MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are normative.

| Surface | Canonical version |
|---|---|
| Paid questionnaire schema | paid-assessment-schema/1.0.0 |
| Interview objectives | paid-interview-objectives/1.0.0 |
| Evidence closure rules | paid-evidence-closure/1.0.0 |
| Input completion rule | assessment-inputs-complete/1.0.0 |
| Language contract | paid-assessment-language/en-es/1.0.0 |

Every questionnaire version, interview session, recovery action, evidence item, follow-up, and completion event MUST retain the applicable versions. Old inputs MUST NOT be silently reinterpreted under a later contract.

## 3. Product and role boundary

### 3.1 Entry

Paid onboarding is available only to an authenticated order in the same environment with:

- PAYMENT_CONFIRMED;
- an 18-or-older authorized-business-representative affirmation captured by the approved account/checkout flow;
- no blocking fraud, security, access, or fulfillment hold.

Test-mode PAYMENT_CONFIRMED can unlock only test-mode onboarding with synthetic data. A test event can never unlock live fulfillment.

### 3.2 Roles

| Role | Allowed actions |
|---|---|
| Purchaser | View order scope and progress; invite an authorized participant |
| Primary participant | Complete and correct questionnaire; participate in interview or approved recovery |
| Authorized stakeholder | Supply a bounded missing evidence item when explicitly invited |
| Support | Recover access and explain missing fields; never invent customer answers |
| Interview system or facilitator | Collect evidence under the approved disclosure and route |
| Analysis service | Read normalized, authorized evidence; create a draft only |
| Human reviewer | Review evidence, correct/reject/regenerate, and explicitly approve a report |

Names and direct contact data remain in the account/order domain. Questionnaire fields ask for role labels, not employee names.

## 4. Data minimization and prohibited collection

The paid questionnaire and interview MUST collect only information needed to understand one assessment scope, one primary workflow in usable depth, related constraints, and enough context to prioritize recommendations.

The v1 product has no general file-upload field. It MUST NOT request or accept:

- passwords, API keys, tokens, private keys, recovery codes, or login instructions;
- full card numbers, card security codes, bank credentials, or payment-form data;
- government identifiers, identity documents, tax numbers, or private home addresses;
- customer lists, employee records, raw message archives, or unrestricted database exports;
- protected health data, detailed information about children, biometric templates, or precise location histories;
- source-code archives, confidential contracts, privileged legal material, or trade secrets unnecessary to the assessment;
- malware samples or other dangerous executable content.

The form and interview MUST warn the customer not to provide these items. When a sensitive category affects feasibility, the product records only the high-level category ID and routes the matter for qualified review; it does not collect the underlying data.

## 5. Shared field metadata

Unless a row states otherwise, every questionnaire field has this metadata:

| Attribute | Value |
|---|---|
| Source | Customer questionnaire |
| Evidence state when supplied | CUSTOMER_FACT, meaning customer-asserted and not independently verified |
| Evidence state for an allowed unknown | UNKNOWN |
| Classification | CONFIDENTIAL_BUSINESS |
| Access | Customer; analysis service; authorized human reviewer; restricted support only for recovery |
| Retention class | PAID_ASSESSMENT_CONTENT_TBD |
| Deletion/export | Order-linked export, correction, and deletion must be implementable; lawful exceptions and exact period remain open |
| Analytics | Field value and free text prohibited from product analytics, logs, traces, and error payloads |
| General-model training | Prohibited by default |

PAID_ASSESSMENT_CONTENT_TBD is a configuration placeholder, not permission to retain indefinitely. LS-002/LS-003 must replace it with an approved event-based schedule before production.

## 6. Questionnaire field catalog

### 6.1 Field rules

- R means required for QUESTIONNAIRE_COMPLETE.
- O means optional and MUST NOT be converted into required through UI wording.
- Every required field MUST be present, type-valid, and enum-valid.
- Unknown is accepted only where listed as a canonical option.
- Multi-select values MUST be unique; none and not_currently_measured are exclusive when present.
- Required text is trimmed and normalized Unicode, with minimum and maximum lengths shown.
- Optional text is absent when blank; the server does not store empty strings as evidence.
- Every text field displays the prohibited-data warning from section 4.
- Canonical IDs are language neutral. English and Spanish labels express the same intent and store the same value.

### 6.2 Participant and scope

| Field ID | R/O | Type and validation | English intent | Intención en español | Purpose |
|---|---:|---|---|---|---|
| participant_role | R | participant_role enum | Your role in the business | Su función en el negocio | Interpret authority and operating viewpoint |
| decision_authority | R | decision_authority enum | Your role in decisions about this scope | Su función en las decisiones sobre este alcance | Route assumptions and stakeholder needs |
| assessment_scope | R | assessment_scope enum | Scope to assess | Alcance que se evaluará | Bound the report and prevent overgeneralization |
| industry_category | R | industry_category enum | Business category | Categoría del negocio | Shape context without creating a score |
| business_model | R | 1–3 unique business_model values | Business model | Modelo de negocio | Understand customer and transaction context |
| service_delivery_mode | R | service_delivery_mode enum | How work or service is delivered | Cómo se entrega el trabajo o servicio | Interpret workflow and system needs |

### 6.3 Objectives and success

| Field ID | R/O | Type and validation | English intent | Intención en español | Purpose |
|---|---:|---|---|---|---|
| primary_objective | R | objective enum | Most important objective | Objetivo más importante | Anchor prioritization |
| objective_detail | R | Text, 20–500 characters | What should improve and why it matters | Qué debe mejorar y por qué es importante | Capture customer-defined context |
| priority_horizon | R | priority_horizon enum | When improvement matters | Cuándo es importante la mejora | Shape roadmap sequence, not a guarantee |
| target_outcomes | R | 1–3 unique outcome values | Desired operational outcomes | Resultados operativos deseados | Map recommendations to intended benefit |
| success_measure_ids | R | 1–5 unique measure values | How progress is or could be observed | Cómo se observa o podría observar el progreso | Support evidence-bounded success checks |
| baseline_availability | R | baseline_availability enum | Current baseline availability | Disponibilidad de una línea base actual | Prevent invented precision |
| baseline_metrics | O | 0–5 metric objects; section 6.8 | Known baseline measurements | Mediciones de referencia conocidas | Permit measured comparison when supplied |
| nonnegotiable_constraints | R | 1–8 unique constraint values | Constraints that must be respected | Restricciones que deben respetarse | Prevent unsafe or impractical recommendations |

### 6.4 Primary workflow

| Field ID | R/O | Type and validation | English intent | Intención en español | Purpose |
|---|---:|---|---|---|---|
| workflow_focus_areas | R | 1–3 unique workflow_area values | Areas included in the assessment | Áreas incluidas en la evaluación | Select the bounded discovery scope |
| primary_workflow_name | R | Text, 3–80 characters | Short name for the main workflow | Nombre breve del flujo de trabajo principal | Give evidence a stable human-readable reference |
| workflow_trigger | R | Text, 10–300 characters | What starts the workflow | Qué inicia el flujo de trabajo | Establish process entry |
| workflow_desired_outcome | R | Text, 10–300 characters | What successful completion means | Qué significa completar el proceso con éxito | Establish process exit |
| workflow_steps | R | 2–12 step objects; section 6.8 | Current steps from trigger to outcome | Pasos actuales desde el inicio hasta el resultado | Support bottleneck, effort, dependency, and roadmap analysis |
| workflow_frequency | R | workflow_frequency enum | How often the workflow occurs | Con qué frecuencia ocurre el flujo | Establish frequency band without exact customer records |
| workflow_volume_band | R | workflow_volume enum | Approximate items per period | Volumen aproximado por período | Qualify scale without collecting customer lists |
| handoff_count_band | R | handoff_count enum | Number of handoffs | Cantidad de traspasos | Identify coordination burden |
| exception_frequency | R | exception_frequency enum | How often exceptions occur | Con qué frecuencia ocurren excepciones | Qualify variability |
| primary_bottleneck | R | bottleneck enum | Main current bottleneck | Principal cuello de botella actual | Anchor the problem model |
| bottleneck_detail | O | Text, maximum 500 characters | Context about the bottleneck | Contexto sobre el cuello de botella | Clarify impact without requiring sensitive detail |
| delay_band | O | delay_band enum | Typical delay caused by the bottleneck | Demora típica causada por el cuello de botella | Support relative impact |
| manual_effort_band | O | manual_effort enum | Approximate weekly manual effort | Esfuerzo manual semanal aproximado | Support effort and capacity context |
| rework_frequency | O | rework_frequency enum | How often work must be redone | Con qué frecuencia debe repetirse el trabajo | Support quality and friction analysis |

### 6.5 Systems and data

| Field ID | R/O | Type and validation | English intent | Intención en español | Purpose |
|---|---:|---|---|---|---|
| system_categories | R | 1–10 unique system_category values | System categories used in the workflow | Categorías de sistemas utilizadas en el flujo | Map current architecture at a safe level |
| system_inventory | O | 0–10 system objects; section 6.8 | Optional product labels and purposes | Nombres opcionales de productos y sus usos | Improve compatibility context without credentials |
| integration_state | R | integration_state enum | How connected the systems are | Qué tan conectados están los sistemas | Identify transfer and duplication friction |
| data_source_categories | R | 1–10 unique data_source values | Data-source categories used | Categorías de fuentes de datos utilizadas | Identify evidence and integration needs |
| data_quality_state | R | data_quality_state enum | General data-quality state | Estado general de la calidad de los datos | Bound recommendation confidence |
| data_access_state | R | data_access_state enum | Authorized access feasibility | Viabilidad del acceso autorizado | Identify dependencies without collecting access details |
| regulated_data_categories | R | 1–8 unique regulated_data values | High-level sensitive or regulated categories involved | Categorías generales sensibles o reguladas involucradas | Trigger privacy/security review without collecting the data |

### 6.6 Capacity and constraints

| Field ID | R/O | Type and validation | English intent | Intención en español | Purpose |
|---|---:|---|---|---|---|
| process_owner_role | R | Role label, 2–80 characters; no personal name | Role responsible for the workflow | Función responsable del flujo de trabajo | Supply a roadmap owner role |
| change_capacity | R | change_capacity enum | Weekly capacity for improvement work | Capacidad semanal para el trabajo de mejora | Bound roadmap effort |
| implementation_timing | R | implementation_timing enum | Preferred timing if action is chosen | Plazo preferido si se decide actuar | Sequence recommendations without promising delivery |
| investment_constraint | O | investment_constraint enum | General cost constraint | Restricción general de costos | Avoid recommendations that conflict with stated limits |
| stakeholder_roles | O | 0–8 unique role labels, each 2–80 characters; no names | Other roles needed for a decision | Otras funciones necesarias para una decisión | Identify dependencies and consultation audience |
| known_dependencies | O | Text, maximum 500 characters | Known dependencies | Dependencias conocidas | Improve sequencing |
| known_risks | O | Text, maximum 500 characters | Known risks or concerns | Riesgos o inquietudes conocidos | Support warnings and reviewer attention |

### 6.7 Final context and acknowledgement

| Field ID | R/O | Type and validation | English intent | Intención en español | Purpose | Metadata override |
|---|---:|---|---|---|---|---|
| additional_context | O | Text, maximum 1,000 characters | Other context relevant to this assessment | Otro contexto pertinente para esta evaluación | Capture bounded material not represented above | Default metadata |
| prohibited_data_acknowledgement | R | Boolean true from explicit action | I understand what not to provide | Entiendo qué información no debo proporcionar | Confirm the collection warning was seen | SYSTEM_FACT; INTERNAL fulfillment evidence; FULFILLMENT_AUDIT_TBD |

The acknowledgement is a content-safety control, not marketing consent, Terms acceptance, privacy-notice acknowledgement, or recording/transcription consent.

### 6.8 Structured object contracts

#### baseline_metrics item

| Key | Required | Validation |
|---|---:|---|
| metric_id | Yes | One success_measure value other than not_currently_measured |
| value_band_or_text | Yes | 1–80 characters; no customer-level records |
| unit | Yes | 1–40 characters |
| period | Yes | 1–40 characters |
| quality | Yes | measured or estimated |

If baseline_availability is not_measured or unknown, baseline_metrics MUST be absent. A supplied metric does not authorize financial claims or guaranteed ROI.

#### workflow_steps item

| Key | Required | Validation |
|---|---:|---|
| step_id | Yes | Stable within the questionnaire version; generated by the system |
| sequence | Yes | Unique integer from 1 through item count |
| step_label | Yes | 2–80 characters |
| owner_role | Yes | 2–80 characters; role only, no personal name |
| work_mode | Yes | manual, mixed, or automated |
| system_category | Yes | One system_category value or none |

Sequences MUST be contiguous and deterministic. Duplicate step IDs or sequence values are rejected.

#### system_inventory item

| Key | Required | Validation |
|---|---:|---|
| category_id | Yes | One selected system_category other than none |
| product_label | No | 2–80 characters; public product name only |
| purpose | Yes | 2–120 characters |

Account IDs, URLs containing tokens, credentials, screenshots, exports, and connection instructions are prohibited.

## 7. Canonical enum registry

Unknown enum IDs are rejected. Display labels are localized; these IDs are stored in both languages.

| Enum | Allowed IDs |
|---|---|
| participant_role | owner_executive, department_leader, manager, operator, advisor, other |
| decision_authority | final_decision, shared_decision, recommender, contributor |
| assessment_scope | entire_business, department, single_workflow, single_location, other |
| industry_category | professional_services, home_field_services, health_wellness, retail_ecommerce, hospitality_food, real_estate_property, financial_insurance, education_training, manufacturing_distribution, nonprofit_community, technology_software, other |
| business_model | b2b, b2c, b2g, nonprofit, internal_service, marketplace, other |
| service_delivery_mode | onsite, field, remote, ecommerce, hybrid, other |
| objective and outcome | respond_faster, convert_more, reduce_manual_work, improve_customer_experience, organize_systems_data, improve_reporting, scale_capacity, reduce_errors_rework, identify_ai_priorities, other |
| priority_horizon | now_to_30_days, days_31_to_90, months_3_to_6, months_6_to_12, exploring |
| success_measure | response_time, conversion_rate, cycle_time, manual_hours, error_rate, customer_satisfaction, on_time_completion, throughput, data_completeness, visibility, not_currently_measured, other |
| baseline_availability | measured, estimated, not_measured, unknown |
| constraint | budget, timeline, staff_capacity, security, privacy, regulatory, customer_experience, system_limit, vendor_contract, change_readiness, other, none |
| workflow_area | lead_intake, follow_up, scheduling, sales_quotes, customer_service, billing_collections, reporting, marketing, data_entry, internal_coordination, other |
| workflow_frequency | ad_hoc, daily, weekly, monthly, seasonal, continuous, unknown |
| workflow_volume | zero_to_10, eleven_to_50, fifty_one_to_200, two_hundred_one_to_1000, over_1000, unknown |
| handoff_count | zero, one_to_2, three_to_5, six_plus, unknown |
| exception_frequency | rare, sometimes, often, most_cases, unknown |
| bottleneck | waiting, manual_entry, duplicate_work, missing_information, approval_delay, system_switching, inconsistent_follow_up, staff_capacity, quality_rework, limited_reporting, other, unknown |
| delay_band | under_15_minutes, fifteen_to_60_minutes, one_to_4_hours, same_day, one_to_3_days, over_3_days, unknown, not_applicable |
| manual_effort | under_2_hours_week, two_to_5_hours_week, six_to_10_hours_week, eleven_to_20_hours_week, over_20_hours_week, unknown |
| rework_frequency | rare, monthly, weekly, daily, unknown |
| system_category | crm, spreadsheet, email, calendar, phone_messaging, project_work, helpdesk, marketing, sales, ecommerce, finance_billing, document_storage, custom_database, other, none |
| integration_state | fully_integrated, partially_integrated, mostly_separate, manual_transfer, not_applicable, unknown |
| data_source | crm, forms, email, spreadsheet, calendar, phone_messages, finance, ecommerce, website_analytics, support, documents, other, none |
| data_quality_state | reliable, minor_gaps, significant_gaps, not_assessed, unknown |
| data_access_state | authorized_available, authorized_partial, owner_approval_needed, unavailable, unknown |
| regulated_data | personal_contact, customer_financial, health_related, children, biometric, government_id, precise_location, credentials, other, none, unknown |
| change_capacity | none_available, under_2_hours_week, two_to_5_hours_week, six_to_10_hours_week, over_10_hours_week, unknown |
| implementation_timing | now_to_30_days, days_31_to_90, months_3_to_6, months_6_to_12, exploring |
| investment_constraint | no_budget_planned, high_cost_sensitivity, estimate_needed, approved_budget_exists, prefer_no_new_tools, unknown |

For success_measure, not_currently_measured is exclusive. For constraint, system_category, data_source, and regulated_data, none is exclusive. For regulated_data, none and unknown are mutually exclusive.

## 8. Questionnaire state and recovery

| State | Deterministic rule |
|---|---|
| NOT_STARTED | No paid questionnaire version exists |
| IN_PROGRESS | At least one valid field saved; required set incomplete |
| INVALID | Submission contains a schema, type, enum, text, object, or compatibility error |
| QUESTIONNAIRE_COMPLETE | Every R field is valid, structured-object constraints pass, acknowledgement is true, and server records a versioned submission |
| CORRECTION_REQUIRED | Interview or review identifies a blocking contradiction or missing core field |
| CORRECTED | Customer submits a new valid version linked to the prior version |

Save/resume MUST:

- use authenticated order-level authorization;
- use optimistic version or equivalent conflict protection;
- be idempotent for repeated saves;
- preserve last confirmed valid values and identify rejected fields;
- return only the current customer's order data;
- survive normal interruption without starting the report SLA;
- avoid analytics or logs containing raw field values.

A support actor may help explain a field or restore access. Support MUST NOT fill an answer from inference. Any authorized staff correction must retain actor, reason, before/after field IDs, timestamps, and customer confirmation where required.

If a schema changes, the application MUST use a reviewed deterministic migration or require explicit reconfirmation. It MUST NOT silently coerce removed values.

## 9. Interview content contract

### 9.1 Route and duration

The interview MAY last up to approximately 45 minutes. It is adaptive only within the ten fixed objectives below. Adaptation selects which approved probe is needed; it does not expand the assessment into implementation consulting or unrestricted discovery.

Before any recording or transcription:

- the selected-language disclosure and applicable version must be shown or spoken;
- the required affirmative consent state must be recorded;
- the session environment, order, participant role, language, and route must match;
- capture must remain off until the approved state is true.

If consent is declined or unavailable, the system MUST NOT record or transcribe first. It routes to support or a recovery path that is explicitly enabled by the approved Legal/Voice/Operations configuration. No recovery path is assumed merely because this contract names it.

### 9.2 Required interview objectives

| ID | Objective | Required closure |
|---|---|---|
| PI-I01 | Confirm participant role, authority, scope, and who must validate material decisions | Authority and scope supported, or blocking follow-up |
| PI-I02 | Confirm the primary objective, intended operational outcome, and horizon | At least one supported objective |
| PI-I03 | Walk through the primary workflow from trigger to outcome | Trigger, outcome, and at least two ordered steps supported |
| PI-I04 | Clarify handoffs, exceptions, bottleneck, delay, manual effort, and rework | At least one friction or an explicit supported no-friction statement |
| PI-I05 | Confirm system categories, connection state, data sources, quality, and authorized-access constraints | Landscape explicitly supported, including allowed unknowns |
| PI-I06 | Distinguish measured, estimated, and unknown volume, timing, and baseline values | Each material quantity typed; unknown is permitted |
| PI-I07 | Confirm constraints, regulated-data categories, risks, capacity, and dependencies | Constraints explicitly supported, including none or unknown |
| PI-I08 | Test opportunity hypotheses against evidence without prescribing implementation | Each retained hypothesis supported, rejected, or marked unknown |
| PI-I09 | Resolve or explicitly classify material questionnaire/interview contradictions and required follow-ups | Zero unresolved blocking contradictions |
| PI-I10 | Confirm report boundaries, selected language, evidence limitations, and next-step expectations | Customer-facing scope acknowledged |

### 9.3 Interview evidence item

Each normalized item contains:

| Field | Rule |
|---|---|
| evidence_id | Immutable opaque identifier |
| objective_id | One PI-I01 through PI-I10 |
| subject_id | Canonical questionnaire field, workflow step, or assessment-scope ID |
| source_type | questionnaire, interview, approved_recovery, or system |
| source_locator | Version plus response segment or permitted timestamp reference; never a secret URL |
| language | en or es |
| evidence_state | CUSTOMER_FACT, SYSTEM_FACT, INFERENCE, ASSUMPTION, RECOMMENDATION, or UNKNOWN |
| assertion_status | confirmed, estimated, disputed, unknown, or not_applicable |
| normalized_value | Language-neutral structured value where the contract defines one |
| text_excerpt | Optional bounded customer statement; no hidden prompt or unrestricted transcript copy |
| created_at | Server timestamp |
| supersedes | Prior evidence ID when corrected |

Interview language or model output MUST NOT upgrade INFERENCE, ASSUMPTION, or UNKNOWN to a fact. CUSTOMER_FACT means the customer said it; it does not mean independently verified truth.

### 9.4 Probe and stop rules

The interview MAY ask a bounded clarification when:

- a required objective lacks closure;
- a structured answer and spoken answer conflict;
- a quantity lacks measured/estimated/unknown qualification;
- a workflow step, handoff, system, data source, constraint, or owner role is unclear;
- a proposed opportunity lacks a source link.

It MUST stop or redirect when:

- the participant starts providing prohibited data from section 4;
- valid recording/transcription permission is absent or withdrawn;
- identity, authorization, order access, or environment becomes uncertain;
- the customer asks for regulated advice, implementation execution, credentials, or a guaranteed result;
- the session reaches its approved duration or a safety/security hold is raised.

The safe redirect records only a reason code and support path, not the prohibited content.

## 10. Interview and recovery states

| State | Meaning |
|---|---|
| INTERVIEW_NOT_STARTED | No session started |
| DISCLOSURE_PENDING | Required disclosure/decision incomplete; capture off |
| CONSENT_DECLINED | Capture remains off; support/recovery eligibility evaluated |
| INTERVIEW_IN_PROGRESS | Approved route active |
| INTERVIEW_PARTIAL | Session ended before all objective closures |
| INTERVIEW_COMPLETE | All ten objective records close under the approved route |
| RECOVERY_REQUIRED | Blocking objective or technical interruption remains |
| RECOVERY_IN_PROGRESS | Approved written or facilitated recovery is active |
| RECOVERY_COMPLETE | Approved recovery closes the same required objective set |
| SUPPORT_BLOCKED | No currently approved route can safely complete inputs |

An approved recovery contract MUST:

- identify its version, owner, language, and legal/operations approval;
- collect the same missing objective IDs, not a looser substitute;
- preserve the source as approved_recovery;
- require authenticated order access;
- prohibit recording/transcription if that permission is absent;
- create the same contradiction and follow-up checks.

Written structured follow-up and authorized non-recorded facilitator notes are candidate routes, but they are disabled in production until explicitly approved. Synthetic test fixtures MAY exercise them.

## 11. Evidence sufficiency and contradictions

### 11.1 Mandatory core

The input set cannot complete unless it contains:

1. supported participant authority and assessment scope;
2. at least one supported primary objective and target outcome;
3. one primary workflow with supported trigger, desired outcome, and at least two ordered current steps;
4. at least one supported friction statement or a supported statement that no current friction was identified;
5. explicit system/data landscape closure, even when individual values remain UNKNOWN;
6. explicit constraints/capacity closure, including supported none or unknown values;
7. language and report-boundary acknowledgement;
8. source links and contract versions for all material evidence.

Optional numeric baselines, product labels, exact delay, exact manual effort, stakeholder roles, dependencies, risks, and additional context may remain absent. Their absence MUST limit claims rather than block completion.

### 11.2 Contradiction states

| State | Rule |
|---|---|
| NO_CONFLICT | Sources agree or cover different facts |
| NONBLOCKING_DIFFERENCE | Difference does not change scope, objective, workflow, evidence safety, or completion |
| BLOCKING_CONFLICT | Difference changes a mandatory-core item or creates consent/access uncertainty |
| RESOLVED_CUSTOMER_CONFIRMED | Customer explicitly confirms the current version |
| RESOLVED_UNKNOWN | Sources cannot be reconciled; output retains UNKNOWN and any affected claim is limited |

A blocking conflict prevents completion until it reaches one of the two resolved states. The system MUST preserve both source items and the resolution; it MUST NOT overwrite history or choose whichever answer appears last.

### 11.3 Follow-up classes

| Class | Completion effect |
|---|---|
| BLOCKING_REQUIRED_FIELD | Blocks until a valid customer answer exists |
| BLOCKING_CORE_EVIDENCE | Blocks until mandatory core is supported or explicitly resolved under this contract |
| BLOCKING_CONSENT_ACCESS | Blocks until an approved route exists |
| BLOCKING_CONTRADICTION | Blocks until resolved |
| NONBLOCKING_CLARIFICATION | Does not block; affected output remains limited |
| OPTIONAL_ENRICHMENT | Does not block and cannot be presented as required |

Every follow-up has an ID, objective/field target, class, reason code, status, owner role, created timestamp, resolution evidence, and closed timestamp.

## 12. Deterministic ASSESSMENT_INPUTS_COMPLETE rule

### 12.1 Predicate

The server may create ASSESSMENT_INPUTS_COMPLETE only when every predicate is true:

| Predicate | Required value |
|---|---|
| Environment/order | Same environment and order throughout |
| Payment | PAYMENT_CONFIRMED |
| Account authorization | Required 18+ authorized-business-representative evidence present |
| Questionnaire | Latest version is QUESTIONNAIRE_COMPLETE |
| Interview route | INTERVIEW_COMPLETE or RECOVERY_COMPLETE |
| Objective closure | Exactly PI-I01 through PI-I10 each has a valid latest closure |
| Mandatory core | All eight section 11.1 conditions pass |
| Blocking follow-ups | Count is zero |
| Blocking conflicts | Count is zero |
| Holds | No active fraud, security, safety, consent, access, or customer-action hold |
| Versions | Supported schema, objectives, evidence, and completion versions recorded |
| Integrity | Evidence snapshot validates and all source references belong to the order |

The predicate is a server-owned pure decision over stored state. A client, model, interviewer, or payment processor cannot directly set the completion state.

### 12.2 Atomic event

On the first true evaluation, the server atomically records:

- order and assessment IDs;
- prior and new state;
- completion timestamp;
- environment;
- questionnaire, interview/recovery, evidence, and rule versions;
- immutable evidence-snapshot digest;
- objective closure IDs;
- resolution and follow-up summary counts;
- triggering actor/system and idempotency reference.

Repeated evaluation with the same state returns the existing event. It MUST NOT create a second SLA start.

The completion timestamp starts the five-U.S.-business-day report SLA. Due-date calculation is owned by the SLA/calendar contract: America/Los_Angeles, 5:00 p.m., with U.S. federal holidays excluded.

### 12.3 Corrections after completion

The original completion event is immutable. A later customer correction:

1. creates a new questionnaire or evidence version;
2. records what changed, by whom, and why;
3. evaluates whether analysis/report work must pause or regenerate;
4. creates ASSESSMENT_INPUTS_ADJUSTED or a documented hold/resume event;
5. never rewrites the original start evidence.

Any due-date adjustment must follow the approved SLA rules. Internal rework cannot be mislabeled as a customer-action hold.

## 13. Customer-facing scope

Before questionnaire start, the selected-language experience MUST explain:

- the assessment is $299 one time and implementation is separate;
- the questionnaire and an interview or approved recovery are required;
- the interview may take up to approximately 45 minutes;
- what categories of operational information are requested;
- what information must not be supplied;
- saved progress, correction, interruption, and support behavior;
- that missing or uncertain evidence will be marked, not invented;
- that the deliverable includes evidence-linked analysis, approximately 8–15 recommendations when justified, a relative Impact vs. Effort Matrix, a 30–90 day roadmap, a reviewed report, and a 30-minute results consultation under the approved rules;
- that recommendations are not guaranteed outcomes or legal, tax, accounting, investment, or other regulated advice.

Progress UI MUST distinguish:

- questionnaire saved;
- questionnaire incomplete;
- questionnaire complete;
- interview pending/in progress/partial/complete;
- customer action or approved recovery required;
- inputs complete and report due date established.

The application MUST NOT claim that analysis is complete, a report is ready, or the SLA started before the canonical state actually exists.

## 14. Paid deliverable coverage

| Paid output | Minimum input/evidence coverage |
|---|---|
| Executive summary | Scope, objective, workflow, main friction, constraints, and evidence limitations |
| Problem/opportunity inventory | Workflow steps, friction, exceptions, systems/data, and PI-I08 outcomes |
| Approximately 8–15 recommendations | At least one valid evidence link per recommendation; fewer allowed when evidence does not justify more |
| Impact vs. Effort Matrix | Relative operational impact evidence plus steps, systems, dependencies, risk, and capacity evidence |
| 30–90 day roadmap | Priority horizon, process-owner role, change capacity, dependencies, constraints, and recommendation sequence |
| Professional reviewed report | All mandatory core, typed evidence states, limitations, traceability, language, and human approval downstream |
| Results consultation | Delivered approved report and bounded clarification scope; no implementation work included |

When optional baseline or financial evidence is absent, the report MUST NOT invent ROI, loss, savings, payback, or numeric benefit. When system product labels are absent, recommendations remain category-level and vendor neutral. When evidence is contradictory or unknown, the report labels the limitation.

## 15. Bilingual parity

English and Spanish MUST share:

- field IDs, enum IDs, types, required/optional flags, limits, and validation codes;
- objective IDs, closure rules, follow-up classes, evidence states, and completion predicate;
- order, access, save/resume, recovery, and version semantics;
- deliverable coverage and prohibited-content boundaries.

Language-specific labels, prompts, and disclosures are separately versioned. They must be reviewed for equivalent meaning, readability, accessibility, and legal effect where applicable. Machine translation alone is not production approval.

A language switch:

- preserves the same questionnaire and evidence versions;
- does not create a second order, interview, or completion event;
- does not change required fields or interpretation;
- preserves source language on evidence while storing language-neutral normalized IDs.

Equivalent English and Spanish evidence MUST produce the same completion decision and downstream structured evidence.

## 16. Validation codes

| Code | Condition |
|---|---|
| PA_ERR_SCHEMA_VERSION | Unsupported questionnaire or object version |
| PA_ERR_UNKNOWN_FIELD | Unrecognized field |
| PA_ERR_REQUIRED_FIELD | Required field missing |
| PA_ERR_UNKNOWN_ENUM | Unknown canonical enum ID |
| PA_ERR_WRONG_TYPE | Incorrect scalar, list, object, or Boolean type |
| PA_ERR_DUPLICATE_VALUE | Duplicate multi-select or structured-object ID |
| PA_ERR_INCOMPATIBLE_VALUES | Exclusive value combined with another value |
| PA_ERR_TEXT_LENGTH | Text outside its allowed bounds |
| PA_ERR_OBJECT_CARDINALITY | Too few or too many structured items |
| PA_ERR_OBJECT_SEQUENCE | Workflow-step IDs or sequences invalid |
| PA_ERR_PROHIBITED_DATA | Prohibited data detected or reported |
| PA_ERR_ORDER_ACCESS | Actor is not authorized for the order |
| PA_ERR_ENVIRONMENT | Test/live or order environment mismatch |
| PA_ERR_CAPTURE_CONSENT | Recording/transcription capture not authorized |
| PA_ERR_OBJECTIVE_OPEN | Required interview objective lacks closure |
| PA_ERR_CORE_EVIDENCE | Mandatory core is incomplete |
| PA_ERR_BLOCKING_FOLLOWUP | Blocking follow-up remains open |
| PA_ERR_BLOCKING_CONFLICT | Blocking contradiction remains unresolved |
| PA_ERR_ACTIVE_HOLD | Blocking hold is active |
| PA_ERR_COMPLETION_INVARIANT | Completion event would violate the predicate or integrity check |

Errors sent to logs or analytics contain only code, field/objective ID, pseudonymous correlation reference, version, and environment. They exclude raw questionnaire/interview content and personal contact data.

## 17. Analytics and audit boundary

Product analytics MAY include only:

- pseudonymous order/assessment reference;
- event name and timestamp;
- selected language;
- section/field/objective ID;
- completion percentage or required-missing count;
- validation code;
- state and contract versions;
- session duration band;
- route and recovery status;
- completion and hold reason category.

Analytics MUST NOT contain answers, free text, workflow steps, system names, transcript/audio, evidence excerpts, contact information, payment-form data, report content, or Stripe secrets.

Audit evidence for consent, access, correction, completion, and report approval is stored separately from product analytics and uses least privilege.

## 18. Required acceptance vectors

| Vector | Scenario | Expected result |
|---|---|---|
| PA-V001 | Valid required questionnaire, all optional fields absent, ten objectives closed, mandatory core supported, no holds | ASSESSMENT_INPUTS_COMPLETE once |
| PA-V002 | Same canonical evidence in English and Spanish | Identical structured state and completion decision |
| PA-V003 | One required field absent | QUESTIONNAIRE_COMPLETE false; PA_ERR_REQUIRED_FIELD |
| PA-V004 | Unknown enum, duplicate multi-select, or none plus another value | Invalid; no completion |
| PA-V005 | Optional baselines, system names, effort, risks, and additional context absent | May complete; affected claims remain limited |
| PA-V006 | Secondary quantity explicitly unknown and PI-I06 closes UNKNOWN | May complete when mandatory core otherwise passes |
| PA-V007 | Primary workflow lacks trigger, outcome, or two ordered steps | Mandatory core fails |
| PA-V008 | Interview ends after nine objectives | INTERVIEW_PARTIAL; no completion |
| PA-V009 | Capture consent absent or declined and no approved recovery enabled | Capture off; SUPPORT_BLOCKED; no completion |
| PA-V010 | Approved written recovery closes the exact missing objectives | RECOVERY_COMPLETE may satisfy route predicate |
| PA-V011 | Questionnaire/interview conflict changes primary objective or workflow and is unresolved | BLOCKING_CONFLICT; no completion |
| PA-V012 | Same conflict explicitly resolved to customer-confirmed or unknown with output limitation | Conflict no longer blocks |
| PA-V013 | Active fraud, security, consent, access, or customer-action hold | No completion |
| PA-V014 | Test payment event attempts to unlock live order | PA_ERR_ENVIRONMENT; no live access |
| PA-V015 | Repeat identical completion evaluation | Same immutable event; no second SLA start |
| PA-V016 | Customer corrects evidence after completion | New version and adjustment event; original completion preserved |
| PA-V017 | Support tries to enter an inferred customer answer | Authorization/actor rule rejects it |
| PA-V018 | Prohibited credential, payment, sensitive file, or raw customer list is offered | Stop collection, omit payload, safe warning/support route |
| PA-V019 | Analytics/log inspection across success and failure fixtures | No raw answers, content, contact, transcript/audio, or secrets |
| PA-V020 | Required source reference points to another order | Integrity failure; no completion |
| PA-V021 | Completion timestamp falls before questionnaire/interview evidence | Invariant failure |
| PA-V022 | Optional evidence is missing but generator attempts quantified ROI | Output validation rejects the claim |

QA MUST test every required field independently, every enum and exclusive-value rule, workflow item counts 2 and 12 plus out-of-range cases, all interview/recovery states, every blocking predicate, idempotency, correction lineage, bilingual parity, object authorization, and analytics redaction.

## 19. Downstream assignments

| Owner | Required implementation detail |
|---|---|
| LS-002 / LS-003 | Field inventory adoption; public notices; voice consent/recovery; retention/deletion schedule; rights and sensitive-category treatment |
| UX | Accessible bilingual form, progress, warnings, errors, resume, conflict, and recovery surfaces |
| English and Spanish Voice | Approved prompts/probes for PI-I01–PI-I10, stop rules, parity fixtures, and consent-safe routing |
| Backend/Data | Versioned schemas, authorization, save/resume, evidence graph, conflicts, follow-ups, pure completion predicate, immutable event |
| Analysis Engine | Evidence-state preservation, source traceability, unknown handling, output sufficiency and prohibited-claim gates |
| Report/PDF | Deliverable coverage, limitations, language, lineage, and human-review boundary |
| Lifecycle/Support | Transactional reminders, approved recovery, suppression, status explanations, and no invented answers |
| QA/Analytics/Release | Acceptance vectors, payload scans, environment separation, accessibility, parity, and pre-live evidence |

## 20. Change control and acceptance

A major version is required for any change to:

- field ID, enum ID, required status, structured-object shape, or prohibited-data boundary;
- interview objective, closure rule, recovery eligibility, or mandatory core;
- evidence state, contradiction/follow-up class, or completion predicate;
- customer-facing paid scope or deliverable coverage.

Every change requires migration/reconfirmation behavior, field-inventory update, bilingual parity evidence, privacy/security review, and complete regression results.

Acceptance checklist:

- [x] Minimum extended questionnaire and stable canonical IDs defined.
- [x] Every field has requirement level, type, purpose, evidence state, classification, access, retention placeholder, and deletion rule.
- [x] Optional fields cannot become hidden completion requirements.
- [x] Ten bounded interview objectives and stop/probe rules defined.
- [x] Missing, estimated, disputed, contradictory, and unknown evidence remain explicit.
- [x] Partial save/resume, correction, interruption, and approved recovery behavior defined.
- [x] Mandatory core supports every approved paid deliverable without unnecessary sensitive data.
- [x] ASSESSMENT_INPUTS_COMPLETE is a deterministic server predicate and immutable event.
- [x] English and Spanish share identical structure and decision behavior.
- [x] Analytics and logs exclude content and secrets.
- [x] Test/live and Stripe-secret boundaries remain fail closed.

## Handoff Summary

- **Task:** PS-004 — Paid Assessment Content Contract.
- **Status:** REVIEW; requires independent PR review and merge.
- **Files changed:** This deliverable and five Product Strategy operating records.
- **Decisions proposed:** Canonical paid questionnaire, ten interview objectives, mandatory evidence core, approved-recovery interface, and deterministic completion predicate.
- **Decisions approved:** Existing $299 scope, approximately 45-minute interview ceiling, evidence states, paid outputs, human review, five-business-day SLA, bilingual parity, and implementation separation.
- **Open questions:** Production legal/recording text, enabled recovery route, exact retention, vendors, and operations configuration remain downstream.
- **Dependencies:** Approved PS-003, LS-001, G1 PASS, and approved owner decisions.
- **Validation performed:** Field-purpose/evidence coverage, required/optional closure, deliverable trace, prohibited-data minimization, state and completion truth-table review, bilingual structural parity, analytics/log boundary, test/live isolation, and live-payment fail-closed review.
- **Recommended next task:** After merge, combine this contract with FA-001 in LS-002 and use it for UX, Voice, Backend, Analysis, Report, Lifecycle, and QA contracts.
