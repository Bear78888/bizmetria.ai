import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';

interface LegalPageProps {
  readonly params: Promise<{ locale: string }>;
}

export const metadata: Metadata = { title: 'Privacy Policy' };

/**
 * Structure and routes only: the substance carries explicit review markers
 * and every statement below reflects what the product actually does today.
 * Final wording is the owner's call (legal review pending).
 */
export default async function PrivacyPage({ params }: LegalPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const es = locale === 'es';

  return (
    <main className="page-shell legal-page">
      <h1>{es ? 'Política de privacidad' : 'Privacy Policy'}</h1>
      <p className="legal-note">
        {es
          ? 'Borrador — pendiente de revisión legal. Última actualización: agosto de 2026.'
          : 'Draft — pending legal review. Last updated: August 2026.'}
      </p>

      <h2>{es ? 'Qué datos recopilamos' : 'What we collect'}</h2>
      <p>
        {es
          ? 'El chequeo gratuito solicita su nombre, el nombre de su negocio, su correo electrónico y, opcionalmente, su teléfono y sitio web, junto con sus respuestas a las once preguntas. Si nos llama, la llamada se graba y se transcribe para producir su resultado, y así se le informa al inicio de la llamada. La Evaluación Empresarial de pago añade su cuestionario ampliado y la transcripción de la entrevista de voz.'
          : 'The free check asks for your name, business name, email, and optionally your phone and website, together with your answers to the eleven questions. If you call us, the call is recorded and transcribed to produce your result, and the call says so up front. The paid Business Assessment adds your extended questionnaire and the transcript of the voice interview.'}
      </p>

      <h2>{es ? 'Cómo usamos sus datos' : 'How we use your data'}</h2>
      <p>
        {es
          ? 'Sus respuestas producen su puntuación y su informe. Le enviamos por correo los resultados que usted solicita (mensajes de servicio). El marketing por correo o SMS es siempre una casilla aparte y opcional, y puede retirarse en cualquier momento.'
          : 'Your answers produce your score and your report. We email you the results you request (service messages). Email or SMS marketing is always a separate, optional checkbox and can be withdrawn at any time.'}
      </p>

      <h2>{es ? 'Pagos' : 'Payments'}</h2>
      <p>
        {es
          ? 'Los pagos se procesan mediante Stripe. Nunca vemos ni almacenamos el número completo de su tarjeta.'
          : 'Payments are processed by Stripe. We never see or store your full card number.'}
      </p>

      <h2>{es ? 'Dónde viven sus datos' : 'Where your data lives'}</h2>
      <p>
        {es
          ? 'Los datos se almacenan en Supabase (infraestructura en Estados Unidos). El análisis de los informes usa Claude de Anthropic; las entrevistas de voz usan Retell. El correo se envía mediante Resend.'
          : 'Data is stored in Supabase (US infrastructure). Report analysis uses Claude by Anthropic; voice interviews use Retell. Email is delivered via Resend.'}
      </p>

      <h2>{es ? 'Sus derechos' : 'Your rights'}</h2>
      <p>
        {es
          ? 'Puede solicitar una copia o la eliminación de sus datos escribiéndonos.'
          : 'You can request a copy of your data, or its deletion, by contacting us.'}
      </p>

      <h2>{es ? 'Contacto' : 'Contact'}</h2>
      <p>support@bizmetria.com</p>
    </main>
  );
}
