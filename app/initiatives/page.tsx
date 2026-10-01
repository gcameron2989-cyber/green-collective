"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export interface InitiativeItem {
  id: string;
  title: string;
  tagline: string;
  category: "Public Community" | "Campus & Student";
  location: string;
  currentPoints: number;
  targetPoints: number;
  co2SavedKg: number;
  participantsCount: number;
  status: "Active" | "Milestone Reached" | "Planning";
  description: string;
}

export const DEFAULT_INITIATIVES: InitiativeItem[] = [
  {
    id: "kitsilano-zero-waste-canopy",
    title: "Kitsilano Zero Waste & Tree Canopy Expansion",
    tagline: "Boosting local urban canopy coverage and scaling reusable container adoption across Kitsilano.",
    category: "Public Community",
    location: "Kitsilano, Vancouver",
    currentPoints: 14200,
    targetPoints: 20000,
    co2SavedKg: 1840,
    participantsCount: 312,
    status: "Active",
    description: "A community-led project uniting local businesses and residents to plant native shade trees along 4th Avenue and Broadway while establishing reusable cup sharing networks.",
  },
  {
    id: "ubc-forestry-climate-hub",
    title: "UBC Forestry Campus Climate Hub",
    tagline: "Student-driven fuel reduction, research plot monitoring, and organic waste diversion at Point Grey.",
    category: "Campus & Student",
    location: "Faculty of Forestry, UBC",
    currentPoints: 18900,
    targetPoints: 25000,
    co2SavedKg: 2450,
    participantsCount: 480,
    status: "Active",
    description: "Integrating forestry research with campus action: monitoring experimental forest plots, scaling composting in student housing, and running mid-week active transportation challenges.",
  },
  {
    id: "mount-pleasant-active-mobility",
    title: "Mount Pleasant Active Mobility Corridor",
    tagline: "Safer bike infrastructure and micro-mobility incentives along Main Street.",
    category: "Public Community",
    location: "Mount Pleasant, Vancouver",
    currentPoints: 9400,
    targetPoints: 15000,
    co2SavedKg: 1120,
    participantsCount: 195,
    status: "Active",
    description: "Working with local housing associations and commuters to replace vehicle trips with e-bikes and transit journeys across the Mount Pleasant neighborhood.",
  },
  {
    id: "point-grey-shoreline-restoration",
    title: "Point Grey & Jericho Shoreline Restoration",
    tagline: "Protecting coastal biodiversity and removing marine plastics along Jericho and Spanish Banks.",
    category: "Public Community",
    location: "Point Grey, Vancouver",
    currentPoints: 12100,
    targetPoints: 12000,
    co2SavedKg: 1680,
    participantsCount: 260,
    status: "Milestone Reached",
    description: "Community shoreline cleanups, dune vegetation restoration, and invasive species removal protecting coastal habitats.",
  },
  {
    id: "false-creek-circular-dining",
    title: "False Creek Circular Food & Dining Network",
    tagline: "Eliminating single-use takeaway packaging across local waterfront restaurants.",
    category: "Public Community",
    location: "Fairview / South Granville",
    currentPoints: 6200,
    targetPoints: 10000,
    co2SavedKg: 790,
    participantsCount: 140,
    status: "Active",
    description: "Partnering with food vendors to establish standardized returnable container deposits and organic scrap collection.",
  },
  {
    id: "ubc-renewable-energy-challenge",
    title: "UBC Student Dorm Energy Conservation Challenge",
    tagline: "Peer-to-peer residence energy monitoring and heat-loss reduction competition.",
    category: "Campus & Student",
    location: "UBC Campus Housing",
    currentPoints: 3400,
    targetPoints: 8000,
    co2SavedKg: 430,
    participantsCount: 115,
    status: "Planning",
    description: "Empowering students across residence halls to optimize heating, eliminate phantom power draw, and adopt cold-water laundry routines.",
  },
];

export default function InitiativesPage() {
  const supabase = createClient();
  const [initiatives, setInitiatives] = useState<InitiativeItem[]>(DEFAULT_INITIATIVES);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  useEffect(() => {
    async function loadInitiatives() {
      const { data, error } = await supabase.from("initiatives").select("*");
      if (!error && data && data.length > 0) {
        const mapped: InitiativeItem[] = data.map((item: any) => ({
          id: item.id || item.slug,
          title: item.title,
          tagline: item.tagline || item.description?.slice(0, 100) || "",
          category: item.category || "Public Community",
          location: item.location || "Vancouver, BC",
          currentPoints: item.current_points || item.currentPoints || 0,
          targetPoints: item.target_points || item.targetPoints || 10000,
          co2SavedKg: item.co2_saved_kg || item.co2SavedKg || 0,
          participantsCount: item.participants_count || item.participantsCount || 0,
          status: item.status || "Active",
          description: item.description || "",
        }));
        setInitiatives(mapped);
      }
    }
    loadInitiatives();
  }, []);

  const filtered = filterCategory === "All"
    ? initiatives
    : initiatives.filter((item) => item.category === filterCategory);

  return (
    <div className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-24 font-sans">
      {/* Consolidated Header Navigation */}
      <nav className="border-b border-[#102f26]/10 bg-white/90 backdrop-blur sticky top-0 z-30 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-black text-lg tracking-tight text-[#102f26]">
            Green Collective
          </Link>
          <div className="flex items-center gap-6 text-xs font-semibold">
            <Link href="/actions" className="hover:text-[#39705d] transition">Actions</Link>
            <Link href="/initiatives" className="text-[#39705d] underline underline-offset-4 font-bold">Initiatives</Link>
            <Link href="/dashboard" className="hover:text-[#39705d] transition">Dashboard</Link>
            <Link href="/profile" className="hover:text-[#39705d] transition">Profile</Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="bg-[#f1f6f2] border-b border-[#102f26]/10 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#39705d] block mb-1">
            Impact Directives
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Community & Campus Initiatives</h1>
          <p className="text-xs text-[#526760] max-w-2xl mt-1">
            Explore active environmental campaigns in your area. Every logged action direct-credits points and carbon savings toward these collective goals.
          </p>

          <div className="flex gap-2 mt-6">
            {["All", "Public Community", "Campus & Student"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  filterCategory === cat
                    ? "bg-[#102f26] text-white"
                    : "bg-white text-[#526760] border border-[#102f26]/10 hover:border-[#102f26]/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives Directory Grid */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const progressPct = Math.min(100, Math.round((item.currentPoints / item.targetPoints) * 100));

            return (
              <Link
                key={item.id}
                href={`/initiatives/${item.id}`}
                className="bg-white border border-[#102f26]/10 rounded-2xl p-6 shadow-sm hover:border-[#39705d] hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono uppercase bg-[#f1f6f2] text-[#39705d] px-2.5 py-0.5 rounded-md font-semibold">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.status === "Milestone Reached"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "Active"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-[#102f26] group-hover:text-[#39705d] transition mb-1">
                    {item.title}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-medium mb-3">📍 {item.location}</p>
                  <p className="text-xs text-[#526760] leading-relaxed mb-6">{item.tagline}</p>
                </div>

                <div>
                  {/* Progress Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#102f26]">{item.currentPoints.toLocaleString()} / {item.targetPoints.toLocaleString()} pts</span>
                      <span className="text-[#39705d]">{progressPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#102f26] transition-all duration-500 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#102f26]">
                    <span>👥 {item.participantsCount} Contributors</span>
                    <span className="text-[#39705d] group-hover:translate-x-1 transition-transform">
                      View Hub →
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
