import 'server-only';

import type { PublicAssessmentResult } from './result';

export type ResultDeliveryStatus = 'sent' | 'skipped';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function sendResultEmail(
  recipient: string,
  result: PublicAssessmentResult,
): Promise<ResultDeliveryStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from || process.env.RESEND_DELIVERY_MODE !== 'send') return 'skipped';

  const spanish = result.locale === 'es';
  const subject = spanish
    ? `Su puntuación de oportunidad de IA: ${result.score.total}/100`
    : `Your AI Opportunity Score: ${result.score.total}/100`;
  const areaList = result.opportunityAreas
    .map((area) => `<li>${escapeHtml(area.label)}</li>`)
    .join('');
  const html = `
    <main style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#102033">
      <p style="color:#08775f;font-weight:700">BizMetria.ai</p>
      <h1>${escapeHtml(subject)}</h1>
      <p>${escapeHtml(result.observation)}</p>
      <h2>${spanish ? 'Áreas de oportunidad' : 'Opportunity areas'}</h2>
      <ul>${areaList}</ul>
      <p>${escapeHtml(result.limitation)}</p>
      <p>${
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
