'use client';

import Link from 'next/link';
import { useMemo, useState, useSyncExternalStore } from 'react';

import { resultContent } from './content';
import type { PublicAssessmentResult } from './result';
import type { AssessmentLocale } from './schema';

interface ResultClientProps {
  readonly locale: AssessmentLocale;
  /** Soft gate: signed-in visitors see the area breakdown directly. */
  readonly authenticated: boolean;
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

export function ResultClient({ locale, authenticated }: ResultClientProps) {
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
        <h2 id="opportunity-area-heading">{authenticated ? copy.areasTitle : copy.gateTitle}</h2>
        {authenticated ? (
          <>
            <div className="opportunity-grid">
              {result.opportunityAreas.map((area, index) => (
                <div className="opportunity-card" key={area.id}>
                  <span>0{index + 1}</span>
                  <h3>{area.label}</h3>
                </div>
              ))}
            </div>
            <p className="gate-hint">{copy.gateSignedInHint}</p>
          </>
        ) : (
          <div className="gate-panel">
            <div className="opportunity-grid" aria-hidden="true">
              {result.opportunityAreas.map((area, index) => (
                <div className="opportunity-card opportunity-card-locked" key={area.id}>
                  <span>0{index + 1}</span>
                  <h3>••••••••</h3>
                </div>
              ))}
            </div>
            <p>{copy.gateText}</p>
            <Link
              className="button button-primary"
              href={`/${locale}/auth?intent=free-report&next=${encodeURIComponent(`/${locale}/account`)}`}
            >
              {copy.gateAction}
            </Link>
          </div>
        )}
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
          <CheckoutButton
            locale={locale}
            assessmentId={result.assessmentId}
            label={copy.offerAction}
          />
        </div>
      </section>

      <div className="result-restart">
        <Link href={`/${locale}/assessment`}>{copy.restart}</Link>
      </div>
    </article>
  );
}

interface CheckoutButtonProps {
  readonly locale: AssessmentLocale;
  readonly assessmentId: string;
  readonly label: string;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;

/**
 * Opens Stripe Checkout for this free assessment. The server re-derives every
 * amount and applies no promotion from here, so the only thing this button
 * sends is which assessment the purchase follows from.
 *
 * A preview-mode result carries a synthetic `preview-` id that no order can
 * attach to; the button then links to the auth page as before instead of
 * offering a checkout that would be refused.
 */
export function CheckoutButton({ locale, assessmentId, label }: CheckoutButtonProps) {
  const [state, setState] = useState<'idle' | 'starting' | 'failed'>('idle');
  const purchasable = UUID_PATTERN.test(assessmentId);

  if (!purchasable) {
    return (
      <Link className="button button-primary" href={`/${locale}/auth?intent=business-assessment`}>
        {label}
      </Link>
    );
  }

  const start = async () => {
    setState('starting');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractVersion: 'checkout/1.0.0',
          locale,
          freeAssessmentId: assessmentId,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const payload = (await response.json()) as { checkoutUrl?: string };
      if (!response.ok || !payload.checkoutUrl) throw new Error('checkout unavailable');
      window.location.assign(payload.checkoutUrl);
    } catch {
      setState('failed');
    }
  };

  return (
    <div className="checkout-start">
      <button
        className="button button-primary"
        type="button"
        disabled={state === 'starting'}
        onClick={() => {
          void start();
        }}
      >
        {label}
      </button>
      {state === 'failed' ? (
        <p role="alert" className="checkout-error">
          {locale === 'es'
            ? 'El pago no está disponible en este momento. Inténtelo de nuevo más tarde.'
            : 'Checkout is not available right now. Please try again later.'}
        </p>
      ) : null}
    </div>
  );
}
