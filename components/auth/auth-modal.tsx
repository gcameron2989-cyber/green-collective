import React from "react"

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background p-6 rounded-xl border max-w-sm w-full space-y-4">
        <h3 className="font-bold text-lg">Sign In</h3>
        <button onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Close</button>
      </div>
    </div>
  )
}
