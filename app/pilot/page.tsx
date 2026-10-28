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

interface LoggedItem {
  id: string;
  action_id: string;
  action_name: string;
  points: number;
  sector: string;
  created_at: string;
}

function PilotContent() {
  const searchParams = useSearchParams();
  const cohortParam = searchParams?.get('cohort');
  const defaultCohort = cohortParam || 'BEST-301 W1-2026';
  
  const [cohort] = useState(defaultCohort);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [actionsList, setActionsList] = useState<EcoAction[]>([]);
  const [todaysLogs, setTodaysLogs] = useState<LoggedItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [logging, setLogging] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const supabase = createClient();

  const getOrCreateGuestId = () => {
    let guestId = typeof window !== 'undefined' ? localStorage.getItem('pilot_guest_id') : null;
    if (!guestId) {
      guestId = crypto.randomUUID();
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

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id || getOrCreateGuestId();

    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, total_points')
      .eq('id', currentUserId)
      .single();

    if (profileData && profileData.full_name) {
      setDisplayName(profileData.full_name);
      setUserScore(profileData.total_points || 0);
      setIsNameSet(true);
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const { data: logsData } = await supabase
      .from('logged_actions')
      .select('id, action_id, action_name, points, sector, created_at')
      .eq('user_id', currentUserId)
      .gte('created_at', startOfToday.toISOString())
      .order('created_at', { ascending: false });

    if (logsData) {
      setTodaysLogs(logsData as LoggedItem[]);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchActionsCatalog();
    fetchLeaderboard();
  }, [cohort]);

  const handleJoinPilot = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (displayName.trim().length > 0) {
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id || getOrCreateGuestId();

      const { error } = await supabase.from('profiles').upsert({
        id: currentUserId,
        full_name: displayName.trim(),
        cohort: cohort,
        total_points: userScore,
      });

      if (error) {
        setStatusMessage({ text: `Join error: ${error.message}`, type: 'error' });
      } else {
        setIsNameSet(true);
        await fetchLeaderboard();
      }
    }
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.href,
      },
    });

    if (error) {
      setStatusMessage({ text: `Auth error: ${error.message}`, type: 'error' });
    } else {
      setStatusMessage({ 
        text: `✓ Check your email (${email}) for your cross-device magic login link!`, 
        type: 'success' 
      });
    }
  };

  const handleLogAction = async (action: EcoAction) => {
    setLogging(true);
    setStatusMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id || getOrCreateGuestId();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const alreadyLoggedThisAction = todaysLogs.some(log => log.action_id === action.id);
    if (alreadyLoggedThisAction) {
      setStatusMessage({ 
        text: `⏳ Cooldown active: You've already logged "${action.title}" today!`, 
        type: 'error' 
      });
      setLogging(false);
      return;
    }

    if (action.category === 'Transit') {
      const transitLogsCount = todaysLogs.filter(log => log.sector === 'Transit').length;
      if (transitLogsCount >= 4) {
        setStatusMessage({ 
          text: `🛑 Daily Limit Reached: You can only log a maximum of 4 transit trips per day.`, 
          type: 'error' 
        });
        setLogging(false);
        return;
      }
    }

    const { error: logError } = await supabase.from('logged_actions').insert({
      user_id: currentUserId,
      action_id: action.id,
      action_name: action.title,
      points: action.points,
      points_earned: action.points,
      sector: action.category || 'General',
      created_at: new Date().toISOString(),
    });

    if (logError) {
      setStatusMessage({ text: `Log error: ${logError.message}`, type: 'error' });
    } else {
      const nextScore = userScore + action.points;
      setUserScore(nextScore);

      const { error: profileError } = await supabase.from('profiles').upsert({
        id: currentUserId,
        full_name: displayName.trim() || 'Student',
        cohort: cohort,
        total_points: nextScore,
      });

      if (profileError) {
        setStatusMessage({ text: `Profile error: ${profileError.message}`, type: 'error' });
      } else {
        setStatusMessage({ text: `✓ Success! +${action.points} PTS for ${action.title}. (Misclicked? Use Undo below)`, type: 'success' });
        await fetchUserData();
        await fetchLeaderboard();
      }
    }

    setLogging(false);
  };

  const handleUndoLastAction = async () => {
    if (todaysLogs.length === 0) return;
    setLogging(true);
    setStatusMessage(null);

    const lastLog = todaysLogs[0];
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id || getOrCreateGuestId();

    const { error: deleteError } = await supabase
      .from('logged_actions')
      .delete()
      .eq('id', lastLog.id);

    if (deleteError) {
      setStatusMessage({ text: `Undo error: ${deleteError.message}`, type: 'error' });
      setLogging(false);
      return;
    }

    const nextScore = Math.max(0, userScore - lastLog.points);
    setUserScore(nextScore);

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: currentUserId,
      full_name: displayName.trim() || 'Student',
      cohort: cohort,
      total_points: nextScore,
    });

    if (profileError) {
      setStatusMessage({ text: `Profile update error: ${profileError.message}`, type: 'error' });
    } else {
      setStatusMessage({ text: `↩ Undone: Removed "${lastLog.action_name}" (-${lastLog.points} PTS)`, type: 'success' });
      await fetchUserData();
      await fetchLeaderboard();
    }

    setLogging(false);
  };

  const categories = ['All', ...Array.from(new Set(actionsList.map(a => a.category).filter(Boolean)))];

  const filteredActions = selectedCategory === 'All' 
    ? actionsList 
    : actionsList.filter(a => a.category === selectedCategory);

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#1b4332] pb-24 font-sans">
      <section className="border-b border-[#1b4332]/10 bg-[#1b4332] text-[#f7f5f0] px-6 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-[#2d6a4f]/50 font-mono text-[11px] uppercase tracking-[0.22em] text-[#a3b18a] border border-[#52b788]/20">
            Live Campus Competition Pilot
          </span>
          <h1 className="text-3xl font-medium tracking-tight md:text-5xl text-white">
            {cohort} Climate Challenge
          </h1>
          <p className="text-sm text-[#d8f3dc]/80 max-w-lg mx-auto leading-relaxed">
            Log daily eco-actions, earn points for BEST 301, and watch real-time impact standings update live across your cohort.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-10 space-y-10">
        {!isNameSet ? (
          <section className="border border-[#2d6a4f]/20 bg-white shadow-sm p-8 space-y-4 text-center max-w-md mx-auto rounded-xl">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[#2d6a4f] font-semibold">
              Join The BEST 301 Pilot
            </h2>
            <p className="text-xs text-[#526760]">
              Enter your name or handle to start logging actions on the live leaderboard.
            </p>

            {statusMessage && (
              <div className="p-3 text-xs font-mono border bg-red-50 border-red-200 text-red-800 rounded-md">
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={handleJoinPilot} className="flex flex-col gap-3 pt-2">
              <input
                type="text"
                placeholder="Display Name (e.g. Alex or Anonymous)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border border-[#2d6a4f]/20 bg-[#f7f5f0] px-4 py-3 text-xs text-[#1b4332] rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                required
              />
              <button
                type="submit"
                className="bg-[#1b4332] px-6 py-3 font-mono text-xs uppercase tracking-wider text-white rounded-lg hover:bg-[#2d6a4f] transition-all shadow-sm"
              >
                Join Class →
              </button>
            </form>
          </section>
        ) : (
          <div className="space-y-6">
            <section className="border border-[#2d6a4f]/20 bg-white shadow-sm p-6 space-y-4 rounded-xl">
              <div className="flex items-center justify-between border-b border-[#1b4332]/10 pb-4">
                <div>
                  <h2 className="font-mono text-xs uppercase tracking-wider text-[#2d6a4f] font-semibold">
                    ⚡ Welcome back, {displayName} — <span className="text-[#1b4332] font-bold">{userScore} PTS Total</span>
                  </h2>
                  <p className="text-[11px] text-[#526760] mt-0.5">Your streak & progress update automatically daily</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowEmailAuth(!showEmailAuth)}
                    className="font-mono text-[10px] text-[#2d6a4f] bg-[#e8f5e9] px-2.5 py-1 rounded border border-[#2d6a4f]/20 hover:bg-[#d8f3dc]"
                  >
                    {showEmailAuth ? 'Close Sync' : '🔗 Sync Across Devices'}
                  </button>
                  <button
                    onClick={() => setIsNameSet(false)}
                    className="font-mono text-[10px] text-[#526760] hover:underline"
                  >
                    Edit Name
                  </button>
                </div>
              </div>

              {/* Cross-Device Sync Toggle Drawer */}
              {showEmailAuth && (
                <div className="bg-[#f7f5f0] p-4 border border-[#2d6a4f]/15 rounded-lg space-y-3">
                  <div className="text-xs font-semibold text-[#1b4332]">Sync Account to Any Device</div>
                  <p className="text-[11px] text-[#526760]">
                    Enter your email to receive a secure login link. This links your points so you can switch between your phone, computer, and tablet seamlessly.
                  </p>
                  <form onSubmit={handleSendMagicLink} className="flex gap-2">
                    <input
                      type="email"
                      placeholder="student@ubc.ca"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 border border-[#2d6a4f]/20 bg-white px-3 py-2 text-xs text-[#1b4332] rounded-md focus:outline-none focus:border-[#2d6a4f]"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-[#1b4332] px-4 py-2 font-mono text-[11px] uppercase text-white rounded-md hover:bg-[#2d6a4f] transition-all"
                    >
                      Send Link
                    </button>
                  </form>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#f7f5f0] p-4 border border-[#2d6a4f]/10 rounded-lg">
                <div>
                  <span className="font-mono text-[11px] text-[#2d6a4f] uppercase tracking-wider font-bold">
                    Today's Activity ({todaysLogs.length} actions logged)
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {todaysLogs.length === 0 ? (
                      <span className="text-xs text-[#526760]">No actions logged yet today. Choose from below!</span>
                    ) : (
                      todaysLogs.map(log => (
                        <span key={log.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-[#1b4332] font-mono text-[10px] border border-[#2d6a4f]/15 rounded-md shadow-2xs">
                          {log.action_name} (+{log.points})
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {todaysLogs.length > 0 && (
                  <button
                    disabled={logging}
                    onClick={handleUndoLastAction}
                    className="whitespace-nowrap font-mono text-[11px] text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 shadow-2xs"
                  >
                    ↩ Undo Last Action
                  </button>
                )}
              </div>

              {statusMessage && (
                <div
                  className={`p-3 text-xs font-mono border rounded-md ${
                    statusMessage.type === 'success'
                      ? 'bg-[#e8f5e9] border-[#2d6a4f]/30 text-[#2d6a4f]'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}
            </section>

            <section className="border border-[#2d6a4f]/20 bg-white shadow-sm p-8 space-y-6 rounded-xl">
              <div className="border-b border-[#1b4332]/10 pb-3 flex items-center justify-between">
                <h3 className="font-mono text-xs uppercase tracking-wider text-[#1b4332] font-semibold">
                  Select an action to log points instantly
                </h3>
                <span className="font-mono text-[10px] text-[#526760]">20 Action Catalog</span>
              </div>

              {categories.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat || 'All')}
                      className={`px-3.5 py-1.5 font-mono text-[11px] border rounded-lg transition-all shadow-2xs ${
                        selectedCategory === cat
                          ? 'bg-[#1b4332] text-white border-[#1b4332]'
                          : 'bg-[#f7f5f0] text-[#526760] border-[#2d6a4f]/20 hover:border-[#2d6a4f] hover:text-[#1b4332]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {filteredActions.map((action) => (
                  <button
                    key={action.id}
                    disabled={logging}
                    onClick={() => handleLogAction(action)}
                    className="border border-[#2d6a4f]/20 bg-[#f7f5f0]/50 p-5 text-left hover:border-[#2d6a4f] hover:bg-white hover:-translate-y-0.5 transition-all duration-200 hover:shadow-md disabled:opacity-50 flex flex-col justify-between rounded-xl group"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-[#e8f5e9] flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
                        {action.icon || '🌱'}
                      </div>
                      <div className="text-xs font-semibold text-[#1b4332] leading-snug">
                        {action.title}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1b4332]/5">
                      <span className="font-mono text-[10px] text-[#526760] uppercase">{action.category || 'General'}</span>
                      <span className="font-mono text-xs text-[#2d6a4f] font-bold bg-[#e8f5e9] px-2 py-0.5 rounded">
                        +{action.points} PTS
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1b4332]/10 pb-3">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[#1b4332] font-semibold">
              🏆 Live Standings — BEST 301
            </h2>
            <button
              onClick={fetchLeaderboard}
              disabled={isRefreshing}
              className="font-mono text-[10px] uppercase tracking-wider text-[#2d6a4f] hover:underline disabled:opacity-50"
            >
              {isRefreshing ? '⏳ Refreshing...' : '↻ Refresh Standings'}
            </button>
          </div>

          <div className="border border-[#2d6a4f]/20 bg-white shadow-sm rounded-xl divide-y divide-[#1b4332]/10 overflow-hidden">
            {leaderboard.length === 0 ? (
              <div className="p-8 text-center font-mono text-xs text-[#526760]">
                No entries yet for BEST 301. Be the first to log an action above!
              </div>
            ) : (
              leaderboard.map((student, index) => (
                <div key={student.id || index} className="flex items-center justify-between p-4 hover:bg-[#f7f5f0] transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-[#2d6a4f] font-bold w-6">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium text-[#1b4332]">
                      {student.full_name || 'Anonymous Student'}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-bold text-[#1b4332]">
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
      <div className="min-h-screen bg-[#f7f5f0] text-[#1b4332] flex items-center justify-center font-mono text-xs">
        Loading BEST 301 Pilot...
      </div>
    }>
      <PilotContent />
    </Suspense>
  );
}
