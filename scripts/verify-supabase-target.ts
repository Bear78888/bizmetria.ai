import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  EXPECTED_SUPABASE_PROJECT_REF,
  failSupabaseTargetVerification,
  SUPABASE_TARGET_ERROR,
  verifySupabaseEnvironmentTarget,
} from '../src/lib/supabase/target.ts';

export { SUPABASE_TARGET_ERROR } from '../src/lib/supabase/target.ts';

type EnvironmentInput = Readonly<Record<string, string | undefined>>;

function readLinkedProjectRef(projectRoot: string): string | undefined {
  const candidates = [
    resolve(projectRoot, 'supabase/.temp/project-ref'),
    resolve(projectRoot, '.supabase/project-ref'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return readFileSync(candidate, 'utf8').trim();
    }
  }

  return undefined;
}

export function verifySupabaseTarget(
  environment: EnvironmentInput = process.env,
  projectRoot = process.cwd(),
): void {
  verifySupabaseEnvironmentTarget(environment);

  const linkedProjectRef = readLinkedProjectRef(projectRoot);
  if (linkedProjectRef && linkedProjectRef !== EXPECTED_SUPABASE_PROJECT_REF) {
    failSupabaseTargetVerification();
  }
}

const executedFile = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : undefined;
if (executedFile === import.meta.url) {
  try {
    verifySupabaseTarget();
  } catch (error) {
    const message = error instanceof Error ? error.message : SUPABASE_TARGET_ERROR;
    console.error(message);
    process.exitCode = 1;
  }
}
