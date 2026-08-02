import 'server-only';

import { CANONICAL_SITE_URL } from '@/lib/site';

import type { PublicAssessmentResult } from './result';

export type ResultDeliveryStatus = 'sent' | 'skipped';

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/**
 * The submission-time email: the score the customer already saw on screen,
 * plus the invitation to register. The area breakdown is deliberately absent —
 * under the soft gate it belongs to the mini-report, which is sent only after
 * the result is linked to an account (see mini-report-email.ts).
 */
export async function sendResultEmail(
  recipient: string,
  result: PublicAssessmentResult,
): Promise<ResultDeliveryStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from || process.env.RESEND_DELIVERY_MODE !== 'send') return 'skipped';

  const spanish = result.locale === 'es';
  const registerUrl = `${CANONICAL_SITE_URL}/${result.locale}/auth?intent=free-report`;
  const subject = spanish
    ? `Su puntuación de oportunidad de IA: ${result.score.total}/100`
    : `Your AI Opportunity Score: ${result.score.total}/100`;
  const html = `
    <main style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#101828">
      <p style="color:#1B5BFF;font-weight:700;letter-spacing:0.08em">BIZMETRIA</p>
      <h1 style="font-size:22px">${escapeHtml(subject)}</h1>
      <p>${escapeHtml(result.observation)}</p>
      <p>${
        spanish
          ? 'Cree una cuenta gratuita para desbloquear su desglose por áreas, guardar su puntuación y recibir su mini-informe por correo.'
          : 'Create a free account to unlock your area breakdown, keep your score, and get your mini-report by email.'
      }</p>
      <p style="margin:24px 0">
        <a href="${registerUrl}" style="background:#1B5BFF;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700">${
          spanish ? 'Crear mi cuenta gratuita' : 'Create my free account'
        }</a>
      </p>
      <p style="color:#667085;font-size:12px">${escapeHtml(result.limitation)}</p>
      <p style="color:#667085;font-size:12px">${
        spanish
          ? 'La Evaluación Empresarial completa cuesta $299 por pago único. La implementación se contrata por separado.'
          : 'The full Business Assessment is a one-time $299. Implementation services are separate.'
      }</p>
    </main>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [recipient], subject, html }),
  });

  if (!response.ok) throw new Error('Unable to deliver assessment result email.');
  return 'sent';
}
