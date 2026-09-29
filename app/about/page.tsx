import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24">
      {/* Editorial Page Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
            Philosophy · Transparency · Action
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            About Green Collective
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Bridging individual sustainable choices with rigorous, citation-backed climate metrics and community-scale tracking.
          </p>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d]">
              Our Mission
            </p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight">
              Making sustainable action visible and accountable.
            </h2>
          </div>

          <div className="space-y-6 text-[#526760] leading-relaxed text-base">
            <p>
              Green Collective was built to move beyond vague carbon accounting and surface-level greenwashing. By grounding every recorded habit in standardized lifecycle assessment (LCA) benchmarks from the US EPA, IPCC guidelines, and peer-reviewed agricultural databases, we provide an honest ledger for everyday behavior.
            </p>
            <p>
              Whether participating in institutional challenges like the UBC Sustainability Challenge or logging daily transport and energy choices, participants gain granular visibility into their cumulative environmental impact.
            </p>

            <div className="pt-6 border-t border-[#102f26]/15 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
                  Standard 01
                </p>
                <h3 className="mt-2 text-lg font-medium text-[#102f26]">Academic Rigor</h3>
                <p className="mt-1 text-xs text-[#526760]">
                  Distance-based scaling and transparent source citations for every single action metric.
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
                  Standard 02
                </p>
                <h3 className="mt-2 text-lg font-medium text-[#102f26]">Collective Scale</h3>
                <p className="mt-1 text-xs text-[#526760]">
                  Aggregating individual participation into meaningful institutional team insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
