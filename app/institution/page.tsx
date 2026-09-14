"use client";

import React from "react";
import Link from "next/link";

export default function InstitutionPage() {
  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
        <Link href="/dashboard" className="text-xs font-semibold px-3.5 py-1.5 bg-[#0f382c] text-white rounded-full hover:bg-emerald-900 transition">
          Go to Dashboard
        </Link>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 z-10 space-y-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-3 border border-emerald-200">
            📊 Pillar 2: Institutional Strategy
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Enterprise & Campus Scope 1–3 Analytics</h1>
        </div>

        {/* Macro Institutional Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur shadow-sm">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 block mb-1">Campus Scope 3 Savings</span>
            <div className="text-3xl font-extrabold text-[#0f382c]">1,284.5 <span className="text-sm font-normal text-muted-foreground">kg CO₂</span></div>
          </div>
          <div className="p-5 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur shadow-sm">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 block mb-1">Active Campus Engagement</span>
            <div className="text-3xl font-extrabold text-[#0f382c]">84%</div>
          </div>
          <div className="p-5 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur shadow-sm">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 block mb-1">Partner Institutions</span>
            <div className="text-3xl font-extrabold text-[#0f382c]">12</div>
          </div>
        </div>

        {/* Institution Leaderboard */}
        <div className="border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">Institutional Impact Ranking</h2>
          <div className="space-y-3">
            {[
              { rank: 1, name: "Faculty of Environmental Sciences", co2: "412.0 kg", active: 142 },
              { rank: 2, name: "Department of Economics", co2: "328.4 kg", active: 98 },
              { rank: 3, name: "Kitsilano Sustainability Chapter", co2: "294.1 kg", active: 76 },
            ].map((inst) => (
              <div key={inst.rank} className="p-4 rounded-xl border border-emerald-900/10 bg-background/60 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#0f382c] w-6">#{inst.rank}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{inst.name}</h3>
                    <span className="text-[10px] text-muted-foreground">{inst.active} active members</span>
                  </div>
                </div>
                <span className="font-extrabold text-emerald-800">{inst.co2}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  );
}
