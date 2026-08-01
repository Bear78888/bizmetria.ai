import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import QuestionnaireClient from '@/features/paid-assessment/QuestionnaireClient';
import { createSupabaseQuestionnaireStore } from '@/features/paid-assessment/supabase-store';
import { isLocale } from '@/i18n/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

interface PageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ id?: string }>;
}

export const dynamic = 'force-dynamic';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;

function paidFlowEnabled(): boolean {
  return (
    process.env.CHECKOUT_MODE === 'stripe' && process.env.ASSESSMENT_STORAGE_MODE === 'supabase'
  );
}

export default async function QuestionnairePage({ params, searchParams }: PageProps) {
  const { locale: localeParameter } = await params;
  const { id: assessmentId } = await searchParams;

  if (!isLocale(localeParameter)) {
    notFound();
  }

  const locale = localeParameter;
  const spanish = locale === 'es';

  if (!paidFlowEnabled() || !assessmentId || !UUID_PATTERN.test(assessmentId)) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const nextPath = encodeURIComponent(
      `/${locale}/assessment/paid/questionnaire?id=${assessmentId}`,
    );
    redirect(`/${locale}/auth?next=${nextPath}`);
  }

  // Profile-scoped load: an assessment this account does not own reads as
  // missing, exactly like the save and submit endpoints treat it.
  const state = await createSupabaseQuestionnaireStore().loadQuestionnaire({
    assessmentId,
    customerProfileId: user.id,
  });

  if (!state) {
    return (
      <main className="page-shell">
        <section className="result-section">
          <h1>{spanish ? 'Evaluación no encontrada' : 'Assessment not found'}</h1>
          <p>
            {spanish
              ? 'No encontramos esta evaluación en su cuenta. Use el enlace de su confirmación de pago.'
              : 'We could not find this assessment in your account. Use the link from your payment confirmation.'}
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
      <QuestionnaireClient
        assessmentId={assessmentId}
        initialData={state.data}
        initialStatus={state.status}
        initialVersion={state.version}
        locale={locale}
      />
    </main>
  );
}
