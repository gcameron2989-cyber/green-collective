"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ACTION_REGISTRY } from "@/lib/actions";

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

interface StudentStanding {
  userId: string;
  username: string;
  totalPoints: number;
  carbonOffsetKg: number;
  actionsCount: number;
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"orgs" | "users">("orgs");
  const [orgRanks, setOrgRanks] = useState<OrgRank[]>([]);
  const [userRanks, setUserRanks] = useState<UserRank[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Drill-down state
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [orgMembers, setOrgMembers] = useState<StudentStanding[]>([]);
  const [loadingOrgMembers, setLoadingOrgMembers] = useState(false);

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
  }, [supabase]);

  // Fetch top contributors for a clicked organization/faculty
  const handleInspectOrg = async (orgName: string) => {
    setSelectedOrg(orgName);
    setLoadingOrgMembers(true);

    try {
      const { data: profiles } = await supabase.from("profiles").select("id, username");
      const usernameMap: { [id: string]: string } = {};
      profiles?.forEach((p) => {
        if (p.id && p.username) usernameMap[p.id] = p.username;
      });

      const { data: actions } = await supabase.from("logged_actions").select("*");

      const userImpactMap: { [userId: string]: { points: number; carbon: number; count: number } } = {};

      actions?.forEach((act) => {
        const matchesEntity =
          (act.affiliation_name && act.affiliation_name.toLowerCase().includes(orgName.toLowerCase())) ||
          (act.notes && act.notes.toLowerCase().includes(orgName.toLowerCase()));

        if (matchesEntity && act.user_id) {
          const qty = Number(act.quantity || 1);
          const registryMatch = ACTION_REGISTRY.find((a) => a.id === act.action_id);
          let baseImpact = Number(registryMatch?.impactValue ?? 0.5);
          const pointsEarned = Number(act.points_earned ?? act.points ?? (registryMatch?.points ? registryMatch.points * qty : 10));

          if (["active-transit", "public-transit", "ev-rideshare", "carpool-fossil"].includes(act.action_id)) {
            const distMatch = act.notes?.match(/Distance:\s*([\d.]+)\s*km/);
            const dist = distMatch ? parseFloat(distMatch[1]) : 5;

            if (act.action_id === "active-transit") baseImpact = dist * 0.25;
            else if (act.action_id === "public-transit") baseImpact = dist * 0.18;
            else if (act.action_id === "ev-rideshare") baseImpact = dist * 0.32;
            else if (act.action_id === "carpool-fossil") baseImpact = dist * 0.15;
          }

          const carbon = baseImpact * (["active-transit", "public-transit", "ev-rideshare", "carpool-fossil"].includes(act.action_id) ? 1 : qty);

          if (!userImpactMap[act.user_id]) {
            userImpactMap[act.user_id] = { points: 0, carbon: 0, count: 0 };
          }
          userImpactMap[act.user_id].points += pointsEarned;
          userImpactMap[act.user_id].carbon += carbon;
          userImpactMap[act.user_id].count += 1;
        }
      });

      const computedStandings: StudentStanding[] = Object.entries(userImpactMap)
        .map(([userId, data]) => ({
          userId,
          username: usernameMap[userId] || `Contributor_${userId.slice(0, 4)}`,
          totalPoints: data.points,
          carbonOffsetKg: Math.round(data.carbon * 10) / 10,
          actionsCount: data.count,
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints || b.carbonOffsetKg - a.carbonOffsetKg);

      setOrgMembers(computedStandings);
    } catch (err) {
      console.error("Error fetching org members:", err);
    } finally {
      setLoadingOrgMembers(false);
    }
  };

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
          <Link href="/profile" className="text-xs font-semibold px-3 py-1.5 bg-emerald-100 text-[#0f382c] rounded-full hover:bg-emerald-200 transition">
            Profile
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
            Tracking collective verified carbon reduction across institutions and members worldwide. Click any organization to inspect top member rankings.
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
                  {orgRanks.map((org, index) => {
                    const orgName = org.institution || "Independent Members";
                    return (
                      <tr key={orgName} className="hover:bg-emerald-50/50 transition">
                        <td className="py-3.5 px-4 font-extrabold text-[#0f382c]">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-foreground">
                          <button
                            type="button"
                            onClick={() => handleInspectOrg(orgName)}
                            className="hover:underline text-[#0f382c] font-bold flex items-center gap-1.5 group text-left cursor-pointer"
                          >
                            <span>{orgName}</span>
                            <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-mono group-hover:bg-[#0f382c] group-hover:text-white transition">
                              View Members →
                            </span>
                          </button>
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
                    );
                  })}
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
                        <Link href={`/profile/${user.user_id}`} className="hover:underline font-bold text-[#0f382c]">
                          Member #{user.user_id.substring(0, 6)}
                        </Link>
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

      {/* Organization Members Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-900/20 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto font-sans text-neutral-900">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Sub-Group Roster
                </span>
                <h3 className="text-lg font-bold mt-1">{selectedOrg}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrg(null)}
                className="text-gray-400 hover:text-black font-mono text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            {loadingOrgMembers ? (
              <div className="py-12 text-center text-xs font-mono text-neutral-500">
                Loading member standings...
              </div>
            ) : orgMembers.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-neutral-500 border border-dashed rounded-xl">
                No members have logged actions under this organization yet.
              </div>
            ) : (
              <div className="space-y-3">
                {orgMembers.map((member, idx) => (
                  <div
                    key={member.userId}
                    className="p-3 bg-neutral-50 border rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-emerald-800 w-5">#{idx + 1}</span>
                      <div>
                        <Link href={`/profile/${member.userId}`} className="font-bold hover:underline text-neutral-900">
                          @{member.username}
                        </Link>
                        <div className="text-[10px] font-mono text-neutral-500">
                          {member.actionsCount} actions logged
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                        ~{member.carbonOffsetKg} kg CO₂e
                      </span>
                      <span className="font-mono text-xs font-bold text-neutral-800 bg-neutral-200/60 px-2.5 py-1 rounded">
                        +{member.totalPoints} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  );
}
