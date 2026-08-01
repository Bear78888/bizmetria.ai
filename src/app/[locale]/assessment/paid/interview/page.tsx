import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import InterviewClient from '@/features/interview/InterviewClient';
import { createSupabaseInterviewStore } from '@/features/interview/supabase-store';
import { isLocale } from '@/i18n/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

interface PageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ id?: string }>;
}

export const dynamic = 'force-dynamic';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;

function interviewEnabled(): boolean {
  return (
    process.env.CHECKOUT_MODE === 'stripe' &&
    process.env.ASSESSMENT_STORAGE_MODE === 'supabase' &&
    Boolean(process.env.RETELL_API_KEY)
  );
}

export default async function InterviewPage({ params, searchParams }: PageProps) {
  const { locale: localeParameter } = await params;
  const { id: assessmentId } = await searchParams;

  if (!isLocale(localeParameter)) {
    notFound();
  }

  const locale = localeParameter;
  const spanish = locale === 'es';

  if (!interviewEnabled() || !assessmentId || !UUID_PATTERN.test(assessmentId)) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const nextPath = encodeURIComponent(`/${locale}/assessment/paid/interview?id=${assessmentId}`);
    redirect(`/${locale}/auth?next=${nextPath}`);
  }

  // Profile-scoped: someone else's assessment id reads as missing, the same
  // way the start endpoint treats it.
  const assessment = await createSupabaseInterviewStore().findAssessmentForProfile({
    assessmentId,
    customerProfileId: user.id,
  });

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

  if (assessment.status === 'interview_complete') {
    return (
      <main className="page-shell">
        <section className="result-section">
          <h1>{spanish ? 'Entrevista completada' : 'Interview complete'}</h1>
          <p>
            {spanish
              ? 'Su entrevista ya está registrada. El siguiente paso es el análisis y la revisión de su informe.'
              : 'Your interview is already on file. The next step is the analysis and review of your report.'}
          </p>
          <Link className="button button-secondary" href={`/${locale}/account`}>
            {spanish ? 'Ir a su cuenta' : 'Go to your account'}
          </Link>
        </section>
      </main>
    );
  }

  if (assessment.status !== 'questionnaire_complete' && assessment.status !== 'interview_ready') {
    return (
      <main className="page-shell">
        <section className="result-section">
          <h1>{spanish ? 'Primero el cuestionario' : 'Questionnaire first'}</h1>
          <p>
            {spanish
              ? 'La entrevista se habilita cuando el cuestionario está completo.'
              : 'The interview becomes available once the questionnaire is complete.'}
          </p>
          <Link
            className="button button-primary"
            href={`/${locale}/assessment/paid/questionnaire?id=${assessmentId}`}
          >
            {spanish ? 'Ir al cuestionario' : 'Go to the questionnaire'}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <InterviewClient assessmentId={assessmentId} locale={locale} />
    </main>
  );
}
