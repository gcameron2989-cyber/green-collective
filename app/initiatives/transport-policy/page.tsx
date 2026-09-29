import Link from 'next/link';

export default function TransportPolicyInitiativePage() {
  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24">
      {/* Editorial Page Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
            Policy &amp; Research · Initiative / 03
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Green Transit &amp; Drivetrain Transition
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Evaluating lifecycle emissions, energy densities, and regulatory frameworks for sustainable commercial and commuter transport.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d]">
              Research &amp; Frameworks
            </p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight">
              Analyzing drivetrain trade-offs for long-haul and commuter networks.
            </h2>
          </div>

          <div className="space-y-6 text-[#526760] leading-relaxed text-base">
            <p>
              Decarbonizing transit requires rigorous comparative analysis across battery-electric, fuel cell electric, and low-carbon liquid fuel alternatives. This research initiative examines the lifecycle energy trade-offs, infrastructure bottlenecks, and policy levers required to accelerate green transport adoption.
            </p>
            <p>
              By aligning modal shift data with municipal transit planning, we support evidence-based strategies for reducing sectoral emissions at scale.
            </p>

            <div className="pt-6 border-t border-[#102f26]/15">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border-b border-[#102f26] pb-1 font-mono text-xs uppercase tracking-[0.14em] transition-opacity hover:opacity-55 text-[#102f26]"
              >
                Read our methodology overview →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
