import type { AssessmentLocale } from '@/features/free-assessment/schema';
import type { ScoreBand, ScoreBlockId } from '@/features/free-assessment/score';

import type { ImpactEffortLevel } from './contract';

export type Severity = 'moderate' | 'high';

export interface BlockCopy {
  readonly findingTitle: string;
  readonly finding: Readonly<Record<Severity, string>>;
  readonly recommendationTitle: string;
  readonly rationale: string;
  readonly firstStep: string;
  readonly impact: ImpactEffortLevel;
  readonly effort: ImpactEffortLevel;
  readonly roadmap: readonly [string, string, string];
}

const en: Record<ScoreBlockId, BlockCopy> = {
  lead_response_follow_up: {
    findingTitle: 'Response time and follow-up decide how many enquiries convert',
    finding: {
      moderate:
        'Enquiries are answered, but not consistently fast enough for every channel, and follow-up depends on someone remembering. That pattern loses a share of otherwise qualified interest.',
      high: 'The gap between an enquiry arriving and a first reply is wide enough that interest cools before anyone responds, and unconverted enquiries receive no defined follow-up at all.',
    },
    recommendationTitle: 'Put first response and follow-up on a defined, automatic sequence',
    rationale:
      'Speed to first reply is the single strongest lever on conversion from the same volume of enquiries, and it does not require more marketing spend.',
    firstStep:
      'Write down the target first-response time per channel, then route every channel into one shared inbox or queue so nothing waits on an individual.',
    impact: 'high',
    effort: 'medium',
    roadmap: [
      'Consolidate every enquiry channel into one queue with an owner and a target response time.',
      'Add an automated multi-step follow-up for enquiries that do not convert on first contact.',
      'Review response and follow-up metrics weekly and tune the sequence against outcomes.',
    ],
  },
  manual_work: {
    findingTitle: 'Repeated manual work is absorbing capacity that could serve customers',
    finding: {
      moderate:
        'Several routine areas are still handled by hand. Each is small on its own, but together they consume hours that scale with volume rather than with revenue.',
      high: 'Manual handling spans most of the operating cycle. Capacity is now the constraint on growth, and every additional customer adds proportional internal effort.',
    },
    recommendationTitle: 'Automate the two highest-volume manual steps before anything else',
    rationale:
      'Automating the highest-frequency steps returns capacity immediately and gives a measurable baseline for the rest of the programme.',
    firstStep:
      'Track how long each manual area takes over one normal week, then rank by hours consumed rather than by how annoying the task feels.',
    impact: 'high',
    effort: 'medium',
    roadmap: [
      'Measure time spent per manual area over one representative week.',
      'Automate the two areas that consume the most hours and verify the time actually returns.',
      'Extend the same pattern to the next two areas and document the standard operating procedure.',
    ],
  },
  systems_data: {
    findingTitle: 'Customer information is spread across places that do not reconcile',
    finding: {
      moderate:
        'A system exists but is only partly used, so the record of a customer depends on which tool you open. Reporting and handover both suffer from that ambiguity.',
      high: 'There is no single place that holds the customer record. Information lives in inboxes, notes and spreadsheets, which makes loss of context the default rather than the exception.',
    },
    recommendationTitle: 'Establish one authoritative customer record',
    rationale:
      'Automation and reporting both compound on top of consistent data. Building either on scattered records reproduces the inconsistency at higher speed.',
    firstStep:
      'Decide which system is authoritative for customer data and list every place that currently holds a competing copy.',
    impact: 'high',
    effort: 'high',
    roadmap: [
      'Choose the authoritative system and define the required fields for a complete customer record.',
      'Migrate active customers into it and switch new intake to write there first.',
      'Retire or make read-only the competing copies, then automate reporting from the single source.',
    ],
  },
  strategic_priority_urgency: {
    findingTitle: 'The stated priority is clear and the timeline is short',
    finding: {
      moderate:
        'There is a defined priority and a workable timeline. Sequencing work against that priority matters more than breadth at this stage.',
      high: 'The intent is to start now. That favours a narrow first phase that produces a visible result quickly over a broad programme that reports progress slowly.',
    },
    recommendationTitle: 'Scope a first phase that produces a measurable result inside 30 days',
    rationale:
      'An early, verifiable result establishes whether the approach works in this business before larger commitments are made.',
    firstStep:
      'Pick one process, define the metric that proves it improved, and record its value today.',
    impact: 'medium',
    effort: 'low',
    roadmap: [
      'Agree the first phase, its single success metric, and the current baseline value.',
      'Deliver the first phase and compare the metric against that baseline.',
      'Decide the second phase on the evidence from the first, not on the original plan.',
    ],
  },
  opportunity_breadth: {
    findingTitle: 'Opportunities span several connected parts of the operation',
    finding: {
      moderate:
        'The opportunities identified are related rather than isolated, so a change in one area moves the others with it.',
      high: 'Opportunities appear across most of the operating cycle. Sequencing them matters, because addressing them separately would duplicate effort.',
    },
    recommendationTitle: 'Sequence the connected areas instead of running them in parallel',
    rationale:
      'Connected areas share the same underlying data and handovers. Fixing them in sequence means each change makes the next one cheaper.',
    firstStep:
      'Map which areas share the same customer record or handover point, and order them so shared foundations come first.',
    impact: 'medium',
    effort: 'medium',
    roadmap: [
      'Map the dependencies between the identified areas and fix the sequence.',
      'Deliver the foundational area first and confirm the dependent areas got easier.',
      'Work down the sequence, re-checking the dependency map after each change.',
    ],
  },
};

const es: Record<ScoreBlockId, BlockCopy> = {
  lead_response_follow_up: {
    findingTitle: 'El tiempo de respuesta y el seguimiento deciden cuántas consultas se convierten',
    finding: {
      moderate:
        'Las consultas se responden, pero no con la rapidez suficiente en todos los canales, y el seguimiento depende de que alguien lo recuerde. Ese patrón pierde una parte del interés que sí estaba cualificado.',
      high: 'El intervalo entre la llegada de una consulta y la primera respuesta es lo bastante amplio como para que el interés se enfríe, y las consultas no convertidas no reciben ningún seguimiento definido.',
    },
    recommendationTitle:
      'Establezca una secuencia definida y automática de primera respuesta y seguimiento',
    rationale:
      'La rapidez de la primera respuesta es la palanca más fuerte sobre la conversión con el mismo volumen de consultas, y no requiere más inversión en marketing.',
    firstStep:
      'Defina por escrito el tiempo objetivo de primera respuesta por canal y dirija todos los canales a una única bandeja o cola compartida.',
    impact: 'high',
    effort: 'medium',
    roadmap: [
      'Consolide todos los canales de consulta en una sola cola con responsable y tiempo objetivo de respuesta.',
      'Añada un seguimiento automático de varios pasos para las consultas que no se convierten en el primer contacto.',
      'Revise semanalmente las métricas de respuesta y seguimiento, y ajuste la secuencia según los resultados.',
    ],
  },
  manual_work: {
    findingTitle: 'El trabajo manual repetido absorbe capacidad que podría atender a clientes',
    finding: {
      moderate:
        'Varias áreas rutinarias se gestionan a mano. Cada una es pequeña por separado, pero en conjunto consumen horas que crecen con el volumen y no con los ingresos.',
      high: 'La gestión manual abarca la mayor parte del ciclo operativo. La capacidad es hoy el límite del crecimiento, y cada cliente adicional añade esfuerzo interno proporcional.',
    },
    recommendationTitle: 'Automatice primero los dos pasos manuales de mayor volumen',
    rationale:
      'Automatizar los pasos más frecuentes devuelve capacidad de inmediato y ofrece una base medible para el resto del programa.',
    firstStep:
      'Mida cuánto tiempo consume cada área manual durante una semana normal y ordénelas por horas, no por lo molestas que resulten.',
    impact: 'high',
    effort: 'medium',
    roadmap: [
      'Mida el tiempo dedicado a cada área manual durante una semana representativa.',
      'Automatice las dos áreas que más horas consumen y verifique que el tiempo se recupera.',
      'Extienda el mismo patrón a las dos áreas siguientes y documente el procedimiento estándar.',
    ],
  },
  systems_data: {
    findingTitle: 'La información de clientes está repartida en lugares que no se concilian',
    finding: {
      moderate:
        'Existe un sistema, pero se usa solo en parte, de modo que el registro de un cliente depende de qué herramienta se abra. Los informes y los traspasos se resienten de esa ambigüedad.',
      high: 'No hay un único lugar que contenga el registro del cliente. La información vive en bandejas de entrada, notas y hojas de cálculo, por lo que la pérdida de contexto es la norma.',
    },
    recommendationTitle: 'Establezca un único registro de cliente con autoridad',
    rationale:
      'La automatización y los informes se apoyan en datos consistentes. Construir cualquiera de los dos sobre registros dispersos reproduce la inconsistencia a mayor velocidad.',
    firstStep:
      'Decida qué sistema es el autoritativo para los datos de clientes y enumere todos los lugares que hoy guardan una copia competidora.',
    impact: 'high',
    effort: 'high',
    roadmap: [
      'Elija el sistema autoritativo y defina los campos necesarios para un registro de cliente completo.',
      'Migre a los clientes activos y haga que la captación nueva escriba allí primero.',
      'Retire o deje en solo lectura las copias competidoras y automatice los informes desde la fuente única.',
    ],
  },
  strategic_priority_urgency: {
    findingTitle: 'La prioridad declarada es clara y el plazo es corto',
    finding: {
      moderate:
        'Hay una prioridad definida y un plazo viable. En esta etapa importa más secuenciar el trabajo según esa prioridad que abarcar mucho.',
      high: 'La intención es empezar ya. Eso favorece una primera fase estrecha con un resultado visible rápido frente a un programa amplio que avanza despacio.',
    },
    recommendationTitle: 'Defina una primera fase con un resultado medible en 30 días',
    rationale:
      'Un resultado temprano y verificable demuestra si el enfoque funciona en este negocio antes de asumir compromisos mayores.',
    firstStep:
      'Elija un proceso, defina la métrica que probará la mejora y registre su valor actual.',
    impact: 'medium',
    effort: 'low',
    roadmap: [
      'Acuerde la primera fase, su única métrica de éxito y el valor de partida actual.',
      'Entregue la primera fase y compare la métrica con ese valor de partida.',
      'Decida la segunda fase con la evidencia de la primera, no con el plan original.',
    ],
  },
  opportunity_breadth: {
    findingTitle: 'Las oportunidades abarcan varias partes conectadas de la operación',
    finding: {
      moderate:
        'Las oportunidades identificadas están relacionadas y no aisladas, de modo que un cambio en un área desplaza a las demás.',
      high: 'Aparecen oportunidades en casi todo el ciclo operativo. Secuenciarlas importa, porque abordarlas por separado duplicaría el esfuerzo.',
    },
    recommendationTitle: 'Secuencie las áreas conectadas en lugar de abordarlas en paralelo',
    rationale:
      'Las áreas conectadas comparten los mismos datos y traspasos. Resolverlas en secuencia hace que cada cambio abarate el siguiente.',
    firstStep:
      'Identifique qué áreas comparten el mismo registro de cliente o punto de traspaso y ordénelas poniendo primero las bases comunes.',
    impact: 'medium',
    effort: 'medium',
    roadmap: [
      'Mapee las dependencias entre las áreas identificadas y fije la secuencia.',
      'Entregue primero el área fundacional y confirme que las dependientes resultaron más fáciles.',
      'Avance por la secuencia revisando el mapa de dependencias tras cada cambio.',
    ],
  },
};

export const blockCopy: Record<AssessmentLocale, Record<ScoreBlockId, BlockCopy>> = { en, es };

export const summaryCopy: Record<
  AssessmentLocale,
  {
    readonly lead: (total: number) => string;
    readonly band: Readonly<Record<ScoreBand, string>>;
    readonly areasLead: string;
    readonly close: string;
    readonly noAreas: string;
  }
> = {
  en: {
    lead: (total) =>
      `Your operational AI opportunity score is ${total} out of 100, computed from your eleven answers.`,
    band: {
      FOCUSED:
        'The picture is focused: most of the operating cycle already works, and the opportunity sits in a small number of specific places.',
      MODERATE:
        'The picture is mixed: parts of the operating cycle work well while others depend on individual effort to hold together.',
      STRONG:
        'The picture shows several related opportunities that reinforce each other across the operating cycle.',
      HIGH: 'The picture shows broad opportunity: several core parts of the operating cycle currently depend on manual effort or individual memory.',
      VERY_HIGH:
        'The picture shows extensive opportunity across the operating cycle, which makes sequencing more important than breadth.',
    },
    areasLead: 'The clearest opportunity areas from your answers are',
    close:
      'The findings, recommendations and roadmap below follow directly from those answers. They describe operational opportunity only and are not a financial valuation or a guarantee of results.',
    noAreas:
      'No single area dominates, so the recommendations below are ordered by expected return.',
  },
  es: {
    lead: (total) =>
      `Su puntuación operativa de oportunidad de IA es ${total} sobre 100, calculada a partir de sus once respuestas.`,
    band: {
      FOCUSED:
        'El panorama es focalizado: la mayor parte del ciclo operativo ya funciona y la oportunidad se concentra en unos pocos puntos concretos.',
      MODERATE:
        'El panorama es mixto: partes del ciclo operativo funcionan bien mientras otras dependen del esfuerzo individual para sostenerse.',
      STRONG:
        'El panorama muestra varias oportunidades relacionadas que se refuerzan entre sí a lo largo del ciclo operativo.',
      HIGH: 'El panorama muestra una oportunidad amplia: varias partes centrales del ciclo operativo dependen hoy del trabajo manual o de la memoria individual.',
      VERY_HIGH:
        'El panorama muestra una oportunidad extensa en todo el ciclo operativo, lo que hace que secuenciar importe más que abarcar.',
    },
    areasLead: 'Las áreas de oportunidad más claras según sus respuestas son',
    close:
      'Los hallazgos, las recomendaciones y la hoja de ruta que siguen se derivan directamente de esas respuestas. Describen únicamente oportunidad operativa y no constituyen una valoración financiera ni una garantía de resultados.',
    noAreas:
      'Ninguna área domina por sí sola, por lo que las recomendaciones siguientes se ordenan por retorno esperado.',
  },
};
