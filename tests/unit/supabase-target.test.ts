import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { SUPABASE_TARGET_ERROR, verifySupabaseTarget } from '../../scripts/verify-supabase-target';

const canonicalEnvironment = {
  SUPABASE_PROJECT_REF: 'rbndiytodvoyiejassnw',
  NEXT_PUBLIC_SUPABASE_URL: 'https://rbndiytodvoyiejassnw.supabase.co',
  SUPABASE_SECRET_KEY: 'must-never-be-printed',
};

describe('Supabase target guard', () => {
  it('accepts only the canonical root project target', () => {
    expect(() => verifySupabaseTarget(canonicalEnvironment)).not.toThrow();
  });

  it.each([
    [{ ...canonicalEnvironment, SUPABASE_PROJECT_REF: undefined }],
    [{ ...canonicalEnvironment, SUPABASE_PROJECT_REF: 'wrong-project' }],
    [{ ...canonicalEnvironment, NEXT_PUBLIC_SUPABASE_URL: undefined }],
    [
      {
        ...canonicalEnvironment,
        NEXT_PUBLIC_SUPABASE_URL: 'https://another-project.supabase.co',
      },
    ],
    [
      {
        ...canonicalEnvironment,
        NEXT_PUBLIC_SUPABASE_URL: 'https://rbndiytodvoyiejassnw.supabase.co/rest/v1/',
      },
    ],
  ])('fails closed without exposing credentials', (environment) => {
    expect(() => verifySupabaseTarget(environment)).toThrow(SUPABASE_TARGET_ERROR);

    try {
      verifySupabaseTarget(environment);
    } catch (error) {
      expect(String(error)).not.toContain(canonicalEnvironment.SUPABASE_SECRET_KEY);
    }
  });

  it('rejects a Supabase CLI link to a different project', () => {
    const projectRoot = join(tmpdir(), `bizmetria-target-${crypto.randomUUID()}`);
    mkdirSync(join(projectRoot, 'supabase/.temp'), { recursive: true });
    writeFileSync(join(projectRoot, 'supabase/.temp/project-ref'), 'wrong-project\n');

    expect(() => verifySupabaseTarget(canonicalEnvironment, projectRoot)).toThrow(
      SUPABASE_TARGET_ERROR,
    );
  });
});
