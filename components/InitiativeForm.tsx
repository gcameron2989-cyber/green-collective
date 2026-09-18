'use client'

import React, { useState } from 'react'
import { createInitiative } from '@/initiatives'

export default function InitiativeForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(event.currentTarget)

    try {
      await createInitiative(formData)
      setSuccess(true)
      event.currentTarget.reset()
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-900">Add New Initiative</h2>
      
      {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}
      {success && <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg">Initiative successfully posted!</div>}

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Title</label>
        <input 
          name="title" 
          required 
          placeholder="e.g. Community Composting Hub"
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Category</label>
        <select 
          name="category" 
          required
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
        >
          <option value="Conservation">Conservation</option>
          <option value="Energy">Energy</option>
          <option value="Community Garden">Community Garden</option>
          <option value="Policy">Policy</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Location</label>
        <input 
          name="location" 
          placeholder="e.g. Kitsilano, Vancouver"
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description</label>
        <textarea 
          name="description" 
          rows={3}
          placeholder="Briefly describe the project goals..."
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Publish Initiative'}
      </button>
    </form>
  )
}
