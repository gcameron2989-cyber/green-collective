'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface Faculty {
  id: string
  name: string
}

const LOCAL_HUBS = [
  { id: 'kitsilano', name: 'Kitsilano Community Hub (Vancouver West)' },
  { id: 'point-grey', name: 'Point Grey & Campus Perimeter' },
  { id: 'mount-pleasant', name: 'Mount Pleasant Eco-Network (Vancouver East)' },
  { id: 'downtown', name: 'Downtown Core Collective' },
  { id: 'grandview', name: 'Grandview-Woodland' },
]

// Merged with Proportional Math (pointsPerUnit, unit)
const ECO_ACTIONS_LIST = [
  // Mobility & Energy (Proportional)
  { id: 'transit-commute', category: 'Mobility & Energy', title: 'Public Transit (Bus/Train/SkyTrain)', unit: 'mins', pointsPerUnit: 1 }, 
  { id: 'active-commute', category: 'Mobility & Energy', title: 'Active Commute (Walk/Bike)', unit: 'km', pointsPerUnit: 10 }, 
  { id: 'carpool-trip', category: 'Mobility & Energy', title: 'Shared Ride / Carpool', unit: 'km', pointsPerUnit: 3 },
  { id: 'stairs-instead-elevator', category: 'Mobility & Energy', title: 'Took Stairs Instead of Elevator', unit: 'floors', pointsPerUnit: 3 },
  
  // Zero Waste & Dining (Itemized)
  { id: 'home-meal', category: 'Zero Waste & Dining', title: 'Brought Lunch/Snacks from Home', unit: 'meals', pointsPerUnit: 30 },
  { id: 'home-beverage', category: 'Zero Waste & Dining', title: 'Brought Coffee/Tea in Reusable Mug', unit: 'drinks', pointsPerUnit: 25 },
  { id: 'reusable-container-buy', category: 'Zero Waste & Dining', title: 'Used Reusable Container for Takeout/Dining', unit: 'items', pointsPerUnit: 15 },
  { id: 'refillable-water', category: 'Zero Waste & Dining', title: 'Used Refillable Water Station vs. Bottled Water', unit: 'refills', pointsPerUnit: 10 },
  { id: 'plant-based-meal', category: 'Zero Waste & Dining', title: 'Chose 100% Plant-Based Dining', unit: 'meals', pointsPerUnit: 20 },
  
  // Circular Economy & Resource Conservation
  { id: 'waste-sorting', category: 'Circular Economy', title: 'Properly Sorted Compost & Recyclables at Hub', unit: 'sorts', pointsPerUnit: 10 },
  { id: 'thrift-borrow-gear', category: 'Circular Economy', title: 'Borrowed / Thrifted Academic Textbooks or Gear', unit: 'items', pointsPerUnit: 30 },
  { id: 'campus-cleanup', category: 'Circular Economy', title: 'Participated in Community/Faculty Cleanup', unit: 'hours', pointsPerUnit: 50 },
  { id: 'ubc-forestry-field', category: 'UBC Stewardship', title: 'Participated in Campus Tree Care/Field Audit', unit: 'hours', pointsPerUnit: 50 },
]

function SubmitFormContent() {
  const [affiliationType, setAffiliationType] = useState<'institutional' | 'local'>('institutional')
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [selectedFaculty, setSelectedFaculty] = useState<string>('')
  const [selectedLocalHub, setSelectedLocalHub] = useState<string>('')
  
  const [selectedAction, setSelectedAction] = useState<string>('')
  const [metricValue, setMetricValue] = useState<number>(1) // Replaces pure 'quantity' for dynamic units
  const [reflectionNote, setReflectionNote] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const actionParam = searchParams.get('action')
    if (actionParam) {
      setSelectedAction(actionParam)
      handleActionChange(actionParam)
    }

    const fetchFaculties = async () => {
      const { data, error } = await supabase
        .from('faculties')
        .select('id, name')
        .order('name', { ascending: true })

      if (!error && data) setFaculties(data)
    }
    fetchFaculties()
  }, [supabase, searchParams])

  // Smart defaults based on unit
  const handleActionChange = (newId: string) => {
    setSelectedAction(newId);
    const action = ECO_ACTIONS_LIST.find(a => a.id === newId);
    if (action?.unit === 'mins') setMetricValue(30);
    else if (action?.unit === 'km') setMetricValue(5);
    else if (action?.unit === 'hours') setMetricValue(1);
    else setMetricValue(1); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (affiliationType === 'institutional' && !selectedFaculty) {
      setMessage({ type: 'error', text: 'Please select your institutional faculty.' })
      return
    }
    if (affiliationType === 'local' && !selectedLocalHub) {
      setMessage({ type: 'error', text: 'Please select your local community hub.' })
      return
    }
    if (!selectedAction) {
      setMessage({ type: 'error', text: 'Please select an eco-action.' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      let photoUrl = null

      // Retained your exact storage upload logic
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        const filePath = `proofs/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('proof-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('proof-images')
          .getPublicUrl(filePath)

        photoUrl = urlData.publicUrl
      }

      // Injects the new dynamic quantity and reflection note
      const { error: insertError } = await supabase.from('submissions').insert({
        faculty_id: affiliationType === 'institutional' ? selectedFaculty : null,
        eco_action_id: selectedAction,
        quantity: Number(metricValue),
        reflection_note: reflectionNote.trim() || null,
        proof_image_url: photoUrl,
        status: 'approved',
        user_id: user.id,
      })

      if (insertError) throw insertError

      const earnedPoints = (ECO_ACTIONS_LIST.find(a => a.id === selectedAction)?.pointsPerUnit || 0) * metricValue;
      setMessage({ type: 'success', text: `Action verified! You earned +${earnedPoints} pts. Updating standings...` })
      
      router.refresh()
      
      setTimeout(() => {
        window.location.href = '/competition' // Can be updated to /profile depending on routing preference
      }, 1500)
    } catch (err: any) {
      console.error('Full Submission Error Details:', err)
      setMessage({ type: 'error', text: err?.message || JSON.stringify(err) || 'Failed to submit action.' })
    } finally {
      setLoading(false)
    }
  }

  const activeActionDetails = ECO_ACTIONS_LIST.find((a) => a.id === selectedAction);
  const livePointsCalc = (activeActionDetails?.pointsPerUnit || 0) * metricValue;

  return (
    <main className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-24 font-sans">
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
              Action Logger · Personal Ledger
            </p>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 font-mono text-[10px] uppercase tracking-[0.14em]">
              <Link href="/profile" className="text-[#526760] hover:text-[#102f26]">
                My Profile →
              </Link>
              <Link href="/competition" className="text-[#526760] hover:text-[#102f26]">
                Live Leaderboard →
              </Link>
            </div>
          </div>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Log Your Sustainable Action
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Record proportional metrics (time, distance) and attribute them toward your university faculty or local neighborhood hub.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-16 md:px-10 lg:px-12">
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

        <form onSubmit={handleSubmit} className="border border-[#102f26]/15 bg-white p-6 md:p-8 space-y-8 shadow-sm">
          
          {/* Association Toggle (Unchanged) */}
          <div className="space-y-3 pb-6 border-b border-[#102f26]/10">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
              1. Leaderboard Attribution Tier
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAffiliationType('institutional')}
                className={`py-2.5 px-4 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                  affiliationType === 'institutional'
                    ? 'bg-[#102f26] text-white shadow-sm'
                    : 'bg-[#f9f8f6] border border-[#102f26]/20 text-[#102f26] hover:bg-[#f1f6f2]'
                }`}
              >
                Institutional (UBC Faculty)
              </button>
              <button
                type="button"
                onClick={() => setAffiliationType('local')}
                className={`py-2.5 px-4 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                  affiliationType === 'local'
                    ? 'bg-[#102f26] text-white shadow-sm'
                    : 'bg-[#f9f8f6] border border-[#102f26]/20 text-[#102f26] hover:bg-[#f1f6f2]'
                }`}
              >
                Local (Vancouver Hub)
              </button>
            </div>
            
            <div className="pt-2">
              {affiliationType === 'institutional' ? (
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  required={affiliationType === 'institutional'}
                  className="w-full px-4 py-3 border border-[#102f26]/20 bg-[#f9f8f6] text-xs text-[#102f26] font-medium focus:outline-none focus:border-[#102f26]"
                >
                  <option value="">-- Choose Faculty --</option>
                  {faculties.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              ) : (
                <select
                  value={selectedLocalHub}
                  onChange={(e) => setSelectedLocalHub(e.target.value)}
                  required={affiliationType === 'local'}
                  className="w-full px-4 py-3 border border-[#102f26]/20 bg-[#f9f8f6] text-xs text-[#102f26] font-medium focus:outline-none focus:border-[#102f26]"
                >
                  <option value="">-- Choose Local Hub --</option>
                  {LOCAL_HUBS.map((hub) => (
                    <option key={hub.id} value={hub.id}>{hub.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Action Selection */}
          <div className="space-y-3">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
              2. Select Eco-Action Category
            </label>
            <select
              value={selectedAction}
              onChange={(e) => handleActionChange(e.target.value)}
              required
              className="w-full px-4 py-3 border border-[#102f26]/20 bg-[#f9f8f6] text-xs text-[#102f26] font-medium focus:outline-none focus:border-[#102f26]"
            >
              <option value="">-- Choose Eco-Action --</option>
              {Array.from(new Set(ECO_ACTIONS_LIST.map(a => a.category))).map((category) => (
                <optgroup key={category} label={category}>
                  {ECO_ACTIONS_LIST.filter(a => a.category === category).map((action) => (
                    <option key={action.id} value={action.id}>
                      {action.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dynamic Metric Input */}
            <div className="space-y-2">
              <label className="flex justify-between block font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
                <span>3. Enter {activeActionDetails?.unit || 'Quantity'}</span>
                <span className="text-[#526760]/70">({activeActionDetails?.pointsPerUnit || 0} pts/{activeActionDetails?.unit?.replace(/s$/, '')})</span>
              </label>
              <div className="flex">
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={metricValue}
                  onChange={(e) => setMetricValue(Number(e.target.value) || 1)}
                  required
                  className="flex-1 px-4 py-3 border-y border-l border-[#102f26]/20 bg-[#f9f8f6] text-base text-[#102f26] font-bold focus:outline-none focus:border-[#102f26] text-center"
                />
                <div className="px-4 border-y border-r border-[#102f26]/20 bg-[#f1f6f2] flex items-center font-mono text-[10px] uppercase tracking-widest text-[#39705d] font-bold">
                  {activeActionDetails?.unit || 'UNITS'}
                </div>
              </div>
            </div>

            {/* Live Impact Yield */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
                Calculated Impact Yield
              </label>
              <div className="h-[46px] border border-[#39705d]/30 bg-[#f1f6f2] flex items-center justify-between px-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#526760]">Total Earned</span>
                <span className="text-lg font-medium text-[#102f26]">+{livePointsCalc} PTS</span>
              </div>
            </div>
          </div>

          {/* New: Reflection Notes */}
          <div className="space-y-2">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
              4. Field Notes / Reflection (Optional)
            </label>
            <textarea
              rows={3}
              value={reflectionNote}
              onChange={(e) => setReflectionNote(e.target.value)}
              placeholder="Add context to your activity feed..."
              className="w-full px-4 py-3 border border-[#102f26]/20 bg-[#f9f8f6] text-xs text-[#102f26] font-medium focus:outline-none focus:border-[#102f26] resize-none"
            />
          </div>

          {/* Proof Upload (Unchanged) */}
          <div className="space-y-2 pb-4">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
              5. Attach Proof (Optional Image)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-[#526760] file:mr-4 file:py-2.5 file:px-4 file:border-0 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.14em] file:bg-[#102f26] file:text-white hover:file:bg-[#102f26]/90 cursor-pointer transition"
            />
          </div>
