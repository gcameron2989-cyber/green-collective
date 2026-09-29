"use client";

import Link from 'next/link';

export default function TransportPolicyInitiativePage() {
  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24">
      {/* Editorial Page Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
            Policy &amp; Research · Initiative / 03 · Active Policy Brief
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Green Transit &amp; Drivetrain Transition
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Evaluating lifecycle emissions, energy density trade-offs, and regulatory frameworks for commercial long-haul and municipal transport fleets.
          </p>
        </div>
      </section>

      {/* Main Content & Comparative Matrix */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] mb-16">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d]">
              Research Scope
            </p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight">
              Drivetrain trade-offs for heavy-duty commercial transport.
            </h2>
          </div>

          <div className="space-y-6 text-[#526760] leading-relaxed text-base">
            <p>
              Decarbonizing freight and long-haul transport requires looking beyond tailpipe emissions to encompass full cradle-to-grave lifecycle impacts. This research initiative investigates the economic and technical constraints of deploying green hydrogen fuel cells versus battery-electric architectures across regional trade corridors.
            </p>
            <p>
              By modeling grid carbon intensity alongside refueling infrastructure buildout timelines, the brief establishes a rigorous framework for municipal planners and logistics operators.
            </p>
          </div>
        </div>

        {/* Comparative Data Table */}
        <div className="border border-[#102f26]/15 bg-[#f1f6f2] p-8 md:p-10 mb-16">
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[#102f26] mb-6">
                Comparative Drivetrain Matrix (Commercial Long-Haul)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#102f26]/20 font-mono text-[10px] uppercase tracking-[0.16em] text-[#39705d]">
                  <th className="py-3 pr-4">Drivetrain Architecture</th>
                  <th className="py-3 px-4">Energy Density</th>
                  <th className="py-3 px-4">Infrastructure Maturity</th>
                  <th className="py-3 pl-4">Lifecycle Carbon Profile</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#526760] divide-y divide-[#102f26]/10">
                <tr>
                  <td className="py-4 pr-4 font-medium text-[#102f26]">Battery Electric (BEV)</td>
                  <td className="py-4 px-4">Medium (~150 Wh/kg pack)</td>
                  <td className="py-4 px-4">Moderate (Rapid DC scaling)</td>
                  <td className="py-4 pl-4">Low (Grid-dependent intensity)</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium text-[#102f26]">Green Hydrogen (FCEV)</td>
                  <td className="py-4 px-4">High (~33.3 kWh/kg H₂)</td>
                  <td className="py-4 px-4">Emerging (Low station density)</td>
                  <td className="py-4 pl-4">Very Low (Electrolysis-derived)</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium text-[#102f26]">Low-Carbon Biofuel ICE</td>
                  <td className="py-4 px-4">High (Drop-in liquid fuel)</td>
                  <td className="py-4 px-4">High (Existing distribution)</td>
                  <td className="py-4 pl-4">Medium (Feedstock constrained)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-6 border-t border-[#102f26]/15 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-[#102f26]">Explore underlying methodology</span>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 border-b border-[#102f26] pb-1 font-mono text-xs uppercase tracking-[0.14em] transition-opacity hover:opacity-55 text-[#102f26]"
          >
            Read methodology overview →
          </Link>
        </div>
      </section>
    </main>
  );
}
