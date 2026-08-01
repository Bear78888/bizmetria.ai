import Link from 'next/link';
import { notFound } from 'next/navigation';

import { claimPaidOrder, type ClaimRejection } from '@/features/paid-assessment/claim';
import { createSupabasePaidAssessmentStore } from '@/features/paid-assessment/supabase-store';
import { isLocale } from '@/i18n/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

interface PageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ session_id?: string }>;
}

export const dynamic = 'force-dynamic';

function paidFlowEnabled(): boolean {
  return (
    process.env.CHECKOUT_MODE === 'stripe' && process.env.ASSESSMENT_STORAGE_MODE === 'supabase'
  );
}

const rejectionCopy: Record<ClaimRejection, { en: string; es: string }> = {
  order_not_found: {
    en: 'We could not find a purchase for this link. Please use the link from your payment confirmation.',
    es: 'No encontramos una compra para este enlace. Use el enlace de su confirmación de pago.',
  },
  order_not_paid: {
    en: 'Your payment is still being confirmed. This usually takes under a minute — refresh this page shortly.',
    es: 'Su pago aún se está confirmando. Esto suele tardar menos de un minuto; actualice esta página en breve.',
  },
  owned_by_another_account: {
    en: 'This purchase is already linked to a different account. Sign in with the account you used before, or contact support.',
    es: 'Esta compra ya está vinculada a otra cuenta. Inicie sesión con la cuenta que usó antes o contacte con soporte.',
  },
  email_mismatch: {
    en: 'This account uses a different email than the purchase. Sign in — or create an account — with the same email you used at checkout.',
    es: 'Esta cuenta usa un correo distinto al de la compra. Inicie sesión — o cree una cuenta — con el mismo correo que usó al pagar.',
  },
};

export default async function PaidAssessmentStartPage({ params, searchParams }: PageProps) {
  const { locale: localeParameter } = await params;
  const { session_id: sessionId } = await searchParams;

  if (!isLocale(localeParameter)) {
    notFound();
  }

  const locale = localeParameter;
  const spanish = locale === 'es';

  if (!paidFlowEnabled() || !sessionId || !sessionId.startsWith('cs_')) {
    return (
      <main className="page-shell">
        <section className="result-section">
          <h1>{spanish ? 'Enlace no válido' : 'This link is not valid'}</h1>
          <p>
            {spanish
              ? 'Use el enlace de su confirmación de pago para acceder a su evaluación.'
              : 'Use the link from your payment confirmation to access your assessment.'}
          </p>
          <Link className="button button-secondary" href={`/${locale}`}>
            {spanish ? 'Volver al inicio' : 'Back to the homepage'}
          </Link>
        </section>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    const nextPath = encodeURIComponent(
      `/${locale}/assessment/paid/start?session_id=${encodeURIComponent(sessionId)}`,
    );
    return (
      <main className="page-shell">
        <section className="result-section" aria-labelledby="start-heading">
          <p className="eyebrow">{spanish ? 'Un paso más' : 'One more step'}</p>
          <h1 id="start-heading">
            {spanish ? 'Cree su cuenta para continuar' : 'Create your account to continue'}
          </h1>
          <p>
            {spanish
              ? 'Su Evaluación Empresarial vive en una cuenta segura. Cree una cuenta — o inicie sesión — con el mismo correo que usó al pagar.'
              : 'Your Business Assessment lives in a secure account. Create an account — or sign in — with the same email you used at checkout.'}
          </p>
          <Link className="button button-primary" href={`/${locale}/auth?next=${nextPath}`}>
            {spanish ? 'Crear cuenta o iniciar sesión' : 'Create account or sign in'}
          </Link>
        </section>
      </main>
    );
  }

  // The claim is idempotent, so performing it on render is safe: a refresh
  // returns the same assessment, and a rejected claim changes nothing.
  const result = await claimPaidOrder(createSupabasePaidAssessmentStore(), {
    checkoutSessionId: sessionId,
    claimant: { profileId: user.id, email: user.email },
  });

  if (!result.claimed) {
    const message = rejectionCopy[result.reason];
    return (
      <main className="page-shell">
        <section className="result-section" aria-labelledby="claim-heading">
          <h1 id="claim-heading">
            {spanish ? 'No pudimos vincular su compra' : 'We could not link your purchase'}
          </h1>
          <p role="alert">{spanish ? message.es : message.en}</p>
          <Link className="button button-secondary" href={`/${locale}/account`}>
            {spanish ? 'Ir a su cuenta' : 'Go to your account'}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="result-section" aria-labelledby="ready-heading">
        <p className="eyebrow">{spanish ? 'Compra vinculada' : 'Purchase linked'}</p>
        <h1 id="ready-heading">
          {spanish
            ? 'Su evaluación está lista para empezar.'
            : 'Your assessment is ready to begin.'}
        </h1>
        <p>
          {spanish
            ? 'El siguiente paso es el cuestionario ampliado, seguido de la entrevista.'
            : 'The next step is the extended questionnaire, followed by the interview.'}
        </p>
        <Link
          className="button button-primary"
          href={`/${locale}/assessment/paid/questionnaire?id=${result.assessment.id}`}
        >
          {spanish ? 'Comenzar el cuestionario' : 'Start the questionnaire'}
        </Link>
        <Link className="button button-secondary" href={`/${locale}/account`}>
          {spanish ? 'Ir a su cuenta' : 'Go to your account'}
        </Link>
      </section>
    </main>
  );
}
