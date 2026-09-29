"use client";

import { useState } from 'react';
import Link from 'next/link';

interface Initiative {
  code: string;
  category: string;
  title: string;
  description: string;
  status: string;
  href: string;
  regions: string[];
}

const initiativesList: Initiative[] = [
  {
    code: "01",
    category: "Institutional Challenge",
    title: "UBC Sustainability Challenge",
    description: "Participate in faculty-wide challenges to measure aggregate carbon savings and drive campus sustainability metrics collectively.",
    status: "Active Program",
    href: "/competition",
    regions: ["Vancouver", "Global / Remote"],
  },
  {
    code: "02",
    category: "Community Action",
    title: "Local Urban Canopy Expansion",
    description: "Coordinate with regional partners and municipal groups to monitor canopy cover, urban heat island mitigation, and green space accessibility.",
    status: "Ongoing",
    href: "/initiatives/canopy",
    regions: ["Vancouver", "Toronto"],
  },
  {
    code: "03",
    category: "Policy & Research",
    title: "Green Transit & Drivetrain Transition",
    description: "Evaluate lifecycle emissions, municipal charging infrastructure, and policy frameworks for heavy-duty and commuter transport networks.",
    status: "Research Phase",
    href: "/initiatives/transport-policy",
    regions: ["Vancouver", "Toronto", "Global / Remote"],
  },
];

export default function InitiativesPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("Vancouver");
  const [loading, setLoading] = useState<boolean>(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Approximate bounding check for Vancouver vs Toronto
        if (latitude > 48.0 && latitude < 50.0 && longitude > -124.0 && longitude < -122.0) {
          setSelectedRegion("Vancouver");
        } else if (latitude > 43.0 && latitude < 44.5 && longitude > -80.0 && longitude < -79.0) {
          setSelectedRegion("Toronto");
        } else {
          setSelectedRegion("Global / Remote");
        }
        setLoading(false);
      },
      () => {
        alert("Unable to retrieve your location. Defaulting to Vancouver.");
        setLoading(false);
      }
    );
  };

  const filteredInitiatives = initiativesList.filter((item) =>
    item.regions.includes(selectedRegion)
  );

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24">
      {/* Editorial Page Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
            Programs · Scale · Impact
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Shared initiatives &amp; community programs
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Individual actions compound into measurable institutional progress when aligned through structured community programs.
          </p>
        </div>
      </section>

      {/* Main Initiatives Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        {/* Location Curation Toolbar */}
        <div className="mb-12 p-6 border border-[#102f26]/15 bg-[#f1f6f2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block mb-1">
              Contextual Curation
            </span>
            <p className="text-sm font-medium text-[#102f26]">
              Showing programs for: <span className="underline font-mono uppercase text-xs">{selectedRegion}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDetectLocation}
              disabled={loading}
              className="px-4 py-2 bg-[#102f26] text-white font-mono text-[10px] uppercase tracking-[0.16em] hover:bg-[#102f26]/90 transition disabled:opacity-50"
            >
              {loading ? "Locating..." : "Detect My Location"}
            </button>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 bg-white border border-[#102f26]/20 font-mono text-xs text-[#102f26] focus:outline-none"
            >
              <option value="Vancouver">Vancouver, BC</option>
              <option value="Toronto">Toronto, ON</option>
              <option value="Global / Remote">Global / Remote</option>
            </select>
          </div>
        </div>

        {/* Initiatives List Grid */}
        <div className="border-t border-[#102f26]/15">
          {filteredInitiatives.length > 0 ? (
            filteredInitiatives.map((item) => (
              <div
                key={item.code}
                className="group border-b border-[#102f26]/15 py-10 transition-colors hover:bg-[#f1f6f2]/40 px-4 -mx-4"
              >
                <div className="grid gap-6 lg:grid-cols-[0.3fr_1.2fr_0.5fr] lg:items-center">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#39705d] block">
                      Initiative / {item.code}
                    </span>
                    <span className="mt-1 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-[#71847d]">
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#39705d] block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-2xl font-medium tracking-tight text-[#102f26]">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#526760]">
                      {item.description}
                    </p>
                  </div>

                  <div className="lg:text-right">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2 border-b border-[#102f26] pb-1 font-mono text-xs uppercase tracking-[0.14em] transition-opacity hover:opacity-55"
                    >
                      View program →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-[#526760] font-mono text-xs uppercase tracking-wider">
              No active programs currently listed for this specific region.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
