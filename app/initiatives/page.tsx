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
}

export const VERIFIED_INITIATIVES: RealInitiative[] = [
  {
    id: "ubc-urban-forestry",
    title: "UBC Urban Forestry & Canopy Stewardship",
    leadOrg: "UBC Faculty of Forestry",
    category: "ECOSYSTEM STEWARDSHIP",
    status: "ACTIVE PROGRAM",
    region: "VANCOUVER / UBC",
    locationTag: "VANCOUVER",
    description: "Long-term monitoring of forest health, wildfire fuel loads, and carbon sequestration across research forests and campus canopy plots.",
    impactScope: "100+ Regional Plots Audited · Carbon Sink Monitoring",
    officialPortalUrl: "https://forestry.ubc.ca",
  },
  {
    id: "vancouver-zero-waste-2040",
    title: "City of Vancouver Zero Waste 2040 Framework",
    leadOrg: "City of Vancouver",
    category: "CIRCULAR ECONOMY",
    status: "ACTIVE PROGRAM",
    region: "VANCOUVER / UBC",
    locationTag: "VANCOUVER",
    description: "Comprehensive city policy and merchant network targeted at eliminating disposable packaging and expanding reusable food container systems.",
    impactScope: "Municipal Single-Use Reduction Strategy",
    officialPortalUrl: "https://vancouver.ca/green-vancouver/zero-waste-vancouver.aspx",
  },
  {
    id: "translink-climate-action-plan",
    title: "TransLink Climate Action Plan & Fleet Electrification",
    leadOrg: "TransLink BC",
    category: "SUSTAINABLE MOBILITY",
    status: "ACTIVE PROGRAM",
    region: "VANCOUVER / UBC",
    locationTag: "VANCOUVER",
    description: "Regional transit decarbonization roadmap prioritizing electric bus deployment and active transportation corridor integration.",
    impactScope: "Zero-Emission Bus Fleet · RapidBus Corridor Expansion",
    officialPortalUrl: "https://www.translink.ca/about-us/about-translink/sustainability",
  },
  {
    id: "ubc-cap-2030",
    title: "UBC Climate Action Plan 2030 (CAP 2030)",
    leadOrg: "UBC Sustainability Hub",
    category: "CAMPUS DECARBONIZATION",
    status: "ACTIVE PROGRAM",
    region: "VANCOUVER / UBC",
    locationTag: "UBC POINT GREY",
    description: "Institutional net-zero roadmap targeting an 85% reduction in operational emissions and zero-waste residence operations by 2030.",
    impactScope: "Campus District Energy Systems · Scope 3 Emission Scoping",
    officialPortalUrl: "https://sustain.ubc.ca/campus-initiatives/climate-action/climate-action-plan-2030",
  },
  {
    id: "toronto-ravine-strategy",
    title: "City of Toronto Ravine Strategy",
    leadOrg: "City of Toronto & TRCA",
    category: "ECOLOGICAL CONSERVATION",
    status: "ACTIVE PROGRAM",
    region: "TORONTO / GTA",
    locationTag: "TORONTO",
    description: "Protection, management, and ecological enhancement of Toronto's 11,000-hectare ravine system and urban forest canopy.",
    impactScope: "Ravine Ecosystem Protection · Invasive Species Abatement",
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
    description: "Restoring urban wetlands, improving stormwater quality, and maintaining green infrastructure across major Southern Ontario watersheds.",
    impactScope: "Regional Watershed Monitoring · Shoreline Protection",
    officialPortalUrl: "https://trca.ca",
  },
  {
    id: "c40-cities-climate-network",
    title: "C40 Cities Global Decarbonization Network",
    leadOrg: "C40 Climate Leadership Group",
    category: "GLOBAL POLICY",
    status: "ACTIVE PROGRAM",
    region: "GLOBAL / REMOTE",
    locationTag: "INTERNATIONAL",
    description: "Global coalition of mayors and municipal leaders taking urgent action to confront the climate crisis and drive urban sustainability.",
    impactScope: "Urban Climate Action Benchmarking · Global Municipal Standards",
    officialPortalUrl: "https://www.c40.org",
  },
];

export default function InitiativesPage() {
  const [activeRegion, setActiveRegion] = useState<string>("ALL REGIONS");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredInitiatives = useMemo(() => {
    return VERIFIED_INITIATIVES.filter((item) => {
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
  }, [activeRegion, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-sans antialiased pb-20">
      {/* NO NAVBAR HERE - Relying strictly on app/layout.tsx to prevent duplicate header */}

      <main className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        {/* Region Filters + Search Input Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          {/* Region Tabs */}
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

          {/* Search Box */}
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

        {/* Initiative Cards List */}
        <div className="space-y-4">
          {filteredInitiatives.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center text-xs font-mono text-gray-500">
              NO INITIATIVES FOUND MATCHING YOUR CRITERIA.
            </div>
          ) : (
            filteredInitiatives.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-300 transition"
              >
                {/* Content */}
                <div className="flex-1 max-w-4xl">
                  {/* Category Tags */}
                  <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-gray-400 uppercase mb-2">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span className="text-gray-500">{item.status}</span>
                    <span>•</span>
                    <span className="text-gray-500">{item.locationTag}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-gray-900 mb-0.5">
                    <Link href={`/initiatives/${item.id}`} className="hover:text-[#0F2C23] transition">
                      {item.title}
                    </Link>
                  </h2>

                  {/* Lead Organization */}
                  <p className="font-mono text-xs text-gray-500 mb-2">
                    Lead: <span className="text-gray-700 font-semibold">{item.leadOrg}</span>
                  </p>

                  {/* Summary */}
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Impact Scope */}
                  <p className="text-[11px] font-mono text-gray-500">
                    <strong className="text-gray-700 font-semibold">Impact Scope:</strong> {item.impactScope}
                  </p>
                </div>

                {/* Direct External Portal Button */}
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
    </div>
  );
}
