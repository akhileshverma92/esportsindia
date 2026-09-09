import Link from 'next/link'
import { getAdminArticles, getAdminStats, getAiJobs } from '@/lib/queries'

export default async function AdminDashboardPage() {
  let stats = [
    { label: 'Articles', value: '0', detail: 'Run SQL migration first' },
    { label: 'Published', value: '0', detail: '—' },
    { label: 'Pending Review', value: '0', detail: '—' },
    { label: 'AI Queue', value: '0', detail: '—' },
  ]
  let recent: Awaited<ReturnType<typeof getAdminArticles>> = []
  let queue: Awaited<ReturnType<typeof getAiJobs>> = []
  let error: string | null = null

  try {
    ;[stats, recent, queue] = await Promise.all([
      getAdminStats(),
      getAdminArticles(),
      getAiJobs(),
    ])
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load admin data'
  }

  return (
    <div>
      <p className="text-xs text-[#969AA3]">Indian eSports Express Studio</p>
      <h1 className="mt-1 text-2xl font-black tracking-tight">Editorial control room</h1>
      {error && (
        <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
          <p className="mt-2 text-[#969AA3]">
            Apply <code className="text-[#C7FF2F]">supabase/migrations/20260909000000_create_cms_tables.sql</code> in the
            Supabase SQL Editor, then create an Auth user.
          </p>
        </div>
      )}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#272A31] bg-[#101216] p-5">
            <p className="text-xs text-[#969AA3]">{s.label}</p>
            <div className="mt-4 text-3xl font-black tracking-tight">{s.value}</div>
            <p className="mt-2 text-xs text-[#C7FF2F]">{s.detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_420px]">
        <div className="rounded-2xl border border-[#272A31] bg-[#101216]">
          <div className="flex items-center justify-between border-b border-[#272A31] p-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#969AA3]">Publishing</p>
              <h2 className="mt-2 text-xl font-black">Recent articles</h2>
            </div>
            <Link href="/admin/articles" className="text-sm text-[#C7FF2F]">
              View all
            </Link>
          </div>
          {recent.slice(0, 6).map((a) => (
            <div key={a.id} className="flex items-center gap-4 border-b border-[#272A31] p-4 last:border-0">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{a.title}</p>
                <p className="mt-1 text-xs text-[#969AA3]">
                  {a.game} · {a.category} · {a.views} views
                </p>
              </div>
              <span
                className={
                  a.status === 'published'
                    ? 'rounded-full bg-[#C7FF2F]/10 px-2 py-1 text-[10px] font-bold text-[#C7FF2F]'
                    : 'rounded-full bg-[#16181D] px-2 py-1 text-[10px] font-bold text-[#969AA3]'
                }
              >
                {a.status}
              </span>
            </div>
          ))}
          {!recent.length && <p className="p-5 text-sm text-[#969AA3]">No articles yet. Create one or run AI Queue.</p>}
        </div>
        <div className="rounded-2xl border border-[#272A31] bg-[#101216] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-red-300">AI Queue</p>
              <h2 className="mt-2 text-xl font-black">Needs review</h2>
            </div>
            <Link href="/admin/ai-queue" className="text-sm text-[#C7FF2F]">
              Open queue
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {queue.slice(0, 5).map((x) => (
              <div key={x.id} className="rounded-xl border border-[#272A31] p-4">
                <div className="flex justify-between gap-4 text-xs text-[#969AA3]">
                  <span>{x.source_name || x.source_url}</span>
                  <span className="text-[#C7FF2F]">{x.status}</span>
                </div>
                <p className="mt-2 text-sm font-bold">{x.rewritten_title || 'Processing…'}</p>
              </div>
            ))}
            {!queue.length && <p className="text-sm text-[#969AA3]">Queue is empty.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
