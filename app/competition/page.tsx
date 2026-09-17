'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface FacultyLeaderboard {
  faculty_id: string
  faculty_name: string
  total_points: number
  total_actions: number
}

export default function CompetitionLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<FacultyLeaderboard[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const supabase = createClient()

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('faculty_leaderboard')
      .select('*')
      .order('total_points', { ascending: false })

    if (error) {
      console.error('Error fetching leaderboard:', error.message)
    } else if (data) {
      setLeaderboard(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLeaderboard()

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'submissions' },
        () => fetchLeaderboard()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const maxPoints = leaderboard.length > 0 ? Math.max(...leaderboard.map(f => f.total_points), 1) : 1

  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Background Radial Glow & Grid Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Header Navigation */}
      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
        <Link
          href="/competition/submit"
          className="text-xs font-semibold bg-[#0f382c] text-white px-5 py-2.5 rounded-full hover:bg-emerald-900 transition shadow-md shadow-emerald-900/10"
        >
          + Log Eco-Action
        </Link>
      </header>

      {/* Main Leaderboard Section */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10 z-10 space-y-8">
        <div>
          <Link href="/institution" className="text-xs font-semibold text-emerald-800 hover:underline mb-2 inline-block">
            ← Back to Institutional Hub
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-2 border border-emerald-200">
                🏆 Campus Competition
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                UBC Sustainability Challenge
              </h1>
            </div>
          </div>
        </div>

        {/* Live Standings Container */}
        <div className="border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-emerald-900/10">
            <h2 className="text-base font-bold text-[#0f382c]">Faculty Live Standings</h2>
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Realtime Sync Active
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12 text-xs font-medium text-muted-foreground animate-pulse">
              Fetching live scores...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12 text-xs text-muted-foreground">
              No faculty actions recorded yet. Be the first to log points!
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((faculty, index) => {
                const percentage = Math.round((faculty.total_points / maxPoints) * 100)
                const rank = index + 1

                return (
                  <div
                    key={faculty.faculty_id}
                    className="p-4 rounded-xl border border-emerald-900/10 bg-background/60 space-y-3 transition hover:border-emerald-700/30"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-black w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                            rank === 1
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : rank === 2
                              ? 'bg-slate-300 text-slate-950 font-bold'
                              : rank === 3
                              ? 'bg-amber-700 text-white font-bold'
                              : 'bg-emerald-100 text-[#0f382c]'
                          }`}
                        >
                          #{rank}
                        </span>
                        <div>
                          <h3 className="font-bold text-foreground text-sm">{faculty.faculty_name}</h3>
                          <span className="text-[10px] text-muted-foreground">
                            {faculty.total_actions} total action{faculty.total_actions === 1 ? '' : 's'} logged
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-extrabold text-[#0f382c] block">
                          {faculty.total_points} <span className="text-xs font-normal text-muted-foreground">pts</span>
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar matching overall theme */}
                    <div className="w-full bg-emerald-950/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0f382c] h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.max(percentage, 3)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  )
}
