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
  // Zero-Waste & Food
  { id: 'home-meal', category: 'Zero Waste & Dining', title: 'Brought Lunch/Snacks from Home (Zero Single-Use)', points: 30 },
  { id: 'home-beverage', category: 'Zero Waste & Dining', title: 'Brought Coffee/Tea from Home', points: 25 },
  { id: 'reusable-container-buy', category: 'Zero Waste & Dining', title: 'Used Reusable Container/Mug for Retail Purchase', points: 15 },
  { id: 'refillable-water', category: 'Zero Waste & Dining', title: 'Used Refillable Water Bottle vs. Bottled Water', points: 20 },
  { id: 'plant-based-meal', category: 'Zero Waste & Dining', title: 'Chose 100% Plant-Based Dining Option', points: 20 },

  // Sustainable Mobility
  { id: 'sustainable-commute', category: 'Mobility & Energy', title: 'Commuted via Transit, Cycling, or Walking', points: 25 },
  { id: 'carpool-trip', category: 'Mobility & Energy', title: 'Shared Ride / Carpooled to Campus', points: 20 },
  { id: 'stairs-instead-elevator', category: 'Mobility & Energy', title: 'Took Stairs Instead of Elevator (3+ Floors)', points: 10 },

  // Circular Economy & Resource Conservation
  { id: 'waste-sorting', category: 'Circular Economy', title: 'Properly Sorted Compost, Recyclables & Soft Plastics', points: 10 },
  { id: 'thrift-borrow-gear', category: 'Circular Economy', title: 'Borrowed/Thrifted Academic Gear or Clothes', points: 30 },
  { id: 'campus-cleanup', category: 'Circular Economy', title: 'Participated in Campus Clean-up / Eco Event', points: 50 },
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

      setMessage({ type: 'success', text: 'Eco-action logged successfully! Redirecting to your Impact Hub...' })
      
      router.refresh()
      
      setTimeout(() => {
        window.location.href = '/profile'
      }, 800)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to submit action.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link href="/profile" className="text-emerald-800 hover:underline">
            👤 My Profile
          </Link>
          <Link href="/competition" className="text-emerald-800 hover:underline">
            Leaderboard →
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-6 py-10 z-10 space-y-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-2 border border-emerald-200">
            🌱 Action Logger
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Log Your Eco-Action
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Submit your sustainable choices to earn points for your faculty on the live standings.
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-100 border border-emerald-300 text-[#0f382c]'
                : 'bg-red-100 border border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0f382c]">Select Your Faculty</label>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl border border-emerald-900/10 bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            >
              <option value="">-- Choose Faculty --</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0f382c]">Select Eco-Action</label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl border border-emerald-900/10 bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            >
              <option value="">-- Choose Eco-Action --</option>
              {ECO_ACTIONS.map((a) => (
                <option key={a.id} value={a.id}>
                  [{a.category}] {a.title} (+{a.points} pts)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0f382c]">Quantity / Times Performed</label>
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="w-full px-3 py-2.5 rounded-xl border border-emerald-900/10 bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0f382c]">
              Attach Photo Proof (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-[#0f382c] hover:file:bg-emerald-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-xs font-bold bg-[#0f382c] text-white py-3 rounded-xl hover:bg-emerald-900 transition shadow-md shadow-emerald-900/10 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Action →'}
          </button>
        </form>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  )
}
