"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";
import { logBatchUserActions } from "@/actions/user-actions";

interface DailyActionLoggerProps {
  onActionLogged?: () => void;
}

const VANCOUVER_NEIGHBOURHOODS = [
  "Point Grey",
  "Kitsilano",
  "Mount Pleasant",
  "Fairview / South Granville",
  "Downtown / West End",
  "Commercial Drive",
  "Dunbar-Southlands",
  "Kerrisdale",
];

const UBC_FACULTIES = [
  "Faculty of Forestry",
  "Faculty of Science",
  "Faculty of Applied Science",
  "Sauder School of Business",
  "Faculty of Arts",
  "Faculty of Land and Food Systems",
];

export default function DailyActionLogger({ onActionLogged }: DailyActionLoggerProps) {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [actionId, setActionId] = useState("transit-commute");
  const [transportMode, setTransportMode] = useState<"bike" | "walk" | "bus" | "ev_carpool">("bike");
  const [distanceKm, setDistanceKm] = useState(5);
  
  // Dual Attribution State
  const [sector, setSector] = useState<"public" | "campus">("campus");
  const [neighborhood, setNeighborhood] = useState(VANCOUVER_NEIGHBOURHOODS[0]);
  const [faculty, setFaculty] = useState(UBC_FACULTIES[0]);

  const [impactPoints, setImpactPoints] = useState(25);
  const [co2SavedKg, setCo2SavedKg] = useState(1.25);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Recalculate realistic points and CO2 offsets based on actual distance
  useEffect(() => {
    if (actionId === "transit-commute") {
      let basePoints = 15;
      let co2RatePerKm = 0.25;

      if (transportMode === "bus") {
        basePoints = 20;
        co2RatePerKm = 0.18;
      } else if (transportMode === "ev_carpool") {
        basePoints = 25;
        co2RatePerKm = 0.15;
      }

      const calculatedPoints = Math.round(basePoints + distanceKm * 2);
      const calculatedCo2 = Number((distanceKm * co2RatePerKm).toFixed(2));

      setImpactPoints(calculatedPoints);
      setCo2SavedKg(calculatedCo2);
    } else if (actionId === "reusable-container") {
      setImpactPoints(30);
      setCo2SavedKg(0.5);
    } else {
      setImpactPoints(50);
      setCo2SavedKg(3.5);
    }
  }, [actionId, transportMode, distanceKm]);

  const handleLogAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("You must be signed in to log daily actions.");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const finalAffiliationName = sector === "campus" 
        ? `${faculty} [Neighborhood: ${neighborhood}]` 
        : `${neighborhood} [Faculty: ${faculty}]`;

      await logBatchUserActions({
        items: [
          {
            actionId: actionId,
            actionTitle: actionId === "transit-commute" ? "Transit or Active Bike Commute" : "Zero Single-Use Container",
            points: impactPoints,
            quantity: 1,
            distanceKm: actionId === "transit-commute" ? distanceKm : undefined,
            notes: `Mode: ${transportMode} | Neighborhood: ${neighborhood} | Faculty: ${faculty}`,
          },
        ],
        sector: sector,
        affiliationType: sector === "campus" ? "faculty" : "neighbourhood",
        affiliationName: finalAffiliationName,
      });

      setSuccessMsg(`Successfully logged! +${impactPoints} pts (~${co2SavedKg} kg CO2e saved).`);
      if (onActionLogged) onActionLogged();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to log action.");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="bg-white border border-gray-200 p-6 font-sans">
      <div className="mb-4 pb-3 border-b border-gray-200">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-900">
          Log Daily Climate Action
        </h3>
        <p className="text-xs text-gray-500 font-mono mt-0.5">
          Select transport distance and dual community-faculty attribution.
        </p>
      </div>

      <form onSubmit={handleLogAction} className="space-y-4 font-mono text-xs">
        {successMsg && <div className="p-3 bg-emerald-50 text-emerald-800">{successMsg}</div>}
        {errorMsg && <div className="p-3 bg-red-50 text-red-700">{errorMsg}</div>}

        <div>
          <label className="block text-[11px] text-gray-500 uppercase mb-1">Select Action Type *</label>
          <select
            value={actionId}
            onChange={(e) => setActionId(e.target.value)}
            className="w-full p-2.5 border border-gray-300 text-xs font-sans bg-white"
          >
            <option value="transit-commute">Transit or Active Bike Commute — Dynamic</option>
            <option value="reusable-container">Zero Single-Use Container — 30 pts</option>
            <option value="tree-care">Urban Tree & Ecosystem Stewardship — 50 pts</option>
          </select>
        </div>

        {actionId === "transit-commute" && (
          <div className="p-4 bg-gray-50 border border-gray-200 space-y-3">
            <div>
              <label className="block text-[11px] text-gray-500 uppercase mb-1">Transport Mode *</label>
              <select
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value as any)}
                className="w-full p-2 border border-gray-300 text-xs font-sans bg-white"
              >
                <option value="bike">Bicycle</option>
                <option value="walk">Walking</option>
                <option value="bus">Public Transit / Bus</option>
                <option value="ev_carpool">Carpool / Electric Vehicle</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-gray-500 uppercase mb-1">Commute Distance (Kilometers) *</label>
              <input
                type="number"
                min="1"
                max="50"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 text-xs font-sans bg-white"
              />
            </div>

            <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2 border border-emerald-200 flex justify-between">
              <span>Calculated Impact:</span>
              <span className="font-bold">+{impactPoints} pts (~{co2SavedKg} kg CO2e avoided)</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-gray-500 uppercase mb-1">Sector *</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value as any)}
              className="w-full p-2.5 border border-gray-300 text-xs font-sans bg-white"
            >
              <option value="campus">Campus / UBC</option>
              <option value="public">Local Public</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 uppercase mb-1">Neighborhood *</label>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full p-2.5 border border-gray-300 text-xs font-sans bg-white"
            >
              {VANCOUVER_NEIGHBOURHOODS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-gray-500 uppercase mb-1">UBC Faculty / Unit *</label>
          <select
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className="w-full p-2.5 border border-gray-300 text-xs font-sans bg-white"
          >
            {UBC_FACULTIES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#0F2C23] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition"
        >
          {loading ? "LOGGING ACTION..." : "SUBMIT DAILY ACTION ↗"}
        </button>
      </form>
    </div>
  );
}
