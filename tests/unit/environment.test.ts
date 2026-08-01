import { describe, expect, it } from 'vitest';

import {
  EnvironmentValidationError,
  parseIntegrationEnvironment,
  parsePlatformEnvironment,
  validateEnvironment,
} from '../../src/lib/env/schema';

const platformEnvironment = {
  NEXT_PUBLIC_APP_URL: 'https://preview.bizmetria.example',
  NEXT_PUBLIC_SUPABASE_URL: 'https://rbndiytodvoyiejassnw.supabase.co',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_synthetic',
  SUPABASE_PROJECT_REF: 'rbndiytodvoyiejassnw',
  SUPABASE_SECRET_KEY: 'sb_secret_synthetic',
};

describe('environment validation', () => {
  it('accepts the canonical hosted Supabase root project URL', () => {
    expect(validateEnvironment(platformEnvironment, 'platform')).toEqual({
      ok: true,
      missing: [],
      invalid: [],
    });
  });

  it('accepts a registered preview project ref only with the preview flag', () => {
    const previewEnvironment = {
      ...platformEnvironment,
      SUPABASE_TARGET_ENV: 'preview',
      SUPABASE_PROJECT_REF: 'bwmyzkufqrufjimtfwow',
      NEXT_PUBLIC_SUPABASE_URL: 'https://bwmyzkufqrufjimtfwow.supabase.co',
    };

    expect(validateEnvironment(previewEnvironment, 'platform')).toEqual({
      ok: true,
      missing: [],
      invalid: [],
    });
  });

  it('rejects a non-canonical project ref without the preview flag', () => {
    const check = validateEnvironment(
      {
        ...platformEnvironment,
        SUPABASE_PROJECT_REF: 'bwmyzkufqrufjimtfwow',
        NEXT_PUBLIC_SUPABASE_URL: 'https://bwmyzkufqrufjimtfwow.supabase.co',
      },
      'platform',
    );

    expect(check.ok).toBe(false);
    expect(check.invalid).toContain('SUPABASE_PROJECT_REF');
  });

  it('accepts a local Supabase root URL for local development', () => {
    const result = parsePlatformEnvironment({
      ...platformEnvironment,
      NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
    });

    expect(result.NEXT_PUBLIC_SUPABASE_URL).toBe('http://127.0.0.1:54321');
  });

  it('rejects a Supabase REST endpoint instead of the project root', () => {
    const check = validateEnvironment(
      {
        ...platformEnvironment,
        NEXT_PUBLIC_SUPABASE_URL: 'https://rbndiytodvoyiejassnw.supabase.co/rest/v1/',
      },
      'platform',
    );

    expect(check.ok).toBe(false);
    expect(check.invalid).toContain('NEXT_PUBLIC_SUPABASE_URL');
  });

  it('returns variable names without returning secret values', () => {
    const check = validateEnvironment(
      {
        NEXT_PUBLIC_SUPABASE_URL: 'not-a-url',
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '',
        SUPABASE_SECRET_KEY: 'sensitive-value-that-must-not-appear',
      },
      'platform',
    );

    expect(JSON.stringify(check)).not.toContain('sensitive-value-that-must-not-appear');
    expect(check.invalid).toContain('NEXT_PUBLIC_SUPABASE_URL');
    expect(check.missing).toContain('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  });

  it('requires Stripe test keys for the integration scope', () => {
    expect(() =>
      parseIntegrationEnvironment({
        ...platformEnvironment,
        ANTHROPIC_API_KEY: 'sk-ant-synthetic',
        STRIPE_SECRET_KEY: 'sk_live_disallowed',
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_live_disallowed',
        RETELL_API_KEY: 'synthetic-retell-key',
        RESEND_API_KEY: 'synthetic-resend-key',
      }),
    ).toThrow(EnvironmentValidationError);
  });

  it('never embeds a supplied secret in a thrown validation error', () => {
    const suppliedSecret = 'sk_live_sensitive-value';

    try {
      parseIntegrationEnvironment({
        ...platformEnvironment,
        ANTHROPIC_API_KEY: 'sk-ant-synthetic',
        STRIPE_SECRET_KEY: suppliedSecret,
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_synthetic',
        RETELL_API_KEY: 'synthetic-retell-key',
        RESEND_API_KEY: 'synthetic-resend-key',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(EnvironmentValidationError);
      expect(String(error)).not.toContain(suppliedSecret);
    }
  });

  const integrationEnvironment = {
    ...platformEnvironment,
    STRIPE_SECRET_KEY: 'sk_test_synthetic',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_synthetic',
    RETELL_API_KEY: 'synthetic-retell-key',
    RESEND_API_KEY: 'synthetic-resend-key',
  };

  // The credential does not exist yet in any deployed environment. Requiring it
  // would fail the build before the analysis feature ships, so the schema lets
  // a deployment come up without it and the analysis provider refuses instead.
  it('builds without an Anthropic credential', () => {
    expect(validateEnvironment(integrationEnvironment, 'integrations').ok).toBe(true);
  });

  it('rejects a value in ANTHROPIC_API_KEY that is not an Anthropic key', () => {
    const check = validateEnvironment(
      { ...integrationEnvironment, ANTHROPIC_API_KEY: 'sk-proj-wrong-provider' },
      'integrations',
    );

    expect(check.ok).toBe(false);
    expect(check.invalid).toContain('ANTHROPIC_API_KEY');
  });

  it('rejects a malformed sender address', () => {
    const check = validateEnvironment(
      { ...integrationEnvironment, RESEND_FROM_EMAIL: 'noreply@' },
      'integrations',
    );

    expect(check.ok).toBe(false);
    expect(check.invalid).toContain('RESEND_FROM_EMAIL');
  });

  it('accepts the configured sender address', () => {
    const result = parseIntegrationEnvironment({
      ...integrationEnvironment,
      ANTHROPIC_API_KEY: 'sk-ant-synthetic',
      RESEND_FROM_EMAIL: 'noreply@bizmetria.com',
      RESEND_DELIVERY_MODE: 'send',
    });

    expect(result.RESEND_FROM_EMAIL).toBe('noreply@bizmetria.com');
  });
});
