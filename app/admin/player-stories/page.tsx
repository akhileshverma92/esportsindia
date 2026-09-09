import { ArticlesTable } from '@/components/admin/articles-table'
import { getAdminArticles } from '@/lib/queries'

export default async function PlayerStoriesAdminPage() {
  const articles = await getAdminArticles()
  return <ArticlesTable articles={articles} mode="player-story" />
}
