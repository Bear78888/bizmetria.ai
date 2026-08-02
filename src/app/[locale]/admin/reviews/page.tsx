import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { createSupabaseReportReviewStore } from '@/features/report-review/supabase-store';
import { isLocale } from '@/i18n/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

interface PageProps {
  readonly params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

// The review surface is an internal tool for the reviewer, so its copy is
// English-only regardless of the URL locale.
export default async function ReviewQueuePage({ params }: PageProps) {
  const { locale: localeParameter } = await params;
  if (!isLocale(localeParameter)) notFound();
  const locale = localeParameter;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/auth?next=${encodeURIComponent(`/${locale}/admin/reviews`)}`);
  }

  const store = createSupabaseReportReviewStore();
  const role = await store.findReviewerRole(user.id);
  // No role reads as no page: the surface is invisible to non-reviewers.
  if (!role) notFound();

  const queue = await store.listReviewQueue();

  return (
    <main className="page-shell">
      <section className="result-section">
        <p className="eyebrow">Review</p>
        <h1>Assessments awaiting review</h1>
        {queue.length === 0 ? (
          <p>The queue is empty.</p>
        ) : (
          <table className="review-table">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Locale</th>
                <th>Status</th>
                <th>Report</th>
                <th>Analysis finished</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((entry) => (
                <tr key={entry.assessmentId}>
                  <td>
                    <Link href={`/${locale}/admin/reviews/${entry.assessmentId}`}>
                      {entry.assessmentId.slice(0, 8)}…
                    </Link>
                  </td>
                  <td>{entry.preferredLocale}</td>
                  <td>{entry.assessmentStatus}</td>
                  <td>{entry.reportStatus ?? '—'}</td>
                  <td>{entry.analysisCompletedAt?.slice(0, 16).replace('T', ' ') ?? 'pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
