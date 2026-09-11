'use client'

import React from 'react'
import { LayoutDashboard, Users, ShoppingBag, User, Leaf, LogIn } from 'lucide-react'

export type TabId = 'dashboard' | 'collectives' | 'marketplace' | 'profile'

interface SidebarProps {
  active: TabId
  onSelect: (id: TabId) => void
  collapsed?: boolean
  onToggle?: () => void
  onLogin?: () => void
}

export function Sidebar({ active, onSelect, onLogin }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as TabId, label: 'Dashboard & Habit Log', icon: LayoutDashboard },
    { id: 'collectives' as TabId, label: 'Sub-Collectives & Groups', icon: Users },
    { id: 'marketplace' as TabId, label: 'Green Marketplace', icon: ShoppingBag },
    { id: 'profile' as TabId, label: 'User Profile', icon: User },
  ]

  return (
    <aside className="w-64 h-full bg-[#064e3b] text-emerald-100 flex flex-col justify-between p-4 shadow-xl select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="p-2 rounded-xl bg-emerald-800/80 text-emerald-300 ring-1 ring-emerald-600/50">
            <Leaf className="size-6" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base tracking-wide leading-tight">Green Collective</h2>
            <p className="text-[11px] text-emerald-300/80 font-medium">Eco Action Platform</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-800/90 text-white shadow-sm ring-1 ring-emerald-500/40 font-semibold'
                    : 'text-emerald-200/80 hover:bg-emerald-900/50 hover:text-white'
                }`}
              >
                <Icon className={`size-5 ${isActive ? 'text-emerald-300' : 'text-emerald-400/80'}`} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Footer Profile / Login Button */}
      <div className="border-t border-emerald-800/60 pt-4">
        <button
          type="button"
          onClick={onLogin}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-200 hover:bg-emerald-900/60 hover:text-white transition-colors"
        >
          <div className="grid size-8 place-items-center rounded-lg bg-emerald-900/80 text-emerald-300 font-bold border border-emerald-700/50">
            MC
          </div>
          <div className="text-left flex-1">
            <p className="text-white font-medium">Guest User</p>
            <p className="text-[10px] text-emerald-400">Click to Sign In</p>
          </div>
          <LogIn className="size-4 text-emerald-400" />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
