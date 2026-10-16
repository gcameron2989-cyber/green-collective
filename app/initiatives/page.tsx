"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

export interface RealInitiative {
  id: string;
  title: string;
  leadOrg: string;
  category: string;
  status: string;
  region: "VANCOUVER / UBC" | "TORONTO / GTA" | "GLOBAL / REMOTE";
  locationTag: string;
  description: string;
  impactScope: string;
  officialPortalUrl: string;
  isUserSubmitted?: boolean;
}

export const INITIAL_INITIATIVES: RealInitiative[] = [
  // --- VANCOUVER & UBC OPPORTUNITIES ---
  {
    id: "ubc-forestry-research",
    title: "UBC Faculty of Forestry Innovation & Research Hub",
    leadOrg: "UBC Faculty of Forestry & Environmental Stewardship",
    category: "ECOSYSTEM STEWARDSHIP",
    status: "ACTIVE PROGRAM",
    region: "VANCOUVER / UBC",
    locationTag: "UBC POINT GREY",
    description: "Leading multi-disciplinary research initiatives in ecosystems, climate change, forest bioproducts, and bioeconomy innovations across UBC's educational research forests.",
    impactScope: "Global Forest Policy · Research Forests Management",
    officialPortalUrl: "https://forestry.ubc.ca/research/",
  },
  {
    id: "ubc-lfs-dairy-centre",
    title: "UBC Land & Food Systems Community & Research Programs",
    leadOrg: "UBC Faculty of Land and Food Systems",
    category: "SUSTAINABLE AGRICULTURE",
    status: "VOLUNTEER & COMMUNITY",
    region: "VANCOUVER / UBC",
    locationTag: "FRASER VALLEY / UBC",
    description: "Community outreach, educational tours, and working study farm opportunities advancing real-world sustainable agricultural solutions and animal welfare science.",
    impactScope: "Agroecosystem Research · Community Educational Workshops",
    officialPortalUrl: "https://dairycentre.landfood.ubc.ca/community/",
  },
  {
    id: "ubc-science-atmospheric",
    title: "UBC Faculty of Science: Atmospheric Science & Climate",
    leadOrg: "UBC Faculty of Science",
    category: "CLIMATE SCIENCE",
    status: "ACADEMIC & RESEARCH",
    region: "VANCOUVER / UBC",
    locationTag: "UBC POINT GREY",
    description: "Specialized research and academic programs examining air quality, meteorological processes, probabilistic climate forecasting, and global environmental change.",
    impactScope: "Numerical Weather Prediction · Quantitative Climate Studies",
    officialPortalUrl: "https://science.ubc.ca/students/programs/atmospheric-science",
  },
  {
    id: "ubc-apsc-clean-energy",
    title: "UBC Clean Energy Research Centre (CERC)",
    leadOrg: "UBC Faculty of Applied Science",
    category: "GREEN INFRASTRUCTURE",
    status: "ACTIVE RESEARCH",
    region: "VANCOUVER / UBC",
    locationTag: "UBC POINT GREY",
    description: "UBC's flagship clean energy hub focusing on sustainable energy conversion, industrial decarbonization, hydrogen storage, and fuel cell technologies.",
    impactScope: "Clean Energy Storage · Industrial Decarbonization",
    officialPortalUrl: "https://apsc.ubc.ca/research-partnerships/arctic/sustainable-energy-resource-management",
  },
  {
    id: "van-climate-emergency",
    title: "City of Vancouver Climate Emergency Action Plan (CEAP)",
    leadOrg: "City of Vancouver Sustainability Office",
    category: "MUNICIPAL POLICY",
    status: "ACTIVE MUNICIPAL PLAN",
    region: "VANCOUVER / UBC",
    locationTag: "VANCOUVER CITY-WIDE",
    description: "Municipal roadmap targeting a 50% carbon pollution reduction by 2030 through zero-emission building mandates, active travel networks, and natural climate solutions.",
    impactScope: "50% Carbon Cut by 2030 · Zero-Emission Transit",
    officialPortalUrl: "https://vancouver.ca/green-vancouver/climate-emergency-action-plan-in-depth.aspx",
  },
  {
    id: "st-george-rainway-project",
    title: "St. George Rainway Infrastructure & Citizen Science",
    leadOrg: "City of Vancouver Planning & Community Partners",
    category: "GREEN INFRASTRUCTURE",
    status: "COMMUNITY ENGAGEMENT",
    region: "VANCOUVER / UBC",
    locationTag: "MOUNT PLEASANT",
    description: "Transforming historic stream corridors into green rainwater infrastructure to reduce neighborhood flooding, filter urban stormwater, and host baseline biodiversity citizen science campaigns.",
    impactScope: "Urban Biodiversity Corridors · Stormwater Filtration",
    officialPortalUrl: "https://www.shapeyourcity.ca/st-george-rainway",
  },
  {
    id: "van-west-end-community-plan",
    title: "West End Community Plan & Neighborhood Sustainability",
    leadOrg: "City of Vancouver Local Planning",
    category: "MUNICIPAL DISTRICT",
    status: "ACTIVE COMMUNITY PLAN",
    region: "VANCOUVER / UBC",
    locationTag: "WEST END",
    description: "Comprehensive neighborhood planning framework driving urban canopy density, active transportation corridors, green building standards, and local heritage protection.",
    impactScope: "Urban Forest Enhancement · Micro-Mobility Corridors",
    officialPortalUrl: "https://vancouver.ca/home-property-development/west-end-community-plan.aspx",
  },

  // --- TORONTO & GTA OPPORTUNITIES ---
  {
    id: "toronto-ravine-strategy-hub",
    title: "City of Toronto Ravine Strategy & Community Stewardship",
    leadOrg: "City of Toronto Parks, Forestry & Recreation",
    category: "ECOLOGICAL CONSERVATION",
    status: "VOLUNTEER & MUNICIPAL",
    region: "TORONTO / GTA",
    locationTag: "TORONTO RAVINES",
    description: "Protection and ecological enhancement of Toronto's 11,000-hectare ravine system through invasive species management, volunteer stewardship events, and gateway trail construction.",
    impactScope: "11,000 Hectares Protected · Public Stewardship Programs",
    officialPortalUrl: "https://www.toronto.ca/city-government/accountability-operations-customer-service/long-term-vision-plans-and-strategies/ravine-strategy/",
  },
  {
    id: "trca-watershed-living-city",
    title: "TRCA Watershed Management & Conservation Programs",
    leadOrg: "Toronto and Region Conservation Authority (TRCA)",
    category: "WATERSHED MANAGEMENT",
    status: "ACTIVE CONSERVATION",
    region: "TORONTO / GTA",
    locationTag: "GREATER TORONTO AREA",
    description: "Regional watershed protection, flood control management, habitat restoration, and eco-system monitoring across 9 major river systems in Southern Ontario.",
    impactScope: "9 Regional Watersheds · Wetland Restoration Projects",
    officialPortalUrl: "https://trca.ca/conservation/watershed-management/",
  },

  // --- GLOBAL & REMOTE OPPORTUNITIES ---
  {
    id: "c40-cities-network",
    title: "C40 Cities Global Climate Leadership Network",
    leadOrg: "C40 Cities Climate Leadership Group",
    category: "GLOBAL POLICY",
    status: "GLOBAL NETWORK",
    region: "GLOBAL / REMOTE",
    locationTag: "INTERNATIONAL",
    description: "A global network of mayors and urban leaders taking urgent action to confront the climate crisis and scale urban decarbonization strategies worldwide.",
    impactScope: "100+ World Megacities · Benchmarked Emissions Data",
    officialPortalUrl: "https://www.c40.org",
  },
  {
    id: "earthshot-prize-accelerator",
    title: "The Earthshot Prize Eco-Innovation Hub",
    leadOrg: "The Royal Foundation",
    category: "GLOBAL INNOVATION",
    status: "GLOBAL ACCELERATOR",
    region: "GLOBAL / REMOTE",
    locationTag: "INTERNATIONAL",
    description: "Prestigious global environmental prize searching for and scaling solutions across five 'Earthshots': Protect & Restore Nature, Clean Our Air, Revive Our Oceans, Build a Waste-Free World, and Fix Our Climate.",
    impactScope: "£50M Scaling Capital · 5 Environmental Pillars",
    officialPortalUrl: "https://earthshotprize.org",
  },
];

export default function InitiativesPage() {
  const [initiatives, setInitiatives] = useState<RealInitiative[]>(INITIAL_INITIATIVES);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    leadOrg: "",
    category: "COMMUNITY ACTION",
    region: "VANCOUVER / UBC" as RealInitiative["region"],
    locationTag: "",
    description: "",
    impactScope: "",
    officialPortalUrl: "",
  });

  const filteredInitiatives = useMemo(() => {
    return initiatives.filter((item) => {
      let matchesTab = true;
      if (activeTab === "VANCOUVER") matchesTab = item.region === "VANCOUVER / UBC";
      if (activeTab === "TORONTO") matchesTab = item.region === "TORONTO / GTA";
      if (activeTab === "GLOBAL") matchesTab = item.region === "GLOBAL / REMOTE";

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.leadOrg.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.locationTag.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [initiatives, activeTab, searchQuery]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.leadOrg || !formData.description) return;

    const newInitiative: RealInitiative = {
      id: `custom-${Date.now()}`,
      title: formData.title,
      leadOrg: formData.leadOrg,
      category: formData.category.toUpperCase(),
      status: "PROPOSED INITIATIVE",
      region: formData.region,
      locationTag: formData.locationTag.toUpperCase() || formData.region.split(" ")[0],
      description: formData.description,
      impactScope: formData.impactScope || "Community Proposed Project",
      officialPortalUrl: formData.officialPortalUrl.startsWith("http")
        ? formData.officialPortalUrl
        : `https://${formData.officialPortalUrl || "green-collective.vercel.app"}`,
      isUserSubmitted: true,
    };

    setInitiatives([newInitiative, ...initiatives]);
    setIsModalOpen(false);
    setFormData({
      title: "",
      leadOrg: "",
      category: "COMMUNITY ACTION",
      region: "VANCOUVER / UBC",
      locationTag: "",
      description: "",
      impactScope: "",
      officialPortalUrl: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-sans antialiased pb-20">
      <main className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        {/* Header Action Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Climate Initiatives Directory</h1>
            <p className="text-xs font-mono text-gray-500 mt-1">Verified regional programs, campus frameworks, research labs, and active climate projects.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-[#0F2C23] hover:bg-black text-white font-mono text-xs font-bold tracking-wider uppercase transition self-start md:self-auto"
          >
            + Propose New Initiative
          </button>
        </div>

        {/* Region Subpage Tabs + Search Bar Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 font-mono text-[11px] tracking-wider border-b lg:border-b-0 border-gray-200">
            {[
              { label: "ALL OPPORTUNITIES", key: "ALL" },
              { label: "VANCOUVER & UBC", key: "VANCOUVER" },
              { label: "TORONTO & GTA", key: "TORONTO" },
              { label: "GLOBAL & REMOTE", key: "GLOBAL" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 uppercase transition-all whitespace-nowrap font-bold ${
                  activeTab === tab.key
                    ? "bg-[#0F2C23] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full lg:w-80">
            <input
              type="text"
              placeholder="Search initiatives, research, wards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black font-mono"
            />
          </div>
        </div>

        {/* Initiatives Cards Container */}
        <div className="space-y-4">
          {filteredInitiatives.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center text-xs font-mono text-gray-500">
              NO VERIFIED INITIATIVES FOUND MATCHING YOUR SELECTION.
            </div>
          ) : (
            filteredInitiatives.map((item) => (
              <div
                key={item.id}
                className={`bg-white border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition ${
                  item.isUserSubmitted ? "border-emerald-500/50 bg-emerald-50/20" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex-1 max-w-4xl">
                  <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-gray-400 uppercase mb-2">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span className={item.isUserSubmitted ? "text-emerald-700 font-bold" : "text-gray-500"}>
                      {item.status}
                    </span>
                    <span>•</span>
                    <span className="text-gray-500">{item.locationTag}</span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mb-0.5">
                    <Link href={`/initiatives/${item.id}`} className="hover:text-[#0F2C23] transition">
                      {item.title}
                    </Link>
                  </h2>

                  <p className="font-mono text-xs text-gray-500 mb-2">
                    Lead: <span className="text-gray-700 font-semibold">{item.leadOrg}</span>
                  </p>

                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <p className="text-[11px] font-mono text-gray-500">
                    <strong className="text-gray-700 font-semibold">Impact Scope:</strong> {item.impactScope}
                  </p>
                </div>

                <div className="shrink-0 flex items-center">
                  <a
                    href={item.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto px-5 py-3 bg-[#0F2C23] hover:bg-black text-white text-[11px] font-mono tracking-widest uppercase font-bold transition text-center flex items-center justify-center gap-1.5"
                  >
                    VISIT OFFICIAL PORTAL ↗
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* MODAL: PROPOSE AN INITIATIVE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-300 w-full max-w-lg p-6 shadow-xl relative font-sans">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-900">
                Propose / Start an Initiative
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black font-mono text-xs"
              >
                ✕ CLOSE
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[11px] text-gray-500 uppercase mb-1">Initiative Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Point Grey Community Micro-Composting"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 uppercase mb-1">Lead Org / Group *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Student Collective"
                    value={formData.leadOrg}
                    onChange={(e) => setFormData({ ...formData, leadOrg: e.target.value })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 uppercase mb-1">Region *</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value as RealInitiative["region"] })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans bg-white"
                  >
                    <option value="VANCOUVER / UBC">VANCOUVER / UBC</option>
                    <option value="TORONTO / GTA">TORONTO / GTA</option>
                    <option value="GLOBAL / REMOTE">GLOBAL / REMOTE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g., URBAN AGRICULTURE"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 uppercase mb-1">Location Tag</label>
                  <input
                    type="text"
                    placeholder="e.g., KITSILANO"
                    value={formData.locationTag}
                    onChange={(e) => setFormData({ ...formData, locationTag: e.target.value })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 uppercase mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Outline the core objective, research goals, or volunteer opportunities..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 uppercase mb-1">Impact Scope</label>
                <input
                  type="text"
                  placeholder="e.g., Neighborhood Composting · 100+ Volunteers"
                  value={formData.impactScope}
                  onChange={(e) => setFormData({ ...formData, impactScope: e.target.value })}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 uppercase mb-1">External Link / Web Portal</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.officialPortalUrl}
                  onChange={(e) => setFormData({ ...formData, officialPortalUrl: e.target.value })}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-bold uppercase hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F2C23] text-white font-bold uppercase hover:bg-black transition"
                >
                  Submit Initiative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
