"use client";

import { useState } from 'react';
import Link from 'next/link';

interface CommunityProject {
  id: string;
  city: string;
  category: "Urban Forestry" | "Watershed Health" | "Habitat Restoration" | "Community Stewardship";
  title: string;
  organization: string;
  description: string;
  link: string;
}

const communityProjects: CommunityProject[] = [
  {
    id: "comm-01",
    city: "Vancouver",
    category: "Habitat Restoration",
    title: "Stanley Park Ecological Restoration & Canopy Monitoring",
    organization: "Stanley Park Ecology Society (SPES)",
    description: "Join field crews and volunteer cohorts engaged in invasive species removal, native understory planting, and post-looper moth forest recovery monitoring.",
    link: "https://stanleyparkecology.ca/ecology/conservation/",
  },
  {
    id: "comm-02",
    city: "Vancouver",
    category: "Watershed Health",
    title: "Urban Streamkeepers & Salmon Habitat Sampling",
    organization: "Pacific Salmon Foundation & Streamkeepers",
    description: "Participate in benthic macroinvertebrate sampling, water quality testing, and riparian zone rehabilitation across regional urban watersheds.",
    link: "https://psf.ca/what-we-do/community-salmon-program/",
  },
  {
    id: "comm-03",
    city: "Toronto",
    category: "Urban Forestry",
    title: "Ravine Strategy Canopy & Stewardship Initiative",
    organization: "City of Toronto Parks, Forestry & Recreation",
    description: "Engage in community-led tree planting, erosion control, and biodiversity baseline inventories across Toronto's expansive ravine network.",
    link: "https://www.toronto.ca/city-government/accountability-operations-customer-service/long-term-vision-plans-and-strategies/ravine-strategy/",
  },
  {
    id: "comm-04",
    city: "Toronto",
    category: "Community Stewardship",
    title: "Backyard Tree Planting & Neighborhood Canopy Growth",
    organization: "LEAF (Local Enhancement and Appreciation of Forests)",
    description: "Collaborate on neighborhood-level urban forestry education, yard tree planting consultations, and resident stewardship workshops.",
    link: "https://www.yourleaf.org/planting-private-property",
  },
];

export default function CommunityActionPage() {
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
            Community Hub · Initiative / 02
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Broad Community Action &amp; Regional Stewardship
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Connect directly with active field initiatives, ecological restoration crews, and municipal stewardship programs in your region.
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
              Stewardship Pillar
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Urban Forestry", "Watershed Health", "Habitat Restoration", "Community Stewardship"].map((cat) => (
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
                Verified Field Programs &amp; Portals
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
                      Direct Program &amp; Volunteer Portal →
                    </a>
                  </div>
                ))
              ) : (
                <div className="p-12 border border-dashed border-[#102f26]/20 text-center font-mono text-xs text-[#526760] uppercase tracking-wider">
                  No active stewardship programs found matching this category and region combination.
                </div>
              )}
            </div>

            <div className="mt-8 p-6 border border-dashed border-[#102f26]/30 bg-white">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
                Ledger Integration
              </span>
              <p className="text-xs text-[#526760] mb-4">
                Completed volunteer hours or field stewardship work? Log your participation directly to your impact ledger.
              </p>
              <Link
                href="/habits"
                className="inline-flex items-center gap-2 bg-[#102f26] text-white px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em]"
              >
                Log Volunteer Hours to Ledger →
              </Link>
            </div>
          </div>

          {/* Research & Field Documentation */}
          <div>
            <div className="border-b border-[#102f26]/15 pb-4 mb-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#102f26]">
                Regional Ecology &amp; Frameworks
              </h2>
            </div>

            <div className="space-y-6 text-xs text-[#526760]">
              <div className="p-6 border border-[#102f26]/15 bg-white">
                <span className="font-mono text-[10px] text-[#39705d] block mb-1">SPES Conservation Report</span>
                <p className="font-medium text-[#102f26] text-sm mb-2">
                  Urban Forest Resilience &amp; Microclimate Adaptation in Coastal Temperate Zones
                </p>
                <p className="italic text-[#71847d] mb-4">
                  Outlines canopy vulnerability thresholds and multi-species understory reinforcement strategies.
                </p>
              </div>

              <div className="p-6 border border-[#102f26]/15 bg-white">
                <span className="font-mono text-[10px] text-[#39705d] block mb-1">Urban Ravine Guidelines</span>
                <p className="font-medium text-[#102f26] text-sm mb-2">
                  Watershed Protection &amp; Invasive Species Management Frameworks
                </p>
                <p className="italic text-[#71847d] mb-4">
                  Standardized protocols for community-led restoration and soil stabilization across urban ravines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
