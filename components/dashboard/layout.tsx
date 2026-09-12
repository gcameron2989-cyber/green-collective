import { DashboardNav } from '@/components/dashboard/nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-emerald-900/10">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Campus Pilot Hub</h1>
            <p className="text-xs text-muted-foreground">
              Measuring behavioral momentum and campus sustainability analytics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium bg-emerald-100 text-[#0f382c] px-3 py-1 rounded-full border border-emerald-200">
              Active Member
            </span>
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}
