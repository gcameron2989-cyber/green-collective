import Link from "next/link"

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background h-screen p-4 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="px-3 py-2">
          <h2 className="text-lg font-semibold tracking-tight text-emerald-700">
            Green Collective
          </h2>
        </div>
        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-all"
          >
            Dashboard
          </Link>
          <Link
            href="/vendors"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-all"
          >
            Local Vendors
          </Link>
          <Link
            href="/habits"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-all"
          >
            Habit Log
          </Link>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
