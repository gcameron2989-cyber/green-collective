'use client'

import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Streamlined Header */}
      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10 sticky top-0 shadow-sm">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2 hover:opacity-80 transition">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-[#0f382c] transition">Home</Link>
          <Link href="/about" className="text-[#0f382c] font-bold">About</Link>
          <Link href="/contact" className="hover:text-[#0f382c] transition">Contact</Link>
        </nav>

        <div className="flex gap-4 items-center text-xs font-semibold">
          <Link href="/login" className="text-sm font-semibold bg-[#0f382c] text-white px-5 py-2.5 rounded-full hover:bg-emerald-900 transition shadow-md">
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-4xl mx-auto z-10 w-full space-y-8">
        <h1 className="text-3xl font-extrabold text-[#0f382c]">About Green Collective</h1>
        <p className="text-muted-foreground leading-relaxed text-center">
          Green Collective bridges individual behavioral choices with large-scale institutional climate metrics. By transforming daily operational habits into quantifiable ecological impact, we empower networks to drive verifiable decarbonization.
        </p>
      </main>

      {/* Minimalist Footer */}
      <footer className="py-6 px-6 text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/80 backdrop-blur-md z-10 text-center">
        <span>© {new Date().getFullYear()} Green Collective. All rights reserved.</span>
      </footer>
    </div>
  )
}
