'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function SignOutButton() {
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={signOut}
      className="rounded-full border border-[#272A31] px-3 py-1.5 text-xs font-bold text-[#969AA3] hover:border-[#C7FF2F] hover:text-[#C7FF2F]"
    >
      Sign out
    </button>
  )
}
