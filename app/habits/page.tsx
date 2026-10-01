'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ACTION_REGISTRY,
  ActionItem,
  getFormattedImpact,
  calculateTotalImpact,
  calculateTotalPoints,
} from '@/lib/actions'

interface Faculty {
  id: string
  name: string
}

function HabitsContent() {
  const [userType, setUserType] = useState<'student' | 'community'>('student')
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

  // Sort actions so preselected actions from homepage appear at the top
  const prioritizedActions = [...ACTION_REGISTRY].sort((a, b) => {
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
    if (userType === 'student' && !selectedFaculty) {
      setMessage({
        type: 'error',
        text: 'Please select your UBC faculty to contribute to the challenge.',
      })
      return
    }
    if (selectedActionIds.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one action to log.' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      for (const actionId of selectedActionIds) {
        const { error: insertError } = await supabase.from('submissions').insert({
          faculty_id: userType === 'student' ? selectedFaculty : null,
          eco_action_id: actionId,
          quantity: 1,
          status: 'approved',
          user_id: user.id,
        })
        if (insertError) throw insertError
      }

      setMessage({ type: 'success', text: 'Actions logged successfully to your personal ledger!' })
      router.refresh()

      setTimeout(() => {
        window.location.href = userType === 'student' ? '/competition' : '/profile'
      }, 1000)
    } catch (err: any) {
      console.error('Submission error:', err)
      setMessage({ type: 'error', text: err?.message || 'Failed to submit actions.' })
    } finally {
      setLoading(false)
    }
  }

  const totalCarbonImpact = calculateTotalImpact(selectedActionIds).toFixed(2)
  const totalPoints = calculateTotalPoints(selectedActionIds)

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24 font-sans">
      {/* Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d] font-medium">
              Action Ledger · Multi-Select Entry
            </p>
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-wider text-[#102f26]/60 hover:text-[#102f26]"
            >
              ← Back to Home
            </Link>
          </div>
          <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-5xl text-[#102f26]">
            Record Daily Sustainable Actions
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#526760] leading-relaxed">
            Select all actions you completed today. Points are calculated using verified carbon factors and attributed to your personal account and faculty leaderboard.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
        <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-12">
          
          {/* Left Column: Action Selection & Category Filter */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#102f26]/10 pb-6">
              {['ALL', 'TRANSPORT', 'FOOD', 'ENERGY', 'WASTE', 'CIRCULARITY', 'COMMUNITY'].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#102f26] text-white'
                        : 'bg-[#f1f6f2] text-[#102f26]/70 hover:bg-[#e2ede5] hover:text-[#102f26]'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* Action Cards List */}
            <div className="space-y-3">
              {filteredActions.map((action: ActionItem) => {
                const isSelected = selectedActionIds.includes(action.id)
                return (
                  <div
                    key={action.id}
                    onClick={() => toggleActionSelection(action.id)}
                    className={`cursor-pointer border p-5 transition-all ${
                      isSelected
                        ? 'border-[#102f26] bg-[#102f26] text-white shadow-sm'
                        : 'border-[#102f26]/15 bg-[#f9f8f6] text-[#102f26] hover:border-[#102f26]/40 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono text-[10px] uppercase tracking-wider ${
                              isSelected ? 'text-[#9bb9aa]' : 'text-[#39705d]'
                            }`}
                          >
                            {action.category}
                          </span>
                          <span
                            className={`font-mono text-[10px] uppercase tracking-wider ${
                              isSelected ? 'text-white/60' : 'text-[#526760]'
                            }`}
                          >
                            +{action.points} PTS
                          </span>
                        </div>
                        <h3 className="text-lg font-medium leading-tight">{action.name}</h3>
                        <p
                          className={`text-sm leading-relaxed ${
                            isSelected ? 'text-white/80' : 'text-[#526760]'
                          }`}
                        >
                          {action.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0 space-y-2">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center border text-xs ${
                            isSelected
                              ? 'border-white bg-white text-[#102f26] font-bold'
                              : 'border-[#102f26]/30 bg-transparent'
                          }`}
                        >
                          {isSelected ? '✓' : ''}
                        </span>
                        <p
                          className={`font-mono text-[11px] ${
                            isSelected ? 'text-[#9bb9aa]' : 'text-[#39705d]'
                          }`}
                        >
                          {getFormattedImpact(action)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Submission Ledger Panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 border border-[#102f26]/20 bg-[#f9f8f6] p-6 shadow-sm space-y-6">
              
              <div className="border-b border-[#102f26]/10 pb-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d] font-semibold">
                  Submission Summary
                </p>
                <h2 className="mt-1 text-2xl font-medium text-[#102f26]">Ledger Impact</h2>
              </div>

              {/* Realtime Stats Display */}
              <div className="grid grid-cols-2 gap-4 rounded-sm bg-white p-4 border border-[#102f26]/10">
                <div>
                  <p className="font-mono text-[10px] uppercase text-[#526760]">Actions</p>
                  <p className="text-2xl font-bold text-[#102f26] mt-1">
                    {selectedActionIds.length}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase text-[#526760]">Est. Impact</p>
                  <p className="text-xl font-bold text-[#39705d] mt-1">
                    -{totalCarbonImpact} <span className="text-xs font-normal">kg CO₂e</span>
                  </p>
                </div>
              </div>

              {/* User Identity Toggles */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-2">
                    Affiliation Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUserType('student')}
                      className={`p-2.5 text-xs font-mono uppercase tracking-wider border transition-all ${
                        userType === 'student'
                          ? 'bg-[#102f26] text-white border-[#102f26]'
                          : 'bg-white text-[#102f26] border-[#102f26]/20 hover:border-[#102f26]/40'
                      }`}
                    >
                      UBC Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('community')}
                      className={`p-2.5 text-xs font-mono uppercase tracking-wider border transition-all ${
                        userType === 'community'
                          ? 'bg-[#102f26] text-white border-[#102f26]'
                          : 'bg-white text-[#102f26] border-[#102f26]/20 hover:border-[#102f26]/40'
                      }`}
                    >
                      Community
                    </button>
                  </div>
                </div>

                {userType === 'student' && (
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-1">
                      Faculty / Department
                    </label>
                    <select
                      value={selectedFaculty}
                      onChange={(e) => setSelectedFaculty(e.target.value)}
                      className="w-full border border-[#102f26]/20 bg-white px-3 py-2 text-sm text-[#102f26] focus:border-[#102f26] focus:outline-none"
                    >
                      <option value="">Select your faculty...</option>
                      {faculties.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Status Message Display */}
              {message && (
                <div
                  className={`p-3 text-xs font-mono ${
                    message.type === 'success'
                      ? 'bg-[#e2ede5] text-[#102f26] border border-[#39705d]/30'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Submission Button */}
              <button
                type="submit"
                disabled={loading || selectedActionIds.length === 0}
                className="w-full bg-[#102f26] py-4 text-xs font-mono uppercase tracking-[0.18em] text-white transition-all hover:bg-[#1a4438] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? 'Logging Entry...' : `Log Actions (+${totalPoints} PTS) →`}
              </button>

            </div>
          </div>

        </form>
      </div>
    </main>
  )
}

export default function HabitsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center font-mono text-xs uppercase tracking-widest text-[#102f26]">
          Loading Green Collective Ledger...
        </div>
      }
    >
      <HabitsContent />
    </Suspense>
  )
}
