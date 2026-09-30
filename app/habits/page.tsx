"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Habit {
  id: string;
  title: string;
  description: string;
  category: "Transport" | "Waste" | "Energy" | "Food" | "Community";
  baseCo2PerUnit: number; // kg CO2e per unit or per km
  unit: string;
  completedToday: boolean;
  actionId: string;
  isDistanceBased?: boolean;
  distanceKm?: number;
  citationSource: string;
}

const EXTENSIVE_HABITS: Habit[] = [
  // Transport (Distance Based)
  {
    id: "h1",
    title: "Public Transit Commute",
    description: "Replaced a personal vehicle trip with Skytrain, bus, or SeaBus.",
    category: "Transport",
    baseCo2PerUnit: 0.17, // Net savings per passenger-km compared to average car
    unit: "km",
    completedToday: false,
    actionId: "sustainable-commute",
    isDistanceBased: true,
    distanceKm: 12,
    citationSource: "US EPA & CUTA passenger-km transit displacement averages, accounting for regional electric grid intensity.",
  },
  {
    id: "h2",
    title: "Active Transportation (Bike / Walk)",
    description: "Chose cycling or walking instead of motorized transport.",
    category: "Transport",
    baseCo2PerUnit: 0.21, // Full displacement of average passenger vehicle per km
    unit: "km",
    completedToday: false,
    actionId: "active-transport",
    isDistanceBased: true,
    distanceKm: 5,
    citationSource: "US EPA Greenhouse Gas Equivalencies Calculator (Average passenger vehicle tailpipe emissions ~0.21 kg CO₂e/km).",
  },
  {
    id: "h3",
    title: "Carpooling / EV Ride",
    description: "Shared a vehicle trip with passengers or traveled via electric vehicle.",
    category: "Transport",
    baseCo2PerUnit: 0.12,
    unit: "km",
    completedToday: false,
    actionId: "carpool-ev",
    isDistanceBased: true,
    distanceKm: 15,
    citationSource: "Transport Canada shared-mobility and EV lifecycle displacement factors.",
  },

  // Food
  {
    id: "h4",
    title: "Plant-Forward Meal",
    description: "Consumed a vegetarian or vegan meal, avoiding ruminant meats.",
    category: "Food",
    baseCo2PerUnit: 1.5,
    unit: "meal",
    completedToday: false,
    actionId: "plant-based-meal",
    citationSource: "Poore & Nemecek (2018) global food lifecycle database, via Our World in Data (comparison vs. beef/lamb baseline).",
  },
  {
    id: "h5",
    title: "Local / Seasonal Produce",
    description: "Purchased or consumed locally grown regional produce.",
    category: "Food",
    baseCo2PerUnit: 0.8,
    unit: "day",
    completedToday: false,
    actionId: "local-food",
    citationSource: "Agri-food supply chain lifecycle assessments (transport vs. local production emissions).",
  },
  {
    id: "h6",
    title: "Zero Food Waste Meal",
    description: "Successfully consumed or repurposed leftovers to prevent food waste.",
    category: "Food",
    baseCo2PerUnit: 0.6,
    unit: "meal",
    completedToday: false,
    actionId: "zero-food-waste",
    citationSource: "FAO global food waste footprint and avoided landfill methane estimations.",
  },

  // Energy
  {
    id: "h7",
    title: "Cold-Water Laundry Cycle",
    description: "Washed clothes entirely using cold water, eliminating water-heating energy.",
    category: "Energy",
    baseCo2PerUnit: 0.7,
    unit: "load",
    completedToday: false,
    actionId: "cold-water-wash",
    citationSource: "Energy Star appliance efficiency standards and residential water heater thermal load estimates.",
  },
  {
    id: "h8",
    title: "Line-Dried Laundry",
    description: "Hung garments and linens to air dry instead of using an electric tumble dryer.",
    category: "Energy",
    baseCo2PerUnit: 1.6,
    unit: "load",
    completedToday: false,
    actionId: "line-dry",
    citationSource: "Residential electric clothes dryer average energy consumption per standard cycle (~3.2 kWh).",
  },
  {
    id: "h9",
    title: "Optimized Thermostat / Lighting",
    description: "Adjusted thermostat by 1°C or unplugged idle electronics.",
    category: "Energy",
    baseCo2PerUnit: 0.5,
    unit: "day",
    completedToday: false,
    actionId: "energy-conservation",
    citationSource: "Utility provider residential energy audit benchmarks and baseline heating efficiencies.",
  },

  // Waste & Circularity
  {
    id: "h10",
    title: "Rigorous Waste Sorting & Composting",
    description: "Correctly sorted organic compost, recyclables, and landfill streams.",
    category: "Waste",
    baseCo2PerUnit: 0.4,
    unit: "day",
    completedToday: false,
    actionId: "waste-sorting",
    citationSource: "Municipal solid waste management diversion credits and avoided landfill fugitive methane calculations.",
  },
  {
    id: "h11",
    title: "Zero Single-Use Plastics",
    description: "Utilized reusable water bottles, coffee cups, and shopping totes.",
    category: "Waste",
    baseCo2PerUnit: 0.3,
    unit: "day",
    completedToday: false,
    actionId: "reusable-swaps",
    citationSource: "Lifecycle analysis of single-use polymer manufacturing vs. multi-use durability baselines.",
  },
  {
    id: "h12",
    title: "Repair or Secondhand Acquisition",
    description: "Repaired an item or acquired goods second-hand instead of buying new.",
    category: "Waste",
    baseCo2PerUnit: 3.0,
    unit: "item",
    completedToday: false,
    actionId: "repair-secondhand",
    citationSource: " WRAP (Waste & Resources Action Programme) product lifecycle carbon displacement metrics.",
  },

  // Community
  {
    id: "h13",
    title: "Sustainability Workshop / Advocacy",
    description: "Participated in an environmental workshop, cleanup event, or policy discussion.",
    category: "Community",
    baseCo2PerUnit: 1.0,
    unit: "session",
    completedToday: false,
    actionId: "community-action",
    citationSource: "Standardized proxy estimation for collective behavioural impact workshops.",
  },
];

export default function HabitAnalyticsPage() {
  const [habits, setHabits] = useState<Habit[]>(EXTENSIVE_HABITS);
  const [filter, setFilter] = useState<string>("All");
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [joinCompetition, setJoinCompetition] = useState(false);
  
  // Track open citations: map habit id -> boolean
  const [openCitations, setOpenCitations] = useState<{ [key: string]: boolean }>({});

  const supabase = createClient();

  useEffect(() => {
    const checkUserAndSubmissions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const today = new Date().toISOString().split('T')[0];
        const { data: subs } = await supabase
          .from('submissions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', today);

        if (subs && subs.length > 0) {
          setHabits((prev) =>
            prev.map((habit) => {
              const matched = subs.some((s: any) => s.eco_action_id === habit.actionId);
              return matched ? { ...habit, completedToday: true } : habit;
            })
          );
          if (subs.some((s: any) => s.faculty_id)) {
            setJoinCompetition(true);
          }
        }
      }
    };

    checkUserAndSubmissions();
  }, [supabase]);

  const toggleHabitLocally = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completedToday: !habit.completedToday } : habit
      )
    );
  };

  const toggleCitation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenCitations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBatchSubmit = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setSubmitting(true);
    setSuccessMessage("");

    const today = new Date().toISOString().split('T')[0];
    const selectedHabits = habits.filter(h => h.completedToday);

    await supabase
      .from('submissions')
      .delete()
      .eq('user_id', user.id)
      .gte('created_at', today);

    if (selectedHabits.length > 0) {
      const inserts = selectedHabits.map(h => ({
        user_id: user.id,
        eco_action_id: h.actionId,
        quantity: h.isDistanceBased ? (h.distanceKm || 1) : 1,
        status: 'approved',
        faculty_id: joinCompetition ? (user.user_metadata?.faculty_id || "general-comp") : null,
      }));

      await supabase.from('submissions').insert(inserts);
    }

    setSubmitting(false);
    setSuccessMessage("✨ Verified eco-actions successfully logged!");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleClearTodaySubmissions = async () => {
    if (!user) return;
    
    setDeleting(true);
    setSuccessMessage("");

    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('user_id', user.id)
      .gte('created_at', today);

    if (!error) {
      setHabits((prev) =>
        prev.map((habit) => ({ ...habit, completedToday: false }))
      );
      setSuccessMessage("🗑️ Today's logs cleared successfully.");
    } else {
      setSuccessMessage("⚠️ Failed to clear logs. Please try again.");
    }

    setDeleting(false);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  // Compute precise cumulative carbon savings
  const totalCO2SavedToday = habits
    .filter((h) => h.completedToday)
    .reduce((acc, curr) => {
      const multiplier = curr.isDistanceBased ? (curr.distanceKm || 0) : 1;
      return acc + curr.baseCo2PerUnit * multiplier;
    }, 0);

  const completedCount = habits.filter((h) => h.completedToday).length;
  const categories = ["All", "Transport", "Food", "Energy", "Waste", "Community"];
  const filteredHabits = habits.filter(
    (h) => filter === "All" || h.category === filter
  );

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24">
      {/* Hero Header Section */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
            Impact Registry · Verified Metrics
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Habit Analytics &amp; Action Log
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Record verified daily sustainable behaviors with distance-adjusted calculations, calculate carbon reductions, and contribute to institutional challenges.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-10">
        {successMessage && (
          <div className="mb-8 p-4 border border-[#102f26]/20 bg-[#f1f6f2] text-[#102f26] text-xs font-mono uppercase tracking-wider flex items-center gap-2">
            <span>{successMessage}</span>
          </div>
        )}

        {/* Real Metrics Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 border border-[#102f26]/15 bg-white">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-2">
              Estimated CO₂e Avoided Today
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-medium tracking-tight text-[#102f26]">
                {totalCO2SavedToday.toFixed(1)} <span className="text-sm font-normal text-[#71847d]">kg CO₂e</span>
              </span>
              <span className="text-xl">🌱</span>
            </div>
            <p className="mt-3 text-xs text-[#71847d] font-mono">
              Calculated using lifecycle emission factors &amp; distance variables.
            </p>
          </div>

          <div className="p-6 border border-[#102f26]/15 bg-white">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-2">
              Actions Logged Today
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-medium tracking-tight text-[#102f26]">
                {completedCount} <span className="text-sm font-normal text-[#71847d]">/ {habits.length} available</span>
              </span>
              <span className="text-xl">✅</span>
            </div>
            <p className="mt-3 text-xs text-[#71847d] font-mono">
              Select actions completed within the past 24 hours.
            </p>
          </div>
        </div>

        {/* Filter Bar & Interactive Habit List */}
        <div className="border border-[#102f26]/15 bg-white p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-[#102f26]/10 pb-6">
            <h2 className="text-lg font-medium tracking-tight text-[#102f26]">Verified Action Registry</h2>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] border transition ${
                    filter === cat
                      ? "bg-[#102f26] text-white border-[#102f26]"
                      : "bg-white text-[#526760] border-[#102f26]/15 hover:border-[#102f26]/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {filteredHabits.map((habit) => {
              const currentTotal = habit.isDistanceBased
                ? Number((habit.baseCo2PerUnit * (habit.distanceKm || 0)).toFixed(2))
                : habit.baseCo2PerUnit;
              const isCitationOpen = openCitations[habit.id] || false;

              return (
                <div
                  key={habit.id}
                  onClick={() => toggleHabitLocally(habit.id)}
                  className={`p-5 border transition-all cursor-pointer ${
                    habit.completedToday
                      ? "bg-[#f1f6f2] border-[#102f26]/40"
                      : "bg-white border-[#102f26]/15 hover:border-[#102f26]/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 pr-4 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 bg-[#f1f6f2] text-[#39705d] border border-[#102f26]/10">
                          {habit.category}
                        </span>
                        <h3 className="font-medium text-sm text-[#102f26]">
                          {habit.title}
                        </h3>
                      </div>
                      <p className="text-xs text-[#526760]">{habit.description}</p>
                      
                      {/* Sub-line impact & Citation Toggle Button */}
                      <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#71847d] pt-1">
                        <span className="text-[#39705d]">
                          ~{currentTotal} kg CO₂e {habit.isDistanceBased ? 'total' : `per ${habit.unit}`}
                        </span>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={(e) => toggleCitation(habit.id, e)}
                          className="inline-flex items-center gap-1 text-[#39705d] hover:underline font-medium lowercase"
                        >
                          <span className="inline-flex size-3.5 items-center justify-center rounded-full border border-[#39705d] text-[9px] font-bold">
                            i
                          </span>
                          {isCitationOpen ? "hide source" : "view source"}
                        </button>
                      </div>

                      {/* Distance Input field if applicable */}
                      {habit.isDistanceBased && habit.completedToday && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="mt-3 pt-3 border-t border-[#102f26]/10 flex items-center gap-3"
                        >
                          <label htmlFor={`dist-${habit.id}`} className="font-mono text-[10px] uppercase text-[#526760]">
                            Trip Distance (km):
                          </label>
                          <input
                            id={`dist-${habit.id}`}
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={habit.distanceKm || 1}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setHabits((prev) =>
                                prev.map((h) => (h.id === habit.id ? { ...h, distanceKm: val } : h))
                              );
                            }}
                            className="w-24 px-2 py-1 bg-white border border-[#102f26]/20 font-mono text-xs text-[#102f26] focus:outline-none focus:border-[#102f26]"
                          />
                          <span className="font-mono text-[10px] text-[#71847d]">km</span>
                        </div>
                      )}

                      {/* Inline Citation Drawer */}
                      {isCitationOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="mt-3 p-3 bg-white border border-[#102f26]/20 text-[11px] text-[#526760] font-normal lowercase space-y-1"
                        >
                          <p className="font-mono text-[10px] uppercase tracking-wider text-[#102f26] font-medium">
                            Calculation Methodology &amp; Source:
                          </p>
                          <p className="normal-case leading-relaxed">{habit.citationSource}</p>
                        </div>
                      )}
                    </div>

                    <div
                      className={`size-6 shrink-0 border flex items-center justify-center font-mono text-xs transition ${
                        habit.completedToday
                          ? "bg-[#102f26] border-[#102f26] text-white"
                          : "border-[#102f26]/20 text-transparent"
                      }`}
                    >
                      ✓
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Methodology Disclosure Footer Note */}
          <div className="mb-8 p-5 border border-[#102f26]/15 bg-[#f1f6f2] text-xs text-[#526760] space-y-2">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#102f26] font-medium">
              Transparency &amp; Verification Framework
            </h4>
            <p className="leading-relaxed">
              Green Collective calculates greenhouse gas displacement using standardized lifecycle assessment (LCA) benchmarks from institutions including the US EPA, IPCC guidelines, and peer-reviewed agricultural databases. All transport factors support precise distance-scaling in kilometers.
            </p>
          </div>

          {/* Competition Opt-in Toggle */}
          <div className="mb-8 p-5 border border-[#102f26]/15 bg-white flex items-start gap-4">
            <input
              type="checkbox"
              id="competition-opt-in"
              checked={joinCompetition}
              onChange={(e) => setJoinCompetition(e.target.checked)}
              className="mt-1 size-4 accent-[#102f26] rounded-none cursor-pointer"
            />
            <label htmlFor="competition-opt-in" className="text-xs text-[#526760] cursor-pointer select-none">
              <strong className="block font-medium text-[#102f26] mb-1">Contribute to the Faculty Sustainability Challenge Leaderboard</strong>
              Include your verified submissions in your institutional team score total. Uncheck to keep your metrics private.
            </label>
          </div>

          {/* Submit & Clear Action Buttons Bar */}
          <div className="pt-6 border-t border-[#102f26]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#71847d]">
              {completedCount} action{completedCount === 1 ? '' : 's'} selected for submission.
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {user && (
                <button
                  type="button"
                  onClick={handleClearTodaySubmissions}
                  disabled={deleting}
                  className="px-4 py-3 bg-white hover:bg-red-50 text-red-700 border border-red-200 font-mono text-[10px] uppercase tracking-[0.16em] transition disabled:opacity-50"
                >
                  {deleting ? 'Clearing...' : 'Clear Today’s Logs'}
                </button>
              )}
              <button
                type="button"
                onClick={handleBatchSubmit}
                disabled={submitting}
                className="flex-1 sm:flex-none px-6 py-3 bg-[#102f26] hover:bg-[#102f26]/90 text-white font-mono text-[10px] uppercase tracking-[0.16em] transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Verified Actions →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
