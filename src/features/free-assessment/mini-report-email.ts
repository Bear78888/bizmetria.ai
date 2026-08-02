import 'server-only';

import { CANONICAL_SITE_URL } from '@/lib/site';

import { escapeHtml, type ResultDeliveryStatus } from './email';
import type { AssessmentLocale } from './schema';

export interface MiniReportEmailInput {
  readonly locale: AssessmentLocale;
  readonly totalScore: number;
  readonly areaLabels: readonly string[];
  readonly limitation: string;
}

/**
 * The mini-report: sent once the customer's free result is linked to their
 * account, with the full area breakdown they unlocked by registering. The
 * submission-time email deliberately carries the score only.
 */
export async function sendMiniReportEmail(
  recipient: string,
  input: MiniReportEmailInput,
): Promise<ResultDeliveryStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from || process.env.RESEND_DELIVERY_MODE !== 'send') return 'skipped';

  const spanish = input.locale === 'es';
  const cabinetUrl = `${CANONICAL_SITE_URL}/${input.locale}/account`;
  const subject = spanish
    ? `Su mini-informe de IA: ${input.totalScore}/100`
    : `Your AI mini-report: ${input.totalScore}/100`;
  const areaList = input.areaLabels
    .map((label) => `<li style="margin-bottom:4px">${escapeHtml(label)}</li>`)
    .join('');
  const html = `
    <main style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#101828">
      <p style="color:#1B5BFF;font-weight:700;letter-spacing:0.08em">BIZMETRIA</p>
      <h1 style="font-size:22px">${
        spanish ? 'Su mini-informe está listo' : 'Your mini-report is ready'
      }</h1>
      <p style="font-size:40px;font-weight:700;margin:8px 0">${input.totalScore}<span style="font-size:16px;color:#667085"> / 100</span></p>
      <h2 style="font-size:16px">${
        spanish ? 'Sus áreas de oportunidad más claras' : 'Your clearest opportunity areas'
      }</h2>
      <ul>${areaList}</ul>
      <p>${
        spanish
          ? 'Su puntuación y este desglose quedan guardados en su cuenta.'
          : 'Your score and this breakdown are saved in your account.'
      }</p>
      <p style="margin:24px 0">
        <a href="${cabinetUrl}" style="background:#1B5BFF;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700">${
          spanish ? 'Abrir mi cuenta' : 'Open my account'
        }</a>
      </p>
      <p style="color:#667085;font-size:12px">${escapeHtml(input.limitation)}</p>
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

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`Mini-report email refused: ${response.status} ${detail}`);
  }
  return 'sent';
}
