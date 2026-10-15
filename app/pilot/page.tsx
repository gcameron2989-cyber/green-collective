'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';

interface LeaderboardEntry {
  id: string;
  full_name: string;
  total_points: number;
  cohort?: string;
}

interface EcoAction {
  id: string;
  title: string;
  points: number;
  category?: string;
  icon?: string;
}

function PilotContent() {
  const searchParams = useSearchParams();
  const cohortParam = searchParams?.get('cohort');
  const defaultCohort = cohortParam || 'BEST-301 W1-2026';
  
  const [cohort] = useState(defaultCohort);
  const [displayName, setDisplayName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [actionsList, setActionsList] = useState<EcoAction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [logging, setLogging] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const supabase = createClient();

  const getOrCreateGuestId = () => {
    let guestId = typeof window !== 'undefined' ? localStorage.getItem('pilot_guest_id') : null;
    if (!guestId) {
      guestId = 'guest-' + Math.random().toString(36).substring(2, 15);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pilot_guest_id', guestId);
      }
    }
    return guestId;
  };

  const fetchActionsCatalog = async () => {
    const { data, error } = await supabase
      .from('eco_actions')
      .select('id, title, points, category, icon')
      .order('points', { ascending: true });

    if (!error && data && data.length > 0) {
      setActionsList(data as EcoAction[]);
    } else {
      setActionsList([
        { id: '1', title: 'Sustainable Transit Trip', points: 150, category: 'Transit', icon: '🚲' },
        { id: '2', title: 'Zero-Waste Mug / Container', points: 75, category: 'Waste', icon: '☕' },
        { id: '3', title: 'Plant-Based Meal Choice', points: 100, category: 'Food', icon: '🥗' },
        { id: '4', title: 'Cold Water Wash / Line Dry', points: 80, category: 'Energy', icon: '🧺' },
        { id: '5', title: 'Campus Eco-Event Attendance', points: 200, category: 'Community', icon: '🌱' },
      ]);
    }
  };

  const fetchLeaderboard = async () => {
    setIsRefreshing(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, total_points, cohort')
      .order('total_points', { ascending: false })
      .limit(10);

    if (!error && data) {
      setLeaderboard(data as LeaderboardEntry[]);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchActionsCatalog();
    fetchLeaderboard();
  }, [cohort]);

  const handleJoinPilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim().length > 0) {
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id || getOrCreateGuestId();

      // Clean up old anonymous rows with 0 points
      await supabase.from('profiles').upsert({
        id: currentUserId,
        full_name: displayName.trim(),
        cohort: cohort,
        total_points: userScore,
      });

      setIsNameSet(true);
      await fetchLeaderboard();
    }
  };

  const handleLogAction = async (action: EcoAction) => {
    setLogging(true);
    setStatusMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id || getOrCreateGuestId();

    const payload = {
      user_id: currentUserId,
      action_id: action.id,
      action_name: action.title,
      points: action.points,
      points_earned: action.points,
      sector: action.category || 'General',
      created_at: new Date().toISOString(),
    };

    const { error: logError } = await supabase.from('logged_actions').insert(payload);

    if (logError) {
      setStatusMessage({ text: logError.message, type: 'error' });
    } else {
      // Calculate new score reliably in local state
      const nextScore = userScore + action.points;
      setUserScore(nextScore);

      // Force upsert your exact name and new total score to profiles
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: currentUserId,
        full_name: displayName.trim() || 'Student',
        cohort: cohort,
        total_points: nextScore,
      });

      if (profileError) {
        console.error('Profile upsert error:', profileError.message);
      }

      setStatusMessage({ text: `✓ Success! +${action.points} PTS for ${action.title}`, type: 'success' });
      await fetchLeaderboard();
    }

    setLogging(false);
  };

  const categories = ['All', ...Array.from(new Set(actionsList.map(a => a.category).filter(Boolean)))];

  const filteredActions = selectedCategory === 'All' 
    ? actionsList 
    : actionsList.filter(a => a.category === selectedCategory);

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24 font-sans">
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2] px-6 py-12 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d] font-semibold">
          Live Campus Competition Pilot
        </span>
        <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl text-[#102f26]">
          {cohort} Climate Challenge
        </h1>
        <p className="mt-3 text-sm text-[#526760] max-w-md mx-auto">
          Log daily eco-actions, earn points for BEST 301, and watch real-time impact standings update live.
        </p>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-10 space-y-10">
        {!isNameSet ? (
          <section className="border border-[#102f26]/15 bg-[#f9f8f6] p-8 space-y-4 text-center max-w-md mx-auto">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[#39705d] font-semibold">
              Join The BEST 301 Pilot
            </h2>
            <p className="text-xs text-[#526760]">
              Enter your name or handle to start logging actions on the live leaderboard.
            </p>
            <form onSubmit={handleJoinPilot} className="flex flex-col gap-3 pt-2">
              <input
                type="text"
                placeholder="Display Name (e.g. Alex or Anonymous)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border border-[#102f26]/20 bg-white px-4 py-2.5 text-xs text-[#102f26] focus:outline-none focus:border-[#102f26]"
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
          <section className="border border-[#102f26]/15 bg-[#f9f8f6] p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#102f26]/10 pb-4">
              <div>
                <h2 className="font-mono text-xs uppercase tracking-wider text-[#39705d] font-semibold">
                  ⚡ Full Eco-Action Catalog ({displayName}) — <span className="text-[#102f26] font-bold">{userScore} PTS Total</span>
                </h2>
                <p className="text-[11px] text-[#526760] mt-0.5">Select an action below to log points instantly</p>
              </div>
              <button
                onClick={() => setIsNameSet(false)}
                className="font-mono text-[10px] text-[#526760] hover:underline"
              >
                Edit Name
              </button>
            </div>

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

            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat || 'All')}
                    className={`px-3 py-1 font-mono text-[11px] border transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#102f26] text-white border-[#102f26]'
                        : 'bg-white text-[#526760] border-[#102f26]/20 hover:border-[#102f26]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {filteredActions.map((action) => (
                <button
                  key={action.id}
                  disabled={logging}
                  onClick={() => handleLogAction(action)}
                  className="border border-[#102f26]/20 bg-white p-4 text-left hover:border-[#102f26] transition-all hover:shadow-sm disabled:opacity-50 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-2xl mb-1">{action.icon || '🌱'}</div>
                    <div className="text-xs font-semibold text-[#102f26]">{action.title}</div>
                  </div>
                  <div className="font-mono text-[10px] text-[#39705d] mt-3 font-bold">
                    +{action.points} PTS
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#102f26]/10 pb-3">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[#102f26] font-semibold">
              🏆 Live Standings — BEST 301
            </h2>
            <button
              onClick={fetchLeaderboard}
              disabled={isRefreshing}
              className="font-mono text-[10px] uppercase tracking-wider text-[#39705d] hover:underline disabled:opacity-50"
            >
              {isRefreshing ? '⏳ Refreshing...' : '↻ Refresh Standings'}
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
