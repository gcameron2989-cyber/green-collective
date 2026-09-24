"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

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
    description:
      "Central organic waste collection and aerobic digester system.",
    metrics: "1.2 Tons diverted / week",
  },
  {
    id: "zone-2",
    name: "Engineering Quad Solar Array",
    category: "Energy",
    status: "Active",
    lat: 49.2625,
    lng: -123.2505,
    description:
      "Rooftop solar photovoltaic array powering local lab equipment.",
    metrics: "45 kWh generated today",
  },
  {
    id: "zone-3",
    name: "North Campus Rainwater Catchment",
    category: "Water",
    status: "Expanding",
    lat: 49.2698,
    lng: -123.2542,
    description:
      "Greywater recycling filtration system for campus gardens.",
    metrics: "12,000L stored capacity",
  },
];

export default function PilotMap() {
  const [selectedZone, setSelectedZone] = useState<CampusZone>(ZONES[0]);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    if (typeof window === "undefined" || !mapRef.current) {
      return;
    }

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current || leafletMap.current) {
        return;
      }

      const container = mapRef.current as HTMLDivElement & {
        _leaflet_id?: number;
      };

      // Prevent Leaflet from initializing the same DOM node twice.
      if (container._leaflet_id) {
        return;
      }

      const map = L.map(container).setView([49.264, -123.25], 14);

      leafletMap.current = map;

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
          maxZoom: 16,
        }
      ).addTo(map);

      const customIcon = L.icon({
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      ZONES.forEach((zone) => {
        const marker = L.marker([zone.lat, zone.lng], {
          icon: customIcon,
        }).addTo(map);

        marker.bindPopup(`
          <div style="color: #064e3b; font-family: sans-serif;">
            <strong>${zone.name}</strong><br/>
            <span style="font-size: 12px; color: #047857;">
              ${zone.metrics}
            </span>
          </div>
        `);

        marker.on("click", () => setSelectedZone(zone));
      });
    });

    return () => {
      cancelled = true;

      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
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
        <div className="lg:col-span-2 relative h-[380px] bg-emerald-950 border border-emerald-800/50 rounded-xl overflow-hidden shadow-inner">
          <div ref={mapRef} className="h-full w-full z-0" />
        </div>

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