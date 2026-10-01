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

  // Batch selection cart state: { [actionId]: quantity }
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Form attribution states
  const [sector, setSector] = useState<Sector>("public");
  const [publicAffiliationType, setPublicAffiliationType] = useState<PublicAffiliationType>("neighbourhood");
  const [neighbourhood, setNeighbourhood] = useState(VANCOUVER_NEIGHBOURHOODS[0]);
  const [customAffiliation, setCustomAffiliation] = useState("");
  const [faculty, setFaculty] = useState(UBC_FACULTIES[0]);

  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
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

    // Check for pending batch submission after auth redirect
    const pending = localStorage.getItem("pending_batch_action_submit");
    if (pending) {
      try {
        const parsed = JSON.parse(pending);
        if (parsed.cart) setCart(parsed.cart);
        if (parsed.sector) setSector(parsed.sector);
        if (parsed.publicAffiliationType) setPublicAffiliationType(parsed.publicAffiliationType);
        if (parsed.neighbourhood) setNeighbourhood(parsed.neighbourhood);
        if (parsed.customAffiliation) setCustomAffiliation(parsed.customAffiliation);
        if (parsed.faculty) setFaculty(parsed.faculty);
        setIsReviewOpen(true);
      } catch (err) {
        console.error("Failed to parse pending batch:", err);
      }
      localStorage.removeItem("pending_batch_action_submit");
    }
  }, []);

  // Cart operations
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

  // Calculations
  const selectedEntries = Object.entries(cart); // [actionId, qty]
  const totalSelectedCount = selectedEntries.reduce((acc, [_, qty]) => acc + qty, 0);

  const selectedItemsDetails = selectedEntries
    .map(([id, qty]) => {
      const detail = actionsList.find((a) => a.id === id);
      return detail ? { ...detail, selectedQty: qty } : null;
    })
    .filter(Boolean) as (ActionCatalogItem & { selectedQty: number })[];

  const totalPoints = selectedItemsDetails.reduce((acc, item) => acc + item.points * item.selectedQty, 0);
  const totalCO2 = selectedItemsDetails.reduce((acc, item) => acc + item.co2SavedKg * item.selectedQty, 0);

  const filteredActions =
    selectedCategory === "All" ? actionsList : actionsList.filter((a) => a.category === selectedCategory);

  const getAffiliationName = (): string => {
    if (sector === "campus") return faculty;
    if (publicAffiliationType === "neighbourhood") return neighbourhood;
    return customAffiliation.trim() || "Local Community";
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItemsDetails.length === 0) return;

    const finalAffiliationType: AffiliationType = sector === "campus" ? "faculty" : publicAffiliationType;

    if (!user) {
      const pendingData = {
        cart,
        sector,
        publicAffiliationType,
        neighbourhood,
        customAffiliation,
        faculty,
      };
      localStorage.setItem("pending_batch_action_submit", JSON.stringify(pendingData));
      router.push(`/login?redirectTo=${encodeURIComponent("/actions")}`);
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);

    try {
      const finalAffiliationName = getAffiliationName();
      const itemsToSubmit: BatchActionItem[] = selectedItemsDetails.map((item) => ({
        actionId: item.id,
        quantity: item.selectedQty,
      }));

      await logBatchUserActions({
        items: itemsToSubmit,
        sector,
        affiliationType: finalAffiliationType,
        affiliationName: finalAffiliationName,
      });

      setStatusMsg({
        type: "success",
        text: `Logged ${itemsToSubmit.length} actions! Credited to ${finalAffiliationName}.`,
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

  return (
    <div className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-32 font-sans relative">
      {/* Hero Banner */}
      <section className="bg-[#f1f6f2] border-b border-[#102f26]/10">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#39705d] block mb-1">
            Action Network
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Log Verified Impact</h1>
          <p className="text-xs text-[#526760] max-w-xl mt-1">
            Select one or multiple actions below to log them together and route impact points to your community or faculty.
          </p>

          {/* Category Filters */}
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

                  {/* Quantity Selection Control */}
                  {isSelected ? (
                    <div className="flex items-center gap-2 bg-[#f1f6f2] border border-[#39705d]/30 rounded-full px-2 py-1">
                      <button
                        onClick={() => setActionQuantity(action.id, currentQty - 1)}
                        className="w-6 h-6 rounded-full bg-white text-[#102f26] font-bold text-xs flex items-center justify-center hover:bg-gray-200 transition"
                        title="Decrease"
                      >
                        -
                      </button>
                      <span className="text-xs font-extrabold text-[#102f26] min-w-[18px] text-center">
                        {currentQty}
                      </span>
                      <button
                        onClick={() => setActionQuantity(action.id, currentQty + 1)}
                        className="w-6 h-6 rounded-full bg-[#102f26] text-white font-bold text-xs flex items-center justify-center hover:bg-[#39705d] transition"
                        title="Increase"
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

      {/* Floating Multi-Select Batch Bar */}
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
              Log Selected ({totalSelectedCount}) →
            </button>
          </div>
        </div>
      )}

      {/* Batch Review & Attribution Modal */}
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
              {/* Itemized List */}
              <div>
                <label className="block text-xs font-bold mb-2 text-[#102f26]">
                  1. Actions to record:
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedItemsDetails.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 bg-[#f1f6f2] rounded-xl text-xs border border-gray-200/60"
                    >
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
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attribution Selector */}
              <div>
                <label className="block text-xs font-bold mb-1.5 text-[#102f26]">
                  2. Sector Attribution:
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
                    3. Choose Community Attribution:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
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
                  ) : (
                    <div>
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
                    3. Select Faculty / Student Unit:
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
              )}

              {/* Total Summary Box */}
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
