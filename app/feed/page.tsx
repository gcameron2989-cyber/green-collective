'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface FeedItem {
  id: string
  user_id: string
  action_id: string
  action_name: string
  quantity: number
  points_earned?: number
  points?: number
  notes?: string
  created_at: string
  username?: string
}

export default function CollectiveFeedPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    const fetchCollectiveFeed = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      setCurrentUserId(user.id)

      // 1. Get IDs of users the current user is following
      const { data: connections } = await supabase
        .from('connections')
        .select('following_id')
        .eq('follower_id', user.id)

      const followingIds = connections?.map(c => c.following_id) || []

      // Also include the current user's own ID so they can see their own feed stream if desired
      followingIds.push(user.id)

      if (followingIds.length === 0) {
        setLoading(false)
        return
      }

      // 2. Fetch recent logged actions for all followed users
      const { data: actions } = await supabase
        .from('logged_actions')
        .select('*')
        .in('user_id', followingIds)
        .order('created_at', { ascending: false })
        .limit(30)

      if (actions && actions.length > 0) {
        // 3. Fetch usernames for these user IDs
        const uniqueUserIds = Array.from(new Set(actions.map(a => a.user_id)))
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', uniqueUserIds)

        const userMap: { [id: string]: string } = {}
        profiles?.forEach(p => {
          if (p.id && p.username) userMap[p.id] = p.username
        })

        const enrichedActions: FeedItem[] = actions.map(act => ({
          ...act,
          username: userMap[act.user_id] || 'Collective Member'
        }))

        setFeedItems(enrichedActions)
      }

      setLoading(false)
    }

    fetchCollectiveFeed()
  }, [supabase])

  return (
    <main className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-24 font-sans">
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-4xl px-6 py-16 md:px-10">
          <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#39705d]">
            <span>Network Activity Stream</span>
            <Link href="/competition" className="text-[#526760] hover:text-[#102f26]">
              ← Leaderboard &amp; Members
            </Link>
          </div>
          <h1 className="text-3xl font-medium tracking-tight md:text-5xl text-[#102f26]">
            Collective Feed
          </h1>
          <p className="mt-2 text-sm text-[#526760]">
            Real-time sustainability actions logged by members you&apos;ve joined in your collective network.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        {!currentUserId ? (
          <div className="p-12 border border-[#102f26]/15 bg-white text-center font-mono text-xs text-[#526760]">
            Please sign in to view your collective feed.
          </div>
        ) : loading ? (
          <div className="p-12 border border-[#102f26]/15 bg-white text-center font-mono text-xs text-[#526760]">
            Loading network stream...
          </div>
        ) : feedItems.length === 0 ? (
          <div className="p-12 border border-dashed border-[#102f26]/20 bg-white text-center space-y-4">
            <p className="font-mono text-xs text-[#526760]">Your feed is quiet right now.</p>
            <p className="text-xs text-[#71847d]">
              Visit the <Link href="/competition" className="underline text-[#102f26] font-bold">Leaderboard</Link> to click on peer profiles and join their collectives!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedItems.map((item) => (
              <div 
                key={item.id} 
                className="p-6 border border-[#102f26]/15 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-[#102f26]"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/profile/${item.user_id}`} className="font-mono text-xs font-bold text-[#39705d] hover:underline">
                      @{item.username}
                    </Link>
                    <span className="text-neutral-300">•</span>
                    <span className="font-mono text-[10px] text-[#71847d]">
                      {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-[#102f26]">{item.action_name}</h3>
                  <p className="font-mono text-[11px] text-[#526760]">
                    Quantity: {item.quantity} {item.notes ? `• ${item.notes}` : ''}
                  </p>
                </div>

                <div className="font-mono text-xs font-bold text-[#102f26] bg-[#f1f6f2] px-3.5 py-2 rounded-lg border border-[#102f26]/10 text-right">
                  +{Number(item.points_earned ?? item.points ?? 0)} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
