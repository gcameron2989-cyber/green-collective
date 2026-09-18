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
    <main className="max-w-6xl mx-auto py-12 px-6 w-full space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-3 border border-emerald-200">
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

      {/* Interactive Map Section */}
      <div className="border border-emerald-900/10 rounded-2xl overflow-hidden bg-card shadow-sm p-4 h-[350px]">
        <PilotMap />
      </div>

      {/* Initiative Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {localInitiatives.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-emerald-900/10 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                {item.category}
              </span>
              <h2 className="text-base font-bold text-gray-900 mt-3">{item.title}</h2>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              📍 {item.location}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
