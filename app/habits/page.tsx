"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Habit {
  id: string;
  title: string;
  category: "Transport" | "Waste" | "Energy" | "Food";
  co2SavedKg: number;
  unit: string;
  completedToday: boolean;
  streakDays: number;
  icon: string;
}

const INITIAL_HABITS: Habit[] = [
  {
    id: "h1",
    title: "Commute via Transit / Bike",
    category: "Transport",
    co2SavedKg: 2.4,
    unit: "trip",
    completedToday: false,
    streakDays: 4,
    icon: "🚲",
  },
  {
    id: "h2",
    title: "Plant-Based Meal Choice",
    category: "Food",
    co2SavedKg: 1.6,
    unit: "meal",
    completedToday: false,
    streakDays: 7,
    icon: "🥗",
  },
  {
    id: "h3",
    title: "Zero Waste / Compost Sorting",
    category: "Waste",
    co2SavedKg: 0.8,
    unit: "day",
    completedToday: true,
    streakDays: 12,
    icon: "♻️",
  },
  {
    id: "h4",
    title: "Cold Water Laundry Wash",
    category: "Energy",
    co2SavedKg: 0.6,
    unit: "load",
    completedToday: false,
    streakDays: 2,
    icon: "🧺",
  },
];

export default function HabitAnalyticsPage() {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [filter, setFilter] = useState<string>("All");

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          const newlyCompleted = !habit.completedToday;
          return {
            ...habit,
            completedToday: newlyCompleted,
            streakDays: newlyCompleted
              ? habit.streakDays + 1
              : Math.max(0, habit.streakDays - 1),
          };
        }
        return habit;
      })
    );
  };

  const totalCO2SavedToday = habits
    .filter((h) => h.completedToday)
    .reduce((acc, curr) => acc + curr.co2SavedKg, 0);

  const completedCount = habits.filter((h) => h.completedToday).length;

  const filteredHabits = habits.filter(
    (h) => filter === "All" || h.category === filter
  );

  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Background Radial Glow & Grid Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Header */}
      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link
          href="/"
          className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2 hover:opacity-80 transition"
        >
          <span className="size-3 rounded-full bg-emerald-500 inline-block" />
          Green Collective
        </Link>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full border border-emerald-200">
          ⚡ Habit Analytics
        </span>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 z-10">
        {/* Title Section */}
        <div className="mb-8 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
            Personal Habit Tracker & Analytics
          </h1>
          <p className="text-sm text-muted-foreground font-normal">
            Log daily eco-actions to build streaks and measure your cumulative environmental footprint reduction.
          </p>
        </div>

        {/* Analytics Summary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-5 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur shadow-sm flex justify-between items-center">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 block mb-1">
                CO₂ Diverted Today
              </span>
              <span className="text-3xl font-extrabold text-[#0f382c]">
                {totalCO2SavedToday.toFixed(1)} <span className="text-sm font-medium text-muted-foreground">kg</span>
              </span>
            </div>
            <div className="text-2xl p-3 rounded-xl bg-emerald-100/70 border border-emerald-200">🌱</div>
          </div>

          <div className="p-5 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur shadow-sm flex justify-between items-center">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 block mb-1">
                Completed Actions
              </span>
              <span className="text-3xl font-extrabold text-[#0f382c]">
                {completedCount} <span className="text-sm font-normal text-muted-foreground">/ {habits.length}</span>
              </span>
            </div>
            <div className="text-2xl p-3 rounded-xl bg-emerald-100/70 border border-emerald-200">✅</div>
          </div>

          <div className="p-5 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur shadow-sm flex justify-between items-center">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 block mb-1">
                Active Habit Streak
              </span>
              <span className="text-3xl font-extrabold text-[#0f382c]">
                {Math.max(...habits.map((h) => h.streakDays))} <span className="text-sm font-medium text-muted-foreground">days</span>
              </span>
            </div>
            <div className="text-2xl p-3 rounded-xl bg-emerald-100/70 border border-emerald-200">🔥</div>
          </div>
        </div>

        {/* Filter Bar & Interactive Habit List */}
        <div className="border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-lg font-bold text-foreground">Daily Actions</h2>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {["All", "Transport", "Waste", "Energy", "Food"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition ${
                    filter === cat
                      ? "bg-[#0f382c] text-white border-[#0f382c] shadow-sm"
                      : "bg-background/60 text-muted-foreground border-emerald-900/10 hover:bg-emerald-50/50 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Habits Grid */}
          <div className="space-y-3">
            {filteredHabits.map((habit) => (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  habit.completedToday
                    ? "bg-emerald-100/40 border-emerald-300 shadow-inner"
                    : "bg-background/60 border-emerald-900/10 hover:border-emerald-700/30"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-xl p-2.5 rounded-xl bg-white border border-emerald-900/10 shadow-sm">
                    {habit.icon}
                  </div>
                  <div>
                    <h3
                      className={`font-semibold text-sm ${
                        habit.completedToday
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {habit.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="text-emerald-800 font-semibold">
                        -{habit.co2SavedKg} kg CO₂ / {habit.unit}
                      </span>
                      <span>•</span>
                      <span>🔥 {habit.streakDays} day streak</span>
                    </div>
                  </div>
                </div>

                {/* Checkbox State */}
                <button
                  aria-label={`Mark ${habit.title} as completed`}
                  className={`size-6 rounded-md border flex items-center justify-center font-bold text-xs transition ${
                    habit.completedToday
                      ? "bg-[#0f382c] border-[#0f382c] text-white"
                      : "border-emerald-900/20 text-transparent hover:border-emerald-700"
                  }`}
                >
                  ✓
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  );
}
