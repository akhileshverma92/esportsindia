'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }
    router.replace('/admin')
    router.refresh()
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#08090B] px-5">
      <div className="w-full max-w-md rounded-2xl border border-[#272A31] bg-[#101216] p-8">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Indian eSports Express"
            width={48}
            height={48}
            className="rounded-full object-cover"
            priority
          />
          <span className="font-black tracking-[-.08em] text-xl">Indian eSports Express</span>
        </Link>
        <h1 className="mt-8 text-2xl font-black tracking-tight">Studio login</h1>
        <p className="mt-2 text-sm text-[#969AA3]">Sign in with your admin email and password.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 outline-none focus:border-[#C7FF2F]"
              placeholder="editor@indianesportsexpress.in"
            />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#272A31] bg-[#16181D] px-4 py-3 outline-none focus:border-[#C7FF2F]"
              placeholder="••••••••"
            />
          </label>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-full bg-[#C7FF2F] px-5 py-3 text-sm font-bold text-[#08090B] disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
