/** Shared SEO text cleanup — no app imports (avoids cycles). */

export type ExtractedSeo = {
  cleaned: string
  seoTitle?: string
  seoDescription?: string
}

function stripMd(text: string) {
  return text
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[#>*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Pull labeled SEO Title / Meta Description out of pasted markdown or excerpt
 * so they never appear as visible page copy.
 */
export function extractEmbeddedSeo(input: string): ExtractedSeo {
  if (!input?.trim()) return { cleaned: '' }

  let text = input.replace(/\r\n/g, '\n')
  let seoTitle: string | undefined
  let seoDescription: string | undefined

  const take = (re: RegExp, assign: (v: string) => void) => {
    text = text.replace(re, (_, value: string) => {
      const v = stripMd(String(value || '')).trim()
      if (v) assign(v)
      return '\n'
    })
  }

  // Prefer compact single-block first (common paste / excerpt pollution)
  const compact = text.match(
    /SEO\s*Title\s*[:\-–]?\s*([\s\S]+?)\s*Meta\s*Description\s*[:\-–]?\s*([\s\S]+)$/i
  )
  if (compact) {
    seoTitle = stripMd(compact[1]).trim() || seoTitle
    seoDescription = stripMd(compact[2]).trim() || seoDescription
    text = text.replace(compact[0], '').trim()
  }

  // Heading forms: ## SEO Title / ## Meta Description
  take(/^#{1,3}\s*SEO\s*Title\s*\n+([\s\S]*?)(?=^#{1,3}\s|\n{2,}|$)/gim, (v) => {
    seoTitle = seoTitle || v.split('\n')[0].trim()
  })
  take(/^#{1,3}\s*Meta\s*Description\s*\n+([\s\S]*?)(?=^#{1,3}\s|\n{2,}|$)/gim, (v) => {
    seoDescription = seoDescription || v.split('\n')[0].trim()
  })

  // Inline / labeled lines — stop before Meta Description when on same line
  take(
    /(?:^|\n)\s*(?:\*\*)?SEO\s*Title(?:\*\*)?\s*[:\-–]?\s*(.+?)(?=\s*Meta\s*Description|\n|$)/gi,
    (v) => {
      seoTitle = seoTitle || v
    }
  )
  take(
    /(?:^|\n)\s*(?:\*\*)?Meta\s*Description(?:\*\*)?\s*[:\-–]?\s*(.+?)(?=\n|$)/gi,
    (v) => {
      seoDescription = seoDescription || v
    }
  )

  text = text
    .replace(/(?:^|\n)\s*(?:\*\*)?(?:SEO\s*Title|Meta\s*Description)(?:\*\*)?\s*[:\-–]?\s*/gi, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return {
    cleaned: text,
    seoTitle: seoTitle?.slice(0, 70),
    seoDescription: seoDescription?.slice(0, 160),
  }
}

/** Public-facing excerpt: never includes SEO labels or raw markdown tables. */
export function publicExcerpt(raw: string | null | undefined): string {
  const { cleaned } = extractEmbeddedSeo(raw || '')
  let text = cleaned
    // Drop markdown table rows
    .replace(/^\s*\|.*$/gm, '')
    .replace(/^\s*[-:| \t]{3,}\s*$/gm, '')
    // Cut off standings / table dumps mid-string
    .replace(/\s*Final Standings[\s\S]*$/i, '')
    .replace(/\s*\|[^\n]*\|[^\n|]*\|[\s\S]*$/g, '')
    .replace(/\|/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[#>*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s+[^\p{L}\p{N}.!?"'₹)\]]+$/u, '')
    .trim()

  if (!text) return ''
  if (/^seo\b|^meta\b/i.test(text)) return ''
  if (/final standings|position\s+team\s+points/i.test(text) && text.length < 80) return ''
  if ((text.match(/\b(points|prize|position)\b/gi) || []).length >= 3 && text.length < 120) return ''

  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean)
  const summary = (sentences.slice(0, 2).join(' ') || text).slice(0, 220).trim()
  return summary
}
