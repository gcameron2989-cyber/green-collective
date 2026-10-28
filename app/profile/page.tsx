'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UserSubmission {
  id: string
  created_at: string
  quantity: number
  status: 'pending' | 'approved' | 'rejected'
  faculty_id: string
  eco_action_id: string
}

const ECO_ACTIONS_MAP: Record<string, { title: string; points: number; category: string }> = {
  'home-meal': { category: 'Zero Waste & Dining', title: 'Brought Lunch/Snacks from Home (Zero Single-Use)', points: 30 },
  'home-beverage': { category: 'Zero Waste & Dining', title: 'Brought Coffee/Tea from Home', points: 25 },
  'reusable-container-buy': { category: 'Zero Waste & Dining', title: 'Used Reusable Container/Mug for Retail Purchase', points: 15 },
  'refillable-water': { category: 'Zero Waste & Dining', title: 'Used Refillable Water Bottle vs. Bottled Water', points: 20 },
  'plant-based-meal': { category: 'Zero Waste & Dining', title: 'Chose 100% Plant-Based Dining Option', points: 20 },
  'sustainable-commute': { category: 'Mobility & Energy', title: 'Commuted via Transit, Cycling, or Walking', points: 25 },
  'carpool-trip': { category: 'Mobility & Energy', title: 'Shared Ride / Carpooled to Campus', points: 20 },
  'stairs-instead-elevator': { category: 'Mobility & Energy', title: 'Took Stairs Instead of Elevator (3+ Floors)', points: 10 },
  'waste-sorting': { category: 'Circular Economy', title: 'Properly Sorted Compost, Recyclables & Soft Plastics', points: 10 },
  'thrift-borrow-gear': { category: 'Circular Economy', title: 'Borrowed/Thrifted Academic Gear or Clothes', points: 30 },
  'campus-cleanup': { category: 'Circular Economy', title: 'Participated in Campus Clean-up / Eco Event', points: 50 },
}

export default function UserProfilePage() {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      setUserEmail(user.email || 'UBC Participant')

      const { data: userSubmissions, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && userSubmissions) {
        setSubmissions(userSubmissions as unknown as UserSubmission[])
      } else if (error) {
        console.error('Error fetching submissions:', error)
      }

      setLoading(false)
    }

    fetchUserProfile()
  }, [router])

  // Calculate Personal Aggregates
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved')
  const totalPoints = approvedSubmissions.reduce(
    (sum, s) => sum + (ECO_ACTIONS_MAP[s.eco_action_id]?.points || 0) * s.quantity,
    0
  )
  const totalActionsLogged = approvedSubmissions.reduce((sum, s) => sum + s.quantity, 0)

  // Sub-category Metrics
  const zeroWasteCount = approvedSubmissions
    .filter((s) => ECO_ACTIONS_MAP[s.eco_action_id]?.category === 'Zero Waste & Dining')
    .reduce((sum, s) => sum + s.quantity, 0)

  const transitCount = approvedSubmissions
    .filter((s) => ECO_ACTIONS_MAP[s.eco_action_id]?.category === 'Mobility & Energy')
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
    <div className="w-full max-w-5xl mx-auto px-6 py-10 space-y-8 font-sans">
      
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] bg-emerald-950/60 text-emerald-400 rounded-full border border-emerald-500/20 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            UBC Sustainability Challenge
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Personal Impact Hub
          </h1>
          <p className="text-xs font-mono text-neutral-400">
            Session Account: <span className="text-emerald-300">{userEmail || 'UBC Participant'}</span>
          </p>
        </div>

        <Link
          href="/competition/submit"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500 text-neutral-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        >
          + Log Eco Action
        </Link>
      </div>

      {/* UBC Challenge Progress Card */}
      <div className="p-6 rounded-xl border border-white/10 bg-[#0d1612]/90 backdrop-blur-md shadow-lg space-y-3 relative overflow-hidden">
        <div className="flex justify-between items-center font-mono text-xs">
          <span className="text-neutral-300 uppercase tracking-wider font-semibold">
            UBC Challenge Goal: 150 Points
          </span>
          <span className="text-emerald-400 font-bold">{challengeProgress}% Complete</span>
        </div>
        <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
            style={{ width: `${challengeProgress}%` }}
          />
        </div>
        <p className="text-[11px] text-neutral-400">
          Log actions daily during the campus competition to complete your individual target for your faculty.
        </p>
      </div>

      {/* Impact Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#0d1612]/80 backdrop-blur-md space-y-1 hover:border-emerald-500/30 transition-colors">
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">Total Points</span>
          <div className="text-2xl font-bold tracking-tight text-white">{loading ? '...' : totalPoints}</div>
          <p className="font-mono text-[10px] text-emerald-400/80">Approved points</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0d1612]/80 backdrop-blur-md space-y-1 hover:border-emerald-500/30 transition-colors">
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">Actions Logged</span>
          <div className="text-2xl font-bold tracking-tight text-white">{loading ? '...' : totalActionsLogged}</div>
          <p className="font-mono text-[10px] text-emerald-400/80">Total activities</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0d1612]/80 backdrop-blur-md space-y-1 hover:border-emerald-500/30 transition-colors">
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">Est. CO₂ Avoided</span>
          <div className="text-2xl font-bold tracking-tight text-white">{loading ? '...' : `${co2OffsetKg} kg`}</div>
          <p className="font-mono text-[10px] text-emerald-400/80">Carbon reduced</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0d1612]/80 backdrop-blur-md space-y-1 hover:border-emerald-500/30 transition-colors">
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">Items Diverted</span>
          <div className="text-2xl font-bold tracking-tight text-white">{loading ? '...' : singleUseSaved}</div>
          <p className="font-mono text-[10px] text-emerald-400/80">Zero-waste choices</p>
        </div>
      </div>

      {/* Milestone Badges */}
      <div className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-wider text-neutral-300">Earned Badges & Milestones</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-center space-y-2.5 transition-all ${
                badge.unlocked
                  ? 'border-emerald-500/25 bg-[#0d1612]/90 text-white shadow-md'
                  : 'border-white/5 bg-[#090f0c]/40 opacity-40 grayscale'
              }`}
            >
              <div className="text-2xl">{badge.icon}</div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold">{badge.name}</div>
                <div className="text-[10px] text-neutral-400">{badge.desc}</div>
              </div>
              <span
                className={`inline-block font-mono text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  badge.unlocked ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-neutral-800 text-neutral-500'
                }`}
              >
                {badge.unlocked ? 'UNLOCKED' : 'LOCKED'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Activity Stream */}
      <div className="space-y-3 pb-8">
        <h2 className="font-mono text-xs uppercase tracking-wider text-neutral-300">Your Logged Activities</h2>
        <div className="border border-white/10 rounded-xl bg-[#0d1612]/90 backdrop-blur-md p-5 shadow-lg">
          {loading ? (
            <div className="text-center py-10 font-mono text-xs text-neutral-500 animate-pulse">
              Loading activity history...
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-10 font-mono text-xs text-neutral-400 space-y-2">
              <p>No eco-actions logged under your account yet.</p>
              <Link
                href="/competition/submit"
                className="inline-block text-xs font-bold text-emerald-400 underline hover:text-emerald-300"
              >
                Log your first action for the challenge →
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {submissions.map((sub) => {
                const actionDetails = ECO_ACTIONS_MAP[sub.eco_action_id]
                const points = (actionDetails?.points || 0) * sub.quantity

                return (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-lg border border-white/5 bg-[#090f0c]/60 flex items-center justify-between gap-4 hover:border-emerald-500/20 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">
                          {actionDetails?.title || 'Eco Action'}
                        </span>
                        <span
                          className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            sub.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : sub.status === 'rejected'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {sub.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-neutral-400">
                        Qty: {sub.quantity} • {new Date(sub.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="font-mono text-xs font-bold text-emerald-400 shrink-0 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                      +{points} pts
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
