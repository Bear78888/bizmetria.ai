import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';

interface LegalPageProps {
  readonly params: Promise<{ locale: string }>;
}

export const metadata: Metadata = { title: 'Terms of Service' };

/** Structure only; wording pending the owner's legal review. */
export default async function TermsPage({ params }: LegalPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const es = locale === 'es';

  return (
    <main className="page-shell legal-page">
      <h1>{es ? 'Términos del servicio' : 'Terms of Service'}</h1>
      <p className="legal-note">
        {es
          ? 'Borrador — pendiente de revisión legal. Última actualización: agosto de 2026.'
          : 'Draft — pending legal review. Last updated: August 2026.'}
      </p>

      <h2>{es ? 'El servicio' : 'The service'}</h2>
      <p>
        {es
          ? 'BizMetria ofrece un chequeo gratuito de 11 preguntas con una puntuación determinista y una Evaluación Empresarial de pago único de $299 con un informe revisado por una persona. Las implementaciones se contratan por separado y nunca son obligatorias.'
          : 'BizMetria offers a free 11-question check with a deterministic score, and a one-time $299 Business Assessment with a human-reviewed report. Implementations are ordered separately and are never required.'}
      </p>

      <h2>{es ? 'Lo que el servicio no es' : 'What the service is not'}</h2>
      <p>
        {es
          ? 'La puntuación y el informe describen oportunidad operativa. No son una valoración financiera, asesoría legal, fiscal o de inversión, ni una garantía de resultados.'
          : 'The score and the report describe operational opportunity. They are not a financial valuation, legal, tax, or investment advice, or a guarantee of results.'}
      </p>

      <h2>{es ? 'Pagos y reembolsos' : 'Payments and refunds'}</h2>
      <p>
        {es ? 'Los pagos se procesan mediante Stripe.' : 'Payments are processed by Stripe.'}{' '}
        {/* TODO: refund policy pending owner decision (proposed: full refund before work starts) */}
        {es
          ? 'La política de reembolsos se publicará aquí.'
          : 'The refund policy will be published here.'}
      </p>

      <h2>{es ? 'Cuentas' : 'Accounts'}</h2>
      <p>
        {es
          ? 'Usted es responsable de mantener el acceso a su cuenta. Podemos suspender cuentas usadas de forma abusiva.'
          : 'You are responsible for maintaining access to your account. We may suspend accounts used abusively.'}
      </p>

      <h2>{es ? 'Contacto' : 'Contact'}</h2>
      <p>support@bizmetria.com {/* TODO: confirm with owner */}</p>
    </main>
  );
}
