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
  // --- VANCOUVER & UBC ---
  {
    id: "ubc-urban-forestry",
    title: "UBC Urban Forestry & Canopy Stewardship",
    leadOrg: "UBC Faculty of Forestry",
    category: "ECOSYSTEM STEWARDSHIP",
    status: "ACTIVE PROGRAM",
    region: "VANCOUVER / UBC",
    locationTag: "VANCOUVER / UBC",
    description: "Long-term monitoring of forest health, wildfire fuel loads, and carbon sequestration across research forests and campus canopy plots.",
    impactScope: "100+ Regional Plots Audited · Carbon Sink Monitoring",
    officialPortalUrl: "https://forestry.ubc.ca",
  },
  {
    id: "ubc-cap-2030",
    title: "UBC Climate Action Plan 2030 (CAP 2030)",
    leadOrg: "UBC Sustainability Hub",
    category: "CAMPUS DECARBONIZATION",
    status: "ACTIVE PROGRAM",
    region: "VANCOUVER / UBC",
    locationTag: "UBC POINT GREY",
    description: "Institutional net-zero roadmap targeting an 85% reduction in campus operational emissions and zero-waste residence operations by 2030.",
    impactScope: "District Energy Systems · Scope 3 Emission Reduction",
    officialPortalUrl: "https://sustain.ubc.ca/campus/climate-action/climate-action-plan",
  },
  {
    id: "vancouver-ceap",
    title: "City of Vancouver Climate Emergency Action Plan",
    leadOrg: "City of Vancouver",
    category: "MUNICIPAL POLICY",
    status: "ACTIVE PROGRAM",
    region: "VANCOUVER / UBC",
    locationTag: "VANCOUVER",
    description: "Data-driven roadmap cutting carbon pollution by 50% by 2030 through zero-emission buildings, active transit, and urban greening.",
    impactScope: "50% Carbon Reduction Target · Active Transportation Corridors",
    officialPortalUrl: "https://vancouver.ca/green-vancouver/vancouvers-climate-emergency.aspx",
  },
  {
    id: "vancouver-zero-waste-2040",
    title: "City of Vancouver Zero Waste 2040 Framework",
    leadOrg: "City of Vancouver",
    category: "CIRCULAR ECONOMY",
    status: "ACTIVE PROGRAM",
    region: "VANCOUVER / UBC",
    locationTag: "VANCOUVER",
    description: "Comprehensive municipal strategy eliminating disposable packaging, expanding commercial composting, and funding reusable container systems.",
    impactScope: "Single-Use Plastics Ban · Commercial Composting Expansion",
    officialPortalUrl: "https://vancouver.ca/green-vancouver/zero-waste-vancouver.aspx",
  },
  {
    id: "translink-climate-action-plan",
    title: "TransLink Climate Action Plan & Fleet Electrification",
    leadOrg: "TransLink BC",
    category: "SUSTAINABLE MOBILITY",
    status: "ACTIVE PROGRAM",
    region: "VANCOUVER / UBC",
    locationTag: "GREATER VANCOUVER",
    description: "Regional transit decarbonization roadmap prioritizing electric battery bus deployment, SkyTrain expansion, and active travel integration.",
    impactScope: "100% Zero-Emission Fleet Target · RapidBus Network",
    officialPortalUrl: "https://www.translink.ca/about-us/about-translink/sustainability",
  },
  {
    id: "st-george-rainway",
    title: "St. George Rainway Infrastructure Project",
    leadOrg: "City of Vancouver & Community Partners",
    category: "GREEN INFRASTRUCTURE",
    status: "ACTIVE PROGRAM",
    region: "VANCOUVER / UBC",
    locationTag: "VANCOUVER (EAST VAN)",
    description: "Transforming historic stream corridors into urban green rainwater systems to reduce storm flooding and restore local biodiversity.",
    impactScope: "Urban Rainwater Filtration · Biodiversity Corridors",
    officialPortalUrl: "https://www.shapeyourcity.ca/st-george-rainway",
  },

  // --- TORONTO & GTA ---
  {
    id: "toronto-transform-to",
    title: "City of Toronto TransformTO Net-Zero Strategy",
    leadOrg: "City of Toronto Environment & Climate Division",
    category: "DECARBONIZATION",
    status: "ACTIVE PROGRAM",
    region: "TORONTO / GTA",
    locationTag: "TORONTO",
    description: "City Council approved action plan targeting net-zero GHG emissions city-wide by 2040 through green building standards and fleet electrification.",
    impactScope: "Net-Zero by 2040 · Toronto Green Standard Enforcement",
    officialPortalUrl: "https://www.toronto.ca/services-payments/water-environment/environmentally-friendly-city-initiatives/transformto/",
  },
  {
    id: "toronto-ravine-strategy",
    title: "City of Toronto Ravine Strategy",
    leadOrg: "City of Toronto & TRCA",
    category: "ECOLOGICAL CONSERVATION",
    status: "ACTIVE PROGRAM",
    region: "TORONTO / GTA",
    locationTag: "TORONTO",
    description: "Protection and ecological enhancement of Toronto's 11,000-hectare ravine system, preserving natural canopy and urban watershed resilience.",
    impactScope: "11,000 Hectares Protected · Invasive Species Abatement",
    officialPortalUrl: "https://www.toronto.ca/services-payments/water-environment/trees/torontos-ravine-strategy/",
  },
  {
    id: "trca-green-infrastructure",
    title: "TRCA Watershed & Living City Initiative",
    leadOrg: "Toronto and Region Conservation Authority",
    category: "WATERSHED MANAGEMENT",
    status: "ACTIVE PROGRAM",
    region: "TORONTO / GTA",
    locationTag: "GREATER TORONTO AREA",
    description: "Restoring urban wetlands, safeguarding drinking water quality, and developing green infrastructure across Southern Ontario watersheds.",
    impactScope: "9 Regional Watersheds · Wetland Restoration Projects",
    officialPortalUrl: "https://trca.ca",
  },

  // --- GLOBAL & REMOTE ---
  {
    id: "c40-cities-climate-network",
    title: "C40 Cities Global Decarbonization Network",
    leadOrg: "C40 Climate Leadership Group",
    category: "GLOBAL POLICY",
    status: "ACTIVE PROGRAM",
    region: "GLOBAL / REMOTE",
    locationTag: "INTERNATIONAL",
    description: "Global coalition of mayors and urban leaders taking urgent action to confront climate change through peer-reviewed municipal targets.",
    impactScope: "100+ World Megacities · Benchmarked Emissions Data",
    officialPortalUrl: "https://www.c40.org",
  },
  {
    id: "earthshot-prize",
    title: "The Earthshot Prize Eco-Innovation Accelerator",
    leadOrg: "The Royal Foundation",
    category: "GLOBAL INNOVATION",
    status: "ACTIVE PROGRAM",
    region: "GLOBAL / REMOTE",
    locationTag: "INTERNATIONAL",
    description: "Global climate incentive awards scaling solutions for climate repair, ocean revival, clean air, and zero-waste systems.",
    impactScope: "£50M Scaling Capital · 5 Environmental Pillars",
    officialPortalUrl: "https://earthshotprize.org",
  },
];

export default function InitiativesPage() {
  const [initiatives, setInitiatives] = useState<RealInitiative[]>(INITIAL_INITIATIVES);
  const [activeRegion, setActiveRegion] = useState<string>("ALL REGIONS");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Modal / Form state for proposed initiatives
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
      const matchesRegion =
        activeRegion === "ALL REGIONS" || item.region === activeRegion;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.leadOrg.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesRegion && matchesSearch;
    });
  }, [initiatives, activeRegion, searchQuery]);

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
      {/* NO NAVBAR HERE - Relies exclusively on app/layout.tsx to avoid duplicate headers */}

      <main className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        {/* Header Action Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Climate Initiatives Directory</h1>
            <p className="text-xs font-mono text-gray-500 mt-1">Verified regional programs, campus frameworks, and active climate projects.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-[#0F2C23] hover:bg-black text-white font-mono text-xs font-bold tracking-wider uppercase transition self-start md:self-auto"
          >
            + Propose New Initiative
          </button>
        </div>

        {/* Region Filters + Search Bar Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 font-mono text-[11px] tracking-wider">
            {["ALL REGIONS", "VANCOUVER / UBC", "TORONTO / GTA", "GLOBAL / REMOTE"].map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`px-3.5 py-1.5 uppercase transition-all whitespace-nowrap ${
                  activeRegion === region
                    ? "bg-[#0F2C23] text-white font-bold"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="w-full lg:w-80">
            <input
              type="text"
              placeholder="Search initiatives, lead orgs, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-1.5 bg-white border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black font-mono"
            />
          </div>
        </div>

        {/* Initiatives List */}
        <div className="space-y-4">
          {filteredInitiatives.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center text-xs font-mono text-gray-500">
              NO INITIATIVES FOUND MATCHING YOUR FILTER CRITERIA.
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

      {/* MODAL: START / PROPOSE AN INITIATIVE */}
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
                  placeholder="e.g., Point Grey Micro-Composting Cooperative"
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
                  placeholder="Outline the core objective, community goals, and sustainability targets..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 uppercase mb-1">Impact Scope</label>
                <input
                  type="text"
                  placeholder="e.g., 50 households participating · 2 Tons Waste Diverted"
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
