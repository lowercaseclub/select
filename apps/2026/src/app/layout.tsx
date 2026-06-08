import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Providers } from '../components/providers'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f8f3ef',
}

export const metadata: Metadata = {
  title: 'Supabase Select',
  description:
    'Select is in person and application only. One day, October 2, in San Francisco — where builders come to learn what is next in Postgres.',
  metadataBase: new URL(
    `https://${
      process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      'select.supabase.com'
    }`
  ),
  openGraph: {
    title: 'Supabase Select',
    description:
      'Select is in person and application only. One day, October 2, in San Francisco.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Supabase Select',
    description:
      'Select is in person and application only. One day, October 2, in San Francisco.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-cream font-sans text-black antialiased">
        {process.env.VERCEL_ENV !== 'production' && (
          <Script src="/react-grab.js" strategy="afterInteractive" />
        )}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
