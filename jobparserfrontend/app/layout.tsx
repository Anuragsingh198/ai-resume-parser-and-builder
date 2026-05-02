import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'JobHunch | Smart Job Search & Parsing',
  description: 'The easiest way to find and list jobs. AI-powered parsing for instant job listings.',
  generator: 'JobHunch',
  icons: {
    icon: [
      {
        url: '/JH.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/JH.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/JH.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
