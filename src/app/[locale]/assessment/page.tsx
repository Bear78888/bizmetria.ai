import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AssessmentClient } from '@/features/free-assessment/AssessmentClient';
import { isLocale } from '@/i18n/config';

interface AssessmentPageProps {
  readonly params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: 'Free AI Opportunity Check',
  description: 'Get a deterministic AI Opportunity Score for your business in 11 questions.',
};

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <AssessmentClient locale={locale} />;
}
