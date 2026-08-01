import Link from 'next/link';
import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';

interface HomePageProps {
  readonly params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParameter } = await params;
  if (!isLocale(localeParameter)) notFound();

  const locale = localeParameter;
  const messages = getMessages(locale);
  const assessmentHref = `/${locale}/assessment`;

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{messages.hero.eyebrow}</p>
          <h1>{messages.hero.title}</h1>
          <p className="hero-description">{messages.hero.description}</p>
          <div className="actions">
            <Link className="button button-primary" href={assessmentHref}>
              {messages.hero.primaryAction}
            </Link>
            <Link className="button button-secondary" href="#how-it-works">
              {messages.hero.secondaryAction}
            </Link>
          </div>
          <p className="hero-trust">
            <span aria-hidden="true">●</span> {messages.hero.trust}
          </p>
        </div>
        <div className="score-card" aria-label={messages.hero.scoreLabel}>
          <div className="score-card-topline">
            <p>{messages.hero.scoreLabel}</p>
            <span>{messages.hero.freeLabel}</span>
          </div>
          <strong>{messages.hero.scoreRange}</strong>
          <span>{messages.hero.scoreNote}</span>
          <div className="score-bars" aria-hidden="true">
            {[58, 76, 42, 88, 66].map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
      </section>

      <section className="metric-strip" aria-label="Assessment facts">
        {messages.metrics.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="home-section" id="how-it-works">
        <p className="eyebrow">{messages.process.eyebrow}</p>
        <h2>{messages.process.title}</h2>
        <div className="process-grid">
          {messages.process.items.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section benefits-section">
        <div className="section-heading">
          <p className="eyebrow">{messages.benefits.eyebrow}</p>
          <h2>{messages.benefits.title}</h2>
        </div>
        <div className="benefit-list">
          {messages.benefits.items.map(([title, text], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="offer-section">
        <div>
          <p className="eyebrow">{messages.offer.eyebrow}</p>
          <h2>{messages.offer.title}</h2>
          <p>{messages.offer.description}</p>
          <Link className="button button-secondary" href={assessmentHref}>
            {messages.offer.action}
          </Link>
        </div>
        <aside>
          <span>{messages.offer.product}</span>
          <strong>{messages.offer.price}</strong>
          <p>{messages.offer.note}</p>
          <ul>
            {messages.offer.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="final-cta">
        <h2>{messages.finalCta.title}</h2>
        <p>{messages.finalCta.text}</p>
        <Link className="button button-primary" href={assessmentHref}>
          {messages.finalCta.action}
        </Link>
      </section>
    </>
  );
}
