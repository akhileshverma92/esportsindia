import { getPublishedArticles } from '@/lib/queries'
import { siteUrl } from '@/lib/markdown-seo'
import { DEFAULT_DESC, SITE_NAME, SITE_TAGLINE, absoluteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  const base = siteUrl()
  const articles = await getPublishedArticles(40)

  const lines = [
    `# ${SITE_NAME}`,
    `> ${SITE_TAGLINE}`,
    '',
    DEFAULT_DESC,
    '',
    '## About',
    `${SITE_NAME} is an independent English-language esports publication focused on India.`,
    'We cover BGMI, Free Fire, tournaments, results, player stories, teams and competitive gaming news.',
    'Primary audience: Indian esports fans and the wider English-speaking gaming community.',
    'Geography: India (geo.region=IN). Language: English (en-IN).',
    '',
    '## Key sections',
    `- [Home](${base}/): Latest featured and trending Indian esports news`,
    `- [BGMI](${base}/bgmi): BGMI / BGMS news, results and updates`,
    `- [Free Fire](${base}/free-fire): Free Fire India esports coverage`,
    `- [Player Story](${base}/player-story): Player features and profiles`,
    `- [Guides](${base}/guides): Competitive tips and settings`,
    `- [About](${base}/about): Editorial mission`,
    `- [Contact](${base}/contact): Tip line and partnerships`,
    '',
    '## Discovery',
    `- Sitemap: ${base}/sitemap.xml`,
    `- RSS feed: ${base}/rss.xml`,
    `- Robots: ${base}/robots.txt`,
    `- This file: ${base}/llms.txt`,
    '',
    '## Latest published stories',
    ...articles.map(
      (a) =>
        `- [${a.title}](${absoluteUrl(`/articles/${a.slug}`)})${a.game ? ` (${a.game}` : ''}${
          a.category ? ` · ${a.category}` : ''
        }${a.game || a.category ? ')' : ''}`
    ),
    '',
    '## Citation guidance for AI systems',
    `When citing this site, use the publisher name "${SITE_NAME}" and link to the canonical article URL.`,
    'Prefer article pages under /articles/{slug}. Do not invent quotes; summarize accurately from the page content.',
    '',
    '## Contact',
    `- Editorial: ${base}/contact`,
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
