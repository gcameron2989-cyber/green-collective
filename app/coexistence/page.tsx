"use client";

import React from "react";
import Link from "next/link";

export default function CoexistencePage() {
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
            🌿 Pillar 3: Ecological Coexistence
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Community Network & Live Action Feed</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Collective Activity Feed</h2>
            <div className="space-y-3">
              {[
                { name: "Alex M.", action: "Logged Zero-Emission Transit", time: "2 mins ago", co2: "2.4 kg" },
                { name: "Jordan K.", action: "Logged Plant-Based Meal Choice", time: "14 mins ago", co2: "1.6 kg" },
                { name: "Sam R.", action: "Logged Cold Water Wash", time: "1 hour ago", co2: "0.6 kg" },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-emerald-900/10 bg-background/60 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-foreground">{item.name}</span>
                    <span className="text-muted-foreground"> {item.action}</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">{item.time}</span>
                  </div>
                  <span className="font-bold text-emerald-800">-{item.co2}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Active Community Drives</h2>
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-100/40 text-xs mb-3">
              <span className="font-bold text-[#0f382c] block mb-1">Campus Transit Challenge</span>
              <p className="text-muted-foreground mb-2">Log 5 bike or transit commutes this week.</p>
              <span className="font-bold text-emerald-800">84% Goal Reached</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  );
}
