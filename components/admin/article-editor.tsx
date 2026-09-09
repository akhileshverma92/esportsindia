'use client'

import { FormEvent, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Article, ArticleStatus, Game } from '@/lib/types'
import { normalizeGame } from '@/lib/articles'
import { articleCategories } from '@/lib/site'
import { MarkdownEditor } from '@/components/admin/markdown-editor'
import { CoverImageField } from '@/components/admin/cover-image-field'
import { parseMarkdownForPublish } from '@/lib/markdown-seo'

const games: Game[] = ['BGMI', 'Free Fire', 'Player Story']
const statuses: ArticleStatus[] = ['draft', 'pending', 'published', 'rejected']

type Props = {
  article?: Article
  /** Default game for new stories */
  defaultGame?: Game
  /** Lock game field (e.g. Player Story workspace) */
  lockGame?: boolean
  /** Where to return after save */
  returnTo?: string
  titleLabel?: string
}

export function ArticleEditor({
  article,
  defaultGame = 'BGMI',
  lockGame = false,
  returnTo = '/admin/articles',
  titleLabel,
}: Props) {
  const router = useRouter()
  const slugTouched = useRef(Boolean(article?.slug))
  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '')
  const [content, setContent] = useState(article?.content ?? '')
  const [image, setImage] = useState(article?.image ?? '/images/hero-esports.png')
  const [game, setGame] = useState<Game>(article ? normalizeGame(article.game) : defaultGame)
  const [category, setCategory] = useState(
    article?.category ?? (defaultGame === 'Player Story' ? 'Players' : 'News')
  )
  const [author, setAuthor] = useState(article?.author ?? 'Indian eSports Express Editorial')
  const [status, setStatus] = useState<ArticleStatus>(article?.status ?? 'draft')
  const [sourceName, setSourceName] = useState(article?.source_name ?? '')
  const [sourceUrl, setSourceUrl] = useState(article?.source_url ?? '')
  const [tags, setTags] = useState((article?.tags ?? []).join(', '))
  const [seoTitle, setSeoTitle] = useState(article?.seo_title ?? '')
  const [seoDescription, setSeoDescription] = useState(article?.seo_description ?? '')
  const [isFeatured, setIsFeatured] = useState(Boolean(article?.is_featured))
  const [isTrending, setIsTrending] = useState(Boolean(article?.is_trending))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [autofillNote, setAutofillNote] = useState<string | null>(null)

  const heading = titleLabel || (article ? 'Edit article' : 'New article')
  const isPlayerStory = game === 'Player Story'
  const categoryOptions = Array.from(
    new Set([
      ...articleCategories,
      ...(category && !articleCategories.includes(category as (typeof articleCategories)[number])
        ? [category]
        : []),
    ])
  )

  function applyMarkdownMeta(md: string, { force = false } = {}) {
    if (!md.trim()) return
    const parsed = parseMarkdownForPublish(md)
    if (force || !title.trim()) setTitle(parsed.title)
    if (force || !slugTouched.current || !slug.trim()) {
      setSlug(parsed.slug)
      slugTouched.current = false
    }
    if (force || !excerpt.trim()) setExcerpt(parsed.excerpt)
    if (force || !seoTitle.trim()) setSeoTitle(parsed.seoTitle)
    if (force || !seoDescription.trim()) setSeoDescription(parsed.seoDescription)
    if (force || !tags.trim()) setTags(parsed.tags.join(', '))
    if (force || !article) {
      if (!lockGame) setGame(parsed.game)
      setCategory(lockGame || defaultGame === 'Player Story' ? 'Players' : parsed.category)
    }
    if (force || !article) setContent(parsed.body)
    setAutofillNote(
      `Auto-filled: title, slug, SEO, tags, ${lockGame ? game : parsed.game} / ${parsed.category}`
    )
  }

  function onContentChange(next: string) {
    const wasEmpty = !content.trim()
    setContent(next)
    if (wasEmpty && next.trim().length > 40) {
      applyMarkdownMeta(next, { force: !article })
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const meta = content.trim() ? parseMarkdownForPublish(content) : null
    const payload = {
      title: title || meta?.title || 'Untitled',
      slug: slug || meta?.slug || undefined,
      excerpt: excerpt || meta?.excerpt || '',
      content,
      image,
      game: lockGame ? defaultGame : game,
      category: category || (isPlayerStory ? 'Players' : 'News'),
      author,
      status,
      source_name: sourceName || undefined,
      source_url: sourceUrl || undefined,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      seo_title: seoTitle || meta?.seoTitle || undefined,
      seo_description: seoDescription || meta?.seoDescription || undefined,
      seo_keywords: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      reading_time: meta?.readingTime,
      is_featured: isFeatured,
      is_trending: isTrending,
    }

    const res = await fetch(article ? `/api/admin/articles/${article.id}` : '/api/admin/articles', {
      method: article ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) {
      setError([json.error, json.hint].filter(Boolean).join(' — ') || 'Save failed')
      return
    }
    router.push(returnTo)
    router.refresh()
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs text-[#969AA3]">
            {isPlayerStory ? 'Player Story' : article ? 'Edit article' : 'Paste markdown → publish'}
          </p>
          <h1 className="mt-1 text-2xl font-black">{heading}</h1>
        </div>
        <button
          type="button"
          onClick={() => applyMarkdownMeta(content, { force: true })}
          className="rounded-full border border-[#272A31] px-4 py-2 text-xs font-bold text-[#C7FF2F] hover:border-[#C7FF2F]"
        >
          Auto-fill from markdown
        </button>
      </div>

      <div className="rounded-2xl border border-[#C7FF2F]/25 bg-[#C7FF2F]/[.06] p-4 text-sm text-[#c3c6cc]">
        Paste full Markdown below (with <code className="text-[#C7FF2F]"># Title</code>, tables, standings). Title, slug,
        excerpt, tags, game and SEO fields fill automatically.
        {autofillNote && <p className="mt-2 text-xs font-semibold text-[#C7FF2F]">{autofillNote}</p>}
      </div>

      <div className="block text-sm font-semibold">
        Markdown content
        <MarkdownEditor value={content} onChange={onContentChange} required />
        {!content.trim() && (
          <input tabIndex={-1} aria-hidden required value="" onChange={() => undefined} className="sr-only" />
        )}
      </div>

      <label className="block text-sm font-semibold">
        Title
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 outline-none focus:border-[#C7FF2F]"
        />
      </label>
      <label className="block text-sm font-semibold">
        Slug (SEO URL)
        <input
          value={slug}
          onChange={(e) => {
            slugTouched.current = true
            setSlug(e.target.value)
          }}
          placeholder="auto-from-title"
          className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 outline-none focus:border-[#C7FF2F]"
        />
      </label>
      <label className="block text-sm font-semibold">
        Excerpt
        <textarea
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 outline-none focus:border-[#C7FF2F]"
        />
      </label>

      <div className="rounded-2xl border border-[#272A31] bg-[#101216] p-5">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#C7FF2F]">Placement</p>
        <p className="mt-2 text-xs text-[#969AA3]">
          Tick these to show the story on the homepage Featured hero and Trending strip.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#272A31] bg-[#16181D] px-4 py-2.5 text-sm font-semibold hover:border-[#C7FF2F]">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="size-4 accent-[#C7FF2F]"
            />
            Featured
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#272A31] bg-[#16181D] px-4 py-2.5 text-sm font-semibold hover:border-[#C7FF2F]">
            <input
              type="checkbox"
              checked={isTrending}
              onChange={(e) => setIsTrending(e.target.checked)}
              className="size-4 accent-[#C7FF2F]"
            />
            Trending
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-[#272A31] bg-[#101216] p-5">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#C7FF2F]">SEO / GEO</p>
        <div className="mt-4 space-y-4">
          <label className="block text-sm font-semibold">
            SEO title
            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              maxLength={70}
              placeholder="Under 70 chars"
              className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 outline-none focus:border-[#C7FF2F]"
            />
          </label>
          <label className="block text-sm font-semibold">
            SEO description
            <textarea
              rows={2}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              maxLength={160}
              placeholder="Under 160 chars — English, India-focused"
              className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 outline-none focus:border-[#C7FF2F]"
            />
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          {isPlayerStory ? 'Type' : 'Game'}
          <select
            value={game}
            disabled={lockGame}
            onChange={(e) => setGame(e.target.value as Game)}
            className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 outline-none disabled:opacity-70"
          >
            {games.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ArticleStatus)}
            className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 outline-none"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 outline-none focus:border-[#C7FF2F]"
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Author
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 outline-none focus:border-[#C7FF2F]"
          />
        </label>
      </div>
      <CoverImageField value={image} onChange={setImage} label="Cover image" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Source name
          <input
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 outline-none focus:border-[#C7FF2F]"
          />
        </label>
        <label className="block text-sm font-semibold">
          Source URL
          <input
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 outline-none focus:border-[#C7FF2F]"
          />
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Tags / keywords (comma separated)
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 outline-none focus:border-[#C7FF2F]"
        />
      </label>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          disabled={saving}
          className="rounded-full bg-[#C7FF2F] px-5 py-3 text-sm font-bold text-[#08090B] disabled:opacity-60"
        >
          {saving ? 'Saving…' : article ? 'Update' : isPlayerStory ? 'Save player story' : 'Save article'}
        </button>
        <button
          type="button"
          onClick={() => setStatus('published')}
          className="rounded-full border border-[#272A31] px-5 py-3 text-sm font-bold"
        >
          Mark as published
        </button>
      </div>
    </form>
  )
}
