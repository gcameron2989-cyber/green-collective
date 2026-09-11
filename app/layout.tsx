import type { Metadata, Viewport } from 'next'
import { DM_Sans, Bricolage_Grotesque } from 'next/font/google'
import { AuthProvider } from '@/components/auth/auth-provider'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.greencollective.ca'),
  title: {
    default: 'Green Collective | Share, Track & Inspire Climate Action',
    template: '%s | Green Collective',
  },
  description:
    'The social platform for sustainability. Share your everyday green habits, discover what friends and businesses are doing, track your environmental impact, and build a climate-focused community together.',
  keywords: [
    'green collective',
    'eco social network',
    'sustainability sharing',
    'climate action',
    'eco habit tracker',
    'corporate sustainability',
  ],
  alternates: {
    canonical: 'https://www.greencollective.ca',
  },
  openGraph: {
    title: 'Green Collective | Share, Track & Inspire Climate Action',
    description:
      'Share your eco-habits, explore community climate action, and track your environmental impact with friends and local businesses.',
    url: 'https://www.greencollective.ca',
    siteName: 'Green Collective',
    locale: 'en_CA',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: '5xgy3LOswrjRTjiRwg-FBGvxnLHoldySKNwCIw4233w',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0f382c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${bricolage.variable} bg-background`}>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
