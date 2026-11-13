"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logBatchUserActions, AffiliationType, BatchActionItem } from "@/actions/user-actions";

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

const DEFAULT_ACTIONS: ActionCatalogItem[] = [
  {
    id: "transit-commute",
    title: "Transit or Active Bike Commute",
    category: "Mobility",
    points: 25,
    co2SavedKg: 2.1,
    unitLabel: "trips",
    description: "Replaced single-occupancy vehicle driving with transit, cycling, or walking.",
  },
  {
    id: "reusable-container",
    title: "Zero Single-Use Container",
    category: "Circular Economy",
    points: 30,
    co2SavedKg: 0.5,
    unitLabel: "containers",
    description: "Used a reusable cup, mug, or food container at local businesses or dining halls.",
  },
  {
    id: "tree-care",
    title: "Urban Tree & Ecosystem Stewardship",
    category: "Ecosystem Stewardship",
    points: 50,
    co2SavedKg: 3.5,
    unitLabel: "sessions",
    description: "Participated in canopy care, invasive species removal, or community garden maintenance.",
  },
  {
    id: "plant-based-meal",
    title: "Plant-Based Meal Choice",
    category: "Food & Agriculture",
    points: 20,
    co2SavedKg: 1.4,
    unitLabel: "meals",
    description: "Chose a fully plant-based meal over animal-intensive protein options.",
  },
  {
    id: "food-waste-compost",
    title: "Organic Waste Diversion & Composting",
    category: "Food & Agriculture",
    points: 15,
    co2SavedKg: 0.4,
    unitLabel: "days",
    description: "Diverted 100% of household food scraps to municipal green bins or home compost.",
  },
  {
    id: "cold-water-laundry",
    title: "Cold Water Wash & Line Dry",
    category: "Energy & Water",
    points: 15,
    co2SavedKg: 0.9,
    unitLabel: "loads",
    description: "Washed laundry in cold water and air-dried garments instead of using a heated dryer.",
  },
  {
    id: "energy-conservation",
    title: "Home & Office Energy Reduction",
    category: "Energy & Water",
    points: 20,
    co2SavedKg: 1.2,
    unitLabel: "days",
    description: "Lowered thermostat, eliminated phantom power loads, or installed high-efficiency LEDs.",
  },
  {
    id: "repair-upcycle",
    title: "Repair, Upcycle, or Thrift Goods",
    category: "Circular Economy",
    points: 40,
    co2SavedKg: 2.5,
    unitLabel: "items",
    description: "Repaired clothing, electronics, or furniture instead of purchasing new items.",
  },
  {
    id: "ev-charging-shared",
    title: "Shared EV / Carpool Trip",
    category: "Mobility",
    points: 35,
    co2SavedKg: 3.0,
    unitLabel: "trips",
    description: "Shared an electric vehicle ride or organized carpooling for commutes.",
  },
  {
    id: "community-clean-up",
    title: "Shoreline / Park Clean-Up",
    category: "Ecosystem Stewardship",
    points: 60,
    co2SavedKg: 4.0,
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

  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [actionsList, setActionsList] = useState<ActionCatalogItem[]>(DEFAULT_ACTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [cart, setCart] = useState<Record<string, number>>({});
  const [commuteDistances, setCommuteDistances] = useState<Record<string, number>>({ "transit-commute": 5 });
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Dual Attribution State
  const [sector, setSector] = useState<Sector>("public");
  const [publicAffiliationType, setPublicAffiliationType] = useState<PublicAffiliationType>("neighbourhood");
  const [neighbourhood, setNeighbourhood] = useState(VANCOUVER_NEIGHBOURHOODS[0]);
  const [customAffiliation, setCustomAffiliation] = useState("");
  const [faculty, setFaculty] = useState(UBC_FACULTIES[0]);

  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

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
  }, []);

  const setActionQuantity = (actionId: string, qty: number) => {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[actionId];
      } else {
        next[actionId] = qty;
      }
      return next;
    });
  };

  const clearCart = () => setCart({});

  const selectedEntries = Object.entries(cart);
  const totalSelectedCount = selectedEntries.reduce((acc, [_, qty]) => acc + qty, 0);

  const selectedItemsDetails = selectedEntries
    .map(([id, qty]) => {
      const detail = actionsList.find((a) => a.id === id);
      if (!detail) return null;

      let calculatedCo2 = detail.co2SavedKg;
      let calculatedPoints = detail.points;

      // Non-linear carbon accounting for commute distance
      if (id === "transit-commute") {
        const dist = commuteDistances[id] || 5;
        // Diminishing returns formula for efficiency / non-linear scaling
        calculatedCo2 = Number((dist * 0.22 + Math.log(dist + 1) * 0.5).toFixed(2));
        calculatedPoints = Math.round(15 + dist * 1.8 + Math.sqrt(dist) * 2);
      }

      return {
        ...detail,
        points: calculatedPoints,
        co2SavedKg: calculatedCo2,
        selectedQty: qty,
      };
    })
    .filter(Boolean) as (ActionCatalogItem & { selectedQty: number })[];

  const totalPoints = selectedItemsDetails.reduce((acc, item) => acc + item.points * item.selectedQty, 0);
  const totalCO2 = selectedItemsDetails.reduce((acc, item) => acc + item.co2SavedKg * item.selectedQty, 0);

  const filteredActions =
    selectedCategory === "All" ? actionsList : actionsList.filter((a) => a.category === selectedCategory);

  const getAffiliationName = (): string => {
    const primaryHub = sector === "campus" ? faculty : (publicAffiliationType === "neighbourhood" ? neighbourhood : customAffiliation.trim() || "Local Community");
    // Bundle both neighborhood and faculty into notes/affiliation for dual tracking
    return `${primaryHub} [Neighborhood: ${neighbourhood} | Faculty: ${faculty}]`;
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItemsDetails.length === 0) return;

    const finalAffiliationType: AffiliationType = sector === "campus" ? "faculty" : publicAffiliationType;

    if (!user) {
      router.push(`/login?redirectTo=${encodeURIComponent("/actions")}`);
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);

    try {
      const finalAffiliationName = getAffiliationName();
      const itemsToSubmit: BatchActionItem[] = selectedItemsDetails.map((item) => {
        const isCommute = item.id === "transit-commute";
        const dist = commuteDistances[item.id] || 5;
        return {
          actionId: item.id,
          quantity: item.selectedQty,
          distanceKm: isCommute ? dist : undefined,
          notes: `Neighborhood: ${neighbourhood} | Faculty: ${faculty}${isCommute ? ` | Commute Distance: ${dist} km` : ""}`,
        };
      });

      await logBatchUserActions({
        items: itemsToSubmit,
        sector,
        affiliationType: finalAffiliationType,
        affiliationName: finalAffiliationName,
      });

      setStatusMsg({
        type: "success",
        text: `Logged ${itemsToSubmit.length} actions! Credited to ${neighbourhood} & ${faculty}.`,
      });

      setTimeout(() => {
        clearCart();
        setIsReviewOpen(false);
        setStatusMsg(null);
      }, 1800);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to submit batch actions." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-[#f9f8f6] animate-pulse" suppressHydrationWarning />;
  }

  return (
    <div className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-32 font-sans relative" suppressHydrationWarning>
      <section className="bg-[#f1f6f2] border-b border-[#102f26]/10">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#39705d] block mb-1">
            Action Network
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Log Verified Impact</h1>
          <p className="text-xs text-[#526760] max-w-xl mt-1">
            Select actions below to log them together with precise commute metrics and dual community-faculty attribution.
          </p>

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

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActions.map((action) => {
            const currentQty = cart[action.id] || 0;
            const isSelected = currentQty > 0;

            return (
              <div
                key={action.id}
                className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all ${
                  isSelected ? "border-[#39705d] ring-2 ring-[#39705d]/10 bg-[#fbfdfb]" : "border-[#102f26]/10 hover:border-[#102f26]/30"
                }`}
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

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-medium">
                    ~{action.co2SavedKg} kg CO₂e / {action.unitLabel}
                  </span>

                  {isSelected ? (
                    <div className="flex items-center gap-2 bg-[#f1f6f2] border border-[#39705d]/30 rounded-full px-2 py-1">
                      <button
                        onClick={() => setActionQuantity(action.id, currentQty - 1)}
                        className="w-6 h-6 rounded-full bg-white text-[#102f26] font-bold text-xs flex items-center justify-center hover:bg-gray-200 transition"
                      >
                        -
                      </button>
                      <span className="text-xs font-extrabold text-[#102f26] min-w-[18px] text-center">
                        {currentQty}
                      </span>
                      <button
                        onClick={() => setActionQuantity(action.id, currentQty + 1)}
                        className="w-6 h-6 rounded-full bg-[#102f26] text-white font-bold text-xs flex items-center justify-center hover:bg-[#39705d] transition"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActionQuantity(action.id, 1)}
                      className="px-4 py-1.5 border border-[#102f26] text-[#102f26] text-xs font-bold rounded-full hover:bg-[#102f26] hover:text-white transition"
                    >
                      + Select
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {totalSelectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#102f26] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center justify-between gap-6 border border-emerald-500/20 max-w-2xl w-[92%] backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="bg-[#39705d] text-white text-xs font-extrabold px-2.5 py-1 rounded-full">
              {selectedItemsDetails.length} {selectedItemsDetails.length === 1 ? "Action" : "Actions"}
            </span>
            <div className="text-xs">
              <span className="font-bold text-emerald-300">+{totalPoints} pts</span>
              <span className="text-gray-300 mx-1.5">•</span>
              <span className="text-gray-300">~{totalCO2.toFixed(1)} kg CO₂e</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCart}
              className="text-xs text-gray-400 hover:text-white underline underline-offset-2"
            >
              Clear
            </button>
            <button
              onClick={() => setIsReviewOpen(true)}
              className="px-5 py-2 bg-emerald-400 text-[#102f26] text-xs font-black rounded-full hover:bg-emerald-300 transition shadow"
            >
              Review & Log ({totalSelectedCount}) →
            </button>
          </div>
        </div>
      )}

      {isReviewOpen && (
        <div className="fixed inset-0 z-50 bg-[#102f26]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#102f26]/20 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#102f26]/10 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#39705d]">Batch Review</span>
                <h3 className="text-lg font-bold">Log {selectedItemsDetails.length} Selected Actions</h3>
              </div>
              <button
                onClick={() => setIsReviewOpen(false)}
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

            <form onSubmit={handleBatchSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold mb-2 text-[#102f26]">
                  1. Actions & Commute Scaling:
                </label>
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {selectedItemsDetails.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#f1f6f2] rounded-xl text-xs border border-gray-200/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#102f26]">{item.title}</div>
                          <div className="text-[10px] text-[#526760]">
                            +{item.points * item.selectedQty} pts • ~{(item.co2SavedKg * item.selectedQty).toFixed(1)} kg CO₂
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={item.selectedQty}
                            onChange={(e) => setActionQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-14 p-1 text-center font-bold text-xs rounded-lg border border-gray-300 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setActionQuantity(item.id, 0)}
                            className="text-red-500 hover:text-red-700 font-bold px-1"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {item.id === "transit-commute" && (
                        <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                          <span className="text-[11px] text-gray-600 font-medium">Commute Distance (km):</span>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={commuteDistances[item.id] || 5}
                            onChange={(e) =>
                              setCommuteDistances({
                                ...commuteDistances,
                                [item.id]: Math.max(1, Number(e.target.value)),
                              })
                            }
                            className="w-20 p-1 text-center font-bold text-xs rounded-lg border border-gray-300 bg-white"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dual Attribution: Neighborhood & Faculty Selection */}
              <div className="space-y-3 p-4 bg-[#f1f6f2] rounded-xl border border-[#102f26]/10">
                <label className="block text-xs font-bold text-[#102f26]">
                  2. Dual Community & Institutional Attribution:
                </label>

                <div>
                  <label className="block text-[11px] font-semibold text-[#526760] mb-1">
                    Vancouver Neighborhood Hub:
                  </label>
                  <select
                    value={neighbourhood}
                    onChange={(e) => setNeighbourhood(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-gray-300 bg-white font-medium"
                  >
                    {VANCOUVER_NEIGHBOURHOODS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#526760] mb-1">
                    UBC Faculty / Campus Unit:
                  </label>
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-gray-300 bg-white font-medium"
                  >
                    {UBC_FACULTIES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-[#102f26]">Total Impact Generated:</span>
                  <div className="text-[11px] text-[#39705d]">
                    ~{totalCO2.toFixed(1)} kg CO₂ emissions avoided
                  </div>
                </div>
                <div className="text-[#102f26] font-black text-sm">+{totalPoints} pts</div>
              </div>

              {!user && (
                <p className="text-[11px] text-[#39705d] bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  ℹ You are signed out. Submitting will save your selections, prompt sign-in, and automatically log the batch when you return.
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(false)}
                  className="w-1/2 py-2.5 border border-gray-300 rounded-full text-xs font-semibold"
                >
                  Back to Grid
                </button>
                <button
                  type="submit"
                  disabled={submitting || selectedItemsDetails.length === 0}
                  className="w-1/2 py-2.5 bg-[#102f26] text-white rounded-full text-xs font-semibold hover:bg-[#39705d] transition disabled:opacity-50"
                >
                  {submitting ? "Processing..." : user ? "Confirm & Log All" : "Sign In & Log →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
