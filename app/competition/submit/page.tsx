'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Faculty {
  id: string
  name: string
}

interface EcoAction {
  id: string
  title: string
  category: string
  points: number
  requires_photo: boolean
}

export default function SubmitActionPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [actions, setActions] = useState<EcoAction[]>([])
  
  const [selectedFaculty, setSelectedFaculty] = useState<string>('')
  const [selectedAction, setSelectedAction] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [file, setFile] = useState<File | null>(null)
  
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadFormData() {
      const { data: facultyData } = await supabase.from('faculties').select('id, name')
      const { data: actionData } = await supabase.from('eco_actions').select('*')
      
      if (facultyData) setFaculties(facultyData)
      if (actionData) setActions(actionData)
    }
    loadFormData()
  }, [])

  const currentAction = actions.find((a) => a.id === selectedAction)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFaculty || !selectedAction) {
      setMessage({ type: 'error', text: 'Please select both your faculty and an eco-action.' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      let photoUrl = null

      // Upload image to Supabase Storage if file is attached
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
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

      // Insert submission record into database
      const { error: insertError } = await supabase.from('submissions').insert({
        faculty_id: selectedFaculty,
        action_id: selectedAction,
        quantity: Number(quantity),
        proof_image_url: photoUrl,
        status: 'approved', // Auto-approved for testing
      })

      if (insertError) throw insertError

      setMessage({ type: 'success', text: 'Eco-action logged successfully! Redirecting...' })
      setTimeout(() => router.push('/competition'), 1500)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to submit action.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans flex flex-col justify-between">
      <div className="max-w-xl mx-auto w-full space-y-6">
        <div>
          <Link href="/competition" className="text-xs text-emerald-400 hover:underline inline-block mb-3">
            ← Back to Competition Leaderboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Log an Eco-Action 🌿
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Submit your sustainable effort to earn points for your faculty.
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                : 'bg-red-950/80 border border-red-500 text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          {/* Select Faculty */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Select Your Faculty</label>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">-- Choose Faculty --</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Action */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Select Eco-Action</label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">-- Choose Action --</option>
              {actions.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.points} pts)
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Quantity / Trips</label>
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Upload Photo Proof */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Upload Photo Proof {currentAction?.requires_photo ? '(Required)' : '(Optional)'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required={currentAction?.requires_photo}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-950 file:text-emerald-400 hover:file:bg-emerald-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition text-sm shadow-md disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Action →'}
          </button>
        </form>
      </div>

      <footer className="py-6 text-center text-xs text-slate-500 mt-12">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  )
}
