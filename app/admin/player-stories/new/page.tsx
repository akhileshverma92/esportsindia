import { ArticleEditor } from '@/components/admin/article-editor'

export default function NewPlayerStoryPage() {
  return (
    <ArticleEditor
      defaultGame="Player Story"
      lockGame
      returnTo="/admin/player-stories"
      titleLabel="New player story"
    />
  )
}
