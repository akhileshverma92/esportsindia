import { NextResponse } from 'next/server'
import { findPlayerProfile } from '@/lib/player-find'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const name = typeof body?.name === 'string' ? body.name : ''
    const forceRefresh = Boolean(body?.forceRefresh)

    if (!name.trim()) {
      return NextResponse.json({ error: 'Player name is required' }, { status: 400 })
    }

    const data = await findPlayerProfile(name, { forceRefresh })
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Player search failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
