import type { AnalysisContent } from '@/features/analysis/contract';

const labels = {
  en: {
    summary: 'Executive summary',
    findings: 'Findings',
    recommendations: 'Recommendations',
    sprint: '30-day implementation sprint',
    week1: 'Week 1',
    week2: 'Week 2',
    week3: 'Week 3',
    week4: 'Week 4',
    impact: 'Impact',
    effort: 'Effort',
    firstStep: 'First step',
    level: { low: 'Low', medium: 'Medium', high: 'High' },
  },
  es: {
    summary: 'Resumen ejecutivo',
    findings: 'Hallazgos',
    recommendations: 'Recomendaciones',
    sprint: 'Sprint de implementación de 30 días',
    week1: 'Semana 1',
    week2: 'Semana 2',
    week3: 'Semana 3',
    week4: 'Semana 4',
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
        <h2>{text.sprint}</h2>
        {(
          [
            [text.week1, content.sprint.week1],
            [text.week2, content.sprint.week2],
            [text.week3, content.sprint.week3],
            [text.week4, content.sprint.week4],
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
