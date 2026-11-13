'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ACTION_REGISTRY } from '@/lib/actions'

interface LoggedActionRow {
  id: string
  created_at: string
  quantity: number
  points: number
  points_earned?: number
  action_id: string
  action_name: string
  notes?: string
  sector?: string
  affiliation_name?: string
}

function ProfileContent() {
  const [submissions, setSubmissions] = useState<LoggedActionRow[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [displayName, setDisplayName] = useState<string>('UBC Participant')
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false)
  const [customUsername, setCustomUsername] = useState<string>('')

  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      // 1. Try fetching from public profiles table safely without .single()
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)

      const emailHandle = user.email ? user.email.split('@')[0] : 'UBC Participant'
      const existingProfileUsername = profileData && profileData.length > 0 ? profileData[0].username : null
      const savedUsername = existingProfileUsername || user.user_metadata?.username || emailHandle
      
      setDisplayName(savedUsername)
      setCustomUsername(savedUsername)

      const { data: userSubmissions, error } = await supabase
        .from('logged_actions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && userSubmissions) {
        setSubmissions(userSubmissions as LoggedActionRow[])
      }
      setLoading(false)
    }

    fetchUserProfile()
  }, [router, searchParams, supabase])

  const handleSaveUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customUsername.trim()) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const trimmedName = customUsername.trim()

    // 1. Update Auth user metadata
    await supabase.auth.updateUser({
      data: { username: trimmedName }
    })

    // 2. Upsert into public profiles table with fallback handling
    const { error } = await supabase
      .from('profiles')
      .upsert(
        { id: user.id, username: trimmedName, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      )

    if (error) {
      console.error('Error saving username:', error.message)
      alert(`Could not save username: ${error.message}`)
      return
    }

    setDisplayName(trimmedName)
    setIsEditingUsername(false)
  }

  const totalPoints = submissions.reduce(
    (sum, s) => sum + Number(s.points_earned ?? s.points ?? 0),
    0
  )
  const totalActionsLogged = submissions.reduce((sum, s) => sum + Number(s.quantity || 1), 0)
  
  // Precise CO2 Calculation matching Log-Action & Competition distance-aware rules
  const totalCo2Avoided = submissions.reduce((sum, s) => {
    const qty = Number(s.quantity || 1)
    const registryMatch = ACTION_REGISTRY.find((a) => a.id === s.action_id)
    
    let baseImpact = Number(registryMatch?.impactValue ?? 0.5)

    if (["active-transit", "public-transit", "ev-rideshare", "carpool-fossil"].includes(s.action_id)) {
      const distMatch = s.notes?.match(/Distance:\s*([\d.]+)\s*km/)
      const dist = distMatch ? parseFloat(distMatch[1]) : 5

      if (s.action_id === "active-transit") baseImpact = dist * 0.25
      else if (s.action_id === "public-transit") baseImpact = dist * 0.18
      else if (s.action_id === "ev-rideshare") baseImpact = dist * 0.32
      else if (s.action_id === "carpool-fossil") baseImpact = dist * 0.15
    }

    return sum + (baseImpact * qty)
  }, 0)

  const co2OffsetKg = totalCo2Avoided.toFixed(1)

  const zeroWasteCount = submissions
    .filter((s) => s.action_name?.toLowerCase().includes('zero waste') || s.action_name?.toLowerCase().includes('container') || s.action_name?.toLowerCase().includes('meal'))
    .reduce((sum, s) => sum + Number(s.quantity || 1), 0)

  const transitCount = submissions
    .filter((s) => s.action_name?.toLowerCase().includes('transit') || s.action_name?.toLowerCase().includes('commute') || s.action_name?.toLowerCase().includes('ride'))
    .reduce((sum, s) => sum + Number(s.quantity || 1), 0)

  const singleUseSaved = zeroWasteCount * 1
  const challengeTarget = 150
  const challengeProgress = Math.min(Math.round((totalPoints / challengeTarget) * 100), 100)

  const badges = [
    { name: 'First Step', desc: 'Log 1 eco-action', unlocked: totalActionsLogged >= 1, icon: '🌱' },
    { name: 'Zero Waste Hero', desc: '5+ zero-waste choices', unlocked: zeroWasteCount >= 5, icon: '♻️' },
    { name: 'Commuter Pro', desc: '5+ green commutes', unlocked: transitCount >= 5, icon: '🚲' },
    { name: 'UBC Challenge Finisher', desc: 'Earn 150+ challenge pts', unlocked: totalPoints >= 150, icon: '🏆' },
  ]

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 space-y-10 font-sans bg-white text-neutral-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] uppercase tracking-wider bg-emerald-50 text-emerald-800 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            UBC Sustainability Challenge
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Personal Impact Hub
          </h1>
          
          <div className="flex items-center gap-3 pt-1">
            <p className="text-xs font-mono text-neutral-500">
              Account Handle: <span className="font-semibold text-emerald-800">@{displayName}</span>
            </p>
            {!isEditingUsername ? (
              <button
                type="button"
                onClick={() => setIsEditingUsername(true)}
                className="text-[10px] font-mono text-emerald-700 underline hover:text-emerald-900"
              >
                [Edit Username]
              </button>
            ) : (
              <form onSubmit={handleSaveUsername} className="flex items-center gap-2">
                <input
                  type="text"
                  value={customUsername}
                  onChange={(e) => setCustomUsername(e.target.value)}
                  className="px-2 py-1 text-xs border border-emerald-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  placeholder="Enter username"
                  maxLength={25}
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-[#0f382c] text-white text-[10px] font-mono rounded-lg hover:bg-emerald-900"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingUsername(false)}
                  className="text-[10px] font-mono text-neutral-400 hover:text-neutral-700"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>

        <Link
          href="/log-action"
          className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#0f382c] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-emerald-900 transition shadow-sm"
        >
          + Log Eco Action
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="p-7 rounded-2xl bg-neutral-50 space-y-3 border border-neutral-200/60">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="font-bold text-neutral-900 uppercase tracking-wider">
            Faculty Challenge Target (150 Pts Goal)
          </span>
          <span className="font-extrabold text-emerald-700">{challengeProgress}% Complete</span>
        </div>
        <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${challengeProgress}%` }}
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Total Points</span>
          <div className="text-3xl font-extrabold text-neutral-900">{loading ? '...' : totalPoints}</div>
          <p className="text-[11px] text-emerald-700 font-medium">Verified credits</p>
        </div>
        <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Actions Logged</span>
          <div className="text-3xl font-extrabold text-neutral-900">{loading ? '...' : totalActionsLogged}</div>
          <p className="text-[11px] text-emerald-700 font-medium">Total submissions</p>
        </div>
        <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Est. CO₂ Avoided</span>
          <div className="text-3xl font-extrabold text-neutral-900">{loading ? '...' : `${co2OffsetKg} kg`}</div>
          <p className="text-[11px] text-emerald-700 font-medium">Emissions offset</p>
        </div>
        <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Items Diverted</span>
          <div className="text-3xl font-extrabold text-neutral-900">{loading ? '...' : singleUseSaved}</div>
          <p className="text-[11px] text-emerald-700 font-medium">Zero-waste choices</p>
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-neutral-900">Milestones &amp; Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl text-center space-y-3 transition border ${
                badge.unlocked ? 'bg-neutral-50 border-neutral-200/60 text-neutral-900' : 'bg-neutral-100/50 border-transparent opacity-40 grayscale'
              }`}
            >
              <div className="text-3xl">{badge.icon}</div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-neutral-900">{badge.name}</div>
                <div className="text-[11px] text-neutral-500 leading-snug">{badge.desc}</div>
              </div>
              <span className={`inline-block font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-md ${badge.unlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'}`}>
                {badge.unlocked ? 'UNLOCKED' : 'LOCKED'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Stream */}
      <div className="space-y-4 pb-12">
        <h2 className="text-base font-bold text-neutral-900">Activity History</h2>
        <div className="rounded-2xl bg-neutral-50 border border-neutral-200/60 p-6 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-xs font-mono text-neutral-400 animate-pulse">
              Loading activity history...
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-xs text-neutral-500 space-y-2">
              <p>No eco-actions logged under your account yet.</p>
              <Link href="/log-action" className="font-mono text-xs font-bold text-emerald-700 underline">
                Log your first action →
              </Link>
            </div>
          ) : (
            submissions.map((sub) => {
              const pts = Number(sub.points_earned ?? sub.points ?? 0)

              return (
                <div key={sub.id} className="p-4 rounded-xl bg-white border border-neutral-200/70 flex items-center justify-between gap-4 shadow-2xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-neutral-900">
                        {sub.action_name || 'Sustainable Action'}
                      </span>
                      <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        {sub.sector || 'verified'}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-neutral-500">
                      Qty: {sub.quantity} • {new Date(sub.created_at).toLocaleDateString()} {sub.affiliation_name ? `• ${sub.affiliation_name}` : ''}
                    </p>
                    {sub.notes && (
                      <p className="text-[10px] text-neutral-400 font-mono italic">
                        {sub.notes}
                      </p>
                    )}
                  </div>
                  <div className="font-mono text-xs font-bold text-emerald-800 shrink-0 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                    +{pts} pts
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

export default function UserProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-mono text-xs text-neutral-400">Loading Profile...</div>}>
      <ProfileContent />
    </Suspense>
  )
}
