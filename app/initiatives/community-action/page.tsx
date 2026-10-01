"use client";

import { useState } from 'react';
import Link from 'next/link';

interface CommunityProject {
  id: string;
  city: string;
  category: "Urban Forestry" | "Watershed Health" | "Habitat Restoration" | "Community Stewardship" | "Virtual Research & Advocacy";
  title: string;
  organization: string;
  description: string;
  link: string;
}

const communityProjects: CommunityProject[] = [
  // VANCOUVER
  {
    id: "comm-01",
    city: "Vancouver",
    category: "Habitat Restoration",
    title: "Stanley Park Ecological Restoration & Canopy Monitoring",
    organization: "Stanley Park Ecology Society (SPES)",
    description: "Join field crews and volunteer cohorts engaged in invasive species removal, native understory planting, and post-looper moth forest recovery monitoring.",
    link: "https://stanleyparkecology.ca/about-stanley-park-ecology/volunteer/",
  },
  {
    id: "comm-02",
    city: "Vancouver",
    category: "Community Stewardship",
    title: "Repair Café & Zero-Waste Circular Economy Workshops",
    organization: "Society Promoting Environmental Conservation (SPEC)",
    description: "Help extend the lifecycle of everyday items, repair household goods, and promote waste reduction in Kitsilano and surrounding Vancouver communities.",
    link: "https://spec.bc.ca/volunteer/",
  },
  {
    id: "comm-03",
    city: "Vancouver",
    category: "Watershed Health",
    title: "Metro Vancouver Regional Parks Ecological Restoration",
    organization: "Metro Vancouver Regional Parks Foundation",
    description: "Participate in hands-on habitat restoration, invasive species management, and biodiversity monitoring across regional parks like Burnaby Lake and Pacific Spirit.",
    link: "https://mvrpfoundation.ca/get-involved/volunteer-2/",
  },
  {
    id: "comm-04",
    city: "Vancouver",
    category: "Habitat Restoration",
    title: "Biodiversity Counts & iNaturalist Project Administration",
    organization: "Nature Vancouver",
    description: "Contribute to local bird censuses, flora/fauna field trips, and admin support for the Metro Vancouver Regional District City Nature Challenge.",
    link: "https://naturevancouver.ca/volunteers/",
  },

  // TORONTO
  {
    id: "comm-05",
    city: "Toronto",
    category: "Urban Forestry",
    title: "Ravine Strategy Canopy & Stewardship Initiative",
    organization: "City of Toronto Parks, Forestry & Recreation",
    description: "Engage in community-led tree planting, erosion control, and biodiversity baseline inventories across Toronto's expansive ravine network.",
    link: "https://www.toronto.ca/city-government/accountability-operations-customer-service/long-term-vision-plans-and-strategies/ravine-strategy/",
  },
  {
    id: "comm-06",
    city: "Toronto",
    category: "Community Stewardship",
    title: "Backyard Tree Planting & Neighborhood Canopy Growth",
    organization: "LEAF (Local Enhancement and Appreciation of Forests)",
    description: "Collaborate on neighborhood-level urban forestry education, yard tree planting consultations, and resident stewardship workshops.",
    link: "https://www.yourleaf.org/planting-private-property",
  },
  {
    id: "comm-07",
    city: "Toronto",
    category: "Virtual Research & Advocacy",
    title: "Toronto Climate Action Network (TCAN) Coalition",
    organization: "TCAN Member Groups",
    description: "Connect with municipal climate advocacy groups across the GTA working on housing energy efficiency, transit expansion, and green jobs.",
    link: "https://www.tcan.ca/volunteer",
  },

  // GLOBAL / REMOTE
  {
    id: "comm-08",
    city: "Global / Remote",
    category: "Virtual Research & Advocacy",
    title: "Global Forest Watch & Satellite Canopy Mapping",
    organization: "World Resources Institute (WRI)",
    description: "Contribute remotely to open-source satellite imagery classification, identifying deforestation hotspots, and verifying tree cover loss data worldwide.",
    link: "https://www.globalforestwatch.org/help/get-involved/",
  },
  {
    id: "comm-09",
    city: "Global / Remote",
    category: "Virtual Research & Advocacy",
    title: "Open Climate Data & Greenhouse Gas Inventory Mapping",
    organization: "Climate TRACE",
    description: "Assist virtual research cohorts in analyzing open-source emissions datasets, industrial facility tracking, and sectoral carbon accounting models.",
    link: "https://climatetrace.org/",
  },
  {
    id: "comm-10",
    city: "Global / Remote",
    category: "Virtual Research & Advocacy",
    title: "Zooniverse Citizen Science: Biodiversity & Climate Observations",
    organization: "Zooniverse & University of Oxford",
    description: "Participate in crowdsourced ecological classification, analyzing camera trap imagery, audio recordings of endangered bird species, and historical weather logs.",
    link: "https://www.zooniverse.org/projects?query=climate&selectedTab=science",
  }
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
    <main className="min-h-screen bg-white text-[#102f26] pb-24 font-sans">
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
            Connect directly with active field initiatives, ecological restoration crews, municipal stewardship programs, and virtual remote research coalitions.
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
                Region / Scope
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {["Vancouver", "Toronto", "Global / Remote"].map((city) => (
                  <button
                    key={city}
                    onClick={() => setUserCity(city)}
                    className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                      userCity === city ? "bg-[#102f26] text-white" : "bg-white border border-[#102f26]/20 text-[#102f26]"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
              Stewardship Pillar
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Urban Forestry", "Watershed Health", "Habitat Restoration", "Community Stewardship", "Virtual Research & Advocacy"].map((cat) => (
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
                Verified Field &amp; Virtual Programs ({userCity})
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
                Completed volunteer hours or remote conservation work? Log your participation directly to your impact ledger.
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
