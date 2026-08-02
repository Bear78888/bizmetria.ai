import { notFound, redirect } from 'next/navigation';

import ReportView from '@/features/report-review/ReportView';
import { createSupabaseReportReviewStore } from '@/features/report-review/supabase-store';
import { isLocale } from '@/i18n/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import { approveReportAction, requestChangesAction } from '../actions';

interface PageProps {
  readonly params: Promise<{ locale: string; assessmentId: string }>;
  readonly searchParams: Promise<{ error?: string }>;
}

export const dynamic = 'force-dynamic';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;

export default async function ReviewDetailPage({ params, searchParams }: PageProps) {
  const { locale: localeParameter, assessmentId } = await params;
  const { error } = await searchParams;
  if (!isLocale(localeParameter) || !UUID_PATTERN.test(assessmentId)) notFound();
  const locale = localeParameter;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(
      `/${locale}/auth?next=${encodeURIComponent(`/${locale}/admin/reviews/${assessmentId}`)}`,
    );
  }

  const store = createSupabaseReportReviewStore();
  const role = await store.findReviewerRole(user.id);
  if (!role) notFound();

  // Creates the report row from the latest succeeded analysis run on first
  // open; a later open returns the same report.
  const report = await store.ensureReport(assessmentId);

  if (!report) {
    return (
      <main className="page-shell">
        <section className="result-section">
          <h1>No analysis yet</h1>
          <p>This assessment has no succeeded analysis run to review.</p>
        </section>
      </main>
    );
  }

  const decided = report.status === 'DELIVERED' || report.status === 'APPROVED';

  return (
    <main className="page-shell">
      <section className="result-section">
        <p className="eyebrow">Review · {report.status}</p>
        <h1>Draft report ({report.preferredLocale})</h1>
        {error ? (
          <p className="form-message form-message-error" role="alert">
            The action could not be completed: {error}
          </p>
        ) : null}

        <ReportView
          content={report.reportData}
          locale={report.preferredLocale === 'es' ? 'es' : 'en'}
        />

        {decided ? (
          <p className="form-message">This report has been approved and delivered.</p>
        ) : (
          <div className="review-actions">
            <form action={approveReportAction}>
              <input name="locale" type="hidden" value={locale} />
              <input name="assessmentId" type="hidden" value={assessmentId} />
              <input name="reportId" type="hidden" value={report.id} />
              <button className="button button-primary" type="submit">
                Approve and deliver to the customer
              </button>
            </form>
            <form action={requestChangesAction} className="review-changes-form">
              <input name="locale" type="hidden" value={locale} />
              <input name="assessmentId" type="hidden" value={assessmentId} />
              <input name="reportId" type="hidden" value={report.id} />
              <label>
                What must change (kept in the review log)
                <textarea maxLength={2000} name="notes" required rows={3} />
              </label>
              <button className="button button-secondary" type="submit">
                Request changes
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
