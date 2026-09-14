"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logHabit } from "@/lib/actions/habits";
import { createCustomHabit } from "@/lib/actions/customHabits";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LoggedHabit {
  id: string;
  habit_id: string;
  title: string;
  category: string;
  co2_saved_kg: number;
  completed_at: string;
}

interface CustomHabit {
  id: string;
  title: string;
  category: string;
  co2_saved_kg: number;
}

const DEFAULT_HABITS = [
  { habit_id: "transit", title: "Zero-Emission Transit", category: "Transport", co2_saved_kg: 2.4, icon: "🚲" },
  { habit_id: "plant_meal", title: "Plant-Based Meal Choice", category: "Food", co2_saved_kg: 1.6, icon: "🥗" },
  { habit_id: "reusable", title: "Reusable Container / Cup", category: "Waste", co2_saved_kg: 0.8, icon: "♻️" },
  { habit_id: "energy_save", title: "Cold Wash / Energy Saver", category: "Energy", co2_saved_kg: 0.6, icon: "🧺" },
];

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userLogs, setUserLogs] = useState<LoggedHabit[]>([]);
  const [customHabits, setCustomHabits] = useState<CustomHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customCategory, setCustomCategory] = useState("General");
  const [customCO2, setCustomCO2] = useState("1.0");
  const [modalLoading, setModalLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUserEmail(user.email ?? "Member");

    // Fetch user habit logs
    const { data: logsData } = await supabase
      .from("user_habits")
      .select("*")
      .order("completed_at", { ascending: true });

    // Fetch custom user habits
    const { data: customData } = await supabase
      .from("custom_habits")
      .select("*")
      .order("created_at", { ascending: false });

    if (logsData) setUserLogs(logsData);
    if (customData) setCustomHabits(customData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogHabit = async (habit: { habit_id: string; title: string; category: string; co2_saved_kg: number }) => {
    setSubmittingId(habit.habit_id);
    const result = await logHabit(habit);
    if (result) await loadData();
    setSubmittingId(null);
  };

  const handleCreateCustomHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);

    const co2Val = parseFloat(customCO2) || 1.0;
    await createCustomHabit({
      title: customTitle,
      category: customCategory,
      co2_saved_kg: co2Val,
    });

    setCustomTitle("");
    setCustomCategory("General");
    setCustomCO2("1.0");
    setModalLoading(false);
    setShowModal(false);
    await loadData();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const totalCO2Saved = userLogs.reduce((acc, log) => acc + Number(log.co2_saved_kg || 0), 0);
  const totalActionsCount = userLogs.length;
  const momentumScore = Math.min(100, 50 + totalActionsCount * 5);

  const chartData = userLogs.reduce((acc: { date: string; co2: number }[], log) => {
    const dateStr = new Date(log.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const existing = acc.find((d) => d.date === dateStr);
    if (existing) {
      existing.co2 = Number((existing.co2 + Number(log.co2_saved_kg)).toFixed(1));
    } else {
      acc.push({ date: dateStr, co2: Number(log.co2_saved_kg) });
    }
    return acc;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-950/5 flex items-center justify-center text-xs font-semibold text-emerald-900">
        Loading authenticated workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-muted-foreground hidden sm:inline">{userEmail}</span>
          <Link href="/profile" className="text-xs font-semibold px-3 py-1.5 bg-emerald-100 text-[#0f382c] rounded-full hover:bg-emerald-200 transition">
            Settings & Profile
          </Link>
          <button onClick={handleSignOut} className="text-xs font-semibold px-3.5 py-1.5 border border-emerald-900/20 rounded-full hover:bg-emerald-100/50 transition">
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 z-10 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-3 border border-emerald-200">
              🔒 Authenticated Dashboard
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Personal Impact & Momentum</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#0f382c] text-white text-xs font-semibold rounded-full hover:bg-emerald-900 transition shadow"
          >
            + Create Custom Action
          </button>
        </div>

        {/* Dynamic Analytics Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur shadow-sm">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 block mb-1">Personal Momentum Index</span>
            <div className="text-3xl font-extrabold text-[#0f382c]">{momentumScore}%</div>
            <span className="text-xs text-muted-foreground mt-1 block">Verified progress trajectory</span>
          </div>

          <div className="p-5 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur shadow-sm">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 block mb-1">Total CO₂ Offset</span>
            <div className="text-3xl font-extrabold text-[#0f382c]">{totalCO2Saved.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">kg</span></div>
            <span className="text-xs text-muted-foreground mt-1 block">Cumulative database-verified impact</span>
          </div>

          <div className="p-5 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur shadow-sm">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 block mb-1">Logged Actions</span>
            <div className="text-3xl font-extrabold text-[#0f382c]">{totalActionsCount}</div>
            <span className="text-xs text-muted-foreground mt-1 block">Lifetime eco-choices recorded</span>
          </div>
        </div>

        {/* Dynamic Impact Visualizations */}
        <div className="border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">Carbon Reduction Trajectory (kg CO₂)</h2>
          {chartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-emerald-900/10 rounded-xl">
              Log actions below to generate your real-time carbon reduction chart.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="date" stroke="#0f382c" fontSize={12} />
                  <YAxis stroke="#0f382c" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="co2" stroke="#0f382c" fill="#10b981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Action Logging Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Log Sustainable Choice</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEFAULT_HABITS.map((option) => (
                <div key={option.habit_id} className="p-4 rounded-xl border border-emerald-900/10 bg-background/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <h3 className="font-semibold text-xs text-foreground">{option.title}</h3>
                      <span className="text-[11px] text-emerald-800 font-semibold">-{option.co2_saved_kg} kg CO₂</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLogHabit(option)}
                    disabled={submittingId === option.habit_id}
                    className="px-3 py-1.5 bg-[#0f382c] text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 transition disabled:opacity-50 shrink-0"
                  >
                    {submittingId === option.habit_id ? "Saving..." : "+ Log"}
                  </button>
                </div>
              ))}

              {/* Custom User Habits */}
              {customHabits.map((ch) => (
                <div key={ch.id} className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <h3 className="font-semibold text-xs text-foreground">{ch.title}</h3>
                      <span className="text-[11px] text-emerald-800 font-semibold">-{ch.co2_saved_kg} kg CO₂</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLogHabit({ habit_id: ch.id, title: ch.title, category: ch.category, co2_saved_kg: ch.co2_saved_kg })}
                    disabled={submittingId === ch.id}
                    className="px-3 py-1.5 bg-[#0f382c] text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 transition disabled:opacity-50 shrink-0"
                  >
                    {submittingId === ch.id ? "Saving..." : "+ Log"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
            {userLogs.length === 0 ? (
              <p className="text-xs text-muted-foreground">No logged habits yet.</p>
            ) : (
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {[...userLogs].reverse().map((log) => (
                  <div key={log.id} className="p-3 rounded-xl border border-emerald-900/10 bg-background/50 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold block text-foreground">{log.title}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(log.completed_at).toLocaleDateString()}</span>
                    </div>
                    <span className="font-bold text-emerald-800">-{log.co2_saved_kg} kg</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal for Creating Custom Action */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-emerald-900/10 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-foreground">Create Custom Action</h2>
            <form onSubmit={handleCreateCustomHabit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Action Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Power Charging"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-emerald-900/20 rounded-xl bg-background"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Category</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Energy, Materials, Food"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-emerald-900/20 rounded-xl bg-background"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">CO₂ Offset (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={customCO2}
                  onChange={(e) => setCustomCO2(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-emerald-900/20 rounded-xl bg-background"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-emerald-900/20 hover:bg-emerald-100/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-3 py-1.5 bg-[#0f382c] text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 disabled:opacity-50"
                >
                  {modalLoading ? "Saving..." : "Save Action"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  );
}
