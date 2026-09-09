import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/markdown-seo'

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl()

  // Allow major search + AI crawlers for GEO / LLM discoverability
  const aiAgents = [
    'GPTBot',
    'ChatGPT-User',
    'Google-Extended',
    'Googlebot',
    'Googlebot-News',
    'Bingbot',
    'Applebot',
    'Applebot-Extended',
    'ClaudeBot',
    'anthropic-ai',
    'PerplexityBot',
    'Bytespider',
    'CCBot',
    'meta-externalagent',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt', '/rss.xml', '/sitemap.xml'],
        disallow: ['/admin', '/admin/', '/api/', '/api/admin'],
      },
      ...aiAgents.map((userAgent) => ({
        userAgent,
        allow: ['/', '/llms.txt', '/rss.xml', '/articles/', '/bgmi', '/free-fire', '/player-story', '/guides', '/about'],
        disallow: ['/admin', '/api/'],
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
