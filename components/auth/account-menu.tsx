import React from "react"

export function AccountMenu({ onLogin }: { onLogin: () => void }) {
  return (
    <button onClick={onLogin} className="px-3 py-1.5 border rounded-lg text-sm font-medium hover:bg-muted">
      Account
    </button>
  )
}
