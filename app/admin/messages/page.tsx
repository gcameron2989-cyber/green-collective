'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ContactInquiry {
  id: string
  created_at: string
  name: string
  email: string
  message: string
  status: string
}

export default function AdminMessagesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null)
  const [sending, setSending] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setInquiries(data)
      }
      setLoading(false)
    }

    fetchInquiries()
  }, [router, supabase])

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInquiry || !replyText.trim()) return

    setSending(true)
    try {
      // Call the backend API route to dispatch via Resend and update Supabase
      const res = await fetch('/api/admin/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedInquiry.email,
          message: replyText,
          inquiryId: selectedInquiry.id,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send email')

      // Update local UI state
      setInquiries(
        inquiries.map((item) =>
          item.id === selectedInquiry.id ? { ...item, status: 'replied' } : item
        )
      )
      setReplyText('')
      setSelectedInquiry(null)
      alert('Email successfully sent to ' + selectedInquiry.email + '!')
    } catch (err: any) {
      console.error(err)
      alert('Error sending email: ' + (err.message || err))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 space-y-8 font-sans text-neutral-900 bg-white">
      <div className="border-b border-neutral-200 pb-6">
        <span className="inline-block font-mono text-xs uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Admin Console
        </span>
        <h1 className="text-3xl font-extrabold mt-2">Platform Inquiries Inbox</h1>
        <p className="text-xs text-neutral-500 font-mono mt-1">
          Manage and respond to user messages from contact_inquiries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inquiries List Sidebar */}
        <div className="md:col-span-1 rounded-2xl bg-neutral-50 p-4 border border-neutral-200 space-y-3 max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-10 text-xs font-mono text-neutral-400 animate-pulse">
              Loading inquiries...
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-10 text-xs text-neutral-500">
              No contact inquiries found.
            </div>
          ) : (
            inquiries.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedInquiry(item)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  selectedInquiry?.id === item.id
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-neutral-900 truncate max-w-[120px]">
                    {item.name}
                  </span>
                  <span
                    className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      item.status === 'replied'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 truncate">{item.message}</p>
                <span className="text-[10px] font-mono text-neutral-400 block mt-2">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Selected Inquiry Detail & Reply Box */}
        <div className="md:col-span-2 rounded-2xl bg-neutral-50 p-6 border border-neutral-200 flex flex-col justify-between">
          {selectedInquiry ? (
            <div className="space-y-6 flex-1 flex flex-col">
              <div className="space-y-2 border-b border-neutral-200 pb-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-neutral-900">{selectedInquiry.name}</h2>
                  <span className="font-mono text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    {selectedInquiry.email}
                  </span>
                </div>
                <p className="text-xs font-mono text-neutral-400">
                  Received: {new Date(selectedInquiry.created_at).toLocaleString()}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-neutral-200 flex-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                  Message Content
                </span>
                <p className="text-sm text-neutral-800 whitespace-pre-wrap">
                  {selectedInquiry.message}
                </p>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-2">
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider">
                  Draft & Send Reply
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full rounded-xl border border-neutral-300 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-5 py-2.5 rounded-xl bg-[#0f382c] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-emerald-900 transition disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send & Mark Replied ↗'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs font-mono text-neutral-400 py-20">
              Select an inquiry from the sidebar to view and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
