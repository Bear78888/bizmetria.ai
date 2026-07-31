import { describe, expect, it } from 'vitest';

import {
  EnvironmentValidationError,
  parseIntegrationEnvironment,
  parsePlatformEnvironment,
  validateEnvironment,
} from '../../src/lib/env/schema';

const platformEnvironment = {
  NEXT_PUBLIC_APP_URL: 'https://preview.bizmetria.example',
  NEXT_PUBLIC_SUPABASE_URL: 'https://abcdefghijklmnopqrst.supabase.co',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_synthetic',
  SUPABASE_SECRET_KEY: 'sb_secret_synthetic',
};

describe('environment validation', () => {
  it('accepts a hosted Supabase root project URL', () => {
    expect(validateEnvironment(platformEnvironment, 'platform')).toEqual({
      ok: true,
      missing: [],
      invalid: [],
    });
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
        NEXT_PUBLIC_SUPABASE_URL: 'https://abcdefghijklmnopqrst.supabase.co/rest/v1/',
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
        OPENAI_API_KEY: 'synthetic-openai-key',
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
        OPENAI_API_KEY: 'synthetic-openai-key',
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
});
