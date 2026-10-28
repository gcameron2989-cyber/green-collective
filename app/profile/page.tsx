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
    <div className="w-full max-w-6xl mx-auto px-6 py-12 space-y-10 font-sans text-neutral-900">
      
      {/* Top Banner & Action Trigger */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-200">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-md text-xs font-mono font-medium tracking-wide border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            UBC Sustainability Challenge
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
            Personal Impact Hub
          </h1>
          <p className="text-sm font-mono text-neutral-500">
            Authenticated Account: <span className="text-neutral-800 font-semibold">{userEmail || 'UBC Participant'}</span>
          </p>
        </div>

        <Link
          href="/competition/submit"
          className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-[#0f382c] text-white font-mono text-xs font-semibold uppercase tracking-wider hover:bg-emerald-900 transition-all shadow-sm"
        >
          + Log Eco Action
        </Link>
      </div>

      {/* Progress Bar Card */}
      <div className="p-7 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-mono">
              Faculty Challenge Target
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Individual benchmark: {totalPoints} / {challengeTarget} Points
            </p>
          </div>
          <span className="font-mono text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            {challengeProgress}% Completed
          </span>
        </div>
        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${challengeProgress}%` }}
          />
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">Total Points</span>
          <div className="text-3xl font-extrabold tracking-tight text-neutral-900">
            {loading ? '...' : totalPoints}
          </div>
          <p className="text-xs text-emerald-700 font-medium">Verified ledger credits</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">Actions Logged</span>
          <div className="text-3xl font-extrabold tracking-tight text-neutral-900">
            {loading ? '...' : totalActionsLogged}
          </div>
          <p className="text-xs text-emerald-700 font-medium">Total submissions</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">Est. CO₂ Avoided</span>
          <div className="text-3xl font-extrabold tracking-tight text-neutral-900">
            {loading ? '...' : `${co2OffsetKg} kg`}
          </div>
          <p className="text-xs text-emerald-700 font-medium">Emissions offset</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">Items Diverted</span>
          <div className="text-3xl font-extrabold tracking-tight text-neutral-900">
            {loading ? '...' : singleUseSaved}
          </div>
          <p className="text-xs text-emerald-700 font-medium">Zero-waste choices</p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900">Milestones & Badges</h2>
          <span className="text-xs font-mono text-neutral-400">
            {badges.filter(b => b.unlocked).length} / {badges.length} Unlocked
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between text-center space-y-3 ${
                badge.unlocked
                  ? 'bg-white border-emerald-200 shadow-xs'
                  : 'bg-neutral-50 border-neutral-200 opacity-40 grayscale'
              }`}
            >
              <div className="text-4xl">{badge.icon}</div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-neutral-900">{badge.name}</div>
                <div className="text-[11px] text-neutral-500 leading-snug">{badge.desc}</div>
              </div>
              <span
                className={`inline-block font-mono text-[10px] font-bold px-2.5 py-1 rounded-md mx-auto ${
                  badge.unlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                {badge.unlocked ? 'UNLOCKED' : 'LOCKED'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Log Stream */}
      <div className="space-y-4 pb-12">
        <h2 className="text-base font-bold text-neutral-900">Activity History</h2>
        <div className="rounded-2xl bg-white border border-neutral-200/80 shadow-xs divide-y divide-neutral-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-xs font-mono text-neutral-400 animate-pulse">
              Querying ledger submissions...
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-xs text-neutral-500 space-y-3">
              <p>No actions logged under your account yet.</p>
              <Link
                href="/competition/submit"
                className="inline-block font-mono text-xs font-bold text-emerald-700 underline hover:text-emerald-900"
              >
                Log your first action for the challenge →
              </Link>
            </div>
          ) : (
            submissions.map((sub) => {
              const actionDetails = ECO_ACTIONS_MAP[sub.eco_action_id]
              const points = (actionDetails?.points || 0) * sub.quantity

              return (
                <div
                  key={sub.id}
                  className="p-5 flex items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-neutral-900">
                        {actionDetails?.title || 'Eco Action'}
                      </span>
                      <span
                        className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          sub.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-neutral-400">
                      Quantity: {sub.quantity} • {new Date(sub.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shrink-0">
                    +{points} pts
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

    </div>
  )
}
