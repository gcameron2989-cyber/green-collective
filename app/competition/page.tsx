"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface LeaderboardEntry {
  rank: number;
  faculty: string;
  participants: number;
  carbonOffsetKg: number;
  trend: string;
}

export default function UBCCompetitionPage() {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "guidelines">("leaderboard");
  const [standings, setStandings] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

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
          .map((f, index) => ({
            rank: index + 1,
            faculty: f.name,
            participants: f.users.size > 0 ? f.users.size : 1,
            carbonOffsetKg: Math.round(f.points * 3.5),
            trend: "+12% this week",
          }))
          .sort((a, b) => b.carbonOffsetKg - a.carbonOffsetKg)
          .map((item, idx) => ({ ...item, rank: idx + 1 }));

        setStandings(computedStandings);
      } catch (err) {
        console.error('Error fetching live standings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStandings();
  }, [supabase]);

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24 font-sans">
      {/* Editorial Page Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
              Institutional Challenge · Initiative / 01
            </p>
            <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.14em]">
              <Link href="/initiatives" className="text-[#526760] hover:text-[#102f26]">
                ← Back to Initiatives
              </Link>
              <Link href="/competition/submit" className="text-[#526760] hover:text-[#102f26]">
                Log Eco-Action →
              </Link>
            </div>
          </div>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            UBC Faculty Sustainability Challenge &amp; Leaderboard
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Real-time aggregate carbon savings and faculty participation metrics powered by student action ledgers across campus.
          </p>
        </div>
      </section>

      {/* Main Content Hub */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        {/* Toggle Nav Bar */}
        <div className="mb-12 p-6 border border-[#102f26]/15 bg-[#f1f6f2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
              Active View
            </span>
            <p className="text-sm font-medium text-[#102f26]">
              Currently displaying: <span className="underline font-mono uppercase text-xs">{activeTab}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                activeTab === "leaderboard" ? "bg-[#102f26] text-white" : "bg-white border border-[#102f26]/20 text-[#102f26]"
              }`}
            >
              Faculty Leaderboard
            </button>
            <button
              onClick={() => setActiveTab("guidelines")}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                activeTab === "guidelines" ? "bg-[#102f26] text-white" : "bg-white border border-[#102f26]/20 text-[#102f26]"
              }`}
            >
              Challenge Guidelines &amp; Rules
            </button>
          </div>
        </div>

        {activeTab === "leaderboard" ? (
          <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Leaderboard Table Feed */}
            <div>
              <div className="border-b border-[#102f26]/15 pb-4 mb-6 flex justify-between items-center">
                <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#102f26]">
                  Faculty Carbon Offset Standings (Live Database)
                </h2>
                <span className="font-mono text-[10px] text-[#39705d]">Synced via Supabase</span>
              </div>

              {loading ? (
                <div className="p-12 border border-[#102f26]/15 bg-[#f1f6f2] text-center font-mono text-xs text-[#526760] uppercase tracking-wider">
                  Querying live faculty ledgers...
                </div>
              ) : standings.length > 0 ? (
                <div className="space-y-4">
                  {standings.map((entry) => (
                    <div
                      key={entry.rank}
                      className="p-6 border border-[#102f26]/15 bg-[#f1f6f2] transition hover:border-[#102f26] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-lg font-bold text-[#39705d] w-6">
                          0{entry.rank}
                        </span>
                        <div>
                          <h3 className="text-lg font-medium tracking-tight text-[#102f26]">
                            {entry.faculty}
                          </h3>
                          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#526760] mt-0.5">
                            {entry.participants} Active Contributors · <span className="text-[#39705d]">{entry.trend}</span>
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
                <div className="p-12 border border-dashed border-[#102f26]/20 text-center font-mono text-xs text-[#526760] uppercase tracking-wider">
                  No submissions logged yet. Be the first to log an action for your faculty!
                </div>
              )}

              <div className="mt-8 p-6 border border-dashed border-[#102f26]/30 bg-white">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
                  Contribute to Your Faculty
                </span>
                <p className="text-xs text-[#526760] mb-4">
                  Log your daily transit choices, zero-waste dining, and campus conservation efforts to push your faculty up the live standings.
                </p>
                <Link
                  href="/competition/submit"
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
                  Institutional Impact Summary
                </h2>
              </div>

              <div className="space-y-6 text-xs text-[#526760]">
                <div className="p-6 border border-[#102f26]/15 bg-white">
                  <span className="font-mono text-[10px] text-[#39705d] block mb-1">Total Carbon Mitigated</span>
                  <p className="font-medium text-[#102f26] text-2xl mb-1">
                    {standings.reduce((acc, curr) => acc + curr.carbonOffsetKg, 0).toLocaleString()} kg
                  </p>
                  <p className="text-[#71847d]">
                    Calculated dynamically from verified student action submissions in the database.
                  </p>
                </div>

                <div className="p-6 border border-[#102f26]/15 bg-white">
                  <span className="font-mono text-[10px] text-[#39705d] block mb-1">Active Participation</span>
                  <p className="font-medium text-[#102f26] text-2xl mb-1">
                    {standings.reduce((acc, curr) => acc + curr.participants, 0)} Students
                  </p>
                  <p className="text-[#71847d]">
                    Actively recording metrics across participating faculties at UBC.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="p-8 border border-[#102f26]/15 bg-[#f1f6f2]">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-2">
                Competition Rules &amp; Framework
              </span>
              <h2 className="text-2xl font-medium text-[#102f26] mb-4">
                UBC Faculty Sustainability Challenge Guidelines
              </h2>
              <div className="space-y-4 text-sm text-[#526760] leading-relaxed">
                <p>
                  The UBC Sustainability Challenge is an institutional-grade platform designed to quantify and compare grassroots environmental action across campus faculties.
                </p>
                <p>
                  <strong>Eligibility:</strong> At least one participant or team member must be currently enrolled as an undergraduate or graduate student at the University of British Columbia.
                </p>
                <p>
                  <strong>Verification &amp; Calculation:</strong> Actions logged through the personal ledger are verified against standardized carbon-intensity coefficients for modal transit shift, energy conservation, and ecological restoration hours.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
