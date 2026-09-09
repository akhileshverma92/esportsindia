import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { estimateReadingTime, normalizeGame, slugify, toDbGame } from '@/lib/articles'
import type { ArticleInput } from '@/lib/types'

const OPTIONAL_COLUMNS = [
  'seo_title',
  'seo_description',
  'seo_keywords',
  'is_featured',
  'is_trending',
] as const

function stripMissingColumns(payload: Record<string, unknown>, errorMessage: string) {
  const msg = errorMessage.toLowerCase()
  let stripped = false
  for (const col of OPTIONAL_COLUMNS) {
    if (msg.includes(col.toLowerCase()) && col in payload) {
      delete payload[col]
      stripped = true
    }
  }
  // Broad schema-cache miss: drop all optional fields and retry once
  if (!stripped && /schema cache|could not find.*column/i.test(errorMessage)) {
    for (const col of OPTIONAL_COLUMNS) delete payload[col]
    stripped = true
  }
  return stripped
}

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null as null }
  return { supabase, user }
}

export async function GET() {
  const { supabase, user } = await requireUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ articles: data })
}

export async function POST(request: Request) {
  const { supabase, user } = await requireUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = (await request.json()) as ArticleInput
  if (!body.title?.trim() || !body.content?.trim()) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
  }

  const status = body.status ?? 'draft'
  const slugBase = slugify(body.slug || body.title)
  const slug = slugBase || `article-${Date.now()}`
  const gameUi = normalizeGame(body.game || 'Player Story')
  const game = toDbGame(gameUi)

  const payload: Record<string, unknown> = {
    title: body.title.trim(),
    slug,
    excerpt: body.excerpt?.trim() || null,
    content: body.content.trim(),
    image: body.image || null,
    game,
    category: body.category || (gameUi === 'Player Story' ? 'Players' : 'News'),
    author: body.author || 'Indian eSports Express Editorial',
    status,
    source_name: body.source_name || null,
    source_url: body.source_url || null,
    tags: body.tags || [],
    reading_time: body.reading_time || estimateReadingTime(body.content),
    created_by: user.id,
    published_at: status === 'published' ? body.published_at || new Date().toISOString() : null,
  }

  if (body.seo_title !== undefined) payload.seo_title = body.seo_title || null
  if (body.seo_description !== undefined) payload.seo_description = body.seo_description || null
  if (body.seo_keywords !== undefined) payload.seo_keywords = body.seo_keywords || []
  if (body.is_featured !== undefined) payload.is_featured = Boolean(body.is_featured)
  if (body.is_trending !== undefined) payload.is_trending = Boolean(body.is_trending)

  let { data, error } = await supabase.from('articles').insert(payload).select('*').single()

  // Retry without optional columns if DB schema is behind
  for (let i = 0; i < 3 && error; i++) {
    if (!stripMissingColumns(payload, error.message)) break
    ;({ data, error } = await supabase.from('articles').insert(payload).select('*').single())
  }

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
        hint:
          /seo_|is_featured|is_trending|schema cache/i.test(error.message)
            ? 'Run supabase/ADD_SEO_COLUMNS.sql in the Supabase SQL Editor, then save again.'
            : undefined,
      },
      { status: 500 }
    )
  }
  return NextResponse.json({ article: data }, { status: 201 })
}
