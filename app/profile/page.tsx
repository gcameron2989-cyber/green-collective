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
  reflection_note?: string
}

interface UserProfile {
  display_name: string
  community: string
  is_best_301: boolean
  avatar_emoji: string
}

const ECO_ACTIONS_MAP: Record<string, { title: string; points: number; category: string }> = {
  'home-meal': { category: 'Zero Waste & Dining', title: 'Brought Lunch/Snacks from Home', points: 30 },
  'home-beverage': { category: 'Zero Waste & Dining', title: 'Brought Coffee/Tea from Home', points: 25 },
  'reusable-container-buy': { category: 'Zero Waste & Dining', title: 'Used Reusable Container/Mug', points: 15 },
  'refillable-water': { category: 'Zero Waste & Dining', title: 'Used Refillable Water Bottle', points: 20 },
  'plant-based-meal': { category: 'Zero Waste & Dining', title: 'Chose 100% Plant-Based Dining', points: 20 },
  'sustainable-commute': { category: 'Mobility & Energy', title: 'Commuted via Transit, Cycling, or Walking', points: 25 },
  'carpool-trip': { category: 'Mobility & Energy', title: 'Shared Ride / Carpooled to Campus', points: 20 },
  'stairs-instead-elevator': { category: 'Mobility & Energy', title: 'Took Stairs Instead of Elevator', points: 10 },
  'waste-sorting': { category: 'Circular Economy', title: 'Properly Sorted Compost & Recycling', points: 10 },
  'thrift-borrow-gear': { category: 'Circular Economy', title: 'Borrowed/Thrifted Academic Gear', points: 30 },
  'campus-cleanup': { category: 'Circular Economy', title: 'Participated in Campus Clean-up', points: 50 },
}

export default function UserProfilePage() {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      setUserEmail(user.email || 'UBC Participant')

      // 1. Fetch Profile Data (Avatar, Community, BEST 301 Status)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('display_name, community, is_best_301, avatar_emoji')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData as UserProfile)
      }

      // 2. Fetch Submissions
      const { data: userSubmissions, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && userSubmissions) {
        setSubmissions(userSubmissions as unknown as UserSubmission[])
      }
      setLoading(false)
    }

    fetchUserData()
  }, [router, supabase])

  // Math & Stats
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved')
  const totalPoints = approvedSubmissions.reduce(
    (sum, s) => sum + (ECO_ACTIONS_MAP[s.eco_action_id]?.points || 0) * s.quantity,
    0
  )
  const totalActionsLogged = approvedSubmissions.reduce((sum, s) => sum + s.quantity, 0)
  const zeroWasteCount = approvedSubmissions.filter((s) => ECO_ACTIONS_MAP[s.eco_action_id]?.category === 'Zero Waste & Dining').reduce((sum, s) => sum + s.quantity, 0)
  const transitCount = approvedSubmissions.filter((s) => ECO_ACTIONS_MAP[s.eco_action_id]?.category === 'Mobility & Energy').reduce((sum, s) => sum + s.quantity, 0)

  const co2OffsetKg = (totalActionsLogged * 0.6).toFixed(1)
  const challengeTarget = 150
  const challengeProgress = Math.min(Math.round((totalPoints / challengeTarget) * 100), 100)

  // Calculate Streak (Unique Days Logged)
  const uniqueDays = new Set(approvedSubmissions.map(s => new Date(s.created_at).toDateString())).size

  const badges = [
    { name: 'First Step', desc: 'Log 1 eco-action', unlocked: totalActionsLogged >= 1, icon: '🌱' },
    { name: 'Zero Waste Hero', desc: '5+ zero-waste choices', unlocked: zeroWasteCount >= 5, icon: '♻️' },
    { name: 'Commuter Pro', desc: '5+ green commutes', unlocked: transitCount >= 5, icon: '🚲' },
    { name: 'UBC Finisher', desc: 'Earn 150+ challenge pts', unlocked: totalPoints >= 150, icon: '🏆' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      {/* Cover Photo Header (Strava Vibe) */}
      <div className="h-40 bg-gradient-to-r from-[#0f382c] to-[#1a5c48] w-full"></div>
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 -mt-16">
        
        {/* User Identity Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 relative pt-16">
          <div className="w-24 h-24 bg-emerald-100 rounded-full border-4 border-white flex items-center justify-center text-5xl shadow-sm absolute -top-12 left-6">
            {profile?.avatar_emoji || "🌲"}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                {profile?.display_name || userEmail?.split('@')[0] || "Eco Warrior"}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm font-medium text-gray-500">
                <span className="flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-md">
                  📍 {profile?.community || "Vancouver"}
                </span>
                {profile?.is_best_301 && (
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">
                    BEST 301 Cohort
                  </span>
                )}
              </div>
            </div>
            
            <Link 
              href="/competition/submit" 
              className="px-5 py-2.5 bg-[#0f382c] text-white rounded-xl text-xs font-bold shadow-md hover:bg-emerald-900 transition flex items-center gap-2 uppercase tracking-wider shrink-0"
            >
              + Log Action
            </Link>
          </div>
        </div>

        {/* Gamified Progress Bar */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm mb-6 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-bold text-neutral-900 uppercase tracking-wider">
              Faculty Target (150 Pts Goal)
            </span>
            <span className="font-extrabold text-emerald-700">{challengeProgress}%</span>
          </div>
          <div className="w-full h-4 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#0f382c] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${challengeProgress}%` }}
            />
          </div>
        </div>

        {/* Stats Grid (Duolingo Vibe) */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-1">🔥</span>
            <p className="text-2xl font-black text-gray-900">{loading ? '-' : uniqueDays}</p>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Day Streak</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-1">🌍</span>
            <p className="text-2xl font-black text-emerald-600">{loading ? '-' : co2OffsetKg}</p>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">KG CO₂ Saved</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-1">⚡</span>
            <p className="text-2xl font-black text-[#0f382c]">{loading ? '-' : totalPoints}</p>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Impact Score</p>
          </div>
        </div>

        {/* Badges Collection */}
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3 px-1">Milestones & Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl text-center flex flex-col items-center justify-center transition border ${
                badge.unlocked ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60 grayscale'
              }`}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <div className="text-xs font-bold text-neutral-900 leading-tight">{badge.name}</div>
              <span className={`mt-2 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase ${badge.unlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-500'}`}>
                {badge.unlocked ? 'UNLOCKED' : 'LOCKED'}
              </span>
            </div>
          ))}
        </div>

        {/* Activity Feed (Strava Vibe) */}
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3 px-1">Pilot Activity Feed</h2>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-xs font-mono text-neutral-400 animate-pulse bg-white rounded-2xl border border-gray-200">
              Loading activity history...
            </div>
          ) : submissions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-300 text-center">
              <div className="text-4xl mb-3">🌱</div>
              <p className="text-gray-500 font-medium">Your feed is empty.</p>
              <p className="text-sm text-gray-400 mt-1 mb-4">Log your first action to start your streak.</p>
              <Link href="/competition/submit" className="font-mono text-xs font-bold text-emerald-700 hover:underline uppercase tracking-wide">
                Log your first action →
              </Link>
            </div>
          ) : (
            submissions.map((sub) => {
              const actionDetails = ECO_ACTIONS_MAP[sub.eco_action_id]
              const points = (actionDetails?.points || 0) * sub.quantity

              return (
                <div key={sub.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Header: User & Time */}
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-sm shadow-inner">
                        {profile?.avatar_emoji || "🌲"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{profile?.display_name || userEmail?.split('@')[0]}</p>
                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                          {new Date(sub.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      sub.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                  
                  {/* Body: Action details */}
                  <div className="p-4">
                    <h3 className="font-bold text-base text-gray-900">{actionDetails?.title || 'Eco Action'}</h3>
                    {sub.reflection_note && (
                      <p className="text-gray-700 text-sm mt-2 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                        "{sub.reflection_note}"
                      </p>
                    )}
                    
                    {/* Action Metrics */}
                    <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-gray-50">
                      <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Category</p>
                        <p className="text-xs font-medium text-gray-700">{actionDetails?.category}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Quantity</p>
                        <p className="text-xs font-medium text-gray-700">{sub.quantity}x</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-[9px] text-emerald-700/70 font-bold uppercase tracking-wider">Earned</p>
                        <p className="font-bold text-emerald-700">+{points} pts</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
