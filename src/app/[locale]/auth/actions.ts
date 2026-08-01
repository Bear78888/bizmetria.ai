'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { isLocale, type Locale } from '@/i18n/config';
import { getPlatformEnvironment } from '@/lib/env/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const authInputSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});

function localeFromForm(formData: FormData): Locale {
  const locale = formData.get('locale');
  return typeof locale === 'string' && isLocale(locale) ? locale : 'en';
}

// Same containment rule as /auth/callback: only a same-origin path ever
// becomes a redirect target, so a crafted ?next= cannot send a fresh session
// to another site.
function nextPathFromForm(formData: FormData): string | null {
  const value = formData.get('next');
  if (typeof value !== 'string' || !value) return null;
  try {
    const safeBase = new URL('https://bizmetria.invalid');
    const candidate = new URL(value, safeBase);
    if (candidate.origin === safeBase.origin && candidate.pathname.startsWith('/')) {
      return `${candidate.pathname}${candidate.search}`;
    }
  } catch {
    // Malformed values fall back to the default destination.
  }
  return null;
}

function authInputFromForm(formData: FormData) {
  return authInputSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
}

async function requestOrigin() {
  const configuredAppUrl = getPlatformEnvironment().NEXT_PUBLIC_APP_URL;

  if (configuredAppUrl) {
    return new URL(configuredAppUrl).origin;
  }

  const vercelHost = process.env.VERCEL_URL;

  if (vercelHost && /^[a-z0-9.-]+\.vercel\.app$/iu.test(vercelHost)) {
    return `https://${vercelHost}`;
  }

  const requestHeaders = await headers();
  const requestOriginHeader = requestHeaders.get('origin');

  if (requestOriginHeader) {
    try {
      const originUrl = new URL(requestOriginHeader);
      if (originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1') {
        return originUrl.origin;
      }
    } catch {
      // Invalid request origins never become authentication callback targets.
    }
  }

  return 'http://localhost:3000';
}

export async function signIn(formData: FormData) {
  const locale = localeFromForm(formData);
  const input = authInputFromForm(formData);
  const nextPath = nextPathFromForm(formData);

  if (!input.success) {
    redirect(`/${locale}/auth?error=invalid_input`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(input.data);

  if (error) {
    redirect(`/${locale}/auth?error=sign_in_failed`);
  }

  redirect(nextPath ?? `/${locale}/account`);
}

export async function signUp(formData: FormData) {
  const locale = localeFromForm(formData);
  const input = authInputFromForm(formData);

  if (!input.success) {
    redirect(`/${locale}/auth?error=invalid_input`);
  }

  const supabase = await createSupabaseServerClient();
  const origin = await requestOrigin();
  const nextPath = nextPathFromForm(formData) ?? `/${locale}/account`;
  const { error } = await supabase.auth.signUp({
    ...input.data,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      data: {
        preferred_locale: locale,
      },
    },
  });

  if (error) {
    redirect(`/${locale}/auth?error=sign_up_failed`);
  }

  redirect(`/${locale}/auth?message=check_email`);
}

export async function signOut(formData: FormData) {
  const locale = localeFromForm(formData);
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(`/${locale}`);
}
