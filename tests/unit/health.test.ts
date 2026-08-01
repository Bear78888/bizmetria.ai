import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { GET } from '@/app/api/health/route';

const platformEnvironment = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://rbndiytodvoyiejassnw.supabase.co',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_synthetic',
  SUPABASE_PROJECT_REF: 'rbndiytodvoyiejassnw',
  SUPABASE_SECRET_KEY: 'sb_secret_synthetic',
};

const managedNames = [
  ...Object.keys(platformEnvironment),
  'ASSESSMENT_STORAGE_MODE',
  'ANALYSIS_PROVIDER',
  'ANTHROPIC_API_KEY',
  'RESEND_DELIVERY_MODE',
];

let saved: Record<string, string | undefined>;

beforeEach(() => {
  saved = Object.fromEntries(managedNames.map((name) => [name, process.env[name]]));
  for (const name of managedNames) delete process.env[name];
  Object.assign(process.env, platformEnvironment);
});

afterEach(() => {
  for (const name of managedNames) {
    const value = saved[name];
    if (value === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = value;
    }
  }
});

async function body() {
  return (await GET().json()) as {
    status: string;
    adapters: { assessmentStorage: string; analysisProvider: string; resultEmail: string };
  };
}

describe('health endpoint', () => {
  it('reports the mock storage adapter, so a deployment that discards leads is visible', async () => {
    expect((await body()).adapters.assessmentStorage).toBe('mock');
  });

  it('reports the supabase adapter once storage is enabled', async () => {
    process.env.ASSESSMENT_STORAGE_MODE = 'supabase';

    expect((await body()).adapters.assessmentStorage).toBe('supabase');
  });

  it('reports which analysis provider will actually run', async () => {
    expect((await body()).adapters.analysisProvider).toBe('deterministic');

    process.env.ANTHROPIC_API_KEY = 'sk-ant-synthetic';
    expect((await body()).adapters.analysisProvider).toBe('claude');
  });

  it('reports a misconfigured provider rather than failing the health check', async () => {
    process.env.ANALYSIS_PROVIDER = 'gpt';

    const result = await body();
    expect(result.status).toBe('ok');
    expect(result.adapters.analysisProvider).toBe('misconfigured');
  });

  it('reports whether result email would be delivered', async () => {
    expect((await body()).adapters.resultEmail).toBe('skipped');

    process.env.RESEND_DELIVERY_MODE = 'send';
    expect((await body()).adapters.resultEmail).toBe('send');
  });

  it('exposes no credential, host or project reference', async () => {
    process.env.ANTHROPIC_API_KEY = 'sk-ant-synthetic';
    const serialised = JSON.stringify(await body());

    for (const secret of Object.values(platformEnvironment)) {
      expect(serialised).not.toContain(secret);
    }
    expect(serialised).not.toContain('sk-ant-synthetic');
  });
});
