import { createClient } from '@/lib/supabase/server'
import type { Article, AiJob } from '@/lib/types'
import { estimateReadingTime } from '@/lib/articles'

export async function getPublishedArticles(limit = 40): Promise<Article[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('getPublishedArticles', error.message)
      return []
    }
    return (data ?? []) as Article[]
  } catch (err) {
    console.error('getPublishedArticles', err)
    return []
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (error) {
      console.error('getArticleBySlug', error.message)
      return null
    }
    return (data as Article) ?? null
  } catch (err) {
    console.error('getArticleBySlug', err)
    return null
  }
}

export async function getAdminArticles(): Promise<Article[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Article[]
}

export async function getAiJobs(): Promise<AiJob[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ai_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return (data ?? []) as AiJob[]
}

export async function getAdminStats() {
  const supabase = await createClient()
  const { data } = await supabase.from('articles').select('status')
  const rows = data ?? []
  const total = rows.length
  const published = rows.filter((r) => r.status === 'published').length
  const pending = rows.filter((r) => r.status === 'pending' || r.status === 'draft').length

  const { count: queueCount } = await supabase
    .from('ai_jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  return [
    { label: 'Articles', value: String(total), detail: 'In workspace' },
    {
      label: 'Published',
      value: String(published),
      detail: total ? `${Math.round((published / total) * 100)}% of total` : '0%',
    },
    { label: 'Pending Review', value: String(pending), detail: 'Needs attention' },
    { label: 'AI Queue', value: String(queueCount ?? 0), detail: 'Awaiting review' },
  ]
}

export { estimateReadingTime }
