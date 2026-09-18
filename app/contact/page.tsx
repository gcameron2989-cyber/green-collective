'use client'

import React from 'react'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden flex flex-col items-center w-full px-6 py-16">
      {/* Background Radial Glow & Grid Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto z-10 w-full text-center space-y-6 mb-16">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100/80 text-[#0f382c] rounded-full border border-emerald-200/60 shadow-sm backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-emerald-600 animate-ping" />
          Get in Touch
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0f382c]">
          Connect With Our Team
        </h1>

        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
          Have questions about institutional integration, custom habit analytics, or community partnerships? Our team is here to help you drive verifiable impact.
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="max-w-4xl mx-auto z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="p-8 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-3xl mb-3 p-3 bg-emerald-500/10 w-fit rounded-xl">✉️</div>
            <h3 className="font-bold text-lg mb-2 text-foreground">Direct Support</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              For general inquiries, account assistance, or technical support regarding habit tracking.
            </p>
            <span className="text-sm font-semibold text-[#0f382c]">support@greencollective.ca</span>
          </div>
        </div>

        <div className="p-8 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-3xl mb-3 p-3 bg-emerald-500/10 w-fit rounded-xl">🏛️</div>
            <h3 className="font-bold text-lg mb-2 text-foreground">Institutional Partnerships</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              For universities, campuses, and enterprises looking to deploy full-scope ESG tracking metrics.
            </p>
            <span className="text-sm font-semibold text-[#0f382c]">partnerships@greencollective.ca</span>
          </div>
        </div>
      </div>

      {/* Action Banner */}
      <div className="max-w-3xl mx-auto z-10 w-full p-8 rounded-3xl bg-[#0f382c] text-white text-center space-y-4 shadow-xl shadow-emerald-950/20">
        <h3 className="text-2xl font-bold tracking-tight">Ready to jump right in?</h3>
        <p className="text-emerald-100/80 text-sm max-w-xl mx-auto">
          Explore our platform features or log your first sustainable habit today.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            href="/habits"
            className="bg-white text-[#0f382c] font-semibold px-6 py-3 rounded-full hover:bg-emerald-50 transition shadow-md text-xs"
          >
            Start Logging
          </Link>
          <Link
            href="/"
            className="border border-white/20 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition text-xs"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
