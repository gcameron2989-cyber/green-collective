import { HabitLogger } from '@/components/dashboard/habit-logger'
import { CampusFeed } from '@/components/dashboard/campus-feed'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 border border-emerald-500/20 rounded-2xl bg-[#0a231b]/70 backdrop-blur-md shadow-lg shadow-emerald-950/20">
          <p className="text-xs font-medium text-emerald-400/80">Personal Momentum</p>
          <h2 className="text-2xl font-bold text-white mt-1">84%</h2>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">Verified action consistency</p>
        </div>

        <div className="p-5 border border-emerald-500/20 rounded-2xl bg-[#0a231b]/70 backdrop-blur-md shadow-lg shadow-emerald-950/20">
          <p className="text-xs font-medium text-emerald-400/80">Campus Impact</p>
          <h2 className="text-2xl font-bold text-white mt-1">1,240 kg</h2>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">Estimated CO₂e offset this term</p>
        </div>

        <div className="p-5 border border-emerald-500/20 rounded-2xl bg-[#0a231b]/70 backdrop-blur-md shadow-lg shadow-emerald-950/20">
          <p className="text-xs font-medium text-emerald-400/80">Institutional Target</p>
          <h2 className="text-2xl font-bold text-white mt-1">Scope 1–3</h2>
          <p className="text-[11px] text-emerald-400/70 mt-1">Integrated policy & habit tracking</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habit Logger - Main Left Column */}
        <div className="lg:col-span-2 p-6 border border-emerald-500/20 rounded-2xl bg-[#0a231b]/70 backdrop-blur-md shadow-lg shadow-emerald-950/20">
          <HabitLogger />
        </div>

        {/* Real-Time Feed & Faculty Standings - Right Column */}
        <div className="p-6 border border-emerald-500/20 rounded-2xl bg-[#0a231b]/70 backdrop-blur-md shadow-lg shadow-emerald-950/20">
          <CampusFeed />
        </div>
      </div>
    </div>
  )
}
