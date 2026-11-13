"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";

interface DailyActionLoggerProps {
  onActionLogged?: () => void;
}

export default function DailyActionLogger({ onActionLogged }: DailyActionLoggerProps) {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [actionType, setActionType] = useState("Active Commute (Walking/Bike)");
  const [transportMode, setTransportMode] = useState<"bike" | "walk" | "bus" | "ev_carpool">("bike");
  const [initiativeId, setInitiativeId] = useState("ubc-forestry-research");
  const [distanceKm, setDistanceKm] = useState(5);
  const [impactPoints, setImpactPoints] = useState(15);
  const [co2SavedKg, setCo2SavedKg] = useState(2.1);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (actionType.includes("Commute")) {
      let basePoints = 15;
      let co2RatePerKm = 0.21;

      if (transportMode === "bike" || transportMode === "walk") {
        basePoints = 20;
        co2RatePerKm = 0.25;
      } else if (transportMode === "bus") {
        basePoints = 25;
        co2RatePerKm = 0.18;
      } else if (transportMode === "ev_carpool") {
        basePoints = 30;
        co2RatePerKm = 0.15;
      }

      setImpactPoints(Math.round(basePoints + distanceKm * 2));
      setCo2SavedKg(Number((distanceKm * co2RatePerKm).toFixed(2)));
    } else if (actionType.includes("Zero Waste")) {
      setImpactPoints(10);
      setCo2SavedKg(0.5);
    } else {
      setImpactPoints(25);
      setCo2SavedKg(3.5);
    }
  }, [actionType, transportMode, distanceKm]);

  const handleLogAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("You must be signed in to log daily actions.");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    let notes = actionType.includes("Commute")
      ? `Mode: ${transportMode} | Distance: ${distanceKm} km | CO2 Saved: ${co2SavedKg} kg`
      : "";

    const { error } = await supabase.from("user_actions").insert({
      user_id: user.id,
      initiative_id: initiativeId,
      action_type: actionType,
      impact_points: impactPoints,
      notes: notes,
      logged_at: new Date().toISOString().split("T")[0],
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg(`Successfully logged! +${impactPoints} pts (~${co2SavedKg} kg CO2e saved).`);
      if (onActionLogged) onActionLogged();
    }
  };

  if (!isMounted) return null;

  return (
    <div className="bg-white border border-gray-200 p-6 font-sans">
      <div className="mb-4 pb-3 border-b border-gray-200">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-900">
          Log Daily Climate Action
        </h3>
      </div>

      <form onSubmit={handleLogAction} className="space-y-4 font-mono text-xs">
        {successMsg && <div className="p-3 bg-emerald-50 text-emerald-800">{successMsg}</div>}
        {errorMsg && <div className="p-3 bg-red-50 text-red-700">{errorMsg}</div>}

        <div>
          <label className="block text-[11px] text-gray-500 uppercase mb-1">Select Action Type *</label>
          <select
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            className="w-full p-2.5 border border-gray-300 text-xs font-sans bg-white"
          >
            <option value="Active Commute (Walking/Bike)">Sustainable Commute (Bus, Bike, Walk, EV) — Dynamic</option>
            <option value="Zero Waste / Reusable Container">Zero Waste / Reusable Container — 10 pts</option>
            <option value="Campus Biodiversity Stewardship">Campus Biodiversity Stewardship — 25 pts</option>
          </select>
        </div>

        {actionType.includes("Commute") && (
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
                max="100"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 text-xs font-sans bg-white"
              />
            </div>

            <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2 border border-emerald-200 flex justify-between">
              <span>Estimated Impact:</span>
              <span className="font-bold">+{impactPoints} pts (~{co2SavedKg} kg CO2e avoided)</span>
            </div>
          </div>
        )}

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
