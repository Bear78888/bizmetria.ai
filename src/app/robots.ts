import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/en/account', '/es/account'],
    },
    sitemap: 'https://bizmetria.ai/sitemap.xml',
  };
}
