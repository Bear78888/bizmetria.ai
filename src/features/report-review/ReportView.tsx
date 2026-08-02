import type { AnalysisContent } from '@/features/analysis/contract';

const labels = {
  en: {
    summary: 'Executive summary',
    findings: 'Findings',
    recommendations: 'Recommendations',
    roadmap: '90-day roadmap',
    phase1: 'Days 1–30',
    phase2: 'Days 31–60',
    phase3: 'Days 61–90',
    impact: 'Impact',
    effort: 'Effort',
    firstStep: 'First step',
    level: { low: 'Low', medium: 'Medium', high: 'High' },
  },
  es: {
    summary: 'Resumen ejecutivo',
    findings: 'Hallazgos',
    recommendations: 'Recomendaciones',
    roadmap: 'Hoja de ruta de 90 días',
    phase1: 'Días 1–30',
    phase2: 'Días 31–60',
    phase3: 'Días 61–90',
    impact: 'Impacto',
    effort: 'Esfuerzo',
    firstStep: 'Primer paso',
    level: { low: 'Bajo', medium: 'Medio', high: 'Alto' },
  },
} as const;

interface ReportViewProps {
  readonly locale: 'en' | 'es';
  readonly content: AnalysisContent;
}

/** Renders a report's content; shared by the review screen and the customer view. */
export default function ReportView({ locale, content }: ReportViewProps) {
  const text = labels[locale];

  return (
    <div className="report-view">
      <section>
        <h2>{text.summary}</h2>
        <p>{content.executiveSummary}</p>
      </section>

      <section>
        <h2>{text.findings}</h2>
        {content.findings.map((finding) => (
          <div key={`${finding.area}:${finding.title}`} className="report-item">
            <h3>{finding.title}</h3>
            <p>{finding.detail}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>{text.recommendations}</h2>
        {content.recommendations.map((recommendation) => (
          <div key={recommendation.title} className="report-item">
            <h3>{recommendation.title}</h3>
            <p>{recommendation.rationale}</p>
            <p className="report-meta">
              {text.impact}: {text.level[recommendation.impact]} · {text.effort}:{' '}
              {text.level[recommendation.effort]}
            </p>
            <p>
              <strong>{text.firstStep}:</strong> {recommendation.firstStep}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2>{text.roadmap}</h2>
        {(
          [
            [text.phase1, content.roadmap.days1To30],
            [text.phase2, content.roadmap.days31To60],
            [text.phase3, content.roadmap.days61To90],
          ] as const
        ).map(([phase, items]) =>
          items.length > 0 ? (
            <div key={phase} className="report-item">
              <h3>{phase}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null,
        )}
      </section>
    </div>
  );
}
