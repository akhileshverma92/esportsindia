import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/admin/sign-out-button'

const nav = [
  ['Dashboard', '/admin'],
  ['Articles', '/admin/articles'],
  ['Player Stories', '/admin/player-stories'],
  ['New article', '/admin/articles/new'],
  ['New player story', '/admin/player-stories/new'],
  ['AI Queue', '/admin/ai-queue'],
] as const

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // login page is outside this layout group? It's under /admin/login - need to exclude
  // We'll use a route group instead. For now check path via... we can't easily.
  // Put login outside: app/admin/(auth)/login vs app/admin/(studio)/layout
  // Simpler: if no user, children for login page handle themselves; layout still wraps.
  // Actually login is at app/admin/login/page.tsx which WILL use this layout.
  // Fix: use route groups.

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F5F5]">
      {user ? (
        <div>
          <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[#272A31] bg-[#101216] p-6 lg:block">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Indian eSports Express"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="font-black tracking-[-.08em] text-xl">Studio</span>
            </Link>
            <p className="mt-10 text-[10px] font-bold uppercase tracking-[.18em] text-[#969AA3]">Workspace</p>
            <nav className="mt-4 space-y-1">
              {nav.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="block rounded-xl px-3 py-3 text-sm font-semibold text-[#969AA3] hover:bg-[#16181D] hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-6 left-6 right-6 border-t border-[#272A31] pt-5 text-xs text-[#969AA3]">
              <p className="truncate">{user.email}</p>
              <div className="mt-3">
                <SignOutButton />
              </div>
            </div>
          </aside>
          <main className="lg:pl-64">
            <div className="border-b border-[#272A31] px-5 py-4 lg:px-12">
              <div className="flex items-center justify-between lg:hidden">
                <Link href="/" className="inline-flex items-center gap-2">
                  <Image
                    src="/images/logo.png"
                    alt="Indian eSports Express"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <span className="font-black tracking-[-.08em]">Studio</span>
                </Link>
                <SignOutButton />
              </div>
              <nav className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                {nav.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="whitespace-nowrap rounded-full border border-[#272A31] px-3 py-2 text-xs font-semibold text-[#969AA3] hover:border-[#C7FF2F] hover:text-[#C7FF2F]"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="px-5 py-8 lg:px-12 lg:py-10">{children}</div>
          </main>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
