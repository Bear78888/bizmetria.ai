import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const requiredTables = [
  'profiles',
  'businesses',
  'leads',
  'consents',
  'free_assessments',
  'free_assessment_answers',
  'opportunity_scores',
  'orders',
  'payments',
  'promotion_redemptions',
  'paid_assessments',
  'interview_sessions',
  'call_records',
  'transcripts',
  'analysis_runs',
  'recommendations',
  'roadmaps',
  'reports',
  'report_reviews',
  'consultations',
  'email_events',
  'integration_events',
  'webhook_events',
  'automation_jobs',
  'audit_logs',
] as const;

async function migrationSource() {
  return readFile(
    join(process.cwd(), 'supabase/migrations/20260731000100_platform_foundation.sql'),
    'utf8',
  );
}

describe('platform migration contract', () => {
  it('defines every required platform table', async () => {
    const migration = await migrationSource();

    for (const table of requiredTables) {
      expect(migration).toContain(`create table public.${table}`);
    }
  });

  it('enables RLS for every required table through the controlled table registry', async () => {
    const migration = await migrationSource();
    const helperGrant = migration.indexOf(
      'grant execute on function app_private.owns_paid_assessment',
    );
    const rlsRegistryStart = migration.indexOf('do $$', helperGrant);
    const rlsRegistryEnd = migration.indexOf(
      "execute format('alter table public.%I enable row level security'",
      rlsRegistryStart,
    );
    const rlsSection = migration.slice(rlsRegistryStart, rlsRegistryEnd);

    for (const table of requiredTables) {
      expect(rlsSection).toContain(`'${table}'`);
    }
  });

  it('creates a private reports bucket and immutable audit log', async () => {
    const migration = await migrationSource();

    expect(migration).toContain("'reports',\n  'reports',\n  false");
    expect(migration).toContain('audit_logs_immutable');
    expect(migration).toContain("raise exception 'audit_logs are immutable'");
  });

  it('keeps payment records fail-closed in Stripe test mode', async () => {
    const migration = await migrationSource();

    expect(migration).toContain('orders_test_mode_only_check');
    expect(migration).toContain('payments_test_mode_only_check');
    expect(migration).not.toContain('sk_live_');
    expect(migration).not.toContain('pk_live_');
  });

  it('contains only synthetic seed data', async () => {
    const seed = await readFile(join(process.cwd(), 'supabase/seed.sql'), 'utf8');

    expect(seed).toContain('synthetic');
    expect(seed).not.toMatch(/@[a-z0-9.-]+\.[a-z]{2,}/iu);
  });
});
