import Link from 'next/link';

export default function CanopyInitiativePage() {
  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24">
      {/* Editorial Page Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
            Community Action · Initiative / 02
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Local Urban Canopy Expansion
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Monitoring urban forest density, tracking microclimate cooling effects, and coordinating regional green space accessibility.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d]">
              Overview &amp; Objectives
            </p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight">
              Quantifying and expanding urban forest infrastructure.
            </h2>
          </div>

          <div className="space-y-6 text-[#526760] leading-relaxed text-base">
            <p>
              Urban tree canopies play a vital role in mitigating the urban heat island effect, managing stormwater runoff, and sequestering carbon at a municipal scale. This initiative coordinates field metrics across regional green spaces to assess canopy health and guide strategic planting efforts.
            </p>
            <p>
              By combining on-the-ground forest inventory data with community-driven monitoring, participants help document local ecosystem resilience and biodiversity corridors.
            </p>

            <div className="pt-6 border-t border-[#102f26]/15">
              <Link
                href="/habits"
                className="inline-flex items-center gap-2 border-b border-[#102f26] pb-1 font-mono text-xs uppercase tracking-[0.14em] transition-opacity hover:opacity-55 text-[#102f26]"
              >
                Log related conservation actions →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
