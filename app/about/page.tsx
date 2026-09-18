'use client'

import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
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
          <Link href="/contact" className="text-muted-foreground hover:text-[#0f382c] transition px-2 py-1">Contact</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-foreground z-10 w-full flex-1">
        {/* Header Badge & Title */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-800 rounded-full mb-3 border border-emerald-500/20">
            🌱 Institutional Sustainability Architecture
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0f382c] mb-4">
            Redefining Collective Climate Action
          </h1>
          <p className="text-lg text-muted-foreground font-normal leading-relaxed">
            Green Collective is an advanced socio-technical platform engineered to bridge individual behavioral choices with large-scale institutional climate metrics. By transforming daily operational habits into quantifiable ecological impact, we empower organizations and academic networks to drive verifiable decarbonization.
          </p>
        </div>

        {/* Multi-faceted Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="p-6 rounded-2xl border border-emerald-900/10 bg-card/60 backdrop-blur shadow-sm">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-bold text-base text-foreground mb-2">Granular Habit Analytics</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our telemetry engine tracks micro-commitments—from transit optimization to zero-waste sorting—translating human behavior into rigorous, auditable CO₂ reduction figures.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-emerald-900/10 bg-card/60 backdrop-blur shadow-sm">
            <div className="text-2xl mb-3">🏛️</div>
            <h3 className="font-bold text-base text-foreground mb-2">Institutional Challenges</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We power faculty-wide and campus-wide competitive leaderboards, leveraging gamification and peer momentum to foster systemic environmental accountability.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-emerald-900/10 bg-card/60 backdrop-blur shadow-sm">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="font-bold text-base text-foreground mb-2">Scalable Infrastructure</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Built on high-performance modern web stacks and secure relational backends, Green Collective delivers real-time data synchronization for thousands of concurrent participants.
            </p>
          </div>
        </div>

        {/* Mission Statement Footer Box */}
        <div className="p-8 rounded-2xl bg-emerald-950/5 border border-emerald-900/10">
          <h2 className="text-xl font-bold text-[#0f382c] mb-3">Our Mission</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We believe that combating climate change requires transparent, frictionless systems that reward collective participation. By replacing fragmented tracking with unified institutional telemetry, Green Collective sets a new standard for how communities measure, visualize, and accelerate their sustainable future.
          </p>
        </div>
      </main>

      {/* Footer */}
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
