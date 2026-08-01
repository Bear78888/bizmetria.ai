import type { AssessmentLocale, QuestionId } from './schema';
import type { ScoreBand, ScoreBlockId } from './score';

export interface AssessmentOption {
  readonly value: string;
  readonly label: string;
}

export interface AssessmentQuestion {
  readonly id: QuestionId;
  readonly title: string;
  readonly hint?: string;
  readonly input: 'single' | 'multi';
  readonly options: readonly AssessmentOption[];
}

function options(rows: readonly (readonly [string, string])[]): readonly AssessmentOption[] {
  return rows.map(([value, label]) => ({ value, label }));
}

const enQuestions: readonly AssessmentQuestion[] = [
  {
    id: 'Q01',
    title: 'Which category best describes your business?',
    input: 'single',
    options: options([
      ['professional_services', 'Professional services'],
      ['home_field_services', 'Home or field services'],
      ['health_wellness', 'Health and wellness'],
      ['retail_ecommerce', 'Retail or ecommerce'],
      ['hospitality_food', 'Hospitality or food'],
      ['real_estate_property', 'Real estate or property'],
      ['financial_insurance', 'Financial services or insurance'],
      ['education_training', 'Education or training'],
      ['manufacturing_distribution', 'Manufacturing or distribution'],
      ['nonprofit_community', 'Nonprofit or community organization'],
      ['technology_software', 'Technology or software'],
      ['other', 'Other'],
    ]),
  },
  {
    id: 'Q02',
    title: 'How large is your team?',
    input: 'single',
    options: options([
      ['solo', 'Just me'],
      ['team_2_5', '2–5 people'],
      ['team_6_10', '6–10 people'],
      ['team_11_25', '11–25 people'],
      ['team_26_50', '26–50 people'],
      ['team_51_plus', '51+ people'],
    ]),
  },
  {
    id: 'Q03',
    title: 'About how many new inquiries do you receive each month?',
    input: 'single',
    options: options([
      ['zero_to_10', '0–10'],
      ['eleven_to_30', '11–30'],
      ['thirty_one_to_100', '31–100'],
      ['one_hundred_one_to_300', '101–300'],
      ['over_300', 'More than 300'],
      ['unknown', 'I am not sure'],
    ]),
  },
  {
    id: 'Q04',
    title: 'Where do new inquiries usually arrive?',
    hint: 'Select all that apply.',
    input: 'multi',
    options: options([
      ['phone', 'Phone calls'],
      ['sms', 'Text messages'],
      ['email', 'Email'],
      ['website_form', 'Website form'],
      ['web_chat', 'Website chat'],
      ['social_direct_messages', 'Social media direct messages'],
      ['marketplace_platform', 'Marketplace or platform'],
      ['in_person', 'In person'],
      ['other', 'Other'],
    ]),
  },
  {
    id: 'Q05',
    title: 'How quickly does your team usually respond to a new inquiry?',
    input: 'single',
    options: options([
      ['within_5_minutes', 'Within 5 minutes'],
      ['six_to_15_minutes', '6–15 minutes'],
      ['sixteen_to_60_minutes', '16–60 minutes'],
      ['one_to_4_hours', '1–4 hours'],
      ['same_day', 'Later the same day'],
      ['next_day_or_later', 'The next day or later'],
    ]),
  },
  {
    id: 'Q06',
    title: 'How do you currently track customers and opportunities?',
    input: 'single',
    options: options([
      ['integrated_crm', 'An integrated CRM used consistently'],
      ['basic_or_partially_used_crm', 'A basic or partially used CRM'],
      ['spreadsheet_or_project_tool', 'A spreadsheet or project tool'],
      ['inbox_notes_or_multiple_places', 'Inboxes, notes, or several places'],
      ['no_consistent_system', 'No consistent system'],
    ]),
  },
  {
    id: 'Q07',
    title: 'Which areas require repetitive manual work today?',
    hint: 'Select all that apply.',
    input: 'multi',
    options: options([
      ['lead_intake', 'Lead intake'],
      ['follow_up', 'Follow-up'],
      ['scheduling', 'Scheduling'],
      ['quotes_or_proposals', 'Quotes or proposals'],
      ['data_entry', 'Data entry'],
      ['customer_support', 'Customer support'],
      ['billing_or_collections', 'Billing or collections'],
      ['reporting', 'Reporting'],
      ['marketing', 'Marketing'],
      ['internal_coordination', 'Internal coordination'],
      ['other', 'Other'],
      ['none', 'None of these'],
    ]),
  },
  {
    id: 'Q08',
    title: 'What usually happens when a potential customer does not respond or buy right away?',
    input: 'single',
    options: options([
      ['automated_multi_step_follow_up', 'Automated multi-step follow-up'],
      ['consistent_manual_follow_up', 'Consistent manual follow-up'],
      ['occasional_follow_up', 'Occasional follow-up'],
      ['no_defined_follow_up', 'No defined follow-up process'],
    ]),
  },
  {
    id: 'Q09',
    title: 'What is the most important operational problem to solve?',
    input: 'single',
    options: options([
      ['slow_lead_response', 'Slow lead response'],
      ['lost_or_untracked_leads', 'Lost or untracked leads'],
      ['too_much_manual_work', 'Too much manual work'],
      ['inconsistent_follow_up', 'Inconsistent follow-up'],
      ['disconnected_systems', 'Disconnected systems'],
      ['limited_visibility_or_reporting', 'Limited visibility or reporting'],
      ['customer_service_capacity', 'Customer service capacity'],
      ['marketing_or_sales_consistency', 'Marketing or sales consistency'],
      ['other', 'Other'],
    ]),
  },
  {
    id: 'Q10',
    title: 'What outcome would matter most in the next 90 days?',
    input: 'single',
    options: options([
      ['respond_faster', 'Respond faster'],
      ['convert_more_existing_leads', 'Convert more existing leads'],
      ['reduce_manual_work', 'Reduce manual work'],
      ['improve_customer_experience', 'Improve customer experience'],
      ['organize_data_and_systems', 'Organize data and systems'],
      ['improve_reporting', 'Improve reporting'],
      ['scale_without_equivalent_hiring', 'Scale without equivalent hiring'],
      ['identify_best_ai_priorities', 'Identify the best AI priorities'],
      ['other', 'Other'],
    ]),
  },
  {
    id: 'Q11',
    title: 'When would you like to start improving this area?',
    input: 'single',
    options: options([
      ['just_exploring', 'I am just exploring'],
      ['within_6_to_12_months', 'Within 6–12 months'],
      ['within_3_to_6_months', 'Within 3–6 months'],
      ['within_1_to_3_months', 'Within 1–3 months'],
      ['start_now', 'I want to start now'],
    ]),
  },
];

const esQuestions: readonly AssessmentQuestion[] = [
  {
    id: 'Q01',
    title: '¿Qué categoría describe mejor su negocio?',
    input: 'single',
    options: options([
      ['professional_services', 'Servicios profesionales'],
      ['home_field_services', 'Servicios a domicilio o en campo'],
      ['health_wellness', 'Salud y bienestar'],
      ['retail_ecommerce', 'Comercio minorista o electrónico'],
      ['hospitality_food', 'Hotelería o alimentos'],
      ['real_estate_property', 'Bienes raíces o propiedades'],
      ['financial_insurance', 'Servicios financieros o seguros'],
      ['education_training', 'Educación o capacitación'],
      ['manufacturing_distribution', 'Fabricación o distribución'],
      ['nonprofit_community', 'Organización comunitaria o sin fines de lucro'],
      ['technology_software', 'Tecnología o software'],
      ['other', 'Otro'],
    ]),
  },
  {
    id: 'Q02',
    title: '¿Cuántas personas forman su equipo?',
    input: 'single',
    options: options([
      ['solo', 'Solo yo'],
      ['team_2_5', '2–5 personas'],
      ['team_6_10', '6–10 personas'],
      ['team_11_25', '11–25 personas'],
      ['team_26_50', '26–50 personas'],
      ['team_51_plus', '51 o más personas'],
    ]),
  },
  {
    id: 'Q03',
    title: '¿Aproximadamente cuántas consultas nuevas recibe cada mes?',
    input: 'single',
    options: options([
      ['zero_to_10', '0–10'],
      ['eleven_to_30', '11–30'],
      ['thirty_one_to_100', '31–100'],
      ['one_hundred_one_to_300', '101–300'],
      ['over_300', 'Más de 300'],
      ['unknown', 'No estoy seguro'],
    ]),
  },
  {
    id: 'Q04',
    title: '¿Por dónde suelen llegar las nuevas consultas?',
    hint: 'Seleccione todas las opciones que correspondan.',
    input: 'multi',
    options: options([
      ['phone', 'Llamadas telefónicas'],
      ['sms', 'Mensajes de texto'],
      ['email', 'Correo electrónico'],
      ['website_form', 'Formulario web'],
      ['web_chat', 'Chat del sitio web'],
      ['social_direct_messages', 'Mensajes directos en redes sociales'],
      ['marketplace_platform', 'Marketplace o plataforma'],
      ['in_person', 'En persona'],
      ['other', 'Otro'],
    ]),
  },
  {
    id: 'Q05',
    title: '¿Con qué rapidez suele responder su equipo a una consulta nueva?',
    input: 'single',
    options: options([
      ['within_5_minutes', 'En menos de 5 minutos'],
      ['six_to_15_minutes', '6–15 minutos'],
      ['sixteen_to_60_minutes', '16–60 minutos'],
      ['one_to_4_hours', '1–4 horas'],
      ['same_day', 'Más tarde el mismo día'],
      ['next_day_or_later', 'Al día siguiente o después'],
    ]),
  },
  {
    id: 'Q06',
    title: '¿Cómo gestiona actualmente clientes y oportunidades?',
    input: 'single',
    options: options([
      ['integrated_crm', 'Un CRM integrado y usado de forma constante'],
      ['basic_or_partially_used_crm', 'Un CRM básico o usado parcialmente'],
      ['spreadsheet_or_project_tool', 'Una hoja de cálculo o herramienta de proyectos'],
      ['inbox_notes_or_multiple_places', 'Bandejas de entrada, notas o varios lugares'],
      ['no_consistent_system', 'No hay un sistema constante'],
    ]),
  },
  {
    id: 'Q07',
    title: '¿Qué áreas requieren trabajo manual repetitivo actualmente?',
    hint: 'Seleccione todas las opciones que correspondan.',
    input: 'multi',
    options: options([
      ['lead_intake', 'Recepción de prospectos'],
      ['follow_up', 'Seguimiento'],
      ['scheduling', 'Programación de citas'],
      ['quotes_or_proposals', 'Cotizaciones o propuestas'],
      ['data_entry', 'Ingreso de datos'],
      ['customer_support', 'Atención al cliente'],
      ['billing_or_collections', 'Facturación o cobros'],
      ['reporting', 'Informes'],
      ['marketing', 'Marketing'],
      ['internal_coordination', 'Coordinación interna'],
      ['other', 'Otro'],
      ['none', 'Ninguna de estas'],
    ]),
  },
  {
    id: 'Q08',
    title: '¿Qué suele ocurrir cuando un posible cliente no responde o no compra de inmediato?',
    input: 'single',
    options: options([
      ['automated_multi_step_follow_up', 'Seguimiento automatizado de varios pasos'],
      ['consistent_manual_follow_up', 'Seguimiento manual constante'],
      ['occasional_follow_up', 'Seguimiento ocasional'],
      ['no_defined_follow_up', 'No existe un proceso de seguimiento definido'],
    ]),
  },
  {
    id: 'Q09',
    title: '¿Cuál es el problema operativo más importante que desea resolver?',
    input: 'single',
    options: options([
      ['slow_lead_response', 'Respuesta lenta a prospectos'],
      ['lost_or_untracked_leads', 'Prospectos perdidos o sin seguimiento'],
      ['too_much_manual_work', 'Demasiado trabajo manual'],
      ['inconsistent_follow_up', 'Seguimiento inconsistente'],
      ['disconnected_systems', 'Sistemas desconectados'],
      ['limited_visibility_or_reporting', 'Visibilidad o informes limitados'],
      ['customer_service_capacity', 'Capacidad de atención al cliente'],
      ['marketing_or_sales_consistency', 'Consistencia de marketing o ventas'],
      ['other', 'Otro'],
    ]),
  },
  {
    id: 'Q10',
    title: '¿Qué resultado sería más valioso en los próximos 90 días?',
    input: 'single',
    options: options([
      ['respond_faster', 'Responder más rápido'],
      ['convert_more_existing_leads', 'Convertir más prospectos actuales'],
      ['reduce_manual_work', 'Reducir el trabajo manual'],
      ['improve_customer_experience', 'Mejorar la experiencia del cliente'],
      ['organize_data_and_systems', 'Organizar datos y sistemas'],
      ['improve_reporting', 'Mejorar los informes'],
      ['scale_without_equivalent_hiring', 'Escalar sin contratar al mismo ritmo'],
      ['identify_best_ai_priorities', 'Identificar las mejores prioridades de IA'],
      ['other', 'Otro'],
    ]),
  },
  {
    id: 'Q11',
    title: '¿Cuándo le gustaría comenzar a mejorar esta área?',
    input: 'single',
    options: options([
      ['just_exploring', 'Solo estoy explorando'],
      ['within_6_to_12_months', 'En 6–12 meses'],
      ['within_3_to_6_months', 'En 3–6 meses'],
      ['within_1_to_3_months', 'En 1–3 meses'],
      ['start_now', 'Quiero comenzar ahora'],
    ]),
  },
];

export const assessmentContent = {
  en: {
    questions: enQuestions,
    eyebrow: 'Free AI Opportunity Check',
    title: 'See where AI could create the most practical value.',
    intro:
      'Answer 11 focused questions. Your score is deterministic, private, and ready in minutes.',
    progress: 'Question',
    of: 'of',
    back: 'Back',
    next: 'Continue',
    contactTitle: 'Where should we send your result?',
    contactIntro: 'Your contact details never affect your score.',
    contactName: 'Your name',
    businessName: 'Business name',
    email: 'Work email',
    website: 'Website (optional)',
    phone: 'Phone (optional)',
    otherBusinessType: 'Describe your business type',
    emailConsent: 'I agree to receive occasional BizMetria insights by email. Optional.',
    smsConsent:
      'I agree to receive occasional BizMetria text messages. Optional; message and data rates may apply.',
    serviceNotice:
      'We may email your requested result as a service message even if marketing is unchecked.',
    submit: 'Calculate my score',
    submitting: 'Calculating…',
    required: 'Choose an answer to continue.',
    multiRequired: 'Choose at least one option to continue.',
    submitError: 'We could not create your result. Please review the form and try again.',
  },
  es: {
    questions: esQuestions,
    eyebrow: 'Chequeo gratuito de oportunidades de IA',
    title: 'Descubra dónde la IA podría generar el valor más práctico.',
    intro:
      'Responda 11 preguntas concretas. Su puntuación es determinista, privada y tarda pocos minutos.',
    progress: 'Pregunta',
    of: 'de',
    back: 'Atrás',
    next: 'Continuar',
    contactTitle: '¿Dónde debemos enviar su resultado?',
    contactIntro: 'Sus datos de contacto nunca afectan la puntuación.',
    contactName: 'Su nombre',
    businessName: 'Nombre del negocio',
    email: 'Correo de trabajo',
    website: 'Sitio web (opcional)',
    phone: 'Teléfono (opcional)',
    otherBusinessType: 'Describa el tipo de negocio',
    emailConsent: 'Acepto recibir ocasionalmente información de BizMetria por correo. Opcional.',
    smsConsent:
      'Acepto recibir ocasionalmente mensajes de texto de BizMetria. Opcional; pueden aplicarse tarifas.',
    serviceNotice:
      'Podemos enviar por correo el resultado solicitado como mensaje de servicio aunque no acepte marketing.',
    submit: 'Calcular mi puntuación',
    submitting: 'Calculando…',
    required: 'Seleccione una respuesta para continuar.',
    multiRequired: 'Seleccione al menos una opción para continuar.',
    submitError: 'No pudimos crear su resultado. Revise el formulario e inténtelo de nuevo.',
  },
} as const;

const observations: Record<AssessmentLocale, Record<ScoreBand, string>> = {
  en: {
    FOCUSED: 'Your answers point to a focused set of operational areas worth reviewing.',
    MODERATE:
      'Your answers indicate several operational areas where structured improvements may help.',
    STRONG: 'Your answers indicate multiple connected opportunities across current operations.',
    HIGH: 'Your answers indicate broad operational opportunities that merit a prioritized review.',
    VERY_HIGH:
      'Your answers indicate extensive operational opportunities; a deeper evidence-based assessment can help prioritize them.',
  },
  es: {
    FOCUSED:
      'Sus respuestas señalan un conjunto focalizado de áreas operativas que conviene revisar.',
    MODERATE:
      'Sus respuestas indican varias áreas operativas en las que mejoras estructuradas podrían ayudar.',
    STRONG: 'Sus respuestas indican varias oportunidades relacionadas en las operaciones actuales.',
    HIGH: 'Sus respuestas indican amplias oportunidades operativas que merecen una revisión priorizada.',
    VERY_HIGH:
      'Sus respuestas indican oportunidades operativas extensas; una evaluación más profunda basada en evidencia puede ayudar a priorizarlas.',
  },
};

export const resultContent = {
  en: {
    eyebrow: 'Your free result',
    title: 'AI Opportunity Score',
    scoreOutOf: 'out of 100',
    areasTitle: 'Your clearest opportunity areas',
    areaLabels: {
      lead_response_follow_up: 'Response and follow-up',
      manual_work: 'Manual work',
      systems_data: 'Systems and data',
      strategic_priority_urgency: 'Priority and timing',
      opportunity_breadth: 'Connected opportunities',
    } satisfies Record<ScoreBlockId, string>,
    limitation:
      'This operational opportunity score is based only on your selected answers. It is not a financial valuation, credit score, business-quality rating, or guarantee of results.',
    lockedTitle: 'Included in the full Business Assessment',
    locked: [
      'Full personalized analysis',
      'Complete recommendations',
      'Impact vs. Effort Matrix',
      '30–90 day roadmap',
      'Professional PDF report',
      'Results consultation',
    ],
    offerTitle: 'Turn your score into a practical plan.',
    offerText:
      'Get the full Business Assessment for a one-time $299. Implementation services are separate.',
    offerAction: 'Get the full assessment — $299',
    restart: 'Take the check again',
    unavailableTitle: 'Your result is no longer available in this browser.',
    unavailableText: 'Retake the free check to create a new result.',
  },
  es: {
    eyebrow: 'Su resultado gratuito',
    title: 'Puntuación de oportunidad de IA',
    scoreOutOf: 'de 100',
    areasTitle: 'Sus áreas de oportunidad más claras',
    areaLabels: {
      lead_response_follow_up: 'Respuesta y seguimiento',
      manual_work: 'Trabajo manual',
      systems_data: 'Sistemas y datos',
      strategic_priority_urgency: 'Prioridad y plazos',
      opportunity_breadth: 'Oportunidades relacionadas',
    } satisfies Record<ScoreBlockId, string>,
    limitation:
      'Esta puntuación de oportunidad operativa se basa únicamente en las respuestas seleccionadas. No es una valoración financiera, una puntuación crediticia, una calificación de la calidad del negocio ni una garantía de resultados.',
    lockedTitle: 'Incluido en la Evaluación Empresarial completa',
    locked: [
      'Análisis personalizado completo',
      'Recomendaciones completas',
      'Matriz de impacto frente a esfuerzo',
      'Hoja de ruta de 30–90 días',
      'Informe profesional en PDF',
      'Consulta de resultados',
    ],
    offerTitle: 'Convierta su puntuación en un plan práctico.',
    offerText:
      'Obtenga la Evaluación Empresarial completa por un pago único de $299. Los servicios de implementación se contratan por separado.',
    offerAction: 'Obtener la evaluación completa — $299',
    restart: 'Repetir el chequeo',
    unavailableTitle: 'Su resultado ya no está disponible en este navegador.',
    unavailableText: 'Repita el chequeo gratuito para crear un resultado nuevo.',
  },
} as const;

export function observationFor(locale: AssessmentLocale, band: ScoreBand): string {
  return observations[locale][band];
}
