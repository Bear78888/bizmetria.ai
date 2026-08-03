'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { sendReportReadyEmail } from '@/features/report-review/notify';
import { approveReport, requestChanges } from '@/features/report-review/review';
import { createSupabaseReportReviewStore } from '@/features/report-review/supabase-store';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const decisionSchema = z.object({
  locale: z.enum(['en', 'es']),
  assessmentId: z.uuid(),
  reportId: z.uuid(),
});

async function requireReviewer() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function approveReportAction(formData: FormData) {
  const parsed = decisionSchema.safeParse({
    locale: formData.get('locale'),
    assessmentId: formData.get('assessmentId'),
    reportId: formData.get('reportId'),
  });
  if (!parsed.success) redirect('/en/admin/reviews?error=invalid');
  const { locale, assessmentId, reportId } = parsed.data;

  const reviewerProfileId = await requireReviewer();
  if (!reviewerProfileId) redirect(`/${locale}/auth`);

  // The store re-checks the reviewer role; the action only carries identity.
  const rejection = await approveReport(createSupabaseReportReviewStore(), {
    reportId,
    reviewerProfileId,
  });
  if (rejection) {
    redirect(`/${locale}/admin/reviews/${assessmentId}?error=${rejection}`);
  }

  // Notification only — a mail refusal must never undo a finished review.
  try {
    await sendReportReadyEmail(assessmentId);
  } catch (error) {
    console.error('report-ready email failed', error);
  }

  redirect(`/${locale}/admin/reviews?approved=${assessmentId}`);
}

export async function requestChangesAction(formData: FormData) {
  const parsed = decisionSchema.safeParse({
    locale: formData.get('locale'),
    assessmentId: formData.get('assessmentId'),
    reportId: formData.get('reportId'),
  });
  if (!parsed.success) redirect('/en/admin/reviews?error=invalid');
  const { locale, assessmentId, reportId } = parsed.data;

  const notes = String(formData.get('notes') ?? '').trim();
  if (notes.length === 0 || notes.length > 2000) {
    redirect(`/${locale}/admin/reviews/${assessmentId}?error=notes_required`);
  }

  const reviewerProfileId = await requireReviewer();
  if (!reviewerProfileId) redirect(`/${locale}/auth`);

  const rejection = await requestChanges(createSupabaseReportReviewStore(), {
    reportId,
    reviewerProfileId,
    notes,
  });
  if (rejection) {
    redirect(`/${locale}/admin/reviews/${assessmentId}?error=${rejection}`);
  }
  redirect(`/${locale}/admin/reviews?changes=${assessmentId}`);
}
