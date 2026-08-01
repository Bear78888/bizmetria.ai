'use client';

import Link from 'next/link';
import { useMemo, useSyncExternalStore } from 'react';

import { resultContent } from './content';
import type { PublicAssessmentResult } from './result';
import type { AssessmentLocale } from './schema';

interface ResultClientProps {
  readonly locale: AssessmentLocale;
}

function subscribeToSessionStorage() {
  return () => undefined;
}

function readStoredResult() {
  return sessionStorage.getItem('bizmetria-free-result');
}

function readServerResult() {
  return undefined;
}

export function ResultClient({ locale }: ResultClientProps) {
  const copy = resultContent[locale];
  const storedResult = useSyncExternalStore(
    subscribeToSessionStorage,
    readStoredResult,
    readServerResult,
  );
  const result = useMemo(() => {
    if (storedResult === undefined) return undefined;
    if (storedResult === null) return null;

    try {
      return JSON.parse(storedResult) as PublicAssessmentResult;
    } catch {
      return null;
    }
  }, [storedResult]);

  if (result === undefined) {
    return <div className="result-loading" aria-label="Loading result" />;
  }

  if (!result || result.locale !== locale) {
    return (
      <section className="centered-state result-unavailable">
        <h1>{copy.unavailableTitle}</h1>
        <p>{copy.unavailableText}</p>
        <Link className="button button-primary" href={`/${locale}/assessment`}>
          {copy.restart}
        </Link>
      </section>
    );
  }

  return (
    <article className="result-page">
      <section className="result-hero">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="result-observation">{result.observation}</p>
        </div>
        <div className="score-orbit" aria-label={`${result.score.total} ${copy.scoreOutOf}`}>
          <strong>{result.score.total}</strong>
          <span>{copy.scoreOutOf}</span>
        </div>
      </section>

      <section className="result-section" aria-labelledby="opportunity-area-heading">
        <h2 id="opportunity-area-heading">{copy.areasTitle}</h2>
        <div className="opportunity-grid">
          {result.opportunityAreas.map((area, index) => (
            <div className="opportunity-card" key={area.id}>
              <span>0{index + 1}</span>
              <h3>{area.label}</h3>
            </div>
          ))}
        </div>
      </section>

      <p className="result-limitation">{result.limitation}</p>

      <section className="result-section locked-section" aria-labelledby="locked-heading">
        <p className="eyebrow">{copy.lockedTitle}</p>
        <h2 id="locked-heading">{copy.offerTitle}</h2>
        <div className="locked-grid">
          {result.lockedSections.map((section) => (
            <div className="locked-card" key={section.id}>
              <span aria-hidden="true">↗</span>
              <p>{section.label}</p>
              <small>Locked</small>
            </div>
          ))}
        </div>
        <div className="offer-panel">
          <div>
            <strong>$299</strong>
            <p>{copy.offerText}</p>
          </div>
          <Link
            className="button button-primary"
            href={`/${locale}/auth?intent=business-assessment`}
          >
            {copy.offerAction}
          </Link>
        </div>
      </section>

      <div className="result-restart">
        <Link href={`/${locale}/assessment`}>{copy.restart}</Link>
      </div>
    </article>
  );
}
