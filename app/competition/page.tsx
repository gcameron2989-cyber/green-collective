"use client";

import { useState } from 'react';
import Link from 'next/link';

interface LeaderboardEntry {
  rank: number;
  faculty: string;
  participants: number;
  carbonOffsetKg: number;
  trend: string;
}

const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    faculty: "Faculty of Forestry (BioEconomy Sciences & Technology)",
    participants: 412,
    carbonOffsetKg: 14250,
    trend: "+18% this month",
  },
  {
    rank: 2,
    faculty: "Faculty of Applied Science (Engineering)",
    participants: 680,
    carbonOffsetKg: 12900,
    trend: "+12% this month",
  },
  {
    rank: 3,
    faculty: "Sauder School of Business",
    participants: 530,
    carbonOffsetKg: 9840,
    trend: "+8% this month",
  },
  {
    rank: 4,
    faculty: "Faculty of Science",
    participants: 890,
    carbonOffsetKg: 9120,
    trend: "+15% this month",
  },
  {
    rank: 5,
    faculty: "Faculty of Arts",
    participants: 610,
    carbonOffsetKg: 7450,
    trend: "+5% this month",
  },
];

export default function UBCCompetitionPage() {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "guidelines">("leaderboard");

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24">
      {/* Editorial Page Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
              Institutional Challenge · Initiative / 01
            </p>
            <Link
              href="/initiatives"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#526760] hover:text-[#102f26]"
            >
              ← Back to Initiatives
            </Link>
          </div>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            UBC Faculty Sustainability Challenge &amp; Leaderboard
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Measure aggregate campus carbon savings, track faculty-wide participation metrics, and compete to drive institutional sustainability forward.
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
                  Faculty Carbon Offset Standings
                </h2>
                <span className="font-mono text-[10px] text-[#39705d]">Updated Real-Time</span>
              </div>

              <div className="space-y-4">
                {leaderboardData.map((entry) => (
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
                          {entry.participants} Active Participants · <span className="text-[#39705d]">{entry.trend}</span>
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

              <div className="mt-8 p-6 border border-dashed border-[#102f26]/30 bg-white">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
                  Contribute to Your Faculty
                </span>
                <p className="text-xs text-[#526760] mb-4">
                  Log your daily transit choices, energy reductions, and community conservation hours to push your faculty up the standings.
                </p>
                <Link
                  href="/habits"
                  className="inline-flex items-center gap-2 bg-[#102f26] text-white px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em]"
                >
                  Log Action to Personal Ledger →
                </Link>
              </div>
            </div>

            {/* Challenge Statistics & Context Sidebar */}
            <div>
              <div className="border-b border-[#102f26]/15 pb-4 mb-6">
                <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#102f26]">
                  Aggregate Campus Impact
                </h2>
              </div>

              <div className="space-y-6 text-xs text-[#526760]">
                <div className="p-6 border border-[#102f26]/15 bg-white">
                  <span className="font-mono text-[10px] text-[#39705d] block mb-1">Total Carbon Mitigated</span>
                  <p className="font-medium text-[#102f26] text-2xl mb-1">
                    53,560 kg
                  </p>
                  <p className="text-[#71847d]">
                    Equivalent to removing 11.6 standard passenger vehicles from the road for an entire year.
                  </p>
                </div>

                <div className="p-6 border border-[#102f26]/15 bg-white">
                  <span className="font-mono text-[10px] text-[#39705d] block mb-1">Active Community Engagement</span>
                  <p className="font-medium text-[#102f26] text-2xl mb-1">
                    3,142 Students
                  </p>
                  <p className="text-[#71847d]">
                    Actively recording metrics across 12 participating faculties and colleges at UBC Vancouver.
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
                <p>
                  <strong>Institutional Impact:</strong> Aggregate faculty savings are compiled into quarterly sustainability briefing reports shared with UBC Campus &amp; Community Planning.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
