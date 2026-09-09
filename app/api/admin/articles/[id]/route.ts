import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { estimateReadingTime, slugify, toDbGame } from '@/lib/articles'
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
  if (!stripped && /schema cache|could not find.*column/i.test(errorMessage)) {
    for (const col of OPTIONAL_COLUMNS) delete payload[col]
    stripped = true
  }
  return stripped
}

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, ctx: Ctx) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = (await request.json()) as Partial<ArticleInput>
  const patch: Record<string, unknown> = {}

  if (body.title !== undefined) patch.title = body.title.trim()
  if (body.slug !== undefined) patch.slug = slugify(body.slug)
  if (body.excerpt !== undefined) patch.excerpt = body.excerpt
  if (body.content !== undefined) {
    patch.content = body.content
    patch.reading_time = body.reading_time || estimateReadingTime(body.content)
  }
  if (body.image !== undefined) patch.image = body.image
  if (body.game !== undefined) patch.game = toDbGame(body.game)
  if (body.category !== undefined) patch.category = body.category
  if (body.author !== undefined) patch.author = body.author
  if (body.tags !== undefined) patch.tags = body.tags
  if (body.source_name !== undefined) patch.source_name = body.source_name
  if (body.source_url !== undefined) patch.source_url = body.source_url
  if (body.seo_title !== undefined) patch.seo_title = body.seo_title
  if (body.seo_description !== undefined) patch.seo_description = body.seo_description
  if (body.seo_keywords !== undefined) patch.seo_keywords = body.seo_keywords
  if (body.is_featured !== undefined) patch.is_featured = Boolean(body.is_featured)
  if (body.is_trending !== undefined) patch.is_trending = Boolean(body.is_trending)
  if (body.status !== undefined) {
    patch.status = body.status
    if (body.status === 'published') {
      patch.published_at = body.published_at || new Date().toISOString()
    }
  }

  let { data, error } = await supabase.from('articles').update(patch).eq('id', id).select('*').single()

  for (let i = 0; i < 3 && error; i++) {
    if (!stripMissingColumns(patch, error.message)) break
    ;({ data, error } = await supabase.from('articles').update(patch).eq('id', id).select('*').single())
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
  return NextResponse.json({ article: data })
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
