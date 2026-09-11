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
    default: 'Green Collective | Track & Log Climate Habits',
    template: '%s | Green Collective',
  },
  description:
    'Green Collective is an eco-action platform where users log sustainable habits, track CO2 savings, and join local climate groups.',
  keywords: ['green collective', 'eco habit tracker', 'climate action', 'sustainability app'],
  alternates: {
    canonical: 'https://www.greencollective.ca',
  },
  openGraph: {
    title: 'Green Collective | Track & Log Climate Habits',
    description: 'Log daily sustainable habits, earn eco-points, and measure your climate impact.',
    url: 'https://www.greencollective.ca',
    siteName: 'Green Collective',
    locale: 'en_CA',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
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
