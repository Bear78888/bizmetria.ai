'use client';

import { useState } from 'react';

import { formatSolutionPrice, solutionsCatalog } from './catalog';

interface SolutionsGridProps {
  readonly locale: 'en' | 'es';
  readonly paidAssessmentId?: string | undefined;
}

const copy = {
  en: {
    delivery: (days: number) => `Delivered in ${days} business days`,
    order: 'Order',
    starting: 'Opening checkout…',
    failed: 'Checkout is not available right now. Please try again later.',
    includes:
      'Every solution includes the working build, all accesses, a step-by-step PDF, a short screencast, one revision round, and 14 days of fix-support. Platform subscriptions (e.g. automation tools, phone numbers) run on your own accounts and are stated before payment. You can request a call at any point — never required.',
  },
  es: {
    delivery: (days: number) => `Entrega en ${days} días hábiles`,
    order: 'Encargar',
    starting: 'Abriendo el pago…',
    failed: 'El pago no está disponible en este momento. Inténtelo de nuevo más tarde.',
    includes:
      'Cada solución incluye la configuración funcionando, todos los accesos, un PDF paso a paso, un video corto, una ronda de revisión y 14 días de soporte de ajustes. Las suscripciones a plataformas (p. ej. herramientas de automatización, números telefónicos) corren en sus propias cuentas y se indican antes del pago. Puede solicitar una llamada en cualquier momento — nunca es obligatoria.',
  },
} as const;

/**
 * The post-report catalog (DEC-031): fixed scope, fixed price, one click to
 * order. The server re-derives the amount from the catalog code, so this
 * component only ever sends which solution was chosen.
 */
export default function SolutionsGrid({ locale, paidAssessmentId }: SolutionsGridProps) {
  const text = copy[locale];
  const [startingCode, setStartingCode] = useState<string | null>(null);
  const [failedCode, setFailedCode] = useState<string | null>(null);

  const order = async (solutionCode: string) => {
    setStartingCode(solutionCode);
    setFailedCode(null);
    try {
      const response = await fetch('/api/solutions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractVersion: 'solution-checkout/1.0.0',
          solutionCode,
          locale,
          idempotencyKey: crypto.randomUUID(),
          ...(paidAssessmentId ? { paidAssessmentId } : {}),
        }),
      });
      const payload = (await response.json()) as { checkoutUrl?: string };
      if (!response.ok || !payload.checkoutUrl) throw new Error('checkout unavailable');
      window.location.assign(payload.checkoutUrl);
    } catch {
      setFailedCode(solutionCode);
      setStartingCode(null);
    }
  };

  return (
    <div className="solutions-block">
      <div className="solutions-grid">
        {solutionsCatalog.map((solution) => (
          <div className="solution-card" key={solution.code}>
            <h3>{solution.title[locale]}</h3>
            <p>{solution.outcome[locale]}</p>
            <p className="solution-meta">{text.delivery(solution.deliveryBusinessDays)}</p>
            <div className="solution-actions">
              <strong>{formatSolutionPrice(solution)}</strong>
              <button
                className="button button-primary"
                type="button"
                disabled={startingCode !== null}
                onClick={() => {
                  void order(solution.code);
                }}
              >
                {startingCode === solution.code ? text.starting : text.order}
              </button>
            </div>
            {failedCode === solution.code ? (
              <p role="alert" className="checkout-error">
                {text.failed}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      <p className="solutions-note">{text.includes}</p>
    </div>
  );
}
