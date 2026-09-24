
import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-white text-[#0f382c]">

      {/* Hero */}
      <section className="border-b border-neutral-200 bg-emerald-50/40">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-4xl">
            <p className="mb-6 text-xs font-mono uppercase tracking-[0.2em] text-emerald-800">
              Sustainability · Action · Measurement
            </p>

            <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[0.95]">
              Turn everyday choices into collective environmental progress.
            </h1>

            <p className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-neutral-600">
              Green Collective gives people a simple way to record sustainable
              actions, connect through shared programs, and help organizations
              understand participation at scale.
            </p>

            <div className="mt-10">
              <Link
                href="/habits"
                className="inline-flex items-center text-sm font-mono uppercase tracking-wider text-[#0f382c] hover:text-emerald-700 transition-colors"
              >
                Explore sustainable actions
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Framework */}
      <section className="border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="grid md:grid-cols-3 border-t border-neutral-300">

            <div className="py-8 md:pr-10 md:border-r border-neutral-300">
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-800">
                01
              </p>

              <h2 className="mt-4 text-2xl font-medium">
                Individual Action
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                Make sustainable choices visible by recording the actions you
                already take in everyday life.
              </p>
            </div>

            <div className="py-8 md:px-10 md:border-r border-neutral-300">
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-800">
                02
              </p>

              <h2 className="mt-4 text-2xl font-medium">
                Collective Momentum
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                Connect individual participation through communities,
                initiatives, and shared sustainability programs.
              </p>
            </div>

            <div className="py-8 md:pl-10">
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-800">
                03
              </p>

              <h2 className="mt-4 text-2xl font-medium">
                Global Impact
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                Give organizations a clearer picture of participation and
                measurable environmental progress at scale.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Platform Architecture */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">

          <div className="max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-800">
              Platform Architecture
            </p>

            <h2 className="mt-5 text-3xl md:text-4xl font-medium tracking-tight">
              From individual behaviour to institutional strategy.
            </h2>

            <p className="mt-5 text-base leading-relaxed text-neutral-600">
              Green Collective creates a connected system where sustainable
              actions can be recorded, organized into programs, and understood
              at an institutional level.
            </p>
          </div>

          <div className="mt-16 border-t border-neutral-300">

            <div className="grid md:grid-cols-[180px_1fr] gap-6 py-8 border-b border-neutral-200">
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-800">
                Individuals
              </p>

              <div>
                <h3 className="text-xl font-medium">
                  Sustainable Actions
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
                  Record everyday sustainable choices and build a personal
                  history of environmental action.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-[180px_1fr] gap-6 py-8 border-b border-neutral-200">
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-800">
                Communities
              </p>

              <div>
                <h3 className="text-xl font-medium">
                  Community & Programs
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
                  Bring people together through initiatives, challenges, and
                  shared sustainability goals.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-[180px_1fr] gap-6 py-8">
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-800">
                Institutions
              </p>

              <div>
                <h3 className="text-xl font-medium">
                  Institutional Strategy
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
                  Translate participation into useful information for
                  organizations developing and measuring sustainability
                  programs.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
