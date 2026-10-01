'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Faculty {
  id: string
  name: string
}

const ECO_ACTIONS = [
  // UBC Campus & Forestry Specific
  { id: 'ubc-forestry-field', category: 'UBC Stewardship', title: 'Participated in Campus Tree Care or Ecosystem Field Audit', points: 50 },
  { id: 'sustainable-commute-ubc', category: 'Mobility & Energy', title: 'Commuted to UBC via 99 B-Line, Transit, Cycling, or Walking', points: 25 },
  
  // Zero-Waste & Food
  { id: 'home-meal', category: 'Zero Waste & Dining', title: 'Brought Lunch/Snacks from Home (Zero Single-Use)', points: 30 },
  { id: 'home-beverage', category: 'Zero Waste & Dining', title: 'Brought Coffee/Tea in Reusable Mug on Campus', points: 25 },
  { id: 'reusable-container-buy', category: 'Zero Waste & Dining', title: 'Used Reusable Container at UBC Food Services', points: 15 },
  { id: 'refillable-water', category: 'Zero Waste & Dining', title: 'Used Refillable Water Station vs. Bottled Water', points: 20 },
  { id: 'plant-based-meal', category: 'Zero Waste & Dining', title: 'Chose Plant-Based Dining Option at Totem/Open Kitchen', points: 20 },

  // Circular Economy & Resource Conservation
  { id: 'waste-sorting', category: 'Circular Economy', title: 'Properly Sorted Compost & Recyclables at Campus Hub', points: 10 },
  { id: 'thrift-borrow-gear', category: 'Circular Economy', title: 'Borrowed / Thrifted Academic Textbooks or Gear', points: 30 },
  { id: 'campus-cleanup', category: 'Circular Economy', title: 'Participated in AMS / Faculty Eco-Action Cleanup', points: 50 },
]

export default function SubmitActionPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [selectedFaculty, setSelectedFaculty] = useState<string>('')
  const [selectedAction, setSelectedAction] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [file, setFile] = useState<File | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchFaculties = async () => {
      const { data, error } = await supabase
        .from('faculties')
        .select('id, name')
        .order('name', { ascending: true })

      if (!error && data) {
        setFaculties(data)
      } else {
        console.error('Error fetching faculties:', error)
      }
    }
    fetchFaculties()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFaculty || !selectedAction) {
      setMessage({ type: 'error', text: 'Please select both your faculty and an eco-action.' })
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

      let photoUrl = null

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

      const { error: insertError } = await supabase.from('submissions').insert({
        faculty_id: selectedFaculty,
        eco_action_id: selectedAction,
        quantity: Number(quantity),
        proof_image_url: photoUrl,
        status: 'approved',
        user_id: user.id,
      })

      if (insertError) throw insertError

      setMessage({ type: 'success', text: 'Action verified and logged! Updating faculty standings...' })
      
      router.refresh()
      
      setTimeout(() => {
        window.location.href = '/competition'
      }, 1000)
    } catch (err: any) {
      console.error('Full Submission Error Details:', err)
      setMessage({ type: 'error', text: err?.message || JSON.stringify(err) || 'Failed to submit action.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24 font-sans">
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
              Action Logger · Personal Ledger
            </p>
            <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.14em]">
              <Link href="/profile" className="text-[#526760] hover:text-[#102f26]">
                My Profile →
              </Link>
              <Link href="/competition" className="text-[#526760] hover:text-[#102f26]">
                View Live Leaderboard →
              </Link>
            </div>
          </div>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Log Your Sustainable Action
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Record your daily transit, campus stewardship, and zero-waste choices to compound your faculty&apos;s score on the live leaderboard.
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

        <form onSubmit={handleSubmit} className="border border-[#102f26]/15 bg-[#f1f6f2] p-8 space-y-6">
          <div className="space-y-2">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
              Select Your UBC Faculty
            </label>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              required
              className="w-full px-4 py-3 border border-[#102f26]/20 bg-white text-xs text-[#102f26] font-medium focus:outline-none focus:border-[#102f26]"
            >
              <option value="">-- Choose Faculty --</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
              Select Eco-Action Category &amp; Impact
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              required
              className="w-full px-4 py-3 border border-[#102f26]/20 bg-white text-xs text-[#102f26] font-medium focus:outline-none focus:border-[#102f26]"
            >
              <option value="">-- Choose Eco-Action --</option>
              {ECO_ACTIONS.map((a) => (
                <option key={a.id} value={a.id}>
                  [{a.category}] {a.title} (+{a.points} pts)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
              Quantity / Frequency
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="w-full px-4 py-3 border border-[#102f26]/20 bg-white text-xs text-[#102f26] font-medium focus:outline-none focus:border-[#102f26]"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d]">
              Attach Proof (Optional Image)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-[#526760] file:mr-4 file:py-2 file:px-4 file:border-0 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.14em] file:bg-[#102f26] file:text-white hover:file:opacity-90 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#102f26] text-white font-mono text-xs uppercase tracking-[0.18em] hover:bg-[#102f26]/90 transition disabled:opacity-50"
          >
            {loading ? 'Submitting to Ledger...' : 'Submit Action to Ledger →'}
          </button>
        </form>
      </section>
    </main>
  )
}
