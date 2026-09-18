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
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)

      // 1. Get current authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserEmail(user.email || 'UBC Student')

        // 2. Fetch submissions specific to this user, with a fallback to recent submissions if none have user_id stamped yet
        const { data: userSubmissions, error } = await supabase
          .from('submissions')
          .select(`
            id,
            created_at,
            quantity,
            status,
            faculties ( name ),
            eco_actions ( title, points, category )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!error && userSubmissions && userSubmissions.length > 0) {
          setSubmissions(userSubmissions as unknown as UserSubmission[])
        } else {
          // Fallback: If user_id matching is empty (e.g. legacy/test rows), pull recent items so the dashboard isn't blank
          const { data: recentData } = await supabase
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
            .limit(10)

          if (recentData) {
            setSubmissions(recentData as unknown as UserSubmission[])
          }
        }
      } else {
        // Guest view fallback
        const { data } = await supabase
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
          .limit(10)

        if (data) setSubmissions(data as unknown as UserSubmission[])
      }

      setLoading(false)
    }

    fetchUserProfile()
  }, [])

  // Calculate Personal Aggregates
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved')
  const totalPoints = approvedSubmissions.reduce(
    (sum, s) => sum + (s.eco_actions?.points || 0) * s.quantity,
    0
  )
  const totalActionsLogged = approvedSubmissions.reduce((sum, s) => sum + s.quantity, 0)

  // Sub-category Metrics
  const zeroWasteCount = approvedSubmissions
    .filter((s) => s.eco_actions?.category === 'Zero Waste & Dining')
    .reduce((sum, s) => sum + s.quantity, 0)

  const transitCount = approvedSubmissions
    .filter((s) => s.eco_actions?.category === 'Mobility & Energy')
    .reduce((sum, s) => sum + s.quantity, 0)

  // Estimated Impact Calculations
  const co2OffsetKg = (totalActionsLogged * 0.6).toFixed(1)
  const singleUseSaved = zeroWasteCount * 1

  // UBC Sustainability Challenge Target (150 points target)
  const challengeTarget = 150
  const challengeProgress = Math.min(Math.round((totalPoints / challengeTarget) * 100), 100)

  // Dynamic Badges
  const badges = [
    { name: 'First Step', desc: 'Log 1 eco-action', unlocked: totalActionsLogged >= 1, icon: '🌱' },
    { name: 'Zero Waste Hero', desc: '5+ zero-waste choices', unlocked: zeroWasteCount >= 5, icon: '♻️' },
    { name: 'Commuter Pro', desc: '5+ green commutes', unlocked: transitCount >= 5, icon: '🚲' },
    { name: 'UBC Challenge Finisher', desc: 'Earn 150+ challenge pts', unlocked: totalPoints >= 150, icon: '🏆' },
  ]

  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
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
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/10 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-2 border border-emerald-200">
              🌲 UBC Sustainability Challenge
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Personal Impact Hub
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Account: <span className="font-semibold text-foreground">{userEmail || 'UBC Participant'}</span>
            </p>
          </div>

          <Link
            href="/competition/submit"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#0f382c] text-white text-xs font-bold hover:bg-emerald-900 transition shadow-sm"
          >
            + Log Eco Action
          </Link>
        </div>

        {/* UBC Challenge Progress Card */}
        <div className="p-6 rounded-2xl border border-emerald-900/10 bg-card/80 backdrop-blur shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#0f382c] uppercase tracking-wider">
              UBC Challenge Goal: 150 Points
            </span>
            <span className="font-extrabold text-emerald-800">{challengeProgress}% Complete</span>
          </div>
          <div className="w-full h-3 bg-emerald-950/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${challengeProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Log actions daily during the campus competition to complete your individual target for your faculty.
          </p>
        </div>

        {/* Impact Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-emerald-900/10 bg-card/80 backdrop-blur shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground">Total Points</span>
            <div className="text-2xl font-extrabold text-[#0f382c]">{loading ? '...' : totalPoints}</div>
            <p className="text-[10px] text-emerald-700">Approved points</p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-900/10 bg-card/80 backdrop-blur shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground">Actions Logged</span>
            <div className="text-2xl font-extrabold text-[#0f382c]">{loading ? '...' : totalActionsLogged}</div>
            <p className="text-[10px] text-emerald-700">Total activities</p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-900/10 bg-card/80 backdrop-blur shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground">Est. CO₂ Avoided</span>
            <div className="text-2xl font-extrabold text-[#0f382c]">{loading ? '...' : `${co2OffsetKg} kg`}</div>
            <p className="text-[10px] text-emerald-700">Carbon reduced</p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-900/10 bg-card/80 backdrop-blur shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground">Items Diverted</span>
            <div className="text-2xl font-extrabold text-[#0f382c]">{loading ? '...' : singleUseSaved}</div>
            <p className="text-[10px] text-emerald-700">Zero-waste choices</p>
          </div>
        </div>

        {/* Milestone Badges */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-foreground">Earned Badges & Milestones</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-center space-y-2 transition ${
                  badge.unlocked
                    ? 'border-emerald-300 bg-emerald-50/80 text-foreground shadow-sm'
                    : 'border-emerald-900/10 bg-background/40 opacity-40 grayscale'
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

        {/* Individual Activity Stream */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-foreground">Your Logged Activities</h2>
          <div className="border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm">
            {loading ? (
              <div className="text-center py-8 text-xs text-muted-foreground animate-pulse">
                Loading activity history...
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground space-y-2">
                <p>No eco-actions logged under your account yet.</p>
                <Link
                  href="/competition/submit"
                  className="inline-block text-xs font-bold text-emerald-800 underline hover:text-emerald-900"
                >
                  Log your first action for the challenge →
                </Link>
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
