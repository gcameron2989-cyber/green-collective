'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const DEMO_ACTIONS = [
  { id: 'sustainable-commute', name: 'Public / active transit', impact: 1.5, category: 'TRANSPORT' },
  { id: 'plant-based-meal', name: 'Plant-forward meal', impact: 1.2, category: 'FOOD' },
  { id: 'cold-water-laundry', name: 'Cold-water laundry', impact: 0.6, category: 'ENERGY' },
  { id: 'waste-sorting', name: 'Proper waste sorting', impact: 0.5, category: 'WASTE' },
];

const MAIN_ACTIONS = [
  {
    category: 'TRANSPORT',
    name: 'Public / active transportation',
    description: 'Replace a car trip with walking, cycling, transit, or another lower-impact option.',
    impact: '~1.5 kg CO₂e / trip',
    id: 'sustainable-commute',
  },
  {
    category: 'FOOD',
    name: 'Plant-forward meal',
    description: 'Choose a meal centred around plant-based ingredients.',
    impact: '~1.2 kg CO₂e / meal',
    id: 'plant-based-meal',
  },
  {
    category: 'WASTE',
    name: 'Waste sorting',
    description: 'Sort recyclable, compostable, and landfill materials correctly.',
    impact: '~0.5 kg CO₂e / action',
    id: 'waste-sorting',
  },
  {
    category: 'ENERGY',
    name: 'Cold-water laundry',
    description: 'Wash clothing using cold water instead of a hot cycle.',
    impact: '~0.6 kg CO₂e / load',
    id: 'cold-water-laundry',
  },
];

export default function HomePage() {
  const [selectedDemoActions, setSelectedDemoActions] = useState<string[]>([
    'sustainable-commute',
    'plant-based-meal',
  ]);

  const toggleDemoAction = (id: string) => {
    setSelectedDemoActions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculatedImpact = DEMO_ACTIONS.filter((action) =>
    selectedDemoActions.includes(action.id)
  )
    .reduce((sum, action) => sum + action.impact, 0)
    .toFixed(1);

  return (
    <main className="bg-[#f9f8f6] text-[#102f26] font-sans antialiased">
      {/* 1. HERO SECTION */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center md:px-10 md:py-28 lg:py-32">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-[#102f26]/15 bg-white/60 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#39705d]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#39705d] font-medium">
              Sustainability · Action · Measurement
            </span>
          </div>

          <h1 className="mt-8 text-4xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-6xl lg:text-7xl text-[#102f26]">
            Turn everyday choices into collective environmental progress.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#315148] sm:text-lg md:text-xl">
            Green Collective gives individuals, campuses, and organizations a simple way to record sustainable actions, track carbon diverted, and compete across regional and institutional leaderboards.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/habits"
              className="inline-flex items-center bg-[#102f26] px-7 py-4 text-xs font-mono uppercase tracking-[0.18em] text-white transition-all hover:bg-[#1a4438] shadow-sm"
            >
              Explore Action Registry →
            </Link>
            <Link
              href="/competition"
              className="inline-flex items-center border border-[#102f26]/20 bg-white/80 px-7 py-4 text-xs font-mono uppercase tracking-[0.18em] text-[#102f26] transition-all hover:bg-white"
            >
              View Leaderboards →
            </Link>
          </div>

          {/* REAL VALUE PILLARS (Replaces hardcoded / placeholder stats) */}
          <div className="mt-16 grid grid-cols-1 gap-6 border-t border-[#102f26]/10 pt-10 text-left sm:grid-cols-3">
            <div className="border-l-2 border-[#102f26]/20 pl-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] font-semibold">
                01 / Action Ledger
              </p>
              <p className="mt-1 text-sm font-medium text-[#102f26]">Multi-select entry</p>
              <p className="mt-0.5 text-xs text-[#526760]">Log sustainable daily choices in seconds.</p>
            </div>

            <div className="border-l-2 border-[#102f26]/20 pl-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] font-semibold">
                02 / Campus & Municipal
              </p>
              <p className="mt-1 text-sm font-medium text-[#102f26]">Institutional tiers</p>
              <p className="mt-0.5 text-xs text-[#526760]">Group progress by faculty, campus, or local hub.</p>
            </div>

            <div className="border-l-2 border-[#102f26]/20 pl-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] font-semibold">
                03 / Impact Models
              </p>
              <p className="mt-1 text-sm font-medium text-[#102f26]">Standardized CO₂e</p>
              <p className="mt-0.5 text-xs text-[#526760]">Transparent, factor-based carbon offset estimates.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE DEMO SECTION */}
      <section className="border-b border-[#102f26]/10 bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Explanation */}
            <div className="lg:col-span-5 space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d]">
                Interactive Micro-Demo
              </p>
              <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl text-[#102f26]">
                See how small choices compound into real impact.
              </h2>
              <p className="text-base text-[#526760] leading-relaxed">
                Test our multi-select ledger right here. Select actions you completed today to see instant carbon savings calculated in real time.
              </p>

              <div className="pt-2">
                <Link
                  href="/habits"
                  className="inline-flex items-center border-b border-[#102f26] pb-1 text-sm font-medium transition-opacity hover:opacity-55 text-[#102f26]"
                >
                  Open complete personal ledger →
                </Link>
              </div>
            </div>

            {/* Right Interactive Logger Box */}
            <div className="lg:col-span-7">
              <div className="border border-[#102f26]/15 bg-[#f9f8f6] shadow-sm">
                
                {/* Header with Live Counter */}
                <div className="flex items-center justify-between border-b border-[#102f26]/10 px-6 py-4 bg-[#e2ede5]/50">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#39705d] animate-pulse" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#39705d] font-semibold">
                      Live Impact Calculator
                    </span>
                  </div>
                  <div className="font-mono text-sm font-bold text-[#102f26]">
                    +{calculatedImpact} kg CO₂e
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="p-6 grid gap-3 sm:grid-cols-2">
                  {DEMO_ACTIONS.map((action) => {
                    const isSelected = selectedDemoActions.includes(action.id);
                    return (
                      <button
                        key={action.id}
                        onClick={() => toggleDemoAction(action.id)}
                        type="button"
                        className={`flex items-start justify-between p-4 border text-left transition-all ${
                          isSelected
                            ? 'bg-[#102f26] text-white border-[#102f26] shadow-sm'
                            : 'bg-white text-[#102f26] border-[#102f26]/15 hover:border-[#102f26]/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="text-[9px] font-mono uppercase tracking-wider opacity-70">
                            {action.category}
                          </p>
                          <p className="text-sm font-medium leading-tight">{action.name}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <span
                            className={`inline-flex h-5 w-5 items-center justify-center border text-[11px] ${
                              isSelected
                                ? 'border-white bg-white text-[#102f26] font-bold'
                                : 'border-[#102f26]/30 bg-transparent'
                            }`}
                          >
                            {isSelected ? '✓' : ''}
                          </span>
                          <p className="font-mono text-[11px] opacity-80">
                            ~{action.impact} kg
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer Link */}
                <div className="border-t border-[#102f26]/10 bg-[#102f26] px-6 py-4 text-white flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/80">
                    Selected Actions: {selectedDemoActions.length} of {DEMO_ACTIONS.length}
                  </span>
                  <Link
                    href="/habits"
                    className="font-mono text-xs uppercase tracking-[0.14em] text-white hover:underline"
                  >
                    Log to profile →
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. THE COLLECTIVE FRAMEWORK */}
      <section className="border-b border-[#102f26]/10 bg-[#f9f8f6]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d]">
                The collective
              </p>
            </div>

            <div>
              <h2 className="max-w-4xl text-3xl font-medium leading-tight tracking-[-0.04em] md:text-5xl">
                Your actions don&apos;t exist in isolation.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#526760] md:text-lg">
                Green Collective connects individual activity with local communities
                and institutions so participation becomes measurable progress.
              </p>

              <div className="mt-12 border-t border-[#102f26]/15">
                <div className="grid md:grid-cols-3">
                  <div className="border-b border-[#102f26]/10 py-7 md:border-b-0 md:border-r md:pr-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
                      01
                    </p>
                    <h3 className="mt-4 text-xl font-medium">Individual</h3>
                    <p className="mt-2 text-sm leading-6 text-[#667871]">
                      Record choices seamlessly via the action registry.
                    </p>
                  </div>

                  <div className="border-b border-[#102f26]/10 py-7 md:border-b-0 md:border-r md:px-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
                      02
                    </p>
                    <h3 className="mt-4 text-xl font-medium">Local & Community</h3>
                    <p className="mt-2 text-sm leading-6 text-[#667871]">
                      Measure aggregate impact across regional municipal hubs.
                    </p>
                  </div>

                  <div className="py-7 md:pl-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
                      03
                    </p>
                    <h3 className="mt-4 text-xl font-medium">Institutional</h3>
                    <p className="mt-2 text-sm leading-6 text-[#667871]">
                      Participate in faculty challenges and organizational goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACTION LIBRARY */}
      <section className="bg-[#102f26] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9bb9aa]">
                Action library
              </p>

              <h2 className="mt-6 max-w-sm text-3xl font-medium leading-tight tracking-[-0.04em] md:text-4xl">
                Start with something you already do.
              </h2>
              <p className="mt-4 text-xs font-mono uppercase tracking-[0.14em] text-[#9bb9aa]/70">
                Clicking any action pre-selects it instantly in your personal ledger.
              </p>
            </div>

            <div className="border-t border-white/15">
              {MAIN_ACTIONS.map((action) => (
                <Link
                  key={action.id}
                  href={`/habits?action=${action.id}`}
                  className="group block border-b border-white/15 py-6 transition-colors hover:bg-white/[0.04]"
                >
                  <div className="grid gap-4 md:grid-cols-[0.9fr_1.5fr_auto] md:items-center">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9bb9aa]">
                        {action.category}
                      </p>
                      <h3 className="mt-1 text-lg font-medium">
                        {action.name}
                      </h3>
                    </div>

                    <p className="max-w-lg text-sm leading-6 text-white/60">
                      {action.description}
                    </p>

                    <div className="flex items-center justify-between gap-8 md:justify-end">
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9bb9aa]">
                        {action.impact}
                      </span>
                      <span className="text-lg transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. LEADERBOARDS OVERVIEW */}
      <section className="border-b border-[#102f26]/10 bg-[#f9f8f6]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d]">
                Leaderboards
              </p>
            </div>

            <div>
              <h2 className="max-w-3xl text-3xl font-medium leading-tight tracking-[-0.04em] md:text-5xl">
                Compare local impact and institutional challenges.
              </h2>

              <div className="mt-12 border-t border-[#102f26]/15">
                <div className="flex flex-col gap-6 py-7 md:flex-row md:items-center md:justify-between border-b border-[#102f26]/10">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
                      Institutional Tier
                    </p>
                    <h3 className="mt-2 text-2xl font-medium">
                      UBC Faculty Challenge
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#667871]">
                      Track points attributed directly to your faculty and see which academic department leads campus sustainability.
                    </p>
                  </div>
                  <Link
                    href="/competition?tab=institutional"
                    className="shrink-0 border-b border-[#102f26] pb-1 text-sm font-medium transition-opacity hover:opacity-55"
                  >
                    View institutional board →
                  </Link>
                </div>

                <div className="flex flex-col gap-6 py-7 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
                      Local / Regional Tier
                    </p>
                    <h3 className="mt-2 text-2xl font-medium">
                      Vancouver & Community Hubs
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#667871]">
                      Measure aggregated carbon diversion across regional neighborhoods and community groups.
                    </p>
                  </div>
                  <Link
                    href="/competition?tab=local"
                    className="shrink-0 border-b border-[#102f26] pb-1 text-sm font-medium transition-opacity hover:opacity-55"
                  >
                    View local board →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CLOSING CTA */}
      <section className="bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28 lg:px-12">
          <div className="max-w-5xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d]">
              Green Collective
            </p>

            <h2 className="mt-6 text-4xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Make sustainable action visible.
            </h2>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#526760]">
              <Link href="/habits" className="hover:text-[#102f26]">
                Actions →
              </Link>
              <Link href="/competition" className="hover:text-[#102f26]">
                Leaderboards →
              </Link>
              <Link href="/about" className="hover:text-[#102f26]">
                About →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
