import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import { signOut } from '../auth/actions';

interface AccountPageProps {
  readonly params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

const statusCopy: Record<string, { en: string; es: string }> = {
  not_started: { en: 'Questionnaire not started', es: 'Cuestionario sin comenzar' },
  in_progress: { en: 'Questionnaire in progress', es: 'Cuestionario en curso' },
  questionnaire_complete: { en: 'Ready for the interview', es: 'Lista para la entrevista' },
  interview_ready: { en: 'Ready for the interview', es: 'Lista para la entrevista' },
  interview_complete: {
    en: 'Interview complete — analysis running',
    es: 'Entrevista completada — análisis en curso',
  },
  analysis_pending: { en: 'Analysis in progress', es: 'Análisis en curso' },
  under_review: { en: 'Report under expert review', es: 'Informe en revisión experta' },
  completed: { en: 'Report ready', es: 'Informe listo' },
  cancelled: { en: 'Cancelled', es: 'Cancelada' },
};

function nextStep(locale: string, assessment: { id: string; status: string }) {
  const spanish = locale === 'es';
  switch (assessment.status) {
    case 'not_started':
    case 'in_progress':
      return {
        href: `/${locale}/assessment/paid/questionnaire?id=${assessment.id}`,
        label: spanish ? 'Continuar el cuestionario' : 'Continue the questionnaire',
      };
    case 'questionnaire_complete':
    case 'interview_ready':
      return {
        href: `/${locale}/assessment/paid/interview?id=${assessment.id}`,
        label: spanish ? 'Comenzar la entrevista' : 'Start the interview',
      };
    case 'completed':
      return {
        href: `/${locale}/account/report/${assessment.id}`,
        label: spanish ? 'Ver el informe' : 'View the report',
      };
    default:
      return null;
  }
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale: localeParameter } = await params;

  if (!isLocale(localeParameter)) {
    notFound();
  }

  const locale = localeParameter;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth`);
  }

  // The user-scoped client: row-level security limits this to the customer's
  // own assessments.
  const { data: assessments } = await supabase
    .from('paid_assessments')
    .select('id, status, created_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  const isSpanish = locale === 'es';

  return (
    <section className="account-shell">
      <div className="account-card">
        <p className="eyebrow">{isSpanish ? 'Cuenta' : 'Account'}</p>
        <h1>{isSpanish ? 'Tu cuenta' : 'Your account'}</h1>
        <dl className="account-details">
          <div>
            <dt>Email</dt>
            <dd>{user.email ?? '—'}</dd>
          </div>
        </dl>

        <h2>{isSpanish ? 'Sus evaluaciones' : 'Your assessments'}</h2>
        {(assessments ?? []).length === 0 ? (
          <p>
            {isSpanish
              ? 'Aún no hay evaluaciones en esta cuenta. Después de una compra, use el enlace de su confirmación de pago para vincularla.'
              : 'No assessments in this account yet. After a purchase, use the link from your payment confirmation to connect it.'}
          </p>
        ) : (
          <div className="account-details">
            {(assessments ?? []).map((assessment) => {
              const step = nextStep(locale, assessment);
              const label = statusCopy[assessment.status];
              return (
                <div key={assessment.id}>
                  <dt>{assessment.created_at?.slice(0, 10)}</dt>
                  <dd>
                    {label ? (isSpanish ? label.es : label.en) : assessment.status}
                    {step ? (
                      <>
                        {' — '}
                        <Link href={step.href}>{step.label}</Link>
                      </>
                    ) : null}
                  </dd>
                </div>
              );
            })}
          </div>
        )}

        <form action={signOut}>
          <input name="locale" type="hidden" value={locale} />
          <button className="button button-secondary" type="submit">
            {isSpanish ? 'Cerrar sesión' : 'Sign out'}
          </button>
        </form>
      </div>
    </section>
  );
}
