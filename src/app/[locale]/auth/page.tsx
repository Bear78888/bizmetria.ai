import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';

import { signIn, signUp } from './actions';

interface AuthPageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ error?: string; message?: string }>;
}

const copy = {
  en: {
    title: 'Access your assessment',
    description: 'Use a sandbox account. Live customer access is not enabled.',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign in',
    signUp: 'Create account',
    checkEmail: 'Check your email to confirm the sandbox account.',
    error: 'Authentication could not be completed. Check the details and try again.',
  },
  es: {
    title: 'Accede a tu evaluación',
    description: 'Usa una cuenta sandbox. El acceso para clientes reales no está habilitado.',
    email: 'Correo electrónico',
    password: 'Contraseña',
    signIn: 'Iniciar sesión',
    signUp: 'Crear cuenta',
    checkEmail: 'Revisa tu correo para confirmar la cuenta sandbox.',
    error: 'No se pudo completar la autenticación. Revisa los datos e inténtalo de nuevo.',
  },
} as const;

export default async function AuthPage({ params, searchParams }: AuthPageProps) {
  const { locale: localeParameter } = await params;
  const query = await searchParams;

  if (!isLocale(localeParameter)) {
    notFound();
  }

  const locale = localeParameter;
  const messages = copy[locale];

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Sandbox Auth</p>
        <h1>{messages.title}</h1>
        <p>{messages.description}</p>
        {query.message === 'check_email' ? (
          <p className="form-message">{messages.checkEmail}</p>
        ) : null}
        {query.error ? (
          <p className="form-message form-message-error" role="alert">
            {messages.error}
          </p>
        ) : null}
        <form className="auth-form">
          <input name="locale" type="hidden" value={locale} />
          <label>
            {messages.email}
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            {messages.password}
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={8}
              maxLength={128}
              required
            />
          </label>
          <div className="auth-actions">
            <button className="button button-primary" formAction={signIn}>
              {messages.signIn}
            </button>
            <button className="button button-secondary" formAction={signUp}>
              {messages.signUp}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
