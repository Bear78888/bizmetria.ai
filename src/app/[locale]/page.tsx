import Link from 'next/link';
import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';

interface HomePageProps {
  readonly params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParameter } = await params;

  if (!isLocale(localeParameter)) {
    notFound();
  }

  const locale = localeParameter;
  const messages = getMessages(locale);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{messages.hero.eyebrow}</p>
          <h1>{messages.hero.title}</h1>
          <p className="hero-description">{messages.hero.description}</p>
          <div className="actions">
            <Link className="button button-primary" href="/api/health">
              {messages.hero.primaryAction}
            </Link>
            <Link className="button button-secondary" href={`/${locale}/auth`}>
              {messages.hero.secondaryAction}
            </Link>
          </div>
        </div>
        <div className="score-card" aria-label="AI Opportunity Score preview">
          <p>AI Opportunity Score</p>
          <strong>0–100</strong>
          <span>Deterministic · Bilingual · Evidence-based</span>
        </div>
      </section>

      <section className="status-section" aria-labelledby="foundation-status">
        <p className="eyebrow">Foundation</p>
        <h2 id="foundation-status">{messages.status.title}</h2>
        <ul className="feature-grid">
          {messages.status.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
