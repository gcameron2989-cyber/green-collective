import { HabitLogger } from '@/components/dashboard/habit-logger'
import { CampusFeed } from '@/components/dashboard/campus-feed'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 border border-emerald-900/10 rounded-2xl bg-card shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Personal Momentum</p>
          <h2 className="text-2xl font-bold text-foreground mt-1">84%</h2>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">Verified action consistency</p>
        </div>

        <div className="p-5 border border-emerald-900/10 rounded-2xl bg-card shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Campus Impact</p>
          <h2 className="text-2xl font-bold text-foreground mt-1">1,240 kg</h2>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">Estimated CO₂e offset this term</p>
        </div>

        <div className="p-5 border border-emerald-900/10 rounded-2xl bg-card shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Institutional Target</p>
          <h2 className="text-2xl font-bold text-foreground mt-1">Scope 1–3</h2>
          <p className="text-[11px] text-muted-foreground mt-1">Integrated policy & habit tracking</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habit Logger - Main Left Column */}
        <div className="lg:col-span-2 p-6 border border-emerald-900/10 rounded-2xl bg-card shadow-sm">
          <HabitLogger />
        </div>

        {/* Real-Time Feed & Leaderboard - Right Column */}
        <div className="p-6 border border-emerald-900/10 rounded-2xl bg-card shadow-sm">
          <CampusFeed />
        </div>
      </div>
    </div>
  )
}
