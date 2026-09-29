"use client";

import { useState } from 'react';
import Link from 'next/link';

interface LocalProject {
  id: string;
  city: string;
  title: string;
  organization: string;
  description: string;
  actionType: string;
  link: string;
}

const activeLocalProjects: LocalProject[] = [
  {
    id: "van-01",
    city: "Vancouver",
    title: "Seeding Stewardship: Rain Garden & Pollinator Maintenance",
    organization: "City of Vancouver Parks Board",
    description: "Adopt or maintain local naturalized spaces like the Pine St. Rain Gardens or Memorial Park South to support urban stormwater management and biodiversity.",
    actionType: "Field Stewardship",
    link: "https://vancouver.ca/home-property-development/seeding-stewardship-program.aspx",
  },
  {
    id: "van-02",
    city: "Vancouver",
    title: "Dedicated Invasive Removal Team (DIRT) & EcoStewards",
    organization: "Stanley Park Ecology Society",
    description: "Join hands-on bi-weekly habitat restoration sessions removing invasive species and collecting baseline ecological tracking data in Stanley Park.",
    actionType: "Habitat Restoration",
    link: "https://stanleyparkecology.ca/about-stanley-park-ecology/volunteer/",
  },
  {
    id: "tor-01",
    city: "Toronto",
    title: "Community Canopy Planting & Tree Vulnerability Audits",
    organization: "LEAF (Local Enhancement & Appreciation of Forests)",
    description: "Participate in neighborhood planting blitzes and backyard tree care programs to expand Toronto's urban forest canopy density.",
    actionType: "Urban Forestry",
    link: "https://www.torontoleaf.org",
  },
];

export default function CanopyInitiativePage() {
  const [userCity, setUserCity] = useState<string>("Vancouver");

  const filteredProjects = activeLocalProjects.filter(
    (proj) => proj.city.toLowerCase() === userCity.toLowerCase()
  );

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24">
      {/* Editorial Page Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
            Community Action · Initiative / 02 · Live Local Action Desk
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Local Urban Canopy Expansion
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Connect directly with active municipal stewardship programs, volunteer shifts, and verified academic research models.
          </p>
        </div>
      </section>

      {/* Main Content Hub */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        {/* City Filter Control Bar */}
        <div className="mb-12 p-6 border border-[#102f26]/15 bg-[#f1f6f2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
              Location Filter
            </span>
            <p className="text-sm font-medium text-[#102f26]">
              Displaying active field initiatives for: <span className="underline font-mono uppercase text-xs">{userCity}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setUserCity("Vancouver")}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition ${
                userCity === "Vancouver" ? "bg-[#102f26] text-white" : "bg-white border border-[#102f26]/20 text-[#102f26]"
              }`}
            >
              Vancouver
            </button>
            <button
              onClick={() => setUserCity("Toronto")}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition ${
                userCity === "Toronto" ? "bg-[#102f26] text-white" : "bg-white border border-[#102f26]/20 text-[#102f26]"
              }`}
            >
              Toronto
            </button>
          </div>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Active Local Projects Feed */}
          <div>
            <div className="border-b border-[#102f26]/15 pb-4 mb-6 flex justify-between items-center">
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#102f26]">
                Active Field Projects &amp; Volunteer Intake
              </h2>
              <span className="font-mono text-[10px] text-[#39705d]">{filteredProjects.length} Available</span>
            </div>

            <div className="space-y-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="p-6 border border-[#102f26]/15 bg-[#f1f6f2] transition hover:border-[#102f26]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#39705d]">
                      {project.organization}
                    </span>
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-white border border-[#102f26]/10 text-[#102f26]">
                      {project.actionType}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium tracking-tight text-[#102f26] mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#526760] mb-4">
                    {project.description}
                  </p>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-b border-[#102f26] pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#102f26] hover:opacity-60"
                  >
                    Register / Volunteer Portal →
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 border border-dashed border-[#102f26]/30 bg-white">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
                Platform Action Integration
              </span>
              <p className="text-xs text-[#526760] mb-4">
                Completed a field shift or local tree planting initiative? Log your hours and direct impact metrics straight into your personal profile ledger.
              </p>
              <Link
                href="/habits"
                className="inline-flex items-center gap-2 bg-[#102f26] text-white px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em]"
              >
                Log Canopy Impact Action →
              </Link>
            </div>
          </div>

          {/* Academic Literature & Empirical Benchmarks */}
          <div>
            <div className="border-b border-[#102f26]/15 pb-4 mb-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#102f26]">
                Underpinning Academic Research
              </h2>
            </div>

            <div className="space-y-6 text-xs text-[#526760]">
              <div className="p-6 border border-[#102f26]/15 bg-white">
                <span className="font-mono text-[10px] text-[#39705d] block mb-1">Sustainable Cities and Society (2021)</span>
                <p className="font-medium text-[#102f26] text-sm mb-2">
                  &ldquo;Urban tree canopy effects on microclimate and human thermal comfort&rdquo;
                </p>
                <p className="italic text-[#71847d] mb-4">
                  Quantifies spatial cooling gradients across Pacific Northwest urban parks, confirming a 2.4°C to 3.2°C median reduction in pedestrian heat stress during peak thermal radiation events.
                </p>
                <a
                  href="https://doi.org/10.1016/j.scs.2021.103032"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono uppercase text-[10px] text-[#39705d] hover:underline"
                >
                  Access Paper DOI →
                </a>
              </div>

              <div className="p-6 border border-[#102f26]/15 bg-white">
                <span className="font-mono text-[10px] text-[#39705d] block mb-1">Forest Ecology and Management (2023)</span>
                <p className="font-medium text-[#102f26] text-sm mb-2">
                  &ldquo;Allometric scaling and carbon sequestration in temperate municipal forestry inventories&rdquo;
                </p>
                <p className="italic text-[#71847d] mb-4">
                  Establishes rigorous field measurement standards for stem diameter and crown projection mapping to evaluate municipal climate change mitigation efficacy.
                </p>
                <a
                  href="https://doi.org/10.1016/j.foreco.2023.121044"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono uppercase text-[10px] text-[#39705d] hover:underline"
                >
                  Access Paper DOI →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
