import { slugify, estimateReadingTime } from '@/lib/articles'
import { extractEmbeddedSeo, publicExcerpt } from '@/lib/seo-sanitize'
import type { Game } from '@/lib/types'

export type ParsedMarkdownMeta = {
  title: string
  slug: string
  excerpt: string
  seoTitle: string
  seoDescription: string
  tags: string[]
  game: Game
  category: string
  readingTime: string
  /** Body without the leading H1 (keeps page title unique) */
  body: string
}

export type { ExtractedSeo } from '@/lib/seo-sanitize'
export { extractEmbeddedSeo, publicExcerpt } from '@/lib/seo-sanitize'

function stripMd(text: string) {
  return text
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[#>*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function detectGame(text: string): Game {
  const t = text.toLowerCase()
  if (/\bbgmi\b|\bbgms\b|\bbattlegrounds mobile india\b/.test(t)) return 'BGMI'
  if (/\bfree\s*fire\b|\bff\b|\bgarena\b/.test(t)) return 'Free Fire'
  if (/\bplayer\b|\bign\b|\broster\b|\bmvp\b/.test(t)) return 'Player Story'
  return 'Player Story'
}

function detectCategory(text: string, title: string): string {
  const t = `${title} ${text}`.toLowerCase()
  if (/standings|result|champion|final|winner|mvp/.test(t)) return 'Tournaments'
  if (/roster|transfer|signed|released/.test(t)) return 'Teams'
  if (/guide|settings|tips|how to/.test(t)) return 'Guides'
  if (/update|patch|nerf|buff/.test(t)) return 'Updates'
  if (/player|mvp/.test(t)) return 'Players'
  return 'News'
}

function extractTags(title: string, body: string, game: Game): string[] {
  const blob = `${title}\n${body}`
  const tags = new Set<string>([game, 'India', 'Esports'])
  const patterns: Array<[RegExp, string]> = [
    [/\bbgms\b/i, 'BGMS'],
    [/\bbgmi\b/i, 'BGMI'],
    [/\bfree\s*fire\b/i, 'Free Fire'],
    [/\bmvp\b/i, 'MVP'],
    [/\bnebula\s*esports\b/i, 'Nebula Esports'],
    [/\bgladiators\b/i, 'Gladiators'],
    [/\btournament\b/i, 'Tournament'],
    [/\bchampionship\b/i, 'Championship'],
    [/\bindia\b/i, 'India'],
  ]
  for (const [re, tag] of patterns) {
    if (re.test(blob)) tags.add(tag)
  }
  const names = blob.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}\b/g) ?? []
  for (const n of names.slice(0, 8)) {
    if (n.length > 3 && !['The', 'And', 'With', 'From', 'After'].includes(n)) {
      tags.add(n)
    }
  }
  return Array.from(tags).slice(0, 12)
}

/** Parse pasted markdown into title / slug / SEO / body for one-paste publishing. */
export function parseMarkdownForPublish(markdown: string): ParsedMarkdownMeta {
  const raw = markdown.replace(/\r\n/g, '\n').trim()
  const embedded = extractEmbeddedSeo(raw)
  const lines = embedded.cleaned.split('\n')

  let title = ''
  let bodyStart = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const h1 = line.match(/^#\s+(.+)$/)
    if (h1) {
      title = stripMd(h1[1])
      bodyStart = i + 1
      break
    }
  }

  if (!title) {
    for (let i = 0; i < Math.min(lines.length, 12); i++) {
      const line = lines[i].trim()
      if (!line || line.startsWith('```') || line.startsWith('|') || line.startsWith('-')) continue
      const bold = line.match(/^\*\*(.+)\*\*$/)
      title = stripMd(bold?.[1] ?? line)
      bodyStart = i + 1
      break
    }
  }

  if (!title) title = 'Untitled Indian eSports Express story'

  const body = lines.slice(bodyStart).join('\n').replace(/^\n+/, '')
  const bodyClean = extractEmbeddedSeo(body).cleaned
  const plain = stripMd(bodyClean)
  const excerpt =
    plain
      .split(/(?<=[.!?])\s+/)
      .slice(0, 2)
      .join(' ')
      .slice(0, 220) || plain.slice(0, 160)

  const game = detectGame(`${title}\n${bodyClean}`)
  const category = detectCategory(bodyClean, title)
  const tags = extractTags(title, bodyClean, game)
  const slug = slugify(title) || `story-${Date.now()}`

  const seoTitle = embedded.seoTitle || `${title} | Indian eSports Express`
  const seoDescription =
    embedded.seoDescription ||
    (excerpt.length > 20
      ? excerpt
      : `${title} — latest Indian esports coverage on Indian eSports Express for BGMI, Free Fire and competitive gaming.`)

  return {
    title: title.slice(0, 140),
    slug,
    excerpt: publicExcerpt(excerpt).slice(0, 300),
    seoTitle: seoTitle.slice(0, 70),
    seoDescription: seoDescription.slice(0, 160),
    tags,
    game,
    category,
    readingTime: estimateReadingTime(bodyClean || raw),
    body: bodyClean || embedded.cleaned || raw,
  }
}

export function siteUrl() {
  const fallback = 'https://indianesportsexpress.in'

  // Local GEO audits: prefer DEV URL so canonical matches the browser origin
  if (process.env.NODE_ENV === 'development') {
    const dev = process.env.NEXT_PUBLIC_DEV_URL?.trim().replace(/\/$/, '')
    if (dev && !/\s/.test(dev)) {
      try {
        return new URL(dev).origin
      } catch {
        /* fall through */
      }
    }
    const localSite = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')
    if (localSite && /localhost|127\.0\.0\.1/.test(localSite)) {
      try {
        return new URL(localSite).origin
      } catch {
        /* fall through */
      }
    }
    return 'http://localhost:3000'
  }

  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')
  if (raw && !/\s/.test(raw)) {
    try {
      return new URL(raw).origin
    } catch {
      /* fall through */
    }
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}`
  }
  return fallback
}
