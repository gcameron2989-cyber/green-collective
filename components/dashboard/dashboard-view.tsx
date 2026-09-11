'use client'

import React from 'react'
import { Plus, Flame, Leaf, ArrowUpRight, CheckCircle2 } from 'lucide-react'

interface DashboardViewProps {
  ecoPoints: number
  dayStreak: number
  co2Saved: number
  activities: any[]
  onLogAction: () => void
  onGoToMarketplace: () => void
}

export function DashboardView({
  ecoPoints,
  dayStreak,
  co2Saved,
  activities,
  onLogAction,
  onGoToMarketplace,
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Eco-Points Card (Deep Forest Green) */}
        <div className="p-5 rounded-2xl bg-[#064e3b] text-white shadow-md relative overflow-hidden border border-emerald-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              Eco-Points Balance
            </span>
            <div className="p-2 rounded-xl bg-emerald-800/80 text-emerald-300">
              <Leaf className="size-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white tracking-tight">{ecoPoints.toLocaleString()}</p>
          <p className="text-xs text-emerald-300/80 mt-1.5 font-medium">+80 this week</p>
        </div>

        {/* Streak Card */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm text-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Active Day Streak
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Flame className="size-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-zinc-900 tracking-tight">{dayStreak} <span className="text-lg font-normal text-zinc-500">days</span></p>
          <p className="text-xs text-emerald-600 mt-1.5 font-medium">Personal record!</p>
        </div>

        {/* CO2 Saved Card */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm text-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              CO2 Saved
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Leaf className="size-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-zinc-900 tracking-tight">{co2Saved} <span className="text-lg font-normal text-zinc-500">kg</span></p>
          <p className="text-xs text-emerald-600 mt-1.5 font-medium">+6 kg this week</p>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Flame className="size-3.5 fill-emerald-800" /> 12-day streak — keep it alive!
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Turn today's habits into real climate impact
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Log a green action to earn eco-points, extend your streak, and unlock marketplace rewards.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onLogAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064e3b] text-white font-semibold text-sm hover:bg-emerald-900 shadow-sm transition-all active:scale-95"
            >
              <Plus className="size-4" /> Log Green Action
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-zinc-900">Recent Activity</h3>
          <button type="button" onClick={onGoToMarketplace} className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="size-3" />
          </button>
        </div>

        <div className="space-y-3">
          {activities.map((act, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{act.title || act.action}</p>
                  <p className="text-xs text-zinc-500">{act.note || 'Logged action'}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                  +{act.points || 25} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardView
