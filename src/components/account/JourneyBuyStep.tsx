'use client';

import { useState } from 'react';

interface JourneyBuyStepProps {
  readonly locale: 'en' | 'es';
  readonly assessmentId: string;
  readonly title: string;
  readonly detail: string;
  readonly stateClass: string;
}

/**
 * The journey card that starts the $299 checkout in one click. The server
 * re-derives every amount; this only names which free assessment the
 * purchase follows from.
 */
export default function JourneyBuyStep({
  locale,
  assessmentId,
  title,
  detail,
  stateClass,
}: JourneyBuyStepProps) {
  const [state, setState] = useState<'idle' | 'starting' | 'failed'>('idle');

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
    <li className={`journey-step ${stateClass}`}>
      <button
        className="journey-step-action"
        type="button"
        disabled={state === 'starting'}
        onClick={() => {
          void start();
        }}
      >
        <strong>{title}</strong>
        <span>
          {state === 'starting'
            ? locale === 'es'
              ? 'Abriendo el pago…'
              : 'Opening checkout…'
            : detail}
        </span>
        {state === 'failed' ? (
          <span role="alert" className="checkout-error">
            {locale === 'es'
              ? 'El pago no está disponible en este momento. Inténtelo de nuevo más tarde.'
              : 'Checkout is not available right now. Please try again later.'}
          </span>
        ) : null}
      </button>
    </li>
  );
}
