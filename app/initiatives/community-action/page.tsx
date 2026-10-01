"use client";

import { useState } from 'react';
import Link from 'next/link';

interface CommunityProject {
  id: string;
  city: string;
  category: "Urban Forestry" | "Watershed & Ecology" | "Food Systems & Waste" | "Transit & Mobility";
  title: string;
  organization: string;
  description: string;
  link: string;
}

const communityProjects: CommunityProject[] = [
  {
    id: "proj-01",
    city: "Vancouver",
    category: "Urban Forestry",
    title: "Dedicated Invasive Removal Team (DIRT) & EcoStewards",
    organization: "Stanley Park Ecology Society",
    description: "Participate in bi-weekly habitat restoration sessions removing invasive species and collecting baseline ecological tracking data in Stanley Park.",
    link: "https://stanleyparkecology.ca/about-stanley-park-ecology/volunteer/",
  },
  {
    id: "proj-02",
    city: "Vancouver",
    category: "Watershed & Ecology",
    title: "Seeding Stewardship: Rain Garden & Stormwater Maintenance",
    organization: "City of Vancouver Parks Board",
    description: "Adopt and maintain local naturalized rain gardens and bioswales to support urban stormwater management and municipal biodiversity corridors.",
    link: "https://vancouver.ca/home-property-development/seeding-stewardship-program.aspx",
  },
  {
    id: "proj-03",
    city: "Vancouver",
    category: "Food Systems & Waste",
    title: "Neighborhood Food Systems & Composting Hubs",
    organization: "Vancouver Local Food Networks",
    description: "Engage in community composting initiatives and localized urban agriculture projects designed to minimize transport emissions and foster food resilience.",
    link: "https://vancouver.ca/home-property-development/composting.aspx",
  },
  {
    id: "proj-04",
    city: "Toronto",
    category: "Urban Forestry",
    title: "Community Canopy Planting & Tree Vulnerability Audits",
    organization: "LEAF (Local Enhancement & Appreciation of Forests)",
    description: "Participate in neighborhood planting blitzes and residential tree care programs to expand Toronto's urban forest canopy density.",
    link: "https://www.torontoleaf.org/get-involved/volunteer/",
  },
  {
    id: "proj-05",
    city: "Toronto",
    category: "Transit & Mobility",
    title: "Active Transportation & Transit Corridor Advocacy",
    organization: "Environmental Defence / Toronto Active Mobility",
    description: "Contribute to regional public consultations promoting protected bike lanes, pedestrianized corridors, and electrified municipal transit expansion.",
    link: "https://environmentaldefence.ca/campaign/clean-transport-toronto/",
  },
];

export default function CommunityActionHubPage() {
  const [userCity, setUserCity] = useState<string>("Vancouver");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredProjects = communityProjects.filter((proj) => {
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
            Community Action Hub · Initiative / 02
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Broad Community Action &amp; Regional Stewardship
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Engage directly with multi-sectoral municipal programs spanning urban forestry, watershed restoration, food security, and active mobility.
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
              Action Pillar
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Urban Forestry", "Watershed & Ecology", "Food Systems & Waste", "Transit & Mobility"].map((cat) => (
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
                Verified Local Projects &amp; Volunteer Opportunities
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
                  No active projects found matching this category and region combination.
                </div>
              )}
            </div>

            <div className="mt-8 p-6 border border-dashed border-[#102f26]/30 bg-white">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
                Platform Action Integration
              </span>
              <p className="text-xs text-[#526760] mb-4">
                Participated in any of these community programs? Log your actions directly into your institutional ledger to calculate cumulative ecological offset.
              </p>
              <Link
                href="/habits"
                className="inline-flex items-center gap-2 bg-[#102f26] text-white px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em]"
              >
                Log Action to Personal Ledger →
              </Link>
            </div>
          </div>

          {/* Academic Literature & Systems Frameworks */}
          <div>
            <div className="border-b border-[#102f26]/15 pb-4 mb-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#102f26]">
                Systemic Frameworks &amp; Literature
              </h2>
            </div>

            <div className="space-y-6 text-xs text-[#526760]">
              <div className="p-6 border border-[#102f26]/15 bg-white">
                <span className="font-mono text-[10px] text-[#39705d] block mb-1">Urban Ecosystems (2022)</span>
                <p className="font-medium text-[#102f26] text-sm mb-2">
                  &ldquo;Collective efficacy and municipal sustainability program adoption in North American cities&rdquo;
                </p>
                <p className="italic text-[#71847d] mb-4">
                  Analyzes how grassroots volunteer participation rates directly correlate with long-term municipal carbon reduction target compliance.
                </p>
              </div>

              <div className="p-6 border border-[#102f26]/15 bg-white">
                <span className="font-mono text-[10px] text-[#39705d] block mb-1">Journal of Environmental Management (2023)</span>
                <p className="font-medium text-[#102f26] text-sm mb-2">
                  &ldquo;Evaluating multi-pillar community interventions for urban resilience&rdquo;
                </p>
                <p className="italic text-[#71847d] mb-4">
                  Demonstrates the compounding ecological benefits of coupling urban forestry stewardship with decentralized stormwater and local food production networks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
