export type ArticleStatus = 'draft' | 'pending' | 'published' | 'rejected'
export type Game = 'BGMI' | 'Free Fire' | 'Player Story'
/** Legacy DB value still accepted when reading */
export type GameDb = Game | 'Esports'
export type AiModel = 'gemini' | 'openai'
export type AiJobStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'failed'

export type Article = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  image: string | null
  game: Game
  category: string
  author: string
  status: ArticleStatus
  source_name: string | null
  source_url: string | null
  tags: string[]
  reading_time: string | null
  views: number
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  is_featured?: boolean | null
  is_trending?: boolean | null
  created_by: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export type AiJob = {
  id: string
  source_url: string
  source_name: string | null
  raw_content: string | null
  rewritten_title: string | null
  rewritten_excerpt: string | null
  rewritten_content: string | null
  game: string | null
  category: string | null
  tags: string[] | null
  model: AiModel | null
  status: AiJobStatus
  confidence: number | null
  risk: string | null
  error: string | null
  article_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type ArticleInput = {
  title: string
  slug?: string
  excerpt?: string
  content: string
  image?: string
  game?: Game
  category?: string
  author?: string
  status?: ArticleStatus
  source_name?: string
  source_url?: string
  tags?: string[]
  reading_time?: string
  published_at?: string | null
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  is_featured?: boolean
  is_trending?: boolean
}
