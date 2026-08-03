import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense, type ReactNode } from 'react';

import AuthModal from '@/components/auth/AuthModal';
import LocaleSwitch from '@/components/LocaleSwitch';
import ChatWidget from '@/features/chatbot/ChatWidget';
import { isLocale, locales } from '@/i18n/config';
import { getHomeContent } from '@/i18n/home';
import { getMessages } from '@/i18n/messages';

interface LocaleLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const es = locale === 'es';
  return {
    title: es
      ? 'Puntuación de oportunidad de IA para su negocio — chequeo gratuito de 11 preguntas | BizMetria'
      : 'AI Opportunity Score for Your Business — Free 11-Question Check | BizMetria',
    description: es
      ? 'Responda 11 preguntas y obtenga una puntuación determinista de 0 a 100 y hasta 3 áreas prioritarias. Gratis, bilingüe (English y Español), sin tarjeta.'
      : 'Answer 11 questions, get a deterministic 0–100 AI Opportunity Score and up to 3 priority areas. Free, bilingual (English & Español), no credit card.',
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', es: '/es', 'x-default': '/en' },
    },
    openGraph: {
      title: es
        ? 'BizMetria — puntuación de oportunidad de IA'
        : 'BizMetria — AI Opportunity Score',
      description: es
        ? 'Mida dónde la IA realmente rendiría en su negocio.'
        : 'Measure where AI would actually pay off in your business.',
      locale: es ? 'es_US' : 'en_US',
      siteName: 'BizMetria',
      type: 'website',
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParameter } = await params;

  if (!isLocale(localeParameter)) {
    notFound();
  }

  const locale = localeParameter;
  const messages = getMessages(locale);
  const footer = getHomeContent(locale).footer;
  const alternateLocale = locale === 'en' ? 'es' : 'en';

  return (
    <div lang={locale} className="site-shell">
      <header className="site-header">
        <Link className="brand" href={`/${locale}`}>
          BizMetria<span>.ai</span>
        </Link>
        <nav aria-label={messages.navigation.ariaLabel}>
          <Link className="nav-secondary" href={`/${locale}`}>
            {messages.navigation.home}
          </Link>
          <Link className="nav-secondary" href={`/${locale}/assessment`}>
            {messages.navigation.assessment}
          </Link>
          <Link href={`/${locale}/auth`}>{messages.navigation.signIn}</Link>
          <AuthModal locale={locale} triggerLabel={messages.navigation.tryFree} />
          <Suspense
            fallback={
              <Link className="language-link" href={`/${alternateLocale}`}>
                {messages.navigation.language}
              </Link>
            }
          >
            <LocaleSwitch
              className="language-link"
              label={messages.navigation.language}
              targetLocale={alternateLocale}
            />
          </Suspense>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <p>{footer.about}</p>
        <p>{footer.contact}</p>
        <div className="footer-meta">
          <span className="mono-label">{footer.rights}</span>
          <Link href={`/${locale}/privacy`}>
            {locale === 'es' ? 'Política de privacidad' : 'Privacy Policy'}
          </Link>
          <Link href={`/${locale}/terms`}>
            {locale === 'es' ? 'Términos del servicio' : 'Terms of Service'}
          </Link>
          <Suspense
            fallback={
              <Link className="language-link" href={`/${alternateLocale}`}>
                {footer.language}
              </Link>
            }
          >
            <LocaleSwitch
              className="language-link"
              label={footer.language}
              targetLocale={alternateLocale}
            />
          </Suspense>
        </div>
      </footer>
      <ChatWidget locale={locale} />
    </div>
  );
}
