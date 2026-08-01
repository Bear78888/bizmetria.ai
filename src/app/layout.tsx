import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { CANONICAL_SITE_URL } from '@/lib/site';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_SITE_URL),
  title: {
    default: 'BizMetria.ai',
    template: '%s | BizMetria.ai',
  },
  description: 'Bilingual AI opportunity assessment for businesses.',
  applicationName: 'BizMetria.ai',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
