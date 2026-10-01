"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export interface Initiative {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: "Public Community" | "Campus & Student";
  location: string;
  current_points: number;
  target_points: number;
  co2_saved_kg: number;
  participants_count: number;
  status: "Active" | "Milestone Reached" | "Planning";
}

// Structured default data matching actual database fields
const SEED_INITIATIVES: Initiative[] = [
  {
    id: "kitsilano-canopy",
    slug: "kitsilano-canopy",
    title: "Kitsilano Zero Waste & Tree Canopy",
    tagline: "Expanding neighborhood urban canopy and scaling reusable container adoption across Kitsilano.",
    description: "A community initiative partnering with West 4th businesses and Kitsilano residents to plant native shade trees, install organic scrap diversion hubs, and eliminate single-use takeaway containers.",
    category: "Public Community",
    location: "Kitsilano, Vancouver",
    current_points: 14200,
    target_points: 20000,
    co2_saved_kg: 1840,
    participants_count: 312,
    status: "Active",
  },
  {
    id: "ubc-forestry-hub",
    slug: "ubc-forestry-hub",
    title: "UBC Forestry Climate Action Hub",
    tagline: "Student-led fuel load management, research plot care, and campus waste reduction.",
    category: "Campus & Student",
    location: "Faculty of Forestry, UBC",
    description: "Bridging forestry field metrics with campus action. Students log active commutes, participate in canopy care on campus grounds, and divert organic waste across residence halls.",
    current_points: 18900,
    target_points: 25000,
    co2_saved_kg: 2450,
    participants_count: 480,
    status: "Active",
  },
  {
    id: "point-grey-shoreline",
    slug: "point-grey-shoreline",
    title: "Point Grey Coastal & Shoreline Care",
    tagline: "Restoring coastal dune ecosystems and removing microplastics along Jericho and Spanish Banks.",
    category: "Public Community",
    location: "Point Grey, Vancouver",
    description: "Regular cleanup drives, invasive plant management, and shoreline protection projects uniting local neighborhood volunteers and university student groups.",
    current_points: 12100,
    target_points: 12000,
    co2_saved_kg: 1680,
    participants_count: 260,
    status: "Milestone Reached",
  },
  {
    id: "mount-pleasant-mobility",
    slug: "mount-pleasant-mobility",
    title: "Mount Pleasant Active Transit Corridor",
    tagline: "Incentivizing zero-emission trips and active bike commutes along major commuter corridors.",
    category: "Public Community",
    location: "Mount Pleasant, Vancouver",
    description: "Community-driven active transportation push focused on shifting single-occupancy driving trips to transit, cycling, and micro-mobility options.",
    current_points: 9400,
    target_points: 15000,
    co2_saved_kg: 1120,
    participants_count: 195,
    status: "Active",
  },
];

export default function InitiativesPage() {
  const supabase = createClient();
  const [initiatives, setInitiatives] = useState<Initiative[]>(SEED_INITIATIVES);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    async function fetchInitiatives() {
      const { data, error } = await supabase.from("initiatives").select("*");
      if (!error && data && data.length > 0) {
        setInitiatives(data as Initiative[]);
      }
    }
    fetchInitiatives();
  }, []);

  const filtered = filter === "All" ? initiatives : initiatives.filter((i) => i.category === filter);

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#0F2C23] font-sans">
      {/* Header */}
      <header className="border-b border-[#0F2C23]/10 bg-white sticky top-0 z-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight text-[#0F2C23]">
            Green Collective
          </Link>
          <nav className="flex items-center gap-6 text-xs font-bold">
            <Link href="/actions" className="text-gray-500 hover:text-[#0F2C23] transition">Actions</Link>
            <Link href="/initiatives" className="text-[#0F2C23] border-b-2 border-[#0F2C23] pb-0.5">Initiatives</Link>
            <Link href="/dashboard" className="text-gray-500 hover:text-[#0F2C23] transition">Dashboard</Link>
            <Link href="/profile" className="text-gray-500 hover:text-[#0F2C23] transition">Profile</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#EAEFEA] border-b border-[#0F2C23]/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#2A5E4E] font-semibold block mb-2">
            Local Impact Directives
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Active Environmental Initiatives</h1>
          <p className="text-sm text-gray-600 max-w-2xl mt-2 leading-relaxed">
            Real-world campaigns organized across Vancouver neighborhoods and UBC campus units. Points logged from verified personal actions credit directly toward these targets.
          </p>

          {/* Filter Pills */}
          <div className="flex gap-2 mt-8">
            {["All", "Public Community", "Campus & Student"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  filter === cat
                    ? "bg-[#0F2C23] text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => {
            const pct = Math.min(100, Math.round((item.current_points / item.target_points) * 100));
            const targetRoute = `/initiatives/${item.slug || item.id}`;

            return (
              <Link
                key={item.id}
                href={targetRoute}
                className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-[#0F2C23] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase bg-[#EAEFEA] text-[#2A5E4E] px-2.5 py-1 rounded-md font-bold">
                      {item.category}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === "Milestone Reached"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-emerald-50 text-[#2A5E4E]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-[#0F2C23] group-hover:text-[#2A5E4E] transition-colors mb-1">
                    {item.title}
                  </h2>
                  <p className="text-xs text-gray-400 font-medium mb-3">📍 {item.location}</p>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">{item.tagline}</p>
                </div>

                <div>
                  {/* Progress Bar */}
                  <div className="space-y-2 mb-5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#0F2C23]">{item.current_points.toLocaleString()} / {item.target_points.toLocaleString()} pts</span>
                      <span className="text-[#2A5E4E]">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0F2C23] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0F2C23]">
                    <span>👥 {item.participants_count} Contributors</span>
                    <span className="text-[#2A5E4E] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      View Campaign →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
