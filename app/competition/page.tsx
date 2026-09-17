'use client'

import { useEffect, useState } from 'react'
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
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans">
      <header className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-slate-800 gap-4">
        <div>
          <Link href="/institution" className="text-xs text-emerald-400 hover:underline mb-2 inline-block">
            ← Back to Institutional Hub
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            UBC Sustainability Challenge 🌿
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Faculty vs. Faculty Live Scoreboard
          </p>
        </div>
        <Link
          href="/competition/submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-lg transition shadow-md shadow-emerald-950"
        >
          + Log Eco-Action
        </Link>
      </header>

      <main className="max-w-4xl mx-auto mt-8">
        {loading ? (
          <div className="flex justify-center py-16 text-slate-400 animate-pulse">
            Loading live standings...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
            <p className="text-slate-400">No score data logged yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((faculty, index) => {
              const percentage = Math.round((faculty.total_points / maxPoints) * 100)
              const rank = index + 1

              return (
                <div
                  key={faculty.faculty_id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm transition hover:border-slate-700"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-black text-sm w-7 h-7 rounded-full flex items-center justify-center ${
                          rank === 1
                            ? 'bg-amber-400 text-slate-950'
                            : rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {rank}
                      </span>
                      <h2 className="text-lg font-bold text-slate-100">
                        {faculty.faculty_name}
                      </h2>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-extrabold text-emerald-400">
                        {faculty.total_points} <span className="text-xs font-normal text-slate-400">pts</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {faculty.total_actions} actions logged
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
