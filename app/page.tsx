'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setLoadingAuth(false)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
      setLoadingAuth(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Background Radial Glow & Grid Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Navigation Header with Quick Return Options */}
      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10 sticky top-0 shadow-sm">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2 hover:opacity-80 transition">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
        <div className="flex gap-4 items-center text-xs font-semibold">
          {!loadingAuth && (
            isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="text-emerald-800 hover:underline flex items-center gap-1 font-bold"
                >
                  👤 My Profile
                </Link>
                <Link
                  href="/competition/submit"
                  className="text-emerald-800 hover:underline"
                >
                  + Log Action
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-red-600 hover:underline font-medium px-2 py-1"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-[#0f382c] transition px-2 py-1"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-[#0f382c] transition px-2 py-1"
                >
                  Contact
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-medium text-foreground hover:text-[#0f382c] transition px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-semibold bg-[#0f382c] text-white px-5 py-2.5 rounded-full hover:bg-emerald-900 transition shadow-md shadow-emerald-900/10"
                >
                  Get Started
                </Link>
              </>
            )
          )}
        </div>
      </header>

      {/* Hero Section with Interactive Glow Hover Effects */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-5xl mx-auto z-10 w-full space-y-12">
        <div className="flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100/80 text-[#0f382c] rounded-full mb-6 border border-emerald-200/60 shadow-sm backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-emerald-600 animate-ping" />
            Sustainable Development & Strategy
          </span>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl mb-4 text-foreground">
            The Complete Platform Uniting People, Communities & Institutions for Sustainable Action.
          </h1>

          {/* Sub-headline */}
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8 font-normal">
            Green Collective provides the habit analytics, engagement tools, and environmental strategy needed to power sustainable progress across all levels.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
            <Link
              href="/habits"
              className="bg-[#0f382c] text-white font-semibold px-8 py-4 rounded-full hover:bg-emerald-900 hover:scale-[1.02] transition-all duration-200 text-center shadow-lg shadow-emerald-950/20"
            >
              Start Logging Habits
            </Link>
            <Link
              href="/institution"
              className="border border-emerald-900/20 bg-background/60 backdrop-blur font-semibold px-8 py-4 rounded-full hover:bg-emerald-50/80 hover:scale-[1.02] transition-all duration-200 text-center shadow-sm"
            >
              Explore Enterprise Solutions
            </Link>
          </div>

          {/* Interactive Feature Pillar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
            {/* Pillar 1: Habit Analytics */}
            <Link
              href="/habits"
              className="group p-6 border border-emerald-900/10 hover:border-emerald-600/40 rounded-2xl bg-card/80 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="text-3xl mb-3 p-3 bg-emerald-500/10 w-fit rounded-xl group-hover:scale-110 transition-transform duration-200">⚡</div>
                <h2 className="font-bold text-lg mb-2 text-foreground flex items-center justify-between">
                  Habit Analytics
                  <span className="text-xs text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0">Explore &rarr;</span>
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Log green choices, track personal progress metrics, and evaluate measured impact to build lasting momentum across your network.
                </p>
              </div>
            </Link>

            {/* Pillar 2: Institutional Strategy */}
            <Link
              href="/institution"
              className="group p-6 border border-emerald-900/10 hover:border-emerald-600/40 rounded-2xl bg-card/80 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="text-3xl mb-3 p-3 bg-emerald-500/10 w-fit rounded-xl group-hover:scale-110 transition-transform duration-200">📊</div>
                <h2 className="font-bold text-lg mb-2 text-foreground flex items-center justify-between">
                  Institutional Strategy
                  <span className="text-xs text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0">Explore &rarr;</span>
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Empower institutions of all levels—from schools to global enterprises—with actionable, full-scope environmental data and behavioral insights.
                </p>
              </div>
            </Link>

            {/* Pillar 3: Ecological Coexistence */}
            <Link
              href="/coexistence"
              className="group p-6 border border-emerald-900/10 hover:border-emerald-600/40 rounded-2xl bg-card/80 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="text-3xl mb-3 p-3 bg-emerald-500/10 w-fit rounded-xl group-hover:scale-110 transition-transform duration-200">🌿</div>
                <h2 className="font-bold text-lg mb-2 text-foreground flex items-center justify-between">
                  Ecological Coexistence
                  <span className="text-xs text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0">Explore &rarr;</span>
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Connect seamlessly with peers, communities, and global institutions. Share knowledge, join collective initiatives, and scale impact through a unified network.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Rich Footer with Navigation Backlinks */}
      <footer className="py-8 px-6 text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/80 backdrop-blur-md z-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Green Collective. All rights reserved.</span>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/" className="hover:text-[#0f382c] transition">Home</Link>
            <Link href="/about" className="hover:text-[#0f382c] transition">About Us</Link>
            <Link href="/contact" className="hover:text-[#0f382c] transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
