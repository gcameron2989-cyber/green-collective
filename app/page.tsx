
import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-white text-[#0f382c]">

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-[#f3f7f3]">
        <div className="absolute right-[-8%] top-[-20%] h-[520px] w-[520px] rounded-full border border-emerald-900/10" />
        <div className="absolute right-[4%] top-[18%] h-[300px] w-[300px] rounded-full border border-emerald-900/10" />
        <div className="absolute right-[14%] top-[38%] h-[120px] w-[120px] rounded-full bg-emerald-900/[0.035]" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-16 lg:gap-20 items-center">

            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-7">
                <span className="h-px w-8 bg-emerald-800" />
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-emerald-800">
                  Sustainability · Action · Measurement
                </p>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-[5.25rem] font-medium tracking-[-0.045em] leading-[0.94]">
                Turn everyday choices into collective environmental progress.
              </h1>

              <p className="mt-9 max-w-2xl text-lg md:text-xl leading-relaxed text-neutral-600">
                Green Collective gives people a simple way to record sustainable
                actions, connect through shared programs, and help organizations
                understand participation at scale.
              </p>

              <div className="mt-10">
                <Link
                  href="/habits"
                  className="group inline-flex items-center gap-3 text-sm font-mono uppercase tracking-[0.14em] text-[#0f382c]"
                >
                  <span className="border-b border-[#0f382c] pb-1 group-hover:border-emerald-600 group-hover:text-emerald-700 transition-colors">
                    Explore sustainable actions
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* Measurement motif */}
            <div className="hidden lg:flex justify-end">
              <div className="relative w-full max-w-sm aspect-square">

                <div className="absolute inset-0 border border-emerald-900/15" />

                <div className="absolute inset-8 border border-emerald-900/10" />

                <div className="absolute left-1/2 top-8 bottom-8 w-px bg-emerald-900/10" />

                <div className="absolute top-1/2 left-8 right-8 h-px bg-emerald-900/10" />

                <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-[#0f382c]" />

                <div className="absolute left-6 top-6 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  01
                </div>

                <div className="absolute right-6 top-6 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  ACTION
                </div>

                <div className="absolute left-6 bottom-6 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  PARTICIPATION
                </div>

                <div className="absolute right-6 bottom-6 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  IMPACT
                </div>

                <div className="absolute left-1/2 top-[22%] -translate-x-1/2 text-center">
                  <p className="text-xs font-mono uppercase tracking-widest text-emerald-800">
                    Collective
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    measurement layer
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

        <div className="relative border-t border-emerald-900/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
              Individual → Community → Institution
            </p>

            <p className="hidden sm:block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
              Environmental engagement infrastructure
            </p>
          </div>
        </div>
      </section>

      {/* Framework */}
      <section className="border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-28">

          <div className="max-w-2xl mb-16">
            <p className="text-[11px]()
            }
