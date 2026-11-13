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

      const { data: profileData } = await supabase
        .from('profiles')
        .select('display_name, community, is_best_301, avatar_emoji')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData as UserProfile)
      }

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
  const uniqueDays = new Set(approvedSubmissions.map(s => new Date(s.created_at).toDateString())).size

  const badges = [
    { name: 'FIRST STEP', desc: 'Log 1 eco-action', unlocked: totalActionsLogged >= 1 },
    { name: 'ZERO WASTE', desc: '5+ zero-waste choices', unlocked: zeroWasteCount >= 5 },
    { name: 'COMMUTER', desc: '5+ green commutes', unlocked: transitCount >= 5 },
    { name: 'FINISHER', desc: 'Earn 150+ challenge pts', unlocked: totalPoints >= 150 },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-sans antialiased pb-20">
      <main className="max-w-5xl mx-auto px-6 pt-12 pb-16">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-end gap-6">
            <div className="w-16 h-16 bg-gray-100 border border-gray-300 flex items-center justify-center text-2xl shadow-sm">
              {profile?.avatar_emoji || "🌲"}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">
                {profile?.display_name || userEmail?.split('@')[0] || "Participant Profile"}
              </h1>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-gray-500">
                <span>{profile?.community || "Vancouver"}</span>
                {profile?.is_best_301 && (
                  <>
                    <span>•</span>
                    <span className="text-[#0F2C23] font-bold">BEST 301 COHORT</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Link 
            href="/competition/submit" 
            className="px-5 py-2.5 bg-[#0F2C23] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-black transition self-start md:self-auto"
          >
            + LOG ACTION
          </Link>
        </div>

        {/* Professional Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 p-5">
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-2">Impact Score</p>
            <p className="text-3xl font-bold text-[#0F2C23]">{loading ? '-' : totalPoints}</p>
          </div>
          <div className="bg-white border border-gray-200 p-5">
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-2">KG CO₂ Avoided</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '-' : co2OffsetKg}</p>
          </div>
          <div className="bg-white border border-gray-200 p-5">
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-2">Active Streak</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '-' : uniqueDays}</p>
          </div>
          <div className="bg-white border border-gray-200 p-5">
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-2">Faculty Target</p>
            <div className="flex items-end gap-2 mb-1">
              <p className="text-3xl font-bold text-gray-900">{challengeProgress}%</p>
            </div>
            <div className="w-full h-1 bg-gray-100 mt-2">
              <div className="h-full bg-[#0F2C23] transition-all" style={{ width: `${challengeProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Badges - Minimalist Grid */}
        <div className="mb-10">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-900 mb-4">Milestones</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, idx) => (
              <div key={idx} className={`border p-4 transition ${badge.unlocked ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`font-mono text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider ${badge.unlocked ? 'bg-[#0F2C23] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {badge.unlocked ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">{badge.name}</h3>
                <p className="text-[11px] text-gray-500 mt-1">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log - Audit Trail Style */}
        <div>
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-900 mb-4">Pilot Activity Log</h2>
          <div className="bg-white border border-gray-200">
            {loading ? (
              <div className="p-8 text-center text-xs font-mono text-gray-400">Loading audit log...</div>
            ) : submissions.length === 0 ? (
              <div className="p-12 text-center border-b border-gray-200 last:border-0">
                <p className="text-sm text-gray-500 mb-2">No verified actions recorded.</p>
                <Link href="/competition/submit" className="font-mono text-xs font-bold text-[#0F2C23] hover:underline uppercase tracking-wide">
                  Initialize Pilot Log →
                </Link>
              </div>
            ) : (
              submissions.map((sub, idx) => {
                const actionDetails = ECO_ACTIONS_MAP[sub.eco_action_id]
                const points = (actionDetails?.points || 0) * sub.quantity

                return (
                  <div key={sub.id} className="p-5 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition flex flex-col md:flex-row gap-4 justify-between md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`font-mono text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider ${
                          sub.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sub.status}
                        </span>
                        <span className="font-mono text-[10px] text-gray-400">
                          {new Date(sub.created_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-gray-900">{actionDetails?.title || 'System Action'}</h3>
                      {sub.reflection_note && (
                        <p className="text-xs text-gray-600 mt-2 border-l-2 border-gray-200 pl-3 italic">
                          "{sub.reflection_note}"
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-6 md:text-right shrink-0">
                      <div>
                        <p className="text-[9px] font-mono text-gray-400 uppercase tracking-wider mb-0.5">Qty</p>
                        <p className="text-xs font-medium text-gray-900">{sub.quantity}x</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-mono text-gray-400 uppercase tracking-wider mb-0.5">Earned</p>
                        <p className="text-xs font-bold text-[#0F2C23]">+{points} PTS</p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
