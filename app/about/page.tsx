'use client'

import React from 'react'

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center w-full">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-4xl mx-auto z-10 w-full space-y-8">
        <h1 className="text-3xl font-extrabold text-[#0f382c]">About Green Collective</h1>
        <p className="text-muted-foreground leading-relaxed text-center">
          Green Collective bridges individual behavioral choices with large-scale institutional climate metrics. By transforming daily operational habits into quantifiable ecological impact, we empower networks to drive verifiable decarbonization.
        </p>
      </main>
    </div>
  )
}
