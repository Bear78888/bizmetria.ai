import Link from 'next/link';

interface PageProps {
  readonly params: Promise<{ locale: string }>;
}

// Stripe returns the customer here after payment. The webhook — not this
// page — is what marks the order paid, so the copy promises the next step
// rather than claiming a state this render cannot know yet.
export default async function CheckoutConfirmedPage({ params }: PageProps) {
  const { locale } = await params;
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
            ? 'Recibirá un correo con los siguientes pasos de su Evaluación Empresarial: el cuestionario ampliado y la entrevista.'
            : 'You will receive an email with the next steps of your Business Assessment: the extended questionnaire and the interview.'}
        </p>
        <Link className="button button-secondary" href={`/${locale}`}>
          {spanish ? 'Volver al inicio' : 'Back to the homepage'}
        </Link>
      </section>
    </main>
  );
}
