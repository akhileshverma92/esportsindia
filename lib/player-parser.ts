/**
 * Deterministic player extraction from Firecrawl markdown.
 * No OpenAI/Gemini required.
 */

export type ParsedAchievement = {
  tournament: string
  position: string
  tier?: string | null
}

export type ParsedPlayerFields = {
  name: string | null
  real_name: string | null
  game: string | null
  country: string | null
  current_team: string | null
  status: string | null
  years_active: string | null
  aliases: string[]
  role: string | null
  total_earnings: string | null
  teams: string[]
  top_achievements: ParsedAchievement[]
  field_sources: Record<string, string>
  needs_verification: string[]
}

const KEEP_SECTION_RE =
  /player\s*information|biography|history|achievements|awards|results|team\s*history|earnings|overview|infobox/i

const DROP_SECTION_RE =
  /navigation|contents|see\s*also|external\s*links|references|related|interview|faq|video|social|footer|advertisement|media|gallery|recent\s*news|latest\s*news|comments/i

const FIELD_ALIASES: Record<string, keyof Omit<ParsedPlayerFields, 'aliases' | 'teams' | 'top_achievements' | 'field_sources' | 'needs_verification'>> = {
  name: 'name',
  'romanized name': 'real_name',
  'romanised name': 'real_name',
  'real name': 'real_name',
  'birth name': 'real_name',
  nationality: 'country',
  country: 'country',
  status: 'status',
  'years active': 'years_active',
  'approx. total winnings': 'total_earnings',
  'approx total winnings': 'total_earnings',
  'total winnings': 'total_earnings',
  earnings: 'total_earnings',
  team: 'current_team',
  'current team': 'current_team',
  role: 'role',
  position: 'role',
  game: 'game',
  'main game': 'game',
}

function cleanValue(raw: string): string | null {
  let v = raw
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]\([^)]*\)/g, (m) => {
      const label = m.match(/^\[([^\]]*)\]/)?.[1]?.trim() || ''
      return label && !/^https?:/i.test(label) ? label : ''
    })
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[*_`#]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!v || /^null$/i.test(v) || /^n\/?a$/i.test(v) || v === '-' || v === '—') return null
  return v
}

/** Keep only useful wiki sections; drop nav/ads/related junk. */
export function extractRelevantSections(markdown: string): string {
  if (!markdown?.trim()) return ''

  // Normalize headings
  let text = markdown
    .replace(/\r\n/g, '\n')
    .replace(/([^\n])(#{1,3}\s+)/g, '$1\n$2')

  const parts = text.split(/\n(?=#{1,3}\s+)/)
  const kept: string[] = []

  for (const part of parts) {
    const heading = part.match(/^#{1,3}\s+([^\n]+)/)?.[1]?.trim() || ''
    const isFirstChunk = kept.length === 0 && !heading

    if (isFirstChunk) {
      // Keep opening/infobox chunk (often has Player Information fields)
      kept.push(part.slice(0, 8000))
      continue
    }

    if (DROP_SECTION_RE.test(heading) && !KEEP_SECTION_RE.test(heading)) continue
    if (KEEP_SECTION_RE.test(heading) || /information|history|achievement|award|result|team/i.test(heading)) {
      kept.push(part.slice(0, 12000))
    }
  }

  // Fallback: if section split failed, keep first ~10k chars after stripping link spam
  if (kept.length <= 1 && text.length > 2000) {
    return text
      .replace(/\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\)/g, '')
      .replace(/\((https?:\/\/[^)\s]+)\)/g, '')
      .slice(0, 12000)
  }

  return kept.join('\n\n').slice(0, 20000)
}

function setField(
  out: ParsedPlayerFields,
  key: keyof ParsedPlayerFields,
  value: string | null,
  source: string
) {
  if (!value) return
  if (key === 'aliases' || key === 'teams' || key === 'top_achievements' || key === 'field_sources' || key === 'needs_verification') {
    return
  }

  const current = out[key] as string | null
  if (!current) {
    ;(out as Record<string, unknown>)[key] = value
    out.field_sources[key] = source
    return
  }

  if (current.toLowerCase() !== value.toLowerCase()) {
    if (!out.needs_verification.includes(key)) out.needs_verification.push(key)
    // Prefer Liquipedia when already set from it; otherwise keep first
    if (/liquipedia/i.test(source) && !/liquipedia/i.test(out.field_sources[key] || '')) {
      ;(out as Record<string, unknown>)[key] = value
      out.field_sources[key] = source
    }
  }
}

function parseLabeledFields(text: string, source: string, out: ParsedPlayerFields) {
  // Patterns like "Romanized Name:\nTanmay Singh" or "Status: Active"
  const labelRe =
    /(?:^|\n)\s*(?:#{1,6}\s*)?(Name|Romanized Name|Romanised Name|Real Name|Birth Name|Nationality|Country|Status|Years Active|Team|Current Team|Alternate IDs?|Also known as|Aliases?|Approx\.?\s*Total Winnings|Total Winnings|Earnings|Role|Position|Game|Main Game)\s*[:：]\s*([^\n]+)/gi

  let m: RegExpExecArray | null
  while ((m = labelRe.exec(text))) {
    const label = m[1].trim().toLowerCase()
    const value = cleanValue(m[2])
    if (!value) continue

    if (/alternate|alias|also known/i.test(label)) {
      const parts = value.split(/[,;/|]+/).map((s) => s.trim()).filter(Boolean)
      for (const a of parts) {
        if (!out.aliases.includes(a)) out.aliases.push(a)
      }
      if (parts.length) out.field_sources.aliases = source
      continue
    }

    const mapped = FIELD_ALIASES[label]
    if (mapped) {
      if (mapped === 'name' && /[^\u0000-\u00ff]/.test(value)) continue
      setField(out, mapped, value, source)
    }
  }

  const rowRe =
    /\|\s*(Name|Romanized Name|Romanised Name|Real Name|Nationality|Country|Status|Years Active|Team|Current Team|Alternate IDs?|Approx\.?\s*Total Winnings|Total Winnings|Earnings|Role|Game)\s*\|\s*([^|\n]+)\s*\|/gi
  while ((m = rowRe.exec(text))) {
    const label = m[1].trim().toLowerCase()
    const value = cleanValue(m[2])
    if (!value) continue
    if (/alternate/i.test(label)) {
      const parts = value.split(/[,;/|]+/).map((s) => s.trim()).filter(Boolean)
      for (const a of parts) if (!out.aliases.includes(a)) out.aliases.push(a)
      continue
    }
    const mapped = FIELD_ALIASES[label]
    if (mapped) {
      if (mapped === 'name' && /[^\u0000-\u00ff]/.test(value)) continue
      setField(out, mapped, value, source)
    }
  }
}

function parseTeamHistory(text: string, source: string, out: ParsedPlayerFields) {
  const historyIdx = text.search(/#{1,3}\s*(History|Team History|Teams)\b/i)
  if (historyIdx < 0) return

  const chunk = text.slice(historyIdx, historyIdx + 4000)
  // Common liquipedia history lines: | 2024-01-01 — Present | Quantum Sparks |
  const teamRows = chunk.matchAll(/\|\s*([^|\n]{2,80})\s*\|\s*([^|\n]{2,60})\s*\|/g)
  for (const row of teamRows) {
    const a = cleanValue(row[1])
    const b = cleanValue(row[2])
    if (!a || !b) continue
    if (/join|leave|date|team|period/i.test(a) && /join|leave|date|team|period/i.test(b)) continue

    // Prefer the cell that looks like an org name
    const dateLike = /\d{4}|present|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i
    const team = dateLike.test(a) && !dateLike.test(b) ? b : dateLike.test(b) ? a : b
    if (!team || team.length < 2) continue
    if (/^\d+$/.test(team)) continue
    if (!out.teams.includes(team)) out.teams.push(team)
  }

  if (out.teams.length) {
    out.field_sources.teams = source
    if (!out.current_team) setField(out, 'current_team', out.teams[0], source)
  }
}

function tierScore(tier?: string | null) {
  const t = (tier || '').toLowerCase()
  if (t.includes('s-tier') || t === 's') return 100
  if (t.includes('a-tier') || t === 'a') return 80
  if (t.includes('b-tier') || t === 'b') return 50
  if (t.includes('c-tier') || t === 'c') return 20
  return 10
}

function placeScore(place?: string | null) {
  const p = (place || '').toLowerCase()
  if (/\b1st\b|^1\b|winner|champion/i.test(p)) return 50
  if (/\b2nd\b|^2\b|runner/i.test(p)) return 40
  if (/\b3rd\b|^3\b/i.test(p)) return 30
  if (/\b4th\b|\b5th\b|\b6th\b|\b7th\b|\b8th\b/i.test(p)) return 15
  return 5
}

function parseAchievements(text: string, source: string, out: ParsedPlayerFields) {
  const idx = text.search(/#{1,3}\s*(Achievements|Results|Awards)\b/i)
  const chunk = idx >= 0 ? text.slice(idx, idx + 10000) : text.slice(0, 8000)

  const found: ParsedAchievement[] = []

  // Multiline GFM rows
  const lines = chunk.split('\n').filter((l) => l.includes('|'))
  for (const line of lines) {
    const cells = line
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean)
    if (cells.length < 3) continue
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue
    // Skip true header rows only (labels, not values like "S-Tier")
    if (cells.filter((c) => /^(date|place|tier|type|game|tournament|prize|result)$/i.test(c)).length >= 2) {
      continue
    }

    // Heuristic column mapping for Liquipedia achievements:
    // Date | Place | Tier | Type | Game | Tournament | ...
    let place = ''
    let tier = ''
    let tournament = ''

    for (const c of cells) {
      if (/^(?:\d+(?:st|nd|rd|th)|W|L)$/i.test(c) || /^\d+(?:st|nd|rd|th)$/i.test(c)) place = place || c
      else if (/^[SABC]-?Tier$/i.test(c) || /^[SABC]$/i.test(c)) tier = tier || c
      else if (/showmatch|offline|online|qualifier/i.test(c)) continue
      else if (/bgmi|pubg|free\s*fire|mobile/i.test(c) && c.length < 24) continue
      else if (/\d{4}/.test(c) && c.length < 20) continue
      else if (/^\$/.test(c)) continue
      else if (c.length > 8) tournament = tournament || c
    }

    if (!tournament || tournament.length < 4) continue
    if (/^(date|place|tier|tournament)$/i.test(tournament)) continue

    found.push({
      tournament: cleanValue(tournament) || tournament,
      position: cleanValue(place) || '—',
      tier: cleanValue(tier),
    })
  }

  // Deduplicate by tournament
  const uniq = new Map<string, ParsedAchievement>()
  for (const a of found) {
    const key = a.tournament.toLowerCase()
    if (!uniq.has(key)) uniq.set(key, a)
  }

  const ranked = [...uniq.values()]
    .sort((a, b) => tierScore(b.tier) + placeScore(b.position) - (tierScore(a.tier) + placeScore(a.position)))
    .slice(0, 5)

  if (ranked.length) {
    out.top_achievements = ranked
    out.field_sources.top_achievements = source
  }
}

function inferGame(text: string, url: string, out: ParsedPlayerFields, source: string) {
  if (out.game) return
  const blob = `${text}\n${url}`.toLowerCase()
  if (blob.includes('bgmi') || blob.includes('battlegrounds mobile india')) {
    setField(out, 'game', 'BGMI', source)
  } else if (blob.includes('free fire') || blob.includes('freefire')) {
    setField(out, 'game', 'Free Fire', source)
  } else if (blob.includes('pubgmobile') || blob.includes('pubg mobile')) {
    setField(out, 'game', 'PUBG Mobile', source)
  }
}

function inferNameFromTitle(title: string, query: string, out: ParsedPlayerFields, source: string) {
  if (out.name) return
  const cleaned = title
    .replace(/\s*[—|-]\s*Liquipedia.*$/i, '')
    .replace(/\s*\|\s*.*$/, '')
    .trim()
  if (cleaned && cleaned.length < 40) setField(out, 'name', cleaned, source)
  else if (query) setField(out, 'name', query, source)
}

export function buildTemplateBio(fields: {
  name: string
  real_name: string | null
  game: string | null
  country: string | null
  current_team: string | null
}): string {
  const game = fields.game || 'esports'
  const country = fields.country || 'Indian'
  const knownAs =
    fields.real_name && fields.name
      ? `${fields.real_name}, known as ${fields.name},`
      : fields.name
  const teamBit = fields.current_team
    ? ` currently associated with ${fields.current_team}`
    : ''
  return `${knownAs} is an ${country === 'India' ? 'Indian' : country} ${game} esports player${teamBit}.`.replace(
    /\s+/g,
    ' '
  )
}

export function emptyParsedFields(): ParsedPlayerFields {
  return {
    name: null,
    real_name: null,
    game: null,
    country: null,
    current_team: null,
    status: null,
    years_active: null,
    aliases: [],
    role: null,
    total_earnings: null,
    teams: [],
    top_achievements: [],
    field_sources: {},
    needs_verification: [],
  }
}

export function parsePlayerFromSources(
  query: string,
  sources: { title: string; url: string; markdown: string; description?: string }[]
): ParsedPlayerFields {
  const out = emptyParsedFields()

  // Prefer Liquipedia first
  const ordered = [...sources].sort((a, b) => {
    const score = (u: string) => (/liquipedia\.net/i.test(u) ? 0 : /esportschart|hltv|vlr/i.test(u) ? 1 : 2)
    return score(a.url) - score(b.url)
  })

  for (const src of ordered) {
    const sourceName = (() => {
      try {
        return new URL(src.url).hostname.replace(/^www\./, '')
      } catch {
        return src.title.slice(0, 40) || 'source'
      }
    })()

    const relevant = extractRelevantSections(src.markdown || src.description || '')
    inferNameFromTitle(src.title, query, out, sourceName)
    parseLabeledFields(relevant, sourceName, out)
    parseTeamHistory(relevant, sourceName, out)
    parseAchievements(relevant, sourceName, out)
    inferGame(relevant, src.url, out, sourceName)
  }

  if (!out.name) out.name = query
  out.aliases = out.aliases.filter((a) => a.toLowerCase() !== out.name?.toLowerCase()).slice(0, 6)
  out.teams = out.teams.slice(0, 8)

  return out
}
