import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://bizmetria.ai'),
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
