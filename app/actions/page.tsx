"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logUserAction } from "@/actions/user-actions";

type Sector = "public" | "campus";
type AffiliationType = "neighbourhood" | "association" | "company" | "faculty";

interface ActionCatalogItem {
  id: string;
  title: string;
  category: string;
  points: number;
  co2SavedKg: number;
  unitLabel: string;
  description: string;
}

const ACTIONS: ActionCatalogItem[] = [
  {
    id: "transit-commute",
    title: "Transit or Active Bike Commute",
    category: "Sustainable Mobility",
    points: 25,
    co2SavedKg: 2.4,
    unitLabel: "trips",
    description: "Replaced single-occupancy driving with transit, cycling, or walking.",
  },
  {
    id: "reusable-container",
    title: "Zero Single-Use Container",
    category: "Circular Economy",
    points: 30,
    co2SavedKg: 0.8,
    unitLabel: "containers",
    description: "Used a reusable cup, mug, or food container at local businesses.",
  },
  {
    id: "tree-care",
    title: "Urban Tree & Ecosystem Care",
    category: "Ecosystem Stewardship",
    points: 50,
    co2SavedKg: 5.0,
    unitLabel: "sessions",
    description: "Participated in canopy care, invasive species removal, or local gardening.",
  },
];

const VANCOUVER_NEIGHBOURHOODS = [
  "Kitsilano",
  "Point Grey",
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
];

export default function ActionsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<ActionCatalogItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [sector, setSector] = useState<Sector>("public");
  const [affiliationType, setAffiliationType] = useState<AffiliationType>("neighbourhood");
  const [neighbourhood, setNeighbourhood] = useState(VANCOUVER_NEIGHBOURHOODS[0]);
  const [customAffiliation, setCustomAffiliation] = useState("");
  const [faculty, setFaculty] = useState(UBC_FACULTIES[0]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  // Restore pending action state after login & get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const pending = localStorage.getItem("pending_action_submit");
    if (pending) {
      try {
        const parsed = JSON.parse(pending);
        const match = ACTIONS.find((a) => a.id === parsed.actionId);
        if (match) {
          setSelectedAction(match);
          if (parsed.sector) setSector(parsed.sector);
          if (parsed.affiliationType) setAffiliationType(parsed.affiliationType);
          if (parsed.neighbourhood) setNeighbourhood(parsed.neighbourhood);
          if (parsed.customAffiliation) setCustomAffiliation(parsed.customAffiliation);
          if (parsed.faculty) setFaculty(parsed.faculty);
          if (parsed.quantity) setQuantity(parsed.quantity);
        }
      } catch (err) {
        console.error("Failed to parse pending action:", err);
      }
      localStorage.removeItem("pending_action_submit");
    }
  }, []);

  const getAffiliationName = (): string => {
    if (sector === "campus") return faculty;
    if (affiliationType === "neighbourhood") return neighbourhood;
    return customAffiliation.trim() || "Local Community";
  };

  const handleOpenActionModal = (action: ActionCatalogItem) => {
    setSelectedAction(action);
    setStatusMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;

    // If non-user, save form state to localStorage and redirect to login
    if (!user) {
      const pendingData = {
        actionId: selectedAction.id,
        sector,
        affiliationType: sector === "campus" ? "faculty" : affiliationType,
        neighbourhood,
        customAffiliation,
        faculty,
        quantity,
      };
      localStorage.setItem("pending_action_submit", JSON.stringify(pendingData));
      router.push(`/login?redirectTo=${encodeURIComponent("/actions")}`);
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);

    try {
      const finalAffiliationType = sector === "campus" ? "faculty" : affiliationType;
      const finalAffiliationName = getAffiliationName();

      await logUserAction({
        actionId: selectedAction.id,
        sector,
        affiliationType: finalAffiliationType,
        affiliationName: finalAffiliationName,
        quantity,
        notes,
      });

      setStatusMsg({
        type: "success",
        text: `Action successfully logged! Credited to ${finalAffiliationName}.`,
      });
      setTimeout(() => setSelectedAction(null), 1800);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to log action." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-24 font-sans">
      {/* Navigation Header */}
      <nav className="border-b border-[#102f26]/10 bg-white/80 backdrop-blur sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg tracking-tight text-[#102f26]">
            Green Collective
          </Link>
          <div className="flex gap-6 text-xs font-semibold">
            <Link href="/actions" className="text-[#39705d] underline underline-offset-4">Actions</Link>
            <Link href="/initiatives" className="hover:text-[#39705d] transition">Initiatives</Link>
            <Link href="/dashboard" className="hover:text-[#39705d] transition">Dashboard</Link>
            {user ? (
              <Link href="/profile" className="hover:text-[#39705d] transition">Profile</Link>
            ) : (
              <Link href="/login?redirectTo=%2Factions" className="text-[#39705d] font-bold">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="bg-[#f1f6f2] border-b border-[#102f26]/10">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#39705d] block mb-1">
            Action Network
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Log Verified Impact</h1>
          <p className="text-xs text-[#526760] max-w-xl mt-1">
            Log sustainable actions and route impact points directly to your local neighbourhood or campus faculty.
          </p>
        </div>
      </section>

      {/* Action Directory Grid */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACTIONS.map((action) => (
            <div
              key={action.id}
              className="bg-white border border-[#102f26]/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#102f26]/30 transition"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-mono uppercase bg-[#f1f6f2] text-[#39705d] px-2 py-0.5 rounded">
                    {action.category}
                  </span>
                  <span className="text-xs font-bold text-[#102f26]">+{action.points} pts</span>
                </div>
                <h2 className="text-base font-bold mb-2">{action.title}</h2>
                <p className="text-xs text-[#526760] leading-relaxed mb-6">{action.description}</p>
              </div>

              <button
                onClick={() => handleOpenActionModal(action)}
                className="w-full py-2.5 bg-[#102f26] text-white text-xs font-bold rounded-full hover:bg-[#39705d] transition"
              >
                Log Action
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Action Logging Modal Drawer */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 bg-[#102f26]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#102f26]/20 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-[#102f26]/10 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#39705d]">Recording Action</span>
                <h3 className="text-lg font-bold">{selectedAction.title}</h3>
              </div>
              <button
                onClick={() => setSelectedAction(null)}
                className="text-gray-400 hover:text-black font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {statusMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-medium mb-4 text-center ${
                  statusMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Sector Selection */}
              <div>
                <label className="block text-xs font-bold mb-1.5 text-[#102f26]">
                  1. Which sector are you logging this for?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSector("public")}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                      sector === "public"
                        ? "bg-[#102f26] text-white border-[#102f26]"
                        : "bg-gray-50 text-[#526760] border-gray-200"
                    }`}
                  >
                    Local Public / Community
                  </button>
                  <button
                    type="button"
                    onClick={() => setSector("campus")}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                      sector === "campus"
                        ? "bg-[#102f26] text-white border-[#102f26]"
                        : "bg-gray-50 text-[#526760] border-gray-200"
                    }`}
                  >
                    Campus / Student
                  </button>
                </div>
              </div>

              {/* Affiliation Selection */}
              {sector === "public" ? (
                <div className="p-3.5 bg-[#f1f6f2] rounded-xl border border-[#102f26]/10 space-y-3">
                  <label className="block text-xs font-bold text-[#102f26]">
                    2. Choose Community Attribution:
                  </label>
                  <div className="flex gap-2">
                    {(["neighbourhood", "association", "company"] as AffiliationType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAffiliationType(type)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg capitalize border ${
                          affiliationType === type
                            ? "bg-[#39705d] text-white border-[#39705d]"
                            : "bg-white text-[#526760] border-gray-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {affiliationType === "neighbourhood" ? (
                    <div>
                      <label className="block text-[11px] text-[#526760] mb-1 font-medium">
                        Select Neighbourhood:
                      </label>
                      <select
                        value={neighbourhood}
                        onChange={(e) => setNeighbourhood(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg border border-gray-300 bg-white"
                      >
                        {VANCOUVER_NEIGHBOURHOODS.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] text-[#526760] mb-1 font-medium">
                        Name of {affiliationType}:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={`e.g., Local ${affiliationType} name`}
                        value={customAffiliation}
                        onChange={(e) => setCustomAffiliation(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg border border-gray-300 bg-white"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3.5 bg-[#f1f6f2] rounded-xl border border-[#102f26]/10 space-y-2">
                  <label className="block text-xs font-bold text-[#102f26]">
                    2. Select Faculty / Student Unit:
                  </label>
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-gray-300 bg-white"
                  >
                    {UBC_FACULTIES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full p-2 text-xs rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Impact Total:</label>
                  <div className="p-2 bg-gray-100 rounded-lg text-xs font-bold text-[#102f26]">
                    +{selectedAction.points * quantity} pts
                  </div>
                </div>
              </div>

              {!user && (
                <p className="text-[11px] text-[#39705d] bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  ℹ You are signed out. Submitting will save your choices, send you to sign in, and automatically log the action when you return.
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAction(null)}
                  className="w-1/2 py-2.5 border border-gray-300 rounded-full text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2.5 bg-[#102f26] text-white rounded-full text-xs font-semibold hover:bg-[#39705d] transition disabled:opacity-50"
                >
                  {submitting ? "Processing..." : user ? "Confirm Action" : "Sign In & Log →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
