'use client'

import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/dist/markdown.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

type Props = {
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export function MarkdownEditor({ value, onChange, required }: Props) {
  return (
    <div data-color-mode="dark" className="markdown-editor-shell mt-2 overflow-hidden rounded-xl border border-[#272A31]">
      <MDEditor
        value={value}
        onChange={(next) => onChange(next ?? '')}
        height={420}
        preview="live"
        visibleDragbar={false}
        textareaProps={{
          required,
          placeholder:
            '# Nebula Esports Crowned BGMS Season 5 Champions\n\n**Nebula Esports** won BGMS Season 5...\n\n## Final Standings\n\n| Pos | Team | Points |\n| --- | --- | --- |\n| 1st | Nebula Esports | 210 |',
        }}
      />
    </div>
  )
}
