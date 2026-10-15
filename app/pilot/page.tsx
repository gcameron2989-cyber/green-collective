'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';

interface LeaderboardEntry {
  id: string;
  full_name: string;
  total_points: number;
  cohort: string;
}

function PilotContent() {
  const searchParams = useSearchParams();
  const cohortParam = searchParams?.get('cohort');
  
  // Default cohort for BEST 301
  const defaultCohort = cohortParam || 'BEST-301-W2026';
  
  const [cohort] = useState(defaultCohort);
  const [displayName, setDisplayName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [logging, setLogging] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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

  // Handle Quick Onboarding
  const handleJoinPilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim().length > 0) {
      setIsNameSet(true);
    }
  };

  // Quick 1-Tap Action Logging
  const handleQuickLog = async (actionName: string, points: number) => {
    setLogging(true);
    setStatusMessage(null);

    const { data: { user } } = await supabase.auth.getUser();

    // Insert logged action into Supabase
    const { error: logError } = await supabase.from('logged_actions').insert({
      user_id: user?.id || null,
      action_name: actionName,
      points_earned: points,
      created_at: new Date().toISOString(),
    });

    if (logError) {
      if (logError.message.includes('cooldown') || logError.message.includes('too recently')) {
        setStatusMessage({
          text: '⏳ Cooldown Active: Action logged recently. Please wait before logging again.',
          type: 'error',
        });
      } else {
        setStatusMessage({ text: logError.message, type: 'error' });
      }
    } else {
      setStatusMessage({ text: `✓ Success! +${points} PTS added for ${cohort}`, type: 'success' });
      await fetchLeaderboard();
    }

    setLogging(false);
  };

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24 font-sans">
      {/* Header Banner */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2] px-6 py-12 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d] font-semibold">
          Live Campus Competition Pilot
        </span>
        <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl text-[#102f26]">
          {cohort} Climate Challenge
        </h1>
        <p className="mt-3 text-sm text-[#526760] max-w-md mx-auto">
          Log daily eco-actions in 1 tap, earn points for BEST 301, and watch real-time impact standings update live.
        </p>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-10 space-y-10">
        {/* Onboarding */}
        {!isNameSet ? (
          <section className="border border-[#102f26]/15 bg-[#f9f8f6] p-8 space-y-4 text-center">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[#39705d] font-semibold">
              Join The BEST 301 Pilot
            </h2>
            <p className="text-xs text-[#526760] max-w-sm mx-auto">
              Enter your name or an anonymous alias to start logging points on the live class leaderboard.
            </p>
            <form onSubmit={handleJoinPilot} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
              <input
                type="text"
                placeholder="Display Name (e.g. Alex or Anonymous)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 border border-[#102f26]/20 bg-white px-4 py-2.5 text-xs text-[#102f26] focus:outline-none focus:border-[#102f26]"
                required
              />
              <button
                type="submit"
                className="bg-[#102f26] px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-white hover:bg-[#1a4438] transition-colors"
              >
                Join Class →
              </button>
            </form>
          </section>
        ) : (
          /* 1-Tap Action Logger */
          <section className="border border-[#102f26]/15 bg-[#f9f8f6] p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-mono text-xs uppercase tracking-wider text-[#39705d] font-semibold">
                  ⚡ Log Impact ({displayName})
                </h2>
                <p className="text-[11px] text-[#526760] mt-0.5">Tap an action to earn points immediately</p>
              </div>
              <button
                onClick={() => setIsNameSet(false)}
                className="font-mono text-[10px] text-[#526760] hover:underline"
              >
                Edit Name
              </button>
            </div>

            {/* Notification Banner */}
            {statusMessage && (
              <div
                className={`p-3 text-xs font-mono border ${
                  statusMessage.type === 'success'
                    ? 'bg-[#e2ede5] border-[#39705d]/30 text-[#39705d]'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              <button
                disabled={logging}
                onClick={() => handleQuickLog('Sustainable Transit Trip', 150)}
                className="border border-[#102f26]/20 bg-white p-4 text-left hover:border-[#102f26] transition-all hover:shadow-sm disabled:opacity-50"
              >
                <div className="text-2xl mb-1">🚲</div>
                <div className="text-xs font-semibold text-[#102f26]">Sustainable Transit</div>
                <div className="font-mono text-[10px] text-[#39705d] mt-1">+150 PTS</div>
              </button>

              <button
                disabled={logging}
                onClick={() => handleQuickLog('Zero-Waste Mug / Container', 75)}
                className="border border-[#102f26]/20 bg-white p-4 text-left hover:border-[#102f26] transition-all hover:shadow-sm disabled:opacity-50"
              >
                <div className="text-2xl mb-1">☕</div>
                <div className="text-xs font-semibold text-[#102f26]">Zero-Waste Container</div>
                <div className="font-mono text-[10px] text-[#39705d] mt-1">+75 PTS</div>
              </button>

              <button
                disabled={logging}
                onClick={() => handleQuickLog('Plant-Based Meal Choice', 100)}
                className="border border-[#102f26]/20 bg-white p-4 text-left hover:border-[#102f26] transition-all hover:shadow-sm disabled:opacity-50"
              >
                <div className="text-2xl mb-1">🥗</div>
                <div className="text-xs font-semibold text-[#102f26]">Plant-Based Meal</div>
                <div className="font-mono text-[10px] text-[#39705d] mt-1">+100 PTS</div>
              </button>
            </div>
          </section>
        )}

        {/* Live Standings */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#102f26]/10 pb-3">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[#102f26] font-semibold">
              🏆 Live Leaderboard — BEST 301
            </h2>
            <button
              onClick={fetchLeaderboard}
              className="font-mono text-[10px] uppercase tracking-wider text-[#39705d] hover:underline"
            >
              ↻ Refresh Standings
            </button>
          </div>

          <div className="border border-[#102f26]/15 bg-white divide-y divide-[#102f26]/10">
            {leaderboard.length === 0 ? (
              <div className="p-8 text-center font-mono text-xs text-[#526760]">
                No entries yet for BEST 301. Be the first to log an action above!
              </div>
            ) : (
              leaderboard.map((student, index) => (
                <div
                  key={student.id || index}
                  className="flex items-center justify-between p-4 hover:bg-[#f9f8f6] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-[#39705d] font-bold w-6">
                      #{index + 1}
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

// Parent Page Export with Suspense Wrapper for Next.js prerendering
export default function ClassPilotPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white text-[#102f26] flex items-center justify-center font-mono text-xs">
        Loading BEST 301 Pilot...
      </div>
    }>
      <PilotContent />
    </Suspense>
  );
}
