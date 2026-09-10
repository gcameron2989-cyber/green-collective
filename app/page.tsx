'use client'

import { useState } from 'react'
import { Menu, X, Plus, Bell, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Sidebar, type TabId } from '@/components/dashboard/sidebar'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { CollectivesView } from '@/components/dashboard/collectives-view'
import { MarketplaceView } from '@/components/dashboard/marketplace-view'
import { ProfileView } from '@/components/dashboard/profile-view'
import { LogActionModal, type LoggedAction } from '@/components/dashboard/log-action-modal'
import { AuthModal } from '@/components/auth/auth-modal'
import { AccountMenu } from '@/components/auth/account-menu'
import { useAuth } from '@/components/auth/auth-provider'
import { RECENT_ACTIVITY, USER } from '@/lib/data'

const TAB_TITLES: Record<TabId, string> = {
  dashboard: 'Dashboard & Habit Log',
  collectives: 'Sub-Collectives & Groups',
  marketplace: 'Green Marketplace',
  profile: 'User Profile',
}

export default function Page() {
  const { user, profile, activities: realActivities, configured, schemaMissing, logHabit } = useAuth()

  const [tab, setTab] = useState<TabId>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  const authed = !!user
  // Signed in: live data from Supabase. Signed out: sample data for the preview.
  const ecoPoints = authed ? profile?.eco_points ?? 0 : USER.ecoPoints
  const dayStreak = authed ? profile?.day_streak ?? 0 : USER.dayStreak
  const co2Saved = authed ? Number(profile?.co2_saved ?? 0) : USER.co2Saved
  const activities = authed ? realActivities : RECENT_ACTIVITY

  const firstName = authed
    ? (profile?.display_name ?? user.email?.split('@')[0] ?? 'there').split(' ')[0]
    : USER.name.split(' ')[0]

  function handleSelect(id: TabId) {
    setTab(id)
    setMobileOpen(false)
  }

  function openLogger() {
    if (!authed) {
      setAuthOpen(true)
      return
    }
    setModalOpen(true)
  }

  async function handleLog(action: LoggedAction) {
    const { error } = await logHabit(action.categoryId, action.note)
    if (!error) setModalOpen(false)
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar active={tab} onSelect={handleSelect} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} onLogin={() => setAuthOpen(true)} />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 animate-in slide-in-from-left">
            <Sidebar active={tab} onSelect={handleSelect} collapsed={false} onToggle={() => setMobileOpen(false)} onLogin={() => setAuthOpen(true)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="grid size-9 place-items-center rounded-lg text-foreground transition-colors hover:bg-muted md:hidden"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Toggle navigation</span>
            </button>
            <div>
              <h1 className="font-display text-lg font-semibold text-foreground sm:text-xl">{TAB_TITLES[tab]}</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                {authed
                  ? `Welcome back, ${firstName} — let's keep the streak going.`
                  : 'Log in to start tracking your green habits.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative grid size-9 place-items-center rounded-lg text-foreground transition-colors hover:bg-muted"
            >
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-accent" />
              <span className="sr-only">Notifications</span>
            </button>
            <Button onClick={openLogger} variant="outline" className="h-9">
              <Plus className="size-4" />
              <span className="hidden sm:inline">Log Action</span>
            </Button>
            <AccountMenu onLogin={() => setAuthOpen(true)} />
          </div>
        </header>

        {/* Scrollable content */}
        <main className={cn('flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8')}>
          <div className="mx-auto w-full max-w-6xl">
            {!configured && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3">
                <Database className="mt-0.5 size-5 shrink-0 text-accent-foreground" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Connect Supabase to go live</p>
                  <p className="text-muted-foreground text-pretty">
                    You&apos;re viewing sample data. Connect the Supabase integration so accounts,
                    eco-points, and habit logs save for real.
                  </p>
                </div>
              </div>
            )}
            {configured && schemaMissing && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3">
                <Database className="mt-0.5 size-5 shrink-0 text-accent-foreground" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Finish setting up your database</p>
                  <p className="text-muted-foreground text-pretty">
                    Run the SQL in{' '}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">scripts/001_init_green_collective.sql</code>{' '}
                    in your Supabase project to enable sign-up and habit persistence.
                  </p>
                </div>
              </div>
            )}
            {tab === 'dashboard' && (
              <DashboardView
                ecoPoints={ecoPoints}
                dayStreak={dayStreak}
                co2Saved={co2Saved}
                activities={activities}
                onLogAction={openLogger}
                onGoToMarketplace={() => setTab('marketplace')}
              />
            )}
            {tab === 'collectives' && <CollectivesView />}
            {tab === 'marketplace' && <MarketplaceView ecoPoints={ecoPoints} />}
            {tab === 'profile' && <ProfileView onLogin={() => setAuthOpen(true)} />}
          </div>
        </main>
      </div>

      <LogActionModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleLog} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
