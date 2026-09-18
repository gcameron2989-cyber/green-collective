'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface UserSubmission {
  id: string
  created_at: string
  quantity: number
  status: 'pending' | 'approved' | 'rejected'
  faculties: { name: string } | null
  eco_actions: { title: string; points: number; category: string } | null
}

export default function UserProfilePage() {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const supabase = createClient()

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)
      
      // Fetches user submission history
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          id,
          created_at,
          quantity,
          status,
          faculties ( name ),
          eco_actions ( title, points, category )
        `)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setSubmissions(data as unknown as UserSubmission[])
      }
      setLoading(false)
    }

    fetchUserProfile()
  }, [])

  // Calculate personal metrics
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved')
  const totalPoints = approvedSubmissions.reduce(
    (sum, s) => sum + (s.eco_actions?.points || 0) * s.quantity,
    0
  )
  const totalActionsLogged = approvedSubmissions.reduce((sum, s) => sum + s.quantity, 0)
  
  // Estimate CO2 avoided (e.g. ~0.5 kg CO2 per eco-action)
  const estimatedCo2Saved = (totalActionsLogged * 0.5).toFixed(1)

  // Badge unlock logic
  const badges = [
    { name: 'First Step', desc: 'Logged 1 eco-action', unlocked: totalActionsLogged >= 1, icon: '🌱' },
    { name: 'Eco Warrior', desc: 'Logged 10+ eco-actions', unlocked: totalActionsLogged >= 10, icon: '⚡' },
    { name: 'Centurion', desc: 'Earned 100+ total points', unlocked: totalPoints >= 100, icon: '🏆' },
    { name: 'Zero Waste Champion', desc: 'Logged 5+ zero-waste actions', unlocked: approvedSubmissions.filter(s => s.eco_actions?.category === 'Zero Waste & Dining').length >= 5, icon: '♻️' },
  ]

  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
        <div className="flex gap-4 items-center text-xs font-semibold">
          <Link href="/competition/submit" className="text-emerald-800 hover:underline">
            + Log Action
          </Link>
          <Link href="/competition" className="text-emerald-800 hover:underline">
            Leaderboard →
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 z-10 space-y-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-2 border border-emerald-200">
            👤 Personal Impact
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            User Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track your individual contributions, point totals, and eco-milestones.
          </p>
        </div>

        {/* Impact Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-emerald-900/10 bg-card/80 backdrop-blur shadow-sm space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Total Points Earned</span>
            <div className="text-3xl font-extrabold text-[#0f382c]">{loading ? '...' : totalPoints}</div>
            <p className="text-[10px] text-emerald-700 font-medium">Approved contributions</p>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-900/10 bg-card/80 backdrop-blur shadow-sm space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Actions Approved</span>
            <div className="text-3xl font-extrabold text-[#0f382c]">{loading ? '...' : totalActionsLogged}</div>
            <p className="text-[10px] text-emerald-700 font-medium">Logged activities</p>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-900/10 bg-card/80 backdrop-blur shadow-sm space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Est. CO₂ Offset</span>
            <div className="text-3xl font-extrabold text-[#0f382c]">{loading ? '...' : `${estimatedCo2Saved} kg`}</div>
            <p className="text-[10px] text-emerald-700 font-medium">Environmental impact</p>
          </div>
        </div>

        {/* Badges Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Milestone Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-center space-y-2 transition ${
                  badge.unlocked
                    ? 'border-emerald-300 bg-emerald-50/80 text-foreground'
                    : 'border-emerald-900/10 bg-background/40 opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl">{badge.icon}</div>
                <div>
                  <div className="text-xs font-bold">{badge.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{badge.desc}</div>
                </div>
                <span
                  className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    badge.unlocked ? 'bg-emerald-200 text-[#0f382c]' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {badge.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Stream */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Your Activity Feed</h2>
          <div className="border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm">
            {loading ? (
              <div className="text-center py-8 text-xs text-muted-foreground animate-pulse">
                Loading activity history...
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                You haven't logged any actions yet.
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => {
                  const points = (sub.eco_actions?.points || 0) * sub.quantity

                  return (
                    <div
                      key={sub.id}
                      className="p-3.5 rounded-xl border border-emerald-900/10 bg-background/60 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {sub.eco_actions?.title || 'Eco Action'}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              sub.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sub.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {sub.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {sub.faculties?.name || 'Faculty'} • Qty: {sub.quantity} • {new Date(sub.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-xs font-bold text-emerald-800 shrink-0">
                        +{points} pts
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  )
}
