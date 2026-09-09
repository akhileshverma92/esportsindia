'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Loader2, RefreshCw, Search } from 'lucide-react'
import type { PlayerFindResponse, PlayerProfile } from '@/lib/player-find'

function Fact({
  label,
  value,
  source,
}: {
  label: string
  value?: string | null
  source?: string
}) {
  if (!value) return null
  return (
    <div className="rounded-xl bg-[#F7F8FA] px-4 py-3">
      <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#969AA3]">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-[#111318]">{value}</dd>
      {source && <dd className="mt-1 text-[10px] font-semibold text-[#969AA3]">via {source}</dd>}
    </div>
  )
}

function ProfileCard({ profile }: { profile: PlayerProfile }) {
  const src = profile.field_sources || {}
  return (
    <section className="rounded-2xl border border-[#E4E7EC] bg-white p-5 sm:p-8">
      <p className="eyebrow">Profile</p>
      <h2 className="mt-2 text-4xl font-black tracking-[-0.06em] text-[#111318] sm:text-5xl">
        {profile.name}
      </h2>
      {profile.real_name && (
        <p className="mt-2 text-lg font-semibold text-[#5C6570]">{profile.real_name}</p>
      )}
      {profile.short_bio && (
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#3D4450]">{profile.short_bio}</p>
      )}

      <dl className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Fact label="Country" value={profile.country} source={src.country} />
        <Fact label="Game" value={profile.game} source={src.game} />
        <Fact label="Current team" value={profile.current_team} source={src.current_team} />
        <Fact label="Status" value={profile.status} source={src.status} />
        <Fact label="Active" value={profile.years_active} source={src.years_active} />
        <Fact label="Role" value={profile.role} source={src.role} />
        <Fact label="Earnings" value={profile.total_earnings} source={src.total_earnings} />
        {profile.aliases.length > 0 && (
          <Fact label="Also known as" value={profile.aliases.join(', ')} source={src.aliases} />
        )}
      </dl>

      {profile.needs_verification && profile.needs_verification.length > 0 && (
        <p className="mt-5 text-xs font-semibold text-amber-700">
          Needs verification: {profile.needs_verification.join(', ')}
        </p>
      )}
    </section>
  )
}

function CareerCard({ profile }: { profile: PlayerProfile }) {
  const teams = profile.teams.length
    ? profile.teams
    : profile.current_team
      ? [profile.current_team]
      : []

  if (!teams.length && !profile.top_achievements.length) return null

  return (
    <section className="grid gap-5 lg:grid-cols-2">
      {teams.length > 0 && (
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5 sm:p-6">
          <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#5BA800]">Teams</h3>
          <ul className="mt-4 space-y-2.5">
            {teams.map((team) => (
              <li key={team} className="flex gap-2 text-sm font-semibold text-[#111318]">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#C7FF2F]" />
                {team}
              </li>
            ))}
          </ul>
        </div>
      )}

      {profile.top_achievements.length > 0 && (
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5 sm:p-6">
          <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#5BA800]">
            Top achievements
          </h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[280px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#E4E7EC] text-[10px] uppercase tracking-[0.12em] text-[#969AA3]">
                  <th className="pb-2 pr-3 font-extrabold">Tournament</th>
                  <th className="pb-2 font-extrabold">Place</th>
                </tr>
              </thead>
              <tbody>
                {profile.top_achievements.map((a) => (
                  <tr key={`${a.tournament}-${a.position}`} className="border-b border-[#F0F2F5]">
                    <td className="py-3 pr-3 font-semibold text-[#111318]">
                      {a.tournament}
                      {a.tier && (
                        <span className="mt-1 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#969AA3]">
                          {a.tier}
                        </span>
                      )}
                    </td>
                    <td className="py-3 font-bold text-[#5BA800]">{a.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}

export function PlayerFindPanel() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<PlayerFindResponse | null>(null)

  async function runSearch(forceRefresh = false) {
    const q = name.trim()
    if (q.length < 2) {
      setError('Enter a player name')
      return
    }

    setLoading(true)
    setError(null)
    if (!forceRefresh) setData(null)

    try {
      const res = await fetch('/api/player-find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: q, forceRefresh }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Search failed')
      setData(json as PlayerFindResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  async function onSearch(e: React.FormEvent) {
    e.preventDefault()
    await runSearch(false)
  }

  const profile = data?.profile

  return (
    <div className="space-y-8">
      <form onSubmit={onSearch} className="rounded-2xl border border-[#E4E7EC] bg-white p-5 sm:p-7">
        <label htmlFor="player-name" className="eyebrow">
          Player Find
        </label>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#969AA3]" />
            <input
              id="player-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ScoutOP, Jonathan, Mortal…"
              className="w-full rounded-full border border-[#E4E7EC] bg-[#F7F8FA] py-3.5 pl-11 pr-4 text-sm font-medium text-[#111318] outline-none placeholder:text-[#969AA3] focus:border-[#C7FF2F]"
              disabled={loading}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111318] px-6 py-3.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Building profile…
              </>
            ) : (
              'Find player'
            )}
          </button>
        </div>
        <p className="mt-3 text-sm text-[#5C6570]">
          Firecrawl collects a few sources → rule-based extraction → clean profile. No OpenAI required. Cached 24h.
        </p>
        {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
      </form>

      {loading && (
        <div className="rounded-2xl border border-dashed border-[#E4E7EC] bg-white px-6 py-14 text-center">
          <Loader2 className="mx-auto size-6 animate-spin text-[#5BA800]" />
          <p className="mt-4 text-sm font-semibold text-[#111318]">Building profile…</p>
          <p className="mt-2 text-sm text-[#5C6570]">Searching sources and extracting facts (no AI credits).</p>
        </div>
      )}

      {data && profile && !loading && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#969AA3]">
              {data.cached ? 'From cache' : 'Fresh lookup'} · Rules extract · Updated {profile.last_updated}
            </p>
            <button
              type="button"
              onClick={() => runSearch(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EC] px-3 py-1.5 text-xs font-bold text-[#5C6570] hover:border-[#C7FF2F] hover:text-[#5BA800]"
            >
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>

          <ProfileCard profile={profile} />
          <CareerCard profile={profile} />

          <section className="rounded-2xl border border-[#E4E7EC] bg-white p-5 sm:p-6">
            <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#5BA800]">
              Latest news
            </h3>
            {data.news.length === 0 ? (
              <p className="mt-4 text-sm text-[#5C6570]">
                No Indian eSports Express stories mention this player yet. Publish related news in Studio to fill this
                section.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-[#F0F2F5]">
                {data.news.map((item) => (
                  <li key={item.id} className="py-3.5 first:pt-0 last:pb-0">
                    <Link href={`/articles/${item.slug}`} className="group block">
                      <p className="font-bold tracking-[-0.02em] text-[#111318] group-hover:text-[#5BA800]">
                        {item.title}
                      </p>
                      {item.excerpt && (
                        <p className="mt-1 line-clamp-2 text-sm text-[#5C6570]">{item.excerpt}</p>
                      )}
                      {item.publishedAt && (
                        <p className="mt-1 text-xs font-semibold text-[#969AA3]">{item.publishedAt}</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {profile.sources.length > 0 && (
            <section className="rounded-2xl border border-[#E4E7EC] bg-white p-5 sm:p-6">
              <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#5BA800]">
                Sources
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {profile.sources.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-[#E4E7EC] px-3 py-1.5 text-xs font-bold text-[#5C6570] hover:border-[#C7FF2F] hover:text-[#5BA800]"
                  >
                    {s.name} <ArrowUpRight size={12} />
                  </a>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
