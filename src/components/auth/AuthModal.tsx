'use client';

import { useEffect, useRef, useState } from 'react';

import { signIn, signInWithGoogle, signUp } from '@/app/[locale]/auth/actions';

interface AuthModalProps {
  readonly locale: 'en' | 'es';
  readonly triggerLabel: string;
}

const copy = {
  en: {
    registerTitle: 'Try BizMetria for free',
    registerText: 'Create a free account: your score, area breakdown and mini-report in one place.',
    signInTitle: 'Sign in to BizMetria',
    signInText: 'Your score, reports and orders live in one place.',
    email: 'Email',
    password: 'Password',
    signUp: 'Create free account',
    signIn: 'Sign in',
    toSignInLead: 'Already have an account?',
    toSignIn: 'Sign in',
    toRegisterLead: 'New to BizMetria?',
    toRegister: 'Create a free account',
    google: 'Continue with Google',
    or: 'or',
    close: 'Close',
  },
  es: {
    registerTitle: 'Pruebe BizMetria gratis',
    registerText:
      'Cree una cuenta gratuita: su puntuación, desglose por áreas y mini-informe en un solo lugar.',
    signInTitle: 'Inicie sesión en BizMetria',
    signInText: 'Su puntuación, informes y pedidos en un solo lugar.',
    email: 'Correo electrónico',
    password: 'Contraseña',
    signUp: 'Crear cuenta gratuita',
    signIn: 'Iniciar sesión',
    toSignInLead: '¿Ya tiene una cuenta?',
    toSignIn: 'Iniciar sesión',
    toRegisterLead: '¿Nuevo en BizMetria?',
    toRegister: 'Cree una cuenta gratuita',
    google: 'Continuar con Google',
    or: 'o',
    close: 'Cerrar',
  },
} as const;

/**
 * The header's "Try free" entrance: a dialog with registration first,
 * sign-in one tap away, and Google underneath once the provider is enabled
 * (NEXT_PUBLIC_AUTH_GOOGLE=enabled — inlined at build time).
 */
export default function AuthModal({ locale, triggerLabel }: AuthModalProps) {
  const [open, setOpen] = useState(false);
  const [registering, setRegistering] = useState(true);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const text = copy[locale];
  const googleEnabled = process.env.NEXT_PUBLIC_AUTH_GOOGLE === 'enabled';
  const nextPath = `/${locale}/account`;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <button className="nav-signin" type="button" onClick={() => setOpen(true)}>
        {triggerLabel}
      </button>

      {open ? (
        <div
          className="auth-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            aria-label={registering ? text.registerTitle : text.signInTitle}
            aria-modal="true"
            className="auth-modal"
            ref={dialogRef}
            role="dialog"
          >
            <button
              aria-label={text.close}
              className="auth-modal-close"
              type="button"
              onClick={() => setOpen(false)}
            >
              ×
            </button>

            <h2>{registering ? text.registerTitle : text.signInTitle}</h2>
            <p>{registering ? text.registerText : text.signInText}</p>

            <form className="auth-form">
              <input name="locale" type="hidden" value={locale} />
              <input name="next" type="hidden" value={nextPath} />
              <label>
                {text.email}
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label>
                {text.password}
                <input
                  name="password"
                  type="password"
                  autoComplete={registering ? 'new-password' : 'current-password'}
                  minLength={8}
                  maxLength={128}
                  required
                />
              </label>
              <div className="auth-actions">
                {registering ? (
                  <button className="button button-primary" formAction={signUp}>
                    {text.signUp}
                  </button>
                ) : (
                  <button className="button button-primary" formAction={signIn}>
                    {text.signIn}
                  </button>
                )}
              </div>
            </form>

            {googleEnabled ? (
              <>
                <div className="auth-provider-divider">{text.or}</div>
                <form action={signInWithGoogle}>
                  <input name="locale" type="hidden" value={locale} />
                  <input name="next" type="hidden" value={nextPath} />
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
                    {text.google}
                  </button>
                </form>
              </>
            ) : null}

            <p className="auth-mode-toggle">
              {registering ? (
                <>
                  {text.toSignInLead}{' '}
                  <button type="button" onClick={() => setRegistering(false)}>
                    {text.toSignIn}
                  </button>
                </>
              ) : (
                <>
                  {text.toRegisterLead}{' '}
                  <button type="button" onClick={() => setRegistering(true)}>
                    {text.toRegister}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
