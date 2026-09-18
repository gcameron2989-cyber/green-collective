'use client'

import React from 'react'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10 sticky top-0 shadow-sm">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2 hover:opacity-80 transition">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
        <div className="flex gap-4 items-center text-xs font-semibold">
          <Link href="/" className="text-muted-foreground hover:text-[#0f382c] transition px-2 py-1">Home</Link>
          <Link href="/dashboard" className="text-muted-foreground hover:text-[#0f382c] transition px-2 py-1">Dashboard</Link>
          <Link href="/about" className="text-muted-foreground hover:text-[#0f382c] transition px-2 py-1">About</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-16 text-foreground z-10 w-full flex-1">
        <h1 className="text-3xl font-extrabold mb-4 text-[#0f382c]">Contact Us</h1>
        <p className="text-muted-foreground mb-4">
          Have questions about the Green Collective platform, institutional challenges, or technical support? 
        </p>
        <p className="text-foreground font-semibold">
          Reach out to our team directly at: <a href="mailto:support@greencollective.ca" className="text-emerald-700 underline">support@greencollective.ca</a>
        </p>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/80 backdrop-blur-md z-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Green Collective. All rights reserved.</span>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/" className="hover:text-[#0f382c] transition">Home</Link>
            <Link href="/dashboard" className="hover:text-[#0f382c] transition">Dashboard</Link>
            <Link href="/about" className="hover:text-[#0f382c] transition">About Us</Link>
            <Link href="/contact" className="hover:text-[#0f382c] transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
