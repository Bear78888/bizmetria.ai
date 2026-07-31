# BizMetria Consent, Claims, and Data Requirements v1.0

**Task:** LS-002 — Consent, Claims, and Data Requirements \
**Version:** 1.0.0 \
**Status:** APPROVED \
**Owner workstream:** 11 — Legal, Privacy and Security \
**Prepared:** 2026-07-31 \
**Source baseline:** main at 71a925375cfc4232f6ca87b6b744938a43608855 \
**Historical branch:** task/ws-11/LS-002-consent-claims-data-requirements \
**Pull request:** [#15](https://github.com/Bear78888/bizmetria.ai/pull/15), merge SHA `a60597ebd3a17c06c923150fb9cf76f24c3a437c`

## 1. Purpose, authority, and legal status

This contract converts the approved Product Requirements, Free Audit contract, Paid Assessment contract, and Legal/Data baseline into testable requirements for:

- notice and consent states;
- customer-facing disclosure modules;
- communication suppression;
- recording, transcription, AI-analysis, and human-review transparency;
- approved, qualified, and prohibited claims;
- exact adoption of known fields into the data inventory;
- privacy-request handling;
- event-based retention and deletion;
- legal, localization, vendor, and production-review gates.

MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are normative.

This is an implementation and issue-spotting contract, not legal advice. It does not approve final Terms, Privacy Policy, Refund Policy, consent copy, a legal entity, a public address, a retention period, a vendor, a jurisdictional conclusion, or live commerce. All customer-facing copy in section 8 is a semantic draft for qualified legal and professional English/Spanish review. Merging this document alone MUST NOT satisfy any `LIVE-DEP` gate.

## 2. Controlling inputs and precedence

The controlling inputs are:

1. [Product Requirements Baseline v1.0](../../02-product-strategy/deliverables/BIZMETRIA_PRODUCT_REQUIREMENTS_v1.0.md);
2. [Free Audit and AI Opportunity Score Contract v1.0](../../04-free-audit-lead-scoring/deliverables/BIZMETRIA_FREE_AUDIT_CONTRACT_v1.0.md);
3. [Paid Assessment Content Contract v1.0](../../02-product-strategy/deliverables/BIZMETRIA_PAID_ASSESSMENT_CONTRACT_v1.0.md);
4. [Legal and Data Inventory Baseline v0.1](BIZMETRIA_LEGAL_DATA_BASELINE_v0.1.md);
5. the approved [Owner Decision Record](../../01-master-control/deliverables/BIZMETRIA_OWNER_DECISION_RECORD_v0.1.md);
6. the central [Decision Log](../../../BIZMETRIA_DECISION_LOG.md).

Later approved product decisions control older recovered material. A qualified legal requirement that is stricter than this implementation baseline controls for the applicable surface and jurisdiction. Until that requirement is versioned and tested, the affected production capability remains disabled.

## 3. Versions and global invariants

### 3.1 Contract versions

| Surface | Canonical version |
|---|---|
| Consent-purpose registry | consent-purpose/1.0.0 |
| Consent evidence schema | consent-evidence/1.0.0 |
| Notice-surface registry | notice-surface/1.0.0 |
| Claims matrix | claims-matrix/1.0.0 |
| Data-class registry | data-class/1.0.0 |
| Rights workflow | privacy-rights/1.0.0 |
| Retention-class registry | retention-class/1.0.0 |
| English/Spanish semantic copy | legal-product-copy/en-es/1.0.0-draft |

Every captured decision, shown notice, sent message, generated claim, privacy request, retention job, and deletion action MUST retain the applicable version. A copy or policy version is immutable after evidence refers to it.

### 3.2 Global requirements

| ID | Requirement |
|---|---|
| `LS-GEN-001` | Missing, expired, unsupported, or contradictory legal configuration MUST fail closed for the affected action. |
| `LS-GEN-002` | English and Spanish MUST use the same purpose IDs, states, required fields, claims classifications, data classes, and rights outcomes. |
| `LS-GEN-003` | A language switch MUST NOT create, grant, revoke, or merge a consent state. |
| `LS-GEN-004` | Product analytics, security audit evidence, consent evidence, customer content, payment metadata, and marketing eligibility MUST remain separate data domains. |
| `LS-GEN-005` | A user-facing checkbox MUST NOT authorize any purpose that is not named in the displayed disclosure and stored purpose record. |
| `LS-GEN-006` | A client, model, vendor callback, or analytics event MUST NOT directly grant consent, mark a right fulfilled, extend retention, or approve a claim. |
| `LS-GEN-007` | Test and staging use synthetic data only. Test consent and Stripe test events MUST NOT authorize live messages, live fulfillment, or production processing. |
| `LS-GEN-008` | No source file, client bundle, log, analytics payload, or document may contain Stripe secrets, webhook secrets, account exports, tax IDs, private addresses, or production customer content. |
| `LS-GEN-009` | Absence of a Stripe live key is a normal safe state. Adding protected live configuration at the final activation stage MUST require no source change. |
| `LS-GEN-010` | The existing intent to serve all 50 states and D.C. is not production authorization; nationwide availability remains disabled until `LIVE-DEP-004` passes. |

## 4. Consent, acknowledgement, and eligibility concepts

The system MUST distinguish consent from acknowledgement, contract acceptance, eligibility evidence, and service necessity.

| Purpose ID | Concept | Default | Required to receive free result | Required to purchase | Withdrawal effect |
|---|---|---|---:|---:|---|
| `email_marketing` | Optional commercial-email permission where used | DENIED | No | No | Suppress marketing email |
| `sms_marketing` | Optional marketing/automated SMS permission where required | DENIED | No | No | Suppress applicable SMS |
| `service_email` | Operational delivery/support classification | NOT_APPLICABLE as consent | Yes, when email delivery is requested | Yes, for order service | Stop marketing; preserve necessary service route subject to law |
| `service_sms` | Optional operational SMS classification | DISABLED | No | No | Suppress applicable SMS unless a reviewed exemption/configuration applies |
| `terms_acceptance` | Versioned contract acceptance | NOT_ACCEPTED | No | Yes before live purchase/account use | Does not erase completed transactions; routes to account closure rules |
| `privacy_notice_ack` | Evidence that a notice was presented/acknowledged | NOT_ACKNOWLEDGED | At collection surface | At collection surface | Not treated as revocable consent |
| `age_authority_affirmation` | 18+ authorized-business-representative eligibility evidence | NOT_AFFIRMED | No paid access | Yes before paid onboarding | Loss of eligibility blocks new paid action and routes to support |
| `voice_recording` | Permission for audio recording where enabled | DENIED | No | No; recovery/support path required | Stop future capture and evaluate deletion/retention rules |
| `voice_transcription` | Permission for transcription where required | DENIED | No | Required only for an approved transcription route | Stop capture/transcription and route safely |
| `ai_content_analysis_notice` | Disclosure/acknowledgement of AI-assisted analysis | NOT_ACKNOWLEDGED | No | Required before paid inputs | Blocks analysis until acknowledged under approved text |
| `human_review_notice` | Disclosure that authorized people review customer content | NOT_ACKNOWLEDGED | No | Required before paid inputs | Blocks new submission when not acknowledged |
| `nonessential_analytics` | Consent/choice when required for optional analytics | DENIED | No | No | Disable affected trackers and propagate choice |
| `sale_sharing_targeted_ads_optout` | Applicable privacy preference, including GPC | OPTED_OUT when signal requires | No | No | Stop affected sale/sharing/targeted-ad processing |

`service_email` and `service_sms` are message-purpose classifications, not blanket consent. Their availability and legal basis require qualified review. Providing contact data never grants marketing permission.

## 5. Consent evidence schema and state machine

### 5.1 Evidence record

Every affirmative, negative, withdrawn, suppressed, or not-applicable decision MUST record:

| Field | Rule |
|---|---|
| `consent_evidence_id` | Immutable opaque ID |
| `subject_ref` | Pseudonymous person/account/lead reference; no email or phone in the record key |
| `purpose_id` | One exact section 4 purpose |
| `decision` | GRANTED, DENIED, WITHDRAWN, SUPPRESSED, ACKNOWLEDGED, ACCEPTED, AFFIRMED, or NOT_APPLICABLE as allowed by purpose |
| `notice_version` | Immutable public notice/copy version actually shown |
| `policy_version_refs` | Applicable Terms/Privacy/Refund or communication-policy versions |
| `language` | en or es |
| `affirmative_action` | Checkbox, button, signed-in confirmation, spoken keypad choice, or another approved action ID |
| `source_surface` | One section 7 surface ID |
| `server_timestamp` | Trusted server time |
| `environment` | test, staging, or production |
| `jurisdiction_context` | User-declared state/country plus derived context kept separate from a legal conclusion |
| `vendor_delivery_refs` | Optional processor evidence IDs; no payload or secret URL |
| `supersedes` | Prior decision ID for the same purpose when changed |
| `withdrawal_method` | STOP, unsubscribe link, preference center, support, reply, browser signal, or other reasonable method when applicable |
| `suppression_scope` | Exact channel/purpose/vendor scope applied |
| `actor` | Customer or explicitly authorized operator/system role |

IP address and user-agent evidence MUST be disabled by default. They MAY be enabled only after necessity, notice, access, and a short retention class are approved.

### 5.2 States

| State | Meaning |
|---|---|
| `UNSEEN` | Required disclosure has not been presented |
| `SHOWN` | Versioned disclosure rendered or spoken; no decision inferred |
| `GRANTED` | Valid affirmative action completed for the exact purpose |
| `DENIED` | User declined or did not opt in where an affirmative opt-in is required |
| `WITHDRAWN` | Previously granted permission was revoked |
| `SUPPRESSED` | Sending/processing disabled by user choice, legal rule, GPC, complaint, or safety operation |
| `EXPIRED` | Approved validity period or policy condition ended |
| `RECONFIRM_REQUIRED` | Material purpose/copy/vendor/use change requires a new action |

### 5.3 Normative consent requirements

| ID | Requirement |
|---|---|
| `LS-CONSENT-001` | Email marketing, SMS, Terms, privacy acknowledgement, age/authority, recording, transcription, AI analysis, human review, and optional analytics MUST be separate records. |
| `LS-CONSENT-002` | Marketing choices MUST be unchecked by default and non-blocking for the free result and purchase. |
| `LS-CONSENT-003` | Missing or invalid evidence evaluates as DENIED, never GRANTED. |
| `LS-CONSENT-004` | SMS permission MUST NOT be recorded without a valid normalized phone number and the exact sender/purpose disclosure. |
| `LS-CONSENT-005` | Consent MUST NOT be bundled into Terms or inferred from use, payment, email/phone entry, silence, preselected controls, or a model classification. |
| `LS-CONSENT-006` | Material changes to sender, purpose, automation, frequency, data use, vendor role, or disclosure require legal review and may require reconfirmation. |
| `LS-CONSENT-007` | Withdrawal MUST be accepted through every reasonable supported route and applied without requiring login when the original channel permits direct opt-out. |
| `LS-CONSENT-008` | A channel/purpose suppression MUST propagate to every connected sender/vendor before another non-essential message is queued. |
| `LS-CONSENT-009` | Unsubscribe and STOP handling MUST be idempotent, auditable, and safe under duplicate/reordered vendor events. |
| `LS-CONSENT-010` | A suppression record MAY preserve the minimum identifier hash/reference and proof needed to prevent future contact after content deletion. |
| `LS-CONSENT-011` | Transactional templates MUST have an allowlisted service purpose and MUST NOT contain promotional content that changes their primary purpose. |
| `LS-CONSENT-012` | Recording/transcription capture MUST remain physically off until the selected-language disclosure and required decision are stored server-side. |
| `LS-CONSENT-013` | Withdrawal during a session MUST stop new capture promptly, mark the session, and route to the approved recovery/support state. |
| `LS-CONSENT-014` | If recording is declined, the application MUST NOT imply that purchase is forfeited; it must offer only a counsel/operations-approved recovery route or support. |
| `LS-CONSENT-015` | GPC or another legally recognized preference signal MUST be evaluated before optional trackers or sale/sharing/targeted-ad processing initializes. |
| `LS-CONSENT-016` | Consent evidence and marketing eligibility MUST be queryable independently from assessment answers, score, payment, and report content. |
| `LS-CONSENT-017` | Staff cannot override a denial, withdrawal, GPC signal, or suppression to improve funnel performance. |
| `LS-CONSENT-018` | Consent and opt-out UI MUST be keyboard operable, readable, and semantically equivalent in English and Spanish. |
| `LS-CONSENT-019` | A temporary legal waiver, enforcement delay, or vendor limitation MUST NOT be hard-coded as permanent permission. |
| `LS-CONSENT-020` | Until qualified review approves SMS classifications and wording, production marketing and automated SMS remain disabled. |

## 6. Communication suppression contract

### 6.1 Channel-purpose model

| Channel | Purpose class | Eligibility source | Fail-closed rule |
|---|---|---|---|
| Email | free-result delivery | User request plus valid email | No unrelated promotion |
| Email | paid-order service | Valid order/account state | No marketing when suppressed |
| Email | marketing | `email_marketing=GRANTED` plus no suppression | Do not send otherwise |
| SMS | service | Approved legal/configuration rule plus valid phone | Disabled until rule is approved |
| SMS | marketing/automated | `sms_marketing=GRANTED` plus all required conditions | Disabled until counsel/vendor gate passes |
| Voice | paid interview | Valid order, authorization, disclosure, route decisions | Capture off until required decisions pass |
| Push/in-app | account/service | Authenticated account and allowlisted purpose | No marketing inference |

### 6.2 Suppression precedence

The send decision is allowed only when all conditions below are true:

1. environment and recipient domain match;
2. template version is approved for the exact purpose/language;
3. required eligibility/consent is current;
4. no channel, purpose, global, legal, complaint, or safety suppression applies;
5. frequency/cap and quiet-time configuration passes;
6. vendor state is synchronized or the message stays queued;
7. the audit event can be recorded without message content.

For SMS/robocall revocation, the implementation MUST accept reasonable methods and immediately stop the applicable non-essential communications. The January 6, 2026 FCC order extended until January 31, 2027 only the specified cross-unrelated-message portion of 47 CFR § 64.1200(a)(10); the product MUST NOT treat that narrow delay as permission to ignore revocation. Until counsel approves a narrower rule, BizMetria uses the broader safe default: suppress all non-essential automated SMS/voice purposes for that destination and route any essential exception to review.

## 7. Customer-facing notice surface registry

Every surface MUST render approved versioned content before its protected action. “Legal review” below means qualified U.S. review for the intended 50-state-plus-D.C. launch and professional EN/ES equivalence review.

| Surface ID | Surface | Required semantic modules | Protected action | Production review |
|---|---|---|---|---|
| `NS-WEB-FOOTER` | Global website footer | Entity/contact, Privacy, Terms, choices, accessibility/support paths | Public navigation | Entity + legal + EN/ES |
| `NS-WEB-ENTRY` | Landing/free-check entry | Product identity, operational-assessment scope, free boundary, no guarantee | Start free check | Claims + EN/ES |
| `NS-FREE-START` | Free-check start | Data-use summary, 11-question purpose, prohibited-data warning, save behavior | Begin answers | Privacy + EN/ES |
| `NS-FREE-CONTACT` | Free contact step | Notice at collection, result-delivery purpose, separate email/SMS choices | Submit contact | Privacy + communications + EN/ES |
| `NS-FREE-RESULT` | Free result | Score limitation, evidence basis, locked paid boundary, preference link | Display/share result | Claims + EN/ES |
| `NS-OFFER` | $299 offer | One-time price, included scope, implementation separate, no guarantee | Proceed to checkout | Commercial/legal + EN/ES |
| `NS-CHECKOUT` | Stripe-hosted checkout launch | Price/currency, one-time nature, scope, Terms/Privacy/Refund links, tax/refund state | Create checkout | Entity/tax/refund/legal + EN/ES |
| `NS-AUTH` | Account/return access | Account purpose, security, 18+ authorized representative rule | Create/use paid account | Eligibility/legal + EN/ES |
| `NS-PAID-START` | Paid questionnaire start | Required/optional data, prohibited-data warning, AI/human review, save/resume | Submit paid inputs | Privacy/legal + EN/ES |
| `NS-PAID-FIELD` | Bounded text/object input | Field purpose, limits, sensitive-data warning | Save field | Privacy/content safety |
| `NS-VOICE-BOOK` | Interview scheduling | Duration, participants, language, capture options, recovery/support | Book interview | Recording/legal + EN/ES |
| `NS-VOICE-PRECAPTURE` | Voice pre-capture | Identity, purpose, recording, transcription, AI analysis, human access, choice | Start capture | Nationwide recording + EN/ES |
| `NS-VOICE-WITHDRAW` | In-session choice/help | How to stop capture and what happens next | Continue capture | Recording/legal + EN/ES |
| `NS-STATUS` | Customer status | Actual state, SLA-start rule, due-date basis, pauses/recovery | Display milestone | Claims + operations |
| `NS-REPORT` | Approved report/PDF | Evidence limitations, assumptions/unknowns, no guarantee or regulated advice | Deliver report | Claims + legal + EN/ES |
| `NS-CONSULT` | Consultation booking/session | 30-minute scope, availability window, exclusions, recording rule if any | Book/hold session | Commercial/legal + EN/ES |
| `NS-IMPLEMENTATION` | Separate implementation interest | Separate offer, no inclusion in assessment, no commitment before proposal | Create lead | Commercial/claims |
| `NS-PREFERENCES` | Communication/privacy choices | Channel/purpose states, withdrawal, GPC/rights paths | Change preference | Privacy/communications |
| `NS-PRIVACY-REQUEST` | Rights request | Request types, verification, status, appeal where applicable | Submit request | Nationwide privacy + EN/ES |
| `NS-SUPPORT` | Support/contact | Safe-data warning, attachment limits, escalation/privacy routes | Submit ticket | Privacy/security |
| `NS-ERROR` | Error/recovery | Actionable retry/support text without secrets or other customer data | Retry/escalate | Security/content |

No production route may use a generic “I agree” control without the exact linked purpose and version.

## 8. Draft semantic copy modules

These modules define meaning and test fixtures. They are marked `DRAFT — NOT APPROVED FOR LIVE USE` until `LIVE-DEP-001` through `LIVE-DEP-008`, applicable vendor review, counsel review, and professional bilingual review pass. Placeholder tokens MUST NOT render to a customer.

### 8.1 Free-check collection summary

**English semantic draft:** BizMetria uses your selected business answers to calculate an operational opportunity score and prepare your free result. Contact information is used to provide the result and requested support. Marketing email and SMS are optional and separate. Do not submit passwords, payment details, customer lists, health information, government IDs, or other sensitive records. See `{PRIVACY_POLICY_LINK}` for reviewed details.

**Spanish semantic draft:** BizMetria utiliza las respuestas seleccionadas sobre su negocio para calcular una puntuación de oportunidad operativa y preparar el resultado gratuito. La información de contacto se utiliza para proporcionar el resultado y la ayuda solicitada. El correo de marketing y los SMS son opcionales y se autorizan por separado. No envíe contraseñas, datos de pago, listas de clientes, información médica, identificaciones oficiales ni otros registros sensibles. Consulte `{PRIVACY_POLICY_LINK}` para ver los detalles revisados.

### 8.2 Optional email marketing choice

**English semantic draft:** Optional: I agree to receive marketing email from `{LEGAL_ENTITY_NAME}` about BizMetria assessments and related services. I can unsubscribe at any time. This choice is not required to receive the free result or buy the assessment.

**Spanish semantic draft:** Opcional: Acepto recibir correos de marketing de `{LEGAL_ENTITY_NAME}` sobre las evaluaciones de BizMetria y servicios relacionados. Puedo cancelar la suscripción en cualquier momento. Esta opción no es necesaria para recibir el resultado gratuito ni para comprar la evaluación.

The final message footer cannot ship until a valid public postal address and monitored support path exist.

### 8.3 Optional SMS choice

**English semantic draft:** Optional: I agree to receive `{MESSAGE_PURPOSE}` text messages from `{LEGAL_ENTITY_NAME}` at the number provided. Message frequency: `{APPROVED_FREQUENCY}`. Consent is not a condition of purchase. Message and data rates may apply. Reply STOP to opt out and HELP for help. Terms: `{TERMS_LINK}`. Privacy: `{PRIVACY_LINK}`.

**Spanish semantic draft:** Opcional: Acepto recibir mensajes de texto de `{LEGAL_ENTITY_NAME}` sobre `{MESSAGE_PURPOSE}` en el número indicado. Frecuencia: `{APPROVED_FREQUENCY}`. El consentimiento no es una condición de compra. Pueden aplicarse tarifas de mensajes y datos. Responda STOP para cancelar y HELP para obtener ayuda. Términos: `{TERMS_LINK}`. Privacidad: `{PRIVACY_LINK}`.

Production remains disabled until sender, purpose, frequency, vendor, HELP/STOP behavior, quiet-time rules, and nationwide legal treatment are approved. Spanish STOP/HELP handling MUST accept reviewed equivalents without breaking carrier-required keywords.

### 8.4 Free-score limitation

**English semantic draft:** This operational opportunity score is based only on your selected answers. It is not a financial valuation, credit score, business-quality rating, or guarantee of results.

**Spanish semantic draft:** Esta puntuación de oportunidad operativa se basa únicamente en las respuestas seleccionadas. No es una valoración financiera, una puntuación crediticia, una calificación de la calidad del negocio ni una garantía de resultados.

### 8.5 Paid-assessment and data warning

**English semantic draft:** The $299 Business Assessment is a one-time purchase. Implementation is separate. The questionnaire and an interview or approved recovery route provide operational evidence for AI-assisted analysis and required human review. Do not provide credentials, payment-card information, customer or employee lists, health information, government IDs, protected legal material, or unnecessary trade secrets.

**Spanish semantic draft:** La Evaluación Empresarial de $299 es una compra única. La implementación se vende por separado. El cuestionario y una entrevista o vía de recuperación aprobada proporcionan evidencia operativa para un análisis asistido por IA y una revisión humana obligatoria. No proporcione credenciales, datos de tarjetas de pago, listas de clientes o empleados, información médica, identificaciones oficiales, material legal protegido ni secretos comerciales innecesarios.

### 8.6 Voice pre-capture disclosure

**English semantic draft:** BizMetria is conducting this interview to gather evidence for your Business Assessment. `{RECORDING_STATUS}`. `{TRANSCRIPTION_STATUS}`. Authorized analysis services and trained human reviewers may use the approved transcript or structured evidence to prepare and review your report. Do not provide passwords, payment details, customer records, health information, government IDs, or other sensitive content. Select `{AFFIRMATIVE_ACTION}` to continue under the choices shown, or choose support/recovery. Capture will not begin until the required choices are recorded.

**Spanish semantic draft:** BizMetria realiza esta entrevista para reunir evidencia para su Evaluación Empresarial. `{RECORDING_STATUS}`. `{TRANSCRIPTION_STATUS}`. Los servicios de análisis autorizados y revisores humanos capacitados pueden utilizar la transcripción aprobada o la evidencia estructurada para preparar y revisar su informe. No proporcione contraseñas, datos de pago, registros de clientes, información médica, identificaciones oficiales ni otro contenido sensible. Seleccione `{AFFIRMATIVE_ACTION}` para continuar con las opciones mostradas o elija ayuda/recuperación. La captura no comenzará hasta que se registren las decisiones necesarias.

No combined recording/transcription statement may be used when the implementation can perform one without the other. Each actual route must say exactly what occurs.

### 8.7 Report limitation

**English semantic draft:** This report is decision support based on the supplied and identified evidence. Customer statements are not independently verified unless explicitly stated. Recommendations may include assumptions and unknowns. Results are not guaranteed, and this report is not legal, tax, accounting, investment, security-certification, or other regulated professional advice.

**Spanish semantic draft:** Este informe sirve como apoyo para decisiones y se basa en la evidencia proporcionada e identificada. Las declaraciones del cliente no se verifican de forma independiente salvo que se indique expresamente. Las recomendaciones pueden incluir supuestos e información desconocida. No se garantizan resultados y este informe no constituye asesoramiento jurídico, fiscal, contable, de inversión, certificación de seguridad ni otro asesoramiento profesional regulado.

## 9. Claims matrix

### 9.1 Approved factual formulations

These formulations may be used only when the referenced product state is true and the exact final copy has passed the applicable review.

| Claim ID | Approved factual meaning | Required qualifier/evidence |
|---|---|---|
| `CL-A01` | “$299 one-time Business Assessment” | Currency USD; not a subscription; implementation separate |
| `CL-A02` | “Free AI Opportunity Check” | Free result contains only the approved limited result; paid content stays locked |
| `CL-A03` | “Operational opportunity score from 0–100” | Based only on selected answers and `ai-opportunity-score/1.0.0` |
| `CL-A04` | “AI-assisted analysis with human review” | Every MVP report actually enters required trained human review |
| `CL-A05` | “Report due within five U.S. business days after inputs complete” | `ASSESSMENT_INPUTS_COMPLETE`, America/Los_Angeles, 5:00 p.m., U.S. federal holidays excluded, approved pause/remedy rules |
| `CL-A06` | “Approximately 8–15 recommendations when evidence supports them” | Fewer may be delivered when evidence does not justify more |
| `CL-A07` | “Relative Impact vs. Effort Matrix” | Planning aid, not quantified ROI/payback |
| `CL-A08` | “30–90 day roadmap” | Recommended sequence, not a promise of results within that period |
| `CL-A09` | “One 30-minute results consultation is included” | Approved booking window, availability, exclusions, and no implementation inclusion |
| `CL-A10` | “English or Spanish experience” | Applicable surface has reviewed semantic parity and tested delivery |

### 9.2 Qualified formulations

| Claim ID | Allowed only with qualifier | Required treatment |
|---|---|---|
| `CL-Q01` | “May help identify operational opportunities” | No promise of savings, revenue, conversion, or efficiency |
| `CL-Q02` | “Prioritized recommendations” | Priority derives from evidence and approved rules; not certainty |
| `CL-Q03` | “Potential impact” | Relative qualitative scale unless verified customer evidence supports a bounded metric |
| `CL-Q04` | “Personalized” | Based on submitted assessment scope; do not imply full-business knowledge |
| `CL-Q05` | “Secure” or “privacy-focused” | Use only a specific verifiable control statement approved by Security/Legal; no absolute claim |
| `CL-Q06` | Customer success statement | Written permission, accurate context, material-connection disclosure, no atypical-as-typical implication |
| `CL-Q07` | “Nationwide” | Only after `LIVE-DEP-004`, all applicable controls, and launch flag pass |
| `CL-Q08` | “Immediate” or “fast” | Describe only the actual free deterministic result; never imply instant paid report |

### 9.3 Prohibited claims

| Claim ID | Prohibited claim or implication |
|---|---|
| `CL-P01` | Guaranteed ROI, savings, revenue, conversion, profit, payback, or performance |
| `CL-P02` | Invented losses, costs, baselines, percentages, or financial readiness |
| `CL-P03` | Business valuation, creditworthiness, business-quality rating, audit, certification, or due diligence |
| `CL-P04` | Legal, tax, accounting, investment, employment, medical, insurance, or regulated professional advice |
| `CL-P05` | “Compliant,” “legally approved,” “risk-free,” “100% secure,” or equivalent absolute assurance |
| `CL-P06` | “Fully automated report” or “no human involvement” during the mandatory-review MVP |
| `CL-P07` | A promise that business results occur in five days, 30 days, 90 days, or another period |
| `CL-P08` | Implementation included in $299, free implementation, or a guaranteed implementation slot |
| `CL-P09` | Unsupported “best,” “most accurate,” “unbiased,” or comparative-superiority claim |
| `CL-P10` | Fabricated, purchased, AI-generated, hidden-incentive, or materially altered review/testimonial |
| `CL-P11` | False scarcity, fake countdown, hidden recurring charge, or pre-advertised unapproved promotion |
| `CL-P12` | Public availability in all 50 states and D.C. before the nationwide launch gate passes |
| `CL-P13` | Human review as certification of legal, financial, privacy, security, or regulatory accuracy |
| `CL-P14` | Customer-data training of a general-purpose model without a later specific approved process |
| `CL-P15` | Any claim that exceeds cited evidence or hides a material assumption, unknown, exclusion, or dependency |

Every marketing page, lifecycle template, free result, report template, consultation script, sales artifact, and implementation proposal MUST reference claim IDs and pass automated prohibited-phrase/pattern checks plus human contextual review. Phrase scanning is a warning control, not final approval.

## 10. Exact field-inventory adoption

### 10.1 Shared metadata rule

Every field below inherits its approved type, required/optional status, validation, evidence state, and score behavior from FA-001 or PS-004. Before persistence, the schema registry MUST add:

- purpose ID;
- data class ID;
- source;
- evidence class;
- authorized roles;
- downstream recipient allowlist;
- retention class;
- export/correction/deletion behavior;
- analytics/log policy;
- contract version.

A field cannot ship when any metadata value is missing or `TBD` in a production-enabled environment.

### 10.2 Free assessment and contact fields

| Registry group | Exact fields | Class | Purpose/access | Retention/rights treatment |
|---|---|---|---|---|
| `FG-FREE-CONTEXT` | `business_type`, `business_type_other`, `team_size`, `monthly_new_inquiries` | CONFIDENTIAL_BUSINESS | Free result; customer, scoring context where defined, support | Lead/free-assessment class; export/correct/delete where applicable |
| `FG-FREE-SCORED` | `lead_channels`, `first_response_speed`, `customer_tracking_system`, `manual_work_areas`, `unconverted_lead_follow_up`, `primary_business_problem`, `desired_90_day_outcome`, `improvement_urgency` | CONFIDENTIAL_BUSINESS | Deterministic score/domain inputs; customer, scoring service, restricted support | Lead/free-assessment class; versioned correction/deletion |
| `FG-CONTACT` | `contact_name`, `business_name`, `business_website`, `email`, `phone`, `preferred_language` | PERSONAL / CONFIDENTIAL_BUSINESS | Result delivery, support, routing; never score | Contact class; correction/export/deletion; suppression may survive |
| `FG-CONSENT` | `purpose_id`, decision, notice/copy version, language, action, timestamp, source, withdrawal/suppression state | PERSONAL consent evidence | Compliance/lifecycle/privacy only | Consent-evidence class; immutable lineage; minimal suppression proof |
| `FG-ATTRIBUTION` | campaign/source/referral/promotion IDs | INTERNAL / pseudonymous | Approved attribution only; never score | Marketing-attribution class; opt-out/deletion treatment by applicability |

Raw answers and contact values MUST NOT enter product analytics. `business_type_other` retains the FA-001 2–80-character bound and sensitive-data warning.

### 10.3 Paid questionnaire — all 44 fields

The following list is exhaustive for `paid-assessment-schema/1.0.0`.

| Registry group | Exact field IDs | Count | Class and access | Retention/rights |
|---|---|---:|---|---|
| `FG-PAID-SCOPE` | `participant_role`, `decision_authority`, `assessment_scope`, `industry_category`, `business_model`, `service_delivery_mode` | 6 | CONFIDENTIAL_BUSINESS; customer, analysis, reviewer, restricted recovery support | Paid-assessment content; export/correct/delete; version history |
| `FG-PAID-OBJECTIVE` | `primary_objective`, `objective_detail`, `priority_horizon`, `target_outcomes`, `success_measure_ids`, `baseline_availability`, `baseline_metrics`, `nonnegotiable_constraints` | 8 | CONFIDENTIAL_BUSINESS; same roles | Same; optional values cannot become hidden requirements |
| `FG-PAID-WORKFLOW` | `workflow_focus_areas`, `primary_workflow_name`, `workflow_trigger`, `workflow_desired_outcome`, `workflow_steps`, `workflow_frequency`, `workflow_volume_band`, `handoff_count_band`, `exception_frequency`, `primary_bottleneck`, `bottleneck_detail`, `delay_band`, `manual_effort_band`, `rework_frequency` | 14 | CONFIDENTIAL_BUSINESS; same roles | Same; bounded objects/text; correction lineage |
| `FG-PAID-SYSTEMS` | `system_categories`, `system_inventory`, `integration_state`, `data_source_categories`, `data_quality_state`, `data_access_state`, `regulated_data_categories` | 7 | CONFIDENTIAL_BUSINESS; regulated category triggers restricted review without underlying sensitive data | Same; high-level categories only |
| `FG-PAID-CAPACITY` | `process_owner_role`, `change_capacity`, `implementation_timing`, `investment_constraint`, `stakeholder_roles`, `known_dependencies`, `known_risks` | 7 | CONFIDENTIAL_BUSINESS; same roles | Same; role labels, not personal names |
| `FG-PAID-FINAL` | `additional_context`, `prohibited_data_acknowledgement` | 2 | Context is CONFIDENTIAL_BUSINESS; acknowledgement is INTERNAL audit evidence | Separate content and fulfillment-audit classes |

Total: 44 fields. General upload remains prohibited. The system MUST reject unknown fields and MUST NOT persist detected prohibited payloads merely to explain an error.

## 11. Stored data-class registry

| Data class ID | Contents | Authorized roles/systems | Lifecycle trigger | Production condition |
|---|---|---|---|---|
| `DC-01-LEAD` | Free answers, drafts, canonical IDs | Customer, free service, restricted support | Last activity, conversion, or validated request | Retention duration approved |
| `DC-02-CONTACT` | Name, business, email, phone, language | Customer, fulfillment/lifecycle, restricted support | Last service need/account closure/request | Notice and schedule approved |
| `DC-03-CONSENT` | Versioned decisions, disclosure evidence, withdrawal/suppression | Lifecycle, privacy/compliance | Decision/withdrawal plus proof need | Counsel-approved schema/copy |
| `DC-04-FREE-RESULT` | Score, blocks, band, areas, versions | Customer, scoring, support | Result replacement/lead closure/request | FA contract + schedule |
| `DC-05-AUTH` | Account IDs, auth factors/hashes, sessions | Auth/security; support recovery boundary | Closure, inactivity, security event | Auth/vendor/security approval |
| `DC-06-ORDER` | Order, amount, currency, states, timestamps | Customer, fulfillment, finance, support | Transaction/closure/dispute | Entity/tax/refund schedule |
| `DC-07-PAYMENT-REF` | Stripe customer/checkout/payment/refund/event references | Payment backend, finance, restricted support | Transaction/refund/dispute | Stripe test mode until live gate; no raw card data |
| `DC-08-PROMOTION` | Promotion ID, eligibility, discount, attribution | Checkout/lifecycle/finance | Offer/order expiry | Approved promotion contract |
| `DC-09-PAID-CONTENT` | 44-field questionnaire and versions | Customer, analysis, reviewer, restricted recovery support | Delivery/closure/correction/request | Schedule and field lint pass |
| `DC-10-VOICE-META` | Session, route, language, status, errors | Voice/backend/support | Session closure/recovery | Vendor and consent route approved |
| `DC-11-AUDIO` | Raw recording when explicitly enabled | Restricted voice/reviewer only | Transcription/review completion | Disabled by default; nationwide recording and short schedule approved |
| `DC-12-TRANSCRIPT` | Transcript and bounded excerpts | Analysis, reviewer, restricted support | Delivery/closure/request | Consent/vendor/schedule approved |
| `DC-13-EVIDENCE` | Normalized facts, inferences, assumptions, unknowns, sources | Analysis/reviewer | Report lineage closure/request | Evidence contract and schedule |
| `DC-14-ANALYSIS` | Draft recommendations, model/rule/prompt IDs, validation | Analysis/reviewer/QA with synthetic fixtures | Supersession/delivery/closure | No general-model training; vendor gate |
| `DC-15-REPORT` | Drafts, review actions, approved PDF, delivery events | Reviewer, customer after approval, restricted support | Supersession/delivery/closure | Human approval and report contract |
| `DC-16-CONSULT` | Booking, entitlement, attendance, minimized outcome | Customer, consultant, support | Entitlement/session closure | Staffing/scheduling rules approved |
| `DC-17-LIFECYCLE` | CRM stage, message state, suppression, implementation interest | Lifecycle/sales by purpose | Relationship closure/opt-out | Purpose/access schedule approved |
| `DC-18-ANALYTICS` | Allowlisted pseudonymous events only | Product/analytics | Event date/aggregation | Event schema and tracker review |
| `DC-19-SUPPORT` | Tickets, safe attachments, resolution | Restricted support/escalated roles | Ticket closure/request | Attachment limits and schedule |
| `DC-20-PRIVACY` | Request, verification method, scope, outcome, appeal | Privacy/compliance, necessary processors | Request closure/legal proof | Rights workflow approved |
| `DC-21-SECURITY` | Auth, access, abuse, webhook, configuration audit events | Security/authorized engineering | Event/incident closure | LS-003 schedule and controls |
| `DC-22-BACKUP` | Encrypted recoverable copies | Restricted infrastructure | Backup creation/expiry | Automatic expiry and deletion-on-restore tested |
| `DC-23-CONFIG` | Versions, feature gates, vendor/settings evidence | Authorized operators/auditors | Supersession | Change audit; secrets stored separately |

### 11.1 Data-domain requirements

| ID | Requirement |
|---|---|
| `LS-DATA-001` | Every persisted object MUST have exactly one primary data class and an owner. |
| `LS-DATA-002` | Assessment content, contact, consent, payment, analytics, and security data MUST use separate authorization boundaries. |
| `LS-DATA-003` | Raw card number and CVC MUST remain entirely inside the approved Stripe-hosted boundary. |
| `LS-DATA-004` | No vendor receives production data before purpose, role, DPA/contract, subprocessors, locations, training, retention, deletion, security, and incident terms are approved. |
| `LS-DATA-005` | Customer content MUST NOT train a general-purpose model by default. |
| `LS-DATA-006` | Product analytics MUST use an allowlist and MUST reject raw answers, free text, contact data, audio/transcript, report content, payment-form data, and secrets. |
| `LS-DATA-007` | Logs/errors MUST contain stable correlation IDs and reason codes, not customer payloads. |
| `LS-DATA-008` | Staff and processor access MUST be object-authorized, least-privilege, MFA-protected where privileged, and audited. |
| `LS-DATA-009` | Data export MUST preserve understandable field labels, source/version, correction lineage, and consent/message history where applicable. |
| `LS-DATA-010` | Correction MUST create versioned history for evidence used in an immutable completion/report event. |
| `LS-DATA-011` | Deletion MUST cover active stores, indexes, caches, generated files, queues, and processors, then record minimal completion proof. |
| `LS-DATA-012` | A deleted subject MUST NOT silently reappear after backup restoration; deletion-on-restore reconciliation is mandatory. |
| `LS-DATA-013` | Legal hold is permitted only through an authorized, scoped, time-reviewed record and cannot become an informal “keep” flag. |
| `LS-DATA-014` | New fields or recipients require a versioned inventory update and regression review before release. |
| `LS-DATA-015` | Production content MUST NOT be copied into development, staging, demos, fixtures, source control, or support screenshots. |

## 12. Privacy-rights workflow

The architecture supports a universal capability baseline; actual legal applicability, deadlines, exceptions, and appeals are selected by a counsel-approved jurisdiction policy. The system MUST NOT promise a statutory right that counsel concludes is inapplicable, and MUST NOT use non-applicability to block ordinary correction, deletion, or marketing preference handling promised by BizMetria policy.

### 12.1 Supported request types

| Request ID | Capability |
|---|---|
| `RIGHT-ACCESS` | Know/access categories and specific data where applicable |
| `RIGHT-EXPORT` | Obtain a portable, understandable copy where applicable |
| `RIGHT-CORRECT` | Correct inaccurate contact, questionnaire, and permitted evidence |
| `RIGHT-DELETE` | Delete data subject to lawful/contractual exceptions |
| `RIGHT-EMAIL-OPTOUT` | Stop marketing email |
| `RIGHT-SMS-OPTOUT` | Stop applicable SMS/automated voice |
| `RIGHT-SALE-SHARE-OPTOUT` | Stop applicable sale/sharing/targeted advertising; honor GPC where required |
| `RIGHT-LIMIT-SENSITIVE` | Limit applicable sensitive-data use/disclosure |
| `RIGHT-ADMT` | Applicable access/opt-out treatment for covered automated decisionmaking |
| `RIGHT-APPEAL` | Appeal an eligible denial where applicable |
| `RIGHT-CLOSE-ACCOUNT` | Close/disable account and initiate lifecycle treatment |

### 12.2 Workflow requirements

| ID | Requirement |
|---|---|
| `LS-RIGHTS-001` | Accept requests through a published English/Spanish path and accessible support alternative. |
| `LS-RIGHTS-002` | Record request type, received time, jurisdiction context, data scope, status, deadline policy version, and owner without copying unnecessary payloads. |
| `LS-RIGHTS-003` | Verify identity proportionately using existing account/contact evidence when possible; do not request government ID by default. |
| `LS-RIGHTS-004` | Separate request identity verification from authorization to access another business participant's data. |
| `LS-RIGHTS-005` | Discover records across all data classes and processors through stable subject/order mappings. |
| `LS-RIGHTS-006` | Pause destructive execution when identity, scope, legal hold, dispute, fraud, or another authorized exception is unresolved. |
| `LS-RIGHTS-007` | Explain a denial, partial fulfillment, extension, or clarification need using an approved reason code and applicable appeal path. |
| `LS-RIGHTS-008` | Propagate approved actions to processors and verify completion or document a scoped exception. |
| `LS-RIGHTS-009` | Do not discriminate against a person for exercising an applicable privacy right. |
| `LS-RIGHTS-010` | Keep minimal audit proof of request, verification method, decision, processor completion, and response; do not retain the deleted content as proof. |
| `LS-RIGHTS-011` | Marketing opt-out requests bypass the slower privacy-request queue and suppress sends immediately. |
| `LS-RIGHTS-012` | GPC evaluation MUST occur at the browser/session boundary before affected optional processing. |
| `LS-RIGHTS-013` | Rights status and responses MUST be semantically equivalent in English and Spanish. |
| `LS-RIGHTS-014` | Statutory timing values MUST be configuration-driven and versioned; no deadline is invented in source code. |
| `LS-RIGHTS-015` | High-risk export, deletion, denial, and appeal decisions require authorized action and immutable audit evidence. |

## 13. Retention, deletion, and backup constraints

Exact production durations remain unresolved. Every unresolved duration is a release blocker, not an infinite default.

| Retention class | Applies to | Trigger | Required disposition before production |
|---|---|---|---|
| `RET-LEAD-TBD` | DC-01, DC-02, DC-04 | Last activity, conversion, or validated request | Product/Privacy/counsel duration and anonymization rule |
| `RET-CONSENT-TBD` | DC-03 and suppression subset of DC-17 | Consent/withdrawal/suppression | Counsel-approved proof and suppression duration |
| `RET-AUTH-TBD` | DC-05 | Closure/inactivity/security event | Security/privacy duration |
| `RET-FINANCE-TBD` | DC-06, DC-07, DC-08 | Transaction/refund/dispute/closure | Accountant/counsel schedule and exceptions |
| `RET-PAID-TBD` | DC-09, DC-12, DC-13 | Delivery/closure/request | Product/privacy/counsel schedule |
| `RET-AUDIO-TBD` | DC-11 | Transcription/review completion | Shortest approved operational duration; disabled until set |
| `RET-ANALYSIS-TBD` | DC-14, draft DC-15 | Supersession/delivery/closure | Draft/version schedule |
| `RET-REPORT-TBD` | Approved DC-15 | Delivery/closure/request | Contract/dispute schedule |
| `RET-CONSULT-TBD` | DC-16 | Session/entitlement closure | Minimized booking/outcome schedule |
| `RET-ANALYTICS-TBD` | DC-18 | Event date/aggregation | Short pseudonymous window and aggregate rule |
| `RET-SUPPORT-TBD` | DC-19 | Ticket closure | Support/privacy schedule |
| `RET-PRIVACY-TBD` | DC-20 | Request closure | Compliance-proof schedule |
| `RET-SECURITY-TBD` | DC-21 | Event/incident closure | LS-003 detection/investigation schedule |
| `RET-BACKUP-TBD` | DC-22 | Backup creation | Automatic expiry and restore reconciliation window |

| ID | Requirement |
|---|---|
| `LS-RET-001` | Production startup MUST fail when an active data class still maps to a `TBD` duration. |
| `LS-RET-002` | Retention is event-based and configuration-driven; “forever,” null expiry, and silent vendor defaults are invalid. |
| `LS-RET-003` | Raw audio is disabled by default and receives the shortest approved operational period. |
| `LS-RET-004` | Financial records remain separated from assessment content and may use different lawful exceptions. |
| `LS-RET-005` | Consent/suppression proof MUST be minimized and MUST NOT justify retaining unrelated customer content. |
| `LS-RET-006` | Expiry jobs MUST be idempotent, observable, processor-aware, and safe under retry. |
| `LS-RET-007` | Backup copies MUST be encrypted, automatically expire, and participate in tested deletion-on-restore. |
| `LS-RET-008` | Vendor retention settings MUST be captured as evidence and may not exceed approved BizMetria policy without an approved exception. |
| `LS-RET-009` | A retention change requires versioning, impact analysis, migration treatment, and updated notice when material. |
| `LS-RET-010` | Deletion metrics MUST contain counts/statuses only, never deleted content. |

## 14. Vendor, tracker, and model review

Before production data reaches a vendor, an evidence record MUST contain:

1. legal service/provider identity and account owner;
2. exact purpose and data classes;
3. reviewed controller/business/processor/service-provider role;
4. contract/DPA and confidentiality status;
5. subprocessors, processing locations, and transfer treatment;
6. retention, deletion, export, and backup capability;
7. model-training, human-review, and secondary-use defaults;
8. encryption, access, audit, incident, and breach commitments;
9. production configuration evidence and secret owner;
10. replacement/export plan and disable switch.

Non-essential trackers remain off until jurisdiction, purpose, vendor, data flow, consent/opt-out, GPC, retention, and payload scanning pass. Session replay is prohibited on free-answer, contact, checkout, paid questionnaire, voice, report, consultation, preference, privacy-request, and support surfaces unless a later explicit contract proves safe masking and legal treatment; default is disabled.

## 15. Qualified-review and production triggers

| Trigger ID | Change/event | Required review | Failure behavior |
|---|---|---|---|
| `RV-001` | Entity, trade name, address, support channel, or jurisdiction changes | Owner + counsel + tax/accounting as applicable | Public policy/checkout/live messaging off |
| `RV-002` | Nationwide or new-state availability | 50 states + D.C. legal applicability/control matrix | Affected geography off |
| `RV-003` | New email/SMS/voice purpose, automation, sender, frequency, vendor, or template | Communications counsel + Lifecycle + EN/ES | Send disabled |
| `RV-004` | Recording, transcription, synthetic voice, new participant, or recovery-route change | Nationwide recording counsel + Voice + Privacy + EN/ES | Capture/route disabled |
| `RV-005` | New field, free text, upload, recipient, use purpose, or inference | Privacy + Security + product owner | Field/use disabled |
| `RV-006` | New analytics, advertising, session replay, sale/sharing, or targeted-ad behavior | Privacy counsel + Security + UX | Tracker/processing off |
| `RV-007` | New vendor/model/subprocessor/location or changed training/retention terms | Legal + Privacy + Security + architecture gate | Production data blocked |
| `RV-008` | New ROI, savings, comparison, testimonial, “secure/compliant,” or outcome claim | Claims/legal + evidence owner + Marketing | Claim blocked |
| `RV-009` | Price, promotion, refund, tax, subscription, or implementation-scope change | Owner + counsel + accountant + Lifecycle | Checkout/promotion off |
| `RV-010` | Retention duration, legal hold, deletion exception, backup behavior | Privacy + Security + counsel/accounting | Affected production class blocked |
| `RV-011` | Privacy law/regulation, FCC/FTC rule, or enforcement position changes | Counsel + contract version review | Conservative safe configuration remains |
| `RV-012` | Material English/Spanish copy change | Legal + professional bilingual equivalence review | Changed locale/surface off |
| `RV-013` | Stripe live identifiers/secrets become available | Authorized protected activation only after all live gates | Test mode remains |

## 16. Official issue-spotting source set

The following official sources were rechecked on 2026-07-31. They support issue spotting, not an applicability conclusion:

- [FTC — CAN-SPAM Act compliance guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)
- [FCC — January 6, 2026 TCPA consent-revocation waiver order](https://docs.fcc.gov/public/attachments/DA-26-12A1.pdf)
- [FCC — TCPA rules](https://www.fcc.gov/sites/default/files/tcpa-rules.pdf)
- [California Privacy Protection Agency — CCPA updates, cybersecurity, risk assessment, and ADMT regulations](https://cppa.ca.gov/regulations/ccpa_updates.html)
- [California Privacy Protection Agency — law and regulations](https://cppa.ca.gov/regulations/)
- [California Attorney General — CCPA overview and rights](https://oag.ca.gov/privacy/ccpa)
- [California Attorney General — Global Privacy Control](https://oag.ca.gov/privacy/ccpa/gpc)
- [California Legislative Information — Penal Code § 632](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=632)
- [FTC — advertising and marketing basics](https://www.ftc.gov/business-guidance/advertising-marketing)
- [FTC — endorsements, influencers, and reviews](https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews)

The CPPA's 2025 rulemaking package is effective January 1, 2026, with activity-specific and threshold-dependent obligations. The platform therefore keeps rights, opt-out, risk-assessment, ADMT, security, and audit capabilities configurable; qualified counsel must determine whether and when each applies to BizMetria.

## 17. Events, errors, and audit evidence

### 17.1 Allowlisted event families

- notice shown and render failed;
- each purpose granted, denied, withdrawn, suppressed, expired, or reconfirmation-required;
- preference/GPC evaluated and applied;
- message eligibility evaluated, queued, sent, failed, suppressed, bounced, complained, or unsubscribed;
- voice disclosure shown, choice recorded, capture enabled/disabled, withdrawal, and recovery route;
- claim validation passed/blocked/reviewed;
- privacy request received, verified, scoped, fulfilled, denied, appealed, and processor-confirmed;
- retention evaluated, expired, deleted, failed, retried, held, restored, and reconciled;
- vendor/pre-live gate evaluated.

Allowed properties are pseudonymous references, purpose/surface/claim/data-class IDs, state, language, versions, timestamps, environment, approved reason code, and processor status. Raw messages, answers, contact data, audio/transcript, reports, payment payloads, secrets, and privacy-request content are prohibited.

### 17.2 Error codes

| Code | Condition |
|---|---|
| `LS_ERR_NOTICE_VERSION` | Missing/unsupported notice or policy version |
| `LS_ERR_PURPOSE` | Unknown or incompatible purpose |
| `LS_ERR_CONSENT_EVIDENCE` | Required evidence incomplete or invalid |
| `LS_ERR_SUPPRESSED` | Channel/purpose/global suppression applies |
| `LS_ERR_TEMPLATE` | Template not approved for purpose/language |
| `LS_ERR_CAPTURE_OFF` | Recording/transcription preconditions not met |
| `LS_ERR_CLAIM_BLOCKED` | Prohibited or unsupported claim detected |
| `LS_ERR_FIELD_INVENTORY` | Field metadata absent or version mismatch |
| `LS_ERR_RIGHTS_AUTH` | Rights request identity/authority unresolved |
| `LS_ERR_RIGHTS_HOLD` | Lawful/authorized exception or hold unresolved |
| `LS_ERR_RETENTION_TBD` | Active production data class lacks approved duration |
| `LS_ERR_VENDOR_GATE` | Vendor/data-flow review incomplete |
| `LS_ERR_LIVE_GATE` | Applicable pre-live dependency not passed |

## 18. Required acceptance vectors

| Vector | Scenario | Expected result |
|---|---|---|
| `LS-V001` | Email and phone supplied; both marketing choices omitted | Free result allowed; no marketing eligibility |
| `LS-V002` | Email granted, SMS denied | Marketing email eligible; SMS suppressed |
| `LS-V003` | Preselected or bundled marketing checkbox submitted | Evidence rejected; no permission |
| `LS-V004` | Consent record lacks purpose, version, language, source, action, or timestamp | `LS_ERR_CONSENT_EVIDENCE` |
| `LS-V005` | Unsubscribe/STOP repeated and vendor callbacks reordered | One idempotent suppression outcome; no later non-essential send |
| `LS-V006` | GPC present before optional tracker initialization | Affected processing stays off; versioned preference event |
| `LS-V007` | Transactional template contains promotion | Template blocked or reclassified; marketing eligibility required |
| `LS-V008` | Voice capture requested before stored disclosure/decision | Capture physically off; `LS_ERR_CAPTURE_OFF` |
| `LS-V009` | Recording permitted but transcription denied for a route requiring transcription | Route blocked; approved recovery/support only |
| `LS-V010` | Consent withdrawn during interview | New capture stops; state/audit/recovery recorded |
| `LS-V011` | Same purpose/copy in English and Spanish | Identical state transition and evidence structure |
| `LS-V012` | Placeholder token remains in rendered legal/product copy | Surface fails closed; no protected action |
| `LS-V013` | Score mutated by consent, language, contact, campaign, or Stripe state | Test fails; score must remain identical |
| `LS-V014` | Free API/client contains paid protected content | Contract failure |
| `LS-V015` | “Guaranteed ROI” or invented savings enters marketing/report draft | `LS_ERR_CLAIM_BLOCKED` |
| `LS-V016` | “Five-day results” used instead of report-delivery SLA | Claim blocked for misleading scope |
| `LS-V017` | Report has material statement without evidence/assumption/unknown status | Delivery blocked |
| `LS-V018` | One of 44 paid fields lacks inventory metadata | Schema/release blocked |
| `LS-V019` | Unknown paid field or general upload submitted | Rejected; payload not persisted in logs |
| `LS-V020` | Analytics receives raw answer, contact, transcript, report, or payment field | Payload rejected and security alert emitted |
| `LS-V021` | Access request spans contact, assessment, consent, order, report, and vendor records | Authorized discovery produces versioned export or documented scoped exception |
| `LS-V022` | Delete request accepted while finance record has approved exception | Content deleted; separated finance record retained with reason and no unnecessary assessment content |
| `LS-V023` | Deleted subject reappears after backup restore | Reconciliation deletes/blocks it before normal use |
| `LS-V024` | Production class maps to `TBD` retention | Startup/pre-live gate fails |
| `LS-V025` | Vendor enables model training or extended retention after review | Production transfer disabled pending re-review |
| `LS-V026` | Test Stripe/consent event targets live state | Environment mismatch; no live effect |
| `LS-V027` | Live Stripe key absent | Build, tests, and staging pass; real checkout remains disabled |
| `LS-V028` | Live key exists but one `LIVE-DEP` is missing | Real checkout remains disabled |
| `LS-V029` | “Available nationwide” before 50-state-plus-D.C. review | Claim and geography activation blocked |
| `LS-V030` | Fake, incentivized-without-disclosure, or materially altered testimonial fixture | Publication blocked |

QA MUST map every normative ID in this contract to automated, manual, qualified-review, or pre-live evidence. Negative tests MUST prove that missing configuration does not degrade into permissive behavior.

## 19. Downstream assignments

| Consumer | Required adoption |
|---|---|
| LC-001 | Purpose/channel eligibility, suppression precedence, template classes, price/refund/legal boundaries |
| AE-001 | Evidence/claim states, prohibited claims, unknowns, data/vendor boundaries |
| RP-001 | Report disclaimers, claim validation, human approval, retention/rights lineage |
| QA-001 | Normative ID traceability, event allowlist, acceptance vectors, release evidence |
| UX-001/UX-002 | Notice surfaces, granular controls, placeholders, accessibility, EN/ES parity, rights/status flows |
| EN-001/ES-001 | Pre-capture disclosure, consent/recovery states, stop rules, language parity |
| BE-001 and BE implementation | Domain separation, consent/rights/retention state machines, environment/live gates |
| LS-003 | Exact security controls, retention schedule integration, vendor/incident/backup evidence |
| MS-001 | Claims matrix, testimonials, offer hierarchy, nationwide and live-gate restrictions |
| LC-002 | Stripe test/live separation, sender/vendor suppression, webhook and message evidence |

## 20. Acceptance checklist

- [x] Every customer-facing surface has a notice/claim/review requirement.
- [x] Email, SMS, Terms, privacy acknowledgement, eligibility, recording, transcription, AI, human review, and analytics are distinct states.
- [x] Consent evidence is versioned, language-specific, purpose-specific, and withdrawable where applicable.
- [x] Revocation/suppression is idempotent and vendor-propagated.
- [x] Approved, qualified, and prohibited claims cover free, paid, report, consultation, implementation, promotion, and testimonial surfaces.
- [x] All free fields and all 44 paid fields are adopted into the inventory.
- [x] Every stored data class has purpose/access/lifecycle/production treatment.
- [x] Rights workflows cover discovery, verification, action, processor propagation, appeals where applicable, and minimal proof.
- [x] Unresolved retention durations fail closed instead of becoming indefinite defaults.
- [x] Current official FTC/FCC/California sources were rechecked without claiming nationwide applicability.
- [x] Final legal copy, entity, tax/refund, vendors, staffing, security, release, and Stripe live activation remain gated.

## Handoff Summary

- **Task:** LS-002 — Consent, Claims, and Data Requirements.
- **Status:** APPROVED through independently reviewed PR [#15](https://github.com/Bear78888/bizmetria.ai/pull/15), merge SHA `a60597ebd3a17c06c923150fb9cf76f24c3a437c`.
- **Files changed:** This deliverable and five Workstream 11 operating records.
- **Decisions proposed:** Versioned consent-purpose/evidence registry, suppression precedence, customer-surface registry, semantic EN/ES copy modules, claims matrix, exact field adoption, data-class registry, rights workflow, retention blockers, vendor/review triggers, and 30 acceptance vectors.
- **Decisions approved:** Existing product decisions, all-50-states-plus-D.C. intended geography, America/Los_Angeles/federal-holiday calendar, Stripe as eventual processor, and test/live fail-closed boundaries. This task adds no legal approval.
- **Open questions:** Entity/address, support path, final Terms/Privacy/Refund and consent copy, nationwide applicability, SMS/voice classifications, recording recovery route, exact retention, vendors/processors, tax treatment, staffing, security/release evidence, and protected live Stripe configuration.
- **Dependencies:** G1 PASS; approved FA-001 PR #12; approved PS-004 PR #13; approved LS-001 and PS-003.
- **Validation performed:** Surface/data-class/field coverage, exact 44-field parity, consent-state separation, claims review, privacy-rights and retention fail-closed review, official-source recheck, bilingual semantic parity review, Stripe secret/live-boundary review, 11 relative links with no missing target, and clean Markdown diff.
- **Recommended next task:** Begin LC-001 and AE-001 on separate branches, followed by RP-001 and QA-001 according to their named dependencies. G2 remains not passed until all Phase 2 contracts are approved.
