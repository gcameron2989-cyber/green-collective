'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, BarChart3, Settings } from 'lucide-react'

const navItems = [
  {
    name: 'Habit Analytics',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Campus Network',
    href: '/dashboard/network',
    icon: Users,
  },
  {
    name: 'Institutional Strategy',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 px-3 py-4 w-64 border-r border-emerald-900/10 min-h-screen bg-card/50">
      <div className="px-3 py-2 mb-4">
        <Link href="/dashboard" className="font-bold text-lg text-[#0f382c] flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
          GC Campus Pilot
        </Link>
        <p className="text-[11px] text-muted-foreground mt-0.5">UBC Pilot Hub</p>
      </div>

      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              isActive
                ? 'bg-[#0f382c] text-white shadow-sm'
                : 'text-muted-foreground hover:bg-emerald-500/10 hover:text-foreground'
            }`}
          >
            <Icon className="size-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
