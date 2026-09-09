import type { Metadata } from 'next'
import IndianEsportsExpressApp from '@/components/indian-esports-express-app'
import { getPublishedArticles } from '@/lib/queries'
import { toCardArticle } from '@/lib/articles'
import { buildPageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug?: string[] }> }

const PAGE_SEO: Record<string, { title: string; description: string; keywords?: string[] }> = {
  '/': {
    title: 'Indian eSports Express — India’s Esports News Hub',
    description:
      'English coverage of BGMI, Free Fire, Indian tournaments, players and esports news. Latest results, standings and stories from India.',
    keywords: [
      'Indian eSports Express',
      'BGMI news',
      'Free Fire India',
      'Indian esports',
      'esports news India',
      'BGMS results',
      'mobile esports India',
    ],
  },
  '/bgmi': {
    title: 'BGMI News, Results & Tournaments',
    description:
      'Latest BGMI news India — BGMS results, roster moves, patch notes and tournament standings in English.',
    keywords: ['BGMI', 'BGMS', 'BGMI news India', 'BGMI results', 'BGMI tournaments', 'Battlegrounds Mobile India'],
  },
  '/free-fire': {
    title: 'Free Fire India News & Esports',
    description:
      'Free Fire India esports news, tournament updates, competitive results and community stories in English.',
    keywords: ['Free Fire India', 'Free Fire esports', 'FF India news', 'Garena Free Fire India'],
  },
  '/esports': {
    title: 'Player Stories',
    description: 'Player features and stories from Indian esports — now at /player-story.',
    keywords: ['player stories', 'Indian esports players'],
  },
  '/player-story': {
    title: 'Player Stories — Indian Esports Profiles',
    description:
      'Faces behind the fight — in-depth player features and profiles from India’s BGMI and Free Fire scene.',
    keywords: ['player stories', 'BGMI players', 'Free Fire players', 'Indian esports', 'pro player profiles'],
  },
  '/tournaments': {
    title: 'Esports Tournaments in India',
    description: 'Tournament coverage, fixtures and finals from India’s competitive esports calendar.',
    keywords: ['esports tournaments India', 'BGMI tournaments', 'Free Fire tournaments'],
  },
  '/players': {
    title: 'Players',
    description: 'Player profiles coming soon on Indian eSports Express.',
  },
  '/teams': {
    title: 'Esports Teams',
    description: 'Team pages coming soon on Indian eSports Express.',
  },
  '/guides': {
    title: 'BGMI & Free Fire Guides',
    description: 'Practical BGMI and Free Fire guides, sensitivity settings and tips for competitive play in India.',
    keywords: ['BGMI guides', 'Free Fire settings', 'esports tips India', 'BGMI sensitivity'],
  },
  '/about': {
    title: 'About Indian eSports Express',
    description:
      'Indian eSports Express is an independent English-language esports publication covering Indian competitive gaming.',
    keywords: ['about Indian eSports Express', 'esports media India'],
  },
  '/contact': {
    title: 'Contact Indian eSports Express',
    description: 'Contact the Indian eSports Express editorial and partnerships desk for tips, press and collabs.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'How Indian eSports Express handles reader data, analytics and contact information in India.',
  },
  '/terms': {
    title: 'Terms of Use',
    description: 'Terms for using Indian eSports Express content, branding and website services.',
  },
  '/search': {
    title: 'Search Indian eSports News',
    description: 'Search Indian eSports Express for BGMI, Free Fire, players, teams and tournament stories.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const path = slug?.length ? `/${slug.join('/')}` : '/'

  if (path.startsWith('/articles/')) {
    return {}
  }

  const seo = PAGE_SEO[path] || {
    title: 'Indian eSports Express',
    description: 'India’s esports news hub for BGMI, Free Fire and competitive gaming.',
  }

  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path,
    keywords: seo.keywords,
  })
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params
  const initialPath = slug?.length ? `/${slug.join('/')}` : '/'

  if (initialPath.startsWith('/admin')) {
    return <IndianEsportsExpressApp initialPath={initialPath} />
  }

  if (initialPath.startsWith('/articles/')) {
    return <IndianEsportsExpressApp initialPath={initialPath} />
  }

  const published = await getPublishedArticles()
  const cards = published.map(toCardArticle)
  return <IndianEsportsExpressApp initialPath={initialPath} dynamicArticles={cards} />
}
