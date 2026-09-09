import type { Article, Game } from '@/lib/types'
import { extractEmbeddedSeo, publicExcerpt } from '@/lib/seo-sanitize'

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

export function formatPublishedAt(iso: string | null | undefined) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Normalize DB game values (Esports → Player Story). */
export function normalizeGame(game: string | null | undefined): Game {
  if (game === 'BGMI' || game === 'Free Fire' || game === 'Player Story') return game
  return 'Player Story'
}

/**
 * Map UI game → DB value.
 * Current articles_game_check allows: BGMI | Free Fire | Esports
 * "Player Story" is stored as Esports until the constraint is updated.
 */
export function toDbGame(game: string | null | undefined): 'BGMI' | 'Free Fire' | 'Esports' {
  const g = normalizeGame(game)
  if (g === 'BGMI' || g === 'Free Fire') return g
  return 'Esports'
}

export function isPlayerStory(game: string | null | undefined) {
  return normalizeGame(game) === 'Player Story' || game === 'Esports'
}

export function toCardArticle(article: Article) {
  const title = (article.title?.trim() || 'Untitled').replace(/\s+/g, ' ')

  return {
    id: article.id,
    slug: article.slug,
    title,
    excerpt: publicExcerpt(article.excerpt),
    image: article.image || '/images/hero-esports.png',
    game: normalizeGame(article.game),
    category: article.category,
    author: article.author,
    publishedAt: formatPublishedAt(article.published_at ?? article.created_at),
    readingTime: article.reading_time ?? estimateReadingTime(article.content),
    tags: article.tags ?? [],
    isFeatured: Boolean(article.is_featured),
    isTrending: Boolean(article.is_trending),
  }
}

/** Clean article body + resolve SEO fields for head tags (not UI). */
export function resolveArticleSeo(article: Article) {
  const fromExcerpt = extractEmbeddedSeo(article.excerpt || '')
  const fromContent = extractEmbeddedSeo(article.content || '')
  const seoTitle =
    article.seo_title?.trim() ||
    fromExcerpt.seoTitle ||
    fromContent.seoTitle ||
    article.title
  const seoDescription =
    article.seo_description?.trim() ||
    fromExcerpt.seoDescription ||
    fromContent.seoDescription ||
    publicExcerpt(fromExcerpt.cleaned || article.excerpt) ||
    article.title
  return {
    seoTitle: seoTitle.slice(0, 70),
    seoDescription: seoDescription.slice(0, 160),
    content: fromContent.cleaned,
    excerpt: publicExcerpt(article.excerpt),
  }
}

export function parseJsonObject<T extends Record<string, unknown>>(text: string): T | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = fenced?.[1]?.trim() ?? text.trim()
  try {
    return JSON.parse(raw) as T
  } catch {
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1)) as T
      } catch {
        return null
      }
    }
    return null
  }
}
