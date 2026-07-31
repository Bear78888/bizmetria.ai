# BizMetria Free Audit and AI Opportunity Score Contract v1.0

**Task:** FA-001 — Free Audit and Score Contract \
**Version:** 1.0.0 \
**Status:** REVIEW \
**Owner workstream:** 04 — Free Audit and Lead Scoring \
**Prepared:** 2026-07-31 \
**Source baseline:** main at 76fa28e621d59a741f4adf663ed5176867f91b22 \
**Branch:** task/ws-04/FA-001-free-audit-score-contract \
**Pull request:** Pending creation

## 1. Purpose and authority

This contract is the canonical implementation boundary for the bilingual free AI Opportunity Check. It defines:

- exactly eleven business-question topics;
- stable language-neutral question and answer IDs;
- English and Spanish display copy;
- strict validation and incomplete-state behavior;
- a deterministic five-block score from 0 through 100;
- deterministic score bands, observations, and opportunity-area selection;
- the free-versus-paid content boundary;
- version, analytics, privacy, and security requirements;
- executable regression vectors for backend, frontend, and QA.

The contract implements PR-FREE-001 through PR-FREE-010 and the applicable PR-CONSENT, PR-EVENT, and PR-DATA requirements from the approved Product Requirements Baseline. It closes OPEN-009 when this artifact is reviewed and merged.

This is a product and data contract, not legal advice. Public notices, consent wording, retention periods, and Spanish legal text remain subject to LS-002 and qualified review before production use.

## 2. Normative language and contract versions

MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are normative.

| Contract surface | Canonical version |
|---|---|
| Question and answer schema | free-audit-schema/1.0.0 |
| Point and domain rules | ai-opportunity-score/1.0.0 |
| Free-result selection | free-result/1.0.0 |
| English/Spanish product copy | free-audit-copy/en-es/1.0.0 |

Every stored answer set and computed result MUST retain all four versions. A result MUST be reproducible from its canonical answers and versions without using a language model, random value, current locale, customer identity, campaign, or processor state.

## 3. Canonical envelope and separation

The logical request is separated into four domains:

| Domain | Contents | May affect score |
|---|---|---:|
| assessment | Eleven canonical answer values and permitted Q01 context | Yes, only as defined in section 8 |
| contact | Name, business name, website, email, phone, preferred language | No |
| consent | Separate, versioned email and SMS decisions and evidence | No |
| attribution | Campaign, source, referral, and promotion identifiers | No |

The server MUST accept and persist these domains separately. The scoring function MUST receive only the canonical assessment object and contract versions. A client-supplied score, block score, band, detected domain, observation, or opportunity-area list MUST be ignored and recomputed by the server.

The assessment object has exactly these eleven required question IDs:

| Order | Question ID | Type | Scoring use |
|---:|---|---|---|
| 1 | business_type | single enum plus conditional context | None |
| 2 | team_size | single enum | None |
| 3 | monthly_new_inquiries | single enum | None |
| 4 | lead_channels | enum array | Opportunity Breadth |
| 5 | first_response_speed | single enum | Lead Response and Follow-Up |
| 6 | customer_tracking_system | single enum | Systems and Data |
| 7 | manual_work_areas | enum array | Manual Work and Opportunity Breadth |
| 8 | unconverted_lead_follow_up | single enum | Lead Response and Follow-Up and Opportunity Breadth |
| 9 | primary_business_problem | single enum | Opportunity Breadth lookup only |
| 10 | desired_90_day_outcome | single enum | Opportunity Breadth lookup only |
| 11 | improvement_urgency | single enum | Strategic Priority and Urgency |

No question is branched away. Draft progress MAY be saved, but all eleven answers MUST be valid before a score is computed.

## 4. Bilingual question schema

The English and Spanish interfaces MUST emit the same canonical IDs, types, order, validation codes, and stored values. Display labels never enter the scoring function.

### Q01 — business_type

**English:** What type of business do you operate? \
**Español:** ¿Qué tipo de negocio opera?

| Answer ID | English label | Etiqueta en español |
|---|---|---|
| professional_services | Professional services | Servicios profesionales |
| home_field_services | Home or field services | Servicios a domicilio o en campo |
| health_wellness | Health and wellness | Salud y bienestar |
| retail_ecommerce | Retail or e-commerce | Comercio minorista o electrónico |
| hospitality_food | Hospitality or food service | Hospitalidad o servicio de alimentos |
| real_estate_property | Real estate or property services | Bienes raíces o servicios de propiedades |
| financial_insurance | Financial or insurance services | Servicios financieros o de seguros |
| education_training | Education or training | Educación o capacitación |
| manufacturing_distribution | Manufacturing or distribution | Manufactura o distribución |
| nonprofit_community | Nonprofit or community organization | Organización sin fines de lucro o comunitaria |
| technology_software | Technology or software | Tecnología o software |
| other | Other | Otro |

When other is selected, business_type_other is required, trimmed, and limited to 2–80 Unicode characters. It MUST be stored as context, MUST NOT affect score or detected domains, and MUST display a warning not to include personal, payment, health, credential, or other sensitive information. It MUST be absent for every other answer ID.

### Q02 — team_size

**English:** How large is your team? \
**Español:** ¿Cuál es el tamaño de su equipo?

| Answer ID | English label | Etiqueta en español |
|---|---|---|
| solo | Just me | Solo yo |
| team_2_5 | 2–5 people | 2–5 personas |
| team_6_10 | 6–10 people | 6–10 personas |
| team_11_25 | 11–25 people | 11–25 personas |
| team_26_50 | 26–50 people | 26–50 personas |
| team_51_plus | 51 or more people | 51 personas o más |

### Q03 — monthly_new_inquiries

**English:** About how many new customer inquiries do you receive in a typical month? \
**Español:** Aproximadamente, ¿cuántas consultas de clientes nuevos recibe en un mes normal?

| Answer ID | English label | Etiqueta en español |
|---|---|---|
| zero_to_10 | 0–10 | 0–10 |
| eleven_to_30 | 11–30 | 11–30 |
| thirty_one_to_100 | 31–100 | 31–100 |
| one_hundred_one_to_300 | 101–300 | 101–300 |
| over_300 | More than 300 | Más de 300 |
| unknown | I am not sure | No estoy seguro |

### Q04 — lead_channels

**English:** Which channels do you use to communicate with new customers? \
**Español:** ¿Qué canales utiliza para comunicarse con clientes nuevos?

This is a required multi-select with 1–9 unique values.

| Answer ID | English label | Etiqueta en español |
|---|---|---|
| phone | Phone calls | Llamadas telefónicas |
| sms | Text messages | Mensajes de texto |
| email | Email | Correo electrónico |
| website_form | Website forms | Formularios del sitio web |
| web_chat | Website chat | Chat del sitio web |
| social_direct_messages | Social-media direct messages | Mensajes directos en redes sociales |
| marketplace_platform | Marketplace or booking platform | Plataforma de mercado o reservas |
| in_person | In person | En persona |
| other | Other | Otro |

### Q05 — first_response_speed

**English:** How quickly do you usually respond to a new inquiry? \
**Español:** ¿Con qué rapidez suele responder a una consulta nueva?

| Answer ID | English label | Etiqueta en español |
|---|---|---|
| within_5_minutes | Within 5 minutes | En 5 minutos o menos |
| six_to_15_minutes | 6–15 minutes | 6–15 minutos |
| sixteen_to_60_minutes | 16–60 minutes | 16–60 minutos |
| one_to_4_hours | 1–4 hours | 1–4 horas |
| same_day | Later the same day | Más tarde el mismo día |
| next_day_or_later | The next day or later | Al día siguiente o después |

### Q06 — customer_tracking_system

**English:** Where do you mainly track leads and customers? \
**Español:** ¿Dónde registra principalmente los prospectos y clientes?

| Answer ID | English label | Etiqueta en español |
|---|---|---|
| integrated_crm | An integrated CRM used consistently | Un CRM integrado que se usa de forma constante |
| basic_or_partially_used_crm | A basic or partially used CRM | Un CRM básico o usado parcialmente |
| spreadsheet_or_project_tool | A spreadsheet or project tool | Una hoja de cálculo o herramienta de proyectos |
| inbox_notes_or_multiple_places | Inboxes, notes, or several places | Bandejas de entrada, notas o varios lugares |
| no_consistent_system | No consistent system | Ningún sistema constante |

### Q07 — manual_work_areas

**English:** Which areas require too much manual work today? \
**Español:** ¿Qué áreas requieren demasiado trabajo manual actualmente?

This is a required multi-select with 1–11 unique work-area values, or the single value none.

| Answer ID | English label | Etiqueta en español |
|---|---|---|
| lead_intake | Lead intake | Recepción de prospectos |
| follow_up | Follow-up | Seguimiento |
| scheduling | Scheduling | Programación de citas |
| quotes_or_proposals | Quotes or proposals | Cotizaciones o propuestas |
| data_entry | Data entry | Ingreso de datos |
| customer_support | Customer support | Atención al cliente |
| billing_or_collections | Billing or collections | Facturación o cobros |
| reporting | Reporting | Informes |
| marketing | Marketing | Marketing |
| internal_coordination | Internal coordination | Coordinación interna |
| other | Other | Otro |
| none | None of these | Ninguna de estas |

The value none is mutually exclusive with every other Q07 value.

### Q08 — unconverted_lead_follow_up

**English:** What usually happens when a potential customer does not respond or buy right away? \
**Español:** ¿Qué suele ocurrir cuando un cliente potencial no responde o no compra de inmediato?

| Answer ID | English label | Etiqueta en español |
|---|---|---|
| automated_multi_step_follow_up | An automated multi-step follow-up continues | Continúa un seguimiento automatizado de varios pasos |
| consistent_manual_follow_up | We follow up manually and consistently | Damos seguimiento manual de forma constante |
| occasional_follow_up | We follow up occasionally | Damos seguimiento de vez en cuando |
| no_defined_follow_up | There is no defined follow-up | No existe un seguimiento definido |

### Q09 — primary_business_problem

**English:** What is the main business problem you want to improve? \
**Español:** ¿Cuál es el principal problema del negocio que desea mejorar?

| Answer ID | English label | Etiqueta en español |
|---|---|---|
| slow_lead_response | Slow response to new inquiries | Respuesta lenta a consultas nuevas |
| lost_or_untracked_leads | Lost or untracked leads | Prospectos perdidos o sin seguimiento |
| too_much_manual_work | Too much manual work | Demasiado trabajo manual |
| inconsistent_follow_up | Inconsistent follow-up | Seguimiento inconsistente |
| disconnected_systems | Disconnected systems | Sistemas desconectados |
| limited_visibility_or_reporting | Limited visibility or reporting | Visibilidad o informes limitados |
| customer_service_capacity | Customer-service capacity | Capacidad de atención al cliente |
| marketing_or_sales_consistency | Marketing or sales consistency | Constancia en marketing o ventas |
| other | Other | Otro |

### Q10 — desired_90_day_outcome

**English:** Which result would matter most over the next 90 days? \
**Español:** ¿Qué resultado sería más importante durante los próximos 90 días?

| Answer ID | English label | Etiqueta en español |
|---|---|---|
| respond_faster | Respond faster | Responder más rápido |
| convert_more_existing_leads | Convert more existing leads | Convertir más prospectos existentes |
| reduce_manual_work | Reduce manual work | Reducir el trabajo manual |
| improve_customer_experience | Improve customer experience | Mejorar la experiencia del cliente |
| organize_data_and_systems | Organize data and systems | Organizar los datos y sistemas |
| improve_reporting | Improve reporting | Mejorar los informes |
| scale_without_equivalent_hiring | Scale without equivalent hiring | Crecer sin aumentar la contratación en la misma proporción |
| identify_best_ai_priorities | Identify the best AI priorities | Identificar las mejores prioridades de IA |
| other | Other | Otro |

### Q11 — improvement_urgency

**English:** When would you like to begin making improvements? \
**Español:** ¿Cuándo le gustaría comenzar a realizar mejoras?

| Answer ID | English label | Etiqueta en español |
|---|---|---|
| just_exploring | I am just exploring | Solo estoy explorando |
| within_6_to_12_months | Within 6–12 months | Dentro de 6–12 meses |
| within_3_to_6_months | Within 3–6 months | Dentro de 3–6 meses |
| within_1_to_3_months | Within 1–3 months | Dentro de 1–3 meses |
| start_now | I want to start now | Quiero comenzar ahora |

## 5. Contact and consent boundary

Contact is a separate step and never enters the score.

| Field | Required for result issuance | Validation | Score impact |
|---|---:|---|---:|
| contact_name | Yes | Trimmed, 1–100 characters | None |
| business_name | Yes | Trimmed, 1–120 characters | None |
| business_website | No | Absolute HTTPS URL, maximum 2,048 characters | None |
| email | Yes | Basic address syntax, maximum 254 characters | None |
| phone | No | Normalizable international number when supplied | None |
| preferred_language | Yes | en or es | None |

Supplying email or phone does not create marketing consent. Email marketing and SMS marketing MUST be separate choices, unchecked by default, and non-blocking for the free result. SMS consent MUST NOT be accepted without a valid phone.

Each recorded consent decision MUST be stored outside the assessment object with:

- purpose ID;
- granted or declined decision;
- notice and copy version;
- selected language;
- affirmative action type;
- server timestamp;
- source surface;
- later withdrawal or suppression state when applicable.

Exact public wording and any optional IP or user-agent evidence remain owned by LS-002. Missing marketing consent always means no marketing permission; it never means granted.

## 6. Validation and incomplete behavior

### 6.1 Canonicalization

Before validation, the server MAY normalize object key order, trim permitted text, normalize Unicode, and sort valid multi-select IDs lexically. It MUST NOT translate labels into IDs, guess an intended answer, coerce unknown values, or silently remove duplicates.

### 6.2 Validation codes

| Code | Condition | Result |
|---|---|---|
| FA_ERR_SCHEMA_VERSION | Missing or unsupported schema version | Reject request |
| FA_ERR_UNKNOWN_FIELD | Unrecognized answer or auxiliary field | Reject request |
| FA_ERR_MISSING_ANSWER | One or more of the eleven answers absent | Do not score |
| FA_ERR_UNKNOWN_ANSWER_ID | Value is outside the applicable enum | Reject value |
| FA_ERR_WRONG_TYPE | Scalar, array, or text type is incorrect | Reject value |
| FA_ERR_EMPTY_MULTISELECT | Q04 or Q07 has no values | Reject value |
| FA_ERR_TOO_MANY_VALUES | Multi-select exceeds its contract maximum | Reject value |
| FA_ERR_DUPLICATE_VALUE | Multi-select repeats an answer ID | Reject value |
| FA_ERR_INCOMPATIBLE_VALUES | Q07 none appears with another value, or Q01 context conflicts | Reject value |
| FA_ERR_TEXT_LENGTH | Permitted context is outside its length limit | Reject value |
| FA_ERR_CONTACT_REQUIRED | Required result-delivery contact is absent | Do not issue result |
| FA_ERR_EMAIL_FORMAT | Email fails basic format validation | Reject contact |
| FA_ERR_PHONE_FORMAT | Supplied phone cannot be normalized | Reject phone |
| FA_ERR_CONSENT_METADATA | A consent record is internally incomplete | Reject consent record only |
| FA_ERR_LOCALE | Locale is not en or es | Reject presentation request |
| FA_ERR_SCORE_INVARIANT | A block or total violates its cap | Fail closed and alert |
| FA_ERR_RESULT_INVARIANT | Result count or locked boundary is invalid | Fail closed and alert |

Validation errors return question or field IDs and codes, not customer answer text in logs or analytics.

### 6.3 State rules

| State | Rule |
|---|---|
| DRAFT | Any subset may be saved securely; no score, band, observation, or areas exist |
| INVALID | Submitted data fails one or more validation rules; no score exists |
| ANSWERS_COMPLETE | All eleven answers are present and valid |
| SCORED | Server computed a result from ANSWERS_COMPLETE using exact versions |
| FREE_RESULT_ELIGIBLE | SCORED plus valid required contact; marketing consent is not required |

An incomplete assessment MUST NOT receive a provisional, estimated, imputed, or model-generated score. Resuming a draft preserves canonical IDs and versions. If its schema version is no longer accepted, a deterministic migration or explicit user reconfirmation is required.

## 7. Fixed scoring inputs

Q01, Q02, and Q03 are required context but contribute zero points and no opportunity domain. Q09 and Q10 have no direct points; they can add only a fixed domain under section 8.5. Contact, language, consent, attribution, promotion, account, payment, and Stripe data are excluded from scoring.

## 8. Deterministic point contract

The score represents reported operational opportunity for improvement. A higher score is not a financial valuation, credit score, business-quality rating, guarantee, or judgment about staff.

### 8.1 Lead Response and Follow-Up — maximum 30

Q05 contributes:

| Answer ID | Points |
|---|---:|
| within_5_minutes | 0 |
| six_to_15_minutes | 3 |
| sixteen_to_60_minutes | 6 |
| one_to_4_hours | 10 |
| same_day | 13 |
| next_day_or_later | 16 |

Q08 contributes:

| Answer ID | Points |
|---|---:|
| automated_multi_step_follow_up | 0 |
| consistent_manual_follow_up | 4 |
| occasional_follow_up | 8 |
| no_defined_follow_up | 14 |

Lead Response and Follow-Up equals Q05 points plus Q08 points and MUST be between 0 and 30.

### 8.2 Manual Work — maximum 25

Count valid Q07 values other than none after validation.

| Qualifying area count | Points |
|---:|---:|
| 0 | 0 |
| 1 | 6 |
| 2 | 12 |
| 3 | 18 |
| 4–11 | 25 |

Manual Work MUST be between 0 and 25.

### 8.3 Systems and Data — maximum 20

| Q06 answer ID | Points |
|---|---:|
| integrated_crm | 0 |
| basic_or_partially_used_crm | 5 |
| spreadsheet_or_project_tool | 10 |
| inbox_notes_or_multiple_places | 15 |
| no_consistent_system | 20 |

Systems and Data MUST be between 0 and 20.

### 8.4 Strategic Priority and Urgency — maximum 15

| Q11 answer ID | Points |
|---|---:|
| just_exploring | 0 |
| within_6_to_12_months | 4 |
| within_3_to_6_months | 8 |
| within_1_to_3_months | 12 |
| start_now | 15 |

Strategic Priority and Urgency MUST be between 0 and 15. It does not represent financial readiness or purchasing intent.

### 8.5 Opportunity Breadth — maximum 10

Create a set of canonical opportunity domains. Each rule adds at most one occurrence; duplicates collapse by domain ID.

| Source | Detection rule | Domain ID |
|---|---|---|
| Q04 | Three or more unique channels | channel_coordination |
| Q05 | sixteen_to_60_minutes, one_to_4_hours, same_day, or next_day_or_later | lead_response |
| Q06 | spreadsheet_or_project_tool, inbox_notes_or_multiple_places, or no_consistent_system | systems_data |
| Q07 | At least one value other than none | manual_operations |
| Q08 | occasional_follow_up or no_defined_follow_up | follow_up |

Q09 uses this closed lookup:

| Q09 answer ID | Domain ID |
|---|---|
| slow_lead_response | lead_response |
| lost_or_untracked_leads | systems_data |
| too_much_manual_work | manual_operations |
| inconsistent_follow_up | follow_up |
| disconnected_systems | systems_data |
| limited_visibility_or_reporting | reporting_visibility |
| customer_service_capacity | service_capacity |
| marketing_or_sales_consistency | marketing_sales |
| other | No domain |

Q10 uses this closed lookup:

| Q10 answer ID | Domain ID |
|---|---|
| respond_faster | lead_response |
| convert_more_existing_leads | follow_up |
| reduce_manual_work | manual_operations |
| improve_customer_experience | customer_experience |
| organize_data_and_systems | systems_data |
| improve_reporting | reporting_visibility |
| scale_without_equivalent_hiring | scaling_capacity |
| identify_best_ai_priorities | ai_prioritization |
| other | No domain |

| Unique domain count | Points |
|---:|---:|
| 0 | 0 |
| 1 | 2 |
| 2 | 4 |
| 3 | 6 |
| 4 | 8 |
| 5 or more | 10 |

Opportunity Breadth equals the smaller of 10 and two times the unique domain count. Free text never creates a domain.

### 8.6 Total and invariant checks

The server computes:

    total =
      lead_response_follow_up
      + manual_work
      + systems_data
      + strategic_priority_urgency
      + opportunity_breadth

Before issuing a result, the server MUST verify:

- every answer passed section 6;
- block values are integers within 30, 25, 20, 15, and 10 respectively;
- total equals the exact block sum;
- total is an integer from 0 through 100;
- the recorded score version is ai-opportunity-score/1.0.0.

Any invariant failure returns no customer result and creates a redacted operational alert.

## 9. Score levels

| Total | Level ID | English label | Etiqueta en español |
|---:|---|---|---|
| 0–24 | focused | Focused AI Opportunity | Oportunidad de IA focalizada |
| 25–44 | moderate | Moderate AI Opportunity | Oportunidad de IA moderada |
| 45–64 | strong | Strong AI Opportunity | Oportunidad de IA considerable |
| 65–79 | high | High AI Opportunity | Oportunidad de IA alta |
| 80–100 | very_high | Very High AI Opportunity | Oportunidad de IA muy alta |

The band is selected only from total using inclusive bounds. Boundary behavior MUST match section 13.

## 10. Free-result selection

### 10.1 Result shape

A successful free result contains exactly:

1. total, five block values, contract versions, and level ID;
2. the visible limitation statement from section 10.2;
3. one observation template selected by level;
4. zero to three general opportunity areas selected deterministically;
5. six locked paid-section labels without protected content;
6. the $299 one-time Business Assessment offer with implementation marked separate.

### 10.2 Limitation statement

**English:** This operational opportunity score is based only on your selected answers. It is not a financial valuation, credit score, business-quality rating, or guarantee of results. \
**Español:** Esta puntuación de oportunidad operativa se basa únicamente en las respuestas seleccionadas. No es una valoración financiera, una puntuación crediticia, una calificación de la calidad del negocio ni una garantía de resultados.

LS-002 and a qualified reviewer MUST approve final public legal copy before production. Until that approval, production publication remains disabled.

### 10.3 Observation templates

| Level ID | English | Español |
|---|---|---|
| focused | Your answers point to a focused set of operational areas worth reviewing. | Sus respuestas señalan un conjunto focalizado de áreas operativas que conviene revisar. |
| moderate | Your answers indicate several operational areas where structured improvements may help. | Sus respuestas indican varias áreas operativas en las que mejoras estructuradas podrían ayudar. |
| strong | Your answers indicate multiple connected opportunities across current operations. | Sus respuestas indican varias oportunidades relacionadas en las operaciones actuales. |
| high | Your answers indicate broad operational opportunities that merit a prioritized review. | Sus respuestas indican amplias oportunidades operativas que merecen una revisión priorizada. |
| very_high | Your answers indicate extensive operational opportunities; a deeper evidence-based assessment can help prioritize them. | Sus respuestas indican oportunidades operativas extensas; una evaluación más profunda basada en evidencia puede ayudar a priorizarlas. |

Exactly one template is selected by level ID. The server does not generate or rewrite this observation.

### 10.4 Opportunity-area ranking

For each nonzero score block, compute normalized value as block points divided by block maximum. Sort descending by normalized value. Resolve equal normalized values by this fixed order:

1. lead_response_follow_up;
2. manual_work;
3. systems_data;
4. strategic_priority_urgency;
5. opportunity_breadth.

Exclude zero-value blocks and return the first three at most. There is no additional display threshold in version 1.0.0.

| Area ID | English label | Etiqueta en español |
|---|---|---|
| lead_response_follow_up | Response and follow-up | Respuesta y seguimiento |
| manual_work | Manual work | Trabajo manual |
| systems_data | Systems and data | Sistemas y datos |
| strategic_priority_urgency | Priority and timing | Prioridad y plazos |
| opportunity_breadth | Connected opportunities | Oportunidades relacionadas |

Area copy MUST remain general. It MUST NOT expose the underlying full answer list, prescribe architecture or vendors, calculate losses or ROI, or provide implementation instructions.

### 10.5 Locked paid-content boundary

The free API MAY return only these locked IDs, localized labels, and locked=true:

| Locked ID | English label | Etiqueta en español |
|---|---|---|
| full_personalized_analysis | Full personalized analysis | Análisis personalizado completo |
| complete_recommendations | Complete recommendations | Recomendaciones completas |
| impact_effort_matrix | Impact vs. Effort Matrix | Matriz de impacto frente a esfuerzo |
| roadmap_30_90_day | 30–90 day roadmap | Hoja de ruta de 30–90 días |
| professional_pdf_report | Professional PDF report | Informe profesional en PDF |
| results_consultation | Results consultation | Consulta de resultados |

Protected paid content MUST NOT be sent in the free response, embedded in client bundles, HTML, accessibility text, source maps, cached preview data, analytics, or hidden DOM elements. Authorization and entitlement checks are server-owned.

### 10.6 Offer boundary

The result presents catalog offer business_assessment at USD 299.00, billing type one_time, with implementation_included=false. This contract contains no Stripe product, Price, account, or key value. Checkout remains owned by the payment contract, and live payment remains fail-closed until all approved live dependencies pass.

## 11. Determinism, idempotency, and storage

- The canonical multi-select representation is a lexically sorted array after successful uniqueness validation.
- A score computation is a pure function of canonical assessment answers plus schema and score versions.
- Repeated computations with identical inputs and versions MUST return byte-equivalent numeric and selection fields.
- English and Spanish requests with the same IDs MUST return identical numeric and selection IDs; only approved labels differ.
- The idempotency key or result identity MUST include the assessment reference and applicable versions.
- Old results MUST NOT be silently recalculated under a new version.
- Recalculation MUST create explicit lineage from prior result to replacement and preserve the reason.
- Score and result records MUST be separable from contact and consent records and deletable under the downstream retention contract.

## 12. Analytics and logging

Allowed product analytics properties are limited to pseudonymous assessment reference, event name, timestamp, locale, question ID, validation code, completion state, schema/score/result/copy versions, total, level ID, selected area IDs, and non-content campaign identifiers where approved.

Analytics, logs, traces, and errors MUST NOT contain:

- raw answers or business_type_other text;
- name, business name, email, phone, or website;
- consent payloads;
- free-text evidence;
- Stripe or payment-form data;
- paid questionnaire, transcript, report, or recommendation content.

Security and audit evidence is stored separately from product analytics. Test fixtures MUST be synthetic.

## 13. Required regression vectors

### 13.1 Base fixture

Unless overridden below, every vector uses:

- business_type = professional_services;
- team_size = solo;
- monthly_new_inquiries = zero_to_10;
- lead_channels = [email];
- first_response_speed = within_5_minutes;
- customer_tracking_system = integrated_crm;
- manual_work_areas = [none];
- unconverted_lead_follow_up = automated_multi_step_follow_up;
- primary_business_problem = other;
- desired_90_day_outcome = other;
- improvement_urgency = just_exploring.

### 13.2 Exact boundary fixtures

LR is Lead Response and Follow-Up, MW is Manual Work, SD is Systems and Data, SP is Strategic Priority and Urgency, and OB is Opportunity Breadth.

| Vector | Overrides from base | LR | MW | SD | SP | OB | Total | Level |
|---|---|---:|---:|---:|---:|---:|---:|---|
| FA-V000 | None | 0 | 0 | 0 | 0 | 0 | 0 | focused |
| FA-V024 | Q06 basic_or_partially_used_crm; Q09 limited_visibility_or_reporting; Q10 improve_customer_experience; Q11 start_now | 0 | 0 | 5 | 15 | 4 | 24 | focused |
| FA-V025 | Q06 inbox_notes_or_multiple_places; Q09 limited_visibility_or_reporting; Q10 improve_customer_experience; Q11 within_6_to_12_months | 0 | 0 | 15 | 4 | 6 | 25 | moderate |
| FA-V044 | Q06 inbox_notes_or_multiple_places; Q07 [lead_intake]; Q09 limited_visibility_or_reporting; Q10 improve_customer_experience; Q11 start_now | 0 | 6 | 15 | 15 | 8 | 44 | moderate |
| FA-V045 | Q06 no_consistent_system; Q07 [lead_intake]; Q11 start_now | 0 | 6 | 20 | 15 | 4 | 45 | strong |
| FA-V064 | Q06 no_consistent_system; Q07 [lead_intake, scheduling, data_entry, reporting]; Q11 start_now | 0 | 25 | 20 | 15 | 4 | 64 | strong |
| FA-V065 | Q04 [phone, email, website_form]; Q06 inbox_notes_or_multiple_places; Q07 [lead_intake, scheduling, data_entry, reporting]; Q09 limited_visibility_or_reporting; Q10 improve_customer_experience; Q11 start_now | 0 | 25 | 15 | 15 | 10 | 65 | high |
| FA-V079 | Q06 inbox_notes_or_multiple_places; Q07 [lead_intake, scheduling, data_entry, reporting]; Q08 no_defined_follow_up; Q09 limited_visibility_or_reporting; Q10 improve_customer_experience; Q11 start_now | 14 | 25 | 15 | 15 | 10 | 79 | high |
| FA-V080 | Q06 no_consistent_system; Q07 [lead_intake, scheduling, data_entry, reporting]; Q08 no_defined_follow_up; Q11 start_now | 14 | 25 | 20 | 15 | 6 | 80 | very_high |
| FA-V100 | Q05 next_day_or_later; Q06 no_consistent_system; Q07 [lead_intake, scheduling, data_entry, reporting]; Q08 no_defined_follow_up; Q09 limited_visibility_or_reporting; Q11 start_now | 30 | 25 | 20 | 15 | 10 | 100 | very_high |

### 13.3 Mandatory behavioral tests

| Test ID | Mutation or property | Expected result |
|---|---|---|
| FA-T001 | Run any valid fixture 100 times | Identical score and selection fields every time |
| FA-T002 | Replace locale en with es without changing IDs | Identical numeric values and selection IDs |
| FA-T003 | Reorder Q04 and Q07 arrays | Identical canonical arrays and result |
| FA-T004 | Repeat any Q04 or Q07 ID | FA_ERR_DUPLICATE_VALUE; no score |
| FA-T005 | Combine Q07 none with another value | FA_ERR_INCOMPATIBLE_VALUES; no score |
| FA-T006 | Remove each question one at a time | FA_ERR_MISSING_ANSWER; no score |
| FA-T007 | Supply an unknown question or answer ID | Applicable unknown-field or unknown-answer error; no score |
| FA-T008 | Mutate Q01, Q02, Q03, contact, locale, consents, attribution, and promotion | Score, band, observation ID, and area IDs unchanged |
| FA-T009 | Test every Q05, Q06, Q08, and Q11 option | Exact documented points |
| FA-T010 | Test Q07 counts 0, 1, 2, 3, 4, and 11 | Points 0, 6, 12, 18, 25, and 25 |
| FA-T011 | Make Q09/Q10 duplicate an existing domain | Domain counted once |
| FA-T012 | Detect 0 through at least 6 unique domains | Breadth values 0, 2, 4, 6, 8, 10, and 10 |
| FA-T013 | Force a block or total outside its cap in a test double | Fail closed with invariant error |
| FA-T014 | Tie normalized nonzero blocks | Fixed priority order is stable |
| FA-T015 | Request free result without required contact | Score may exist; result issuance remains blocked |
| FA-T016 | Decline or omit marketing consent | Free result remains eligible; no marketing permission |
| FA-T017 | Inspect free response, HTML, client state, cache, and analytics | No protected paid content or raw answers |
| FA-T018 | Change a stored result version | No silent recomputation; explicit migration lineage required |

Backend and QA MUST also property-test every allowed answer combination or an exhaustive equivalent over scoring inputs. The test MUST prove integer totals, block caps, overall bounds, and deterministic ranking.

## 14. Recovered-input disposition

The recovered Free Audit Questions v0.1 is approved as the historical source of the eleven topics and answer direction, with these explicit corrections in this contract:

- exact bilingual product copy and stable option IDs are now defined;
- Q01 uses a fixed category enum plus bounded conditional context;
- all eleven answers are required for scoring;
- no question branching exists in version 1.0.0;
- invalid multi-select duplicates are rejected rather than silently removed;
- partial drafts may be saved but never scored.

The recovered AI Opportunity Score v0.1 point table, caps, bands, and block-ranking algorithm are approved and promoted, with these explicit completions:

- Q09 and Q10 use the closed domain lookups in section 8.5;
- zero-value blocks are excluded and there is no extra display threshold;
- validation, invariant, result, and security behavior is now normative;
- the boundary and mutation vectors in section 13 are required.

After this contract is merged and accepted, both recovered documents remain historical evidence and MUST NOT be used as implementation sources. OPEN-009 is resolved by ai-opportunity-score/1.0.0; future score changes require a new version and approved change record.

## 15. Change control

A major version is required for any change to question IDs, answer IDs, required status, scoring eligibility, point values, block caps, domain lookup, score bands, ranking, locked boundary, or result shape.

A copy-only change that preserves semantic parity and canonical IDs may increment the copy version without changing the schema or score version, but production legal and localization review still applies.

Every change MUST include:

- impacted PR-FREE and downstream requirement IDs;
- migration and reproducibility treatment;
- paired English/Spanish regression evidence;
- all boundary and exclusion tests;
- explicit approval before production activation.

## 16. Acceptance checklist

- [x] Exactly eleven question topics are defined.
- [x] English and Spanish copy emits identical canonical IDs.
- [x] All validation and incomplete states fail deterministically.
- [x] Point tables and domain lookups are closed and model-independent.
- [x] Block caps are 30, 25, 20, 15, and 10; total is 0–100.
- [x] Vectors cover 0, 24/25, 44/45, 64/65, 79/80, and 100.
- [x] Identity, contact, industry, language, consent, campaign, and promotion cannot alter scoring.
- [x] One observation and at most three general areas are selected deterministically.
- [x] Paid content is excluded from free payloads and client assets.
- [x] The $299 offer is catalog-only here and contains no Stripe secret or live activation.
- [x] Recovered inputs are explicitly promoted, corrected, and superseded for implementation.
- [x] Production legal/localization, retention, vendor, and live-payment gates remain fail closed.

## Handoff Summary

- **Task:** FA-001 — Free Audit and Score Contract.
- **Status:** REVIEW; requires independent PR review and merge before becoming canonical.
- **Files changed:** This deliverable and Workstream 04 operating records.
- **Decisions proposed:** Promote the recovered point table with fixed Q09/Q10 lookups, strict duplicate rejection, all-eleven completion, zero-only area exclusion, and the bilingual v1 schema.
- **Decisions approved:** Existing 11 topics, caps, score bands, exclusions, deterministic boundary, limited free result, and $299 one-time offer.
- **Open questions:** No scoring question remains for v1. Public legal/consent copy, exact retention, vendors, and production activation remain downstream.
- **Dependencies:** Approved PS-003, LS-001, recovered free-audit inputs, G1 PASS.
- **Validation performed:** Schema count, enum uniqueness, bilingual ID parity, point arithmetic, exact boundary vectors, cap/exclusion analysis, locked-content review, analytics/data separation, and live-payment fail-closed review.
- **Recommended next task:** After merge, mark FA-001 approved, close OPEN-009, and use this contract in UX, backend, analytics, and QA specifications.
