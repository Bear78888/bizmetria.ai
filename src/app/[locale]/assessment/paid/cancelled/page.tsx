import Link from 'next/link';

interface PageProps {
  readonly params: Promise<{ locale: string }>;
}

export default async function CheckoutCancelledPage({ params }: PageProps) {
  const { locale } = await params;
  const spanish = locale === 'es';

  return (
    <main className="page-shell">
      <section className="result-section" aria-labelledby="cancelled-heading">
        <p className="eyebrow">{spanish ? 'Pago cancelado' : 'Checkout cancelled'}</p>
        <h1 id="cancelled-heading">
          {spanish ? 'No se realizó ningún cargo.' : 'No charge was made.'}
        </h1>
        <p>
          {spanish
            ? 'Puede volver a su resultado y completar la compra cuando lo desee.'
            : 'You can return to your result and complete the purchase whenever you like.'}
        </p>
        <Link className="button button-secondary" href={`/${locale}/assessment/result`}>
          {spanish ? 'Volver a mi resultado' : 'Back to my result'}
        </Link>
      </section>
    </main>
  );
}
