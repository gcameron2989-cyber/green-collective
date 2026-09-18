import Link from 'next/link';

const localInitiatives = [
  {
    title: "Oppenheimer Repair Clinics",
    category: "Transport & Waste",
    description: "Free, year-round bike and mobility device repairs supporting low-carbon transit and circular economy waste reduction in Vancouver.",
    location: "Downtown Eastside, Vancouver"
  },
  {
    title: "False Creek Community-Led Mapping",
    category: "Ecosystems & Resilience",
    description: "Mapping urban watershed climate risks and opportunities for local ecological stewardship and community adaptation.",
    location: "False Creek, Vancouver"
  },
  {
    title: "West End Intergenerational Climate Adaptation",
    category: "Community Health",
    description: "Building neighborhood resilience to extreme heat events and poor air quality through intergenerational support programs.",
    location: "West End, Vancouver"
  },
  {
    title: "Vancouver Climate Champions",
    category: "Education & Youth",
    description: "Equipping students and teachers with resources to translate municipal climate emergency strategies into local action.",
    location: "Metro Vancouver Schools"
  }
];

export default function InitiativesPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-6 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0f382c]">Local Sustainability Initiatives</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Active community-driven climate action projects across Vancouver, BC.
          </p>
        </div>
        <Link 
          href="/initiatives/new"
          className="bg-[#0f382c] text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-emerald-900 transition shadow-md"
        >
          + Propose Initiative
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {localInitiatives.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-emerald-900/10 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                {item.category}
              </span>
              <h2 className="text-lg font-bold text-gray-900 mt-3">{item.title}</h2>
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
