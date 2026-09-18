"use client";

import React from "react";
import Link from "next/link";

export default function CoexistencePage() {
  return (
    <div className="min-h-screen text-foreground flex flex-col justify-between relative overflow-hidden bg-white">
      {/* Background FX */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none z-0" />
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

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 z-10 space-y-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100/90 text-[#0f382c] rounded-full mb-3 border border-emerald-200/80 backdrop-blur-md shadow-sm">
            🌿 Pillar 3: Ecological Coexistence
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0f382c]">Community Network & Live Action Feed</h1>
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

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/80 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  );
}
