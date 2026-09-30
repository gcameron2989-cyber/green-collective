import Link from 'next/link';

const actions = [
  {
    category: 'TRANSPORT',
    name: 'Public / active transportation',
    description: 'Replace a car trip with walking, cycling, transit, or another lower-impact option.',
    impact: '~1.5 kg CO₂e / trip',
    href: '/habits',
  },
  {
    category: 'FOOD',
    name: 'Plant-forward meal',
    description: 'Choose a meal centred around plant-based ingredients.',
    impact: '~1.2 kg CO₂e / meal',
    href: '/habits',
  },
  {
    category: 'WASTE',
    name: 'Waste sorting',
    description: 'Sort recyclable, compostable, and landfill materials correctly.',
    impact: '~0.5 kg CO₂e / action',
    href: '/habits',
  },
  {
    category: 'ENERGY',
    name: 'Cold-water laundry',
    description: 'Wash clothing using cold water instead of a hot cycle.',
    impact: '~0.6 kg CO₂e / load',
    href: '/habits',
  },
];

export default function HomePage() {
  return (
    <main className="bg-white text-[#102f26]">
      {/* Hero */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28 lg:px-12 lg:py-32">
          <div className="grid items-end gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <div>
              <p className="mb-7 font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
                Sustainability · Action · Measurement
              </p>

              <h1 className="max-w-4xl text-[clamp(3.5rem,8vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.065em]">
                Turn everyday choices into
                <br />
                collective environmental progress.
              </h1>

              <p className="mt-10 max-w-xl text-lg leading-8 text-[#315148] md:text-xl">
                Green Collective gives people a simple way to record sustainable actions,
                connect through shared programs, and help organizations understand
                participation at scale.
              </p>

              <Link
                href="/habits"
                className="mt-10 inline-flex items-center border-b border-[#102f26] pb-1 text-sm font-medium transition-opacity hover:opacity-55"
              >
                Explore sustainable actions
                <span className="ml-3">→</span>
              </Link>
            </div>

            <div className="lg:pb-3">
              <div className="border border-[#102f26]/15 bg-white">
                <div className="flex items-center justify-between border-b border-[#102f26]/10 px-5 py-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d]">
                    Your activity
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#71847d]">
                    Today
                  </span>
                </div>

                <div className="divide-y divide-[#102f26]/10">
                  <div className="px-5 py-5">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-sm font-medium">
                          Active transportation
                        </p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#71847d]">
                          Transport · 1 action
                        </p>
                      </div>
                      <span className="font-mono text-[10px] text-[#39705d]">
                        1.5 kg CO₂e
                      </span>
                    </div>
                  </div>

                  <div className="px-5 py-5">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-sm font-medium">
                          Plant-forward meal
                        </p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#71847d]">
                          Food · 1 action
                        </p>
                      </div>
                      <span className="font-mono text-[10px] text-[#39705d]">
                        1.2 kg CO₂e
                      </span>
                    </div>
                  </div>

                  <div className="px-5 py-5">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-sm font-medium">
                          Your activity grows
                        </p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#71847d]">
                          Individual → collective
                        </p>
                      </div>
                      <span className="text-lg leading-none">↗</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#102f26]/10 bg-[#102f26] px-5 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
                      Green Collective
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                      Activity / 01
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collective progression */}
      <section className="border-b border-[#102f26]/10">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d]">
                The collective
              </p>
            </div>

            <div>
              <h2 className="max-w-4xl text-4xl font-medium leading-tight tracking-[-0.04em] md:text-6xl">
                Your actions don&apos;t exist in isolation.
              </h2>

              <p className="mt-7 max-w-2xl text-base leading-7 text-[#526760] md:text-lg">
                Green Collective connects individual activity with communities,
                programs, and institutions so participation can become
                measurable collective progress.
              </p>

              <div className="mt-16 border-t border-[#102f26]/15">
                <div className="grid md:grid-cols-3">
                  <div className="border-b border-[#102f26]/10 py-7 md:border-b-0 md:border-r md:pr-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
                      01
                    </p>
                    <h3 className="mt-5 text-xl font-medium">Individual</h3>
                    <p className="mt-3 text-sm leading-6 text-[#667871]">
                      Record the choices you make every day.
                    </p>
                  </div>

                  <div className="border-b border-[#102f26]/10 py-7 md:border-b-0 md:border-r md:px-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
                      02
                    </p>
                    <h3 className="mt-5 text-xl font-medium">Community</h3>
                    <p className="mt-3 text-sm leading-6 text-[#667871]">
                      Participate in shared programs and challenges.
                    </p>
                  </div>

                  <div className="py-7 md:pl-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
                      03
                    </p>
                    <h3 className="mt-5 text-xl font-medium">Institution</h3>
                    <p className="mt-3 text-sm leading-6 text-[#667871]">
                      Turn participation into meaningful organizational insight.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action library */}
      <section className="bg-[#102f26] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9bb9aa]">
                Action library
              </p>

              <h2 className="mt-7 max-w-sm text-4xl font-medium leading-tight tracking-[-0.04em] md:text-5xl">
                Start with something you already do.
              </h2>
            </div>

            <div className="border-t border-white/15">
              {actions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="group block border-b border-white/15 py-7 transition-colors hover:bg-white/[0.04]"
                >
                  <div className="grid gap-5 md:grid-cols-[0.9fr_1.5fr_auto] md:items-center">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9bb9aa]">
                        {action.category}
                      </p>
                      <h3 className="mt-2 text-lg font-medium">
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

      {/* Programs */}
      <section className="border-b border-[#102f26]/10">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d]">
                Participation
              </p>
            </div>

            <div>
              <h2 className="max-w-3xl text-4xl font-medium leading-tight tracking-[-0.04em] md:text-6xl">
                Individual action becomes more powerful when it connects.
              </h2>

              <div className="mt-14 border-t border-[#102f26]/15">
                <div className="flex flex-col gap-6 py-7 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
                      Featured program
                    </p>
                    <h3 className="mt-3 text-2xl font-medium">
                      UBC Sustainability Challenge
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#667871]">
                      Participate in a shared sustainability program and connect
                      your activity with a wider community.
                    </p>
                  </div>

                  <Link
                    href="/competition"
                    className="shrink-0 border-b border-[#102f26] pb-1 text-sm font-medium transition-opacity hover:opacity-55"
                  >
                    Enter the challenge →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-12">
          <div className="max-w-5xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d]">
              Green Collective
            </p>

            <h2 className="mt-8 text-5xl font-medium leading-[0.95] tracking-[-0.055em] md:text-7xl lg:text-8xl">
              Make sustainable action visible.
            </h2>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#526760]">
              <Link href="/habits" className="hover:text-[#102f26]">
                Actions →
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
    </main>
  );
}