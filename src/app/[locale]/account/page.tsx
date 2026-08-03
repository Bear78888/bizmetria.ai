import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import JourneyBuyStep from '@/components/account/JourneyBuyStep';
import { ScoreDial } from '@/components/account/ScoreDial';
import { resultContent } from '@/features/free-assessment/content';
import { findSolution } from '@/features/solutions/catalog';
import { linkFreeWorkToProfile } from '@/features/free-assessment/link';
import { sendMiniReportEmail } from '@/features/free-assessment/mini-report-email';
import { CheckoutButton } from '@/features/free-assessment/ResultClient';
import type { ScoreBlockId } from '@/features/free-assessment/score';
import { isLocale } from '@/i18n/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import { signOut } from '../auth/actions';

interface AccountPageProps {
  readonly params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

const solutionStatusCopy: Record<string, { en: string; es: string }> = {
  created: { en: 'Awaiting payment', es: 'Pendiente de pago' },
  checkout_open: { en: 'Awaiting payment', es: 'Pendiente de pago' },
  checkout_expired: { en: 'Checkout expired', es: 'Pago expirado' },
  paid: { en: 'Paid — build starting', es: 'Pagado — la construcción comienza' },
  in_build: { en: 'In build', es: 'En construcción' },
  delivered: { en: 'Delivered', es: 'Entregado' },
  cancelled: { en: 'Cancelled', es: 'Cancelado' },
  refunded: { en: 'Refunded', es: 'Reembolsado' },
};

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
        href: `/${locale}/assessment/paid/begin?id=${assessment.id}`,
        label: spanish ? 'Responder: voz o cuestionario' : 'Answer: voice or questionnaire',
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

interface FreeScoreView {
  readonly assessmentId: string;
  readonly locale: 'en' | 'es';
  readonly total: number;
  readonly areaLabels: readonly string[];
}

interface OpportunityScoreRow {
  readonly total_score: number;
  readonly opportunity_areas: readonly { readonly id: string }[] | null;
}

// PostgREST returns the unique one-to-one relation as an object, but typing
// without generated schema types leaves both shapes possible.
function scoreRowOf(relation: unknown): OpportunityScoreRow | null {
  if (Array.isArray(relation)) return (relation[0] as OpportunityScoreRow | undefined) ?? null;
  if (relation && typeof relation === 'object') return relation as OpportunityScoreRow;
  return null;
}

async function loadFreeScore(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
): Promise<FreeScoreView | null> {
  const { data } = await supabase
    .from('free_assessments')
    .select('id, preferred_locale, opportunity_scores(total_score, opportunity_areas)')
    .eq('status', 'scored')
    .order('scored_at', { ascending: false })
    .limit(1);

  const row = data?.[0];
  if (!row) return null;
  const score = scoreRowOf(row.opportunity_scores);
  if (!score) return null;

  const scoreLocale = row.preferred_locale === 'es' ? 'es' : 'en';
  const labels = resultContent[scoreLocale].areaLabels;
  return {
    assessmentId: row.id,
    locale: scoreLocale,
    total: score.total_score,
    areaLabels: (score.opportunity_areas ?? [])
      .map((area) => labels[area.id as ScoreBlockId])
      .filter((label): label is string => Boolean(label)),
  };
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
    redirect(`/${locale}/auth?next=${encodeURIComponent(`/${locale}/account`)}`);
  }

  // The soft gate pay-off: attach any free results captured under this
  // confirmed email to the account, so row-level security starts exposing
  // them below. Best-effort — the cabinet still renders if linking fails.
  let newlyLinked = 0;
  if (user.email) {
    try {
      const outcome = await linkFreeWorkToProfile({ id: user.id, email: user.email });
      newlyLinked = outcome.newlyLinked;
    } catch (error) {
      console.error('free-result linking failed', error);
    }
  }

  const freeScore = await loadFreeScore(supabase);

  // The mini-report email goes out once, when the result first becomes part
  // of the account. Delivery problems never break the page.
  if (newlyLinked > 0 && freeScore && user.email) {
    try {
      await sendMiniReportEmail(user.email, {
        locale: freeScore.locale,
        totalScore: freeScore.total,
        areaLabels: freeScore.areaLabels,
        limitation: resultContent[freeScore.locale].limitation,
      });
    } catch (error) {
      console.error('mini-report email failed', error);
    }
  }

  // The user-scoped client: row-level security limits this to the customer's
  // own assessments.
  const { data: assessments } = await supabase
    .from('paid_assessments')
    .select('id, status, created_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  const { data: solutionOrders } = await supabase
    .from('solution_orders')
    .select('id, solution_code, status, created_at')
    .is('deleted_at', null)
    .not('status', 'in', '("created","checkout_open","checkout_expired","cancelled")')
    .order('created_at', { ascending: false });

  const paidList = assessments ?? [];
  const solutionList = solutionOrders ?? [];
  const hasPaid = paidList.length > 0;
  const hasReport = paidList.some((assessment) => assessment.status === 'completed');
  const isSpanish = locale === 'es';

  // The first two steps are entrances, not just status: the free check leads
  // to the questionnaire page (form + call option), and the $299 step either
  // continues an assessment (voice-or-questionnaire choice) or starts the
  // checkout in one click.
  const journey = [
    {
      key: 'free',
      title: isSpanish ? 'Chequeo gratuito' : 'Free check',
      state: freeScore ? 'done' : 'next',
      href: `/${locale}/assessment` as string | null,
      buyFrom: null as string | null,
      detail: freeScore
        ? isSpanish
          ? `Puntuación ${freeScore.total}/100 — repetir el chequeo`
          : `Score ${freeScore.total}/100 — retake the check`
        : isSpanish
          ? 'Responda 11 preguntas o llame a nuestro agente.'
          : 'Answer 11 questions or call our agent.',
    },
    {
      key: 'paid',
      title: isSpanish ? 'Evaluación Empresarial — $299' : 'Business Assessment — $299',
      state: hasReport ? 'done' : hasPaid ? 'active' : 'next',
      href: hasPaid
        ? `/${locale}/assessment/paid/begin?id=${paidList[0]?.id}`
        : freeScore
          ? null
          : `/${locale}/assessment`,
      buyFrom: !hasPaid && freeScore ? freeScore.assessmentId : null,
      detail: hasPaid
        ? isSpanish
          ? 'En curso — responder por voz o por escrito.'
          : 'In progress — answer by voice or in writing.'
        : freeScore
          ? isSpanish
            ? 'Comprar y empezar: entrevista de voz o cuestionario.'
            : 'Buy and start: voice interview or questionnaire.'
          : isSpanish
            ? 'Primero el chequeo gratuito, luego la evaluación.'
            : 'Free check first, then the assessment.',
    },
    {
      key: 'sprint',
      title: isSpanish ? 'Plan de implementación' : 'Implementation plan',
      state: hasReport ? 'done' : 'pending',
      href: null as string | null,
      buyFrom: null as string | null,
      detail: isSpanish ? 'Incluido en su informe.' : 'Included with your report.',
    },
    {
      key: 'solutions',
      title: isSpanish ? 'Implementación' : 'Implementation',
      state: 'pending',
      href: null as string | null,
      buyFrom: null as string | null,
      detail: isSpanish
        ? 'Después de su informe: encargue soluciones listas para usar.'
        : 'After your report: order ready-made solutions.',
    },
  ] as const;

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

        {freeScore ? (
          <div className="cabinet-score">
            <h2>{isSpanish ? 'Su puntuación de oportunidad' : 'Your opportunity score'}</h2>
            <ScoreDial
              score={freeScore.total}
              label={isSpanish ? 'Puntuación de oportunidad de IA' : 'AI Opportunity Score'}
              outOf={isSpanish ? 'de 100' : 'out of 100'}
            />
            {freeScore.areaLabels.length > 0 ? (
              <>
                <h3>{resultContent[locale].areasTitle}</h3>
                <ul className="cabinet-areas">
                  {freeScore.areaLabels.map((label) => (
                    <li key={label}>{label}</li>
                  ))}
                </ul>
              </>
            ) : null}
            {!hasPaid ? (
              <div className="cabinet-upsell">
                <p>
                  {isSpanish
                    ? 'Convierta su puntuación en un plan práctico con la Evaluación Empresarial completa.'
                    : 'Turn your score into a practical plan with the full Business Assessment.'}
                </p>
                <CheckoutButton
                  locale={locale}
                  assessmentId={freeScore.assessmentId}
                  label={resultContent[locale].offerAction}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="cabinet-score">
            <h2>{isSpanish ? 'Su puntuación de oportunidad' : 'Your opportunity score'}</h2>
            <p>
              {isSpanish
                ? 'Aún no hay un chequeo gratuito vinculado a esta cuenta.'
                : 'No free check is linked to this account yet.'}{' '}
              <Link href={`/${locale}/assessment`}>
                {isSpanish ? 'Hacer el chequeo gratuito' : 'Take the free check'}
              </Link>
            </p>
          </div>
        )}

        <h2>{isSpanish ? 'Su recorrido' : 'Your journey'}</h2>
        <ol className="journey-steps">
          {journey.map((step) => {
            if (step.buyFrom) {
              return (
                <JourneyBuyStep
                  key={step.key}
                  locale={locale}
                  assessmentId={step.buyFrom}
                  title={step.title}
                  detail={step.detail}
                  stateClass={`journey-step-${step.state}`}
                />
              );
            }
            return (
              <li className={`journey-step journey-step-${step.state}`} key={step.key}>
                {step.href ? (
                  <Link className="journey-step-action" href={step.href}>
                    <strong>{step.title}</strong>
                    <span>{step.detail}</span>
                  </Link>
                ) : (
                  <>
                    <strong>{step.title}</strong>
                    <span>{step.detail}</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>

        <h2>{isSpanish ? 'Sus evaluaciones' : 'Your assessments'}</h2>
        {paidList.length === 0 ? (
          <p>
            {isSpanish
              ? 'Aún no hay evaluaciones en esta cuenta. Después de una compra, use el enlace de su confirmación de pago para vincularla.'
              : 'No assessments in this account yet. After a purchase, use the link from your payment confirmation to connect it.'}
          </p>
        ) : (
          <div className="account-details">
            {paidList.map((assessment) => {
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

        {solutionList.length > 0 ? (
          <>
            <h2>{isSpanish ? 'Sus implementaciones' : 'Your implementations'}</h2>
            <div className="account-details">
              {solutionList.map((order) => {
                const solution = findSolution(order.solution_code);
                const label = solutionStatusCopy[order.status];
                return (
                  <div key={order.id}>
                    <dt>{order.created_at?.slice(0, 10)}</dt>
                    <dd>
                      {solution ? solution.title[locale] : order.solution_code}
                      {' — '}
                      {label ? (isSpanish ? label.es : label.en) : order.status}
                    </dd>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}

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
