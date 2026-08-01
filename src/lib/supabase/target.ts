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

// `detail` may only ever carry non-secret identifiers (project refs, hostnames,
// the target-env flag). Without them a mismatch is undiagnosable in a deployed
// environment; with them the message still exposes nothing sensitive.
export function failSupabaseTargetVerification(detail?: string): never {
  throw new Error(detail ? `${SUPABASE_TARGET_ERROR} ${detail}` : SUPABASE_TARGET_ERROR);
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

  const observed = `Received ref: ${environment.SUPABASE_PROJECT_REF ?? '(unset)'}, target env: ${environment.SUPABASE_TARGET_ENV ?? '(unset)'}.`;

  if (environment.SUPABASE_PROJECT_REF !== expectedRef) {
    failSupabaseTargetVerification(observed);
  }

  const projectUrl = environment.NEXT_PUBLIC_SUPABASE_URL;
  if (!projectUrl || projectUrl.toLowerCase().includes('/rest/v1/')) {
    failSupabaseTargetVerification(`${observed} Project URL is missing or not a root URL.`);
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(projectUrl);
  } catch {
    failSupabaseTargetVerification(`${observed} Project URL is not a valid URL.`);
  }

  if (
    parsedUrl.protocol !== 'https:' ||
    parsedUrl.hostname.toLowerCase() !== expectedHostname ||
    parsedUrl.pathname !== '/' ||
    parsedUrl.search !== '' ||
    parsedUrl.hash !== ''
  ) {
    failSupabaseTargetVerification(
      `${observed} Expected host: ${expectedHostname}, received host: ${parsedUrl.hostname}.`,
    );
  }
}
