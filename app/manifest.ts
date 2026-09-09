import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/markdown-seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Indian eSports Express',
    short_name: 'IEE',
    description: "India's English esports news hub for BGMI, Free Fire and competitive gaming.",
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F8FA',
    theme_color: '#C7FF2F',
    lang: 'en-IN',
    categories: ['news', 'sports', 'entertainment'],
    icons: [
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    id: siteUrl(),
  }
}
