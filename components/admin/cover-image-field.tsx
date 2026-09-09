'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'

type Props = {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function CoverImageField({ value, onChange, label = 'Cover image' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)

  async function onFile(file: File | undefined) {
    if (!file) return
    setUploading(true)
    setError(null)
    setWarning(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Upload failed')
      onChange(json.url as string)
      if (json.warning) setWarning(json.warning)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">{label}</p>

      <div className="overflow-hidden rounded-2xl border border-[#272A31] bg-[#101216]">
        <div className="relative aspect-[16/9] bg-[#16181D]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Cover preview" className="h-full w-full object-contain" />
          ) : (
            <div className="grid h-full place-items-center text-sm text-[#969AA3]">No cover yet</div>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Remove cover"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-[#272A31] p-4 sm:flex-row sm:items-center">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C7FF2F] px-4 py-2.5 text-sm font-bold text-[#08090B] disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <ImagePlus className="size-4" />
                Upload cover
              </>
            )}
          </button>
          <p className="text-xs text-[#969AA3]">JPG, PNG, WEBP or GIF · max 5MB</p>
        </div>
      </div>

      <label className="block text-xs font-semibold text-[#969AA3]">
        Or paste image URL
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /images/…"
          className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 text-sm font-medium text-[#F5F5F5] outline-none focus:border-[#C7FF2F]"
        />
      </label>
      {warning && <p className="text-sm text-amber-300">{warning}</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  )
}
