"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [email, setEmail] = useState<string>("");
  const [institution, setInstitution] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setEmail(user.email || "");
      setInstitution(user.user_metadata?.institution || "Independent Member");
      setLoading(false);
    }
    loadUserData();
  }, [router, supabase]);

  const handleExportCSV = async () => {
    const { data } = await supabase.from("user_habits").select("*");
    if (!data || data.length === 0) {
      alert("No habit data to export.");
      return;
    }
    const headers = "ID,Habit,Category,CO2_Saved_KG,Completed_At\n";
    const rows = data.map((r) => `"${r.id}","${r.title}","${r.category}",${r.co2_saved_kg},"${r.completed_at}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "green_collective_impact_logs.csv";
    a.click();
  };

  if (loading) {
    return <div className="min-h-screen bg-emerald-950/5 flex items-center justify-center text-xs font-semibold text-emerald-900">Loading settings...</div>;
  }

  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block" />
          Green Collective
        </Link>
        <Link href="/dashboard" className="text-xs font-semibold text-emerald-800 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 z-10 space-y-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-3 border border-emerald-200">
            ⚙️ Pillar 4: Profile Settings
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">User Profile & Data Export</h1>
        </div>

        <div className="border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Email Address</label>
            <div className="text-sm font-bold text-foreground">{email}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Institution / Organization</label>
            <div className="text-sm font-bold text-foreground">{institution}</div>
          </div>

          <div className="pt-4 border-t border-emerald-900/10 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-foreground">Export Data</h3>
              <p className="text-[11px] text-muted-foreground">Download your full history in CSV format.</p>
            </div>
            <button onClick={handleExportCSV} className="px-4 py-2 bg-[#0f382c] text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 transition">
              Download CSV
            </button>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  );
}
