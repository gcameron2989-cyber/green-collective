import React from 'react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

const ECO_ACTIONS_MAP: Record<string, { pointsPerUnit: number }> = {
  'transit-commute': { pointsPerUnit: 1 },
  'active-commute': { pointsPerUnit: 10 },
  'carpool-trip': { pointsPerUnit: 3 },
  'stairs-instead-elevator': { pointsPerUnit: 3 },
  'home-meal': { pointsPerUnit: 30 },
  'home-beverage': { pointsPerUnit: 25 },
  'reusable-container-buy': { pointsPerUnit: 15 },
  'refillable-water': { pointsPerUnit: 10 },
  'plant-based-meal': { pointsPerUnit: 20 },
  'waste-sorting': { pointsPerUnit: 10 },
  'thrift-borrow-gear': { pointsPerUnit: 30 },
  'campus-cleanup': { pointsPerUnit: 50 },
  'ubc-forestry-field': { pointsPerUnit: 50 },
}

export default async function CommunityHubPage({ params }: PageProps) {
  const { slug } = await params
  
  // Reconstruct readable community name from slug (e.g., "kitsilano" -> "Kitsilano")
  const communityName = decodeURIComponent(slug)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const supabase = await createClient()

  // 1. Fetch profiles belonging to this community
  const { data: members } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_emoji, is_best_301')
    .ilike('community', `%${communityName}%`)

  const memberIds = members?.map(m => m.id) || []

  // 2. Fetch approved submissions for these members
  let communitySubmissions: any[] = []
  if (memberIds.length > 0) {
    const { data: subs } = await supabase
      .from('submissions')
      .select('*')
      .in('user_id', memberIds)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      
    if (subs) communitySubmissions = subs
  }

  // 3. Compute Metrics
  const totalMembers = members?.length || 0
  const totalActions = communitySubmissions.length
  
  const totalPoints = communitySubmissions.reduce((sum, s) => {
    const rate = ECO_ACTIONS_MAP[s.eco_action_id]?.pointsPerUnit || 20;
    return sum + (rate * s.quantity);
  }, 0);

  const totalCO2Kg = (totalActions * 0.6).toFixed(1)

  return (
    <div className="min-h-screen bg-[#f9f8f6] text-[#102f26] font-sans pb-24">
      {/* Header Banner */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2] py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <Link href="/competition" className="font-mono text-xs text-[#39705d] hover:underline uppercase tracking-widest">
              ← Back to Global Rankings
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-widest bg-[#102f26] text-white px-3 py-1 font-bold">
              Regional Hub
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#102f26] mb-3">
            📍 {communityName}
          </h1>
          <p className="text-sm text-[#526760] font-mono">
            Localized bioeconomy tracking and collective neighborhood action network.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        
        {/* Hub Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#102f26]/15 p-5 shadow-2xs">
            <p className="font-mono text-[10px] text-[#39705d] uppercase tracking-wider mb-1">Active Members</p>
            <p className="text-3xl font-bold text-[#102f26]">{totalMembers}</p>
          </div>
          <div className="bg-white border border-[#102f26]/15 p-5 shadow-2xs">
            <p className="font-mono text-[10px] text-[#39705d] uppercase tracking-wider mb-1">Impact Score</p>
            <p className="text-3xl font-bold text-[#102f26]">{totalPoints}</p>
          </div>
          <div className="bg-white border border-[#102f26]/15 p-5 shadow-2xs">
            <p className="font-mono text-[10px] text-[#39705d] uppercase tracking-wider mb-1">Verified Actions</p>
            <p className="text-3xl font-bold text-[#102f26]">{totalActions}</p>
          </div>
          <div className="bg-white border border-[#102f26]/15 p-5 shadow-2xs">
            <p className="font-mono text-[10px] text-[#39705d] uppercase tracking-wider mb-1">Est. CO₂ Offset</p>
            <p className="text-3xl font-bold text-[#39705d]">{totalCO2Kg} kg</p>
          </div>
        </div>

        {/* Member Roster Preview */}
        <div className="bg-white border border-[#102f26]/15 p-6 shadow-2xs">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#39705d] font-bold mb-4 pb-2 border-b border-[#102f26]/10">
            Hub Contributors ({totalMembers})
          </h2>
          {totalMembers === 0 ? (
            <p className="text-xs text-[#526760] font-mono py-4 text-center">
              No members have set their profile to {communityName} yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {members?.map(m => (
                <div key={m.id} className="flex items-center gap-2 bg-[#f9f8f6] border border-[#102f26]/10 px-3 py-2 rounded-lg">
                  <span className="text-lg">{m.avatar_emoji || '🌲'}</span>
                  <div>
                    <p className="text-xs font-bold text-[#102f26]">{m.display_name || 'Member'}</p>
                    {m.is_best_301 && <span className="text-[9px] font-mono text-[#39705d] uppercase">BEST 301</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Community Activity Feed */}
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#39705d] font-bold mb-4 pb-2 border-b border-[#102f26]/10">
            {communityName} Activity Stream
          </h2>
          
          <div className="space-y-4">
            {communitySubmissions.length === 0 ? (
              <div className="bg-white border border-[#102f26]/15 p-12 text-center text-xs font-mono text-[#526760]">
                No community actions logged yet. Be the first in {communityName} to log an action!
              </div>
            ) : (
              communitySubmissions.map((sub) => {
                const member = members?.find(m => m.id === sub.user_id)
                const rate = ECO_ACTIONS_MAP[sub.eco_action_id]?.pointsPerUnit || 20
                const earned = rate * sub.quantity

                return (
                  <div key={sub.id} className="bg-white border border-[#102f26]/15 p-5 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center shadow-2xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{member?.avatar_emoji || '🌲'}</span>
                        <span className="text-xs font-bold text-[#102f26]">{member?.display_name || 'Anonymous Member'}</span>
                        <span className="text-[10px] font-mono text-[#526760]">
                          • {new Date(sub.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#102f26] capitalize">
                        {sub.eco_action_id.replace(/-/g, ' ')} ({sub.quantity} units)
                      </p>
                      {sub.reflection_note && (
                        <p className="text-xs text-[#526760] italic border-l-2 border-[#39705d] pl-3 mt-2">
                          "{sub.reflection_note}"
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 bg-[#f1f6f2] px-3 py-1.5 border border-[#39705d]/20 text-right">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[#39705d]">Earned</p>
                      <p className="font-bold text-[#102f26]">+{earned} PTS</p>
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
