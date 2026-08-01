import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { isLocale, locales } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';

interface LocaleLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParameter } = await params;

  if (!isLocale(localeParameter)) {
    notFound();
  }

  const locale = localeParameter;
  const messages = getMessages(locale);
  const alternateLocale = locale === 'en' ? 'es' : 'en';

  return (
    <div lang={locale} className="site-shell">
      <header className="site-header">
        <Link className="brand" href={`/${locale}`}>
          BizMetria<span>.ai</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href={`/${locale}`}>{messages.navigation.home}</Link>
          <Link href={`/${locale}/account`}>{messages.navigation.account}</Link>
          <Link href={`/${locale}/auth`}>{messages.navigation.signIn}</Link>
          <Link className="language-link" href={`/${alternateLocale}`}>
            {messages.navigation.language}
          </Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">{messages.footer}</footer>
    </div>
  );
}
