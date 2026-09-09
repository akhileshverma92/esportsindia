'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AiJob, AiModel } from '@/lib/types'

export function AiQueueClient({ initialJobs }: { initialJobs: AiJob[] }) {
  const router = useRouter()
  const [jobs, setJobs] = useState(initialJobs)
  const [url, setUrl] = useState('')
  const [model, setModel] = useState<AiModel>('gemini')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch('/api/admin/ai-queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, model }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(json.error || 'Fetch & rewrite failed')
      router.refresh()
      return
    }
    setUrl('')
    setJobs((prev) => [json.job, ...prev.filter((j) => j.id !== json.job.id)])
    router.refresh()
  }

  async function act(id: string, action: 'approve' | 'reject') {
    setBusyId(id)
    const res = await fetch(`/api/admin/ai-queue/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const json = await res.json()
    setBusyId(null)
    if (!res.ok) {
      setError(json.error || 'Action failed')
      return
    }
    setJobs((prev) => prev.map((j) => (j.id === id ? json.job : j)))
    router.refresh()
  }

  return (
    <div>
      <p className="text-xs text-[#969AA3]">Editorial automation</p>
      <h1 className="mt-1 text-2xl font-black">AI News Queue</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#969AA3]">
        Paste a news URL. Firecrawl scrapes it, then Gemini or ChatGPT rewrites a Indian eSports Express article for review.
      </p>

      <form onSubmit={submit} className="mt-8 rounded-2xl border border-[#272A31] bg-[#101216] p-5">
        <label className="block text-sm font-semibold">
          News URL
          <input
            required
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 outline-none focus:border-[#C7FF2F]"
          />
        </label>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as AiModel)}
            className="rounded-full border border-[#272A31] bg-[#16181D] px-4 py-2 text-sm outline-none"
          >
            <option value="gemini">Gemini</option>
            <option value="openai">ChatGPT</option>
          </select>
          <button
            disabled={loading}
            className="rounded-full bg-[#C7FF2F] px-5 py-2 text-sm font-bold text-[#08090B] disabled:opacity-60"
          >
            {loading ? 'Fetching & rewriting…' : 'Fetch & rewrite'}
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        <p className="mt-4 text-xs text-[#969AA3]">
          Needs <code className="text-[#C7FF2F]">FIRECRAWL_API_KEY</code> plus{' '}
          <code className="text-[#C7FF2F]">GEMINI_API_KEY</code> or <code className="text-[#C7FF2F]">OPENAI_API_KEY</code> in
          .env.local
        </p>
      </form>

      <div className="mt-8 space-y-3">
        {jobs.map((x) => (
          <div key={x.id} className="rounded-2xl border border-[#272A31] bg-[#101216] p-5">
            <div className="flex flex-wrap justify-between gap-3 text-xs text-[#969AA3]">
              <span>
                {x.source_name || 'Source'} · {x.model || '—'} · {x.status}
              </span>
              {x.confidence != null && <span className="text-[#C7FF2F]">{Math.round(Number(x.confidence) * 100)}%</span>}
            </div>
            <h3 className="mt-3 text-lg font-black">{x.rewritten_title || 'Untitled / processing'}</h3>
            {x.rewritten_excerpt && <p className="mt-2 text-sm text-[#969AA3]">{x.rewritten_excerpt}</p>}
            {x.error && <p className="mt-2 text-sm text-red-300">{x.error}</p>}
            {x.rewritten_content && (
              <pre className="mt-4 max-h-40 overflow-auto whitespace-pre-wrap rounded-xl bg-[#16181D] p-4 text-xs text-[#c3c6cc]">
                {x.rewritten_content.slice(0, 1200)}
              </pre>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                disabled={busyId === x.id || x.status !== 'pending'}
                onClick={() => act(x.id, 'approve')}
                className="rounded-full bg-[#C7FF2F] px-4 py-2 text-xs font-bold text-[#08090B] disabled:opacity-40"
              >
                Approve & publish
              </button>
              <button
                disabled={busyId === x.id || x.status === 'rejected' || x.status === 'approved'}
                onClick={() => act(x.id, 'reject')}
                className="rounded-full border border-[#272A31] px-4 py-2 text-xs font-bold text-red-300 disabled:opacity-40"
              >
                Reject
              </button>
              <a
                href={x.source_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#272A31] px-4 py-2 text-xs font-bold text-[#F5F5F5]"
              >
                Open source
              </a>
            </div>
          </div>
        ))}
        {!jobs.length && <p className="text-sm text-[#969AA3]">No AI jobs yet. Paste a URL above.</p>}
      </div>
    </div>
  )
}
