"use client";

import { useState } from 'react';
import Link from 'next/link';

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
    title: 'UBC Campus Canopy & Forest Stewardship Program',
    leadOrganization: 'UBC Faculty of Forestry & Campus Stewardship',
    region: 'vancouver',
    category: 'Ecosystem Stewardship',
    status: 'Active Program',
    websiteUrl: 'https://forestry.ubc.ca',
    scopeMetrics: '100+ Regional Plots Audited · Carbon Sink Monitoring',
    description: 'A university-led forestry initiative monitoring urban canopy health, wildfire resilience, and carbon sequestration across Point Grey grounds.',
  },
  {
    id: 'van-zero-waste-network',
    title: 'City of Vancouver Reusable & Zero-Waste Merchant Network',
    leadOrganization: 'City of Vancouver & Local BIAs',
    region: 'vancouver',
    category: 'Circular Economy',
    status: 'Community Campaign',
    websiteUrl: 'https://vancouver.ca/green-vancouver/zero-waste.aspx',
    scopeMetrics: '45+ Participating Merchants · Reusable Container Adoption',
    description: 'A municipal framework partnering with local vendors across Kitsilano and Point Grey to eliminate single-use food packaging.',
  },
  {
    id: 'translink-active-commute',
    title: 'TransLink Regional Active & Public Transit Network',
    leadOrganization: 'TransLink BC',
    region: 'vancouver',
    category: 'Sustainable Mobility',
    status: 'Active Program',
    websiteUrl: 'https://www.translink.ca',
    scopeMetrics: '99 B-Line · RapidBus · Protected Bike Corridors',
    description: 'Regional transit expansion and active transportation infrastructure designed to reduce single-occupancy vehicle emissions across Metro Vancouver.',
  },

  // --- Toronto / GTA Initiatives ---
  {
    id: 'trca-ravine-strategy',
    title: 'Toronto & Region Ravine Conservation Strategy',
    leadOrganization: 'Toronto and Region Conservation Authority (TRCA)',
    region: 'toronto',
    category: 'Ecological Conservation',
    status: 'Active Program',
    websiteUrl: 'https://www.trca.ca',
    scopeMetrics: '12 Priority Ravine Corridors · Biodiversity Protection',
    description: 'Protecting and restoring Toronto’s vital urban ravine system through invasive species control and native flora reintroduction.',
  },
  {
    id: 'metrolinx-regional-transit',
    title: 'Metrolinx GTA Regional Commuter Decarbonization',
    leadOrganization: 'Metrolinx / GO Transit',
    region: 'toronto',
    category: 'Regional Mobility',
    status: 'Community Campaign',
    websiteUrl: 'https://www.metrolinx.com',
    scopeMetrics: 'Greater Toronto Area Rapid Transit Expansion',
    description: 'A regional initiative expanding electric train service and integrated bus networks to shift suburban commuters away from personal automotive travel.',
  },

  // --- Global / Remote Initiatives ---
  {
    id: 'green-hydrogen-policy',
    title: 'Commercial Long-Haul Green Hydrogen Integration Brief',
    leadOrganization: 'Clean Energy Policy Research Group',
    region: 'global',
    category: 'Policy & Energy Research',
    status: 'Research & Policy',
    websiteUrl: 'https://cerc.ubc.ca',
    scopeMetrics: 'Policy Analysis · Fleet Decarbonization Framework',
    description: 'An open research brief evaluating drivetrain energy density, regulatory standards, and infrastructure requirements for zero-emission commercial hydrogen fleets.',
  },
  {
    id: 'green-collective-github',
    title: 'Green Collective Open-Source Platform Repository',
    leadOrganization: 'Green Collective Engineering Team',
    region: 'global',
    category: 'Open-Source Tech',
    status: 'Active Program',
    websiteUrl: 'https://github.com',
    scopeMetrics: 'Next.js / TypeScript / Supabase Architecture',
    description: 'An open-source codebase allowing institutions, campus groups, and municipalities to deploy localized sustainability directories and tracking tools.',
  },
];

export default function InitiativesPage() {
  const [selectedRegion, setSelectedRegion] = useState<'vancouver' | 'toronto' | 'global'>('vancouver');

  const filteredInitiatives = INITIATIVES_REGISTRY.filter(
    (item) => item.region === selectedRegion
  );

  return (
    <main className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-24 font-sans">
      {/* Editorial Header Navigation */}
      <header className="border-b border-[#102f26]/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 lg:px-12">
          <Link href="/" className="font-mono text-sm font-bold uppercase tracking-wider text-[#102f26]">
            Green Collective
          </Link>
          <nav className="flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-[#526760]">
            <Link href="/actions" className="hover:text-[#102f26] transition">Actions</Link>
            <Link href="/initiatives" className="text-[#102f26] font-bold underline underline-offset-4">Initiatives</Link>
            <Link href="/about" className="hover:text-[#102f26] transition">About</Link>
            <Link href="/contact" className="hover:text-[#102f26] transition">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20 lg:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d] mb-3">
            Green Collective · Verified Initiative Registry
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Verified Regional Initiatives
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#526760] md:text-lg">
            Explore active institutional programs, campus forestry projects, municipal networks, and public policy research driving long-term sustainability.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
        {/* Region Filter Bar */}
        <div className="mb-10 p-6 border border-[#102f26]/15 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
              Filter by Operating Region
            </span>
            <p className="text-xs text-[#526760]">
              Select your zone to view verified regional programs and external portals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRegion('vancouver')}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                selectedRegion === 'vancouver'
                  ? 'bg-[#102f26] text-white shadow-sm'
                  : 'bg-[#f1f6f2] border border-[#102f26]/20 text-[#102f26] hover:bg-[#e4ede6]'
              }`}
            >
              Vancouver / UBC
            </button>
            <button
              onClick={() => setSelectedRegion('toronto')}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                selectedRegion === 'toronto'
                  ? 'bg-[#102f26] text-white shadow-sm'
                  : 'bg-[#f1f6f2] border border-[#102f26]/20 text-[#102f26] hover:bg-[#e4ede6]'
              }`}
            >
              Toronto / GTA
            </button>
            <button
              onClick={() => setSelectedRegion('global')}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                selectedRegion === 'global'
                  ? 'bg-[#102f26] text-white shadow-sm'
                  : 'bg-[#f1f6f2] border border-[#102f26]/20 text-[#102f26] hover:bg-[#e4ede6]'
              }`}
            >
              Global / Remote
            </button>
          </div>
        </div>

        {/* Initiatives Directory Grid */}
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
                    {item.scopeMetrics}
                  </span>
                </div>

                <a
                  href={item.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-between px-4 py-3 bg-[#f1f6f2] border border-[#102f26]/20 text-[#102f26] font-mono text-[10px] uppercase tracking-[0.14em] hover:bg-[#102f26] hover:text-white transition"
                >
                  <span>Visit Program Portal</span>
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
