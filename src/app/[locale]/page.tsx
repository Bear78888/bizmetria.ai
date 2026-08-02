import Link from 'next/link';
import { notFound } from 'next/navigation';

import CallOption from '@/components/CallOption';
import FocusDiagram from '@/components/home/FocusDiagram';
import HeroGauge from '@/components/home/HeroGauge';
import { AssessmentClient } from '@/features/free-assessment/AssessmentClient';
import ReportPreview from '@/components/home/ReportPreview';
import { isLocale } from '@/i18n/config';
import { getHomeContent } from '@/i18n/home';

interface HomePageProps {
  readonly params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParameter } = await params;
  if (!isLocale(localeParameter)) notFound();

  const locale = localeParameter;
  const content = getHomeContent(locale);
  const assessmentHref = `/${locale}/assessment`;
  const otherLocaleAssessmentHref = locale === 'en' ? '/es/assessment' : '/en/assessment';

  return (
    <>
      {/* §3.1 Hero (compacted): the check itself lives right below, so the
          primary action scrolls to it and answering starts on this page. */}
      <section className="hero hero-compact">
        <div className="hero-copy">
          <p className="mono-label">{content.hero.eyebrow}</p>
          <h1>{content.hero.title}</h1>
          <p className="hero-subhead">{content.hero.subhead}</p>
          <div className="actions">
            <a className="button button-primary" href="#free-check">
              {content.hero.primaryCta}
            </a>
            <a className="button button-secondary" href="#report">
              {content.hero.secondaryCta}
            </a>
          </div>
          <p className="hero-trust mono-label">{content.hero.trust}</p>
        </div>
        <HeroGauge
          bars={content.hero.gauge.bars}
          caption={content.hero.gauge.caption}
          cta={content.hero.gauge.cta}
          ctaHref="#free-check"
          label={content.hero.gauge.label}
        />
      </section>

      {/* The free check itself, first thing after the hero: people answer
          here, or call — both entrances side by side. */}
      <section className="home-check" id="free-check">
        <CallOption locale={locale} variant="banner" />
        <AssessmentClient locale={locale} />
      </section>

      {/* §3.2 Honest proof strip: industry tags, no invented logos. */}
      <section className="proof-strip" aria-label={content.proof.lead}>
        <span>{content.proof.lead}</span>
        <ul>
          {content.proof.chips.map((chip) => (
            <li key={chip} className="mono-label">
              {chip}
            </li>
          ))}
        </ul>
      </section>

      {/* §3.3 The one and only numbered section: a connected timeline. */}
      <section className="home-section" id="how-it-works">
        <p className="mono-label">{content.steps.eyebrow}</p>
        <h2>{content.steps.title}</h2>
        <ol className="steps-timeline">
          {content.steps.items.map((step) => (
            <li key={step.number}>
              <span className="mono-label">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* §3.4 Report preview: what $299 actually buys. */}
      <section className="home-section report-section" id="report">
        <div className="report-intro">
          <p className="mono-label">{content.report.eyebrow}</p>
          <h2>{content.report.title}</h2>
          <p>{content.report.text}</p>
          <p className="report-note">{content.report.note}</p>
          <Link className="button button-primary" href={assessmentHref}>
            {content.report.cta}
          </Link>
        </div>
        <ReportPreview content={content.report} />
      </section>

      {/* §3.5 Focus areas as alternating rows; categories, not a sequence. */}
      <section className="home-section">
        <p className="mono-label">{content.focus.eyebrow}</p>
        <h2>{content.focus.title}</h2>
        <div className="focus-rows">
          {content.focus.rows.map((row) => (
            <article key={row.title} className="focus-row">
              <FocusDiagram kind={row.diagram} />
              <div>
                <h3>{row.title}</h3>
                <p>{row.text}</p>
                <p className="focus-sign">{row.sign}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* §3.6 Pricing with anchors. */}
      <section className="home-section">
        <p className="mono-label">{content.pricing.eyebrow}</p>
        <h2>{content.pricing.title}</h2>
        <div className="pricing-grid">
          {content.pricing.columns.map((column) => (
            <article
              key={column.name}
              className={`pricing-card${column.highlighted ? ' pricing-card-highlighted' : ''}`}
            >
              <h3>{column.name}</h3>
              <p className="pricing-price mono-label">{column.price}</p>
              <p>{column.detail}</p>
              {column.cta ? (
                <Link className="button button-primary" href={assessmentHref}>
                  {column.cta}
                </Link>
              ) : null}
            </article>
          ))}
        </div>
        <p className="pricing-note">{content.pricing.note}</p>
      </section>

      {/* §3.8 FAQ as native accordions. */}
      <section className="home-section faq-section">
        <p className="mono-label">{content.faq.eyebrow}</p>
        <h2>{content.faq.title}</h2>
        <div className="faq-list">
          {content.faq.items.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* §3.9 The bilingual band, in the other language on purpose. */}
      <section className="bilingual-band">
        <div>
          <h2>{content.bilingual.title}</h2>
          <p>{content.bilingual.text}</p>
        </div>
        <Link className="button button-secondary" href={otherLocaleAssessmentHref}>
          {content.bilingual.cta}
        </Link>
      </section>

      {/* §3.10 Final CTA. */}
      <section className="final-cta">
        <h2>{content.finalCta.title}</h2>
        <p>{content.finalCta.text}</p>
        <Link className="button button-primary" href={assessmentHref}>
          {content.finalCta.cta}
        </Link>
      </section>
    </>
  );
}
