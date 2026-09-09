'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Article } from '@/lib/types'
import { isPlayerStory, normalizeGame } from '@/lib/articles'

const filters = ['All', 'Published', 'Draft', 'Pending', 'Rejected'] as const

type Props = {
  articles: Article[]
  mode?: 'all' | 'player-story'
}

export function ArticlesTable({ articles, mode = 'all' }: Props) {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const [q, setQ] = useState('')

  const base = useMemo(() => {
    if (mode !== 'player-story') return articles
    return articles.filter((a) => isPlayerStory(a.game) || a.category === 'Players')
  }, [articles, mode])

  const rows = useMemo(() => {
    return base.filter((a) => {
      const statusOk = filter === 'All' || a.status === filter.toLowerCase()
      const query = q.trim().toLowerCase()
      const gameLabel = normalizeGame(a.game)
      const qOk = !query || `${a.title} ${gameLabel} ${a.category}`.toLowerCase().includes(query)
      return statusOk && qOk
    })
  }, [base, filter, q])

  const isPlayer = mode === 'player-story'
  const newHref = isPlayer ? '/admin/player-stories/new' : '/admin/articles/new'
  const editBase = isPlayer ? '/admin/player-stories' : '/admin/articles'

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs text-[#969AA3]">{isPlayer ? 'Player features' : 'Content library'}</p>
          <h1 className="mt-1 text-2xl font-black">{isPlayer ? 'Player Stories' : 'Articles'}</h1>
        </div>
        <Link
          href={newHref}
          className="rounded-full bg-[#C7FF2F] px-4 py-2 text-center text-sm font-bold text-[#08090B]"
        >
          {isPlayer ? '+ New player story' : '+ New article'}
        </Link>
      </div>
      <div className="mt-7 overflow-hidden rounded-2xl border border-[#272A31] bg-[#101216]">
        <div className="flex flex-wrap gap-2 border-b border-[#272A31] p-4">
          {filters.map((x) => (
            <button
              key={x}
              onClick={() => setFilter(x)}
              className={
                filter === x
                  ? 'rounded-full bg-[#C7FF2F] px-3 py-2 text-xs font-semibold text-[#08090B]'
                  : 'rounded-full px-3 py-2 text-xs font-semibold text-[#969AA3] hover:bg-[#16181D]'
              }
            >
              {x}
            </button>
          ))}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={isPlayer ? 'Search player stories' : 'Search articles'}
            className="ml-auto w-full rounded-full border border-[#272A31] bg-transparent px-4 py-2 text-xs outline-none md:w-56"
          />
        </div>
        <div className="hidden md:block">
          <div className="grid grid-cols-[2fr_.6fr_.7fr_.7fr_.8fr] gap-4 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#969AA3]">
            <span>Title</span>
            <span>Type</span>
            <span>Category</span>
            <span>Status</span>
            <span>Updated</span>
          </div>
          {rows.map((a) => (
            <Link
              key={a.id}
              href={`${editBase}/${a.id}`}
              className="grid grid-cols-[2fr_.6fr_.7fr_.7fr_.8fr] items-center gap-4 border-t border-[#272A31] px-5 py-4 text-sm hover:bg-[#16181D]"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate font-bold">{a.title}</span>
                {a.is_featured ? (
                  <span className="shrink-0 rounded bg-[#C7FF2F]/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#C7FF2F]">
                    Feat
                  </span>
                ) : null}
                {a.is_trending ? (
                  <span className="shrink-0 rounded bg-red-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-red-300">
                    Trend
                  </span>
                ) : null}
              </span>
              <span className="text-[#969AA3]">{normalizeGame(a.game)}</span>
              <span className="text-[#969AA3]">{a.category}</span>
              <span className={a.status === 'published' ? 'text-[#C7FF2F]' : 'text-[#969AA3]'}>{a.status}</span>
              <span className="text-[#969AA3]">{new Date(a.updated_at).toLocaleDateString()}</span>
            </Link>
          ))}
        </div>
        <div className="divide-y divide-[#272A31] md:hidden">
          {rows.map((a) => (
            <Link key={a.id} href={`${editBase}/${a.id}`} className="block p-4">
              <p className="font-bold">{a.title}</p>
              <div className="mt-2 flex justify-between text-xs text-[#969AA3]">
                <span>
                  {normalizeGame(a.game)} · {a.category}
                </span>
                <span>{a.status}</span>
              </div>
            </Link>
          ))}
        </div>
        {!rows.length && (
          <p className="p-6 text-sm text-[#969AA3]">
            {isPlayer ? 'No player stories match this filter.' : 'No articles match this filter.'}
          </p>
        )}
      </div>
    </div>
  )
}
