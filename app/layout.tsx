import type { Metadata, Viewport } from 'next'
import './globals.css'
import { buildPageMetadata, organizationJsonLd, websiteJsonLd, absoluteUrl } from '@/lib/seo'
import { siteUrl } from '@/lib/markdown-seo'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: 'Indian eSports Express — India’s Esports News Hub',
    description:
      'Premium English coverage of BGMI, Free Fire and Indian esports — news, results, players, teams and tournaments.',
    path: '/',
  }),
  metadataBase: new URL(siteUrl()),
  applicationName: 'Indian eSports Express',
  referrer: 'origin-when-cross-origin',
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [{ url: '/images/logo.png', type: 'image/png' }],
    apple: [{ url: '/images/logo.png' }],
    shortcut: '/images/logo.png',
  },
  manifest: '/manifest.webmanifest',
  other: {
    'geo.region': 'IN',
    'geo.placename': 'India',
    'geo.position': '20.5937;78.9629',
    ICBM: '20.5937, 78.9629',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#C7FF2F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = organizationJsonLd()
  const site = websiteJsonLd()

  return (
    <html lang="en-IN" className="bg-[#F7F8FA]">
      <head>
        <link rel="alternate" type="application/rss+xml" title="Indian eSports Express RSS" href="/rss.xml" />
        <link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
        <link rel="author" href="/humans.txt" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="coverage" content="India" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="true" />
        <link rel="me" href={absoluteUrl('/about')} />
      </head>
      <body className="antialiased text-[#111318]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }} />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
