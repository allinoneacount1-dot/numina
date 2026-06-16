import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://numina.fun';

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/sanctum`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/pantheon`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/choir`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/aether`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/lore`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];
}
