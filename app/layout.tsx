import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DROPZONE — India’s Esports News Hub',
  description: 'Premium coverage of BGMI, Free Fire and Indian esports.',
}
export const viewport: Viewport = { colorScheme:'dark', themeColor:'#08090B', width:'device-width', initialScale:1 }
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en" className="bg-[#08090B]"><body className="antialiased">{children}</body></html>
}
