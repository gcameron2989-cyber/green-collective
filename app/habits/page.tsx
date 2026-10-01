'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface Faculty {
  id: string
  name: string
}

interface EcoAction {
  id: string
  category: string
  name: string
  description: string
  impact: string
  points: number
}

const ALL_ACTIONS: EcoAction[] = [
  { id: 'sustainable-commute', category: 'TRANSPORT', name: 'Public Transit Commute', description: 'Replaced a personal vehicle trip with Skytrain, bus, or SeaBus.', impact: '~2.04 kg CO₂e total', points: 25 },
  { id: 'active-transport', category: 'TRANSPORT', name: 'Active Transportation (Bike / Walk)', description: 'Chose cycling or walking instead of motorized transport.', impact: '~1.05 kg CO₂e total', points: 25 },
  { id: 'carpool-trip', category: 'TRANSPORT', name: 'Carpooling / EV Ride', description: 'Shared a vehicle trip with passengers or traveled via electric vehicle.', impact: '~1.8 kg CO₂e total', points: 20 },
  { id: 'plant-based-meal', category: 'FOOD', name: 'Plant-Forward Meal', description: 'Consumed a vegetarian or vegan meal, avoiding ruminant meats.', impact: '~1.5 kg CO₂e per meal', points: 20 },
  { id: 'local-produce', category: 'FOOD', name: 'Local / Seasonal Produce', description: 'Purchased or consumed locally grown regional produce.', impact: '~0.8 kg CO₂e per day', points: 15 },
  { id: 'zero-food-waste', category: 'FOOD', name: 'Zero Food Waste Meal', description: 'Successfully consumed or repurposed leftovers to prevent food waste.', impact: '~0.6 kg CO₂e per meal', points: 20 },
  { id: 'waste-sorting', category: 'WASTE', name: 'Waste Sorting', description: 'Sort recyclable, compostable, and landfill materials correctly.', impact: '~0.5 kg CO₂e per action', points: 10 },
  { id: 'cold-water-laundry', category: 'ENERGY', name: 'Cold-Water Laundry', description: 'Wash clothing using cold water instead of a hot cycle.', impact: '~0.6 kg CO₂e per load', points: 15 },
  { id: 'campus-cleanup', category: 'COMMUNITY', name: 'Campus Clean-up / Eco Event', description: 'Participated in campus sustainability clean-up or ecological restoration.', impact: '~4.0 kg CO₂e total', points: 50 },
]

function HabitsContent() {
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [selectedFaculty, setSelectedFaculty] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([])
  
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const actionParam = searchParams.get('action')
    if (actionParam) {
      setSelectedActionIds([actionParam])
    }

    const fetchFaculties = async () => {
      const { data, error } = await supabase
        .from('faculties')
        .select('id, name')
        .order('name', { ascending: true })

      if (!error && data) {
        setFaculties(data)
      }
    }
    fetchFaculties()
  }, [supabase, searchParams])

  // Sort actions so any preselected action from homepage appears at the top
  const prioritizedActions = [...ALL_ACTIONS].sort((a, b) => {
    const aSelected = selectedActionIds.includes(a.id) ? -1 : 0
    const bSelected = selectedActionIds.includes(b.id) ? -1 : 0
    return aSelected - bSelected
  })

  const filteredActions = prioritizedActions.filter((action) => {
    if (selectedCategory === 'ALL') return true
    return action.category === selectedCategory
  })

  const toggleActionSelection = (id: string) => {
    if (selectedActionIds.includes(id)) {
      setSelectedActionIds(selectedActionIds.filter((item) => item !== id))
    } else {
      setSelectedActionIds([...selectedActionIds, id])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFaculty) {
      setMessage({ type: 'error', text: 'Please select your UBC faculty before submitting.' })
      return
    }
    if (selectedActionIds.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one action to log.' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Insert all selected actions into Supabase
      for (const actionId of selectedActionIds) {
        const { error: insertError } = await supabase.from('submissions').insert({
          faculty_id: selectedFaculty,
          eco_action_id: actionId,
          quantity: 1,
          status: 'approved',
          user_id: user.id,
        })
        if (insertError) throw insertError
      }

      setMessage({ type: 'success', text: 'Actions logged successfully to your ledger! Redirecting...' })
      router.refresh()

      setTimeout(() => {
        window.location.href = '/competition'
      }, 1000)
    } catch (err: any) {
      console.error('Submission error:', err)
      setMessage({ type: 'error', text: err?.message || 'Failed to submit actions.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24 font-sans">
      {/* Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
              Action Registry · Personal Ledger
            </p>
            <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.14em]">
              <Link href="/competition" className="text-[#526760] hover:text-[#102f26]">
                View Live Leaderboard →
              </Link>
            </div>
          </div>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Verified Action Registry
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Select multiple sustainable actions below to log them directly to your faculty ledger and drive real-time campus impact.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-5xl px-6 py-12 md:px-10">
        {message && (
          <div
            className={`mb-8 p-4 border font-mono text-xs ${
              message.type === 'success'
                ? 'bg-[#f1f6f2] border-[#39705d] text-[#102f26]'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Faculty Selector Bar */}
          <div className="p-6 border border-[#102f26]/15 bg-[#f1f6f2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
                Institutional Affiliation
              </span>
              <p className="text-xs font-medium text-[#102f26]">Select your UBC faculty to attribute points:</p>
            </div>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              required
              className="px-4 py-2 border border-[#102f26]/20 bg-white font-mono text-xs text-[#102f26] focus:outline-none"
            >
              <option value="">-- Choose Faculty --</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#102f26]/15 pb-6">
            {['ALL', 'TRANSPORT', 'FOOD', 'ENERGY', 'WASTE', 'COMMUNITY'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                  selectedCategory === cat ? 'bg-[#102f26] text-white' : 'bg-white border border-[#102f26]/20 text-[#102f26]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Action List Feed */}
          <div className="border-t border-[#102f26]/15 divide-y divide-[#102f26]/15">
            {filteredActions.map((action) => {
              const isSelected = selectedActionIds.includes(action.id)
              return (
                <div
                  key={action.id}
                  onClick={() => toggleActionSelection(action.id)}
                  className={`p-6 transition cursor-pointer flex items-center justify-between gap-6 ${
                    isSelected ? 'bg-[#f1f6f2] border-l-4 border-l-[#102f26]' : 'hover:bg-[#f1f6f2]/40 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 bg-[#f1f6f2] border border-[#102f26]/10 text-[#39705d]">
                        {action.category}
                      </span>
                      {isSelected && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#39705d] font-bold">
                          ✓ Selected
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-[#102f26]">
                      {action.name}
                    </h3>
                    <p className="text-xs text-[#526760] max-w-xl">
                      {action.description}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#71847d] pt-1">
                      {action.impact} · <span className="text-[#39705d]">+{action.points} pts</span>
                    </p>
                  </div>

                  <div className="shrink-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleActionSelection(action.id)}
                      className="size-5 accent-[#102f26] cursor-pointer"
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Submit Action Bar */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#102f26] text-white font-mono text-xs uppercase tracking-[0.18em] hover:bg-[#102f26]/90 transition disabled:opacity-50 shadow-md"
            >
              {loading ? 'Logging Actions...' : `Submit ${selectedActionIds.length} Selected Action(s) to Ledger →`}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default function HabitsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-mono text-xs uppercase text-[#102f26]">Loading Action Registry...</div>}>
      <HabitsContent />
    </Suspense>
  )
}
