export const EXPECTED_SUPABASE_PROJECT_REF = 'rbndiytodvoyiejassnw';
export const EXPECTED_SUPABASE_HOSTNAME = `${EXPECTED_SUPABASE_PROJECT_REF}.supabase.co`;
export const SUPABASE_TARGET_ERROR =
  'Supabase target mismatch. Expected project ref: rbndiytodvoyiejassnw.';

// Explicitly registered isolated, data-less, non-production development/preview
// Supabase projects. A ref listed here is accepted ONLY when the environment
// opts in with SUPABASE_TARGET_ENV=preview. Production never sets that flag, so
// it keeps accepting only the canonical project — listing a ref here therefore
// never relaxes the production guard, and the wrong-project incident refs are
// still refused because they are absent from this list.
export const REGISTERED_PREVIEW_PROJECT_REFS: readonly string[] = Object.freeze([
  'bwmyzkufqrufjimtfwow',
]);

type EnvironmentInput = Readonly<Record<string, string | undefined>>;

export function failSupabaseTargetVerification(): never {
  throw new Error(SUPABASE_TARGET_ERROR);
}

function isRegisteredPreviewTarget(environment: EnvironmentInput): boolean {
  return (
    environment.SUPABASE_TARGET_ENV === 'preview' &&
    typeof environment.SUPABASE_PROJECT_REF === 'string' &&
    REGISTERED_PREVIEW_PROJECT_REFS.includes(environment.SUPABASE_PROJECT_REF)
  );
}

// Single source of truth for which project ref is allowed in the current
// environment. Defaults to the canonical production ref; only an explicit,
// registered preview target overrides it.
export function resolveExpectedSupabaseProjectRef(
  environment: EnvironmentInput = process.env,
): string {
  if (isRegisteredPreviewTarget(environment)) {
    return environment.SUPABASE_PROJECT_REF as string;
  }

  return EXPECTED_SUPABASE_PROJECT_REF;
}

export function verifySupabaseEnvironmentTarget(environment: EnvironmentInput = process.env): void {
  const expectedRef = resolveExpectedSupabaseProjectRef(environment);
  const expectedHostname = `${expectedRef}.supabase.co`;

  if (environment.SUPABASE_PROJECT_REF !== expectedRef) {
    failSupabaseTargetVerification();
  }

  const projectUrl = environment.NEXT_PUBLIC_SUPABASE_URL;
  if (!projectUrl || projectUrl.toLowerCase().includes('/rest/v1/')) {
    failSupabaseTargetVerification();
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(projectUrl);
  } catch {
    failSupabaseTargetVerification();
  }

  if (
    parsedUrl.protocol !== 'https:' ||
    parsedUrl.hostname.toLowerCase() !== expectedHostname ||
    parsedUrl.pathname !== '/' ||
    parsedUrl.search !== '' ||
    parsedUrl.hash !== ''
  ) {
    failSupabaseTargetVerification();
  }
}
