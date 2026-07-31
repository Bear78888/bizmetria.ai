import type { MetadataRoute } from 'next';

import { locales } from '@/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `https://bizmetria.ai/${locale}`,
    changeFrequency: 'weekly',
    priority: 1,
  }));
}
