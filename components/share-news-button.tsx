'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'

type Props = {
  title: string
  excerpt?: string
  slug: string
}

export function ShareNewsButton({ title, excerpt, slug }: Props) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const path = `/articles/${slug}`

  function getUrl() {
    if (typeof window === 'undefined') return path
    return `${window.location.origin}${path}`
  }

  const shareTargets = useMemo(() => {
    const url = typeof window !== 'undefined' ? getUrl() : path
    const encoded = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    return {
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`,
      telegram: `https://t.me/share/url?url=${encoded}&text=${encodedTitle}`,
    }
  }, [title, slug])

  async function shareNative() {
    const url = getUrl()
    const text = excerpt?.slice(0, 160) || title
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch {
        // cancelled
      }
    }
    setOpen((v) => !v)
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(getUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setOpen(true)
    }
  }

  return (
    <div className="relative w-full sm:w-auto">
      <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={shareNative}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#111318] px-3 py-2.5 text-sm font-bold text-white hover:bg-[#2A2F38] sm:min-h-0 sm:w-auto sm:px-4"
        >
          <Share2 size={16} className="shrink-0" />
          <span className="truncate">Share</span>
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#E4E7EC] bg-white px-3 py-2.5 text-sm font-bold text-[#111318] hover:border-[#C7FF2F] sm:min-h-0 sm:w-auto sm:px-4"
        >
          {copied ? <Check size={16} className="shrink-0 text-[#5BA800]" /> : <Copy size={16} className="shrink-0" />}
          <span className="truncate">{copied ? 'Copied' : 'Copy link'}</span>
        </button>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 flex flex-col overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white shadow-lg sm:right-auto sm:w-56">
          <a className="px-4 py-3 text-sm font-semibold hover:bg-[#F0F2F5]" href={shareTargets.whatsapp} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a className="px-4 py-3 text-sm font-semibold hover:bg-[#F0F2F5]" href={shareTargets.twitter} target="_blank" rel="noreferrer">
            X / Twitter
          </a>
          <a className="px-4 py-3 text-sm font-semibold hover:bg-[#F0F2F5]" href={shareTargets.telegram} target="_blank" rel="noreferrer">
            Telegram
          </a>
          <button type="button" className="px-4 py-3 text-left text-sm text-[#5C6570]" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  )
}
