interface ScoreDialProps {
  readonly score: number;
  readonly label: string;
  readonly outOf: string;
}

// Same semicircle geometry as the homepage HeroGauge, rendered statically on
// the server: the cabinet shows the customer's real score, no animation.
const RADIUS = 84;
const CIRCUMFERENCE = Math.PI * RADIUS;

export function ScoreDial({ score, label, outOf }: ScoreDialProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const filled = (clamped / 100) * CIRCUMFERENCE;

  return (
    <div className="score-dial" role="img" aria-label={`${label}: ${clamped} ${outOf}`}>
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
          {clamped}
        </text>
        <text className="gauge-scale" textAnchor="middle" x="100" y="107">
          / 100
        </text>
      </svg>
    </div>
  );
}
