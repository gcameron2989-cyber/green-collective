import './globals.css'

export const metadata = {
  title: 'Green Collective | Sustainability Platform',
  description: 'Uniting people, communities, and institutions for sustainable action.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#071914] text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
