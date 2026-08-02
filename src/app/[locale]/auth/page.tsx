import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import { signIn, signInWithGoogle, signUp } from './actions';

interface AuthPageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
    mode?: string;
  }>;
}

export const dynamic = 'force-dynamic';

const copy = {
  en: {
    eyebrow: 'Account',
    signInTitle: 'Sign in to BizMetria',
    signUpTitle: 'Create your free account',
    signInDescription: 'Your score, reports and orders live in one place.',
    signUpDescription:
      'A free account unlocks your area breakdown, saves your score, and delivers your mini-report by email.',
    email: 'Email',
    password: 'Password',
    passwordNewHint: 'At least 8 characters.',
    signIn: 'Sign in',
    signUp: 'Create account',
    toSignUpLead: 'New to BizMetria?',
    toSignUp: 'Create a free account',
    toSignInLead: 'Already have an account?',
    toSignIn: 'Sign in',
    google: 'Continue with Google',
    or: 'or',
    checkEmail: 'Check your email to confirm your account.',
    error: 'Authentication could not be completed. Check the details and try again.',
    emailNotConfirmed:
      'Your account exists, but the email is not confirmed yet. Open the confirmation link we sent to your inbox (check spam too), then sign in here.',
  },
  es: {
    eyebrow: 'Cuenta',
    signInTitle: 'Inicie sesión en BizMetria',
    signUpTitle: 'Cree su cuenta gratuita',
    signInDescription: 'Su puntuación, informes y pedidos en un solo lugar.',
    signUpDescription:
      'Una cuenta gratuita desbloquea su desglose por áreas, guarda su puntuación y entrega su mini-informe por correo.',
    email: 'Correo electrónico',
    password: 'Contraseña',
    passwordNewHint: 'Mínimo 8 caracteres.',
    signIn: 'Iniciar sesión',
    signUp: 'Crear cuenta',
    toSignUpLead: '¿Nuevo en BizMetria?',
    toSignUp: 'Cree una cuenta gratuita',
    toSignInLead: '¿Ya tiene una cuenta?',
    toSignIn: 'Iniciar sesión',
    google: 'Continuar con Google',
    or: 'o',
    checkEmail: 'Revise su correo para confirmar su cuenta.',
    error: 'No se pudo completar la autenticación. Revise los datos e inténtelo de nuevo.',
    emailNotConfirmed:
      'Su cuenta existe, pero el correo aún no está confirmado. Abra el enlace de confirmación que le enviamos (revise también el spam) y luego inicie sesión aquí.',
  },
} as const;

function modeSwitchHref(
  locale: string,
  mode: 'signin' | 'register',
  next: string | undefined,
): string {
  const params = new URLSearchParams();
  if (mode === 'register') params.set('mode', 'register');
  if (next) params.set('next', next);
  const query = params.toString();
  return `/${locale}/auth${query ? `?${query}` : ''}`;
}

export default async function AuthPage({ params, searchParams }: AuthPageProps) {
  const { locale: localeParameter } = await params;
  const query = await searchParams;

  if (!isLocale(localeParameter)) {
    notFound();
  }

  const locale = localeParameter;
  const messages = copy[locale];
  const registering = query.mode === 'register';

  // A signed-in visitor has nothing to do here; the cabinet is the
  // destination this page exists to reach.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect(query.next ?? `/${locale}/account`);
  }

  const googleEnabled = process.env.NEXT_PUBLIC_AUTH_GOOGLE === 'enabled';

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">{messages.eyebrow}</p>
        <h1>{registering ? messages.signUpTitle : messages.signInTitle}</h1>
        <p>{registering ? messages.signUpDescription : messages.signInDescription}</p>
        {query.message === 'check_email' ? (
          <p className="form-message">{messages.checkEmail}</p>
        ) : null}
        {query.error ? (
          <p className="form-message form-message-error" role="alert">
            {query.error === 'email_not_confirmed' ? messages.emailNotConfirmed : messages.error}
          </p>
        ) : null}

        {googleEnabled ? (
          <>
            <form action={signInWithGoogle}>
              <input name="locale" type="hidden" value={locale} />
              {query.next ? <input name="next" type="hidden" value={query.next} /> : null}
              <button className="auth-google-button" type="submit">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
                  <path
                    d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18Z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.97 10.72a5.41 5.41 0 0 1 0-3.44V4.96H.96a9 9 0 0 0 0 8.08l3.01-2.32Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.96l3.01 2.32C4.68 5.16 6.66 3.58 9 3.58Z"
                    fill="#EA4335"
                  />
                </svg>
                {messages.google}
              </button>
            </form>
            <div className="auth-provider-divider">{messages.or}</div>
          </>
        ) : null}

        <form className="auth-form">
          <input name="locale" type="hidden" value={locale} />
          {query.next ? <input name="next" type="hidden" value={query.next} /> : null}
          <label>
            {messages.email}
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            {messages.password}
            <input
              name="password"
              type="password"
              autoComplete={registering ? 'new-password' : 'current-password'}
              minLength={8}
              maxLength={128}
              required
            />
            {registering ? <small>{messages.passwordNewHint}</small> : null}
          </label>
          <div className="auth-actions">
            {registering ? (
              <button className="button button-primary" formAction={signUp}>
                {messages.signUp}
              </button>
            ) : (
              <button className="button button-primary" formAction={signIn}>
                {messages.signIn}
              </button>
            )}
          </div>
        </form>

        <p className="auth-mode-toggle">
          {registering ? (
            <>
              {messages.toSignInLead}{' '}
              <Link href={modeSwitchHref(locale, 'signin', query.next)}>{messages.toSignIn}</Link>
            </>
          ) : (
            <>
              {messages.toSignUpLead}{' '}
              <Link href={modeSwitchHref(locale, 'register', query.next)}>{messages.toSignUp}</Link>
            </>
          )}
        </p>
      </div>
    </section>
  );
}
