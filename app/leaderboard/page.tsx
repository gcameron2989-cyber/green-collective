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
  const [tab, setTab] = useState<"ubc" | "community" | "best301">("best301"); // Default to BEST 301 for class demo
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [joiningStatus, setJoiningStatus] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

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

    fetchData();
  }, [supabase]);

  const handleJoinBest301 = async () => {
    if (!currentUser) {
      window.location.href = "/login?redirectTo=/competition";
      return;
    }

    setJoiningStatus(true);
    const { error } = await supabase
      .from("profiles")
      .update({ is_best_301: true })
      .eq("id", currentUser.id);

    if (!error) {
      setProfiles((prev) =>
        prev.map((p) => (p.id === currentUser.id ? { ...p, is_best_301: true } : p))
      );
      setTab("best301");
    }
    setJoiningStatus(false);
  };

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

  const isUserInBest301 = useMemo(() => {
    if (!currentUser) return false;
    const p = profiles.find((item) => item.id === currentUser.id);
    return p?.is_best_301 || false;
  }, [currentUser, profiles]);

  return (
    <div className="min-h-screen bg-[#f9f8f6] text-[#102f26] flex flex-col justify-between relative overflow-hidden font-sans">
      <header className="px-6 py-4 border-b border-[#102f26]/10 backdrop-blur-md bg-white/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#102f26] flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/actions" className="text-xs font-semibold px-3 py-1.5 bg-[#102f26] text-white rounded-full hover:bg-[#39705d] transition">
            Log Action +
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 z-10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider bg-[#f1f6f2] text-[#39705d] rounded-full border border-[#39705d]/20">
            🌲 Forest Bioeconomy Sciences & Technology
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#102f26]">BEST 301 Live Leaderboard</h1>
          <p className="text-xs text-[#526760]">
            Tracking verified student carbon offsets, bioeconomy metrics, and institutional impact for our Friday pilot evaluation.
          </p>

          {!isUserInBest301 && (
            <div className="pt-2">
              <button
                onClick={handleJoinBest301}
                disabled={joiningStatus}
                className="px-5 py-2.5 bg-[#39705d] text-white text-xs font-bold rounded-full hover:bg-[#102f26] transition shadow-md"
              >
                {joiningStatus ? "Joining..." : "✨ Join BEST 301 Class Cohort"}
              </button>
            </div>
          )}
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center border-b border-[#102f26]/10 pb-4 gap-3 flex-wrap">
          <button
            onClick={() => setTab("best301")}
            className={`px-5 py-2 text-xs font-bold rounded-full transition uppercase tracking-wider ${
              tab === "best301"
                ? "bg-[#102f26] text-white shadow-md"
                : "bg-white border border-[#102f26]/15 text-[#526760] hover:bg-[#f1f6f2]"
            }`}
          >
            🌲 BEST 301 Cohort ({rankings.best301.length})
          </button>
          <button
            onClick={() => setTab("ubc")}
            className={`px-5 py-2 text-xs font-bold rounded-full transition uppercase tracking-wider ${
              tab === "ubc"
                ? "bg-[#102f26] text-white shadow-md"
                : "bg-white border border-[#102f26]/15 text-[#526760] hover:bg-[#f1f6f2]"
            }`}
          >
            🌍 Global UBC
          </button>
          <button
            onClick={() => setTab("community")}
            className={`px-5 py-2 text-xs font-bold rounded-full transition uppercase tracking-wider ${
              tab === "community"
                ? "bg-[#102f26] text-white shadow-md"
                : "bg-white border border-[#102f26]/15 text-[#526760] hover:bg-[#f1f6f2]"
            }`}
          >
            🏘️ Metro Vancouver Hubs
          </button>
        </div>

        {/* Rankings Table */}
        <div className="border border-[#102f26]/15 rounded-2xl bg-white p-6 shadow-sm">
          {loading ? (
            <div className="py-12 text-center text-xs text-[#526760] font-mono animate-pulse">
              Syncing live class rankings...
            </div>
          ) : tab === "community" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#102f26]/10 text-[#39705d] font-mono uppercase text-[10px]">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Neighborhood / Municipality</th>
                    <th className="py-3 px-4 text-center">Active Members</th>
                    <th className="py-3 px-4 text-center">Total Actions</th>
                    <th className="py-3 px-4 text-right">Impact Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rankings.community.map((comm, index) => (
                    <tr key={comm.community} className="hover:bg-[#f1f6f2]/50 transition">
                      <td className="py-3.5 px-4 font-extrabold text-[#102f26]">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#102f26]">
                        <Link 
                          href={`/community/${encodeURIComponent(comm.community.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`}
                          className="hover:text-[#39705d] hover:underline flex items-center gap-1.5"
                        >
                          📍 {comm.community} →
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-[#526760]">{comm.members}</td>
                      <td className="py-3.5 px-4 text-center font-medium text-[#526760]">{comm.actions}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-extrabold text-[#102f26]">{comm.points} PTS</div>
                        <div className="text-[9px] font-mono text-[#39705d] uppercase">{comm.co2.toFixed(1)} KG CO₂</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#102f26]/10 text-[#39705d] font-mono uppercase text-[10px]">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Participant</th>
                    <th className="py-3 px-4">Community / Affiliation</th>
                    <th className="py-3 px-4 text-center">Actions Logged</th>
                    <th className="py-3 px-4 text-right">Impact Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rankings[tab].map((user, index) => (
                    <tr key={user.id} className="hover:bg-[#f1f6f2]/50 transition">
                      <td className="py-3.5 px-4 font-extrabold text-[#102f26]">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#f1f6f2] border border-[#39705d]/20 flex items-center justify-center text-sm">
                            {user.avatar_emoji || "🌲"}
                          </div>
                          <div>
                            <p className="font-bold text-[#102f26]">{user.display_name || "BEST 301 Student"}</p>
                            {user.is_best_301 && (
                              <p className="text-[9px] font-mono text-[#39705d] uppercase tracking-wider font-bold">BEST 301 Cohort</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#526760]">{user.community || "UBC Campus"}</td>
                      <td className="py-3.5 px-4 text-center font-medium text-[#526760]">{user.actionsCount}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-extrabold text-[#102f26]">{user.points} PTS</div>
                        <div className="text-[9px] font-mono text-[#39705d] uppercase">{user.co2Saved.toFixed(1)} KG CO₂</div>
                      </td>
                    </tr>
                  ))}
                  {rankings[tab].length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#526760] font-mono">
                        No students have joined the BEST 301 cohort yet. Click "Join BEST 301 Class Cohort" above to appear here!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-[#526760] border-t border-[#102f26]/10 bg-white z-10 font-mono">
        © {new Date().getFullYear()} Green Collective · BEST 301 Pilot Evaluation
      </footer>
    </div>
  );
}
