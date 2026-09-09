import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { estimateReadingTime, slugify, toDbGame } from '@/lib/articles'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: Request, ctx: Ctx) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const action = body.action === 'reject' ? 'reject' : 'approve'

  const { data: job, error } = await supabase.from('ai_jobs').select('*').eq('id', id).single()
  if (error || !job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

  if (action === 'reject') {
    const { data, error: updErr } = await supabase
      .from('ai_jobs')
      .update({ status: 'rejected' })
      .eq('id', id)
      .select('*')
      .single()
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })
    return NextResponse.json({ job: data })
  }

  if (!job.rewritten_title || !job.rewritten_content) {
    return NextResponse.json({ error: 'Job has no rewritten content' }, { status: 400 })
  }

  const slug = slugify(job.rewritten_title) || `ai-story-${Date.now()}`
  const articlePayload = {
    title: job.rewritten_title,
    slug,
    excerpt: job.rewritten_excerpt,
    content: job.rewritten_content,
    image: '/images/hero-esports.png',
    game: toDbGame(job.game || 'Player Story'),
    category: job.category || 'News',
    author: 'Indian eSports Express Editorial',
    status: 'published',
    source_name: job.source_name,
    source_url: job.source_url,
    tags: job.tags || [],
    reading_time: estimateReadingTime(job.rewritten_content),
    created_by: user.id,
    published_at: new Date().toISOString(),
  }

  const { data: article, error: artErr } = await supabase
    .from('articles')
    .insert(articlePayload)
    .select('*')
    .single()

  if (artErr) return NextResponse.json({ error: artErr.message }, { status: 500 })

  const { data: updated, error: jobErr } = await supabase
    .from('ai_jobs')
    .update({ status: 'approved', article_id: article.id })
    .eq('id', id)
    .select('*')
    .single()

  if (jobErr) return NextResponse.json({ error: jobErr.message }, { status: 500 })
  return NextResponse.json({ job: updated, article })
}
