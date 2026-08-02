import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

interface BeginPageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ id?: string }>;
}

export const dynamic = 'force-dynamic';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;

/**
 * The customer chooses how to answer the assessment questions: the voice
 * interview with our agent (recommended) or the written questionnaire.
 * Both feed the same report; neither is mandatory for the other.
 */
export default async function BeginPage({ params, searchParams }: BeginPageProps) {
  const { locale: localeParameter } = await params;
  const { id: assessmentId } = await searchParams;
  if (!isLocale(localeParameter)) notFound();
  if (!assessmentId || !UUID_PATTERN.test(assessmentId)) notFound();
  const locale = localeParameter;
  const spanish = locale === 'es';

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(
      `/${locale}/auth?next=${encodeURIComponent(`/${locale}/assessment/paid/begin?id=${assessmentId}`)}`,
    );
  }

  // The user-scoped client: row-level security answers whether this
  // assessment belongs to the signed-in customer.
  const { data: assessment } = await supabase
    .from('paid_assessments')
    .select('id, status')
    .eq('id', assessmentId)
    .is('deleted_at', null)
    .maybeSingle();

  if (!assessment) {
    return (
      <main className="page-shell">
        <section className="result-section">
          <h1>{spanish ? 'Evaluación no encontrada' : 'Assessment not found'}</h1>
          <p>
            {spanish
              ? 'No encontramos esta evaluación en su cuenta.'
              : 'We could not find this assessment in your account.'}
          </p>
          <Link className="button button-secondary" href={`/${locale}/account`}>
            {spanish ? 'Ir a su cuenta' : 'Go to your account'}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="result-section" aria-labelledby="begin-heading">
        <p className="eyebrow">{spanish ? 'Evaluación Empresarial' : 'Business Assessment'}</p>
        <h1 id="begin-heading">
          {spanish ? '¿Cómo prefiere responder?' : 'How would you like to answer?'}
        </h1>
        <p>
          {spanish
            ? 'Su informe se construye a partir de sus respuestas. Elija la forma que le resulte más cómoda — ambas conducen al mismo informe.'
            : 'Your report is built from your answers. Pick whichever way is more comfortable — both lead to the same report.'}
        </p>

        <div className="begin-options">
          <div className="begin-option begin-option-recommended">
            <p className="mono-label">{spanish ? 'RECOMENDADO' : 'RECOMMENDED'}</p>
            <h2>{spanish ? 'Hablar con nuestro agente' : 'Talk to our agent'}</h2>
            <p>
              {spanish
                ? 'Una conversación de voz de unos 30–60 minutos, directamente en el navegador. El agente le hace todas las preguntas; usted solo habla de su negocio. Puede pausar y retomar cuando quiera.'
                : 'A voice conversation of about 30–60 minutes, right in your browser. The agent asks all the questions; you just talk about your business. You can pause and pick it up again anytime.'}
            </p>
            <Link
              className="button button-primary"
              href={`/${locale}/assessment/paid/interview?id=${assessment.id}`}
            >
              {spanish ? 'Comenzar la entrevista de voz' : 'Start the voice interview'}
            </Link>
          </div>

          <div className="begin-option">
            <h2>{spanish ? 'Responder por escrito' : 'Answer in writing'}</h2>
            <p>
              {spanish
                ? 'El cuestionario ampliado, a su propio ritmo. Sus respuestas se guardan automáticamente y puede volver en cualquier momento.'
                : 'The extended questionnaire, at your own pace. Your answers save automatically, and you can come back anytime.'}
            </p>
            <Link
              className="button button-secondary"
              href={`/${locale}/assessment/paid/questionnaire?id=${assessment.id}`}
            >
              {spanish ? 'Abrir el cuestionario' : 'Open the questionnaire'}
            </Link>
          </div>
        </div>

        <p className="begin-note">
          {spanish
            ? 'Después de sus respuestas preparamos su informe: análisis personalizado, matriz de impacto frente a esfuerzo y un plan de implementación de 30 días, revisado por una persona antes de entregarse.'
            : 'After your answers we prepare your report: personalized analysis, an Impact vs. Effort Matrix, and a 30-day implementation plan, reviewed by a person before delivery.'}
        </p>
      </section>
    </main>
  );
}
