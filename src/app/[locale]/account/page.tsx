import { notFound, redirect } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import { signOut } from '../auth/actions';

interface AccountPageProps {
  readonly params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale: localeParameter } = await params;

  if (!isLocale(localeParameter)) {
    notFound();
  }

  const locale = localeParameter;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth`);
  }

  const isSpanish = locale === 'es';

  return (
    <section className="account-shell">
      <div className="account-card">
        <p className="eyebrow">Sandbox Account</p>
        <h1>{isSpanish ? 'Tu cuenta' : 'Your account'}</h1>
        <p>
          {isSpanish
            ? 'La evaluación y los informes se añadirán en las siguientes etapas.'
            : 'Assessment and report access will be added in the next stages.'}
        </p>
        <dl className="account-details">
          <div>
            <dt>Email</dt>
            <dd>{user.email ?? '—'}</dd>
          </div>
          <div>
            <dt>{isSpanish ? 'Estado' : 'Status'}</dt>
            <dd>{isSpanish ? 'Cuenta sandbox' : 'Sandbox account'}</dd>
          </div>
        </dl>
        <form action={signOut}>
          <input name="locale" type="hidden" value={locale} />
          <button className="button button-secondary" type="submit">
            {isSpanish ? 'Cerrar sesión' : 'Sign out'}
          </button>
        </form>
      </div>
    </section>
  );
}
