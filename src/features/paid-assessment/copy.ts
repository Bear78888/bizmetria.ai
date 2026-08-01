/**
 * Bilingual copy for the paid questionnaire.
 *
 * Field labels are the approved English/Spanish intents from PS-004 §6,
 * verbatim. Enum option labels are not enumerated in the contract — canonical
 * IDs are language neutral and "English and Spanish labels express the same
 * intent" (§6.1) — so the option labels here are faithful renderings of the
 * canonical IDs, written once per registry and subject to copy review like
 * any other UI text.
 */

export type Locale = 'en' | 'es';

export interface Bilingual {
  readonly en: string;
  readonly es: string;
}

// §4: every text field displays the prohibited-data warning.
export const prohibitedDataWarning: Bilingual = {
  en: 'Do not include passwords, API keys, card or bank data, government IDs, customer lists, employee records, health data, or other sensitive records.',
  es: 'No incluya contraseñas, claves API, datos de tarjetas o bancarios, identificaciones oficiales, listas de clientes, registros de empleados, datos de salud u otra información sensible.',
};

export const sectionTitles: Record<string, Bilingual> = {
  participant: { en: 'Participant and scope', es: 'Participante y alcance' },
  objectives: { en: 'Objectives and success', es: 'Objetivos y éxito' },
  workflow: { en: 'Primary workflow', es: 'Flujo de trabajo principal' },
  systems: { en: 'Systems and data', es: 'Sistemas y datos' },
  capacity: { en: 'Capacity and constraints', es: 'Capacidad y restricciones' },
  final: { en: 'Final context and acknowledgement', es: 'Contexto final y confirmación' },
};

/** Approved field intents, PS-004 §6.2–6.7, verbatim. */
export const fieldLabels: Record<string, Bilingual> = {
  participant_role: { en: 'Your role in the business', es: 'Su función en el negocio' },
  decision_authority: {
    en: 'Your role in decisions about this scope',
    es: 'Su función en las decisiones sobre este alcance',
  },
  assessment_scope: { en: 'Scope to assess', es: 'Alcance que se evaluará' },
  industry_category: { en: 'Business category', es: 'Categoría del negocio' },
  business_model: { en: 'Business model', es: 'Modelo de negocio' },
  service_delivery_mode: {
    en: 'How work or service is delivered',
    es: 'Cómo se entrega el trabajo o servicio',
  },
  primary_objective: { en: 'Most important objective', es: 'Objetivo más importante' },
  objective_detail: {
    en: 'What should improve and why it matters',
    es: 'Qué debe mejorar y por qué es importante',
  },
  priority_horizon: { en: 'When improvement matters', es: 'Cuándo es importante la mejora' },
  target_outcomes: { en: 'Desired operational outcomes', es: 'Resultados operativos deseados' },
  success_measure_ids: {
    en: 'How progress is or could be observed',
    es: 'Cómo se observa o podría observar el progreso',
  },
  baseline_availability: {
    en: 'Current baseline availability',
    es: 'Disponibilidad de una línea base actual',
  },
  baseline_metrics: { en: 'Known baseline measurements', es: 'Mediciones de referencia conocidas' },
  nonnegotiable_constraints: {
    en: 'Constraints that must be respected',
    es: 'Restricciones que deben respetarse',
  },
  workflow_focus_areas: {
    en: 'Areas included in the assessment',
    es: 'Áreas incluidas en la evaluación',
  },
  primary_workflow_name: {
    en: 'Short name for the main workflow',
    es: 'Nombre breve del flujo de trabajo principal',
  },
  workflow_trigger: { en: 'What starts the workflow', es: 'Qué inicia el flujo de trabajo' },
  workflow_desired_outcome: {
    en: 'What successful completion means',
    es: 'Qué significa completar el proceso con éxito',
  },
  workflow_steps: {
    en: 'Current steps from trigger to outcome',
    es: 'Pasos actuales desde el inicio hasta el resultado',
  },
  workflow_frequency: {
    en: 'How often the workflow occurs',
    es: 'Con qué frecuencia ocurre el flujo',
  },
  workflow_volume_band: {
    en: 'Approximate items per period',
    es: 'Volumen aproximado por período',
  },
  handoff_count_band: { en: 'Number of handoffs', es: 'Cantidad de traspasos' },
  exception_frequency: {
    en: 'How often exceptions occur',
    es: 'Con qué frecuencia ocurren excepciones',
  },
  primary_bottleneck: { en: 'Main current bottleneck', es: 'Principal cuello de botella actual' },
  bottleneck_detail: {
    en: 'Context about the bottleneck',
    es: 'Contexto sobre el cuello de botella',
  },
  delay_band: {
    en: 'Typical delay caused by the bottleneck',
    es: 'Demora típica causada por el cuello de botella',
  },
  manual_effort_band: {
    en: 'Approximate weekly manual effort',
    es: 'Esfuerzo manual semanal aproximado',
  },
  rework_frequency: {
    en: 'How often work must be redone',
    es: 'Con qué frecuencia debe repetirse el trabajo',
  },
  system_categories: {
    en: 'System categories used in the workflow',
    es: 'Categorías de sistemas utilizadas en el flujo',
  },
  system_inventory: {
    en: 'Optional product labels and purposes',
    es: 'Nombres opcionales de productos y sus usos',
  },
  integration_state: {
    en: 'How connected the systems are',
    es: 'Qué tan conectados están los sistemas',
  },
  data_source_categories: {
    en: 'Data-source categories used',
    es: 'Categorías de fuentes de datos utilizadas',
  },
  data_quality_state: {
    en: 'General data-quality state',
    es: 'Estado general de la calidad de los datos',
  },
  data_access_state: {
    en: 'Authorized access feasibility',
    es: 'Viabilidad del acceso autorizado',
  },
  regulated_data_categories: {
    en: 'High-level sensitive or regulated categories involved',
    es: 'Categorías generales sensibles o reguladas involucradas',
  },
  process_owner_role: {
    en: 'Role responsible for the workflow',
    es: 'Función responsable del flujo de trabajo',
  },
  change_capacity: {
    en: 'Weekly capacity for improvement work',
    es: 'Capacidad semanal para el trabajo de mejora',
  },
  implementation_timing: {
    en: 'Preferred timing if action is chosen',
    es: 'Plazo preferido si se decide actuar',
  },
  investment_constraint: { en: 'General cost constraint', es: 'Restricción general de costos' },
  stakeholder_roles: {
    en: 'Other roles needed for a decision',
    es: 'Otras funciones necesarias para una decisión',
  },
  known_dependencies: { en: 'Known dependencies', es: 'Dependencias conocidas' },
  known_risks: { en: 'Known risks or concerns', es: 'Riesgos o inquietudes conocidos' },
  additional_context: {
    en: 'Other context relevant to this assessment',
    es: 'Otro contexto pertinente para esta evaluación',
  },
  prohibited_data_acknowledgement: {
    en: 'I understand what not to provide',
    es: 'Entiendo qué información no debo proporcionar',
  },
};

const OTHER: Bilingual = { en: 'Other', es: 'Otro' };
const UNKNOWN: Bilingual = { en: 'Unknown / not sure', es: 'No se sabe / no está claro' };
const NONE: Bilingual = { en: 'None', es: 'Ninguna' };

/** Option labels per canonical enum id. Registries share ids where §7 does. */
export const optionLabels: Record<string, Record<string, Bilingual>> = {
  participant_role: {
    owner_executive: { en: 'Owner or executive', es: 'Propietario o ejecutivo' },
    department_leader: { en: 'Department leader', es: 'Líder de departamento' },
    manager: { en: 'Manager', es: 'Gerente' },
    operator: { en: 'Operator / hands-on staff', es: 'Operador / personal operativo' },
    advisor: { en: 'Advisor or consultant', es: 'Asesor o consultor' },
    other: OTHER,
  },
  decision_authority: {
    final_decision: { en: 'I make the final decision', es: 'Tomo la decisión final' },
    shared_decision: {
      en: 'I share the decision with others',
      es: 'Comparto la decisión con otros',
    },
    recommender: { en: 'I recommend, others decide', es: 'Recomiendo, otros deciden' },
    contributor: { en: 'I contribute information', es: 'Aporto información' },
  },
  assessment_scope: {
    entire_business: { en: 'The entire business', es: 'Todo el negocio' },
    department: { en: 'One department', es: 'Un departamento' },
    single_workflow: { en: 'One workflow', es: 'Un flujo de trabajo' },
    single_location: { en: 'One location', es: 'Una ubicación' },
    other: OTHER,
  },
  industry_category: {
    professional_services: { en: 'Professional services', es: 'Servicios profesionales' },
    home_field_services: { en: 'Home or field services', es: 'Servicios a domicilio o en campo' },
    health_wellness: { en: 'Health and wellness', es: 'Salud y bienestar' },
    retail_ecommerce: { en: 'Retail or e-commerce', es: 'Comercio minorista o electrónico' },
    hospitality_food: { en: 'Hospitality or food', es: 'Hostelería o alimentación' },
    real_estate_property: { en: 'Real estate or property', es: 'Bienes raíces o propiedades' },
    financial_insurance: { en: 'Financial or insurance', es: 'Finanzas o seguros' },
    education_training: { en: 'Education or training', es: 'Educación o capacitación' },
    manufacturing_distribution: {
      en: 'Manufacturing or distribution',
      es: 'Manufactura o distribución',
    },
    nonprofit_community: { en: 'Nonprofit or community', es: 'Sin fines de lucro o comunitario' },
    technology_software: { en: 'Technology or software', es: 'Tecnología o software' },
    other: OTHER,
  },
  business_model: {
    b2b: { en: 'B2B — selling to businesses', es: 'B2B — venta a empresas' },
    b2c: { en: 'B2C — selling to consumers', es: 'B2C — venta a consumidores' },
    b2g: { en: 'B2G — selling to government', es: 'B2G — venta al sector público' },
    nonprofit: { en: 'Nonprofit', es: 'Sin fines de lucro' },
    internal_service: { en: 'Internal service function', es: 'Función de servicio interno' },
    marketplace: { en: 'Marketplace', es: 'Marketplace' },
    other: OTHER,
  },
  service_delivery_mode: {
    onsite: { en: 'On site at our location', es: 'En nuestras instalaciones' },
    field: { en: 'In the field at the customer', es: 'En campo, con el cliente' },
    remote: { en: 'Remotely', es: 'De forma remota' },
    ecommerce: { en: 'Online store / e-commerce', es: 'Tienda en línea / e-commerce' },
    hybrid: { en: 'A mix of these', es: 'Una combinación' },
    other: OTHER,
  },
  objective: {
    respond_faster: {
      en: 'Respond to customers faster',
      es: 'Responder más rápido a los clientes',
    },
    convert_more: {
      en: 'Convert more leads into customers',
      es: 'Convertir más prospectos en clientes',
    },
    reduce_manual_work: { en: 'Reduce manual work', es: 'Reducir el trabajo manual' },
    improve_customer_experience: {
      en: 'Improve the customer experience',
      es: 'Mejorar la experiencia del cliente',
    },
    organize_systems_data: { en: 'Organize systems and data', es: 'Organizar sistemas y datos' },
    improve_reporting: {
      en: 'Improve reporting and visibility',
      es: 'Mejorar los informes y la visibilidad',
    },
    scale_capacity: {
      en: 'Scale capacity without more staff',
      es: 'Escalar capacidad sin más personal',
    },
    reduce_errors_rework: { en: 'Reduce errors and rework', es: 'Reducir errores y retrabajo' },
    identify_ai_priorities: { en: 'Identify AI priorities', es: 'Identificar prioridades de IA' },
    other: OTHER,
  },
  priority_horizon: {
    now_to_30_days: { en: 'Now to 30 days', es: 'Ahora a 30 días' },
    days_31_to_90: { en: '31 to 90 days', es: '31 a 90 días' },
    months_3_to_6: { en: '3 to 6 months', es: '3 a 6 meses' },
    months_6_to_12: { en: '6 to 12 months', es: '6 a 12 meses' },
    exploring: { en: 'Just exploring', es: 'Solo explorando' },
  },
  success_measure: {
    response_time: { en: 'Response time', es: 'Tiempo de respuesta' },
    conversion_rate: { en: 'Conversion rate', es: 'Tasa de conversión' },
    cycle_time: { en: 'Cycle time', es: 'Tiempo de ciclo' },
    manual_hours: { en: 'Manual hours spent', es: 'Horas de trabajo manual' },
    error_rate: { en: 'Error rate', es: 'Tasa de errores' },
    customer_satisfaction: { en: 'Customer satisfaction', es: 'Satisfacción del cliente' },
    on_time_completion: { en: 'On-time completion', es: 'Cumplimiento a tiempo' },
    throughput: { en: 'Throughput', es: 'Volumen procesado' },
    data_completeness: { en: 'Data completeness', es: 'Integridad de los datos' },
    visibility: { en: 'Visibility / reporting', es: 'Visibilidad / informes' },
    not_currently_measured: { en: 'Not currently measured', es: 'No se mide actualmente' },
    other: OTHER,
  },
  baseline_availability: {
    measured: { en: 'Measured — we track this', es: 'Medida — la registramos' },
    estimated: { en: 'Estimated — informed guesses', es: 'Estimada — cálculos aproximados' },
    not_measured: { en: 'Not measured', es: 'No se mide' },
    unknown: UNKNOWN,
  },
  constraint: {
    budget: { en: 'Budget', es: 'Presupuesto' },
    timeline: { en: 'Timeline', es: 'Plazos' },
    staff_capacity: { en: 'Staff capacity', es: 'Capacidad del personal' },
    security: { en: 'Security', es: 'Seguridad' },
    privacy: { en: 'Privacy', es: 'Privacidad' },
    regulatory: { en: 'Regulatory requirements', es: 'Requisitos regulatorios' },
    customer_experience: {
      en: 'Customer experience must not suffer',
      es: 'La experiencia del cliente no debe verse afectada',
    },
    system_limit: { en: 'System limitations', es: 'Limitaciones de sistemas' },
    vendor_contract: { en: 'Vendor contracts', es: 'Contratos con proveedores' },
    change_readiness: { en: 'Readiness for change', es: 'Preparación para el cambio' },
    other: OTHER,
    none: NONE,
  },
  workflow_area: {
    lead_intake: { en: 'Lead intake', es: 'Captación de prospectos' },
    follow_up: { en: 'Follow-up', es: 'Seguimiento' },
    scheduling: { en: 'Scheduling', es: 'Programación de citas' },
    sales_quotes: { en: 'Sales and quotes', es: 'Ventas y cotizaciones' },
    customer_service: { en: 'Customer service', es: 'Atención al cliente' },
    billing_collections: { en: 'Billing and collections', es: 'Facturación y cobranza' },
    reporting: { en: 'Reporting', es: 'Informes' },
    marketing: { en: 'Marketing', es: 'Marketing' },
    data_entry: { en: 'Data entry', es: 'Captura de datos' },
    internal_coordination: { en: 'Internal coordination', es: 'Coordinación interna' },
    other: OTHER,
  },
  workflow_frequency: {
    ad_hoc: { en: 'Ad hoc', es: 'Según surja' },
    daily: { en: 'Daily', es: 'Diaria' },
    weekly: { en: 'Weekly', es: 'Semanal' },
    monthly: { en: 'Monthly', es: 'Mensual' },
    seasonal: { en: 'Seasonal', es: 'Estacional' },
    continuous: { en: 'Continuous', es: 'Continua' },
    unknown: UNKNOWN,
  },
  workflow_volume: {
    zero_to_10: { en: '0–10', es: '0–10' },
    eleven_to_50: { en: '11–50', es: '11–50' },
    fifty_one_to_200: { en: '51–200', es: '51–200' },
    two_hundred_one_to_1000: { en: '201–1,000', es: '201–1,000' },
    over_1000: { en: 'Over 1,000', es: 'Más de 1,000' },
    unknown: UNKNOWN,
  },
  handoff_count: {
    zero: { en: 'None', es: 'Ninguno' },
    one_to_2: { en: '1–2', es: '1–2' },
    three_to_5: { en: '3–5', es: '3–5' },
    six_plus: { en: '6 or more', es: '6 o más' },
    unknown: UNKNOWN,
  },
  exception_frequency: {
    rare: { en: 'Rarely', es: 'Rara vez' },
    sometimes: { en: 'Sometimes', es: 'A veces' },
    often: { en: 'Often', es: 'Con frecuencia' },
    most_cases: { en: 'In most cases', es: 'En la mayoría de los casos' },
    unknown: UNKNOWN,
  },
  bottleneck: {
    waiting: { en: 'Waiting on people or approvals', es: 'Esperas por personas o aprobaciones' },
    manual_entry: { en: 'Manual data entry', es: 'Captura manual de datos' },
    duplicate_work: { en: 'Duplicate work', es: 'Trabajo duplicado' },
    missing_information: { en: 'Missing information', es: 'Información faltante' },
    approval_delay: { en: 'Approval delays', es: 'Demoras en aprobaciones' },
    system_switching: { en: 'Switching between systems', es: 'Cambiar entre sistemas' },
    inconsistent_follow_up: { en: 'Inconsistent follow-up', es: 'Seguimiento inconsistente' },
    staff_capacity: { en: 'Staff capacity', es: 'Capacidad del personal' },
    quality_rework: { en: 'Quality issues and rework', es: 'Problemas de calidad y retrabajo' },
    limited_reporting: { en: 'Limited reporting', es: 'Informes limitados' },
    other: OTHER,
    unknown: UNKNOWN,
  },
  delay_band: {
    under_15_minutes: { en: 'Under 15 minutes', es: 'Menos de 15 minutos' },
    fifteen_to_60_minutes: { en: '15–60 minutes', es: '15–60 minutos' },
    one_to_4_hours: { en: '1–4 hours', es: '1–4 horas' },
    same_day: { en: 'Same day', es: 'El mismo día' },
    one_to_3_days: { en: '1–3 days', es: '1–3 días' },
    over_3_days: { en: 'Over 3 days', es: 'Más de 3 días' },
    unknown: UNKNOWN,
    not_applicable: { en: 'Not applicable', es: 'No aplica' },
  },
  manual_effort: {
    under_2_hours_week: { en: 'Under 2 hours per week', es: 'Menos de 2 horas por semana' },
    two_to_5_hours_week: { en: '2–5 hours per week', es: '2–5 horas por semana' },
    six_to_10_hours_week: { en: '6–10 hours per week', es: '6–10 horas por semana' },
    eleven_to_20_hours_week: { en: '11–20 hours per week', es: '11–20 horas por semana' },
    over_20_hours_week: { en: 'Over 20 hours per week', es: 'Más de 20 horas por semana' },
    unknown: UNKNOWN,
  },
  rework_frequency: {
    rare: { en: 'Rarely', es: 'Rara vez' },
    monthly: { en: 'Monthly', es: 'Cada mes' },
    weekly: { en: 'Weekly', es: 'Cada semana' },
    daily: { en: 'Daily', es: 'Cada día' },
    unknown: UNKNOWN,
  },
  system_category: {
    crm: { en: 'CRM', es: 'CRM' },
    spreadsheet: { en: 'Spreadsheets', es: 'Hojas de cálculo' },
    email: { en: 'Email', es: 'Correo electrónico' },
    calendar: { en: 'Calendar', es: 'Calendario' },
    phone_messaging: { en: 'Phone / messaging', es: 'Teléfono / mensajería' },
    project_work: { en: 'Project or work management', es: 'Gestión de proyectos o trabajo' },
    helpdesk: { en: 'Helpdesk / support', es: 'Mesa de ayuda / soporte' },
    marketing: { en: 'Marketing tools', es: 'Herramientas de marketing' },
    sales: { en: 'Sales tools', es: 'Herramientas de ventas' },
    ecommerce: { en: 'E-commerce platform', es: 'Plataforma de e-commerce' },
    finance_billing: { en: 'Finance / billing', es: 'Finanzas / facturación' },
    document_storage: { en: 'Document storage', es: 'Almacenamiento de documentos' },
    custom_database: { en: 'Custom database', es: 'Base de datos propia' },
    other: OTHER,
    none: NONE,
  },
  integration_state: {
    fully_integrated: { en: 'Fully integrated', es: 'Totalmente integrados' },
    partially_integrated: { en: 'Partially integrated', es: 'Parcialmente integrados' },
    mostly_separate: { en: 'Mostly separate', es: 'Mayormente separados' },
    manual_transfer: { en: 'Data moved by hand', es: 'Datos transferidos manualmente' },
    not_applicable: { en: 'Not applicable', es: 'No aplica' },
    unknown: UNKNOWN,
  },
  data_source: {
    crm: { en: 'CRM records', es: 'Registros del CRM' },
    forms: { en: 'Forms', es: 'Formularios' },
    email: { en: 'Email threads', es: 'Hilos de correo' },
    spreadsheet: { en: 'Spreadsheets', es: 'Hojas de cálculo' },
    calendar: { en: 'Calendars', es: 'Calendarios' },
    phone_messages: { en: 'Phone messages', es: 'Mensajes telefónicos' },
    finance: { en: 'Finance records', es: 'Registros financieros' },
    ecommerce: { en: 'E-commerce data', es: 'Datos de e-commerce' },
    website_analytics: { en: 'Website analytics', es: 'Analítica del sitio web' },
    support: { en: 'Support tickets', es: 'Tickets de soporte' },
    documents: { en: 'Documents', es: 'Documentos' },
    other: OTHER,
    none: NONE,
  },
  data_quality_state: {
    reliable: { en: 'Reliable', es: 'Confiable' },
    minor_gaps: { en: 'Minor gaps', es: 'Brechas menores' },
    significant_gaps: { en: 'Significant gaps', es: 'Brechas significativas' },
    not_assessed: { en: 'Not assessed', es: 'Sin evaluar' },
    unknown: UNKNOWN,
  },
  data_access_state: {
    authorized_available: {
      en: 'Authorized access is available',
      es: 'Hay acceso autorizado disponible',
    },
    authorized_partial: { en: 'Partial authorized access', es: 'Acceso autorizado parcial' },
    owner_approval_needed: {
      en: 'Owner approval needed',
      es: 'Se necesita aprobación del propietario',
    },
    unavailable: { en: 'Not available', es: 'No disponible' },
    unknown: UNKNOWN,
  },
  regulated_data: {
    personal_contact: { en: 'Personal contact details', es: 'Datos personales de contacto' },
    customer_financial: { en: 'Customer financial data', es: 'Datos financieros de clientes' },
    health_related: { en: 'Health-related data', es: 'Datos relacionados con la salud' },
    children: { en: 'Data about children', es: 'Datos de menores' },
    biometric: { en: 'Biometric data', es: 'Datos biométricos' },
    government_id: { en: 'Government IDs', es: 'Identificaciones oficiales' },
    precise_location: { en: 'Precise location data', es: 'Ubicación precisa' },
    credentials: { en: 'Credentials', es: 'Credenciales' },
    other: OTHER,
    none: NONE,
    unknown: UNKNOWN,
  },
  change_capacity: {
    none_available: { en: 'No capacity available', es: 'Sin capacidad disponible' },
    under_2_hours_week: { en: 'Under 2 hours per week', es: 'Menos de 2 horas por semana' },
    two_to_5_hours_week: { en: '2–5 hours per week', es: '2–5 horas por semana' },
    six_to_10_hours_week: { en: '6–10 hours per week', es: '6–10 horas por semana' },
    over_10_hours_week: { en: 'Over 10 hours per week', es: 'Más de 10 horas por semana' },
    unknown: UNKNOWN,
  },
  investment_constraint: {
    no_budget_planned: { en: 'No budget planned', es: 'Sin presupuesto previsto' },
    high_cost_sensitivity: { en: 'High cost sensitivity', es: 'Alta sensibilidad al costo' },
    estimate_needed: { en: 'An estimate is needed first', es: 'Primero se necesita un estimado' },
    approved_budget_exists: {
      en: 'An approved budget exists',
      es: 'Existe un presupuesto aprobado',
    },
    prefer_no_new_tools: { en: 'Prefer no new tools', es: 'Se prefiere no añadir herramientas' },
    unknown: UNKNOWN,
  },
  work_mode: {
    manual: { en: 'Manual', es: 'Manual' },
    mixed: { en: 'Mixed', es: 'Mixto' },
    automated: { en: 'Automated', es: 'Automatizado' },
  },
  metric_quality: {
    measured: { en: 'Measured', es: 'Medido' },
    estimated: { en: 'Estimated', es: 'Estimado' },
  },
};

export const uiCopy: Record<string, Bilingual> = {
  pageTitle: {
    en: 'Business Assessment questionnaire',
    es: 'Cuestionario de la Evaluación Empresarial',
  },
  pageIntro: {
    en: 'Your answers are saved as you go. You can leave and come back at any time.',
    es: 'Sus respuestas se guardan mientras avanza. Puede salir y volver en cualquier momento.',
  },
  saving: { en: 'Saving…', es: 'Guardando…' },
  saved: { en: 'All changes saved', es: 'Todos los cambios guardados' },
  saveFailed: {
    en: 'Some answers could not be saved. Check the highlighted fields.',
    es: 'Algunas respuestas no se pudieron guardar. Revise los campos marcados.',
  },
  conflict: {
    en: 'This questionnaire was updated in another window. Reload the page to continue with the latest version.',
    es: 'Este cuestionario se actualizó en otra ventana. Recargue la página para continuar con la versión más reciente.',
  },
  reload: { en: 'Reload', es: 'Recargar' },
  submit: { en: 'Submit questionnaire', es: 'Enviar cuestionario' },
  submitting: { en: 'Submitting…', es: 'Enviando…' },
  submitInvalid: {
    en: 'Some required answers are missing or inconsistent. Review the fields listed below.',
    es: 'Faltan respuestas obligatorias o hay inconsistencias. Revise los campos indicados abajo.',
  },
  submitted: {
    en: 'Questionnaire complete. The next step is your interview.',
    es: 'Cuestionario completado. El siguiente paso es su entrevista.',
  },
  toInterview: { en: 'Continue to the interview', es: 'Continuar a la entrevista' },
  optional: { en: 'Optional', es: 'Opcional' },
  addRow: { en: 'Add', es: 'Añadir' },
  removeRow: { en: 'Remove', es: 'Quitar' },
  selectPlaceholder: { en: 'Select…', es: 'Seleccione…' },
  stepLabel: { en: 'Step description', es: 'Descripción del paso' },
  stepOwner: { en: 'Role responsible (no names)', es: 'Función responsable (sin nombres)' },
  stepWorkMode: { en: 'How it is done', es: 'Cómo se realiza' },
  stepSystem: { en: 'System used', es: 'Sistema utilizado' },
  metricMetric: { en: 'Measure', es: 'Métrica' },
  metricValue: { en: 'Value or range', es: 'Valor o rango' },
  metricUnit: { en: 'Unit', es: 'Unidad' },
  metricPeriod: { en: 'Period', es: 'Período' },
  metricQuality: { en: 'Measured or estimated?', es: '¿Medido o estimado?' },
  inventoryCategory: { en: 'Category', es: 'Categoría' },
  inventoryProduct: { en: 'Product name (optional)', es: 'Nombre del producto (opcional)' },
  inventoryPurpose: { en: 'What it is used for', es: 'Para qué se utiliza' },
};

export function label(entry: Bilingual | undefined, locale: Locale): string {
  if (!entry) return '';
  return locale === 'es' ? entry.es : entry.en;
}
