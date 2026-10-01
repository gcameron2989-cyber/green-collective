"use client";

import { useState } from 'react';
import Link from 'next/link';

interface Initiative {
  id: string;
  title: string;
  category: string;
  region: 'vancouver' | 'toronto' | 'global';
  points: number;
  description: string;
  actionParam: string;
}

const REGIONAL_INITIATIVES: Initiative[] = [
  // --- Vancouver / UBC Initiatives ---
  {
    id: 'ubc-forestry-field',
    title: 'Campus Tree Care & Ecosystem Field Audit',
    category: 'UBC Stewardship',
    region: 'vancouver',
    points: 50,
    description: 'Participate in forestry audits and campus canopy maintenance across Point Grey grounds.',
    actionParam: 'ubc-forestry-field',
  },
  {
    id: 'sustainable-commute-ubc',
    title: 'Transit, Cycling, or Walking Commute (99 B-Line / SkyTrain)',
    category: 'Mobility & Energy',
    region: 'vancouver',
    points: 25,
    description: 'Skip single-occupancy vehicles; commute via regional Vancouver transit networks or active bike lanes.',
    actionParam: 'sustainable-commute-ubc',
  },
  {
    id: 'home-meal-van',
    title: 'Zero Single-Use Campus Meal Prep',
    category: 'Zero Waste & Dining',
    region: 'vancouver',
    points: 30,
    description: 'Bring lunch and snacks from home using reusable containers and zero single-use plastics.',
    actionParam: 'home-meal',
  },

  // --- Toronto / GTA Initiatives ---
  {
    id: 'transit-ttc-toronto',
    title: 'TTC Subway, Streetcar, or Active Transit Commute',
    category: 'Mobility & Energy',
    region: 'toronto',
    points: 25,
    description: 'Utilize public transit lines across the GTA instead of personal automotive transport.',
    actionParam: 'sustainable-commute-ubc',
  },
  {
    id: 'local-market-produce-to',
    title: 'Local Ontario Seasonal Produce Sourcing',
    category: 'Circular Economy',
    region: 'toronto',
    points: 30,
    description: 'Source zero-waste or local Ontario food boxes to minimize regional supply chain footprints.',
    actionParam: 'thrift-borrow-gear',
  },
  {
    id: 'gta-community-cleanup',
    title: 'GTA Ravine & Neighborhood Green Space Cleanup',
    category: 'Stewardship',
    region: 'toronto',
    points: 45,
    description: 'Join local community volunteer efforts to clear waste from Toronto ravines and parks.',
    actionParam: 'campus-cleanup',
  },

  // --- Global / Remote Initiatives ---
  {
    id: 'remote-energy-audit',
    title: 'Home Energy & Smart Lighting Reduction Audit',
    category: 'Energy Conservation',
    region: 'global',
    points: 35,
    description: 'Optimize home thermal settings, execute LED retrofits, and eliminate phantom load power drains.',
    actionParam: 'waste-sorting',
  },
  {
    id: 'digital-sustainability-brief',
    title: 'Author Policy Brief or Open-Source Climate Documentation',
    category: 'Advocacy & Research',
    region: 'global',
    points: 50,
    description: 'Contribute technical research, open-source code, or policy whitepapers toward global climate action platforms.',
    actionParam: 'ubc-forestry-field',
  },
  {
    id: 'zero-waste-digital-workspace',
    title: 'Digital Carbon Footprint & Cloud Storage Cleanse',
    category: 'Digital Efficiency',
    region: 'global',
    points: 20,
    description: 'Purge redundant cloud backups, optimize server queries, and minimize unnecessary data storage energy draw.',
    actionParam: 'home-beverage',
  },
];

export default function InitiativesPage() {
  const [selectedRegion, setSelectedRegion] = useState<'vancouver' | 'toronto' | 'global'>('vancouver');

  const filteredInitiatives = REGIONAL_INITIATIVES.filter(
    (item) => item.region === selectedRegion
  );

  return (
    <main className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-24 font-sans">
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
              Green Collective · Initiative Registry
            </p>
            <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.14em]">
              <Link href="/" className="text-[#526760] hover:text-[#102f26] transition">
                ← Home
              </Link>
              <Link href="/competition/submit" className="text-[#526760] hover:text-[#102f26] transition">
                Log Action →
              </Link>
            </div>
          </div>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Verified Regional Initiatives
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Explore region-specific actions designed for campus life, metropolitan transit networks, and remote contributors.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="mb-12 p-6 border border-[#102f26]/15 bg-[#f1f6f2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
              Filter by Operating Region
            </span>
            <p className="text-xs text-[#526760]">
              Select your active zone to view tailored action paths.
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

        {filteredInitiatives.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredInitiatives.map((item) => (
              <Link
                key={item.id}
                href={`/competition/submit?action=${item.actionParam}`}
                className="group p-8 border border-[#102f26]/15 bg-white hover:border-[#102f26] transition flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#39705d] bg-[#f1f6f2] px-2.5 py-1">
                      {item.category}
                    </span>
                    <span className="font-mono text-xs font-medium text-[#102f26]">
                      +{item.points} pts
                    </span>
                  </div>
                  <h3 className="text-xl font-medium tracking-tight text-[#102f26] group-hover:text-[#39705d] transition">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-xs text-[#526760] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#102f26]/10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-[#39705d]">
                  <span>Log action in ledger</span>
                  <span className="transform group-hover:translate-x-1 transition">→</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-16 border border-dashed border-[#102f26]/20 bg-white text-center font-mono text-xs text-[#526760] uppercase tracking-wider">
            No specific initiatives registered for this zone yet.
          </div>
        )}
      </section>
    </main>
  );
}
