"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const ECO_ACTIONS_MAP: Record<string, { title: string; pointsPerUnit: number; category: string; unit: string }> = {
  'transit-commute': { category: 'Mobility & Energy', title: 'Public Transit (Bus/Train/SkyTrain)', unit: 'mins', pointsPerUnit: 1 },
  'active-commute': { category: 'Mobility & Energy', title: 'Active Commute (Walk/Bike)', unit: 'km', pointsPerUnit: 10 },
  'carpool-trip': { category: 'Mobility & Energy', title: 'Shared Ride / Carpool', unit: 'km', pointsPerUnit: 3 },
  'stairs-instead-elevator': { category: 'Mobility & Energy', title: 'Took Stairs Instead of Elevator', unit: 'floors', pointsPerUnit: 3 },
  'home-meal': { category: 'Zero Waste & Dining', title: 'Brought Lunch/Snacks from Home', unit: 'meals', pointsPerUnit: 30 },
  'home-beverage': { category: 'Zero Waste & Dining', title: 'Brought Coffee/Tea in Reusable Mug', unit: 'drinks', pointsPerUnit: 25 },
  'reusable-container-buy': { category: 'Zero Waste & Dining', title: 'Used Reusable Container for Takeout/Dining', unit: 'items', pointsPerUnit: 15 },
  'refillable-water': { category: 'Zero Waste & Dining', title: 'Used Refillable Water Station vs. Bottled Water', unit: 'refills', pointsPerUnit: 10 },
  'plant-based-meal': { category: 'Zero Waste & Dining', title: 'Chose Plant-Based Dining Option', unit: 'meals', pointsPerUnit: 20 },
  'waste-sorting': { category: 'Circular Economy', title: 'Properly Sorted Compost & Recyclables at Hub', unit: 'sorts', pointsPerUnit: 10 },
  'thrift-borrow-gear': { category: 'Circular Economy', title: 'Borrowed / Thrifted Academic Textbooks or Gear', unit: 'items', pointsPerUnit: 30 },
  'campus-cleanup': { category: 'Circular Economy', title: 'Participated in Community/Faculty Cleanup', unit: 'hours', pointsPerUnit: 50 },
  'ubc-forestry-field': { category: 'UBC Stewardship', title: 'Participated in Campus Tree Care/Field Audit', unit: 'hours', pointsPerUnit: 50 },
};

interface Profile {
  id: string;
  display_name: string;
  community: string;
  is_best_301: boolean;
  avatar_emoji: string;
}

interface Submission {
  user_id: string;
  eco_action_id: string;
  quantity: number;
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"ubc" | "community" | "best301">("ubc");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchLeaderboards = async () => {
      setLoading(true);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, display_name, community, is_best_301, avatar_emoji");

      const { data: subData } = await supabase
        .from("submissions")
        .select("user_id, eco_action_id, quantity")
        .eq("status", "approved");

      if (profileData) setProfiles(profileData);
      if (subData) setSubmissions(subData);
      
      setLoading(false);
    };

    fetchLeaderboards();
  }, [supabase]);

  const rankings = useMemo(() => {
    const userStats = profiles.map((p) => {
      const userSubs = submissions.filter((s) => s.user_id === p.id);
      const points = userSubs.reduce(
        (sum, s) => sum + (ECO_ACTIONS_MAP[s.eco_action_id]?.pointsPerUnit || 20) * s.quantity,
        0
      );
      const actionsCount = userSubs.reduce((sum, s) => sum + s.quantity, 0);
      const co2Saved = actionsCount * 0.6;

      return { ...p, points, actionsCount, co2Saved };
    }).filter((u) => u.points > 0);

    const sortedIndividuals = [...userStats].sort((a, b) => b.points - a.points);

    const communityMap: Record<string, { community: string; points: number; members: number; actions: number; co2: number }> = {};
    
    userStats.forEach((u) => {
      const comm = u.community || "UBC Campus";
      if (!communityMap[comm]) {
        communityMap[comm] = { community: comm, points: 0, members: 0, actions: 0, co2: 0 };
      }
      communityMap[comm].points += u.points;
      communityMap[comm].members += 1;
      communityMap[comm].actions += u.actionsCount;
      communityMap[comm].co2 += u.co2Saved;
    });

    const sortedCommunities = Object.values(communityMap).sort((a, b) => b.points - a.points);

    return {
      ubc: sortedIndividuals,
      best301: sortedIndividuals.filter((u) => u.is_best_301),
      community: sortedCommunities,
    };
  }, [profiles, submissions]);

  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/profile" className="text-xs font-semibold px-3 py-1.5 bg-emerald-100 text-[#0f382c] rounded-full hover:bg-emerald-200 transition">
            My Profile
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 z-10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full border border-emerald-200">
            🏆 Pilot Impact Leaderboard
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Global Sustainability Rankings</h1>
          <p className="text-xs text-muted-foreground">
            Tracking collective verified carbon reduction and bioeconomy impact across UBC and Metro Vancouver.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center border-b border-emerald-900/10 pb-4 gap-3 flex-wrap">
          <button
            onClick={() => setTab("ubc")}
            className={`px-5 py-2 text-xs font-bold rounded-full transition uppercase tracking-wider ${
              tab === "ubc"
                ? "bg-[#0f382c] text-white shadow-md"
                : "bg-background border border-emerald-900/10 text-muted-foreground hover:bg-emerald-100/50"
            }`}
          >
            🌍 Global (UBC)
          </button>
          <button
            onClick={() => setTab("community")}
            className={`px-5 py-2 text-xs font-bold rounded-full transition uppercase tracking-wider ${
              tab === "community"
                ? "bg-[#0f382c] text-white shadow-md"
                : "bg-background border border-emerald-900/10 text-muted-foreground hover:bg-emerald-100/50"
            }`}
          >
            🏘️ Metro Communities
          </button>
          <button
            onClick={() => setTab("best301")}
            className={`px-5 py-2 text-xs font-bold rounded-full transition uppercase tracking-wider ${
              tab === "best301"
                ? "bg-[#0f382c] text-white shadow-md"
                : "bg-background border border-emerald-900/10 text-muted-foreground hover:bg-emerald-100/50"
            }`}
          >
            🌲 BEST 301 Cohort
          </button>
        </div>

        {/* Rankings Table */}
        <div className="border border-emerald-900/10 rounded-2xl bg-card/90 backdrop-blur p-6 shadow-xl">
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground font-semibold animate-pulse">
              Syncing live rankings...
            </div>
          ) : tab === "community" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-emerald-900/10 text-emerald-900">
                    <th className="py-3 px-4 font-bold">Rank</th>
                    <th className="py-3 px-4 font-bold">Neighborhood / Municipality</th>
                    <th className="py-3 px-4 font-bold text-center">Active Members</th>
                    <th className="py-3 px-4 font-bold text-center">Total Actions</th>
                    <th className="py-3 px-4 font-bold text-right">Impact Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/5">
                  {rankings.community.map((comm, index) => (
                    <tr key={comm.community} className="hover:bg-emerald-50/50 transition">
                      <td className="py-3.5 px-4 font-extrabold text-[#0f382c]">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        <Link 
                          href={`/community/${encodeURIComponent(comm.community.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`}
                          className="hover:text-emerald-700 hover:underline flex items-center gap-1.5"
                        >
                          📍 {comm.community} →
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-muted-foreground">
                        {comm.members}
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-muted-foreground">
                        {comm.actions}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-extrabold text-[#0f382c]">{comm.points} PTS</div>
                        <div className="text-[9px] font-mono text-emerald-700/70 uppercase tracking-widest">{comm.co2.toFixed(1)} KG CO₂</div>
                      </td>
                    </tr>
                  ))}
                  {rankings.community.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">No community data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-emerald-900/10 text-emerald-900">
                    <th className="py-3 px-4 font-bold">Rank</th>
                    <th className="py-3 px-4 font-bold">Participant</th>
                    <th className="py-3 px-4 font-bold">Community</th>
                    <th className="py-3 px-4 font-bold text-center">Actions</th>
                    <th className="py-3 px-4 font-bold text-right">Impact Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/5">
                  {rankings[tab].map((user, index) => (
                    <tr key={user.id} className="hover:bg-emerald-50/50 transition">
                      <td className="py-3.5 px-4 font-extrabold text-[#0f382c]">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-sm">
                            {user.avatar_emoji}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{user.display_name || "Eco Warrior"}</p>
                            {user.is_best_301 && (
                              <p className="text-[9px] font-mono text-emerald-700 uppercase tracking-widest">BEST 301</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-muted-foreground">
                        {user.community}
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-muted-foreground">
                        {user.actionsCount}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-extrabold text-[#0f382c]">{user.points} PTS</div>
                        <div className="text-[9px] font-mono text-emerald-700/70 uppercase tracking-widest">{user.co2Saved.toFixed(1)} KG CO₂</div>
                      </td>
                    </tr>
                  ))}
                  {rankings[tab].length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">No active participants found for this filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  );
}
