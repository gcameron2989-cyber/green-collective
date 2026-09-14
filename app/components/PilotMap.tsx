"use client";

import React, { useState } from "react";

interface CampusZone {
  id: string;
  name: string;
  category: "Waste" | "Energy" | "Water";
  status: "Active" | "Expanding" | "Planned";
  x: number; // SVG percentage X coordinate
  y: number; // SVG percentage Y coordinate
  description: string;
  metrics: string;
}

const ZONES: CampusZone[] = [
  {
    id: "zone-1",
    name: "Student Union Building Composting",
    category: "Waste",
    status: "Active",
    x: 45,
    y: 35,
    description: "Central organic waste collection and aerobic digester system.",
    metrics: "1.2 Tons diverted / week",
  },
  {
    id: "zone-2",
    name: "Engineering Quad Solar Array",
    category: "Energy",
    status: "Active",
    x: 65,
    y: 55,
    description: "Rooftop solar photovoltaic array powering local lab equipment.",
    metrics: "45 kWh generated today",
  },
  {
    id: "zone-3",
    name: "North Campus Rainwater Catchment",
    category: "Water",
    status: "Expanding",
    x: 30,
    y: 70,
    description: "Greywater recycling filtration system for campus gardens.",
    metrics: "12,000L stored capacity",
  },
];

export default function PilotMap() {
  const [selectedZone, setSelectedZone] = useState<CampusZone>(ZONES[0]);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-emerald-950/80 border border-emerald-800/50 rounded-2xl shadow-xl text-emerald-50">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-100">Campus Pilot Map</h2>
          <p className="text-sm text-emerald-300/80">
            Real-time monitoring of active sustainability pilots across campus.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            3 Active Pilots
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Visual */}
        <div className="lg:col-span-2 relative aspect-[16/9] bg-emerald-900/40 border border-emerald-800/40 rounded-xl overflow-hidden flex items-center justify-center">
          {/* Grid Background Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Interactive Zone Markers */}
          {ZONES.map((zone) => {
            const isSelected = selectedZone.id === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                style={{ top: `${zone.y}%`, left: `${zone.x}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
              >
                <span className="relative flex h-5 w-5">
                  {isSelected && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-5 w-5 border-2 ${
                      isSelected
                        ? "bg-emerald-400 border-white scale-125"
                        : "bg-emerald-600 border-emerald-300 hover:scale-110"
                    } transition-all duration-200`}
                  />
                </span>
                <span className="absolute left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 text-[10px] whitespace-nowrap rounded bg-emerald-950/90 text-emerald-200 border border-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity">
                  {zone.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Zone Info Card */}
        <div className="p-5 bg-emerald-900/30 border border-emerald-800/40 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                {selectedZone.category}
              </span>
              <span className="px-2 py-0.5 text-xs rounded bg-emerald-800/50 text-emerald-200 border border-emerald-700/50">
                {selectedZone.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-emerald-100 mb-2">
              {selectedZone.name}
            </h3>
            <p className="text-sm text-emerald-300/80 mb-4">
              {selectedZone.description}
            </p>
          </div>

          <div className="pt-4 border-t border-emerald-800/40">
            <span className="text-xs text-emerald-400/80 block mb-1">
              Impact Metric
            </span>
            <span className="text-base font-bold text-emerald-100">
              {selectedZone.metrics}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
