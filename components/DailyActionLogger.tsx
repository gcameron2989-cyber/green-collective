"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";

interface DailyActionLoggerProps {
  onActionLogged?: () => void;
}

export default function DailyActionLogger({ onActionLogged }: DailyActionLoggerProps) {
  const { user } = useAuth();
  const [actionType, setActionType] = useState("Active Commute (Walking/Bike)");
  const [initiativeId, setInitiativeId] = useState("ubc-forestry-research");
  const [impactPoints, setImpactPoints] = useState(15);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  const handleLogAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("You must be signed in to log daily actions.");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const { error } = await supabase.from("user_actions").insert({
      user_id: user.id,
      initiative_id: initiativeId,
      action_type: actionType,
      impact_points: impactPoints,
      logged_at: new Date().toISOString().split("T")[0],
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg(`Successfully logged! +${impactPoints} impact points recorded.`);
      if (onActionLogged) onActionLogged();
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6 font-sans">
      <div className="mb-4 pb-3 border-b border-gray-200">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-900">
          Log Daily Climate Action
        </h3>
        <p className="text-xs text-gray-500 font-mono mt-0.5">
          Pilot active until December 9, 2026. Submit your daily impact metrics.
        </p>
      </div>

      {!user ? (
        <div className="p-4 bg-gray-50 border border-gray-200 text-xs font-mono text-gray-600 text-center">
          Please sign in to log actions and track your class rank.
        </div>
      ) : (
        <form onSubmit={handleLogAction} className="space-y-4 font-mono text-xs">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-[11px] text-gray-500 uppercase mb-1">
              Select Action Type *
            </label>
            <select
              value={actionType}
              onChange={(e) => {
                setActionType(e.target.value);
                // Adjust default points based on action
                if (e.target.value.includes("Commute")) setImpactPoints(15);
                else if (e.target.value.includes("Zero Waste")) setImpactPoints(10);
                else setImpactPoints(20);
              }}
              className="w-full p-2.5 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans bg-white"
            >
              <option value="Active Commute (Walking/Bike)">Active Commute (Walking/Bike) — 15 pts</option>
              <option value="Zero Waste / Reusable Container">Zero Waste / Reusable Container — 10 pts</option>
              <option value="Campus Biodiversity Stewardship">Campus Biodiversity Stewardship — 25 pts</option>
              <option value="Energy Conservation Action">Energy Conservation Action — 20 pts</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 uppercase mb-1">
              Associated Initiative *
            </label>
            <select
              value={initiativeId}
              onChange={(e) => setInitiativeId(e.target.value)}
              className="w-full p-2.5 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans bg-white"
            >
              <option value="ubc-forestry-research">UBC Faculty of Forestry Innovation & Research Hub</option>
              <option value="van-climate-emergency">City of Vancouver Climate Emergency Action Plan (CEAP)</option>
              <option value="toronto-ravine-strategy-hub">City of Toronto Ravine Strategy & Stewardship</option>
              <option value="c40-cities-network">C40 Cities Global Climate Leadership Network</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 uppercase mb-1">
              Assigned Impact Score (Points)
            </label>
            <input
              type="number"
              value={impactPoints}
              onChange={(e) => setImpactPoints(Number(e.target.value))}
              className="w-full p-2.5 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0F2C23] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition"
          >
            {loading ? "LOGGING ACTION..." : "SUBMIT DAILY ACTION ↗"}
          </button>
        </form>
      )}
    </div>
  );
}
