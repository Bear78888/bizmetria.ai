import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter, Schibsted_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';

import { CANONICAL_SITE_URL } from '@/lib/site';

import './globals.css';

// The three voices of the design system (design brief §1): display for
// headlines, body for prose, mono for anything measured — scores, prices,
// counters. Loaded as CSS variables so the stylesheet owns usage.
const display = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-display',
});
const body = Inter({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-body' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['500'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_SITE_URL),
  title: {
    default: 'AI Opportunity Score for Your Business — Free 11-Question Check | BizMetria',
    template: '%s | BizMetria',
  },
  description:
    'Answer 11 questions, get a deterministic 0–100 AI Opportunity Score and up to 3 priority areas. Free, bilingual (English & Español), no credit card.',
  applicationName: 'BizMetria',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
