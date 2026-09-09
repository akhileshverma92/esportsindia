import { NextResponse } from 'next/server'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

function extFor(type: string) {
  if (type === 'image/png') return 'png'
  if (type === 'image/webp') return 'webp'
  if (type === 'image/gif') return 'gif'
  return 'jpg'
}

async function saveLocally(file: File, userId: string) {
  const ext = extFor(file.type)
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const dir = path.join(process.cwd(), 'public', 'uploads', 'covers', userId)
  await mkdir(dir, { recursive: true })
  const full = path.join(dir, name)
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(full, buffer)
  return `/uploads/covers/${userId}/${name}`
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: 'Use JPG, PNG, WEBP or GIF' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 })
  }

  const ext = extFor(file.type)
  const storagePath = `covers/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage.from('covers').upload(storagePath, buffer, {
    contentType: file.type,
    upsert: false,
  })

  if (!error) {
    const { data } = supabase.storage.from('covers').getPublicUrl(storagePath)
    return NextResponse.json({ url: data.publicUrl, path: storagePath, storage: 'supabase' })
  }

  // Bucket missing / RLS — fall back to local public folder so Studio still works
  if (/bucket|not found|row-level security|policy|jwt/i.test(error.message)) {
    try {
      const url = await saveLocally(file, user.id)
      return NextResponse.json({
        url,
        path: url,
        storage: 'local',
        warning:
          'Saved locally. For production, create a public Storage bucket named "covers" in Supabase (see supabase/COVERS_STORAGE.sql).',
      })
    } catch (localErr) {
      const msg = localErr instanceof Error ? localErr.message : 'Local save failed'
      return NextResponse.json(
        {
          error: `Supabase Storage bucket "covers" is missing (${error.message}). Local fallback also failed: ${msg}`,
        },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ error: error.message }, { status: 500 })
}
