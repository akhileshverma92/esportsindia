import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rewriteArticle, scrapeWithFirecrawl } from '@/lib/ai'
import type { AiModel } from '@/lib/types'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('ai_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ jobs: data })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const url = String(body.url || '').trim()
  const model = (body.model === 'openai' ? 'openai' : 'gemini') as AiModel

  if (!url.startsWith('http')) {
    return NextResponse.json({ error: 'A valid news URL is required' }, { status: 400 })
  }

  const { data: job, error: insertError } = await supabase
    .from('ai_jobs')
    .insert({
      source_url: url,
      model,
      status: 'processing',
      created_by: user.id,
    })
    .select('*')
    .single()

  if (insertError || !job) {
    return NextResponse.json({ error: insertError?.message || 'Failed to create job' }, { status: 500 })
  }

  try {
    const scraped = await scrapeWithFirecrawl(url)
    const rewritten = await rewriteArticle(scraped.markdown, url, model)

    const { data: updated, error: updateError } = await supabase
      .from('ai_jobs')
      .update({
        status: 'pending',
        source_name: rewritten.source_name || scraped.title || new URL(url).hostname,
        raw_content: scraped.markdown.slice(0, 100000),
        rewritten_title: rewritten.title,
        rewritten_excerpt: rewritten.excerpt,
        rewritten_content: rewritten.content,
        game: rewritten.game,
        category: rewritten.category,
        tags: rewritten.tags,
        confidence: 0.9,
        risk: 'Low',
      })
      .eq('id', job.id)
      .select('*')
      .single()

    if (updateError) throw new Error(updateError.message)
    return NextResponse.json({ job: updated })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Rewrite failed'
    await supabase
      .from('ai_jobs')
      .update({ status: 'failed', error: message })
      .eq('id', job.id)

    return NextResponse.json({ error: message, jobId: job.id }, { status: 500 })
  }
}
