import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ScoreDial } from '@/components/account/ScoreDial';
import { observationFor, resultContent } from '@/features/free-assessment/content';
import type { ScoreBand, ScoreBlockId } from '@/features/free-assessment/score';
import { isLocale } from '@/i18n/config';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

interface PermanentResultPageProps {
  readonly params: Promise<{ locale: string; assessmentId: string }>;
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your AI Opportunity Score',
  robots: { index: false, follow: false },
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;

interface ScoreRow {
  readonly total_score: number;
  readonly score_band: string;
  readonly opportunity_areas: readonly { readonly id: string }[] | null;
}

/**
 * The permanent home of a free result: the UUID in the address is the
 * capability, so the score survives closed tabs and works from the email on
 * any device. Public fields only; the soft gate still applies — the area
 * breakdown asks for an account.
 */
export default async function PermanentResultPage({ params }: PermanentResultPageProps) {
  const { locale: localeParameter, assessmentId } = await params;
  if (!isLocale(localeParameter)) notFound();
  const locale = localeParameter;
  const copy = resultContent[locale];

  if (!UUID_PATTERN.test(assessmentId) || process.env.ASSESSMENT_STORAGE_MODE !== 'supabase') {
    return <Unavailable locale={locale} />;
  }

  // Admin client: these rows belong to a lead, not a profile, so row-level
  // security cannot serve an anonymous visitor. The route exposes public
  // result fields only — never contact data.
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from('free_assessments')
    .select(
      'id, preferred_locale, status, opportunity_scores(total_score, score_band, opportunity_areas)',
    )
    .eq('id', assessmentId)
    .eq('status', 'scored')
    .maybeSingle();

  const relation = data?.opportunity_scores;
  const score = (Array.isArray(relation) ? relation[0] : relation) as ScoreRow | undefined;
  if (!data || !score) {
    return <Unavailable locale={locale} />;
  }

  const authClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  const authenticated = Boolean(user);

  const labels = copy.areaLabels;
  const areas = (score.opportunity_areas ?? [])
    .map((area) => labels[area.id as ScoreBlockId])
    .filter((label): label is string => Boolean(label));
  const observation = observationFor(locale, score.score_band as ScoreBand);

  return (
    <main className="page-shell">
      <article className="result-page">
        <section className="result-hero">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p className="result-observation">{observation}</p>
          </div>
          <ScoreDial score={score.total_score} label={copy.title} outOf={copy.scoreOutOf} />
        </section>

        <section className="result-section" aria-labelledby="permanent-areas-heading">
          <h2 id="permanent-areas-heading">{authenticated ? copy.areasTitle : copy.gateTitle}</h2>
          {authenticated ? (
            <div className="opportunity-grid">
              {areas.map((label, index) => (
                <div className="opportunity-card" key={label}>
                  <span>0{index + 1}</span>
                  <h3>{label}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="gate-panel">
              <p>{copy.gateText}</p>
              <Link
                className="button button-primary"
                href={`/${locale}/auth?mode=register&next=${encodeURIComponent(`/${locale}/assessment/result/${assessmentId}`)}`}
              >
                {copy.gateAction}
              </Link>
            </div>
          )}
        </section>

        <p className="result-limitation">{copy.limitation}</p>

        <section className="result-section locked-section">
          <p className="eyebrow">{copy.lockedTitle}</p>
          <h2>{copy.offerTitle}</h2>
          <div className="offer-panel">
            <div>
              <strong>$299</strong>
              <p>{copy.offerText}</p>
            </div>
            <Link className="button button-primary" href={`/${locale}/account`}>
              {copy.offerAction}
            </Link>
          </div>
        </section>

        <div className="result-restart">
          <Link href={`/${locale}/assessment`}>{copy.restart}</Link>
        </div>
      </article>
    </main>
  );
}

function Unavailable({ locale }: { readonly locale: 'en' | 'es' }) {
  const copy = resultContent[locale];
  return (
    <main className="page-shell">
      <section className="centered-state result-unavailable">
        <h1>{copy.unavailableTitle}</h1>
        <p>{copy.unavailableText}</p>
        <Link className="button button-primary" href={`/${locale}/assessment`}>
          {copy.restart}
        </Link>
      </section>
    </main>
  );
}
