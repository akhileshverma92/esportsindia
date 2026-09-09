import { slugify } from '@/lib/articles'
import { createClient } from '@/lib/supabase/server'
import {
  buildTemplateBio,
  parsePlayerFromSources,
  type ParsedAchievement,
} from '@/lib/player-parser'

export type PlayerSource = {
  name: string
  url: string
}

export type PlayerAchievement = {
  tournament: string
  position: string
  tier?: string | null
}

export type PlayerProfile = {
  name: string
  real_name: string | null
  game: string | null
  country: string | null
  current_team: string | null
  status: string | null
  years_active: string | null
  aliases: string[]
  role: string | null
  total_earnings: string | null
  top_achievements: PlayerAchievement[]
  teams: string[]
  short_bio: string | null
  sources: PlayerSource[]
  last_updated: string
  needs_verification?: string[]
  field_sources?: Record<string, string>
  extraction?: 'rules' | 'rules+ai'
}

export type RelatedNewsItem = {
  id: string
  slug: string
  title: string
  excerpt: string
  publishedAt: string
}

export type PlayerFindResponse = {
  query: string
  slug: string
  profile: PlayerProfile
  news: RelatedNewsItem[]
  cached: boolean
  cacheExpiresAt: string | null
}

type CollectedSource = {
  title: string
  url: string
  description: string
  markdown: string
}

const CACHE_HOURS = 24

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'Source'
  }
}

function sourcePriority(url: string) {
  if (/liquipedia\.net/i.test(url)) return 0
  if (/esportscharts|esc\.gg/i.test(url)) return 1
  if (/timesofindia|indianexpress|hindustantimes/i.test(url)) return 2
  return 3
}

/** Search only — no full-page scrape yet (cheaper / less junk). */
async function searchUrls(playerName: string): Promise<{ title: string; url: string; description: string }[]> {
  const key = process.env.FIRECRAWL_API_KEY
  if (!key) throw new Error('FIRECRAWL_API_KEY is not set')

  const res = await fetch('https://api.firecrawl.dev/v1/search', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `"${playerName}" esports OR BGMI OR "PUBG Mobile" player`,
      limit: 6,
      location: 'India',
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Firecrawl search failed (${res.status}): ${text.slice(0, 300)}`)
  }

  const json = await res.json()
  const items = Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json?.data?.web)
      ? json.data.web
      : []

  return items
    .map((item: { title?: string; url?: string; description?: string }) => ({
      title: String(item.title || '').trim(),
      url: String(item.url || '').trim(),
      description: String(item.description || '').trim(),
    }))
    .filter((item: { url: string }) => item.url)
    .sort((a: { url: string }, b: { url: string }) => sourcePriority(a.url) - sourcePriority(b.url))
}

async function scrapeMarkdown(url: string): Promise<string> {
  const key = process.env.FIRECRAWL_API_KEY
  if (!key) throw new Error('FIRECRAWL_API_KEY is not set')

  const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['markdown'],
      onlyMainContent: true,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Firecrawl scrape failed (${res.status}): ${text.slice(0, 200)}`)
  }

  const json = await res.json()
  return String(json?.data?.markdown || json?.markdown || '').trim()
}

/**
 * Collect a few best sources. Prefer Liquipedia scrape; skip dumping every page.
 */
async function collectSources(playerName: string): Promise<CollectedSource[]> {
  const hits = await searchUrls(playerName)
  if (!hits.length) throw new Error('No web sources found for that player')

  const liqui = hits.find((h) => /liquipedia\.net/i.test(h.url))
  const extras = hits.filter((h) => h.url !== liqui?.url).slice(0, 2)
  const toScrape = [liqui, ...extras].filter(Boolean) as typeof hits

  const collected: CollectedSource[] = []

  for (const hit of toScrape) {
    try {
      const markdown = await scrapeMarkdown(hit.url)
      collected.push({
        title: hit.title,
        url: hit.url,
        description: hit.description,
        markdown: markdown || hit.description,
      })
    } catch (err) {
      console.error('scrape failed', hit.url, err)
      collected.push({
        title: hit.title,
        url: hit.url,
        description: hit.description,
        markdown: hit.description,
      })
    }
  }

  return collected
}

function toProfile(
  query: string,
  collected: CollectedSource[],
  parsed: ReturnType<typeof parsePlayerFromSources>
): PlayerProfile {
  const sources: PlayerSource[] = collected.map((c) => ({
    name: hostname(c.url),
    url: c.url,
  }))

  const name = parsed.name || query
  const short_bio = buildTemplateBio({
    name,
    real_name: parsed.real_name,
    game: parsed.game,
    country: parsed.country,
    current_team: parsed.current_team,
  })

  const top_achievements: PlayerAchievement[] = parsed.top_achievements.map((a: ParsedAchievement) => ({
    tournament: a.tournament,
    position: a.position,
    tier: a.tier ?? null,
  }))

  return {
    name,
    real_name: parsed.real_name,
    game: parsed.game,
    country: parsed.country,
    current_team: parsed.current_team,
    status: parsed.status,
    years_active: parsed.years_active,
    aliases: parsed.aliases,
    role: parsed.role,
    total_earnings: parsed.total_earnings,
    top_achievements,
    teams: parsed.teams,
    short_bio,
    sources,
    last_updated: new Date().toISOString().slice(0, 10),
    needs_verification: parsed.needs_verification,
    field_sources: parsed.field_sources,
    extraction: 'rules',
  }
}

async function getRelatedNews(playerName: string, aliases: string[]): Promise<RelatedNewsItem[]> {
  try {
    const supabase = await createClient()
    const terms = [playerName, ...aliases].map((t) => t.trim()).filter(Boolean).slice(0, 4)
    if (!terms.length) return []

    const orFilter = terms
      .flatMap((t) => [`title.ilike.%${t}%`, `excerpt.ilike.%${t}%`])
      .join(',')

    const { data, error } = await supabase
      .from('articles')
      .select('id, slug, title, excerpt, published_at')
      .eq('status', 'published')
      .or(orFilter)
      .order('published_at', { ascending: false })
      .limit(6)

    if (error) {
      console.error('getRelatedNews', error.message)
      return []
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt || '',
      publishedAt: row.published_at
        ? new Date(row.published_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : '',
    }))
  } catch (err) {
    console.error('getRelatedNews', err)
    return []
  }
}

async function readCache(slug: string): Promise<{ profile: PlayerProfile; expiresAt: string } | null> {
  try {
    const supabase = await createClient()
    const { data: player, error } = await supabase.from('players').select('id').eq('slug', slug).maybeSingle()
    if (error || !player) return null

    const { data: cache, error: cacheError } = await supabase
      .from('player_cache')
      .select('profile_json, expires_at')
      .eq('player_id', player.id)
      .maybeSingle()

    if (cacheError || !cache) return null
    if (new Date(cache.expires_at).getTime() <= Date.now()) return null

    const profile = cache.profile_json as PlayerProfile
    if (!profile?.name) return null
    return { profile, expiresAt: cache.expires_at }
  } catch {
    return null
  }
}

async function writeCache(slug: string, profile: PlayerProfile) {
  try {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + CACHE_HOURS * 60 * 60 * 1000).toISOString()

    const { data: existing } = await supabase.from('players').select('id').eq('slug', slug).maybeSingle()
    let playerId = existing?.id as string | undefined

    if (playerId) {
      await supabase
        .from('players')
        .update({ name: profile.name, aliases: profile.aliases, game: profile.game })
        .eq('id', playerId)
    } else {
      const { data: inserted, error } = await supabase
        .from('players')
        .insert({ slug, name: profile.name, aliases: profile.aliases, game: profile.game })
        .select('id')
        .single()
      if (error || !inserted) {
        console.error('writeCache player insert', error?.message)
        return null
      }
      playerId = inserted.id
    }

    const { error: upsertError } = await supabase.from('player_cache').upsert(
      {
        player_id: playerId,
        profile_json: profile,
        sources: profile.sources,
        last_updated: new Date().toISOString(),
        expires_at: expiresAt,
      },
      { onConflict: 'player_id' }
    )

    if (upsertError) {
      console.error('writeCache upsert', upsertError.message)
      return null
    }
    return expiresAt
  } catch (err) {
    console.error('writeCache', err)
    return null
  }
}

export async function findPlayerProfile(
  playerName: string,
  options?: { forceRefresh?: boolean }
): Promise<PlayerFindResponse> {
  const name = playerName.trim().slice(0, 80)
  if (name.length < 2) throw new Error('Enter a player name (at least 2 characters)')

  const slug = slugify(name) || `player-${Date.now()}`

  if (!options?.forceRefresh) {
    const cached = await readCache(slug)
    if (cached) {
      const news = await getRelatedNews(cached.profile.name, cached.profile.aliases)
      return {
        query: name,
        slug,
        profile: cached.profile,
        news,
        cached: true,
        cacheExpiresAt: cached.expiresAt,
      }
    }
  }

  const collected = await collectSources(name)
  const parsed = parsePlayerFromSources(name, collected)
  const profile = toProfile(name, collected, parsed)

  // Soft fail if almost empty — still return something useful
  const hasFacts =
    profile.real_name ||
    profile.current_team ||
    profile.total_earnings ||
    profile.top_achievements.length > 0 ||
    profile.country

  if (!hasFacts) {
    throw new Error(
      'Could not extract a player profile from web sources. Try a Liquipedia-known IGN (e.g. ScoutOP).'
    )
  }

  const expiresAt = await writeCache(slug, profile)
  const news = await getRelatedNews(profile.name, profile.aliases)

  return {
    query: name,
    slug,
    profile,
    news,
    cached: false,
    cacheExpiresAt: expiresAt,
  }
}
