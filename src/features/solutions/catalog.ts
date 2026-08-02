/**
 * The BizMetria solutions catalog (DEC-031).
 *
 * Curated list only: these are the implementations we are confident we can
 * build and deliver as working setup + accesses + step-by-step PDF + short
 * screencast, with one revision round and 14 days of fix-support included.
 *
 * Prices follow the owner's rule of 2026-08-02: roughly 20% below researched
 * freelancer/agency market rates (docs/BIZMETRIA_SOLUTIONS_CATALOG.md holds
 * the benchmarks and sources). Price and scope come from this file, never
 * invented per-customer by a model, and the server derives every charge from
 * here — a client request only ever names a code.
 *
 * Ongoing platform subscriptions (Make, Twilio, phone numbers, model usage)
 * run on the customer's own accounts and are stated before purchase.
 */

export interface SolutionCatalogItem {
  readonly code: string;
  readonly priceCents: number;
  readonly deliveryBusinessDays: number;
  readonly title: { readonly en: string; readonly es: string };
  readonly outcome: { readonly en: string; readonly es: string };
}

export const SOLUTIONS_CATALOG_VERSION = 'solutions-catalog/1.0.0';

export const solutionsCatalog: readonly SolutionCatalogItem[] = [
  {
    code: 'intake_autoreply',
    priceCents: 39000,
    deliveryBusinessDays: 5,
    title: {
      en: 'AI auto-reply to new inquiries',
      es: 'Respuesta automática con IA a nuevas consultas',
    },
    outcome: {
      en: 'Every form or email inquiry answered in under a minute, 24/7, with you notified.',
      es: 'Cada consulta por formulario o correo respondida en menos de un minuto, 24/7, con aviso para usted.',
    },
  },
  {
    code: 'voice_reception',
    priceCents: 139000,
    deliveryBusinessDays: 10,
    title: { en: 'AI phone reception', es: 'Recepción telefónica con IA' },
    outcome: {
      en: 'Calls answered 24/7: frequent questions, name and need captured, callback arranged, SMS confirmation.',
      es: 'Llamadas atendidas 24/7: preguntas frecuentes, nombre y necesidad registrados, devolución de llamada acordada, confirmación por SMS.',
    },
  },
  {
    code: 'sms_reminders',
    priceCents: 49000,
    deliveryBusinessDays: 7,
    title: { en: 'Appointment SMS reminders', es: 'Recordatorios de citas por SMS' },
    outcome: {
      en: 'A confirm-or-reschedule flow that cuts no-shows.',
      es: 'Un flujo de confirmación o reprogramación que reduce las ausencias.',
    },
  },
  {
    code: 'email_assistant',
    priceCents: 109000,
    deliveryBusinessDays: 10,
    title: { en: 'AI email assistant', es: 'Asistente de correo con IA' },
    outcome: {
      en: 'Drafts or auto-sends replies to about 90% of routine mail; complex threads are escalated to you.',
      es: 'Redacta o envía respuestas a cerca del 90% del correo rutinario; los hilos complejos se escalan a usted.',
    },
  },
  {
    code: 'followup_sequences',
    priceCents: 69000,
    deliveryBusinessDays: 7,
    title: { en: 'Lead follow-up sequences', es: 'Secuencias de seguimiento de leads' },
    outcome: {
      en: 'A five-touch email and SMS sequence per lead source that stops on reply.',
      es: 'Una secuencia de cinco toques por correo y SMS por fuente de leads que se detiene al recibir respuesta.',
    },
  },
  {
    code: 'reactivation',
    priceCents: 59000,
    deliveryBusinessDays: 7,
    title: { en: 'Dormant-customer reactivation', es: 'Reactivación de clientes inactivos' },
    outcome: {
      en: 'A campaign to customers quiet for 6–12 months, with response tracking.',
      es: 'Una campaña para clientes inactivos de 6 a 12 meses, con seguimiento de respuestas.',
    },
  },
  {
    code: 'site_chatbot',
    priceCents: 119000,
    deliveryBusinessDays: 7,
    title: { en: 'Website AI assistant', es: 'Asistente de IA para su sitio web' },
    outcome: {
      en: 'An assistant trained on your business that answers visitors and captures leads.',
      es: 'Un asistente entrenado en su negocio que responde a los visitantes y capta leads.',
    },
  },
  {
    code: 'lead_inbox',
    priceCents: 99000,
    deliveryBusinessDays: 10,
    title: { en: 'All inquiries in one place', es: 'Todas las consultas en un solo lugar' },
    outcome: {
      en: 'Forms, email and messengers flow into one CRM or sheet, deduplicated and tagged by source.',
      es: 'Formularios, correo y mensajería fluyen a un solo CRM u hoja, sin duplicados y etiquetados por origen.',
    },
  },
  {
    code: 'crm_sync',
    priceCents: 119000,
    deliveryBusinessDays: 12,
    title: {
      en: 'CRM, email and calendar sync',
      es: 'Sincronización de CRM, correo y calendario',
    },
    outcome: {
      en: 'The end of double entry across contacts, threads and appointments.',
      es: 'El fin de la doble captura entre contactos, hilos y citas.',
    },
  },
  {
    code: 'weekly_digest',
    priceCents: 95000,
    deliveryBusinessDays: 10,
    title: { en: 'Weekly AI business digest', es: 'Resumen semanal del negocio con IA' },
    outcome: {
      en: 'A Monday email with leads, sales and reviews pulled from your sources, combined and analyzed.',
      es: 'Un correo cada lunes con leads, ventas y reseñas extraídos de sus fuentes, combinados y analizados.',
    },
  },
  {
    code: 'metrics_dashboard',
    priceCents: 199000,
    deliveryBusinessDays: 14,
    title: { en: 'Live metrics dashboard', es: 'Panel de métricas en vivo' },
    outcome: {
      en: 'Leads, conversion and response time from real sources on one screen.',
      es: 'Leads, conversión y tiempo de respuesta desde fuentes reales en una sola pantalla.',
    },
  },
  {
    code: 'review_engine',
    priceCents: 49000,
    deliveryBusinessDays: 5,
    title: { en: 'Review collection engine', es: 'Motor de recolección de reseñas' },
    outcome: {
      en: 'Post-job review requests, with unhappy customers routed to you privately first.',
      es: 'Solicitudes de reseña tras cada trabajo; los clientes insatisfechos llegan primero a usted en privado.',
    },
  },
  {
    code: 'doc_generation',
    priceCents: 69000,
    deliveryBusinessDays: 7,
    title: { en: 'Document auto-generation', es: 'Generación automática de documentos' },
    outcome: {
      en: 'Quotes and invoices built from deal data into your branded templates.',
      es: 'Presupuestos y facturas generados desde los datos del trato en sus plantillas con su marca.',
    },
  },
] as const;

export function findSolution(code: string): SolutionCatalogItem | null {
  return solutionsCatalog.find((item) => item.code === code) ?? null;
}

export function formatSolutionPrice(item: SolutionCatalogItem): string {
  return `$${(item.priceCents / 100).toLocaleString('en-US')}`;
}
