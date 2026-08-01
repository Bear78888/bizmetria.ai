import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const reconciliationPath = join(
  process.cwd(),
  'supabase/migrations/20260731000200_production_schema_reconciliation.sql',
);

async function reconciliationSource() {
  return readFile(reconciliationPath, 'utf8');
}

describe('production schema reconciliation migration', () => {
  it('is additive and contains no destructive statements', async () => {
    const migration = await reconciliationSource();

    expect(migration).toMatch(/^begin;/u);
    expect(migration).toMatch(/commit;\s*$/u);
    expect(migration).not.toMatch(/^\s*(drop|truncate)\b/imu);
    expect(migration).not.toMatch(/\bdelete\s+from\b/iu);
  });

  it('preserves and safely extends the legacy profiles table', async () => {
    const migration = await reconciliationSource();

    expect(migration).toContain("if to_regclass('public.profiles') is null");
    expect(migration).toContain('add column if not exists email extensions.citext');
    expect(migration).toContain('where p.id = u.id\n  and p.email is null');
    expect(migration).toContain('alter policy "Users can view own profile"');
    expect(migration).toContain(
      "policyname in ('profiles_owner_select', 'Users can view own profile')",
    );
  });

  it('guards tables, policies, indexes, triggers, and the private reports bucket', async () => {
    const migration = await reconciliationSource();

    expect(migration.match(/create table if not exists public\./gu)).toHaveLength(27);
    expect(migration.match(/^do \$policy_guard\$$/gmu)).toHaveLength(31);
    expect(migration).toContain("policyname = relation_name || '_admin_all'");
    expect(migration).toContain("tgname = relation_name || '_set_updated_at'");
    expect(migration).toContain("'reports',\n  'reports',\n  false");
    expect(migration).not.toContain('synthetic_seed');
  });
});
