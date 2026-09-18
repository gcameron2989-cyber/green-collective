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
  actionId: string;
}

const INITIAL_HABITS: Habit[] = [
  {
    id: "h1",
    title: "Commute via Transit / Bike",
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
    title: "Plant-Based Meal Choice",
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
    title: "Zero Waste / Compost Sorting",
    category: "Waste",
    co2SavedKg: 0.5,
    unit: "day",
    completedToday: false,
    momentumScore: 92,
    icon: "♻️",
    actionId: "waste-sorting",
  },
  {
    id: "h4",
    title: "Cold Water Laundry Wash",
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

  const supabase = createClient();

  useEffect(() => {
    const checkUserAndSubmissions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch user's submissions for today to sync completed state
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
        }
      }
      setLoadingUser(false);
    };

    checkUserAndSubmissions();
  }, [supabase]);

  const toggleHabit = async (habit: Habit) => {
    const newlyCompleted = !habit.completedToday;

    // Optimistic UI update
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habit.id) {
          return {
            ...h,
            completedToday: newlyCompleted,
            momentumScore: newlyCompleted
              ? Math.min(100, h.momentumScore + 5)
              : Math.max(0, h.momentumScore - 5),
          };
        }
        return h;
      })
    );

    // If logged in, sync with database submissions table
    if (user) {
      if (newlyCompleted) {
        await supabase.from('submissions').insert({
          user_id: user.id,
          eco_action_id: habit.actionId,
          quantity: 1,
          status: 'approved',
          faculty_id: user.user_metadata?.faculty_id || null,
        });
      } else {
        // Remove today's submission for this action if toggled off
        const today = new Date().toISOString().split('T')[0];
        await supabase
          .from('submissions')
          .delete()
          .eq('user_id', user.id)
          .eq('eco_action_id', habit.actionId)
          .gte('created_at', today);
      }
    }
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
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Background FX */}
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
        <div className="flex items-center gap-4 text-xs font-semibold">
          {user ? (
            <>
              <Link href="/profile" className="text-emerald-800 hover:underline">
                👤 My Profile
              </Link>
              <Link href="/dashboard" className="px-3.5 py-1.5 bg-[#0f382c] text-white rounded-full hover:bg-emerald-900 transition shadow-sm">
                Go to Dashboard
              </Link>
            </>
          ) : (
            <Link href="/login" className="px-3.5 py-1.5 bg-[#0f382c] text-white rounded-full hover:bg-emerald-900 transition shadow-sm">
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Hybrid Mode Banner (Only shown if guest) */}
      {!loadingUser && !user && (
        <div className="bg-[#0f382c] text-emerald-100 py-2.5 px-6 text-center text-xs font-medium border-b border-emerald-900/20 z-10 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>⚡ <strong>Interactive Preview Mode:</strong> You are testing live features. Create an account to permanently save your progress and impact metrics.</span>
          <Link
            href="/login"
            className="underline font-bold text-white hover:text-emerald-300 transition ml-1"
          >
            Create Free Account &rarr;
          </Link>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 z-10">
        <div className="mb-8 text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-3 border border-emerald-200">
            ⚡ Habit Analytics
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
            Personal Impact & Momentum Analytics
          </h1>
          <p className="text-sm text-muted-foreground font-normal">
            Log your daily eco-actions, measure cumulative carbon reduction, and build long-term sustainability momentum.
          </p>
        </div>

        {/* Analytics Summary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-5 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur shadow-sm flex justify-between items-center">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 block mb-1">
                Measured CO₂ Diverted
              </span>
              <span className="text-3xl font-extrabold text-[#0f382c]">
                {totalCO2SavedToday.toFixed(1)} <span className="text-sm font-medium text-muted-foreground">kg today</span>
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
                Overall Momentum Index
              </span>
              <span className="text-3xl font-extrabold text-[#0f382c]">
                {avgMomentum}% <span className="text-xs font-medium text-emerald-700">High Progress</span>
              </span>
            </div>
            <div className="text-2xl p-3 rounded-xl bg-emerald-100/70 border border-emerald-200">📈</div>
          </div>
        </div>

        {/* Filter Bar & Interactive Habit List */}
        <div className="border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-lg font-bold text-foreground">Daily Actions</h2>

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

          <div className="space-y-3">
            {filteredHabits.map((habit) => (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit)}
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
                      <span>Momentum: {habit.momentumScore}%</span>
                    </div>
                  </div>
                </div>

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

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  );
}
