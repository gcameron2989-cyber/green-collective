import React from "react"

export type TabId = 'dashboard' | 'collectives' | 'marketplace' | 'profile'

export interface SidebarProps {
  active?: TabId
  onSelect?: (id: TabId) => void
  collapsed?: boolean
  onToggle?: () => void
  onLogin?: () => void
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="w-64 border-r bg-background h-screen p-4 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="px-3 py-2">
          <h2 className="text-lg font-semibold tracking-tight text-emerald-700">
            Green Collective
          </h2>
        </div>
        <nav className="space-y-1">
          {(['dashboard', 'collectives', 'marketplace', 'profile'] as TabId[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onSelect?.(tab)}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg capitalize ${
                active === tab ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-muted'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
