import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArticleEditor } from '@/components/admin/article-editor'
import type { Article } from '@/lib/types'

type Props = { params: Promise<{ id: string }> }

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).maybeSingle()
  if (error || !data) notFound()
  return <ArticleEditor article={data as Article} />
}
