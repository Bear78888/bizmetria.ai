/**
 * Single-line diagrams for the focus rows (design brief §3.5): concrete
 * artifacts of measurement, drawn from the design tokens. No robots, no
 * abstract AI imagery.
 */
export default function FocusDiagram({ kind }: { readonly kind: string }) {
  if (kind === 'response') {
    // A reply-time line: inquiry arrives, the gap before the answer.
    return (
      <svg aria-hidden="true" className="focus-diagram" viewBox="0 0 220 120">
        <line stroke="var(--line)" strokeWidth="2" x1="16" x2="204" y1="90" y2="90" />
        <circle cx="40" cy="90" fill="var(--metric)" r="6" />
        <text className="diagram-mono" x="26" y="112">
          18:04
        </text>
        <path
          d="M 40 90 Q 100 20 168 60"
          fill="none"
          stroke="var(--metric)"
          strokeDasharray="5 5"
          strokeWidth="2"
        />
        <circle cx="168" cy="60" fill="none" r="8" stroke="var(--metric)" strokeWidth="2" />
        <text className="diagram-mono" x="150" y="44">
          +14h?
        </text>
      </svg>
    );
  }

  if (kind === 'manual') {
    // The same block copied again and again.
    return (
      <svg aria-hidden="true" className="focus-diagram" viewBox="0 0 220 120">
        {[0, 1, 2].map((index) => (
          <rect
            key={index}
            fill="none"
            height="56"
            rx="6"
            stroke={index === 2 ? 'var(--metric)' : 'var(--line)'}
            strokeWidth="2"
            width="56"
            x={24 + index * 60}
            y="24"
          />
        ))}
        {[0, 1, 2].map((index) => (
          <g
            key={`lines-${index}`}
            stroke={index === 2 ? 'var(--metric)' : 'var(--line)'}
            strokeWidth="2"
          >
            <line x1={34 + index * 60} x2={70 + index * 60} y1="42" y2="42" />
            <line x1={34 + index * 60} x2={62 + index * 60} y1="54" y2="54" />
            <line x1={34 + index * 60} x2={66 + index * 60} y1="66" y2="66" />
          </g>
        ))}
        <text className="diagram-mono" x="24" y="104">
          ×3 / day
        </text>
      </svg>
    );
  }

  // systems: three disconnected boxes, one dashed missing link.
  return (
    <svg aria-hidden="true" className="focus-diagram" viewBox="0 0 220 120">
      <rect
        fill="none"
        height="36"
        rx="6"
        stroke="var(--line)"
        strokeWidth="2"
        width="56"
        x="20"
        y="18"
      />
      <rect
        fill="none"
        height="36"
        rx="6"
        stroke="var(--line)"
        strokeWidth="2"
        width="56"
        x="144"
        y="18"
      />
      <rect
        fill="none"
        height="36"
        rx="6"
        stroke="var(--line)"
        strokeWidth="2"
        width="56"
        x="82"
        y="72"
      />
      <line stroke="var(--metric)" strokeWidth="2" x1="76" x2="144" y1="36" y2="36" />
      <line
        stroke="var(--line)"
        strokeDasharray="5 5"
        strokeWidth="2"
        x1="48"
        x2="96"
        y1="54"
        y2="76"
      />
      <line
        stroke="var(--line)"
        strokeDasharray="5 5"
        strokeWidth="2"
        x1="172"
        x2="124"
        y1="54"
        y2="76"
      />
      <text className="diagram-mono" x="88" y="14">
        1 / 3
      </text>
    </svg>
  );
}
