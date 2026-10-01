"use client";

import { useState } from 'react';

interface Initiative {
  id: string;
  title: string;
  leadOrganization: string;
  region: 'vancouver' | 'toronto' | 'global';
  category: string;
  status: 'Active Program' | 'Research & Policy' | 'Community Campaign';
  websiteUrl: string;
  description: string;
  scopeMetrics: string;
}

const INITIATIVES_REGISTRY: Initiative[] = [
  // --- Vancouver / UBC Initiatives ---
  {
    id: 'ubc-forestry-stewardship',
    title: 'UBC Urban Forestry & Canopy Stewardship',
    leadOrganization: 'UBC Faculty of Forestry',
    region: 'vancouver',
    category: 'Ecosystem Stewardship',
    status: 'Active Program',
    websiteUrl: 'https://forestry.ubc.ca/research/research-forests/',
    scopeMetrics: '100+ Regional Plots Audited · Carbon Sink Monitoring',
    description: 'Long-term monitoring of forest health, wildfire fuel loads, and carbon sequestration across research forests and campus canopy plots.',
  },
  {
    id: 'van-zero-waste-2040',
    title: 'City of Vancouver Zero Waste 2040 Framework',
    leadOrganization: 'City of Vancouver',
    region: 'vancouver',
    category: 'Circular Economy',
    status: 'Active Program',
    websiteUrl: 'https://vancouver.ca/green-vancouver/zero-waste-2040.aspx',
    scopeMetrics: 'Municipal Single-Use Reduction Strategy',
    description: 'Comprehensive city policy and merchant network targeted at eliminating disposable packaging and expanding reusable food container systems.',
  },
  {
    id: 'translink-climate-action',
    title: 'TransLink Climate Action Plan & Fleet Electrification',
    leadOrganization: 'TransLink BC',
    region: 'vancouver',
    category: 'Sustainable Mobility',
    status: 'Active Program',
    websiteUrl: 'https://www.translink.ca/plans-and-projects/strategies-plans-and-studies/climate-action-plan',
    scopeMetrics: 'Zero-Emission Bus Fleet · RapidBus Corridor Expansion',
    description: 'Regional transit decarbonization roadmap prioritizing electric bus deployment and active transportation corridor integration.',
  },

  // --- Toronto / GTA Initiatives ---
  {
    id: 'toronto-ravine-strategy',
    title: 'City of Toronto Ravine Strategy',
    leadOrganization: 'City of Toronto & TRCA',
    region: 'toronto',
    category: 'Ecological Conservation',
    status: 'Active Program',
    websiteUrl: 'https://www.toronto.ca/city-government/accountability-operations-customer-service/long-term-vision-plans-and-strategies/ravine-strategy/',
    scopeMetrics: '300+ km Ravine Network · Ecological Restoration',
    description: 'Inter-agency policy protecting ravine hydrology, native biodiversity, and erosion mitigation across the Greater Toronto ravine system.',
  },
  {
    id: 'metrolinx-go-expansion',
    title: 'Metrolinx GO Rail System Electrification',
    leadOrganization: 'Metrolinx',
    region: 'toronto',
    category: 'Regional Mobility',
    status: 'Active Program',
    websiteUrl: 'https://www.metrolinx.com/en/projects-and-programs/go-expansion',
    scopeMetrics: 'Regional Commuter Rail Electrification',
    description: 'Transitioning GTA commuter rail corridors to zero-emission electric rail service to replace single-occupancy vehicle travel.',
  },

  // --- Global / Remote Initiatives ---
  {
    id: 'nrcan-hydrogen-strategy',
    title: 'Canada Hydrogen Strategy & Fleet Transport Policy',
    leadOrganization: 'Natural Resources Canada & UBC CERC',
    region: 'global',
    category: 'Policy & Energy Research',
    status: 'Research & Policy',
    websiteUrl: 'https://www.nrcan.gc.ca/our-natural-resources/energy-sources-distribution/clean-fossil-fuels/hydrogen/23080',
    scopeMetrics: 'Commercial Drivetrain & Infrastructure Framework',
    description: 'National and institutional policy frameworks analyzing clean hydrogen deployment for long-haul commercial freight and heavy transport.',
  },
  {
    id: 'green-collective-github',
    title: 'Green Collective Open-Source Platform Repository',
    leadOrganization: 'Green Collective Engineering Team',
    region: 'global',
    category: 'Open-Source Tech',
    status: 'Community Campaign',
    websiteUrl: 'https://github.com',
    scopeMetrics: 'Next.js / TypeScript / Supabase Architecture',
    description: 'Open-source code ecosystem enabling community developers to deploy regional sustainability registries and impact trackers.',
  },
];

export default function InitiativesPage() {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'vancouver' | 'toronto' | 'global'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInitiatives = INITIATIVES_REGISTRY.filter((item) => {
    const matchesRegion = selectedRegion === 'all' || item.region === selectedRegion;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-24 font-sans">
      {/* Hero Section */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 lg:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d] mb-2">
            Directory · Institutional &amp; Regional Initiatives
          </p>
          <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-5xl text-[#102f26]">
            Verified Initiatives &amp; Resource Hubs
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#526760] md:text-base">
            Direct portal index for official campus projects, municipal environmental frameworks, transit electrification strategies, and energy policy research.
          </p>
        </div>
      </section>

      {/* Directory Section */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
        {/* Filter & Search Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#102f26]/10 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition ${
                selectedRegion === 'all'
                  ? 'bg-[#102f26] text-white'
                  : 'bg-white border border-[#102f26]/15 text-[#102f26] hover:bg-[#f1f6f2]'
              }`}
            >
              All Regions
            </button>
            <button
              onClick={() => setSelectedRegion('vancouver')}
              className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition ${
                selectedRegion === 'vancouver'
                  ? 'bg-[#102f26] text-white'
                  : 'bg-white border border-[#102f26]/15 text-[#102f26] hover:bg-[#f1f6f2]'
              }`}
            >
              Vancouver / UBC
            </button>
            <button
              onClick={() => setSelectedRegion('toronto')}
              className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition ${
                selectedRegion === 'toronto'
                  ? 'bg-[#102f26] text-white'
                  : 'bg-white border border-[#102f26]/15 text-[#102f26] hover:bg-[#f1f6f2]'
              }`}
            >
              Toronto / GTA
            </button>
            <button
              onClick={() => setSelectedRegion('global')}
              className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition ${
                selectedRegion === 'global'
                  ? 'bg-[#102f26] text-white'
                  : 'bg-white border border-[#102f26]/15 text-[#102f26] hover:bg-[#f1f6f2]'
              }`}
            >
              Global / Remote
            </button>
          </div>

          <input
            type="text"
            placeholder="Search initiatives, lead orgs, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 px-4 py-2 text-xs border border-[#102f26]/20 bg-white text-[#102f26] placeholder-[#526760]/60 focus:outline-none focus:border-[#102f26]"
          />
        </div>

        {/* Directory List / Detailed Row Layout */}
        <div className="space-y-4">
          {filteredInitiatives.length > 0 ? (
            filteredInitiatives.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-white border border-[#102f26]/15 shadow-sm hover:border-[#102f26]/40 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#39705d] bg-[#f1f6f2] px-2 py-0.5">
                      {item.category}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#102f26] border border-[#102f26]/20 px-2 py-0.5">
                      {item.status}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#71847d]">
                      • {item.region.toUpperCase()}
                    </span>
                  </div>

                  <h2 className="text-xl font-medium tracking-tight text-[#102f26]">
                    {item.title}
                  </h2>

                  <p className="font-mono text-[11px] text-[#39705d] mt-1 mb-2">
                    Lead: {item.leadOrganization}
                  </p>

                  <p className="text-xs text-[#526760] leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <p className="font-mono text-[11px] font-medium text-[#102f26]">
                    Impact Scope: <span className="font-normal text-[#526760]">{item.scopeMetrics}</span>
                  </p>
                </div>

                <div className="shrink-0">
                  <a
                    href={item.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-3 bg-[#102f26] text-white font-mono text-[10px] uppercase tracking-[0.14em] hover:bg-[#39705d] transition gap-2"
                  >
                    <span>Visit Official Portal</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-white border border-[#102f26]/10">
              <p className="font-mono text-xs text-[#526760]">
                No initiatives found matching your query.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
