'use client'

import React, { useEffect, useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ACTION_REGISTRY } from '@/lib/actions'

interface StudentStanding {
  userId: string
  username: string
  totalPoints: number
  carbonOffsetKg: number
  actionsCount: number
}

export default function SubLeaderboardPage({ 
  params 
}: { 
  params: Promise<{ type: string; name: string }> 
}) {
  const resolvedParams = use(params)
  const tierType = resolvedParams.type // 'org', 'faculty', or 'neighborhood'
  const entityName = decodeURIComponent(resolvedParams.name)

  const [standings, setStandings] = useState<StudentStanding[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchSubgroupData = async () => {
      setLoading(true)
      try {
        const { data: profiles } = await supabase.from('profiles').select('id, username')
        const usernameMap: { [id: string]: string } = {}
        profiles?.forEach((p) => {
          if (p.id && p.username) usernameMap[p.id] = p.username
        })

        const { data: actions, error } = await supabase
          .from('logged_actions')
          .select('*')

        if (error) throw error

        const userImpactMap: { [userId: string]: { points: number; carbon: number; count: number } } = {}

        actions?.forEach((act) => {
          const matchesEntity = act.affiliation_name?.includes(entityName) || act.notes?.includes(entityName)

          if (matchesEntity && act.user_id) {
            const qty = Number(act.quantity || 1)
            const registryMatch = ACTION_REGISTRY.find((a) => a.id === act.action_id)
            let baseImpact = Number(registryMatch?.impactValue ?? 0.5)
            const pointsEarned = Number(act.points_earned ?? act.points ?? (registryMatch?.points ? registryMatch.points * qty : 10))

            if (["active-transit", "public-transit", "ev-rideshare", "carpool-fossil"].includes(act.action_id)) {
              const distMatch = act.notes?.match(/Distance:\s*([\d.]+)\s*km/)
              const dist = distMatch ? parseFloat(distMatch[1]) : 5

              if (act.action_id === "active-transit") baseImpact = dist * 0.25
              else if (act.action_id === "public-transit") baseImpact = dist * 0.18
              else if (act.action_id === "ev-rideshare") baseImpact = dist * 0.32
              else if (act.action_id === "carpool-fossil") baseImpact = dist * 0.15
            }

            const carbon = baseImpact * (["active-transit", "public-transit", "ev-rideshare", "carpool-fossil"].includes(act.action_id) ? 1 : qty)

            if (!userImpactMap[act.user_id]) {
              userImpactMap[act.user_id] = { points: 0, carbon: 0, count: 0 }
            }
            userImpactMap[act.user_id].points += pointsEarned
            userImpactMap[act.user_id].carbon += carbon
            userImpactMap[act.user_id].count += 1
          }
        })

        const computedStandings: StudentStanding[] = Object.entries(userImpactMap).map(([userId, data]) => ({
          userId,
          username: usernameMap[userId] || `Contributor_${userId.slice(0, 4)}`,
          totalPoints: data.points,
          carbonOffsetKg: Math.round(data.carbon * 10) / 10,
          actionsCount: data.count,
        })).sort((a, b) => b.totalPoints - a.totalPoints || b.carbonOffsetKg - a.carbonOffsetKg)

        setStandings(computedStandings)
      } catch (err) {
        console.error('Error loading sub-leaderboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubgroupData()
  }, [tierType, entityName, supabase])

  const totalEntityCarbon = standings.reduce((acc, curr) => acc + curr.carbonOffsetKg, 0)
  const totalEntityPoints = standings.reduce((acc, curr) => acc + curr.totalPoints, 0)

  return (
    <main className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-24 font-sans">
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#39705d]">
              {tierType === 'org' ? 'Organization Sub-Leaderboard' : 'Community Hub Sub-Leaderboard'}
            </span>
            <Link href="/leaderboard" className="font-mono text-xs text-[#526760] hover:underline">
              ← Back to Global Rankings
            </Link>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#102f26]">
            {entityName}
          </h1>
          <p className="mt-2 text-sm text-[#526760]">
            Top individual contributors and member rankings within this collective.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-white rounded-xl border border-[#102f26]/10">
              <span className="font-mono text-[10px] uppercase text-[#526760] block">Total Carbon Avoided</span>
              <span className="text-xl font-bold text-[#39705d]">~{totalEntityCarbon.toLocaleString()} kg CO₂e</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#102f26]/10">
              <span className="font-mono text-[10px] uppercase text-[#526760] block">Total Challenge Points</span>
              <span className="text-xl font-bold text-[#102f26]">+{totalEntityPoints.toLocaleString()} pts</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#102f26]/10 col-span-2 sm:col-span-1">
              <span className="font-mono text-[10px] uppercase text-[#526760] block">Active Contributors</span>
              <span className="text-xl font-bold text-[#102f26]">{standings.length} members</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-sm font-mono uppercase tracking-wider text-[#102f26] mb-6">
          Member Rankings
        </h2>

        {loading ? (
          <div className="p-12 bg-white border border-[#102f26]/15 text-center font-mono text-xs text-[#526760]">
            Calculating subgroup standings...
          </div>
        ) : standings.length === 0 ? (
          <div className="p-12 bg-white border border-dashed border-[#102f26]/20 text-center font-mono text-xs text-[#526760]">
            No members have logged actions under {entityName} yet.
          </div>
        ) : (
          <div className="space-y-3">
            {standings.map((student, idx) => (
              <div 
                key={student.userId}
                className="p-5 bg-white border border-[#102f26]/15 rounded-xl flex items-center justify-between gap-4 shadow-sm hover:border-[#102f26] transition"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-base font-bold text-[#39705d] w-6">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <div>
                    <Link href={`/profile/${student.userId}`} className="text-base font-bold text-[#102f26] hover:underline">
                      @{student.username}
                    </Link>
                    <p className="font-mono text-[10px] text-[#526760] mt-0.5">
                      {student.actionsCount} actions logged
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <span className="font-mono text-xs font-bold text-[#39705d] block">
                      ~{student.carbonOffsetKg} kg CO₂e
                    </span>
                  </div>
                  <div className="text-right bg-[#f1f6f2] px-3 py-1.5 rounded-lg border border-[#102f26]/10">
                    <span className="font-mono text-xs font-bold text-[#102f26] block">
                      +{student.totalPoints} pts
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
