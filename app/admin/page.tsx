'use client'

import React, { useEffect, useState, useTransition } from 'react'
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

interface Inquiry {
  id: string
  created_at: string
  name: string
  email: string
  message: string
  status: string
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'submissions' | 'inquiries'>('submissions')
  
  // Submissions State
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(true)
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loadingInquiries, setLoadingInquiries] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSendingReply, startReplyTransition] = useTransition()
  const [replySuccessMessage, setReplySuccessMessage] = useState('')

  const supabase = createClient()

  // Fetch Submissions
  const fetchSubmissions = async () => {
    setLoadingSubmissions(true)
    let query = supabase
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

    if (submissionFilter !== 'all') {
      query = query.eq('status', submissionFilter)
    }

    const { data, error } = await query
    if (error) console.error('Error loading submissions:', error.message)
    else if (data) setSubmissions(data as unknown as Submission[])
    setLoadingSubmissions(false)
  }

  // Fetch Inquiries
  const fetchInquiries = async () => {
    setLoadingInquiries(true)
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Error loading inquiries:', error.message)
    else if (data) setInquiries(data as Inquiry[])
    setLoadingInquiries(false)
  }

  useEffect(() => {
    if (activeTab === 'submissions') fetchSubmissions()
    else fetchInquiries()
  }, [activeTab, submissionFilter])

  // Update Submission Status
  const updateSubmissionStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setActionLoading(id)
    const { error } = await supabase
      .from('submissions')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      alert(`Failed to update status: ${error.message}`)
    } else {
      if (submissionFilter !== 'all') {
        setSubmissions((prev) => prev.filter((sub) => sub.id !== id))
      } else {
        setSubmissions((prev) =>
          prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
        )
      }
    }
    setActionLoading(null)
  }

  // Send Reply via API endpoint to Resend
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInquiry) return

    setReplySuccessMessage('')
    startReplyTransition(async () => {
      try {
        const response = await fetch('/api/admin/reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toEmail: selectedInquiry.email,
            name: selectedInquiry.name,
            message: replyText,
          }),
        })

        const result = await response.json()
        if (result.success) {
          setReplySuccessMessage('Reply sent successfully from support@greencollective.ca!')
          setReplyText('')
          setTimeout(() => {
            setSelectedInquiry(null)
            setReplySuccessMessage('')
          }, 2000)
        } else {
          alert('Failed to send email reply.')
        }
      } catch (err) {
        console.error('Error sending reply:', err)
        alert('An error occurred while sending the reply.')
      }
    })
  }

  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block" />
          Green Collective
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
              activeTab === 'submissions' ? 'bg-[#0f382c] text-white' : 'text-emerald-800 hover:bg-emerald-100/50'
            }`}
          >
            Submissions Queue
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
              activeTab === 'inquiries' ? 'bg-[#0f382c] text-white' : 'text-emerald-800 hover:bg-emerald-100/50'
            }`}
          >
            Support Inquiries ({inquiries.length})
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 z-10 space-y-6">
        {activeTab === 'submissions' ? (
          /* --- SUBMISSIONS QUEUE VIEW --- */
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
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

              <div className="flex gap-2 shrink-0">
                {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSubmissionFilter(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                      submissionFilter === tab
                        ? 'bg-[#0f382c] text-white shadow-sm'
                        : 'bg-emerald-100/50 text-[#0f382c] hover:bg-emerald-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm space-y-4">
              {loadingSubmissions ? (
                <div className="text-center py-12 text-xs text-muted-foreground animate-pulse">
                  Loading submissions...
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-12 text-xs text-muted-foreground">
                  No {submissionFilter !== 'all' ? submissionFilter : ''} submissions found.
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
                              +{pointsEarned} total points logged • {new Date(sub.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-emerald-900/10">
                          <button
                            onClick={() => updateSubmissionStatus(sub.id, 'approved')}
                            disabled={actionLoading === sub.id || sub.status === 'approved'}
                            className="text-xs font-bold bg-[#0f382c] text-white px-4 py-2 rounded-xl hover:bg-emerald-900 transition disabled:opacity-40"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateSubmissionStatus(sub.id, 'rejected')}
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
          </div>
        ) : (
          /* --- CONTACT INQUIRIES VIEW --- */
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-2 border border-emerald-200">
                📬 Inbox Portal
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                Support & Partnership Inquiries
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Manage questions submitted from your contact page and reply directly via support@greencollective.ca.
              </p>
            </div>

            <div className="border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur p-6 shadow-sm">
              {loadingInquiries ? (
                <div className="text-center py-12 text-xs text-muted-foreground animate-pulse">
                  Loading inquiries...
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-12 text-xs text-muted-foreground">
                  No contact messages received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-emerald-900/10 bg-background/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{item.name}</span>
                          <span className="text-xs text-blue-600">({item.email})</span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-900/5">
                          &ldquo;{item.message}&rdquo;
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedInquiry(item)}
                        className="text-xs font-bold bg-[#0f382c] text-white px-4 py-2 rounded-xl hover:bg-emerald-900 transition shrink-0"
                      >
                        Reply via Email →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- REPLY MODAL --- */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-emerald-900/10 space-y-4">
            <h3 className="text-lg font-bold text-[#0f382c]">
              Reply to {selectedInquiry.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              Sending from <strong className="text-foreground">support@greencollective.ca</strong> to {selectedInquiry.email}
            </p>

            {replySuccessMessage ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium text-center border border-emerald-200">
                {replySuccessMessage}
              </div>
            ) : (
              <form onSubmit={handleSendReply} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Original Message
                  </label>
                  <p className="text-xs bg-gray-50 p-3 rounded-xl border text-gray-600 italic">
                    &ldquo;{selectedInquiry.message}&rdquo;
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Your Response
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response here..."
                    className="w-full p-3 border rounded-xl text-xs focus:outline-none focus:border-[#0f382c]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(null)}
                    className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingReply}
                    className="px-4 py-2 bg-[#0f382c] text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition disabled:opacity-50"
                  >
                    {isSendingReply ? 'Sending...' : 'Send Email →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  )
}
