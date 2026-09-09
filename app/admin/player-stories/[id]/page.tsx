import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArticleEditor } from '@/components/admin/article-editor'
import { isPlayerStory } from '@/lib/articles'
import type { Article } from '@/lib/types'

type Props = { params: Promise<{ id: string }> }

export default async function EditPlayerStoryPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).maybeSingle()
  if (error || !data) notFound()

  const article = data as Article
  if (!isPlayerStory(article.game) && article.category !== 'Players') notFound()

  return (
    <ArticleEditor
      article={article}
      defaultGame="Player Story"
      lockGame
      returnTo="/admin/player-stories"
      titleLabel="Edit player story"
    />
  )
}
