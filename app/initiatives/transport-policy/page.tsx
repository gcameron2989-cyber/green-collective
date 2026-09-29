"use client";

import { useState } from 'react';
import Link from 'next/link';

interface TransitProject {
  id: string;
  city: string;
  category: "Active Transport" | "Public Transit Advocacy" | "Fleet Electrification" | "Charging Infrastructure";
  title: string;
  organization: string;
  description: string;
  link: string;
}

const transitProjects: TransitProject[] = [
  {
    id: "tr-01",
    city: "Vancouver",
    category: "Public Transit Advocacy",
    title: "TransLink Future Mobility & Zero-Emission Bus Consultations",
    organization: "TransLink Regional Transit",
    description: "Participate in public engagement forums shaping the rollout of zero-emission battery-electric and hydrogen fuel cell buses across the Lower Mainland network.",
    link: "https://www.translink.ca",
  },
  {
    id: "tr-02",
    city: "Vancouver",
    category: "Active Transport",
    title: "Protected Bike Lane & Pedestrian Corridor Expansion",
    organization: "HUB Cycling & Vancouver Active Mobility",
    description: "Support regional cycling advocacy campaigns and community workshops pushing for separated active transportation infrastructure across major urban corridors.",
    link: "https://bikehub.ca",
  },
  {
    id: "tr-03",
    city: "Toronto",
    category: "Fleet Electrification",
    title: "Commercial & Municipal Fleet Transition Working Group",
    organization: "Environmental Defence / Clean Transport Toronto",
    description: "Engage with regional policy roundtables addressing logistical hurdles, depot charging constraints, and emissions standards for heavy-duty commercial freight.",
    link: "https://environmentaldefence.ca",
  },
  {
    id: "tr-04",
    city: "Toronto",
    category: "Charging Infrastructure",
    title: "Multi-Unit Residential EV Charging Initiative",
    organization: "ChargeLab / Toronto Sustainability Office",
    description: "Advocate for and coordinate retrofitting incentives for Level 2 EV charging infrastructure across high-density residential and commercial parking blocks.",
    link: "https://www.toronto.ca",
  },
];

export default function TransportActionHubPage() {
  const [userCity, setUserCity] = useState<string>("Vancouver");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredProjects = transitProjects.filter((proj) => {
    const matchesCity = proj.city.toLowerCase() === userCity.toLowerCase();
    const matchesCategory = selectedCategory === "All" || proj.category === selectedCategory;
    return matchesCity && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24">
      {/* Editorial Page Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
            Mobility Hub · Initiative / 03
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Sustainable Transit &amp; Mobility Action
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Engage with regional active transportation campaigns, public transit infrastructure consultations, and commercial fleet decarbonization networks.
          </p>
        </div>
      </section>

      {/* Main Content Hub */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        {/* Filter Controls Bar */}
        <div className="mb-12 p-6 border border-[#102f26]/15 bg-[#f1f6f2] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
                Region
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUserCity("Vancouver")}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                    userCity === "Vancouver" ? "bg-[#102f26] text-white" : "bg-white border border-[#102f26]/20 text-[#102f26]"
                  }`}
                >
                  Vancouver
                </button>
                <button
                  onClick={() => setUserCity("Toronto")}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                    userCity === "Toronto" ? "bg-[#102f26] text-white" : "bg-white border border-[#102f26]/20 text-[#102f26]"
                  }`}
                >
                  Toronto
                </button>
              </div>
            </div>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
              Mobility Pillar
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Active Transport", "Public Transit Advocacy", "Fleet Electrification", "Charging Infrastructure"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition ${
                    selectedCategory === cat ? "bg-[#39705d] text-white" : "bg-white border border-[#102f26]/20 text-[#102f26]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Active Projects Feed */}
          <div>
            <div className="border-b border-[#102f26]/15 pb-4 mb-6 flex justify-between items-center">
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#102f26]">
                Active Transit Programs &amp; Engagement Portals
              </h2>
              <span className="font-mono text-[10px] text-[#39705d]">{filteredProjects.length} Active</span>
            </div>

            <div className="space-y-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <div key={project.id} className="p-6 border border-[#102f26]/15 bg-[#f1f6f2] transition hover:border-[#102f26]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#39705d]">
                        {project.organization}
                      </span>
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-white border border-[#102f26]/10 text-[#102f26]">
                        {project.category}
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
                      External Program Portal →
                    </a>
                  </div>
                ))
              ) : (
                <div className="p-12 border border-dashed border-[#102f26]/20 text-center font-mono text-xs text-[#526760] uppercase tracking-wider">
                  No active mobility programs found matching this category and region combination.
                </div>
              )}
            </div>

            <div className="mt-8 p-6 border border-dashed border-[#102f26]/30 bg-white">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
                Platform Action Integration
              </span>
              <p className="text-xs text-[#526760] mb-4">
                Committed to active commuting, public transit usage, or regional mobility advocacy? Log your modal shift directly into your ledger.
              </p>
              <Link
                href="/habits"
                className="inline-flex items-center gap-2 bg-[#102f26] text-white px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em]"
              >
                Log Commute Action to Ledger →
              </Link>
            </div>
          </div>

          {/* Academic Literature & Policy Frameworks */}
          <div>
            <div className="border-b border-[#102f26]/15 pb-4 mb-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#102f26]">
                Systemic Frameworks &amp; Literature
              </h2>
            </div>

            <div className="space-y-6 text-xs text-[#526760]">
              <div className="p-6 border border-[#102f26]/15 bg-white">
                <span className="font-mono text-[10px] text-[#39705d] block mb-1">Transport Research Part D (2022)</span>
                <p className="font-medium text-[#102f26] text-sm mb-2">
                  &ldquo;Lifecycle greenhouse gas emissions of battery-electric and hydrogen fuel cell commercial fleets&rdquo;
                </p>
                <p className="italic text-[#71847d] mb-4">
                  Evaluates cradle-to-grave powertrain impacts, emphasizing that infrastructure scaling and grid carbon intensity dictate true reduction milestones.
                </p>
              </div>

              <div className="p-6 border border-[#102f26]/15 bg-white">
                <span className="font-mono text-[10px] text-[#39705d] block mb-1">IPCC Sixth Assessment Report (2022)</span>
                <p className="font-medium text-[#102f26] text-sm mb-2">
                  &ldquo;Transport Sector Mitigation Pathways and Avoid-Shift-Improve Frameworks&rdquo;
                </p>
                <p className="italic text-[#71847d] mb-4">
                  Establishes global policy guidelines merging active transportation modal shift with systemic technological upgrades for 1.5°C alignment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
