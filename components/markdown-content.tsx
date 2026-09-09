'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

function isUsableImageSrc(src?: string | null) {
  if (!src) return false
  const s = src.trim()
  return s.startsWith('data:') || /^https?:\/\//i.test(s)
}

function SafeArticleImg({ src, alt }: { src?: string; alt?: string }) {
  const [ok, setOk] = useState(true)
  if (!src || !isUsableImageSrc(src) || !ok) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      onError={() => setOk(false)}
      className="my-6 h-auto w-full rounded-2xl border border-[#E4E7EC] object-contain"
    />
  )
}

const components: Components = {
  h1: ({ children }) => (
    <h2 className="!mt-0 text-balance text-3xl font-black tracking-[-.04em] text-[#111318] md:text-4xl">{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className="flex flex-wrap items-center gap-2 text-[#111318]">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="flex flex-wrap items-center gap-2 text-[#111318]">{children}</h3>
  ),
  p: ({ children }) => <p>{children}</p>,
  strong: ({ children }) => <strong className="font-bold text-[#111318]">{children}</strong>,
  em: ({ children }) => <em className="text-[#3D4450]">{children}</em>,
  ul: ({ children }) => <ul className="list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-[3px] border-[#C7FF2F] bg-[#C7FF2F]/[.08] px-4 py-3 text-[#3D4450]">
      {children}
    </blockquote>
  ),
  cite: ({ children }) => <cite className="mt-2 block text-sm not-italic text-[#5C6570]">{children}</cite>,
  hr: () => <hr />,
  img: ({ src, alt }) => <SafeArticleImg src={typeof src === 'string' ? src : undefined} alt={alt} />,
  table: ({ children }) => (
    <div className="md-table-wrap my-8 overflow-x-auto rounded-2xl border border-[#E4E7EC] bg-white">
      <table className="w-full min-w-[480px] border-collapse text-left text-[15px] md:text-base">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[#F0F2F5] text-[11px] uppercase tracking-[.14em] text-[#5C6570]">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-t border-[#E4E7EC]">{children}</tr>,
  th: ({ children }) => <th className="px-4 py-3 font-bold first:pl-5 last:pr-5">{children}</th>,
  td: ({ children }) => (
    <td className="px-4 py-3.5 align-middle text-[#3D4450] first:pl-5 first:font-bold first:text-[#111318] last:pr-5">
      {children}
    </td>
  ),
  code: ({ className, children }) => {
    const isBlock = Boolean(className)
    if (isBlock) return <code className={className}>{children}</code>
    return <code>{children}</code>
  },
}

export function MarkdownContent({ content }: { content: string }) {
  if (!content?.trim()) return null
  return (
    <div className="prose-dz md-article">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
