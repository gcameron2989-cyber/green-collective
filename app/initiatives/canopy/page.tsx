"use client";

import Link from 'next/link';

export default function CanopyInitiativePage() {
  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24">
      {/* Editorial Page Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
            Community Action · Initiative / 02 · Active Monitoring Desk
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Local Urban Canopy Expansion
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Quantifying urban forest density, microclimate cooling capacity, and regional biodiversity corridors across municipal green spaces.
          </p>
        </div>
      </section>

      {/* Main Content & Metrics Desk */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 border border-[#102f26]/15 bg-[#f1f6f2]">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-2">
              Monitored Plots
            </span>
            <span className="text-3xl font-medium text-[#102f26]">124</span>
            <p className="mt-2 text-xs text-[#526760] font-mono">Sample plots tracked across regional forest boundaries.</p>
          </div>
          <div className="p-6 border border-[#102f26]/15 bg-[#f1f6f2]">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-2">
              Canopy Mitigation Target
            </span>
            <span className="text-3xl font-medium text-[#102f26]">28.5%</span>
            <p className="mt-2 text-xs text-[#526760] font-mono">Target municipal tree canopy coverage threshold.</p>
          </div>
          <div className="p-6 border border-[#102f26]/15 bg-[#f1f6f2]">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-2">
              Microclimate Cooling
            </span>
            <span className="text-3xl font-medium text-[#102f26]">-2.4°C</span>
            <p className="mt-2 text-xs text-[#526760] font-mono">Average urban heat island reduction in dense canopy zones.</p>
          </div>
        </div>

        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d]">
              Operational Purpose
            </p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight">
              Why urban canopy metrics matter for municipal resilience.
            </h2>
          </div>

          <div className="space-y-6 text-[#526760] leading-relaxed text-base">
            <p>
              Urban tree canopies act as critical green infrastructure, directly offsetting the heat island effect while absorbing particulate matter and managing stormwater surges. Without granular plot-level monitoring, municipal planting initiatives often lack the empirical feedback loop required to ensure survival and optimal placement.
            </p>
            <p>
              This initiative synthesizes field inventory metrics—such as stem diameter, crown projection, and soil moisture levels—into unified datasets that inform regional urban forestry policy and direct volunteer conservation efforts.
            </p>

            <div className="pt-6 border-t border-[#102f26]/15 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#102f26]">Contribute to regional field audits</span>
              <Link
                href="/habits"
                className="inline-flex items-center gap-2 border-b border-[#102f26] pb-1 font-mono text-xs uppercase tracking-[0.14em] transition-opacity hover:opacity-55 text-[#102f26]"
              >
                Log field action →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
