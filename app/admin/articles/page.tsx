import { getAdminArticles } from '@/lib/queries'
import { ArticlesTable } from '@/components/admin/articles-table'

export default async function AdminArticlesPage() {
  let articles: Awaited<ReturnType<typeof getAdminArticles>> = []
  let error: string | null = null
  try {
    articles = await getAdminArticles()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load articles'
  }

  return (
    <div>
      {error && (
        <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>
      )}
      <ArticlesTable articles={articles} />
    </div>
  )
}
