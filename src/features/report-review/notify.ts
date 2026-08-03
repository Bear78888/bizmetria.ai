import 'server-only';

import { escapeHtml } from '@/features/free-assessment/email';
import { CANONICAL_SITE_URL } from '@/lib/site';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

/**
 * "Your report is ready": sent when a review approves the report. Until this
 * existed the customer had no way to learn the report was delivered short of
 * checking the cabinet on their own. A notification with a link, never the
 * report body — the report stays behind the account.
 *
 * Best-effort by contract: the caller must complete the review even when the
 * mail provider refuses.
 */
export async function sendReportReadyEmail(assessmentId: string): Promise<'sent' | 'skipped'> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from || process.env.RESEND_DELIVERY_MODE !== 'send') return 'skipped';

  const supabase = createSupabaseAdminClient();
  const { data: assessment, error } = await supabase
    .from('paid_assessments')
    .select('preferred_locale, profiles:customer_profile_id (email)')
    .eq('id', assessmentId)
    .maybeSingle();
  if (error || !assessment) throw new Error('Unable to look up the report recipient.');

  const profile = Array.isArray(assessment.profiles) ? assessment.profiles[0] : assessment.profiles;
  const recipient = (profile as { email?: string } | null)?.email;
  if (!recipient) return 'skipped';

  const spanish = assessment.preferred_locale === 'es';
  const locale = spanish ? 'es' : 'en';
  const reportUrl = `${CANONICAL_SITE_URL}/${locale}/account/report/${assessmentId}`;
  const subject = spanish
    ? 'Su informe de Evaluación Empresarial está listo'
    : 'Your Business Assessment report is ready';
  const html = `
    <main style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#101828">
      <p style="color:#1B5BFF;font-weight:700;letter-spacing:0.08em">BIZMETRIA</p>
      <h1 style="font-size:22px">${escapeHtml(subject)}</h1>
      <p>${
        spanish
          ? 'Su informe fue revisado por una persona y ya está disponible en su cuenta: hallazgos, recomendaciones, la Matriz de impacto frente a esfuerzo y su plan de implementación de 30 días.'
          : 'Your report has been reviewed by a person and is now available in your account: findings, recommendations, the Impact vs. Effort Matrix, and your 30-day implementation plan.'
      }</p>
      <p style="margin:24px 0">
        <a href="${reportUrl}" style="background:#1B5BFF;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700">${
          spanish ? 'Ver mi informe' : 'View my report'
        }</a>
      </p>
      <p style="color:#667085;font-size:12px">${
        spanish
          ? 'El informe permanece en su cuenta; este correo es solo una notificación.'
          : 'The report stays in your account; this email is only a notification.'
      }</p>
    </main>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [recipient], subject, html }),
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`Report-ready email refused: ${response.status} ${detail}`);
  }
  return 'sent';
}
