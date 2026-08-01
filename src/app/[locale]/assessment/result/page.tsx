import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ResultClient } from '@/features/free-assessment/ResultClient';
import { isLocale } from '@/i18n/config';

interface ResultPageProps {
  readonly params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: 'Your AI Opportunity Score',
  robots: { index: false, follow: false },
};

export default async function ResultPage({ params }: ResultPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <ResultClient locale={locale} />;
}
