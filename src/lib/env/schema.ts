import { z } from 'zod';

import { resolveExpectedSupabaseProjectRef } from '../supabase/target';

export const expectedEnvironmentNames = [
  'OPENAI_API_KEY',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'RETELL_API_KEY',
  'RESEND_API_KEY',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SECRET_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_PROJECT_REF',
] as const;

export const browserEnvironmentNames = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
] as const;

export const serverOnlyEnvironmentNames = [
  'OPENAI_API_KEY',
  'STRIPE_SECRET_KEY',
  'RETELL_API_KEY',
  'RESEND_API_KEY',
  'SUPABASE_SECRET_KEY',
] as const;

const rootSupabaseUrl = z
  .url({ error: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL' })
  .superRefine((value, context) => {
    let url: URL;

    try {
      url = new URL(value);
    } catch {
      return;
    }

    const isLocal = url.hostname === '127.0.0.1' || url.hostname === 'localhost';
    const isHostedProject =
      url.protocol === 'https:' && /^[a-z0-9-]+\.supabase\.co$/u.test(url.hostname.toLowerCase());
    const isRoot = url.pathname === '/' && url.search === '' && url.hash === '';

    if ((!isLocal && !isHostedProject) || !isRoot) {
      context.addIssue({
        code: 'custom',
        message:
          'NEXT_PUBLIC_SUPABASE_URL must be the root project URL without /rest/v1 or another path',
      });
    }
  });

const optionalRootAppUrl = z.url({ error: 'NEXT_PUBLIC_APP_URL must be a valid URL' }).optional();

const publicSupabaseSchema = z.object({
  NEXT_PUBLIC_APP_URL: optionalRootAppUrl,
  NEXT_PUBLIC_SUPABASE_URL: rootSupabaseUrl,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required'),
});

export const browserEnvironmentSchema = publicSupabaseSchema.extend({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .startsWith('pk_test_', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be a test key')
    .optional(),
});

// The canonical production project is always accepted. A registered isolated
// preview/development project is accepted only when SUPABASE_TARGET_ENV=preview
// is set, so production (which never sets that flag) stays pinned to canonical.
function refineSupabaseProjectRef(
  value: { SUPABASE_PROJECT_REF: string; SUPABASE_TARGET_ENV?: 'preview' | undefined },
  context: z.RefinementCtx,
): void {
  const expectedRef = resolveExpectedSupabaseProjectRef(value);
  if (value.SUPABASE_PROJECT_REF !== expectedRef) {
    context.addIssue({
      code: 'custom',
      path: ['SUPABASE_PROJECT_REF'],
      message: `SUPABASE_PROJECT_REF must be ${expectedRef}`,
    });
  }
}

const platformEnvironmentObject = publicSupabaseSchema.extend({
  SUPABASE_PROJECT_REF: z.string().min(1, 'SUPABASE_PROJECT_REF is required'),
  SUPABASE_SECRET_KEY: z.string().min(1, 'SUPABASE_SECRET_KEY is required'),
  SUPABASE_TARGET_ENV: z.literal('preview').optional(),
});

const integrationEnvironmentObject = platformEnvironmentObject.extend({
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  STRIPE_SECRET_KEY: z
    .string()
    .startsWith('sk_test_', 'STRIPE_SECRET_KEY must be a Stripe test key'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .startsWith('pk_test_', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be a Stripe test key'),
  RETELL_API_KEY: z.string().min(1, 'RETELL_API_KEY is required'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
});

export const platformEnvironmentSchema =
  platformEnvironmentObject.superRefine(refineSupabaseProjectRef);

export const integrationEnvironmentSchema =
  integrationEnvironmentObject.superRefine(refineSupabaseProjectRef);

export type BrowserEnvironment = z.infer<typeof browserEnvironmentSchema>;
export type PlatformEnvironment = z.infer<typeof platformEnvironmentSchema>;
export type IntegrationEnvironment = z.infer<typeof integrationEnvironmentSchema>;

export type EnvironmentScope = 'browser' | 'platform' | 'integrations';

export interface EnvironmentCheck {
  readonly ok: boolean;
  readonly missing: readonly string[];
  readonly invalid: readonly string[];
}

type EnvironmentInput = Readonly<Record<string, string | undefined>>;

function schemaForScope(scope: EnvironmentScope) {
  if (scope === 'browser') {
    return browserEnvironmentSchema;
  }

  if (scope === 'integrations') {
    return integrationEnvironmentSchema;
  }

  return platformEnvironmentSchema;
}

function issueVariableName(path: PropertyKey[]): string {
  const firstPathSegment = path[0];
  return typeof firstPathSegment === 'string' ? firstPathSegment : 'UNKNOWN_ENVIRONMENT_VARIABLE';
}

export function validateEnvironment(
  input: EnvironmentInput,
  scope: EnvironmentScope = 'platform',
): EnvironmentCheck {
  const result = schemaForScope(scope).safeParse(input);

  if (result.success) {
    return { ok: true, missing: [], invalid: [] };
  }

  const missing = new Set<string>();
  const invalid = new Set<string>();

  for (const issue of result.error.issues) {
    const variableName = issueVariableName(issue.path);
    const value = input[variableName];

    if (value === undefined || value === '') {
      missing.add(variableName);
    } else {
      invalid.add(variableName);
    }
  }

  return {
    ok: false,
    missing: [...missing].sort(),
    invalid: [...invalid].sort(),
  };
}

export class EnvironmentValidationError extends Error {
  readonly missing: readonly string[];
  readonly invalid: readonly string[];

  constructor(check: EnvironmentCheck) {
    const names = [...check.missing, ...check.invalid].sort();
    super(`Environment validation failed: ${names.join(', ')}`);
    this.name = 'EnvironmentValidationError';
    this.missing = check.missing;
    this.invalid = check.invalid;
  }
}

export function parseBrowserEnvironment(input: EnvironmentInput): BrowserEnvironment {
  const check = validateEnvironment(input, 'browser');
  if (!check.ok) {
    throw new EnvironmentValidationError(check);
  }

  return browserEnvironmentSchema.parse(input);
}

export function parsePlatformEnvironment(input: EnvironmentInput): PlatformEnvironment {
  const check = validateEnvironment(input, 'platform');
  if (!check.ok) {
    throw new EnvironmentValidationError(check);
  }

  return platformEnvironmentSchema.parse(input);
}

export function parseIntegrationEnvironment(input: EnvironmentInput): IntegrationEnvironment {
  const check = validateEnvironment(input, 'integrations');
  if (!check.ok) {
    throw new EnvironmentValidationError(check);
  }

  return integrationEnvironmentSchema.parse(input);
}
