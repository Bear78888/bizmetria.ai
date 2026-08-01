import type { MetadataRoute } from 'next';

import { locales } from '@/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => [
    {
      url: `https://bizmetria.ai/${locale}`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `https://bizmetria.ai/${locale}/assessment`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]);
}
