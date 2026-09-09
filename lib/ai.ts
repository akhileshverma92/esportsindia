import { parseJsonObject } from '@/lib/articles'

export type RewriteResult = {
  title: string
  excerpt: string
  content: string
  game: 'BGMI' | 'Free Fire' | 'Player Story'
  category: string
  tags: string[]
  source_name?: string
}

const SYSTEM_PROMPT = `You are an editor for Indian eSports Express, India's esports news hub (BGMI, Free Fire, Indian esports).
Rewrite the source material into an ORIGINAL article — do not copy sentences verbatim.
Return ONLY valid JSON with keys:
title, excerpt, content, game, category, tags, source_name
- game must be one of: BGMI, Free Fire, Player Story
- content should be Markdown (## headings, paragraphs, lists, **bold**, > blockquotes for key quotes). Use blank lines between paragraphs. Aim for 3-8 sections.
- GEO / AI-citation style:
  - Open the article with 1-2 sentences that directly answer who/what/why (definition style: "X is…" or a clear takeaway).
  - Prefer some ## headings as natural questions readers ask (e.g. "Who is …?", "What happened in …?", "Why does this matter?").
  - Include at least one short quoted line as a Markdown blockquote when the source has a notable claim or quote.
  - Include a final ## Sources section listing the original outlet name (and URL if known).
- tags: array of short strings
- excerpt: 1-2 sentences of plain summary for readers — NEVER include labels like "SEO Title" or "Meta Description" in excerpt or content`

export async function scrapeWithFirecrawl(url: string) {
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
    throw new Error(`Firecrawl failed (${res.status}): ${text.slice(0, 300)}`)
  }

  const json = await res.json()
  const markdown =
    json?.data?.markdown ||
    json?.markdown ||
    json?.data?.content ||
    ''

  if (!markdown || typeof markdown !== 'string') {
    throw new Error('Firecrawl returned no content')
  }

  const title = json?.data?.metadata?.title || json?.data?.metadata?.ogTitle || null
  return { markdown, title: title as string | null }
}

async function rewriteWithGemini(source: string, sourceUrl: string): Promise<RewriteResult> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY is not set')

  // Use a free Gemini Flash-family model by default; user can override with GEMINI_MODEL in env.
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nSource URL: ${sourceUrl}\n\nSource content:\n${source.slice(0, 50000)}`,
              },
            ],
          },
        ],
        generationConfig: { temperature: 0.6, responseMimeType: 'application/json' },
      }),
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gemini failed (${res.status}): ${text.slice(0, 300)}`)
  }

  const json = await res.json()
  const text = json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join('') ?? ''
  return normalizeRewrite(text)
}

async function rewriteWithOpenAI(source: string, sourceUrl: string): Promise<RewriteResult> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY is not set')

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.6,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Source URL: ${sourceUrl}\n\nSource content:\n${source.slice(0, 50000)}` },
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenAI failed (${res.status}): ${text.slice(0, 300)}`)
  }

  const json = await res.json()
  const text = json?.choices?.[0]?.message?.content ?? ''
  return normalizeRewrite(text)
}

function normalizeRewrite(text: string): RewriteResult {
  const parsed = parseJsonObject<Record<string, unknown>>(text)
  if (!parsed) throw new Error('Model did not return valid JSON')

  const gameRaw = String(parsed.game || 'Player Story')
  const game =
    gameRaw === 'BGMI' || gameRaw === 'Free Fire' || gameRaw === 'Player Story'
      ? gameRaw
      : gameRaw === 'Esports'
        ? 'Player Story'
        : 'Player Story'

  const tags = Array.isArray(parsed.tags)
    ? parsed.tags.map(String).slice(0, 8)
    : String(parsed.tags || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 8)

  return {
    title: String(parsed.title || 'Untitled story').trim(),
    excerpt: String(parsed.excerpt || '').trim(),
    content: String(parsed.content || '').trim(),
    game,
    category: String(parsed.category || 'News').trim(),
    tags,
    source_name: parsed.source_name ? String(parsed.source_name) : undefined,
  }
}

export async function rewriteArticle(
  source: string,
  sourceUrl: string,
  model: 'gemini' | 'openai'
) {
  if (model === 'gemini') return rewriteWithGemini(source, sourceUrl)
  return rewriteWithOpenAI(source, sourceUrl)
}
