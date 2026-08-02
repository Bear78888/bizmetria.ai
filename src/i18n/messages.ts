import type { Locale } from './config';

const messages = {
  en: {
    navigation: {
      home: 'Home',
      assessment: 'Free AI Check',
      account: 'Account',
      signIn: 'Sign in',
      language: 'Español',
      ariaLabel: 'Primary navigation',
    },
    hero: {
      eyebrow: 'Practical AI guidance for growing businesses',
      title: 'Know where AI can make a measurable difference.',
      description:
        'BizMetria turns 11 clear answers into a deterministic AI Opportunity Score and a focused view of where to start—without hype or guesswork.',
      primaryAction: 'Take the free AI check',
      secondaryAction: 'See how it works',
      scoreLabel: 'AI Opportunity Score',
      scoreRange: '0–100',
      scoreNote: 'Deterministic · Bilingual · Evidence-led',
      trust: 'No credit card · No live payment · English & Español',
      freeLabel: 'FREE',
    },
    metrics: [
      ['11', 'focused questions'],
      ['0–100', 'transparent score'],
      ['3', 'priority areas at most'],
      ['$0', 'for your first result'],
    ],
    process: {
      eyebrow: 'A clearer starting point',
      title: 'From operational friction to an actionable direction.',
      items: [
        {
          number: '01',
          title: 'Answer what you know',
          text: 'Tell us how leads, follow-up, manual work, systems, and priorities work today.',
        },
        {
          number: '02',
          title: 'Get a consistent score',
          text: 'The same answers always produce the same 0–100 score—no hidden AI judgment.',
        },
        {
          number: '03',
          title: 'Focus the next conversation',
          text: 'See up to three broad opportunity areas before deciding whether a deeper audit is useful.',
        },
      ],
    },
    benefits: {
      eyebrow: 'Built for practical decisions',
      title: 'Useful signal, without pretending to know your business better than you do.',
      items: [
        [
          'Response and follow-up',
          'Spot where slow handoffs or inconsistent follow-up may limit conversions.',
        ],
        [
          'Manual operations',
          'See whether repetitive work is broad enough to merit structured automation review.',
        ],
        [
          'Systems and data',
          'Understand whether fragmented tools make future AI work harder than it needs to be.',
        ],
      ],
    },
    offer: {
      eyebrow: 'When you need the full picture',
      product: 'Business Assessment',
      title: 'Move from a score to a prioritized 30-day implementation plan.',
      description:
        'The complete Business Assessment adds personalized analysis, recommendations, an Impact vs. Effort Matrix, a professional PDF, and a results consultation.',
      price: '$299 one-time',
      note: 'Implementation services are separate. No subscription.',
      action: 'Start with the free check',
      items: [
        'Personalized analysis',
        'Impact vs. Effort Matrix',
        '30-day implementation plan',
        'Professional PDF + consultation',
      ],
    },
    finalCta: {
      title: 'Your clearest AI opportunity may already be visible.',
      text: 'Take the 11-question check and get a focused result in minutes.',
      action: 'Get my free score',
    },
    footer: 'BizMetria.ai — practical AI opportunity assessment in English and Spanish.',
  },
  es: {
    navigation: {
      home: 'Inicio',
      assessment: 'Chequeo gratuito',
      account: 'Cuenta',
      signIn: 'Iniciar sesión',
      language: 'English',
      ariaLabel: 'Navegación principal',
    },
    hero: {
      eyebrow: 'Orientación práctica de IA para negocios en crecimiento',
      title: 'Descubra dónde la IA puede marcar una diferencia medible.',
      description:
        'BizMetria convierte 11 respuestas claras en una Puntuación de Oportunidad de IA determinista y una visión enfocada de por dónde empezar, sin exageraciones ni conjeturas.',
      primaryAction: 'Hacer el chequeo gratuito',
      secondaryAction: 'Ver cómo funciona',
      scoreLabel: 'Puntuación de oportunidad de IA',
      scoreRange: '0–100',
      scoreNote: 'Determinista · Bilingüe · Basada en evidencia',
      trust: 'Sin tarjeta · Sin pagos reales · English y Español',
      freeLabel: 'GRATIS',
    },
    metrics: [
      ['11', 'preguntas concretas'],
      ['0–100', 'puntuación transparente'],
      ['3', 'áreas prioritarias como máximo'],
      ['$0', 'por su primer resultado'],
    ],
    process: {
      eyebrow: 'Un punto de partida más claro',
      title: 'De la fricción operativa a una dirección práctica.',
      items: [
        {
          number: '01',
          title: 'Responda lo que sabe',
          text: 'Cuéntenos cómo funcionan hoy los prospectos, el seguimiento, el trabajo manual, los sistemas y las prioridades.',
        },
        {
          number: '02',
          title: 'Obtenga una puntuación consistente',
          text: 'Las mismas respuestas siempre producen la misma puntuación de 0–100, sin juicios ocultos de IA.',
        },
        {
          number: '03',
          title: 'Enfoque la próxima conversación',
          text: 'Vea hasta tres áreas generales de oportunidad antes de decidir si una evaluación más profunda sería útil.',
        },
      ],
    },
    benefits: {
      eyebrow: 'Creado para decisiones prácticas',
      title: 'Señales útiles, sin pretender conocer su negocio mejor que usted.',
      items: [
        [
          'Respuesta y seguimiento',
          'Detecte dónde las demoras o un seguimiento inconsistente pueden limitar conversiones.',
        ],
        [
          'Operaciones manuales',
          'Vea si el trabajo repetitivo merece una revisión estructurada de automatización.',
        ],
        [
          'Sistemas y datos',
          'Comprenda si las herramientas fragmentadas dificultan el trabajo futuro con IA.',
        ],
      ],
    },
    offer: {
      eyebrow: 'Cuando necesita la imagen completa',
      product: 'Evaluación Empresarial',
      title: 'Pase de una puntuación a un plan de implementación de 30 días priorizado.',
      description:
        'La Evaluación Empresarial completa añade análisis personalizado, recomendaciones, una Matriz de impacto frente a esfuerzo, un PDF profesional y una consulta de resultados.',
      price: '$299 por pago único',
      note: 'Los servicios de implementación se contratan por separado. Sin suscripción.',
      action: 'Comenzar con el chequeo gratuito',
      items: [
        'Análisis personalizado',
        'Matriz de impacto frente a esfuerzo',
        'Plan de implementación de 30 días',
        'PDF profesional y consulta',
      ],
    },
    finalCta: {
      title: 'Su oportunidad de IA más clara puede estar ya a la vista.',
      text: 'Complete el chequeo de 11 preguntas y obtenga un resultado enfocado en pocos minutos.',
      action: 'Obtener mi puntuación gratuita',
    },
    footer: 'BizMetria.ai — evaluación práctica de oportunidades de IA en inglés y español.',
  },
} as const;

export function getMessages(locale: Locale) {
  return messages[locale];
}
