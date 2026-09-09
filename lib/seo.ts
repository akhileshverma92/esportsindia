import type { Metadata } from 'next'
import { siteUrl } from '@/lib/markdown-seo'
import { socialProfileUrls } from '@/lib/site'

export const SITE_NAME = 'Indian eSports Express'
export const SITE_TAGLINE = "India's English esports news hub for BGMI, Free Fire and competitive gaming."
export const DEFAULT_DESC =
  'Indian eSports Express covers BGMI, Free Fire, Indian tournaments, player stories, results and esports news in clear English — built for fans, search and AI discovery.'

export const DEFAULT_KEYWORDS = [
  'Indian eSports Express',
  'Indian esports',
  'BGMI news',
  'BGMI results',
  'BGMS',
  'Free Fire India',
  'Free Fire esports',
  'esports news India',
  'Indian esports players',
  'mobile esports India',
  'BGMI tournaments',
  'esports India English',
]

export function absoluteUrl(path = '/') {
  const base = siteUrl()
  if (!path || path === '/') return base
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildPageMetadata(input: {
  title: string
  description?: string
  path?: string
  image?: string | null
  keywords?: string[]
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
  authors?: string[]
  noIndex?: boolean
}): Metadata {
  const title = input.title.includes(SITE_NAME) ? input.title : `${input.title} | ${SITE_NAME}`
  const description = (input.description || DEFAULT_DESC).slice(0, 160)
  const url = absoluteUrl(input.path || '/')
  const image = absoluteUrl(input.image || '/images/logo.png')
  const keywords = input.keywords?.length
    ? Array.from(new Set([...input.keywords, ...DEFAULT_KEYWORDS.slice(0, 6)]))
    : DEFAULT_KEYWORDS

  const openGraph =
    input.type === 'article'
      ? {
          type: 'article' as const,
          locale: 'en_IN',
          alternateLocale: ['en_US'],
          url,
          siteName: SITE_NAME,
          title,
          description,
          images: [{ url: image, width: 1200, height: 630, alt: title }],
          publishedTime: input.publishedTime || undefined,
          modifiedTime: input.modifiedTime || undefined,
          authors: input.authors,
          tags: keywords,
        }
      : {
          type: 'website' as const,
          locale: 'en_IN',
          alternateLocale: ['en_US'],
          url,
          siteName: SITE_NAME,
          title,
          description,
          images: [{ url: image, width: 1200, height: 630, alt: title }],
        }

  return {
    title,
    description,
    keywords,
    authors: (input.authors || [`${SITE_NAME} Editorial`]).map((name) => ({ name })),
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: 'Sports',
    alternates: {
      canonical: url,
      languages: {
        'en-IN': url,
        en: url,
        'x-default': url,
      },
      types: {
        'application/rss+xml': absoluteUrl('/rss.xml'),
      },
    },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large' as const,
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    other: {
      'geo.region': 'IN',
      'geo.placename': 'India',
      'geo.position': '20.5937;78.9629',
      ICBM: '20.5937, 78.9629',
      language: 'English',
      'content-language': 'en-IN',
      'article:section': 'Esports',
      'og:locale:alternate': 'en_US',
    },
  }
}

export function organizationJsonLd() {
  const logo = absoluteUrl('/images/logo.png')
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    '@id': `${absoluteUrl('/')}/#organization`,
    name: SITE_NAME,
    alternateName: ['IEE', 'Indian Esports Express'],
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: logo,
      width: 512,
      height: 512,
    },
    image: logo,
    description: DEFAULT_DESC,
    foundingDate: '2026',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    inLanguage: 'en-IN',
    sameAs: [...socialProfileUrls],
    publishingPrinciples: absoluteUrl('/about'),
    privacyPolicy: absoluteUrl('/privacy'),
    termsOfService: absoluteUrl('/terms'),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial',
      url: absoluteUrl('/contact'),
      availableLanguage: ['English', 'en-IN'],
    },
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${absoluteUrl('/')}/#website`,
    name: SITE_NAME,
    url: absoluteUrl('/'),
    description: SITE_TAGLINE,
    inLanguage: 'en-IN',
    publisher: { '@id': `${absoluteUrl('/')}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl('/search')}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function newsArticleJsonLd(article: {
  title: string
  description: string
  slug: string
  image?: string | null
  author: string
  publishedAt?: string | null
  updatedAt?: string | null
  tags?: string[]
  category?: string
  game?: string
  sourceName?: string | null
  sourceUrl?: string | null
}) {
  const url = absoluteUrl(`/articles/${article.slug}`)
  const image = absoluteUrl(article.image || '/images/logo.png')

  const citations: Array<Record<string, unknown>> = [
    {
      '@type': 'CreativeWork',
      name: `${SITE_NAME} editorial reporting`,
      url,
      publisher: { '@id': `${absoluteUrl('/')}/#organization` },
    },
  ]
  if (article.sourceUrl || article.sourceName) {
    citations.push({
      '@type': 'CreativeWork',
      name: article.sourceName || 'Original source report',
      url: article.sourceUrl || undefined,
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    headline: article.title.slice(0, 110),
    description: article.description,
    image: [image],
    datePublished: article.publishedAt || undefined,
    dateModified: article.updatedAt || article.publishedAt || undefined,
    author: {
      '@type': 'Person',
      name: article.author || `${SITE_NAME} Editorial`,
    },
    publisher: {
      '@id': `${absoluteUrl('/')}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    keywords: (article.tags || []).join(', '),
    inLanguage: 'en-IN',
    isAccessibleForFree: true,
    articleSection: article.category || article.game || 'Esports',
    about: [
      { '@type': 'Thing', name: 'Indian esports' },
      ...(article.game ? [{ '@type': 'Thing', name: article.game }] : []),
    ],
    citation: citations,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '[data-speakable]', 'article p'],
    },
    isPartOf: { '@id': `${absoluteUrl('/')}/#website` },
  }
}
