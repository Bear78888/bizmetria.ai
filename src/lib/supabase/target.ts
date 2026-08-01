export const EXPECTED_SUPABASE_PROJECT_REF = 'rbndiytodvoyiejassnw';
export const EXPECTED_SUPABASE_HOSTNAME = `${EXPECTED_SUPABASE_PROJECT_REF}.supabase.co`;
export const SUPABASE_TARGET_ERROR =
  'Supabase target mismatch. Expected project ref: rbndiytodvoyiejassnw.';

type EnvironmentInput = Readonly<Record<string, string | undefined>>;

export function failSupabaseTargetVerification(): never {
  throw new Error(SUPABASE_TARGET_ERROR);
}

export function verifySupabaseEnvironmentTarget(environment: EnvironmentInput = process.env): void {
  if (environment.SUPABASE_PROJECT_REF !== EXPECTED_SUPABASE_PROJECT_REF) {
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
    parsedUrl.hostname.toLowerCase() !== EXPECTED_SUPABASE_HOSTNAME ||
    parsedUrl.pathname !== '/' ||
    parsedUrl.search !== '' ||
    parsedUrl.hash !== ''
  ) {
    failSupabaseTargetVerification();
  }
}
