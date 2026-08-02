import type { HomeContent } from '@/i18n/home';

type ReportContent = HomeContent['report'];

const POSITION: Record<string, { x: number; y: number }> = {
  // Matrix coordinates in a 0–100 space: impact up, effort right.
  'high:low': { x: 22, y: 22 },
  'high:medium': { x: 52, y: 30 },
  'medium:medium': { x: 56, y: 58 },
  'medium:high': { x: 82, y: 62 },
};

/**
 * Two sample pages of the paid deliverable, rendered from the same design
 * tokens as the rest of the site (design brief §3.4). Content is labelled as
 * illustrative; nothing pretends to be a real customer's report.
 */
export default function ReportPreview({ content }: { readonly content: ReportContent }) {
  return (
    <div className="report-stack" aria-label={content.note}>
      <article className="report-page report-page-matrix">
        <p className="mono-label">{content.matrix.pageLabel}</p>
        <h3>{content.matrix.title}</h3>
        <div className="matrix-plot" role="img" aria-label={content.matrix.callout}>
          <span className="matrix-axis matrix-axis-y mono-label">{content.matrix.axisY}</span>
          <span className="matrix-axis matrix-axis-x mono-label">{content.matrix.axisX}</span>
          {content.matrix.points.map((point) => {
            const position = POSITION[`${point.impact}:${point.effort}`] ?? { x: 50, y: 50 };
            return (
              <span
                key={point.label}
                className="matrix-point"
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
              >
                <i />
                {point.label}
              </span>
            );
          })}
        </div>
        <p className="report-callout">{content.matrix.callout}</p>
      </article>

      <article className="report-page report-page-roadmap">
        <p className="mono-label">{content.roadmap.pageLabel}</p>
        <h3>{content.roadmap.title}</h3>
        <ol className="roadmap-list">
          {content.roadmap.phases.map((phase) => (
            <li key={phase.window}>
              <span className="mono-label">{phase.window}</span>
              <p>{phase.item}</p>
            </li>
          ))}
        </ol>
        <p className="report-callout">{content.roadmap.callout}</p>
      </article>
    </div>
  );
}
