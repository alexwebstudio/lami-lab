import { legalPages, siteUrl } from '@/data/site';

export default function sitemap() {
  const lastModified = new Date();

  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    ...legalPages.map((page) => ({
      url: `${siteUrl}${page.href}`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    })),
  ];
}
