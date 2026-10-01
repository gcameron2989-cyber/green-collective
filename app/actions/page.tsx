"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logUserAction, AffiliationType } from "@/actions/user-actions";

type Sector = "public" | "campus";
type PublicAffiliationType = "neighbourhood" | "association" | "company" | "other";

interface ActionCatalogItem {
  id: string;
  title: string;
  category: "Mobility" | "Circular Economy" | "Food & Agriculture" | "Energy & Water" | "Ecosystem Stewardship";
  points: number;
  co2SavedKg: number;
  unitLabel: string;
  description: string;
}

// Fallback catalog featuring a comprehensive range of sustainability actions
const DEFAULT_ACTIONS: ActionCatalogItem[] = [
  {
    id: "transit-commute",
    title: "Transit or Active Bike Commute",
    category: "Mobility",
    points: 25,
    co2SavedKg: 2.4,
    unitLabel: "trips",
    description: "Replaced single-occupancy vehicle driving with transit, cycling, or walking.",
  },
  {
    id: "reusable-container",
    title: "Zero Single-Use Container",
    category: "Circular Economy",
    points: 30,
    co2SavedKg: 0.8,
    unitLabel: "containers",
    description: "Used a reusable cup, mug, or food container at local businesses or dining halls.",
  },
  {
    id: "tree-care",
    title: "Urban Tree & Ecosystem Stewardship",
    category: "Ecosystem Stewardship",
    points: 50,
    co2SavedKg: 5.0,
    unitLabel: "sessions",
    description: "Participated in canopy care, invasive species removal, or community garden maintenance.",
  },
  {
    id: "plant-based-meal",
    title: "Plant-Based Meal Choice",
    category: "Food & Agriculture",
    points: 20,
    co2SavedKg: 1.8,
    unitLabel: "meals",
    description: "Chose a fully plant-based meal over animal-intensive protein options.",
  },
  {
    id: "food-waste-compost",
    title: "Organic Waste Diversion & Composting",
    category: "Food & Agriculture",
    points: 15,
    co2SavedKg: 0.6,
    unitLabel: "days",
    description: "Diverted 100% of household food scraps to municipal green bins or home compost.",
  },
  {
    id: "cold-water-laundry",
    title: "Cold Water Wash & Line Dry",
    category: "Energy & Water",
    points: 15,
    co2SavedKg: 1.1,
    unitLabel: "loads",
    description: "Washed laundry in cold water and air-dried garments instead of using a heated dryer.",
  },
  {
    id: "energy-conservation",
    title: "Home & Office Energy Reduction",
    category: "Energy & Water",
    points: 20,
    co2SavedKg: 1.5,
    unitLabel: "days",
    description: "Lowered thermostat, eliminated phantom power loads, or installed high-efficiency LEDs.",
  },
  {
    id: "repair-upcycle",
    title: "Repair, Upcycle, or Thrift Goods",
    category: "Circular Economy",
    points: 40,
    co2SavedKg: 3.2,
    unitLabel: "items",
    description: "Repaired clothing, electronics, or furniture instead of purchasing new items.",
  },
  {
    id: "ev-charging-shared",
    title: "Shared EV / Carpool Trip",
    category: "Mobility",
    points: 35,
    co2SavedKg: 4.1,
    unitLabel: "trips",
    description: "Shared an electric vehicle ride or organized carpooling for commutes.",
  },
  {
    id: "community-clean-up",
    title: "Shoreline / Park Clean-Up",
    category: "Ecosystem Stewardship",
    points: 60,
    co2SavedKg: 6.0,
    unitLabel: "events",
    description: "Collected and properly sorted litter from public parks, beaches, or campus grounds.",
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
  "Faculty of Land and Food Systems",
];

const CATEGORIES = ["All", "Mobility", "Circular Economy", "Food & Agriculture", "Energy & Water", "Ecosystem Stewardship"];

export default function ActionsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [actionsList, setActionsList] = useState<ActionCatalogItem[]>(DEFAULT_ACTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedAction, setSelectedAction] = useState<ActionCatalogItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [sector, setSector] = useState<Sector>("public");
  const [publicAffiliationType, setPublicAffiliationType] = useState<PublicAffiliationType>("neighbourhood");
  const [neighbourhood, setNeighbourhood] = useState(VANCOUVER_NEIGHBOURHOODS[0]);
  const [customAffiliation, setCustomAffiliation] = useState("");
  const [faculty, setFaculty] = useState(UBC_FACULTIES[0]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    // Check Auth State
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Try fetching custom actions from Supabase database; fallback to DEFAULT_ACTIONS
    async function loadActions() {
      const { data, error } = await supabase.from("actions").select("*");
      if (!error && data && data.length > 0) {
        const mapped: ActionCatalogItem[] = data.map((item: any) => ({
          id: item.id || item.slug,
          title: item.title,
          category: item.category || "Circular Economy",
          points: item.points || 25,
          co2SavedKg: item.co2_saved_kg || item.co2SavedKg || 1.0,
          unitLabel: item.unit_label || item.unitLabel || "times",
          description: item.description || "",
        }));
        setActionsList(mapped);
      }
    }
    loadActions();

    // Check for pending action logged prior to sign-in redirect
    const pending = localStorage.getItem("pending_action_submit");
    if (pending) {
      try {
        const parsed = JSON.parse(pending);
        const match = DEFAULT_ACTIONS.find((a) => a.id === parsed.actionId);
        if (match) {
          setSelectedAction(match);
          if (parsed.sector) setSector(parsed.sector);
          if (parsed.publicAffiliationType) setPublicAffiliationType(parsed.publicAffiliationType);
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

  const filteredActions = selectedCategory === "All"
    ? actionsList
    : actionsList.filter((a) => a.category === selectedCategory);

  const getAffiliationName = (): string => {
    if (sector === "campus") return faculty;
    if (publicAffiliationType === "neighbourhood") return neighbourhood;
    return customAffiliation.trim() || "Local Community";
  };

  const handleOpenActionModal = (action: ActionCatalogItem) => {
    setSelectedAction(action);
    setStatusMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;

    const finalAffiliationType: AffiliationType = sector === "campus" ? "faculty" : publicAffiliationType;

    if (!user) {
      const pendingData = {
        actionId: selectedAction.id,
        sector,
        publicAffiliationType,
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
        text: `Action logged! Credited directly to ${finalAffiliationName}.`,
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
      {/* Consolidated Navigation Header */}
      <nav className="border-b border-[#102f26]/10 bg-white/90 backdrop-blur sticky top-0 z-30 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-black text-lg tracking-tight text-[#102f26]">
            Green Collective
          </Link>
          <div className="flex items-center gap-6 text-xs font-semibold">
            <Link href="/actions" className="text-[#39705d] underline underline-offset-4 font-bold">Actions</Link>
            <Link href="/initiatives" className="hover:text-[#39705d] transition">Initiatives</Link>
            <Link href="/dashboard" className="hover:text-[#39705d] transition">Dashboard</Link>
            {user ? (
              <Link href="/profile" className="hover:text-[#39705d] transition">Profile</Link>
            ) : (
              <Link href="/login?redirectTo=%2Factions" className="px-3.5 py-1.5 bg-[#102f26] text-white rounded-full font-bold">Sign In</Link>
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

          {/* Category Filter Bar */}
          <div className="flex flex-wrap gap-2 mt-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-[#102f26] text-white"
                    : "bg-white text-[#526760] border border-[#102f26]/10 hover:border-[#102f26]/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Action Directory Grid */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActions.map((action) => (
            <div
              key={action.id}
              className="bg-white border border-[#102f26]/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#102f26]/30 transition"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-mono uppercase bg-[#f1f6f2] text-[#39705d] px-2 py-0.5 rounded font-semibold">
                    {action.category}
                  </span>
                  <span className="text-xs font-bold text-[#102f26]">+{action.points} pts</span>
                </div>
                <h2 className="text-base font-bold mb-2">{action.title}</h2>
                <p className="text-xs text-[#526760] leading-relaxed mb-6">{action.description}</p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-medium">~{action.co2SavedKg} kg CO₂e / {action.unitLabel}</span>
                <button
                  onClick={() => handleOpenActionModal(action)}
                  className="px-4 py-2 bg-[#102f26] text-white text-xs font-bold rounded-full hover:bg-[#39705d] transition"
                >
                  Log Action
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Logging Modal */}
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
              <div>
                <label className="block text-xs font-bold mb-1.5 text-[#102f26]">
                  1. Sector Attribution:
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

              {sector === "public" ? (
                <div className="p-3.5 bg-[#f1f6f2] rounded-xl border border-[#102f26]/10 space-y-3">
                  <label className="block text-xs font-bold text-[#102f26]">
                    2. Choose Community Attribution:
                  </label>
                  <div className="flex gap-2">
                    {(["neighbourhood", "association", "company", "other"] as PublicAffiliationType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPublicAffiliationType(type)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg capitalize border ${
                          publicAffiliationType === type
                            ? "bg-[#39705d] text-white border-[#39705d]"
                            : "bg-white text-[#526760] border-gray-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {publicAffiliationType === "neighbourhood" ? (
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
                        Name of {publicAffiliationType}:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={`e.g., Local ${publicAffiliationType} name`}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Quantity ({selectedAction.unitLabel}):</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full p-2 text-xs rounded-lg border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Impact Total:</label>
                  <div className="p-2 bg-gray-100 rounded-lg text-xs font-bold text-[#102f26]">
                    +{selectedAction.points * quantity} pts ({(selectedAction.co2SavedKg * quantity).toFixed(1)} kg CO₂)
                  </div>
                </div>
              </div>

              {!user && (
                <p className="text-[11px] text-[#39705d] bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  ℹ You are signed out. Submitting will save your choices, prompt sign in, and automatically log the action upon return.
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
