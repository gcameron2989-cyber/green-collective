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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-emerald-900/40 bg-slate-900/80 backdrop-blur flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link
          href="/"
          className="font-bold text-lg text-emerald-400 flex items-center gap-2 hover:opacity-80 transition"
        >
          &larr; <span className="text-white">Green Collective</span>
        </Link>
        <div className="text-xs text-emerald-300 font-medium px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800">
          ⚡ Habit Analytics
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {/* Page Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">
            Personal Habit Tracker & Analytics
          </h1>
          <p className="text-sm text-slate-400">
            Log your daily eco-actions to build streaks and measure your cumulative environmental footprint reduction.
          </p>
        </div>

        {/* Analytics Summary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* Stat 1 */}
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex justify-between items-center shadow-lg">
            <div>
              <span className="text-xs text-emerald-400 uppercase font-semibold tracking-wider block mb-1">
                CO₂ Diverted Today
              </span>
              <span className="text-3xl font-black text-emerald-200">
                {totalCO2SavedToday.toFixed(1)} <span className="text-sm font-semibold">kg</span>
              </span>
            </div>
            <div className="text-3xl bg-emerald-900/50 p-3 rounded-xl">🌱</div>
          </div>

          {/* Stat 2 */}
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex justify-between items-center shadow-lg">
            <div>
              <span className="text-xs text-emerald-400 uppercase font-semibold tracking-wider block mb-1">
                Completed Actions
              </span>
              <span className="text-3xl font-black text-emerald-200">
                {completedCount} <span className="text-slate-400 font-normal text-lg">/ {habits.length}</span>
              </span>
            </div>
            <div className="text-3xl bg-emerald-900/50 p-3 rounded-xl">✅</div>
          </div>

          {/* Stat 3 */}
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex justify-between items-center shadow-lg">
            <div>
              <span className="text-xs text-emerald-400 uppercase font-semibold tracking-wider block mb-1">
                Active Habit Streak
              </span>
              <span className="text-3xl font-black text-emerald-200">
                {Math.max(...habits.map((h) => h.streakDays))} <span className="text-sm font-semibold">days</span>
              </span>
            </div>
            <div className="text-3xl bg-emerald-900/50 p-3 rounded-xl">🔥</div>
          </div>
        </div>

        {/* Filter Bar & Interactive Habit List */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-white">Daily Actions</h2>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {["All", "Transport", "Waste", "Energy", "Food"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    filter === cat
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
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
                    ? "bg-emerald-950/30 border-emerald-600/50 shadow-inner"
                    : "bg-slate-800/40 border-slate-700/50 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                    {habit.icon}
                  </div>
                  <div>
                    <h3
                      className={`font-semibold text-base ${
                        habit.completedToday
                          ? "line-through text-slate-400"
                          : "text-white"
                      }`}
                    >
                      {habit.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="text-emerald-400 font-medium">
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
                  className={`size-7 rounded-lg border flex items-center justify-center font-bold text-sm transition ${
                    habit.completedToday
                      ? "bg-emerald-500 border-emerald-400 text-slate-950"
                      : "border-slate-600 text-transparent hover:border-slate-400"
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
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-900">
        Green Collective &copy; {new Date().getFullYear()} — Habit Analytics
      </footer>
    </div>
  );
}
