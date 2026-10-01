'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const DEMO_ACTIONS = [
  { id: 'active-transit', name: 'Active transit (Bike / Walk)', impact: 2.4, category: 'TRANSPORT' },
  { id: 'public-transit', name: 'Public transit (Bus / Train)', impact: 1.3, category: 'TRANSPORT' },
  { id: 'plant-based-meal', name: 'Plant-forward meal', impact: 1.4, category: 'FOOD' },
  { id: 'line-dry', name: 'Air-dry clothing (Line dry)', impact: 2.4, category: 'ENERGY' },
  { id: 'cold-water-laundry', name: 'Cold-water laundry load', impact: 0.6, category: 'ENERGY' },
  { id: 'waste-sorting', name: 'Three-stream waste sorting', impact: 0.5, category: 'WASTE' },
];

const MAIN_ACTIONS = [
  {
    id: 'active-transit',
    category: 'TRANSPORT',
    name: 'Active transit (Cycling / Walking)',
    description: 'Completely eliminate vehicle emissions by commuting under human power.',
    impact: '~2.4 kg CO₂e / trip',
  },
  {
    id: 'public-transit',
    category: 'TRANSPORT',
    name: 'Public transit (Bus / SkyTrain)',
    description: 'Share efficient high-capacity transit instead of driving a single-occupancy vehicle.',
    impact: '~1.3 kg CO₂e / trip',
  },
  {
    id: 'plant-based-meal',
    category: 'FOOD',
    name: 'Plant-forward meal',
    description: 'Opt for whole plant ingredients over high-emission livestock alternatives.',
    impact: '~1.4 kg CO₂e / meal',
  },
  {
    id: 'local-food',
    category: 'FOOD',
    name: 'Locally sourced / seasonal food',
    description: 'Reduce long-distance cold-chain transport and freight emissions.',
    impact: '~0.7 kg CO₂e / meal',
  },
  {
    id: 'line-dry',
    category: 'ENERGY',
    name: 'Air-dry clothing (Line dry)',
    description: 'Bypass energy-intensive electric heating elements in clothes dryers completely.',
    impact: '~2.4 kg CO₂e / load',
  },
  {
    id: 'thermostat-setback',
    category: 'ENERGY',
    name: 'Winter heat setback (-2°C)',
    description: 'Lower residential heating setpoints slightly to reduce natural gas / electric load.',
    impact: '~1.8 kg CO₂e / day',
  },
  {
    id: 'waste-sorting',
    category: 'WASTE',
    name: 'Three-stream waste sorting',
    description: 'Prevent organic methane generation in landfills by diverting to compost and recycling.',
    impact: '~0.5 kg CO₂e / day',
  },
  {
    id: 'repair-item',
    category: 'CIRCULARITY',
    name: 'Repair / mend clothing or gear',
    description: 'Extend product lifespans to offset raw material extraction and manufacturing.',
    impact: '~3.2 kg CO₂e / item',
  },
  {
    id: 'second-hand',
    category: 'CONSUMPTION',
    name: 'Thrift / second-hand purchase',
    description: 'Source apparel or goods second-hand to avoid supply chain production impacts.',
    impact: '~4.5 kg CO₂e / item',
  },
  {
    id: 'reusable-cup',
    category: 'CIRCULARITY',
    name: 'Reusable mug / container',
    description: 'Eliminate single-use paper cups and takeout packaging footprints.',
    impact: '~0.2 kg CO₂e / use',
  },
];

export default function HomePage() {
  const [selectedDemoActions, setSelectedDemoActions] = useState<string[]>([
    'active-transit',
    'plant-based-meal',
  ]);

  // Modal & form states for proposing new actions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposedName, setProposedName] = useState('');
  const [proposedCategory, setProposedCategory] = useState('TRANSPORT');
  const [proposedDesc, setProposedDesc] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

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

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedName.trim()) return;
    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
      setIsModalOpen(false);
      setProposedName('');
      setProposedDesc('');
    }, 2000);
  };

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

          {/* CLICKABLE PILLARS */}
          <div className="mt-16 grid grid-cols-1 gap-4 border-t border-[#102f26]/10 pt-10 text-left sm:grid-cols-3">
            <Link
              href="/habits"
              className="group block rounded-sm border border-[#102f26]/10 bg-white/40 p-4 transition-all hover:border-[#102f26]/30 hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] font-semibold">
                  01 / Action Ledger
                </p>
                <span className="text-xs text-[#102f26]/40 transition-transform group-hover:translate-x-1 group-hover:text-[#102f26]">
                  →
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-[#102f26] group-hover:text-[#39705d] transition-colors">
                Multi-select entry
              </p>
              <p className="mt-0.5 text-xs text-[#526760]">Log sustainable daily choices in seconds.</p>
            </Link>

            <Link
              href="/competition"
              className="group block rounded-sm border border-[#102f26]/10 bg-white/40 p-4 transition-all hover:border-[#102f26]/30 hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] font-semibold">
                  02 / Campus & Municipal
                </p>
                <span className="text-xs text-[#102f26]/40 transition-transform group-hover:translate-x-1 group-hover:text-[#102f26]">
                  →
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-[#102f26] group-hover:text-[#39705d] transition-colors">
                Institutional tiers
              </p>
              <p className="mt-0.5 text-xs text-[#526760]">Group progress by faculty, campus, or local hub.</p>
            </Link>

            <Link
              href="/initiatives"
              className="group block rounded-sm border border-[#102f26]/10 bg-white/40 p-4 transition-all hover:border-[#102f26]/30 hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] font-semibold">
                  03 / Initiatives
                </p>
                <span className="text-xs text-[#102f26]/40 transition-transform group-hover:translate-x-1 group-hover:text-[#102f26]">
                  →
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-[#102f26] group-hover:text-[#39705d] transition-colors">
                Community Projects
              </p>
              <p className="mt-0.5 text-xs text-[#526760]">Explore active campaigns and localized initiatives.</p>
            </Link>
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE DEMO SECTION */}
      <section className="border-b border-[#102f26]/10 bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
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

            <div className="lg:col-span-7">
              <div className="border border-[#102f26]/15 bg-[#f9f8f6] shadow-sm">
                
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

      {/* 3. EXPANDED ACTION LIBRARY & PROPOSAL OPTION */}
      <section className="bg-[#102f26] text-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9bb9aa]">
                Action Library
              </p>

              <h2 className="mt-6 max-w-sm text-3xl font-medium leading-tight tracking-[-0.04em] md:text-4xl">
                Start with habits that fit your routine.
              </h2>
              <p className="mt-4 text-xs font-mono uppercase tracking-[0.14em] text-[#9bb9aa]/70">
                Clicking any action pre-selects it in your personal ledger.
              </p>

              {/* Propose Action Button */}
              <div className="mt-10 pt-6 border-t border-white/10">
                <p className="text-sm text-white/70">Missing an action you do regularly?</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  type="button"
                  className="mt-3 inline-flex items-center gap-2 border border-[#9bb9aa]/30 bg-white/5 px-4 py-2.5 text-xs font-mono uppercase tracking-[0.14em] text-[#9bb9aa] transition-all hover:bg-white/10 hover:border-[#9bb9aa]"
                >
                  <span>+ Propose New Action</span>
                </button>
              </div>
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

      {/* 4. LEADERBOARDS OVERVIEW */}
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

      {/* 5. CLOSING CTA */}
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
              <Link href="/initiatives" className="hover:text-[#102f26]">
                Initiatives →
              </Link>
              <Link href="/about" className="hover:text-[#102f26]">
                About →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PROPOSE NEW ACTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102f26]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg border border-[#102f26]/20 bg-[#f9f8f6] p-6 shadow-xl sm:p-8">
            <div className="flex items-center justify-between border-b border-[#102f26]/10 pb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] font-semibold">
                Community Action Registry
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="text-xs font-mono uppercase text-[#102f26]/60 hover:text-[#102f26]"
              >
                ✕ Close
              </button>
            </div>

            {submissionSuccess ? (
              <div className="py-12 text-center space-y-3">
                <span className="text-2xl">✓</span>
                <h3 className="text-xl font-medium text-[#102f26]">Action Submitted for Approval</h3>
                <p className="text-xs text-[#526760]">
                  Thanks for contributing! Our team will review the carbon methodology before publishing to the registry.
                </p>
              </div>
            ) : (
              <form onSubmit={handleProposeSubmit} className="mt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-[#102f26]">Propose a New Action</h3>
                  <p className="mt-1 text-xs text-[#526760]">
                    Submitted actions undergo factor review before being added to global registry options.
                  </p>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-1">
                    Action Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Backyard composting, Heat pump installation"
                    value={proposedName}
                    onChange={(e) => setProposedName(e.target.value)}
                    className="w-full border border-[#102f26]/20 bg-white px-3 py-2 text-sm text-[#102f26] focus:border-[#102f26] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-1">
                    Category
                  </label>
                  <select
                    value={proposedCategory}
                    onChange={(e) => setProposedCategory(e.target.value)}
                    className="w-full border border-[#102f26]/20 bg-white px-3 py-2 text-sm text-[#102f26] focus:border-[#102f26] focus:outline-none"
                  >
                    <option value="TRANSPORT">Transport</option>
                    <option value="FOOD">Food</option>
                    <option value="ENERGY">Energy</option>
                    <option value="WASTE">Waste</option>
                    <option value="CIRCULARITY">Circularity</option>
                    <option value="CONSUMPTION">Consumption</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-1">
                    Description & Methodology Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe how this action reduces emissions or conserves resources..."
                    value={proposedDesc}
                    onChange={(e) => setProposedDesc(e.target.value)}
                    className="w-full border border-[#102f26]/20 bg-white px-3 py-2 text-sm text-[#102f26] focus:border-[#102f26] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="border border-[#102f26]/20 px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#102f26]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#102f26] px-5 py-2 text-xs font-mono uppercase tracking-wider text-white hover:bg-[#1a4438]"
                  >
                    Submit for Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
