import type { MetadataRoute } from 'next';

import { locales } from '@/i18n/config';
import { canonicalPath } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => [
    {
      url: canonicalPath(`/${locale}`),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: canonicalPath(`/${locale}/assessment`),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]);
}
