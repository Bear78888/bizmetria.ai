import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AssessmentClient } from '@/features/free-assessment/AssessmentClient';
import { isLocale } from '@/i18n/config';

interface AssessmentPageProps {
  readonly params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: 'Free AI Opportunity Check',
  description: 'Get a deterministic AI Opportunity Score for your business in 11 questions.',
};

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // The phone alternative renders only once the free-check agent's number is
  // provisioned (provision-free-check-agent.yml writes the variable).
  const phone = process.env.NEXT_PUBLIC_FREE_CHECK_PHONE;
  const spanish = locale === 'es';

  return (
    <>
      {phone ? (
        <aside
          className="call-option"
          aria-label={spanish ? 'Opción por teléfono' : 'Phone option'}
        >
          <p>
            {spanish
              ? 'Prefiere hablar en vez de escribir? Llame a nuestro agente al '
              : 'Prefer talking over typing? Call our agent at '}
            <a href={`tel:${phone.replace(/[^+0-9]/gu, '')}`}>{phone}</a>
            {spanish
              ? ' — le hace las mismas 11 preguntas por voz (unos 10 minutos) y su puntuación llega por correo.'
              : ' — it asks the same 11 questions by voice (about 10 minutes) and your score arrives by email.'}
          </p>
        </aside>
      ) : null}
      <AssessmentClient locale={locale} />
    </>
  );
}
