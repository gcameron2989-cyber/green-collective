'use client'

import React, { useEffect, useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface LoggedActionRow {
  id: string
  created_at: string
  quantity: number
  points: number
  points_earned?: number
  action_name: string
  notes?: string
  sector?: string
  affiliation_name?: string
}

export default function UserPublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const resolvedParams = use(params)
  const targetUserId = resolvedParams.userId

  const [username, setUsername] = useState<string>('User')
  const [submissions, setSubmissions] = useState<LoggedActionRow[]>([])
  const [isFollowing, setIsFollowing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [currentAuthId, setCurrentAuthId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchProfileAndActions = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setCurrentAuthId(user.id)

      // 1. Get target user's profile username
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', targetUserId)
        .single()

      if (profile?.username) {
        setUsername(profile.username)
      }

      // 2. Get target user's public actions
      const { data: actions } = await supabase
        .from('logged_actions')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })

      if (actions) setSubmissions(actions as LoggedActionRow[])

      // 3. Check if current user follows this target user
      if (user && user.id !== targetUserId) {
        const { data: connection } = await supabase
          .from('connections')
          .select('id')
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId)
          .single()

        if (connection) setIsFollowing(true)
      }

      setLoading(false)
    }

    fetchProfileAndActions()
  }, [targetUserId, supabase])

  const toggleFollow = async () => {
    if (!currentAuthId) {
      alert('Please sign in to join collectives.')
      return
    }

    if (isFollowing) {
      await supabase
        .from('connections')
        .delete()
        .eq('follower_id', currentAuthId)
        .eq('following_id', targetUserId)
      setIsFollowing(false)
    } else {
      await supabase
        .from('connections')
        .insert({ follower_id: currentAuthId, following_id: targetUserId })
      setIsFollowing(true)
    }
  }

  const totalPoints = submissions.reduce((sum, s) => sum + Number(s.points_earned ?? s.points ?? 0), 0)

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 space-y-8 font-sans bg-white text-neutral-900">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            Public Member Profile
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">@{username}</h1>
          <p className="text-xs font-mono text-neutral-500 mt-1">Total Impact Points: <span className="text-emerald-800 font-bold">{totalPoints} pts</span></p>
        </div>

        {currentAuthId && currentAuthId !== targetUserId && (
          <button
            onClick={toggleFollow}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition ${
              isFollowing 
                ? 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300' 
                : 'bg-[#0f382c] text-white hover:bg-emerald-900'
            }`}
          >
            {isFollowing ? '✓ Joined Collective' : '+ Join Their Collective'}
          </button>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-neutral-900">Activity Stream</h2>
        {loading ? (
          <div className="text-xs font-mono text-neutral-400 py-8">Loading member activity...</div>
        ) : submissions.length === 0 ? (
          <div className="p-8 border border-dashed rounded-xl text-center text-xs text-neutral-500 font-mono">
            This user hasn&apos;t logged any public eco-actions yet.
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div key={sub.id} className="p-4 rounded-xl border border-neutral-200 flex justify-between items-center bg-neutral-50/50">
                <div>
                  <div className="text-xs font-bold text-neutral-900">{sub.action_name}</div>
                  <div className="font-mono text-[11px] text-neutral-500">
                    Qty: {sub.quantity} • {new Date(sub.created_at).toLocaleDateString()} {sub.affiliation_name ? `• ${sub.affiliation_name}` : ''}
                  </div>
                  {sub.notes && <p className="text-[10px] text-neutral-400 font-mono italic mt-1">{sub.notes}</p>}
                </div>
                <div className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                  +{Number(sub.points_earned ?? sub.points ?? 0)} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-6">
        <Link href="/competition" className="font-mono text-xs text-emerald-700 underline">
          ← Back to Leaderboard
        </Link>
      </div>
    </div>
  )
}
