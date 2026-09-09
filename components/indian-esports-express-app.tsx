'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import {
  Search,
  Menu,
  X,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Send,
  MoreHorizontal,
  TrendingUp,
} from 'lucide-react'
import {
  nav,
  gameDescriptions,
  footerGroups,
  footerDescription,
  socialLinks,
  siteTagline,
  newsletterCopy,
  aboutSections,
  contactEmails,
  type CardArticle,
} from '@/lib/site'
import { MarkdownContent } from '@/components/markdown-content'
import { ShareNewsButton } from '@/components/share-news-button'

type ArticleDetail = CardArticle & { content?: string; sourceName?: string | null; sourceUrl?: string | null }
type AppProps = { initialPath?: string; dynamicArticles?: CardArticle[]; articleDetail?: ArticleDetail | null }

const cx = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(' ')

/** Full cover image — never crops; uses natural aspect ratio. */
function CoverMedia({
  src,
  alt,
  priority,
  className,
}: {
  src: string
  alt: string
  priority?: boolean
  className?: string
}) {
  return (
    <div className={cx('cover-media bg-[#F0F2F5]', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="mx-auto block h-auto w-full object-contain"
      />
    </div>
  )
}

/** Thumbnail in a fixed frame — contain so nothing is cropped. */
function CoverThumb({
  src,
  alt = '',
  sizes = '128px',
  className,
}: {
  src: string
  alt?: string
  sizes?: string
  className?: string
}) {
  return (
    <div className={cx('relative shrink-0 overflow-hidden bg-[#F0F2F5]', className)}>
      <Image src={src} alt={alt} fill className="object-contain" sizes={sizes} />
    </div>
  )
}

function EmptyState({ title, body, href, cta }: { title: string; body: string; href?: string; cta?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#E4E7EC] bg-white px-6 py-16 text-center">
      <h3 className="text-xl font-black text-[#111318]">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5C6570]">{body}</p>
      {href && cta && (
        <Link href={href} className="mt-6 inline-flex rounded-full bg-[#111318] px-5 py-3 text-sm font-bold text-white">
          {cta}
        </Link>
      )}
    </div>
  )
}

function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 56 : size === 'sm' ? 36 : 44
  return (
    <Link
      href="/"
      aria-label="Indian eSports Express home"
      className="focus-ring inline-flex shrink-0 items-center rounded-full"
    >
      <Image
        src="/images/logo.png"
        alt="Indian eSports Express"
        width={dim}
        height={dim}
        className="rounded-full object-cover"
        priority={size !== 'lg'}
      />
    </Link>
  )
}

function CategoryBadge({ children, red = false }: { children: React.ReactNode; red?: boolean }) {
  return (
    <span className={cx('eyebrow inline-flex items-center gap-1', red && 'text-red-400')}>
      {red && <span className="size-1.5 rounded-full bg-red-400" />}
      {children}
    </span>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState(false)
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E4E7EC]/80 bg-[#F7F8FA]/90 backdrop-blur-xl">
        <div className="container-dz flex h-14 items-center justify-between gap-4 sm:h-[72px] sm:gap-6">
          <Logo />
          <nav className="hidden items-center gap-6 xl:gap-7 lg:flex">
            {nav.map(([label, href], i) => (
              <Link
                key={label}
                href={href}
                className={cx(
                  'focus-ring text-sm font-semibold text-[#5C6570] transition hover:text-[#111318]',
                  i === 0 && 'text-[#5BA800]'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              aria-label="Open search"
              onClick={() => setSearch(true)}
              className="focus-ring grid size-9 place-items-center rounded-full text-[#5C6570] hover:bg-[#F0F2F5] hover:text-[#111318] sm:size-10"
            >
              <Search size={18} />
            </button>
            <button
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
              className="focus-ring grid size-9 place-items-center rounded-full text-[#5C6570] hover:bg-[#F0F2F5] hover:text-[#111318] sm:size-10 lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F7F8FA] p-5 pt-6 sm:p-7">
          <div className="flex items-center justify-between">
            <Logo />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-10 place-items-center rounded-full border border-[#E4E7EC]">
              <X />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-1 sm:mt-14 sm:gap-2">
            {nav.map(([label, href]) => (
              <Link
                onClick={() => setOpen(false)}
                key={label}
                href={href}
                className="rounded-xl px-2 py-3 text-2xl font-black tracking-[-0.04em] text-[#111318] hover:bg-white sm:text-4xl"
              >
                {label}
              </Link>
            ))}
          </nav>
          <p className="mt-10 text-sm text-[#5C6570] sm:absolute sm:bottom-8 sm:mt-0">{siteTagline}</p>
        </div>
      )}
      {search && (
        <div className="fixed inset-0 z-50 grid place-items-start bg-[#F7F8FA]/95 p-5 pt-24 backdrop-blur-xl sm:pt-28">
          <div className="mx-auto w-full max-w-3xl">
            <div className="flex items-center gap-3 border-b border-[#D0D5DD] pb-4">
              <Search className="shrink-0 text-[#5BA800]" />
              <input
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearch(false)
                  if (e.key === 'Enter') {
                    const q = (e.target as HTMLInputElement).value.trim()
                    if (q) {
                      setSearch(false)
                      window.location.href = `/search?q=${encodeURIComponent(q)}`
                    }
                  }
                }}
                placeholder="Search stories..."
                className="w-full bg-transparent text-xl outline-none placeholder:text-[#98A2B3] sm:text-2xl"
              />
              <button onClick={() => setSearch(false)} aria-label="Close search" className="shrink-0">
                <X />
              </button>
            </div>
            <p className="mt-4 text-sm text-[#5C6570]">
              Or open{' '}
              <Link href="/search" onClick={() => setSearch(false)} className="font-bold text-[#5BA800]">
                Search
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  )
}

function Trending({ items }: { items: Pick<CardArticle, 'title' | 'slug'>[] }) {
  if (!items.length) return null

  const renderTrack = (keyPrefix: string) => (
    <div className="inline-flex items-center gap-5 pr-5">
      {items.map((item) => (
        <Link
          key={`${keyPrefix}-${item.slug}`}
          href={`/articles/${item.slug}`}
          className="inline-flex shrink-0 items-center gap-5 text-[#5C6570] transition-colors hover:text-[#5BA800]"
          tabIndex={keyPrefix === 'b' ? -1 : undefined}
        >
          <span>{item.title}</span>
          <span className="text-[#98A2B3]" aria-hidden>
            •
          </span>
        </Link>
      ))}
    </div>
  )

  return (
    <div className="border-b border-[#E4E7EC] bg-white">
      <div className="container-dz flex h-10 items-center gap-3 overflow-hidden sm:gap-4">
        <CategoryBadge red>Trending</CategoryBadge>
        <div className="trending-marquee min-w-0 flex-1 overflow-hidden">
          <div className="trending-marquee-track whitespace-nowrap text-xs font-medium">
            {renderTrack('a')}
            <div aria-hidden>{renderTrack('b')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ label, title, href }: { label: string; title: string; href?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
      <div className="min-w-0">
        <CategoryBadge>{label}</CategoryBadge>
        <h2 className="mt-2 text-balance text-xl font-black tracking-[-0.04em] text-[#111318] sm:mt-3 sm:text-2xl md:text-3xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          className="shrink-0 items-center gap-1 text-xs font-bold text-[#5BA800] sm:flex sm:text-sm"
          href={href}
        >
          View all <ArrowUpRight size={15} className="hidden sm:inline" />
        </Link>
      )}
    </div>
  )
}

function ArticleCard({
  article,
  variant = 'medium',
}: {
  article: CardArticle
  variant?: 'large' | 'medium' | 'small' | 'horizontal'
}) {
  if (variant === 'horizontal') {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="article-card group flex gap-3 border-b border-[#E4E7EC] py-3.5 last:border-b-0 sm:gap-4 sm:py-4"
      >
        <div className="card-image">
          <CoverThumb
            src={article.image}
            className="h-[4.5rem] w-[4.5rem] rounded-xl sm:h-24 sm:w-32"
            sizes="128px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#5BA800]">{article.game}</p>
          <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug tracking-[-0.02em] text-[#111318] [overflow-wrap:anywhere] group-hover:text-[#5BA800] sm:text-base">
            {article.title}
          </h3>
          <p className="mt-1.5 text-[11px] text-[#969AA3] sm:mt-2 sm:text-xs">
            {article.publishedAt} · {article.readingTime}
          </p>
        </div>
      </Link>
    )
  }
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cx(
        'article-card group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white',
        variant === 'large' && 'md:col-span-2'
      )}
    >
      <div className="card-image">
        <CoverMedia
          src={article.image}
          alt={article.title}
          className="w-full"
        />
      </div>
      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#5BA800]">
          {article.game} <span className="text-[#D0D5DD]">·</span> {article.category}
        </p>
        <h3
          className={cx(
            'mt-2 line-clamp-3 font-black tracking-[-0.03em] text-[#111318] [overflow-wrap:anywhere] sm:line-clamp-2',
            variant === 'large' ? 'text-lg sm:text-2xl md:text-3xl' : 'text-sm sm:text-lg'
          )}
        >
          {article.title}
        </h3>
        {variant !== 'small' && (
          <p className="mt-2 line-clamp-2 hidden text-sm leading-6 text-[#5C6570] sm:block">{article.excerpt}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-[11px] text-[#969AA3] sm:pt-5 sm:text-xs">
          <span className="truncate">
            {article.publishedAt} · {article.readingTime}
          </span>
          <span className="shrink-0 font-bold text-[#5BA800]">Read →</span>
        </div>
      </div>
    </Link>
  )
}

function FeaturedCarousel({ items }: { items: CardArticle[] }) {
  const scroller = useRef<HTMLDivElement>(null)

  function scrollBy(dir: -1 | 1) {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(360, el.clientWidth * 0.85), behavior: 'smooth' })
  }

  if (!items.length) return null

  return (
    <section className="border-b border-[#E4E7EC] bg-white">
      <div className="container-dz py-4 sm:py-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CategoryBadge>Featured</CategoryBadge>
            <span className="hidden text-xs text-[#969AA3] sm:inline">{items.length} stories</span>
          </div>
          {items.length > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous featured"
                onClick={() => scrollBy(-1)}
                className="grid size-8 place-items-center rounded-full border border-[#E4E7EC] text-[#5C6570] hover:border-[#C7FF2F] hover:text-[#5BA800]"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next featured"
                onClick={() => scrollBy(1)}
                className="grid size-8 place-items-center rounded-full border border-[#E4E7EC] text-[#5C6570] hover:border-[#C7FF2F] hover:text-[#5BA800]"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          ) : null}
        </div>

        <div
          ref={scroller}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1"
        >
          {items.map((a, i) => (
            <Link
              key={a.id}
              href={`/articles/${a.slug}`}
              className="group flex h-[128px] w-[min(100%,320px)] shrink-0 snap-start gap-3 overflow-hidden rounded-xl border border-[#E4E7EC] bg-[#F7F8FA] p-2.5 transition hover:border-[#C7FF2F] sm:h-[136px] sm:w-[360px] sm:gap-3.5 sm:p-3"
            >
              <div className="relative h-full w-[100px] shrink-0 overflow-hidden rounded-lg bg-[#E4E7EC] sm:w-[112px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.image}
                  alt=""
                  className="h-full w-full object-contain"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
                <span className="absolute left-1.5 top-1.5 rounded bg-[#C7FF2F] px-1.5 py-0.5 text-[8px] font-black tracking-[0.12em] text-[#08090B]">
                  FEATURED
                </span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col py-0.5">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#5BA800]">
                  {a.game} · {a.category}
                </p>
                <h2 className="mt-1 line-clamp-2 text-sm font-black leading-snug tracking-[-0.03em] text-[#111318] [overflow-wrap:anywhere] group-hover:text-[#5BA800] sm:text-[15px]">
                  {a.title}
                </h2>
                <p className="mt-auto pt-2 text-[11px] text-[#969AA3]">
                  {a.publishedAt}
                  {a.readingTime ? ` · ${a.readingTime}` : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function LatestNews({ latest }: { latest: CardArticle[] }) {
  return (
    <section className="container-dz py-8 sm:py-12">
      <SectionHeader label="Latest News" title="What’s moving Indian esports." href="/player-story" />
      {latest.length ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {latest.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      ) : (
        <EmptyState title="No stories yet" body="Check back soon for the latest Indian esports coverage." href="/" cta="Back to home" />
      )}
    </section>
  )
}

function GameSection({
  name,
  description,
  items,
  href,
}: {
  name: string
  description: string
  items: CardArticle[]
  href: string
}) {
  if (!items.length) return null
  return (
    <section className="border-t border-[#E4E7EC] py-8 sm:py-12">
      <div className="container-dz">
        <SectionHeader label={name} title={description} href={href} />
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-6">
          <ArticleCard article={items[0]} variant="large" />
          <div className="rounded-2xl border border-[#E4E7EC] bg-white px-3 sm:px-5">
            {items.slice(1, 4).map((a) => (
              <ArticleCard key={a.id} article={a} variant="horizontal" />
            ))}
            {!items.slice(1, 4).length && (
              <p className="py-8 text-center text-sm text-[#5C6570]">More {name} stories coming soon.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Newsletter() {
  return (
    <section className="container-dz py-8 sm:py-12">
      <div className="relative overflow-hidden rounded-2xl bg-[#C7FF2F] px-5 py-7 text-[#08090B] sm:px-8 sm:py-10 md:p-12">
        <div className="absolute -right-8 -top-16 text-[160px] font-black leading-none opacity-10 sm:text-[220px]">/</div>
        <div className="relative max-w-xl">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em]">Dispatch</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl md:text-4xl">
            Stay sharp on Indian esports.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#08090B]/75 sm:text-base">{newsletterCopy}</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-5 flex flex-col gap-2 sm:mt-7 sm:max-w-md sm:flex-row">
            <label className="sr-only" htmlFor="newsletter">
              Email address
            </label>
            <input
              id="newsletter"
              type="email"
              placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-full border border-[#08090B]/12 bg-white/60 px-4 py-3 text-sm outline-none placeholder:text-[#08090B]/45 focus:bg-white"
            />
            <button className="rounded-full bg-[#111318] px-5 py-3 text-sm font-bold text-white hover:bg-[#2A2F38]">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-[#E4E7EC] py-10 sm:py-12">
      <div className="container-dz">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-10">
          <div className="sm:col-span-2 md:col-span-1">
            <Logo size="lg" />
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#5C6570]">{footerDescription}</p>
            <div className="mt-4 flex gap-2">
              {socialLinks.map((s) => (
                <button
                  aria-label={s}
                  key={s}
                  className="grid size-9 place-items-center rounded-full border border-[#E4E7EC] text-[#5C6570] hover:border-[#C7FF2F] hover:text-[#5BA800]"
                >
                  {s === 'Discord' ? <MessageCircle size={15} /> : s === 'YouTube' ? <Send size={15} /> : <MoreHorizontal size={15} />}
                </button>
              ))}
            </div>
          </div>
          {footerGroups.map((g) => (
            <div key={g.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#111318]">{g.title}</h3>
              <div className="mt-3 flex flex-col gap-2.5 sm:mt-4 sm:gap-3">
                {g.items.map((i) => (
                  <Link key={i} href={`/${i.toLowerCase().replaceAll(' ', '-')}`} className="text-sm text-[#5C6570] hover:text-[#5BA800]">
                    {i}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-[#E4E7EC] pt-4 text-xs text-[#5C6570] sm:mt-10 sm:flex-row sm:pt-5">
          <span>© 2026 Indian eSports Express. All rights reserved.</span>
          <span>Independent coverage. Clear context. No noise.</span>
        </div>
      </div>
    </footer>
  )
}

function HomeQuickLinks() {
  const links = [
    ['BGMI', '/bgmi'],
    ['Free Fire', '/free-fire'],
    ['Player Story', '/player-story'],
    ['Guides', '/guides'],
  ] as const
  return (
    <div className="border-b border-[#E4E7EC] bg-[#F7F8FA]">
      <div className="container-dz no-scrollbar flex gap-2 overflow-x-auto py-3">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="shrink-0 rounded-full border border-[#E4E7EC] bg-white px-3.5 py-2 text-xs font-bold text-[#5C6570] transition hover:border-[#C7FF2F] hover:text-[#5BA800]"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}

function Home({ articles }: { articles: CardArticle[] }) {
  const featuredList = (() => {
    const marked = articles.filter((a) => a.isFeatured)
    if (marked.length) return marked.slice(0, 8)
    return articles.slice(0, 5)
  })()
  const featuredIds = new Set(featuredList.map((a) => a.id))
  const trendSource = articles.filter((a) => a.isTrending)
  const trend = (trendSource.length ? trendSource : articles.slice(0, 5))
    .slice(0, 8)
    .map((a) => ({ title: a.title, slug: a.slug }))
  const latest = articles.filter((a) => !featuredIds.has(a.id)).slice(0, 6)
  const bgmi = articles.filter((a) => a.game === 'BGMI')
  const freeFire = articles.filter((a) => a.game === 'Free Fire')
  const playerStories = articles.filter(
    (a) => a.game === 'Player Story' || a.category === 'Players' || a.category === 'International'
  )

  return (
    <>
      <Header />
      <Trending items={trend} />
      <HomeQuickLinks />
      <main>
        {featuredList.length ? (
          <FeaturedCarousel items={featuredList} />
        ) : (
          <section className="container-dz py-12 sm:py-16">
            <EmptyState
              title="Indian eSports Express is live"
              body="No published articles yet. Check back soon for fresh stories."
              href="/"
              cta="Back to home"
            />
          </section>
        )}

        <LatestNews latest={latest} />
        <GameSection name="BGMI" description={gameDescriptions.BGMI} items={bgmi} href="/bgmi" />
        <GameSection name="Free Fire" description={gameDescriptions['Free Fire']} items={freeFire} href="/free-fire" />

        {playerStories.length > 0 && (
          <section className="border-t border-[#E4E7EC] py-8 sm:py-12">
            <div className="container-dz">
              <SectionHeader
                label="Player Story"
                title="Faces behind the fight."
                href="/player-story"
              />
              <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                {playerStories.slice(0, 4).map((a) => (
                  <PlayerStorySquareCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          </section>
        )}

        <Newsletter />
      </main>
      <Footer />
    </>
  )
}

function Breadcrumbs({ items }: { items: string[] }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#5C6570]">
      {items.map((x, i) => (
        <span key={`${x}-${i}`} className="flex items-center gap-2">
          {x}
          {i < items.length - 1 && <ChevronRight size={13} />}
        </span>
      ))}
    </div>
  )
}

function PlayerStorySquareCard({ article }: { article: CardArticle }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="player-poster group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white"
    >
      <CoverMedia
        src={article.image}
        alt={article.title}
        className="w-full"
      />
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#5BA800]">
          {article.category || 'Player Story'}
        </p>
        <h3 className="mt-2 line-clamp-2 text-sm font-black leading-snug tracking-[-0.03em] text-[#111318] sm:text-[15px]">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#5C6570]">{article.excerpt}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-[11px] text-[#969AA3]">
          <span className="truncate">
            {article.publishedAt}
            {article.readingTime ? ` · ${article.readingTime}` : ''}
          </span>
          <span className="shrink-0 font-bold text-[#5BA800]">Read →</span>
        </div>
      </div>
    </Link>
  )
}

function TrendingPlayersCarousel({ items }: { items: CardArticle[] }) {
  const scroller = useRef<HTMLDivElement>(null)

  function scrollBy(dir: -1 | 1) {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(320, el.clientWidth * 0.8), behavior: 'smooth' })
  }

  if (!items.length) return null

  return (
    <section className="border-b border-[#E4E7EC] bg-white">
      <div className="container-dz py-6 sm:py-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#5BA800]" />
            <h2 className="text-sm font-black tracking-[-0.02em] text-[#111318] sm:text-base">
              Trending player stories
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Scroll trending left"
              onClick={() => scrollBy(-1)}
              className="grid size-8 place-items-center rounded-full border border-[#E4E7EC] text-[#5C6570] hover:border-[#C7FF2F] hover:text-[#5BA800]"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Scroll trending right"
              onClick={() => scrollBy(1)}
              className="grid size-8 place-items-center rounded-full border border-[#E4E7EC] text-[#5C6570] hover:border-[#C7FF2F] hover:text-[#5BA800]"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1"
        >
          {items.map((a) => (
            <Link
              key={a.id}
              href={`/articles/${a.slug}`}
              className="group flex w-[240px] shrink-0 snap-start gap-3 rounded-xl border border-[#E4E7EC] bg-[#F7F8FA] p-2.5 transition hover:border-[#C7FF2F] sm:w-[260px]"
            >
              <CoverThumb src={a.image} className="size-14 rounded-lg sm:size-16" sizes="64px" />
              <div className="min-w-0 py-0.5">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#5BA800]">
                  {a.category || 'Player Story'}
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug tracking-[-0.02em] text-[#111318] group-hover:text-[#5BA800]">
                  {a.title}
                </p>
                <p className="mt-1 text-[11px] text-[#969AA3]">{a.publishedAt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function PlayerStoryPage({ articles }: { articles: CardArticle[] }) {
  const items = articles.filter(
    (a) => a.game === 'Player Story' || a.category === 'Players' || a.category === 'International'
  )
  const trending = items.slice(0, 8)

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-[#E4E7EC] bg-white">
          <div className="container-dz py-8 sm:py-10">
            <p className="eyebrow">Players · Stories · People</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-[-0.05em] text-[#111318] sm:text-4xl md:text-5xl">
                  Player Stories
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#5C6570] sm:text-base">
                  The people, journeys and moments shaping Indian esports.
                </p>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#969AA3]">
                {items.length} {items.length === 1 ? 'story' : 'stories'}
              </p>
            </div>
          </div>
        </section>

        <TrendingPlayersCarousel items={trending} />

        {!items.length ? (
          <div className="container-dz py-16">
            <EmptyState
              title="No player stories yet"
              body="Player stories will appear here when they are published."
              href="/"
              cta="Back to home"
            />
          </div>
        ) : (
          <section className="container-dz py-8 sm:py-10">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-5 bg-[#C7FF2F]" />
                <h2 className="text-lg font-black tracking-[-0.03em] text-[#111318] sm:text-xl">
                  Latest player stories
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((a) => (
                <PlayerStorySquareCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

function CategoryPage({ slug, articles }: { slug: string; articles: CardArticle[] }) {
  const bgmi = articles.filter((a) => a.game === 'BGMI')
  const freeFire = articles.filter((a) => a.game === 'Free Fire')
  const playerStories = articles.filter(
    (a) => a.game === 'Player Story' || a.category === 'Players' || a.category === 'International'
  )
  const items = slug === 'bgmi' ? bgmi : slug === 'free-fire' ? freeFire : playerStories
  const title = slug === 'bgmi' ? 'BGMI' : slug === 'free-fire' ? 'FREE FIRE' : 'PLAYER STORY'
  const desc =
    gameDescriptions[slug === 'bgmi' ? 'BGMI' : slug === 'free-fire' ? 'Free Fire' : 'Player Story']

  return (
    <>
      <Header />
      <Trending items={items.slice(0, 4).map((a) => ({ title: a.title, slug: a.slug }))} />
      <main className="container-dz py-12">
        <Breadcrumbs items={['Home', title]} />
        <CategoryBadge>{title}</CategoryBadge>
        <h1 className="display-title mt-4 max-w-4xl">{title}</h1>
        <p className="mt-5 max-w-xl text-lg leading-7 text-[#5C6570]">{desc}</p>
        {items.length ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((a, i) => (
              <ArticleCard key={a.id} article={a} variant={i === 0 ? 'large' : 'medium'} />
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState title={`No ${title} stories yet`} body="Check back soon for new coverage in this section." href="/" cta="Back to home" />
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

function ArticlePage({ article, related }: { article: ArticleDetail; related: CardArticle[] }) {
  const a = article
  const body = a.content?.trim() || ''
  const hasBody = Boolean(body)
  const dek = a.excerpt?.trim()

  return (
    <>
      <Header />
      <main className="container-dz overflow-x-hidden py-6 sm:py-8 md:py-10">
        <Breadcrumbs items={['Home', a.game, a.category, 'Article']} />
        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,800px)_280px] lg:justify-center lg:gap-10">
          <article className="min-w-0">
            <CategoryBadge>
              {a.game} • {a.category}
            </CategoryBadge>
            <h1 className="mt-3 max-w-4xl text-[1.55rem] font-black leading-[1.15] tracking-[-0.04em] text-[#111318] [overflow-wrap:anywhere] sm:mt-4 sm:text-4xl sm:leading-[1.08] sm:tracking-[-0.055em] md:text-5xl lg:text-6xl">
              {a.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5C6570] sm:mt-5 sm:text-sm">
              <span>By {a.author}</span>
              <span className="text-[#D0D5DD]">·</span>
              <span>{a.publishedAt}</span>
              <span className="text-[#D0D5DD]">·</span>
              <span>{a.readingTime}</span>
            </div>
            <div className="mt-5 sm:mt-6">
              <ShareNewsButton title={a.title} excerpt={dek} slug={a.slug} />
            </div>
            {dek ? (
              <div
                data-speakable
                className="mt-6 rounded-2xl border border-[#C7FF2F]/50 bg-[#C7FF2F]/[.12] p-4 sm:mt-8 sm:p-5"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5BA800]">Key takeaway</p>
                <p className="mt-2 text-base font-semibold leading-7 text-[#111318] sm:text-lg sm:leading-8">
                  {dek}
                </p>
              </div>
            ) : null}
            <CoverMedia
              src={a.image}
              alt={a.title}
              className="mt-6 overflow-hidden rounded-xl border border-[#E4E7EC] sm:mt-8 sm:rounded-2xl"
            />
            <div className="mt-8 border-t border-[#E4E7EC] pt-6 sm:mt-10 sm:pt-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5BA800]">Full story</p>
              <div className="prose-dz md-article mt-4 min-w-0 sm:mt-5">
                {hasBody ? (
                  <MarkdownContent content={body} />
                ) : (
                  <p className="rounded-2xl border border-dashed border-[#E4E7EC] bg-white p-5 text-sm text-[#5C6570]">
                    No article body saved yet. Open Admin → Articles → edit this story and paste Markdown, then set status to{' '}
                    <strong>published</strong>.
                  </p>
                )}
              </div>
            </div>
            <section className="mt-8 rounded-2xl border border-[#E4E7EC] bg-white p-4 sm:p-5" aria-labelledby="sources-heading">
              <h2 id="sources-heading" className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5BA800]">
                Sources & citations
              </h2>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-[#3D4450]">
                <li>
                  <cite className="not-italic font-semibold text-[#111318]">Indian eSports Express</cite>
                  {' — '}
                  editorial reporting and verification for this story.
                </li>
                {(a.sourceName || a.sourceUrl) && (
                  <li>
                    <blockquote className="border-l-2 border-[#C7FF2F] pl-3">
                      <cite className="not-italic font-semibold text-[#111318]">
                        {a.sourceName || 'Original source report'}
                      </cite>
                      {a.sourceUrl ? (
                        <>
                          {' — '}
                          <Link
                            href={a.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[#5BA800] underline-offset-2 hover:underline"
                          >
                            View original report
                          </Link>
                        </>
                      ) : null}
                    </blockquote>
                  </li>
                )}
              </ul>
            </section>
            <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-4 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <p className="text-sm font-bold text-[#111318]">Like this story?</p>
                <p className="mt-1 text-sm text-[#5C6570]">Share it with your squad.</p>
              </div>
              <ShareNewsButton title={a.title} excerpt={dek} slug={a.slug} />
            </div>
          </article>
          <aside className="hidden min-w-0 lg:block">
            <div className="space-y-4 lg:sticky lg:top-28 lg:space-y-6">
              <div>
                <CategoryBadge>Keep reading</CategoryBadge>
                <p className="mt-2 text-sm text-[#5C6570] sm:mt-3">More stories from Indian eSports Express.</p>
              </div>
              <div className="grid gap-1 sm:gap-0">
                {related.slice(0, 4).map((x) => (
                  <ArticleCard key={x.id} article={x} variant="horizontal" />
                ))}
              </div>
            </div>
          </aside>
        </div>
        {related.length > 0 && (
          <section className="mt-10 border-t border-[#E4E7EC] pt-8 lg:hidden">
            <SectionHeader label="Related" title="Keep reading" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {related.slice(0, 4).map((a) => (
                <ArticleCard key={`m-${a.id}`} article={a} variant="medium" />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

function SearchPage({ articles }: { articles: CardArticle[] }) {
  const [q, setQ] = useState('')
  const results = useMemo(
    () =>
      q
        ? articles.filter((a) => `${a.title} ${a.game} ${a.category} ${a.excerpt}`.toLowerCase().includes(q.toLowerCase()))
        : articles,
    [q, articles]
  )

  return (
    <>
      <Header />
      <main className="container-dz py-12">
        <Breadcrumbs items={['Home', 'Search']} />
        <CategoryBadge>Search</CategoryBadge>
        <h1 className="display-title mt-4">Find your next story.</h1>
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#D0D5DD] bg-white px-5 py-4">
          <Search className="text-[#5BA800]" />
          <label className="sr-only" htmlFor="search-input">
            Search
          </label>
          <input
            id="search-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search published stories..."
            className="w-full bg-transparent outline-none placeholder:text-[#5C6570]"
          />
        </div>
        {results.length ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#F0F2F5]">
              <Search className="text-[#5C6570]" />
            </div>
            <h2 className="mt-5 text-2xl font-bold">No stories found</h2>
            <p className="mt-2 text-[#5C6570]">Try another search.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

function Guides({ articles }: { articles: CardArticle[] }) {
  const guides = articles.filter((a) => a.category === 'Guides' || a.tags.some((t) => /guide|tips|settings/i.test(t)))
  return (
    <>
      <Header />
      <main className="container-dz py-12">
        <Breadcrumbs items={['Home', 'Guides']} />
        <CategoryBadge>Knowledge base</CategoryBadge>
        <h1 className="display-title mt-4">Play smarter.</h1>
        <p className="mt-5 max-w-xl text-lg leading-7 text-[#5C6570]">Practical guides from Indian eSports Express editorial.</p>
        {guides.length ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState title="No guides yet" body="Guides will appear here when they are published." href="/" cta="Back to home" />
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

function About({ contact = false }: { contact?: boolean }) {
  return (
    <>
      <Header />
      <main className="container-dz py-12">
        <Breadcrumbs items={['Home', contact ? 'Contact' : 'About Indian eSports Express']} />
        <CategoryBadge>{contact ? 'Get in touch' : 'The publication'}</CategoryBadge>
        <h1 className="display-title mt-4 max-w-4xl">{contact ? 'Let’s talk esports.' : 'About Indian eSports Express'}</h1>
        <p className="mt-6 max-w-2xl text-xl leading-8 text-[#5C6570]">
          {contact
            ? 'Tell us what you are building, covering or playing. Our editorial desk usually responds within two business days.'
            : 'Indian eSports Express is an independent esports publication focused on bringing Indian gamers the latest news, tournament updates, player stories and esports information.'}
        </p>
        {contact ? (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_.65fr]">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 rounded-2xl border border-[#E4E7EC] bg-white p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold">
                  Name
                  <input className="mt-2 w-full rounded-xl border border-[#E4E7EC] bg-[#F0F2F5] px-4 py-3 outline-none focus:border-[#C7FF2F]" placeholder="Your name" />
                </label>
                <label className="text-sm font-semibold">
                  Email
                  <input type="email" className="mt-2 w-full rounded-xl border border-[#E4E7EC] bg-[#F0F2F5] px-4 py-3 outline-none focus:border-[#C7FF2F]" placeholder="you@example.com" />
                </label>
              </div>
              <label className="block text-sm font-semibold">
                Subject
                <input className="mt-2 w-full rounded-xl border border-[#E4E7EC] bg-[#F0F2F5] px-4 py-3 outline-none focus:border-[#C7FF2F]" placeholder="How can we help?" />
              </label>
              <label className="block text-sm font-semibold">
                Message
                <textarea rows={6} className="mt-2 w-full rounded-xl border border-[#E4E7EC] bg-[#F0F2F5] px-4 py-3 outline-none focus:border-[#C7FF2F]" placeholder="Your message" />
              </label>
              <button className="rounded-full bg-[#C7FF2F] px-5 py-3 text-sm font-bold text-[#08090B]">
                Send Message <Send size={14} className="ml-1 inline" />
              </button>
            </form>
            <div className="space-y-5">
              <div>
                <CategoryBadge>Editorial</CategoryBadge>
                <p className="mt-2 text-[#5C6570]">{contactEmails.editorial}</p>
              </div>
              <div>
                <CategoryBadge>Business</CategoryBadge>
                <p className="mt-2 text-[#5C6570]">{contactEmails.business}</p>
              </div>
              <div>
                <CategoryBadge>Partnerships</CategoryBadge>
                <p className="mt-2 text-[#5C6570]">{contactEmails.partnerships}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {aboutSections.map((s) => (
              <div key={s.title} className="rounded-2xl border border-[#E4E7EC] bg-white p-6">
                <CategoryBadge>{s.title}</CategoryBadge>
                <p className="mt-5 leading-7 text-[#5C6570]">{s.body}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const isPrivacy = kind === 'privacy'
  return (
    <>
      <Header />
      <main className="container-dz py-10 sm:py-12">
        <Breadcrumbs items={['Home', isPrivacy ? 'Privacy' : 'Terms']} />
        <CategoryBadge>Legal</CategoryBadge>
        <h1 className="display-title mt-4 max-w-4xl">{isPrivacy ? 'Privacy Policy' : 'Terms of Use'}</h1>
        <p className="mt-4 text-sm text-[#5C6570]">Last updated: 9 September 2026 · Applies in India (en-IN).</p>
        <div className="prose-dz mt-8 max-w-3xl space-y-6">
          {isPrivacy ? (
            <>
              <p>
                Indian eSports Express (“we”) publishes esports news for readers in India and worldwide. This policy
                explains what limited data we may process when you visit the site or contact us.
              </p>
              <h2>What we collect</h2>
              <p>
                We may collect basic analytics (pages viewed, device/browser type), contact details you send us
                voluntarily, and technical logs needed to keep the site secure.
              </p>
              <h2>How we use information</h2>
              <p>
                To operate and improve the publication, respond to editorial or business messages, and protect against
                abuse. We do not sell personal data.
              </p>
              <h2>Contact</h2>
              <p>
                Questions: <a href={`mailto:${contactEmails.editorial}`}>{contactEmails.editorial}</a> or{' '}
                <Link href="/contact">/contact</Link>.
              </p>
            </>
          ) : (
            <>
              <p>
                By using Indian eSports Express you agree to these terms. Content is for informational purposes and may
                include commentary on public esports events, players and teams.
              </p>
              <h2>Content</h2>
              <p>
                Articles, branding and site design are owned by Indian eSports Express unless otherwise credited. Do not
                scrape or republish our work without permission.
              </p>
              <h2>Accuracy</h2>
              <p>
                We aim for accurate reporting and cite sources where relevant. Competitive gaming results can change
                quickly; verify critical details with official organisers when needed.
              </p>
              <h2>Contact</h2>
              <p>
                Legal or rights requests: <a href={`mailto:${contactEmails.business}`}>{contactEmails.business}</a>.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function ComingSoon({ label }: { label: string }) {
  return (
    <>
      <Header />
      <main className="container-dz py-16">
        <EmptyState title={`${label} coming soon`} body="This section will go live when we add live data. For now, follow the latest stories on Home." href="/" cta="Back to home" />
      </main>
      <Footer />
    </>
  )
}

function App({ initialPath = '/', dynamicArticles = [], articleDetail }: AppProps) {
  const articles = dynamicArticles
  const path = initialPath

  if (path === '/') return <Home articles={articles} />
  if (path === '/player-story' || path === '/esports') return <PlayerStoryPage articles={articles} />
  if (path === '/bgmi' || path === '/free-fire') return <CategoryPage slug={path.slice(1)} articles={articles} />
  if (path === '/search') return <SearchPage articles={articles} />
  if (path === '/guides') return <Guides articles={articles} />
  if (path === '/about') return <About />
  if (path === '/contact') return <About contact />
  if (path === '/privacy') return <LegalPage kind="privacy" />
  if (path === '/terms') return <LegalPage kind="terms" />
  if (path === '/players' || path.startsWith('/players/')) return <ComingSoon label="Players" />
  if (path.startsWith('/teams')) return <ComingSoon label="Teams" />
  if (path.startsWith('/tournaments')) return <ComingSoon label="Tournaments" />
  if (path.startsWith('/articles/')) {
    if (!articleDetail) {
      return (
        <>
          <Header />
          <main className="container-dz py-16">
            <EmptyState title="Article not found" body="This story is missing or not published." href="/" cta="Back to home" />
          </main>
          <Footer />
        </>
      )
    }
    return <ArticlePage article={articleDetail} related={articles.filter((x) => x.slug !== articleDetail.slug).slice(0, 3)} />
  }
  if (path.startsWith('/admin')) {
    return (
      <>
        <Header />
        <main className="container-dz py-16">
          <EmptyState title="Page not found" body="This page is not available from here." href="/" cta="Back to home" />
        </main>
        <Footer />
      </>
    )
  }
  return <Home articles={articles} />
}

export default App
