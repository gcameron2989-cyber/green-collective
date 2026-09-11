import React from "react"

export function ProfileView({ onLogin }: { onLogin?: () => void }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
          GC
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground">User Profile</h3>
          <p className="text-sm text-muted-foreground">Vancouver, BC, Canada</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileView
