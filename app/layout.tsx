'use client'

import Link from 'next/link'
import { Leaf, User, LayoutDashboard, ShieldCheck, ArrowLeft } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#071914] text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Professional Header Bar */}
      <header className="border-b border-emerald-500/20 bg-[#0a231b]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & Back Button */}
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-500/30"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Green Collective</span>
            </Link>

            <div className="h-4 w-px bg-emerald-500/20 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Leaf className="size-4 text-emerald-400" />
              </div>
              <span className="font-bold text-sm tracking-wide text-white">
                GC <span className="text-emerald-400 font-light">| Campus Hub</span>
              </span>
            </div>
          </div>

          {/* User / Org Metadata */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium bg-emerald-900/40 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
              <ShieldCheck className="size-3 text-emerald-400" />
              UBC Pilot • Faculty of Science
            </span>
            <div className="size-8 rounded-full bg-emerald-800/40 border border-emerald-500/40 flex items-center justify-center text-xs font-semibold text-emerald-200">
              ER
            </div>
          </div>

        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
