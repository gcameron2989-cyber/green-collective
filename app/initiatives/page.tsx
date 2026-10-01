"use client";

import { useState } from 'react';

interface Initiative {
  id: string;
  title: string;
  leadOrganization: string;
  region: 'vancouver' | 'toronto' | 'global';
  category: string;
  status: 'Active Campaign' | 'Research & Policy' | 'Community Program';
  targetMetrics: string;
  description: string;
  websiteUrl: string;
}

const INITIATIVES_REGISTRY: Initiative[] = [
  // --- Vancouver / UBC Initiatives ---
  {
    id: 'ubc-canopy-restoration',
    title: 'UBC Campus Canopy & Forest Stewardship Program',
    leadOrganization: 'UBC Faculty of Forestry & Campus Stewardship',
    region: 'vancouver',
    category: 'Ecosystem Stewardship',
    status: 'Active Campaign',
    targetMetrics: '100+ Regional Plots Audited · Carbon Sink Management',
    description: 'A university initiative monitoring urban canopy health, fuel load metrics, and carbon sequestration across Point Grey grounds and Okanagan research plots.',
    websiteUrl: 'https://forestry.ubc.ca',
  },
  {
    id: 'kits-zero-waste-coalition',
    title: 'Kitsilano & Point Grey Zero-Waste Merchant Network',
    leadOrganization: 'Vancouver West Commerce Collective & City of Vancouver',
    region: 'vancouver',
    category: 'Circular Economy',
    status: 'Community Program',
    targetMetrics: '45 Partner Merchants · Circular Packaging Adoption',
    description: 'Uniting local food and retail vendors across Kitsilano and Point Grey to eliminate single-use packaging and establish reusable container networks.',
    websiteUrl: 'https://vancouver.ca/green-vancouver/zero-waste.aspx',
  },
  {
    id: 'van-commuter-decarb',
    title: 'Vancouver Regional Active Commuter Corridor',
    leadOrganization: 'TransLink & Municipal Cycling Alliances',
    region: 'vancouver',
    category: 'Sustainable Mobility',
    status: 'Active Campaign',
    targetMetrics: 'Expanded 99 B-Line & Protected Bike Corridor Transit',
    description: 'Advocating for integrated transit infrastructure, rapid bus connectivity, and active bike commuting across Vancouver.',
    websiteUrl: 'https://www.translink.ca',
  },

  // --- Toronto / GTA Initiatives ---
  {
    id: 'gta-ravine-restoration',
    title: 'Greater Toronto Ravine System Conservation',
    leadOrganization: 'Toronto Region Conservation Network',
    region: 'toronto',
    category: 'Ecological Conservation',
    status: 'Community Program',
    targetMetrics: '12 Ravine Sites · Native Flora Restoration',
    description: 'Community-led invasive plant removal, native vegetation replanting, and watershed protection across Toronto ravine networks.',
    websiteUrl: 'https://www.trca.ca',
  },
  {
    id: 'gta-transit-decarb',
    title: 'GTA Public Transit Modal Shift Initiative',
    leadOrganization: 'Metrolinx & Regional Transit Alliances',
    region: 'toronto',
    category: 'Regional Mobility',
    status: 'Active Campaign',
    targetMetrics: 'GO Transit & TTC Regional Decarbonization',
    description: 'Promoting transit integration across TTC and suburban commuter lines to reduce single-occupancy automotive trips across the Greater Toronto Area.',
    websiteUrl: 'https://www.metrolinx.com',
  },

  // --- Global / Remote Initiatives ---
  {
    id: 'green-hydrogen-policy',
    title: 'Green Hydrogen Integration for Commercial Long-Haul Transport',
    leadOrganization: 'Clean Energy Policy Research Group',
    region: 'global',
    category: 'Policy & Energy Research',
    status: 'Research & Policy',
    targetMetrics: 'Policy Brief Published · Drivetrain Density Analysis',
    description: 'A comprehensive research brief analyzing drivetrain trade-offs, energy density requirements, and regulatory frameworks for hydrogen fuel deployment.',
    websiteUrl: 'https://cerc.ubc.ca',
  },
  {
    id: 'green-collective-platform',
    title: 'Green Collective Open-Source Action Platform',
    leadOrganization: 'Green Collective Engineering Team',
    region: 'global',
    category: 'Open-Source Tech',
    status: 'Active Campaign',
    targetMetrics: 'Next.js / Supabase Stack · Open Impact Engine',
    description: 'Building transparent, open-source software tools that empower educational institutions and municipal hubs to quantify grassroots carbon reduction.',
    websiteUrl: 'https://github.com',
  },
];

export default function InitiativesPage() {
  const [selectedRegion, setSelectedRegion] = useState<'vancouver' | 'toronto' | 'global'>('vancouver');

  const filteredInitiatives = INITIATIVES_REGISTRY.filter(
    (item) => item.region === selectedRegion
  );

  return (
    <main className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-24 font-sans">
      {/* Editorial Hero Banner */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20 lg:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d] mb-3">
            Green Collective · Verified Initiative Registry
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Verified Regional Initiatives
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Explore active institutional programs, campus forestry projects, municipal networks, and public policy research driving long-term sustainability.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
        {/* Regional Filter Bar */}
        <div className="mb-10 p-6 border border-[#102f26]/15 bg-[#f1f6f2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
              Filter by Regional Scope
            </span>
            <p className="text-xs text-[#526760]">
              Browse institutional programs, policy briefs, and local campaigns.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRegion('vancouver')}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                selectedRegion === 'vancouver'
                  ? 'bg-[#102f26] text-white shadow-sm'
                  : 'bg-white border border-[#102f26]/20 text-[#102f26] hover:bg-[#f9f8f6]'
              }`}
            >
              Vancouver / UBC
            </button>
            <button
              onClick={() => setSelectedRegion('toronto')}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                selectedRegion === 'toronto'
                  ? 'bg-[#102f26] text-white shadow-sm'
                  : 'bg-white border border-[#102f26]/20 text-[#102f26] hover:bg-[#f9f8f6]'
              }`}
            >
              Toronto / GTA
            </button>
            <button
              onClick={() => setSelectedRegion('global')}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                selectedRegion === 'global'
                  ? 'bg-[#102f26] text-white shadow-sm'
                  : 'bg-white border border-[#102f26]/20 text-[#102f26] hover:bg-[#f9f8f6]'
              }`}
            >
              Global / Remote
            </button>
          </div>
        </div>

        {/* Initiatives List Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredInitiatives.map((item) => (
            <div
              key={item.id}
              className="p-8 border border-[#102f26]/15 bg-white flex flex-col justify-between shadow-sm transition hover:border-[#102f26]/40"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#39705d] bg-[#f1f6f2] px-2.5 py-1">
                    {item.category}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#102f26] border border-[#102f26]/20 px-2 py-0.5">
                    {item.status}
                  </span>
                </div>

                <h2 className="text-xl font-medium tracking-tight text-[#102f26] mb-2">
                  {item.title}
                </h2>

                <p className="font-mono text-[11px] text-[#39705d] mb-4">
                  Lead: {item.leadOrganization}
                </p>

                <p className="text-xs text-[#526760] leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div>
                <div className="pt-4 border-t border-[#102f26]/10 mb-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#71847d] block mb-1">
                    Scope &amp; Impact
                  </span>
                  <span className="font-mono text-xs font-medium text-[#102f26]">
                    {item.targetMetrics}
                  </span>
                </div>

                <a
                  href={item.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-between px-4 py-3 bg-[#f1f6f2] border border-[#102f26]/20 text-[#102f26] font-mono text-[10px] uppercase tracking-[0.14em] hover:bg-[#102f26] hover:text-white transition"
                >
                  <span>Visit Initiative Portal</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
