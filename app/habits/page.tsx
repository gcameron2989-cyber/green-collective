"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Habit {
  id: string;
  title: string;
  category: "Transport" | "Waste" | "Energy" | "Food";
  co2SavedKg: number;
  unit: string;
  completedToday: boolean;
  momentumScore: number;
  icon: string;
  actionId: string; // Must match the competition's official eco_action_ids
}

const INITIAL_HABITS: Habit[] = [
  {
    id: "h1",
    title: "Public / active transportation",
    category: "Transport",
    co2SavedKg: 1.5,
    unit: "trip",
    completedToday: false,
    momentumScore: 68,
    icon: "🚲",
    actionId: "sustainable-commute",
  },
  {
    id: "h2",
    title: "Plant-forward meal",
    category: "Food",
    co2SavedKg: 1.2,
    unit: "meal",
    completedToday: false,
    momentumScore: 84,
    icon: "🥗",
    actionId: "plant-based-meal",
  },
  {
    id: "h3",
    title: "Waste sorting",
    category: "Waste",
    co2SavedKg: 0.5,
    unit: "action",
    completedToday: false,
    momentumScore: 92,
    icon: "♻️",
    actionId: "waste-sorting",
  },
  {
    id: "h4",
    title: "Cold-water laundry",
    category: "Energy",
    co2SavedKg: 0.6,
    unit: "load",
    completedToday: false,
    momentumScore: 45,
    icon: "🧺",
    actionId: "cold-water-wash",
  },
];

export default function HabitAnalyticsPage() {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [filter, setFilter] = useState<string>("All");
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const [joinCompetition, setJoinCompetition] = useState(false);

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
      setLoadingUser(false);
    };

    checkUserAndSubmissions();
  }, [supabase]);

  const toggleHabitLocally = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          const newlyCompleted = !habit.completedToday;
          return {
            ...habit,
            completedToday: newlyCompleted,
            momentumScore: newlyCompleted
              ? Math.min(100, habit.momentumScore + 5)
              : Math.max(0, habit.momentumScore - 5),
          };
        }
        return habit;
      })
    );
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
        quantity: 1,
        status: 'approved',
        faculty_id: joinCompetition ? (user.user_metadata?.faculty_id || "general-comp") : null,
      }));

      await supabase.from('submissions').insert(inserts);
    }

    setSubmitting(false);
    setSuccessMessage("✨ Eco-actions successfully submitted!");
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
        prev.map((habit) => ({
          ...habit,
          completedToday: false,
        }))
      );
      setSuccessMessage("🗑️ Today's actions cleared successfully.");
    } else {
      setSuccessMessage("⚠️ Failed to clear actions. Please try again.");
    }

    setDeleting(false);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const totalCO2SavedToday = habits
    .filter((h) => h.completedToday)
    .reduce((acc, curr) => acc + curr.co2SavedKg, 0);

  const completedCount = habits.filter((h) => h.completedToday).length;
  const avgMomentum = Math.round(
    habits.reduce((acc, h) => acc + h.momentumScore, 0) / habits.length
  );

  const filteredHabits = habits.filter(
    (h) => filter === "All" || h.category === filter
  );

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24">
      {/* Hero Header Section */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
            Sustainability · Action · Measurement
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Habit Analytics &amp; Competition Log
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Log your daily choices, track cumulative carbon reduction, and participate in shared community programs.
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

        {/* Analytics Summary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 border border-[#102f26]/15 bg-white">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-2">
              Measured CO₂ Diverted
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-medium tracking-tight text-[#102f26]">
                {totalCO2SavedToday.toFixed(1)} <span className="text-sm font-normal text-[#71847d]">kg today</span>
              </span>
              <span className="text-xl">🌱</span>
            </div>
          </div>

          <div className="p-6 border border-[#102f26]/15 bg-white">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-2">
              Completed Actions
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-medium tracking-tight text-[#102f26]">
                {completedCount} <span className="text-sm font-normal text-[#71847d]">/ {habits.length}</span>
              </span>
              <span className="text-xl">✅</span>
            </div>
          </div>

          <div className="p-6 border border-[#102f26]/15 bg-white">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-2">
              Overall Momentum Index
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-medium tracking-tight text-[#102f26]">
                {avgMomentum}% <span className="text-xs font-mono text-[#39705d]">Active</span>
              </span>
              <span className="text-xl">📈</span>
            </div>
          </div>
        </div>

        {/* Filter Bar & Interactive Habit List */}
        <div className="border border-[#102f26]/15 bg-white p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-[#102f26]/10 pb-6">
            <h2 className="text-lg font-medium tracking-tight text-[#102f26]">Official Action Registry</h2>

            <div className="flex flex-wrap gap-2">
              {["All", "Transport", "Waste", "Energy", "Food"].map((cat) => (
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
            {filteredHabits.map((habit) => (
              <div
                key={habit.id}
                onClick={() => toggleHabitLocally(habit.id)}
                className={`p-5 border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  habit.completedToday
                    ? "bg-[#f1f6f2] border-[#102f26]/40"
                    : "bg-white border-[#102f26]/15 hover:border-[#102f26]/30"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-xl p-3 bg-[#f1f6f2] border border-[#102f26]/10">
                    {habit.icon}
                  </div>
                  <div>
                    <h3
                      className={`font-medium text-sm ${
                        habit.completedToday
                          ? "line-through text-[#71847d]"
                          : "text-[#102f26]"
                      }`}
                    >
                      {habit.title}
                    </h3>
                    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#71847d] mt-1">
                      <span className="text-[#39705d]">
                        ~{habit.co2SavedKg} kg CO₂e / {habit.unit}
                      </span>
                      <span>•</span>
                      <span>Momentum: {habit.momentumScore}%</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`size-6 border flex items-center justify-center font-mono text-xs transition ${
                    habit.completedToday
                      ? "bg-[#102f26] border-[#102f26] text-white"
                      : "border-[#102f26]/20 text-transparent"
                  }`}
                >
                  ✓
                </div>
              </div>
            ))}
          </div>

          {/* Competition Opt-in Toggle */}
          <div className="mb-8 p-5 border border-[#102f26]/15 bg-[#f1f6f2] flex items-start gap-4">
            <input
              type="checkbox"
              id="competition-opt-in"
              checked={joinCompetition}
              onChange={(e) => setJoinCompetition(e.target.checked)}
              className="mt-1 size-4 accent-[#102f26] rounded-none cursor-pointer"
            />
            <label htmlFor="competition-opt-in" className="text-xs text-[#526760] cursor-pointer select-none">
              <strong className="block font-medium text-[#102f26] mb-1">Include in the UBC Sustainability Challenge Leaderboard</strong>
              Contribute your metrics to your faculty's team score, or leave unchecked to keep your logs strictly private.
            </label>
          </div>

          {/* Submit & Clear Action Buttons Bar */}
          <div className="pt-6 border-t border-[#102f26]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#71847d]">
              {completedCount} action{completedCount === 1 ? '' : 's'} selected for logging today.
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
                {submitting ? 'Submitting...' : 'Submit Selected Actions →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
