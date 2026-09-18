import Link from 'next/link';
import PilotMap from '@/components/PilotMap';

const localInitiatives = [
  {
    title: "Oppenheimer Repair Clinics",
    category: "Transport & Waste",
    description: "Free, year-round bike and mobility device repairs supporting low-carbon transit and circular economy waste reduction.",
    location: "Downtown Eastside, Vancouver",
    coords: [49.2827, -123.0988]
  },
  {
    title: "False Creek Community-Led Mapping",
    category: "Ecosystems & Resilience",
    description: "Mapping urban watershed climate risks and opportunities for local ecological stewardship and community adaptation.",
    location: "False Creek, Vancouver",
    coords: [49.2680, -123.1120]
  },
  {
    title: "West End Intergenerational Climate Adaptation",
    category: "Community Health",
    description: "Building neighborhood resilience to extreme heat events and poor air quality through intergenerational support programs.",
    location: "West End, Vancouver",
    coords: [49.2865, -123.1360]
  }
];

export default function InitiativesPage() {
  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px]">
      {/* Absolute Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      <main className="flex-1 max-w-6xl mx-auto py-12 px-6 w-full space-y-10 z-10">
        <div className="flex justify-between items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100/90 text-[#0f382c] rounded-full mb-3 border border-emerald-200/80 backdrop-blur-md">
              📍 Local Geolocation Strategy
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0f382c]">Vancouver Sustainability Initiatives</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Active grassroots climate action projects mapped across Vancouver, BC.
            </p>
          </div>
          <Link 
            href="/initiatives/new"
            className="bg-[#0f382c] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-900 transition shadow-md"
          >
            + Propose Initiative
          </Link>
        </div>

        {/* Interactive Map Section with Side Info Panel */}
        <div className="w-full rounded-2xl overflow-hidden border border-emerald-900/10 bg-card/90 backdrop-blur shadow-sm flex flex-col lg:flex-row">
          {/* Map Area */}
          <div className="relative w-full lg:w-3/5 h-[350px] lg:h-[450px]">
            <PilotMap />
          </div>

          {/* Featured Initiative Details Panel */}
          <div className="w-full lg:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br from-[#0f382c] to-emerald-950 text-white">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold text-xs tracking-wider uppercase">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                Featured Project Spotlight
              </div>
              <h2 className="text-xl font-bold">Engineering Quad Solar Array</h2>
              <p className="text-emerald-100/80 text-xs leading-relaxed">
                Rooftop solar photovoltaic array powering local lab equipment and reducing campus grid reliance.
              </p>
            </div>
            
            <div className="pt-6 border-t border-emerald-800/60 mt-4 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-emerald-300 block uppercase tracking-wider">Measured Impact</span>
                <span className="font-bold text-white text-sm">45 kWh generated today</span>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-semibold border border-emerald-400/30">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Initiative Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {localInitiatives.map((item, idx) => (
            <div key={idx} className="bg-card/90 backdrop-blur p-6 rounded-2xl border border-emerald-900/10 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100/80 text-emerald-800 px-2.5 py-1 rounded-full">
                  {item.category}
                </span>
                <h2 className="text-base font-bold text-foreground mt-3">{item.title}</h2>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-900/10 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                📍 {item.location}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/80 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  );
}
