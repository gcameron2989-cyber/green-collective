'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Submission {
  id: string
  created_at: string
  quantity: number
  proof_image_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  faculties: { name: string } | null
  eco_actions: { title: string; points: number } | null
}

export default function AdminReviewPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const supabase = createClient()

  const fetchSubmissions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        id,
        created_at,
        quantity,
        proof_image_url,
        status,
        faculties ( name ),
        eco_actions ( title, points )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading submissions:', error.message)
    } else if (data) {
      setSubmissions(data as unknown as Submission[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setActionLoading(id)
    const { error } = await supabase
      .from('submissions')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      alert(`Failed to update status: ${error.message}`)
    } else {
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
      )
    }
    setActionLoading(null)
  }

  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block" />
          Green Collective
        </Link>
        <Link href="/competition" className="text-xs font-semibold text-emerald-800 hover:underline">
          ← View Leaderboard
        </Link>
      </header>

      {/* Main Admin Section */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 z-10 space-y-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-2 border border-emerald-200">
            🛡️ Admin Portal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Submission Moderation Queue
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review proof photos and adjust approval statuses for campus submissions.
          </p>
        </div>

        {/* Submissions List */}
        <div className="border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm space-y-4">
          {loading ? (
            <div className="text-center py-12 text-xs text-muted-foreground animate-pulse">
              Loading submissions...
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-xs text-muted-foreground">
              No submissions recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => {
                const pointsEarned = (sub.eco_actions?.points || 0) * sub.quantity

                return (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl border border-emerald-900/10 bg-background/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      {/* Proof Image Thumbnail */}
                      {sub.proof_image_url ? (
                        <a href={sub.proof_image_url} target="_blank" rel="noreferrer" className="shrink-0">
                          <img
                            src={sub.proof_image_url}
                            alt="Proof"
                            className="size-16 rounded-lg object-cover border border-emerald-900/10 hover:opacity-80 transition"
                          />
                        </a>
                      ) : (
                        <div className="size-16 rounded-lg bg-emerald-950/5 border border-emerald-900/10 flex items-center justify-center text-[10px] text-muted-foreground shrink-0">
                          No Photo
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">
                            {sub.eco_actions?.title || 'Unknown Action'}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              sub.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : sub.status === 'rejected'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {sub.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Faculty: <strong className="text-foreground">{sub.faculties?.name || 'Unassigned'}</strong> • Quantity: {sub.quantity}
                        </p>
                        <p className="text-[11px] text-emerald-800 font-semibold">
                          +{pointsEarned} total points logged
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-emerald-900/10">
                      <button
                        onClick={() => updateStatus(sub.id, 'approved')}
                        disabled={actionLoading === sub.id || sub.status === 'approved'}
                        className="text-xs font-bold bg-[#0f382c] text-white px-4 py-2 rounded-xl hover:bg-emerald-900 transition disabled:opacity-40"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(sub.id, 'rejected')}
                        disabled={actionLoading === sub.id || sub.status === 'rejected'}
                        className="text-xs font-bold bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition disabled:opacity-40"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  )
}
