import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Background Radial Glow & Grid Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <div className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </div>
        <div className="flex gap-4 items-center">
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:text-[#0f382c] transition px-3 py-2"
          >
            Log In
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold bg-[#0f382c] text-white px-5 py-2.5 rounded-full hover:bg-emerald-900 transition shadow-md shadow-emerald-900/10"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-4xl mx-auto z-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-6 border border-emerald-200 shadow-sm">
          <span className="size-1.5 rounded-full bg-emerald-600" />
          The Eco-Social Network
        </span>

        {/* Featured Blurb Header */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl mb-6 text-foreground">
          The social platform for sustainability.
        </h1>

        {/* Core Featured Blurb */}
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8 font-normal">
          Share your everyday green habits, discover what friends and businesses are doing, track your environmental impact, and build a climate-focused community together.
        </p>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
          <Link
            href="/dashboard"
            className="bg-[#0f382c] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-emerald-900 transition text-center shadow-lg shadow-emerald-950/15"
          >
            Join as an Individual
          </Link>
          <Link
            href="/dashboard"
            className="border border-emerald-900/20 bg-background/60 backdrop-blur font-semibold px-8 py-3.5 rounded-full hover:bg-emerald-50/50 transition text-center"
          >
            Register a Business
          </Link>
        </div>

        {/* Enhanced Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <div className="p-6 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur shadow-sm hover:shadow-md transition">
            <div className="size-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl mb-4">
              📸
            </div>
            <h2 className="font-semibold text-lg mb-1.5 text-foreground">Share Action Feeds</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Post daily sustainable habits, commutes, and meal logs just like your favorite social feed.
            </p>
          </div>

          <div className="p-6 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur shadow-sm hover:shadow-md transition">
            <div className="size-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl mb-4">
              📊
            </div>
            <h2 className="font-semibold text-lg mb-1.5 text-foreground">Track Real Impact</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Quantify CO₂ saved and waste diverted over time with automated carbon metrics.
            </p>
          </div>

          <div className="p-6 border border-emerald-900/10 rounded-2xl bg-card/80 backdrop-blur shadow-sm hover:shadow-md transition">
            <div className="size-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl mb-4">
              🏢
            </div>
            <h2 className="font-semibold text-lg mb-1.5 text-foreground">Business & Groups</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Follow local businesses, participate in corporate challenges, and unlock eco-rewards.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  )
}
