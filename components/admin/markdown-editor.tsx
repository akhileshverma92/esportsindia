'use client'

import { MarkdownContent } from '@/components/markdown-content'

type Props = {
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export function MarkdownEditor({ value, onChange, required }: Props) {
  return (
    <div className="markdown-editor-shell mt-2 overflow-hidden rounded-xl border border-[#272A31]">
      <div className="grid gap-0 lg:grid-cols-2">
        <label className="block border-b border-[#272A31] lg:border-b-0 lg:border-r">
          <span className="sr-only">Markdown source</span>
          <textarea
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            placeholder={
              '# Nebula Esports Crowned BGMS Season 5 Champions\n\n**Nebula Esports** won BGMS Season 5...\n\n## Final Standings\n\n| Pos | Team | Points |\n| --- | --- | --- |\n| 1st | Nebula Esports | 210 |'
            }
            className="min-h-[420px] w-full resize-y bg-[#16181D] px-4 py-3 font-mono text-[15px] leading-7 text-[#F5F5F5] outline-none placeholder:text-[#5C6570]"
          />
        </label>
        <div className="min-h-[420px] overflow-auto bg-[#101216] px-4 py-3">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#969AA3]">Preview</p>
          {value.trim() ? (
            <div className="prose-dz md-article text-[#F5F5F5] [&_h2]:text-white [&_h3]:text-white [&_p]:text-[#c3c6cc] [&_li]:text-[#c3c6cc] [&_td]:text-[#c3c6cc] [&_strong]:text-white">
              <MarkdownContent content={value} />
            </div>
          ) : (
            <p className="text-sm text-[#5C6570]">Start typing Markdown to preview the story.</p>
          )}
        </div>
      </div>
    </div>
  )
}
