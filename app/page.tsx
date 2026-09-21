'use client'

import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground flex flex-col justify-between relative overflow-hidden bg-white">
      {/* Exact Grid Square Pattern Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Absolute Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-5xl mx-auto z-10 w-full space-y-12">
        <div className="flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100/90 text-[#0f382c] rounded-full mb-6 border border-emerald-200/80 shadow-sm backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-emerald-600 animate-ping" />
            Sustainable Development & Strategy
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl mb-4 text-foreground">
            The Complete Platform Uniting People, Communities & Institutions for Sustainable Action.
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8 font-normal">
            Green Collective provides the habit analytics, engagement tools, and environmental strategy needed to power sustainable progress across all levels.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
            <Link
              href="/habits"
              className="bg-[#0f382c] text-white font-semibold px-8 py-4 rounded-full hover:bg-emerald-900 hover:scale-[1.02] transition-all duration-200 text-center shadow-lg shadow-emerald-950/20"
            >
              Start Logging Habits
            </Link>
            <Link
              href="/institution"
              className="border border-emerald-900/20 bg-background/80 backdrop-blur font-semibold px-8 py-4 rounded-full hover:bg-emerald-50/80 hover:scale-[1.02] transition-all duration-200 text-center shadow-sm"
            >
              Explore Enterprise Solutions
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
            <Link
              href="/habits"
              className="group p-6 border border-emerald-900/10 hover:border-emerald-600/40 rounded-2xl bg-card/90 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
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

            <Link
              href="/institution"
              className="group p-6 border border-emerald-900/10 hover:border-emerald-600/40 rounded-2xl bg-card/90 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
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

            <Link
              href="/coexistence"
              className="group p-6 border border-emerald-900/10 hover:border-emerald-600/40 rounded-2xl bg-card/90 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
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

   
    </div>
  )
}
