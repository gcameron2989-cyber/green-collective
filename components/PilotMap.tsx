"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic import for Leaflet components to avoid SSR (Server-Side Rendering) issues in Next.js
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface CampusZone {
  id: string;
  name: string;
  category: "Waste" | "Energy" | "Water";
  status: "Active" | "Expanding" | "Planned";
  lat: number;
  lng: number;
  description: string;
  metrics: string;
}

const ZONES: CampusZone[] = [
  {
    id: "zone-1",
    name: "Student Union Building Composting",
    category: "Waste",
    status: "Active",
    lat: 49.2665,
    lng: -123.2498,
    description: "Central organic waste collection and aerobic digester system.",
    metrics: "1.2 Tons diverted / week",
  },
  {
    id: "zone-2",
    name: "Engineering Quad Solar Array",
    category: "Energy",
    status: "Active",
    lat: 49.2625,
    lng: -123.2505,
    description: "Rooftop solar photovoltaic array powering local lab equipment.",
    metrics: "45 kWh generated today",
  },
  {
    id: "zone-3",
    name: "North Campus Rainwater Catchment",
    category: "Water",
    status: "Expanding",
    lat: 49.2698,
    lng: -123.2542,
    description: "Greywater recycling filtration system for campus gardens.",
    metrics: "12,000L stored capacity",
  },
];

export default function PilotMap() {
  const [selectedZone, setSelectedZone] = useState<CampusZone>(ZONES[0]);
  const [customIcon, setCustomIcon] = useState<any>(null);

  // Fix Leaflet marker icon pathing issues in Next.js
  useEffect(() => {
    import("leaflet").then((L) => {
      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      setCustomIcon(icon);
    });
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-emerald-950/90 border border-emerald-800/60 rounded-2xl shadow-2xl text-emerald-50">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-100 flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Campus Pilot Map
          </h2>
          <p className="text-sm text-emerald-300/80">
            Interactive geographic tracking across active campus initiatives.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            UBC Campus Pilots
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Geographic Map Container */}
        <div className="lg:col-span-2 relative h-[380px] bg-emerald-950 border border-emerald-800/50 rounded-xl overflow-hidden shadow-inner">
          <MapContainer
            center={[49.264, -123.250]}
            zoom={14}
            scrollWheelZoom={false}
            className="h-full w-full z-0"
          >
            {/* Dark Mode Tile Theme */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {customIcon &&
              ZONES.map((zone) => (
                <Marker
                  key={zone.id}
                  position={[zone.lat, zone.lng]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => setSelectedZone(zone),
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="p-1 text-emerald-950 font-sans">
                      <strong className="block text-sm font-bold">{zone.name}</strong>
                      <span className="text-xs text-emerald-700">{zone.metrics}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>

        {/* Selected Zone Detail Panel */}
        <div className="p-5 bg-emerald-900/40 border border-emerald-800/50 rounded-xl flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                {selectedZone.category}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-800/60 text-emerald-200 border border-emerald-700/50">
                {selectedZone.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-emerald-100 mb-2">
              {selectedZone.name}
            </h3>
            <p className="text-sm text-emerald-300/80 mb-4 leading-relaxed">
              {selectedZone.description}
            </p>
          </div>

          <div className="pt-4 border-t border-emerald-800/50">
            <span className="text-xs text-emerald-400/80 block mb-1 uppercase tracking-wider font-semibold">
              Measured Impact
            </span>
            <span className="text-base font-extrabold text-emerald-100">
              {selectedZone.metrics}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
