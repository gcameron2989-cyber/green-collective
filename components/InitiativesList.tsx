'use client'

import React, { useState } from 'react'

type Initiative = {
  id: string
  title: string
  description: string
  category: string
  location: string
}

export default function InitiativesList({ initialData }: { initialData: Initiative[] }) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Conservation', 'Energy', 'Community Garden', 'Policy']

  const filtered = initialData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
        <input
          type="text"
          placeholder="Search initiatives..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        />
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length > 0 ? (
          filtered.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-2.5 py-1 mb-3 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-md">
                {item.category}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                📍 {item.location || 'Local Region'}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-2 text-center py-8">No initiatives found matching your criteria.</p>
        )}
      </div>
    </div>
  )
}
