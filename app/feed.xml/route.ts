import { NextResponse } from 'next/server'
import { absoluteUrl } from '@/lib/seo'

/** Alias for feed readers that look for /feed.xml */
export async function GET() {
  return NextResponse.redirect(absoluteUrl('/rss.xml'), 308)
}
