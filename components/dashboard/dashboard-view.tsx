import React from "react"

export function DashboardView({ ecoPoints, dayStreak, co2Saved, activities, onLogAction, onGoToMarketplace }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Eco Points</p>
          <p className="text-2xl font-bold">{ecoPoints}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Day Streak</p>
          <p className="text-2xl font-bold">{dayStreak} Days</p>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">CO2 Saved</p>
          <p className="text-2xl font-bold">{co2Saved} kg</p>
        </div>
      </div>
    </div>
  )
}
