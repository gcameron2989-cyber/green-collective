"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface UserRank {
  user_id: string;
  institution: string;
  total_co2_saved: number;
  total_actions: number;
}

interface OrgRank {
  institution: string;
  member_count: number;
  total_co2_saved: number;
  total_actions: number;
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"orgs" | "users">("orgs");
  const [orgRanks, setOrgRanks] = useState<OrgRank[]>([]);
  const [userRanks, setUserRanks] = useState<UserRank[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchLeaderboards = async () => {
      setLoading(true);

      const { data: orgData } = await supabase
        .from("organization_leaderboard")
        .select("*")
        .order("total_co2_saved", { ascending: false });

      const { data: userData } = await supabase
        .from("user_leaderboard")
        .select("*")
        .order("total_co2_saved", { ascending: false })
        .limit(50);

      if (orgData) setOrgRanks(orgData);
      if (userData) setUserRanks(userData);
      setLoading(false);
    };

    fetchLeaderboards();
  }, []);

  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-xs font-semibold px-3 py-1.5 bg-emerald-100 text-[#0f382c] rounded-full hover:bg-emerald-200 transition">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 z-10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full border border-emerald-200">
            🏆 Community Impact
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Global Sustainability Rankings</h1>
          <p className="text-xs text-muted-foreground">
            Tracking collective verified carbon reduction across institutions and members worldwide.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center border-b border-emerald-900/10 pb-4 gap-4">
          <button
            onClick={() => setTab("orgs")}
            className={`px-4 py-2 text-xs font-bold rounded-full transition ${
              tab === "orgs"
                ? "bg-[#0f382c] text-white shadow-md"
                : "bg-background border border-emerald-900/10 text-muted-foreground hover:bg-emerald-100/50"
            }`}
          >
            🏢 Top Organizations
          </button>
          <button
            onClick={() => setTab("users")}
            className={`px-4 py-2 text-xs font-bold rounded-full transition ${
              tab === "users"
                ? "bg-[#0f382c] text-white shadow-md"
                : "bg-background border border-emerald-900/10 text-muted-foreground hover:bg-emerald-100/50"
            }`}
          >
            🌱 Individual Contributors
          </button>
        </div>

        {/* Rankings Table */}
        <div className="border border-emerald-900/10 rounded-2xl bg-card/90 backdrop-blur p-6 shadow-xl">
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground font-semibold">
              Calculating rankings...
            </div>
          ) : tab === "orgs" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-emerald-900/10 text-emerald-900">
                    <th className="py-3 px-4 font-bold">Rank</th>
                    <th className="py-3 px-4 font-bold">Organization</th>
                    <th className="py-3 px-4 font-bold text-center">Active Members</th>
                    <th className="py-3 px-4 font-bold text-center">Total Actions</th>
                    <th className="py-3 px-4 font-bold text-right">CO₂ Offset</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/5">
                  {orgRanks.map((org, index) => (
                    <tr key={org.institution} className="hover:bg-emerald-50/50 transition">
                      <td className="py-3.5 px-4 font-extrabold text-[#0f382c]">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {org.institution || "Independent Members"}
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-muted-foreground">
                        {org.member_count}
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-muted-foreground">
                        {org.total_actions}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-800">
                        {Number(org.total_co2_saved).toFixed(1)} kg
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
                  <tr className="border-b border-emerald-900/10 text-emerald-900">
                    <th className="py-3 px-4 font-bold">Rank</th>
                    <th className="py-3 px-4 font-bold">Member ID</th>
                    <th className="py-3 px-4 font-bold">Organization</th>
                    <th className="py-3 px-4 font-bold text-center">Actions Logged</th>
                    <th className="py-3 px-4 font-bold text-right">CO₂ Offset</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/5">
                  {userRanks.map((user, index) => (
                    <tr key={user.user_id} className="hover:bg-emerald-50/50 transition">
                      <td className="py-3.5 px-4 font-extrabold text-[#0f382c]">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                        Member #{user.user_id.substring(0, 6)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {user.institution || "Independent"}
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-muted-foreground">
                        {user.total_actions}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-800">
                        {Number(user.total_co2_saved).toFixed(1)} kg
                      </td>
                    </tr>
                  ))}
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
