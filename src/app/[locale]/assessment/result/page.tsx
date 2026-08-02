import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ResultClient } from '@/features/free-assessment/ResultClient';
import { isLocale } from '@/i18n/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

interface ResultPageProps {
  readonly params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: 'Your AI Opportunity Score',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function ResultPage({ params }: ResultPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // The soft gate: the score always shows, the area breakdown asks for an
  // account. A signed-in visitor sees everything directly.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <ResultClient locale={locale} authenticated={Boolean(user)} />;
}
