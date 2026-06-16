import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/sanctum/', '/api/'],
      },
    ],
    sitemap: 'https://numina.fun/sitemap.xml',
  };
}
