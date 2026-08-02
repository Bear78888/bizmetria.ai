'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface GaugeBar {
  readonly label: string;
  readonly value: number;
  readonly max: number;
}

interface HeroGaugeProps {
  readonly label: string;
  readonly caption: string;
  readonly cta: string;
  readonly ctaHref: string;
  readonly bars: readonly GaugeBar[];
}

const SAMPLE_SCORE = 68;
const ANIMATION_MS = 1200;

// Semicircle geometry: radius 84 in a 200×110 viewBox.
const RADIUS = 84;
const CIRCUMFERENCE = Math.PI * RADIUS;

function easeOut(t: number): number {
  return 1 - (1 - t) ** 3;
}

/**
 * The signature element (design brief §2): a working score gauge, animated
 * once on load. With reduced motion the final state renders immediately.
 */
export default function HeroGauge({ label, caption, cta, ctaHref, bars }: HeroGaugeProps) {
  const [score, setScore] = useState(0);
  const [barsVisible, setBarsVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let frame = 0;
    if (reducedMotion) {
      // Final state on the next frame: no animation, same resting render.
      frame = requestAnimationFrame(() => {
        setScore(SAMPLE_SCORE);
        setBarsVisible(true);
      });
      return () => cancelAnimationFrame(frame);
    }

    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / ANIMATION_MS, 1);
      setScore(Math.round(easeOut(progress) * SAMPLE_SCORE));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setBarsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    if (rootRef.current) observer.observe(rootRef.current);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const filled = (score / 100) * CIRCUMFERENCE;

  return (
    <div className="gauge-card" ref={rootRef}>
      <p className="mono-label">{label}</p>
      <svg aria-hidden="true" className="gauge-dial" viewBox="0 0 200 110">
        <path
          d="M 16 104 A 84 84 0 0 1 184 104"
          fill="none"
          stroke="var(--line)"
          strokeLinecap="round"
          strokeWidth="12"
        />
        <path
          d="M 16 104 A 84 84 0 0 1 184 104"
          fill="none"
          stroke="var(--metric)"
          strokeLinecap="round"
          strokeWidth="12"
          strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
        />
        <text className="gauge-score" textAnchor="middle" x="100" y="92">
          {score}
        </text>
        <text className="gauge-scale" textAnchor="middle" x="100" y="107">
          / 100
        </text>
      </svg>
      <div className="gauge-bars">
        {bars.map((bar) => (
          <div key={bar.label} className="gauge-bar">
            <div className="gauge-bar-heading">
              <span>{bar.label}</span>
              <span className="mono-label">
                {bar.value}/{bar.max}
              </span>
            </div>
            <div className="gauge-bar-track">
              <div
                className="gauge-bar-fill"
                style={{ width: barsVisible ? `${(bar.value / bar.max) * 100}%` : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="gauge-caption">{caption}</p>
      <Link className="button button-primary" href={ctaHref}>
        {cta}
      </Link>
    </div>
  );
}
