import React from 'react'
import { LayoutDashboard, Users, ShoppingBag, User, Leaf, ChevronLeft, ChevronRight } from 'lucide-react'

export type TabId = 'dashboard' | 'collectives' | 'marketplace' | 'profile'

export interface SidebarProps {
  active?: TabId
  onSelect?: (id: TabId) => void
  collapsed?: boolean
  onToggle?: () => void
  onLogin?: () => void
}

export function Sidebar({ active = 'dashboard', onSelect, collapsed = false, onToggle }: SidebarProps) {
  const navItems: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'collectives', label: 'Sub-Collectives', icon: <Users className="h-5 w-5" /> },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag className="h-5 w-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
  ]

  return (
    <aside className={`transition-all duration-300 border-r bg-card h-screen p-4 flex flex-col justify-between ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          {!collapsed && (
            <div className="flex items-center gap-2 font-bold text-lg text-emerald-700">
              <Leaf className="h-6 w-6 text-emerald-600 fill-emerald-600/20" />
              <span>Green Collective</span>
            </div>
          )}
          <button onClick={onToggle} type="button" className="p-1.5 rounded-lg border hover:bg-accent text-muted-foreground">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect?.(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
