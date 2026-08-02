import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { parseAnalysisContent } from '@/features/analysis/contract';
import ReportView from '@/features/report-review/ReportView';
import { isLocale } from '@/i18n/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

interface PageProps {
  readonly params: Promise<{ locale: string; assessmentId: string }>;
}

export const dynamic = 'force-dynamic';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;

export default async function CustomerReportPage({ params }: PageProps) {
  const { locale: localeParameter, assessmentId } = await params;
  if (!isLocale(localeParameter) || !UUID_PATTERN.test(assessmentId)) notFound();
  const locale = localeParameter;
  const spanish = locale === 'es';

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(
      `/${locale}/auth?next=${encodeURIComponent(`/${locale}/account/report/${assessmentId}`)}`,
    );
  }

  // Deliberately the user-scoped client: row-level security is what decides
  // visibility here (owners see APPROVED/DELIVERED reports only), so a
  // not-yet-approved report is indistinguishable from a missing one.
  const { data: report } = await supabase
    .from('reports')
    .select('report_data, preferred_locale, delivered_at')
    .eq('paid_assessment_id', assessmentId)
    .in('status', ['APPROVED', 'DELIVERED'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!report) {
    return (
      <main className="page-shell">
        <section className="result-section">
          <h1>{spanish ? 'Informe aún no disponible' : 'Report not available yet'}</h1>
          <p>
            {spanish
              ? 'Su informe aparecerá aquí cuando la revisión haya terminado.'
              : 'Your report will appear here once the review is complete.'}
          </p>
          <Link className="button button-secondary" href={`/${locale}/account`}>
            {spanish ? 'Volver a su cuenta' : 'Back to your account'}
          </Link>
        </section>
      </main>
    );
  }

  let content;
  try {
    content = parseAnalysisContent(report.report_data);
  } catch {
    // A malformed stored report never renders half-broken to a customer.
    notFound();
  }

  return (
    <main className="page-shell">
      <section className="result-section">
        <p className="eyebrow">{spanish ? 'Su informe' : 'Your report'}</p>
        <h1>{spanish ? 'Evaluación Empresarial' : 'Business Assessment'}</h1>
        <ReportView content={content} locale={report.preferred_locale === 'es' ? 'es' : 'en'} />
        <Link className="button button-secondary" href={`/${locale}/account`}>
          {spanish ? 'Volver a su cuenta' : 'Back to your account'}
        </Link>
      </section>
    </main>
  );
}
