import type { MetadataRoute } from 'next';

import { canonicalPath } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/en/account', '/es/account'],
    },
    sitemap: canonicalPath('/sitemap.xml'),
  };
}
