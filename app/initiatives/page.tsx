import Link from 'next/link';

const initiativesList = [
  {
    code: "01",
    category: "Institutional Challenge",
    title: "UBC Sustainability Challenge",
    description: "Participate in faculty-wide challenges to measure aggregate carbon savings and drive campus sustainability metrics collectively.",
    status: "Active Program",
    href: "/competition",
  },
  {
    code: "02",
    category: "Community Action",
    title: "Local Urban Canopy Expansion",
    description: "Coordinate with regional partners and municipal groups to monitor canopy cover, urban heat island mitigation, and green space accessibility.",
    status: "Ongoing",
    href: "/initiatives/canopy",
  },
  {
    code: "03",
    category: "Policy & Research",
    title: "Green Transit & Drivetrain Transition",
    description: "Evaluate lifecycle emissions, municipal charging infrastructure, and policy frameworks for heavy-duty and commuter transport networks.",
    status: "Research Phase",
    href: "/initiatives/transport-policy",
  },
];

export default function InitiativesPage() {
  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24">
      {/* Editorial Page Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
            Programs · Scale · Impact
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Shared initiatives &amp; community programs
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Individual actions compound into measurable institutional progress when aligned through structured community programs.
          </p>
        </div>
      </section>

      {/* Main Initiatives Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="border-t border-[#102f26]/15">
          {initiativesList.map((item) => (
            <div
              key={item.code}
              className="group border-b border-[#102f26]/15 py-10 transition-colors hover:bg-[#f1f6f2]/40 px-4 -mx-4"
            >
              <div className="grid gap-6 lg:grid-cols-[0.3fr_1.2fr_0.5fr] lg:items-center">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block">
                    Initiative / {item.code}
                  </span>
                  <span className="mt-1 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-[#71847d]">
                    {item.status}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#39705d] block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-medium tracking-tight text-[#102f26]">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-[#526760]">
                    {item.description}
                  </p>
                </div>

                <div className="lg:text-right">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 border-b border-[#102f26] pb-1 font-mono text-xs uppercase tracking-[0.14em] transition-opacity hover:opacity-55"
                  >
                    View program →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
