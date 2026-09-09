export type CardArticle = {
  id: string
  slug: string
  title: string
  excerpt: string
  image: string
  game: 'BGMI' | 'Free Fire' | 'Player Story'
  category: string
  author: string
  publishedAt: string
  readingTime: string
  tags: string[]
  isFeatured?: boolean
  isTrending?: boolean
}

export const nav = [
  ['Home', '/'],
  ['BGMI', '/bgmi'],
  ['Free Fire', '/free-fire'],
  ['Player Story', '/player-story'],
  ['Guides', '/guides'],
  ['About', '/about'],
] as const

/** Category options for admin + filters */
export const articleCategories = [
  'News',
  'Tournaments',
  'Updates',
  'Guides',
  'Players',
  'Teams',
  'Results',
  'International',
] as const

export type ArticleCategory = (typeof articleCategories)[number]

/** Legacy filter chips label set */
export const categories = ['All News', 'Player Story', 'Tournaments', 'Updates', 'Guides']

export const gameDescriptions: Record<string, string> = {
  BGMI: "Everything happening in India's biggest mobile esports scene.",
  'Free Fire': 'Latest news, tournaments, updates and stories.',
  'Player Story': 'Features and profiles from India’s competitive scene — built around the cover, not the clutter.',
}

export const footerGroups = [
  { title: 'Games', items: ['BGMI', 'Free Fire', 'Player Story'] },
  { title: 'Explore', items: ['Guides', 'About', 'Contact'] },
  { title: 'Company', items: ['About', 'Contact', 'Privacy', 'Terms'] },
]

export const footerDescription =
  "India's esports news hub for BGMI, Free Fire and competitive gaming."

export const socialLinks = ['Discord', 'YouTube', 'X'] as const

/** Public profile URLs for Organization sameAs (GEO / entity consolidation) */
export const socialProfileUrls = [
  'https://x.com/indianesportsex',
  'https://www.youtube.com/@indianesportsexpress',
  'https://discord.gg/indianesportsexpress',
] as const

export const siteTagline = "India's Esports News Hub"

export const newsletterCopy =
  'Get the sharpest stories in Indian esports, delivered once a week.'

export const aboutSections = [
  {
    title: 'Mission',
    body: 'Independent coverage of Indian esports with clear context and no noise.',
  },
  {
    title: 'Coverage',
    body: 'BGMI, Free Fire, tournaments, players and the competitive scene across India.',
  },
  {
    title: 'Editorial',
    body: 'Stories are reviewed before publish — including AI-assisted drafts.',
  },
]

export const contactEmails = {
  editorial: 'editorial@indianesportsexpress.in',
  business: 'business@indianesportsexpress.in',
  partnerships: 'partners@indianesportsexpress.in',
}

export const siteName = 'Indian eSports Express'
export const siteNameShort = 'IEE'
