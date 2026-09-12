'use client'

import { useState } from 'react'
import { Check, Flame, Leaf, Zap, Bike, Recycle, Coffee } from 'lucide-react'

// Habit category definition
const habitCategories = [
  {
    id: 'transit',
    name: 'Zero-Emission Transit',
    description: 'Biked, walked, or took electric transit',
    icon: Bike,
    co2Estimate: '1.8 kg CO₂e',
  },
  {
    id: 'energy',
    name: 'Energy Conservation',
    description: 'Off-peak usage, reduced HVAC/lighting',
    icon: Zap,
    co2Estimate: '0.6 kg CO₂e',
  },
  {
    id: 'food',
    name: 'Plant-Based Meal',
    description: 'Chose low-carbon food options',
    icon: Leaf,
    co2Estimate: '1.2 kg CO₂e',
  },
  {
    id: 'waste',
    name: 'Waste Diverted',
    description: 'Composted, recycled, zero landfill',
    icon: Recycle,
    co2Estimate: '0.4 kg CO₂e',
  },
  {
    id: 'circularity',
    name: 'Reusable Container',
    description: 'Brought own mug/container to campus vendor',
    icon: Coffee,
    co2Estimate: '0.2 kg CO₂e',
  },
]

export function HabitLogger() {
  const [selectedHabits, setSelectedHabits] = useState<string[]>([])
  const [isLoggedToday, setIsLoggedToday] = useState(false)
  const [personalScore, setPersonalScore] = useState(84) // Personal momentum metric %

  const toggleHabit = (id: string) => {
    if (isLoggedToday) return
    setSelectedHabits((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    )
  }

  const handleLogSubmit = () => {
    if (selectedHabits.length === 0) return
    setIsLoggedToday(true)
    setPersonalScore((prev) => Math.min(prev + 2, 100))
  }

  return (
    <div className="space-y-6">
      {/* Logger Header */}
      <div className="flex justify-between items-center pb-4 border-b border-emerald-900/10">
        <div>
          <h3 className="font-semibold text-base text-foreground">Log Sustainable Choice</h3>
          <p className="text-xs text-muted-foreground">
            Select daily actions to update your personal progress metrics and campus impact.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <Flame className="size-4 text-emerald-600" />
          <span className="text-xs font-semibold text-[#0f382c]">
            {personalScore}% Momentum
          </span>
        </div>
      </div>

      {/* Habit Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {habitCategories.map((habit) => {
          const Icon = habit.icon
          const isSelected = selectedHabits.includes(habit.id)

          return (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              disabled={isLoggedToday}
              className={`flex items-start gap-3.5 p-4 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-500/10 shadow-sm'
                  : 'border-emerald-900/10 bg-card hover:border-emerald-500/30'
              } ${isLoggedToday ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isSelected ? 'bg-[#0f382c] text-white' : 'bg-emerald-100 text-[#0f382c]'
                }`}
              >
                <Icon className="size-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-foreground truncate">{habit.name}</h4>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {habit.co2Estimate}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  {habit.description}
                </p>
              </div>

              <div
                className={`size-5 rounded-full border flex items-center justify-center ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-emerald-900/20 bg-background'
                }`}
              >
                {isSelected && <Check className="size-3" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Submission Action Bar */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-muted-foreground">
          {isLoggedToday
            ? '✅ Today’s choices are verified and submitted to the campus network.'
            : `${selectedHabits.length} habit(s) selected today`}
        </p>

        <button
          onClick={handleLogSubmit}
          disabled={selectedHabits.length === 0 || isLoggedToday}
          className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all shadow-md ${
            isLoggedToday
              ? 'bg-emerald-900/20 text-muted-foreground cursor-not-allowed shadow-none'
              : selectedHabits.length > 0
              ? 'bg-[#0f382c] text-white hover:bg-emerald-900 shadow-emerald-900/10'
              : 'bg-emerald-900/10 text-muted-foreground cursor-not-allowed shadow-none'
          }`}
        >
          {isLoggedToday ? 'Logged for Today' : 'Submit Choices'}
        </button>
      </div>
    </div>
  )
}
