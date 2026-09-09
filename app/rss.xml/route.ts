import { getPublishedArticles } from '@/lib/queries'
import { siteUrl } from '@/lib/markdown-seo'
import { DEFAULT_DESC, SITE_NAME, absoluteUrl } from '@/lib/seo'
import { publicExcerpt } from '@/lib/seo-sanitize'

export const dynamic = 'force-dynamic'
export const revalidate = 1800

function xmlEscape(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const base = siteUrl()
  const articles = await getPublishedArticles(50)

  const items = articles
    .map((a) => {
      const link = absoluteUrl(`/articles/${a.slug}`)
      const desc = xmlEscape(publicExcerpt(a.seo_description || a.excerpt) || a.title)
      const title = xmlEscape(a.title)
      const pub = a.published_at || a.created_at
      const cat = xmlEscape(a.category || a.game || 'Esports')
      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(pub).toUTCString()}</pubDate>
      <category>${cat}</category>
      <description>${desc}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(SITE_NAME)}</title>
    <link>${base}</link>
    <description>${xmlEscape(DEFAULT_DESC)}</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${absoluteUrl('/images/logo.png')}</url>
      <title>${xmlEscape(SITE_NAME)}</title>
      <link>${base}</link>
    </image>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
    },
  })
}
