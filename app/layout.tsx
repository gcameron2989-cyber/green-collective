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
    default: 'Green Collective | Sustainable Development, Strategy & Action',
    template: '%s | Green Collective',
  },
  description:
    'The platform uniting people, communities, and institutions for sustainable progress.',
  keywords: [
    'green collective',
    'sustainable development platform',
    'sustainability strategy software',
    'ecological coexistence network',
    'scope 3 engagement platform',
    'enterprise sustainability hub',
    'community environmental action',
    'sustainable habit analytics',
  ],
  alternates: {
    canonical: 'https://www.greencollective.ca',
  },
  openGraph: {
    title: 'Green Collective | Sustainable Development, Strategy & Action',
    description:
      'The platform uniting people, communities, and institutions for sustainable progress.',
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
  // Schema markup payload for Google indexing
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Green Collective',
    url: 'https://www.greencollective.ca',
    logo: 'https://www.greencollective.ca/logo.png',
    sameAs: [
      'https://www.linkedin.com/company/greencollective',
      'https://github.com/greencollective',
    ],
    description:
      'The platform uniting people, communities, and institutions for sustainable progress.',
  }

  return (
    <html lang="en" className={`${dmSans.variable} ${bricolage.variable} bg-background`}>
      <head>
        {/* ADDITION: Standard structured data injection for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
