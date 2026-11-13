"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ACTION_REGISTRY } from '@/lib/actions';

interface LeaderboardEntry {
  rank: number;
  name: string;
  category: string;
  participants: number;
  carbonOffsetKg: number;
}

const VANCOUVER_NEIGHBOURHOODS = [
  "Arbutus Ridge", "Burnaby", "Downtown", "Dunbar-Southlands", "Fairview",
  "Grandview-Woodland", "Hastings-Sunrise", "Kensington-Cedar Cottage", "Kerrisdale",
  "Kitsilano", "Marpole", "Mount Pleasant", "North Vancouver", "Oakridge",
  "Point Grey", "Renfrew-Collingwood", "Richmond", "Shaughnessy", "South Cambie",
  "Strathcona", "Sunset", "Surrey", "UBC / UEL", "Victoria-Fraserview",
  "West End", "West Vancouver",
];

export default function CompetitionPage() {
  const [boardTier, setBoardTier] = useState<"institutional" | "local" | "best301">("institutional");
  const [activeTab, setActiveTab] = useState<"leaderboard" | "guidelines">("leaderboard");
  
  const [institutionalStandings, setInstitutionalStandings] = useState<LeaderboardEntry[]>([]);
  const [localStandings, setLocalStandings] = useState<LeaderboardEntry[]>([]);
  const [best301Standings, setBest301Standings] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchLiveStandings = async () => {
      try {
        setLoading(true);

        // 1. Fetch Faculties
        const { data: faculties } = await supabase.from('faculties').select('id, name');

        // 2. Fetch Logged Actions
        const { data: loggedActions, error: logError } = await supabase
          .from('logged_actions')
          .select('sector, affiliation_name, points, points_earned, user_id, notes, quantity, action_id');

        if (logError) throw logError;

        // --- Process Institutional (UBC Faculty) Standings ---
        const facultyMap: { [key: string]: { name: string; carbon: number; users: Set<string> } } = {};
        faculties?.forEach((f) => {
          facultyMap[f.name] = { name: f.name, carbon: 0, users: new Set() };
        });

        // --- Process Local (Vancouver Neighborhood) Standings ---
        const neighborhoodMap: { [key: string]: { name: string; carbon: number; users: Set<string> } } = {};
        VANCOUVER_NEIGHBOURHOODS.forEach((n) => {
          neighborhoodMap[n] = { name: n, carbon: 0, users: new Set() };
        });

        // --- Process BEST 301 Cohort Standings ---
        const best301UserMap: { [userId: string]: { carbon: number; handle: string } } = {};

        // Try to check current authenticated user metadata as a priority handle
        const { data: { user } } = await supabase.auth.getUser();
        const currentUserId = user?.id;
        const currentUserHandle = user?.user_metadata?.username || (user?.email ? user.email.split('@')[0] : null);

        loggedActions?.forEach((act) => {
          const qty = Number(act.quantity || 1);
          const registryMatch = ACTION_REGISTRY.find((a) => a.id === act.action_id);
          
          let baseImpact = Number(registryMatch?.impactValue ?? 0.5);

          // Distance-aware calculation matching log-action ledger precisely
          if (["active-transit", "public-transit", "ev-rideshare", "carpool-fossil"].includes(act.action_id)) {
            const distMatch = act.notes?.match(/Distance:\s*([\d.]+)\s*km/);
            const dist = distMatch ? parseFloat(distMatch[1]) : 5; // default fallback

            if (act.action_id === "active-transit") baseImpact = dist * 0.25;
            else if (act.action_id === "public-transit") baseImpact = dist * 0.18;
            else if (act.action_id === "ev-rideshare") baseImpact = dist * 0.32;
            else if (act.action_id === "carpool-fossil") baseImpact = dist * 0.15;
          }

          const carbonOffset = baseImpact * qty;

          // Check if it belongs to faculty
          const matchedFaculty = Object.keys(facultyMap).find((facName) =>
            act.affiliation_name?.includes(facName) || act.notes?.includes(facName)
          );
          if (matchedFaculty && (act.sector === 'campus' || !act.sector)) {
            facultyMap[matchedFaculty].carbon += carbonOffset;
            if (act.user_id) facultyMap[matchedFaculty].users.add(act.user_id);
          }

          // Check if it belongs to neighborhood (Local)
          const matchedNeighborhood = Object.keys(neighborhoodMap).find((nName) =>
            act.affiliation_name?.includes(nName) || act.notes?.includes(nName)
          );
          if (matchedNeighborhood && (act.sector === 'community' || act.sector === 'public' || !act.sector)) {
            neighborhoodMap[matchedNeighborhood].carbon += carbonOffset;
            if (act.user_id) neighborhoodMap[matchedNeighborhood].users.add(act.user_id);
          }

          // Check if it belongs to BEST 301 Cohort
          if (act.notes?.includes("BEST 301")) {
            if (act.user_id) {
              if (!best301UserMap[act.user_id]) {
                const handle = (act.user_id === currentUserId && currentUserHandle) 
                  ? currentUserHandle 
                  : `User_${act.user_id.slice(0, 6)}`;

                best301UserMap[act.user_id] = {
                  carbon: 0,
                  handle: handle,
                };
              }
              best301UserMap[act.user_id].carbon += carbonOffset;
            }
          }
        });

        const computedInstitutional: LeaderboardEntry[] = Object.values(facultyMap)
          .map((f) => ({
            rank: 0,
            name: f.name,
            category: 'UBC Faculty',
            participants: f.users.size,
            carbonOffsetKg: Math.round(f.carbon * 10) / 10,
          }))
          .sort((a, b) => b.carbonOffsetKg - a.carbonOffsetKg)
          .map((item, idx) => ({ ...item, rank: idx + 1 }));

        const computedLocal: LeaderboardEntry[] = Object.values(neighborhoodMap)
          .map((n) => ({
            rank: 0,
            name: n.name,
            category: 'Vancouver Hub',
            participants: n.users.size,
            carbonOffsetKg: Math.round(n.carbon * 10) / 10,
          }))
          .sort((a, b) => b.carbonOffsetKg - a.carbonOffsetKg)
          .map((item, idx) => ({ ...item, rank: idx + 1 }));

        const computedBest301: LeaderboardEntry[] = Object.entries(best301UserMap)
          .map(([userId, data]) => ({
            rank: 0,
            name: data.handle,
            category: 'BEST 301 Student',
            participants: 1,
            carbonOffsetKg: Math.round(data.carbon * 10) / 10,
          }))
          .sort((a, b) => b.carbonOffsetKg - a.carbonOffsetKg)
          .map((item, idx) => ({ ...item, rank: idx + 1 }));

        setInstitutionalStandings(computedInstitutional);
        setLocalStandings(computedLocal);
        setBest301Standings(computedBest301);
      } catch (err) {
        console.error('Error fetching live standings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStandings();
  }, [supabase]);

  const currentStandings = boardTier === "institutional" ? institutionalStandings : boardTier === "local" ? localStandings : best301Standings;
  const totalCarbon = currentStandings.reduce((acc, curr) => acc + curr.carbonOffsetKg, 0);
  const totalParticipants = boardTier === "best301" ? currentStandings.length : currentStandings.reduce((acc, curr) => acc + curr.participants, 0);

  return (
    <main className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-24 font-sans">
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
              Leaderboards &amp; Challenges · Regional &amp; Institutional
            </p>
            <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.14em]">
              <Link href="/" className="text-[#526760] hover:text-[#102f26]">
                ← Back to Home
              </Link>
              <Link href="/log-action" className="text-[#526760] hover:text-[#102f26]">
                Log Eco-Action →
              </Link>
            </div>
          </div>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Community &amp; Institutional Leaderboards
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Track real-time carbon diversion across local Vancouver neighborhood hubs, university faculties, and course cohorts.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="mb-12 p-6 border border-[#102f26]/15 bg-[#f1f6f2] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
                Leaderboard Tier
              </span>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <button
                  onClick={() => setBoardTier("institutional")}
                  className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                    boardTier === "institutional"
                      ? "bg-[#102f26] text-white shadow-sm"
                      : "bg-white border border-[#102f26]/20 text-[#102f26] hover:bg-[#f9f8f6]"
                  }`}
                >
                  Institutional (UBC Faculty)
                </button>
                <button
                  onClick={() => setBoardTier("local")}
                  className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                    boardTier === "local"
                      ? "bg-[#102f26] text-white shadow-sm"
                      : "bg-white border border-[#102f26]/20 text-[#102f26] hover:bg-[#f9f8f6]"
                  }`}
                >
                  Local (Vancouver Hubs)
                </button>
                <button
                  onClick={() => setBoardTier("best301")}
                  className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                    boardTier === "best301"
                      ? "bg-[#102f26] text-white shadow-sm"
                      : "bg-white border border-[#102f26]/20 text-[#102f26] hover:bg-[#f9f8f6]"
                  }`}
                >
                  BEST 301 Individual Standings
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                activeTab === "leaderboard" ? "bg-[#102f26] text-white" : "bg-white border border-[#102f26]/20 text-[#102f26]"
              }`}
            >
              Rankings
            </button>
            <button
              onClick={() => setActiveTab("guidelines")}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                activeTab === "guidelines" ? "bg-[#102f26] text-white" : "bg-white border border-[#102f26]/20 text-[#102f26]"
              }`}
            >
              Guidelines &amp; Rules
            </button>
          </div>
        </div>

        {activeTab === "leaderboard" ? (
          <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="border-b border-[#102f26]/15 pb-4 mb-6 flex justify-between items-center">
                <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#102f26]">
                  {boardTier === "institutional" 
                    ? "Faculty Standings (Supabase Live)" 
                    : boardTier === "local" 
                    ? "Regional Vancouver Neighborhood Standings (Live)" 
                    : "BEST 301 Student Leaderboard (Live)"}
                </h2>
                <span className="font-mono text-[10px] text-[#39705d]">
                  Synced via Database
                </span>
              </div>

              {loading ? (
                <div className="p-12 border border-[#102f26]/15 bg-[#f1f6f2] text-center font-mono text-xs text-[#526760] uppercase tracking-wider shadow-sm">
                  Querying live ledgers...
                </div>
              ) : currentStandings.length > 0 ? (
                <div className="space-y-4">
                  {currentStandings.map((entry) => (
                    <div
                      key={entry.name}
                      className="p-6 border border-[#102f26]/15 bg-white transition hover:border-[#102f26] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-lg font-bold text-[#39705d] w-6">
                          {entry.rank < 10 ? `0${entry.rank}` : entry.rank}
                        </span>
                        <div>
                          <h3 className="text-lg font-medium tracking-tight text-[#102f26]">
                            {boardTier === "best301" ? `@${entry.name}` : entry.name}
                          </h3>
                          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#526760] mt-0.5">
                            {entry.category}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="font-mono text-xl font-medium text-[#102f26] block">
                          {entry.carbonOffsetKg.toLocaleString()} kg
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#71847d]">
                          CO₂ Equivalent Offset
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 border border-dashed border-[#102f26]/20 text-center font-mono text-xs text-[#526760] uppercase tracking-wider bg-white">
                  No submissions logged yet. Be the first to log an action!
                </div>
              )}
            </div>

            <div>
              <div className="border-b border-[#102f26]/15 pb-4 mb-6">
                <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#102f26]">
                  {boardTier === "institutional" ? "Institutional Impact Summary" : boardTier === "local" ? "Regional Impact Summary" : "Cohort Participant Summary"}
                </h2>
              </div>

              <div className="space-y-6 text-xs text-[#526760]">
                <div className="p-6 border border-[#102f26]/15 bg-white shadow-sm">
                  <span className="font-mono text-[10px] text-[#39705d] block mb-1">Total Carbon Mitigated</span>
                  <p className="font-medium text-[#102f26] text-2xl mb-1">
                    {totalCarbon.toLocaleString()} kg
                  </p>
                  <p className="text-[#71847d]">
                    Aggregated directly from verified participant action submissions.
                  </p>
                </div>

                <div className="p-6 border border-[#102f26]/15 bg-white shadow-sm">
                  <span className="font-mono text-[10px] text-[#39705d] block mb-1">Active Competitors</span>
                  <p className="font-medium text-[#102f26] text-2xl mb-1">
                    {totalParticipants} Competitor{totalParticipants === 1 ? '' : 's'}
                  </p>
                  <p className="text-[#71847d]">
                    Unique usernames contributing to this leaderboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="p-8 border border-[#102f26]/15 bg-white shadow-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-2">
                Competition Rules &amp; Framework
              </span>
              <h2 className="text-2xl font-medium text-[#102f26] mb-4">
                Sustainability Challenge Guidelines
              </h2>
              <p className="text-sm text-[#526760] leading-relaxed">
                Green Collective&apos;s leaderboard system quantifies grassroots environmental action across institutional departments, Vancouver neighborhoods, and individual student handles for course cohorts like BEST 301.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
