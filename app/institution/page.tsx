"use client";

import React from "react";
import Link from "next/link";

export default function InstitutionPage() {
  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
        <Link href="/dashboard" className="text-xs font-semibold px-3.5 py-1.5 bg-[#0f382c] text-white rounded-full hover:bg-emerald-900 transition">
          Go to Dashboard
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 z-10 space-y-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-3 border border-emerald-200">
            📊 Pillar 2: Institutional Strategy
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Enterprise & Campus Scope 1–3 Analytics</h1>
        </div>

        {/* Active UBC Challenge Banner Card */}
        <div className="border border-emerald-900/20 rounded-2xl bg-gradient-to-br from-[#0f382c] to-emerald-950 p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs tracking-wider uppercase">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Active Campus Competition
            </div>

            <h2 className="text-2xl md:text-3xl font-bold">
              UBC Sustainability Challenge 🏆
            </h2>

            <p className="text-emerald-100/80 text-xs md:text-sm max-w-2xl leading-relaxed">
              Faculty vs. Faculty competition tracking waste diversion, green transport, energy reduction, and campus cleanups in real time.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/competition"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-5 py-2.5 rounded-full transition shadow-md"
              >
                View Live Leaderboard →
              </Link>
              <Link
                href="/competition/submit"
                className="border border-emerald-400/30 bg-emerald-900/40 hover:bg-emerald-900/80 text-emerald-100 text-xs font-semibold px-5 py-2.5 rounded-full transition"
              >
                + Log Eco-Action
              </Link>
            </div>
          </div>
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

        {/* Institutional Leaderboard List */}
        <div className="border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-foreground">Institutional Impact Ranking</h2>
            <Link href="/competition" className="text-xs font-semibold text-emerald-700 hover:underline">
              See Full Competition Standings →
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { rank: 1, name: "Faculty of Science", co2: "412.0 kg", active: 142 },
              { rank: 2, name: "Faculty of Applied Science / Engineering", co2: "328.4 kg", active: 98 },
              { rank: 3, name: "Sauder School of Business", co2: "294.1 kg", active: 76 },
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

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  );
}
