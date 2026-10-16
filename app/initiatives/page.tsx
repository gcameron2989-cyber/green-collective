'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface InitiativeItem {
  id: string;
  title: string;
  category: string;
  description: string;
  linkText: string;
  url: string;
  status: 'Active' | 'Updated' | 'Archived';
}

const initiativesData: InitiativeItem[] = [
  // UBC Faculty Expansion Section
  {
    id: 'ubc-forestry',
    title: 'UBC Faculty of Forestry Activism',
    category: 'UBC Initiatives',
    description: 'Student and faculty-led initiatives focusing on forest bioeconomy, conservation science, Indigenous community partnerships, and climate action news.',
    linkText: 'Explore Forestry News →',
    url: 'https://forestry.ubc.ca/news/',
    status: 'Updated',
  },
  {
    id: 'ubc-lfs',
    title: 'Faculty of Land and Food Systems (LFS)',
    category: 'UBC Initiatives',
    description: 'Research and community programs advancing sustainable agriculture, resilient food systems, food security, and ecological stewardship.',
    linkText: 'Visit LFS & Food Systems →',
    url: 'https://www.landfood.ubc.ca/',
    status: 'Active',
  },
  {
    id: 'ubc-science',
    title: 'UBC Faculty of Science: Climate & Environment',
    category: 'UBC Initiatives',
    description: 'Cutting-edge environmental research, biodiversity tracking, glacial ecosystem monitoring, and sustainable technology innovations.',
    linkText: 'Read Climate & Science News →',
    url: 'https://news.ubc.ca/category/climate-environment/',
    status: 'Active',
  },
  {
    id: 'ubc-apsc',
    title: 'Faculty of Applied Science (Engineering)',
    category: 'UBC Initiatives',
    description: 'Pioneering green infrastructure, clean energy systems, sustainable mining technologies, and Arctic resource management.',
    linkText: 'View Applied Science Updates →',
    url: 'https://apsc.ubc.ca/news-archive',
    status: 'Active',
  },
  {
    id: 'ubc-arts',
    title: 'UBC Faculty of Arts: Environmental Humanities',
    category: 'UBC Initiatives',
    description: 'Interdisciplinary research bridging environmental ethics, climate policy, Indigenous governance, and community sustainability.',
    linkText: 'Explore Arts & Sustainability →',
    url: 'https://arts.ubc.ca/',
    status: 'Active',
  },
  
  // Broader Regional / Cleaned Up Links
  {
    id: 'ubc-sustainability-hub',
    title: 'UBC Sustainability Hub',
    category: 'Campus Wide',
    description: 'The central umbrella connecting campus-as-a-living-lab initiatives, SDG alignment, and student sustainability grants at UBC.',
    linkText: 'Visit Sustainability Hub →',
    url: 'https://sustain.ubc.ca/',
    status: 'Active',
  },
  {
    id: 'regional-transit',
    title: 'Metro Vancouver Sustainable Mobility',
    category: 'Urban Transit',
    description: 'Regional public transit frameworks, active transportation planning, and low-carbon commute alternatives across Metro Vancouver.',
    linkText: 'Learn More →',
    url: 'https://www.translink.ca/', // Fixed broken/unoptimized routing link
    status: 'Updated',
  }
];

export default function InitiativesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'UBC Initiatives', 'Campus Wide', 'Urban Transit'];

  const filteredInitiatives = selectedCategory === 'All'
    ? initiativesData
    : initiativesData.filter(item => item.category === selectedCategory);

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24 font-sans">
      {/* Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2] px-6 py-12 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d] font-semibold">
          Green Collective Directory
        </span>
        <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl text-[#102f26]">
          Community & Academic Initiatives
        </h1>
        <p className="mt-3 text-sm text-[#526760] max-w-lg mx-auto">
          Explore vetted academic faculties, institutional sustainability hubs, and regional action networks driving measurable change.
        </p>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-10 space-y-8">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-[#102f26]/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 font-mono text-[11px] border transition-all ${
                selectedCategory === cat
                  ? 'bg-[#102f26] text-white border-[#102f26]'
                  : 'bg-white text-[#526760] border-[#102f26]/20 hover:border-[#102f26]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Initiatives Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredInitiatives.map((item) => (
            <div
              key={item.id}
              className="border border-[#102f26]/15 bg-[#f9f8f6] p-6 flex flex-col justify-between hover:border-[#102f26] transition-all shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#39705d] font-semibold bg-[#e2ede5] px-2 py-0.5">
                    {item.category}
                  </span>
                  <span className="font-mono text-[10px] text-[#526760]">
                    {item.status}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-[#102f26]">
                  {item.title}
                </h2>
                <p className="text-xs text-[#526760] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-[#102f26]/10">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-mono text-xs font-bold text-[#102f26] hover:text-[#39705d] transition-colors"
                >
                  {item.linkText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}