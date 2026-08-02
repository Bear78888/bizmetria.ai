import type { Locale } from './config';

/**
 * Homepage content for the instrument redesign (design brief, 2026-08-02).
 *
 * Copy rules from the brief §5 apply here: CTAs name the outcome, at most one
 * em-dash per screen, specificity anchors ("11 questions, about 4 minutes"),
 * and the honest positioning line stays. Testimonials are deliberately absent
 * until real ones exist; the brief forbids fabricating them.
 */

const home = {
  en: {
    hero: {
      eyebrow: 'AI OPPORTUNITY SCORE',
      title: 'Measure where AI would actually pay off in your business.',
      subhead:
        'Answer 11 questions, about 4 minutes. You get a deterministic 0–100 score and up to three priority areas, without pretending to know your business better than you do.',
      primaryCta: 'Get my free score',
      secondaryCta: 'See a sample report',
      trust: 'No credit card · English & Español',
      gauge: {
        label: 'SAMPLE AI OPPORTUNITY SCORE',
        caption: 'Deterministic: same answers, same score. Every time.',
        cta: 'Get your real score — free',
        bars: [
          { label: 'Response & follow-up', value: 24, max: 30 },
          { label: 'Manual operations', value: 26, max: 40 },
          { label: 'Systems & data', value: 18, max: 30 },
        ],
      },
    },
    proof: {
      lead: 'Built for owner-run businesses in',
      chips: [
        'HOME SERVICES',
        'DENTAL & CLINICS',
        'E-COMMERCE',
        'PROFESSIONAL SERVICES',
        'REAL ESTATE',
      ],
    },
    steps: {
      eyebrow: 'HOW IT WORKS',
      title: 'Three steps from friction to focus.',
      items: [
        {
          number: '01',
          title: 'Answer',
          text: '11 questions about leads, follow-up, manual work and systems. About 4 minutes.',
        },
        {
          number: '02',
          title: 'Score',
          text: 'A transparent 0–100 score. Identical answers always produce an identical score.',
        },
        {
          number: '03',
          title: 'Focus',
          text: 'Up to three priority areas, so the next conversation starts in the right place.',
        },
      ],
    },
    report: {
      eyebrow: 'THE $299 DELIVERABLE',
      title: 'A report you can hand to your team.',
      text: 'The Business Assessment turns your questionnaire and a recorded interview into a reviewed report: findings tied to evidence, an Impact vs. Effort Matrix, and a 30-day implementation plan. Fixed price, no subscription, and implementation is never required.',
      note: 'Sample pages, illustrative content.',
      matrix: {
        pageLabel: 'SAMPLE PAGE · IMPACT VS. EFFORT',
        title: 'Impact vs. Effort Matrix',
        axisY: 'IMPACT',
        axisX: 'EFFORT',
        points: [
          { label: 'Intake auto-reply', impact: 'high', effort: 'low' },
          { label: 'Follow-up sequences', impact: 'high', effort: 'medium' },
          { label: 'CRM cleanup', impact: 'medium', effort: 'medium' },
          { label: 'Custom reporting', impact: 'medium', effort: 'high' },
        ],
        callout: 'Every recommendation is placed, so you see what is worth doing first.',
      },
      roadmap: {
        pageLabel: 'SAMPLE PAGE · 30-DAY PLAN',
        title: '30-day implementation plan',
        phases: [
          {
            window: 'WEEK 1',
            item: 'Document the intake workflow; switch on auto-acknowledgement.',
          },
          { window: 'WEEKS 2–3', item: 'Pilot follow-up sequences on one lead source.' },
          { window: 'WEEK 4', item: 'Review results against response-time baseline.' },
        ],
        callout: 'Sequenced to your stated capacity, not to a vendor’s sales cycle.',
      },
      cta: 'Start the $299 assessment',
    },
    focus: {
      eyebrow: 'WHAT THE SCORE MEASURES',
      title: 'Three places money leaks quietly.',
      rows: [
        {
          title: 'Response and follow-up',
          text: 'Speed to first reply and consistency of follow-up decide how many inquiries become customers. This is usually the fastest AI win, and the score measures how much room you have.',
          sign: 'Typical sign: inquiries that arrive after 6pm get answered tomorrow.',
          diagram: 'response',
        },
        {
          title: 'Manual operations',
          text: 'Re-typing, copying between tools, assembling the same document again. The score sizes whether repetitive work is broad enough to justify structured automation.',
          sign: 'Typical sign: your best person spends Friday afternoons on data entry.',
          diagram: 'manual',
        },
        {
          title: 'Systems and data',
          text: 'Disconnected tools make every future improvement more expensive. The score checks whether your data is ready before you spend a dollar on implementation.',
          sign: 'Typical sign: the answer to "where is that customer’s history?" is "in three places."',
          diagram: 'systems',
        },
      ],
    },
    pricing: {
      eyebrow: 'WHAT IT COSTS',
      title: 'Priced against the alternatives.',
      columns: [
        {
          name: 'Guess on your own',
          price: '$0',
          detail: 'Weeks of trial and error. A failed AI pilot typically wastes $10K+.',
          cta: null,
          highlighted: false,
        },
        {
          name: 'BizMetria Assessment',
          price: '$299',
          detail:
            'Fixed price. Reviewed report, Impact vs. Effort Matrix, 30-day implementation plan, results consultation.',
          cta: 'Start the $299 assessment',
          highlighted: true,
        },
        {
          name: 'Consulting audit',
          price: '$1,500–5,000+',
          detail: 'Multi-day engagement. Useful later, expensive as a first step.',
          cta: null,
          highlighted: false,
        },
      ],
      note: 'The free 11-question check comes first either way.',
    },
    faq: {
      eyebrow: 'QUESTIONS OWNERS ASK',
      title: 'Straight answers.',
      items: [
        {
          q: 'Is the free check really free?',
          a: 'Yes. No credit card, no payment details. The result appears immediately.',
        },
        {
          q: 'How is the score calculated?',
          a: 'Rule-based and transparent. Identical answers always produce an identical 0–100 score. No black-box AI grading your business.',
        },
        {
          q: 'What exactly do I get for $299?',
          a: 'A personalized analysis reviewed by a person: findings, recommendations, an Impact vs. Effort Matrix, a 30-day implementation plan, and a results consultation.',
        },
        {
          q: 'How do I give my answers after purchase?',
          a: 'Your choice: talk to our voice agent right in the browser — it asks all the questions in a 30–60 minute conversation (recommended) — or fill in the written questionnaire at your own pace. Both lead to the same reviewed report.',
        },
        {
          q: 'Will you try to sell me implementation?',
          a: 'No. Implementation is separate and never required. The assessment is designed to be useful even if you never buy anything else.',
        },
        {
          q: 'Can I do everything in Spanish?',
          a: 'Yes. The check, the questionnaire, the interview and the report are all available in Spanish.',
        },
      ],
    },
    bilingual: {
      title: '¿Prefieres español?',
      text: 'Toda la evaluación está disponible en español: el chequeo gratuito, el cuestionario, la entrevista y el informe.',
      cta: 'Hacer el chequeo gratis en español',
    },
    finalCta: {
      title: 'Start with a number, not a pitch.',
      text: '11 questions, about 4 minutes, and a score you can act on.',
      cta: 'Get my free score',
    },
    footer: {
      about:
        'BizMetria measures before it recommends. Built by a small team, in English and Spanish.',
      contact: 'Questions? Ask Metria, the assistant in the corner of this page.',
      language: 'Español',
      rights: '© 2026 BizMetria',
    },
  },
  es: {
    hero: {
      eyebrow: 'PUNTUACIÓN DE OPORTUNIDAD DE IA',
      title: 'Mida dónde la IA realmente rendiría en su negocio.',
      subhead:
        'Responda 11 preguntas, unos 4 minutos. Obtiene una puntuación determinista de 0 a 100 y hasta tres áreas prioritarias, sin pretender conocer su negocio mejor que usted.',
      primaryCta: 'Obtener mi puntuación gratis',
      secondaryCta: 'Ver un informe de muestra',
      trust: 'Sin tarjeta · English & Español',
      gauge: {
        label: 'PUNTUACIÓN DE MUESTRA',
        caption: 'Determinista: mismas respuestas, misma puntuación. Siempre.',
        cta: 'Obtenga su puntuación real — gratis',
        bars: [
          { label: 'Respuesta y seguimiento', value: 24, max: 30 },
          { label: 'Operaciones manuales', value: 26, max: 40 },
          { label: 'Sistemas y datos', value: 18, max: 30 },
        ],
      },
    },
    proof: {
      lead: 'Creado para negocios dirigidos por sus dueños en',
      chips: [
        'SERVICIOS A DOMICILIO',
        'CLÍNICAS Y DENTAL',
        'E-COMMERCE',
        'SERVICIOS PROFESIONALES',
        'BIENES RAÍCES',
      ],
    },
    steps: {
      eyebrow: 'CÓMO FUNCIONA',
      title: 'Tres pasos de la fricción al enfoque.',
      items: [
        {
          number: '01',
          title: 'Responda',
          text: '11 preguntas sobre prospectos, seguimiento, trabajo manual y sistemas. Unos 4 minutos.',
        },
        {
          number: '02',
          title: 'Puntúe',
          text: 'Una puntuación transparente de 0 a 100. Respuestas idénticas siempre producen una puntuación idéntica.',
        },
        {
          number: '03',
          title: 'Enfoque',
          text: 'Hasta tres áreas prioritarias, para que la siguiente conversación empiece en el lugar correcto.',
        },
      ],
    },
    report: {
      eyebrow: 'EL ENTREGABLE DE $299',
      title: 'Un informe que puede entregar a su equipo.',
      text: 'La Evaluación Empresarial convierte su cuestionario y una entrevista grabada en un informe revisado: hallazgos ligados a evidencia, una Matriz de impacto frente a esfuerzo y un plan de implementación de 30 días. Precio fijo, sin suscripción, y la implementación nunca es obligatoria.',
      note: 'Páginas de muestra, contenido ilustrativo.',
      matrix: {
        pageLabel: 'PÁGINA DE MUESTRA · IMPACTO VS. ESFUERZO',
        title: 'Matriz de impacto frente a esfuerzo',
        axisY: 'IMPACTO',
        axisX: 'ESFUERZO',
        points: [
          { label: 'Respuesta automática de entrada', impact: 'high', effort: 'low' },
          { label: 'Secuencias de seguimiento', impact: 'high', effort: 'medium' },
          { label: 'Limpieza del CRM', impact: 'medium', effort: 'medium' },
          { label: 'Informes a medida', impact: 'medium', effort: 'high' },
        ],
        callout: 'Cada recomendación está ubicada, para que vea qué conviene hacer primero.',
      },
      roadmap: {
        pageLabel: 'PÁGINA DE MUESTRA · PLAN DE 30 DÍAS',
        title: 'Plan de implementación de 30 días',
        phases: [
          {
            window: 'DÍAS 1–30',
            item: 'Documentar el flujo de entrada; activar el acuse automático.',
          },
          {
            window: 'DÍAS 31–60',
            item: 'Pilotar secuencias de seguimiento en una fuente de prospectos.',
          },
          {
            window: 'DÍAS 61–90',
            item: 'Revisar resultados contra la línea base de tiempo de respuesta.',
          },
        ],
        callout:
          'Secuenciada según su capacidad declarada, no según el ciclo de ventas de un proveedor.',
      },
      cta: 'Comenzar la evaluación de $299',
    },
    focus: {
      eyebrow: 'QUÉ MIDE LA PUNTUACIÓN',
      title: 'Tres lugares donde el dinero se escapa en silencio.',
      rows: [
        {
          title: 'Respuesta y seguimiento',
          text: 'La velocidad de la primera respuesta y la constancia del seguimiento deciden cuántas consultas se convierten en clientes. Suele ser la victoria de IA más rápida, y la puntuación mide cuánto margen tiene.',
          sign: 'Señal típica: las consultas que llegan después de las 6pm se responden mañana.',
          diagram: 'response',
        },
        {
          title: 'Operaciones manuales',
          text: 'Reescribir, copiar entre herramientas, armar el mismo documento otra vez. La puntuación dimensiona si el trabajo repetitivo es suficiente para justificar automatización estructurada.',
          sign: 'Señal típica: su mejor persona pasa los viernes por la tarde capturando datos.',
          diagram: 'manual',
        },
        {
          title: 'Sistemas y datos',
          text: 'Las herramientas desconectadas encarecen cada mejora futura. La puntuación revisa si sus datos están listos antes de gastar un dólar en implementación.',
          sign: 'Señal típica: la respuesta a «¿dónde está el historial de ese cliente?» es «en tres lugares».',
          diagram: 'systems',
        },
      ],
    },
    pricing: {
      eyebrow: 'CUÁNTO CUESTA',
      title: 'Comparado con las alternativas.',
      columns: [
        {
          name: 'Adivinar por su cuenta',
          price: '$0',
          detail: 'Semanas de prueba y error. Un piloto de IA fallido suele costar más de $10K.',
          cta: null,
          highlighted: false,
        },
        {
          name: 'Evaluación BizMetria',
          price: '$299',
          detail:
            'Precio fijo. Informe revisado, Matriz de impacto frente a esfuerzo, plan de implementación de 30 días, consulta de resultados.',
          cta: 'Comenzar la evaluación de $299',
          highlighted: true,
        },
        {
          name: 'Auditoría de consultoría',
          price: '$1,500–5,000+',
          detail: 'Compromiso de varios días. Útil después, caro como primer paso.',
          cta: null,
          highlighted: false,
        },
      ],
      note: 'El chequeo gratuito de 11 preguntas va primero en cualquier caso.',
    },
    faq: {
      eyebrow: 'PREGUNTAS QUE HACEN LOS DUEÑOS',
      title: 'Respuestas directas.',
      items: [
        {
          q: '¿El chequeo gratuito es realmente gratis?',
          a: 'Sí. Sin tarjeta, sin datos de pago. El resultado aparece de inmediato.',
        },
        {
          q: '¿Cómo se calcula la puntuación?',
          a: 'Con reglas transparentes. Respuestas idénticas siempre producen una puntuación idéntica de 0 a 100. Ninguna IA opaca califica su negocio.',
        },
        {
          q: '¿Qué recibo exactamente por $299?',
          a: 'Un análisis personalizado revisado por una persona: hallazgos, recomendaciones, una Matriz de impacto frente a esfuerzo, un plan de implementación de 30 días y una consulta de resultados.',
        },
        {
          q: '¿Cómo doy mis respuestas después de la compra?',
          a: 'Usted elige: hable con nuestro agente de voz directamente en el navegador — le hace todas las preguntas en una conversación de 30 a 60 minutos (recomendado) — o complete el cuestionario escrito a su ritmo. Ambos llevan al mismo informe revisado.',
        },
        {
          q: '¿Intentarán venderme implementación?',
          a: 'No. La implementación es aparte y nunca es obligatoria. La evaluación está diseñada para ser útil aunque no compre nada más.',
        },
        {
          q: '¿Puedo hacerlo todo en español?',
          a: 'Sí. El chequeo, el cuestionario, la entrevista y el informe están disponibles en español.',
        },
      ],
    },
    bilingual: {
      title: 'Prefer English?',
      text: 'The whole assessment is available in English: the free check, the questionnaire, the interview and the report.',
      cta: 'Take the free check in English',
    },
    finalCta: {
      title: 'Empiece con un número, no con un discurso.',
      text: '11 preguntas, unos 4 minutos, y una puntuación sobre la que puede actuar.',
      cta: 'Obtener mi puntuación gratis',
    },
    footer: {
      about:
        'BizMetria mide antes de recomendar. Creado por un equipo pequeño, en inglés y español.',
      contact: '¿Preguntas? Pregunte a Metria, el asistente en la esquina de esta página.',
      language: 'English',
      rights: '© 2026 BizMetria',
    },
  },
} as const;

export type HomeContent = (typeof home)[Locale];

export function getHomeContent(locale: Locale): HomeContent {
  return home[locale];
}
