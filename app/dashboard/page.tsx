import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="px-6 py-4 border-b border-border flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="font-bold text-xl tracking-tight text-[#0f382c]">
          Green Collective
        </div>
        <div className="flex gap-4 items-center">
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:underline px-3 py-2"
          >
            Log In
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium bg-[#0f382c] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-4xl mx-auto">
        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-6">
          The Eco-Social Network
        </span>

        {/* Featured Blurb Header */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl mb-6">
          The social platform for sustainability.
        </h1>

        {/* Core Featured Blurb */}
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
          Share your everyday green habits, discover what friends and businesses are doing, track your environmental impact, and build a climate-focused community together.
        </p>

        {/* Primary Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="bg-[#0f382c] text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition text-center"
          >
            Join as an Individual
          </Link>
          <Link
            href="/dashboard"
            className="border border-border font-semibold px-8 py-3 rounded-full hover:bg-accent transition text-center"
          >
            Register a Business
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left w-full">
          <div className="p-5 border border-border rounded-xl bg-card">
            <div className="text-2xl mb-2">📸</div>
            <h2 className="font-semibold text-lg mb-1">Share Action Feeds</h2>
            <p className="text-sm text-muted-foreground">
              Post daily sustainable habits, commutes, and meal logs just like your favorite feed.
            </p>
          </div>

          <div className="p-5 border border-border rounded-xl bg-card">
            <div className="text-2xl mb-2">📊</div>
            <h2 className="font-semibold text-lg mb-1">Track Real Impact</h2>
            <p className="text-sm text-muted-foreground">
              Quantify CO₂ saved and waste diverted over time with automated metrics.
            </p>
          </div>

          <div className="p-5 border border-border rounded-xl bg-card">
            <div className="text-2xl mb-2">🏢</div>
            <h2 className="font-semibold text-lg mb-1">Business & Groups</h2>
            <p className="text-sm text-muted-foreground">
              Follow local businesses, participate in corporate challenges, and earn perks.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  )
}
