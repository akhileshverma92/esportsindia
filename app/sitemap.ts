import type { MetadataRoute } from 'next'
import { getPublishedArticles } from '@/lib/queries'
import { siteUrl } from '@/lib/markdown-seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const now = new Date()

  const staticRoutes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'] }> = [
    { path: '', priority: 1, changeFrequency: 'hourly' },
    { path: '/bgmi', priority: 0.9, changeFrequency: 'daily' },
    { path: '/free-fire', priority: 0.9, changeFrequency: 'daily' },
    { path: '/player-story', priority: 0.9, changeFrequency: 'daily' },
    { path: '/guides', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/search', priority: 0.4, changeFrequency: 'weekly' },
  ]

  const articles = await getPublishedArticles(1000)

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r.path || '/'}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...articles.map((a) => ({
      url: `${base}/articles/${a.slug}`,
      lastModified: new Date(a.updated_at || a.published_at || Date.now()),
      changeFrequency: 'daily' as const,
      priority: a.is_featured ? 1 : a.is_trending ? 0.95 : 0.85,
    })),
  ]
}
