'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface LeaderboardEntry {
  id: string;
  full_name: string;
  total_points: number;
  cohort: string;
}

export default function ClassPilotPage() {
  const [cohort, setCohort] = useState('BEST 301 - W1 - 2026'); // Set to your actual course code
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [logging, setLogging] = useState(false);
  const [loggedSuccess, setLoggedSuccess] = useState(false);
  const supabase = createClient();

  // Fetch Cohort Leaderboard
  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, total_points, cohort')
      .eq('cohort', cohort)
      .order('total_points', { ascending: false })
      .limit(10);

    if (!error && data) {
      setLeaderboard(data as LeaderboardEntry[]);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [cohort]);

  // Quick 1-Tap Log for the Demo
  const handleQuickLog = async (actionName: string, points: number) => {
    setLogging(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Please sign in or complete quick onboarding first!');
      setLogging(false);
      return;
    }

    // Insert logged action
    const { error: logError } = await supabase.from('logged_actions').insert({
      user_id: user.id,
      action_name: actionName,
      points_earned: points,
      created_at: new Date().toISOString(),
    });

    if (!logError) {
      // Refresh leaderboard after point addition
      setLoggedSuccess(true);
      await fetchLeaderboard();
      setTimeout(() => setLoggedSuccess(false), 3000);
    }
    setLogging(false);
  };

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-20 font-sans">
      {/* Header Banner */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2] px-6 py-12 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d] font-semibold">
          Live Campus Competition Pilot
        </span>
        <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl text-[#102f26]">
          {cohort} Climate Challenge
        </h1>
        <p className="mt-3 text-sm text-[#526760] max-w-md mx-auto">
          Log daily eco-actions, earn points, and climb the live class standings during this pilot.
        </p>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-10 space-y-12">
        {/* 1-Tap Rapid Action Logger */}
        <section className="border border-[#102f26]/15 bg-[#f9f8f6] p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[#39705d] font-semibold">
              ⚡ Live Action Logging (1-Tap)
            </h2>
            {loggedSuccess && (
              <span className="font-mono text-xs text-[#39705d] font-semibold animate-pulse">
                ✓ Points Logged!
              </span>
            )}
          </div>
          <p className="text-xs text-[#526760]">
            Tap an action you completed today to instantly add points to your score and class rank.
          </p>

          <div className="grid gap-3 sm:grid-cols-3 pt-2">
            <button
              disabled={logging}
              onClick={() => handleQuickLog('Sustainable Transit Commute', 150)}
              className="border border-[#102f26]/20 bg-white p-4 text-left hover:border-[#102f26] transition-all hover:shadow-sm"
            >
              <div className="text-xl mb-1">🚲</div>
              <div className="text-xs font-semibold text-[#102f26]">Sustainable Commute</div>
              <div className="font-mono text-[10px] text-[#39705d] mt-1">+150 PTS</div>
            </button>

            <button
              disabled={logging}
              onClick={() => handleQuickLog('Reusable Container / Mug', 75)}
              className="border border-[#102f26]/20 bg-white p-4 text-left hover:border-[#102f26] transition-all hover:shadow-sm"
            >
              <div className="text-xl mb-1">☕</div>
              <div className="text-xs font-semibold text-[#102f26]">Zero-Waste Container</div>
              <div className="font-mono text-[10px] text-[#39705d] mt-1">+75 PTS</div>
            </button>

            <button
              disabled={logging}
              onClick={() => handleQuickLog('Plant-Based Meal Choice', 100)}
              className="border border-[#102f26]/20 bg-white p-4 text-left hover:border-[#102f26] transition-all hover:shadow-sm"
            >
              <div className="text-xl mb-1">🥗</div>
              <div className="text-xs font-semibold text-[#102f26]">Plant-Based Lunch</div>
              <div className="font-mono text-[10px] text-[#39705d] mt-1">+100 PTS</div>
            </button>
          </div>
        </section>

        {/* Live Cohort Leaderboard */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#102f26]/10 pb-4">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[#102f26] font-semibold">
              🏆 Live Class Standings ({cohort})
            </h2>
            <button
              onClick={fetchLeaderboard}
              className="font-mono text-[10px] uppercase tracking-wider text-[#39705d] hover:underline"
            >
              ↻ Refresh
            </button>
          </div>

          <div className="border border-[#102f26]/15 bg-white divide-y divide-[#102f26]/10">
            {leaderboard.length === 0 ? (
              <div className="p-8 text-center font-mono text-xs text-[#526760]">
                No entries yet for {cohort}. Be the first to log an action!
              </div>
            ) : (
              leaderboard.map((student, rank) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 hover:bg-[#f9f8f6] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-[#39705d] font-bold w-6">
                      #{rank + 1}
                    </span>
                    <span className="text-sm font-medium text-[#102f26]">
                      {student.full_name || 'Anonymous Student'}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-bold text-[#102f26]">
                    {student.total_points || 0} <span className="text-[10px] text-[#526760] font-normal">PTS</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
