import Link from 'next/link';

interface PageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ session_id?: string }>;
}

// Stripe returns the customer here after payment. The webhook — not this
// page — is what marks the order paid, so the copy promises the next step
// rather than claiming a state this render cannot know yet.
export default async function CheckoutConfirmedPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { session_id: sessionId } = await searchParams;
  const spanish = locale === 'es';

  return (
    <main className="page-shell">
      <section className="result-section" aria-labelledby="confirmed-heading">
        <p className="eyebrow">{spanish ? 'Pago recibido' : 'Payment received'}</p>
        <h1 id="confirmed-heading">
          {spanish ? 'Gracias por su compra.' : 'Thank you for your purchase.'}
        </h1>
        <p>
          {spanish
            ? 'El siguiente paso de su Evaluación Empresarial es el cuestionario ampliado, seguido de la entrevista.'
            : 'The next step of your Business Assessment is the extended questionnaire, followed by the interview.'}
        </p>
        {sessionId ? (
          <Link
            className="button button-primary"
            href={`/${locale}/assessment/paid/start?session_id=${encodeURIComponent(sessionId)}`}
          >
            {spanish ? 'Continuar con su evaluación' : 'Continue to your assessment'}
          </Link>
        ) : null}
        <Link className="button button-secondary" href={`/${locale}`}>
          {spanish ? 'Volver al inicio' : 'Back to the homepage'}
        </Link>
      </section>
    </main>
  );
}
