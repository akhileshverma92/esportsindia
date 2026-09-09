import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import IndianEsportsExpressApp from '@/components/indian-esports-express-app'
import { getArticleBySlug, getPublishedArticles } from '@/lib/queries'
import { resolveArticleSeo, toCardArticle } from '@/lib/articles'
import { breadcrumbJsonLd, buildPageMetadata, newsArticleJsonLd } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) {
    return buildPageMetadata({
      title: 'Article not found',
      description: 'This Indian eSports Express story could not be found.',
      path: `/articles/${slug}`,
      noIndex: true,
    })
  }

  const seo = resolveArticleSeo(article)
  const keywords = [
    ...(article.seo_keywords || []),
    ...(article.tags || []),
    article.game,
    article.category,
    'India',
    'esports news',
    'Indian eSports Express',
  ].filter(Boolean)

  return buildPageMetadata({
    title: seo.seoTitle,
    description: seo.seoDescription,
    path: `/articles/${article.slug}`,
    image: article.image,
    keywords: Array.from(new Set(keywords)),
    type: 'article',
    publishedTime: article.published_at,
    modifiedTime: article.updated_at,
    authors: [article.author],
  })
}

export default async function ArticleBySlugPage({ params }: Props) {
  const { slug } = await params
  const [article, published] = await Promise.all([getArticleBySlug(slug), getPublishedArticles()])
  if (!article) notFound()

  const seo = resolveArticleSeo(article)
  const card = toCardArticle(article)
  const cards = published.map(toCardArticle)
  const articleDetail = {
    ...card,
    excerpt: seo.excerpt,
    content: seo.content,
    sourceName: article.source_name,
    sourceUrl: article.source_url,
  }

  const jsonLd = newsArticleJsonLd({
    title: article.title,
    description: seo.seoDescription,
    slug: article.slug,
    image: article.image,
    author: article.author,
    publishedAt: article.published_at,
    updatedAt: article.updated_at,
    tags: article.tags,
    category: article.category,
    game: article.game,
    sourceName: article.source_name,
    sourceUrl: article.source_url,
  })

  const crumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: article.game || 'News', path: `/${(article.game || 'news').toLowerCase().replace(/\s+/g, '-')}` },
    { name: article.title, path: `/articles/${article.slug}` },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <IndianEsportsExpressApp
        initialPath={`/articles/${slug}`}
        dynamicArticles={cards}
        articleDetail={articleDetail}
      />
    </>
  )
}
