"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface LeaderboardEntry {
  rank: number;
  name: string;
  category: string;
  participants: number;
  carbonOffsetKg: number;
}

export default function CompetitionPage() {
  const [boardTier, setBoardTier] = useState<"institutional" | "local">("institutional");
  const [activeTab, setActiveTab] = useState<"leaderboard" | "guidelines">("leaderboard");
  const [institutionalStandings, setInstitutionalStandings] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

  // Clean local regional hubs with zeroed initial metrics, ready for live data or submissions
  const localStandings: LeaderboardEntry[] = [
    { rank: 1, name: 'Kitsilano Community Hub', category: 'Vancouver West', participants: 0, carbonOffsetKg: 0 },
    { rank: 2, name: 'Point Grey & Campus Perimeter', category: 'Vancouver West', participants: 0, carbonOffsetKg: 0 },
    { rank: 3, name: 'Mount Pleasant Eco-Network', category: 'Vancouver East', participants: 0, carbonOffsetKg: 0 },
    { rank: 4, name: 'Downtown Core Collective', category: 'Central Vancouver', participants: 0, carbonOffsetKg: 0 },
    { rank: 5, name: 'Grandview-Woodland', category: 'Vancouver East', participants: 0, carbonOffsetKg: 0 },
  ];

  useEffect(() => {
    const fetchLiveStandings = async () => {
      try {
        const { data: faculties, error: facultyError } = await supabase
          .from('faculties')
          .select('id, name');

        if (facultyError) throw facultyError;

        const { data: submissions, error: subError } = await supabase
          .from('submissions')
          .select('faculty_id, quantity, user_id, eco_action_id');

        if (subError) throw subError;

        const facultyMap: { [key: string]: { name: string; points: number; users: Set<string> } } = {};

        faculties?.forEach((f) => {
          facultyMap[f.id] = { name: f.name, points: 0, users: new Set() };
        });

        const pointValues: { [key: string]: number } = {
          'ubc-forestry-field': 50,
          'sustainable-commute-ubc': 25,
          'home-meal': 30,
          'home-beverage': 25,
          'reusable-container-buy': 15,
          'refillable-water': 20,
          'plant-based-meal': 20,
          'waste-sorting': 10,
          'thrift-borrow-gear': 30,
          'campus-cleanup': 50,
        };

        submissions?.forEach((sub) => {
          if (facultyMap[sub.faculty_id]) {
            const pts = (pointValues[sub.eco_action_id] || 20) * (sub.quantity || 1);
            facultyMap[sub.faculty_id].points += pts;
            if (sub.user_id) {
              facultyMap[sub.faculty_id].users.add(sub.user_id);
            }
          }
        });

        const computedStandings: LeaderboardEntry[] = Object.values(facultyMap)
          .map((f) => ({
            rank: 0,
            name: f.name,
            category: 'UBC Faculty',
            participants: f.users.size,
            carbonOffsetKg: Math.round(f.points * 3.5),
          }))
          .sort((a, b) => b.carbonOffsetKg - a.carbonOffsetKg)
          .map((item, idx) => ({ ...item, rank: idx + 1 }));

        setInstitutionalStandings(computedStandings);
      } catch (err) {
        console.error('Error fetching live standings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStandings();
  }, [supabase]);

  const currentStandings = boardTier === "institutional" ? institutionalStandings : localStandings;
  const totalCarbon = currentStandings.reduce((acc, curr) => acc + curr.carbonOffsetKg, 0);
  const totalParticipants = currentStandings.reduce((acc, curr) => acc + curr.participants, 0);

  return (
    <main className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-24 font-sans">
      {/* Editorial Page Header */}
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
              <Link href="/habits" className="text-[#526760] hover:text-[#102f26]">
                Log Eco-Action →
              </Link>
            </div>
          </div>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Community &amp; Institutional Leaderboards
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Track real-time carbon diversion across local Vancouver neighborhood hubs and university faculties.
          </p>
        </div>
      </section>

      {/* Main Content Hub */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        {/* Tier & Sub-Tab Control Bar */}
        <div className="mb-12 p-6 border border-[#102f26]/15 bg-[#f1f6f2] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
                Leaderboard Tier
              </span>
              <div className="flex items-center gap-2 mt-2">
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
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                activeTab === "leaderboard"
                  ? "bg-[#102f26] text-white"
                  : "bg-white border border-[#102f26]/20 text-[#102f26]"
              }`}
            >
              Rankings
            </button>
            <button
              onClick={() => setActiveTab("guidelines")}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                activeTab === "guidelines"
                  ? "bg-[#102f26] text-white"
                  : "bg-white border border-[#102f26]/20 text-[#102f26]"
              }`}
            >
              Guidelines &amp; Rules
            </button>
          </div>
        </div>

        {activeTab === "leaderboard" ? (
          <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Leaderboard Table Feed */}
            <div>
              <div className="border-b border-[#102f26]/15 pb-4 mb-6 flex justify-between items-center">
                <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#102f26]">
                  {boardTier === "institutional" ? "Faculty Standings (Supabase Live)" : "Regional Vancouver Neighborhood Standings"}
                </h2>
                <span className="font-mono text-[10px] text-[#39705d]">
                  {boardTier === "institutional" ? "Synced via Database" : "Awaiting Initial Submissions"}
                </span>
              </div>

              {loading && boardTier === "institutional" ? (
                <div className="p-12 border border-[#102f26]/15 bg-[#f1f6f2] text-center font-mono text-xs text-[#526760] uppercase tracking-wider shadow-sm">
                  Querying live institutional ledgers...
                </div>
              ) : currentStandings.length > 0 ? (
                <div className="space-y-4">
                  {currentStandings.map((entry) => (
                    <div
                      key={entry.rank}
                      className="p-6 border border-[#102f26]/15 bg-white transition hover:border-[#102f26] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-lg font-bold text-[#39705d] w-6">
                          0{entry.rank}
                        </span>
                        <div>
                          <h3 className="text-lg font-medium tracking-tight text-[#102f26]">
                            {entry.name}
                          </h3>
                          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#526760] mt-0.5">
                            {entry.category} · {entry.participants} Active Contributor{entry.participants === 1 ? '' : 's'}
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

              <div className="mt-8 p-6 border border-dashed border-[#102f26]/30 bg-[#f1f6f2]">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
                  Contribute to Your Standing
                </span>
                <p className="text-xs text-[#526760] mb-4">
                  Log your daily transit choices, zero-waste dining, and conservation efforts to push your faculty or neighborhood up the live standings.
                </p>
                <Link
                  href="/habits"
                  className="inline-flex items-center gap-2 bg-[#102f26] text-white px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em]"
                >
                  Log Action to Personal Ledger →
                </Link>
              </div>
            </div>

            {/* Challenge Statistics Sidebar */}
            <div>
              <div className="border-b border-[#102f26]/15 pb-4 mb-6">
                <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#102f26]">
                  {boardTier === "institutional" ? "Institutional Impact Summary" : "Regional Impact Summary"}
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
                  <span className="font-mono text-[10px] text-[#39705d] block mb-1">Active Participation</span>
                  <p className="font-medium text-[#102f26] text-2xl mb-1">
                    {totalParticipants} Participant{totalParticipants === 1 ? '' : 's'}
                  </p>
                  <p className="text-[#71847d]">
                    Unique contributors across active tiers.
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
              <div className="space-y-4 text-sm text-[#526760] leading-relaxed">
                <p>
                  Green Collective&apos;s dual-tier leaderboard system quantifies and compares grassroots environmental action across both institutional departments (such as UBC faculties) and municipal regional hubs (such as Vancouver neighborhoods).
                </p>
                <p>
                  <strong>Eligibility:</strong> Participants may align their actions with their university faculty, workplace organization, or local neighborhood residential zone.
                </p>
                <p>
                  <strong>Verification &amp; Calculation:</strong> Actions logged through the personal ledger are verified against standardized carbon-intensity coefficients for modal transit shift, energy conservation, and ecological actions.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
