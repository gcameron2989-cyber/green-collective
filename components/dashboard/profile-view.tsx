import React from 'react'
import { User, Award, ShieldCheck, MapPin } from 'lucide-react'

export interface ProfileViewProps {
  onLogin?: () => void
  [key: string]: any
}

export function ProfileView({ onLogin }: ProfileViewProps) {
  return (
    <div className="space-y-6">
      <div className="border rounded-2xl p-6 bg-card shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-inner">
            GC
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              Green Collective Member <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Kitsilano, Vancouver, BC
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-2xl p-5 bg-card space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-600" /> Sustainability Badges
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200 rounded-lg">Zero Waste Hero</span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200 rounded-lg">Low Carbon Commuter</span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200 rounded-lg">12-Day Streak</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileView
