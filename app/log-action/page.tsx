"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ACTION_REGISTRY, ActionItem } from "@/lib/actions";
import { logBatchUserActions, AffiliationType, BatchActionItem } from "@/actions/user-actions";

type Sector = "public" | "campus";
type PublicAffiliationType = "neighbourhood" | "association" | "company" | "other";

const VANCOUVER_NEIGHBOURHOODS = [
  "Arbutus Ridge",
  "Burnaby",
  "Downtown",
  "Dunbar-Southlands",
  "Fairview",
  "Grandview-Woodland",
  "Hastings-Sunrise",
  "Kensington-Cedar Cottage",
  "Kerrisdale",
  "Kitsilano",
  "Marpole",
  "Mount Pleasant",
  "North Vancouver",
  "Oakridge",
  "Point Grey",
  "Renfrew-Collingwood",
  "Richmond",
  "Shaughnessy",
  "South Cambie",
  "Strathcona",
  "Sunset",
  "Surrey",
  "UBC / UEL",
  "Victoria-Fraserview",
  "West End",
  "West Vancouver",
].sort();

const UBC_FACULTIES = [
  "Faculty of Applied Science",
  "Faculty of Arts",
  "Faculty of Dentistry",
  "Faculty of Education",
  "Faculty of Forestry",
  "Faculty of Graduate and Postdoctoral Studies",
  "Faculty of Land and Food Systems",
  "Faculty of Medicine",
  "Faculty of Pharmaceutical Sciences",
  "Faculty of Science",
  "Peter A. Allard School of Law",
  "Sauder School of Business",
  "School of Architecture and Landscape Architecture",
  "School of Audiology and Speech Sciences",
  "School of Community and Regional Planning",
  "School of Information",
  "School of Journalism, Writing, and Media",
  "School of Kinesiology",
  "School of Music",
  "School of Nursing",
  "School of Population and Public Health",
  "School of Public Policy and Global Affairs",
  "School of Social Work",
  "UBC Vantage College",
  "Vancouver School of Economics",
].sort();

const CATEGORIES = ["All", "TRANSPORT", "FOOD", "ENERGY", "WASTE", "CIRCULARITY", "COMMUNITY"];

const TRANSPORT_IDS = ["active-transit", "public-transit", "ev-rideshare", "carpool-fossil"];

export default function LogActionPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [cart, setCart] = useState<Record<string, number>>({});
  const [commuteDistances, setCommuteDistances] = useState<Record<string, number>>({
    "active-transit": 5,
    "public-transit": 10,
    "ev-rideshare": 10,
    "carpool-fossil": 15,
  });
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Dual Attribution State
  const [selectedSectors, setSelectedSectors] = useState<Sector[]>(["campus"]);
  const [publicAffiliationType] = useState<PublicAffiliationType>("neighbourhood");
  
  const [neighbourhood, setNeighbourhood] = useState(VANCOUVER_NEIGHBOURHOODS[0]);
  const [neighbourhoodSearch, setNeighbourhoodSearch] = useState("");
  const [isNeighborhoodDropdownOpen, setIsNeighborhoodDropdownOpen] = useState(false);
  
  const [faculty, setFaculty] = useState(UBC_FACULTIES[0]);
  const [facultySearch, setFacultySearch] = useState("");
  const [isFacultyDropdownOpen, setIsFacultyDropdownOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  const filteredNeighborhoods = useMemo(() => {
    return VANCOUVER_NEIGHBOURHOODS.filter((n) =>
      n.toLowerCase().includes(neighbourhoodSearch.toLowerCase())
    );
  }, [neighbourhoodSearch]);

  const filteredFaculties = useMemo(() => {
    return UBC_FACULTIES.filter((f) =>
      f.toLowerCase().includes(facultySearch.toLowerCase())
    );
  }, [facultySearch]);

  const toggleSector = (s: Sector) => {
    setSelectedSectors((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

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

  const selectedItemsDetails = useMemo(() => {
    return selectedEntries
      .map(([id, qty]) => {
        const detail = ACTION_REGISTRY.find((a) => a.id === id);
        if (!detail) return null;

        let calculatedCo2 = detail.impactValue;
        let calculatedPoints = detail.points;

        if (TRANSPORT_IDS.includes(id)) {
          const dist = Math.min(200, Math.max(1, commuteDistances[id] || 10));
          if (id === "active-transit") {
            calculatedCo2 = Number((dist * 0.25).toFixed(2));
            calculatedPoints = Math.round(20 + dist * 2.2);
          } else if (id === "public-transit") {
            calculatedCo2 = Number((dist * 0.18).toFixed(2));
            calculatedPoints = Math.round(15 + dist * 1.5);
          } else if (id === "ev-rideshare") {
            calculatedCo2 = Number((dist * 0.32).toFixed(2));
            calculatedPoints = Math.round(30 + dist * 2.2);
          } else if (id === "carpool-fossil") {
            calculatedCo2 = Number((dist * 0.15).toFixed(2));
            calculatedPoints = Math.round(15 + dist * 1.2);
          }
        }

        return {
          ...detail,
          title: detail.name,
          co2SavedKg: calculatedCo2,
          points: calculatedPoints,
          selectedQty: qty,
        };
      })
      .filter(Boolean) as (ActionItem & { title: string; co2SavedKg: number; selectedQty: number })[];
  }, [selectedEntries, commuteDistances]);

  const totalPoints = selectedItemsDetails.reduce((acc, item) => acc + item.points * item.selectedQty, 0);
  const totalCO2 = selectedItemsDetails.reduce((acc, item) => acc + item.co2SavedKg * item.selectedQty, 0);

  const filteredActions =
    selectedCategory === "All" ? ACTION_REGISTRY : ACTION_REGISTRY.filter((a) => a.category === selectedCategory);

  const getAffiliationName = (): string => {
    return `Neighborhood: ${neighbourhood} | Faculty: ${faculty}`;
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItemsDetails.length === 0 || selectedSectors.length === 0) return;

    if (!user) {
      router.push(`/login?redirectTo=${encodeURIComponent("/log-action")}`);
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);

    try {
      const finalAffiliationName = getAffiliationName();
      const itemsToSubmit: BatchActionItem[] = selectedItemsDetails.map((item) => {
        const isDistanceBased = TRANSPORT_IDS.includes(item.id);
        const dist = commuteDistances[item.id] || 10;
        return {
          actionId: item.id,
          quantity: item.selectedQty,
          distanceKm: isDistanceBased ? dist : undefined,
          notes: `Neighborhood: ${neighbourhood} | Faculty: ${faculty}${isDistanceBased ? ` | Distance: ${dist} km` : ""}`,
        };
      });

      for (const currentSector of selectedSectors) {
        const finalAffiliationType: AffiliationType = currentSector === "campus" ? "faculty" : publicAffiliationType;
        await logBatchUserActions({
          items: itemsToSubmit,
          sector: currentSector,
          affiliationType: finalAffiliationType,
          affiliationName: finalAffiliationName,
        });
      }

      setStatusMsg({
        type: "success",
        text: `Logged ${itemsToSubmit.length} actions! Credited to ${neighbourhood} & ${faculty}.`,
      });

      setTimeout(() => {
        clearCart();
        setIsReviewOpen(false);
        setStatusMsg(null);
        router.push("/competition");
      }, 1500);
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
        <div className="max-w-7xl mx-auto px-6 py-10 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#39705d] block mb-1">
              Action Ledger · Multi-Select Entry
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">Record Daily Sustainable Actions</h1>
            <p className="text-xs text-[#526760] max-w-xl mt-1">
              Select all actions you completed today. Points are calculated using verified carbon factors and distance metrics.
            </p>
          </div>
          <Link href="/competition" className="text-xs font-mono text-[#39705d] hover:underline" suppressHydrationWarning>
            [← BACK TO COMPETITION]
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <h2 className="text-base font-bold mb-2">{action.name}</h2>
                    <p className="text-xs text-[#526760] leading-relaxed mb-6">{action.description}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-medium">
                      ~{action.impactValue} kg CO₂e / {action.unitLabel}
                    </span>

                    {isSelected ? (
                      <div className="flex items-center gap-2 bg-[#f1f6f2] border border-[#39705d]/30 rounded-full px-2 py-1">
                        <button
                          type="button"
                          onClick={() => setActionQuantity(action.id, currentQty - 1)}
                          className="w-6 h-6 rounded-full bg-white text-[#102f26] font-bold text-xs flex items-center justify-center hover:bg-gray-200 transition"
                        >
                          -
                        </button>
                        <span className="text-xs font-extrabold text-[#102f26] min-w-[18px] text-center">
                          {currentQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActionQuantity(action.id, currentQty + 1)}
                          className="w-6 h-6 rounded-full bg-[#102f26] text-white font-bold text-xs flex items-center justify-center hover:bg-[#39705d] transition"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
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
        </div>

        <div className="lg:col-span-1 sticky top-8 bg-white border border-[#102f26]/15 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#39705d] block mb-1">
              Submission Summary
            </span>
            <h3 className="text-xl font-bold text-[#102f26]">Ledger Impact</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 bg-[#f1f6f2] rounded-xl border border-[#102f26]/10 text-xs font-mono">
            <div>
              <span className="text-[#526760] block mb-0.5">Actions</span>
              <span className="text-lg font-bold text-[#102f26]">{totalSelectedCount}</span>
            </div>
            <div>
              <span className="text-[#526760] block mb-0.5">Est. Impact</span>
              <span className="text-lg font-bold text-[#39705d]">~{totalCO2.toFixed(1)} kg CO₂e</span>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-gray-100 text-xs">
            <div>
              <label className="block font-mono uppercase text-[11px] text-[#526760] mb-1.5">
                Sector Attribution (Select one or both)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => toggleSector("campus")}
                  className={`py-2 px-3 font-bold rounded-xl border transition ${
                    selectedSectors.includes("campus")
                      ? "bg-[#102f26] text-white border-[#102f26]"
                      : "bg-gray-50 text-[#526760] border-gray-200"
                  }`}
                >
                  Campus / UBC
                </button>
                <button
                  type="button"
                  onClick={() => toggleSector("public")}
                  className={`py-2 px-3 font-bold rounded-xl border transition ${
                    selectedSectors.includes("public")
                      ? "bg-[#102f26] text-white border-[#102f26]"
                      : "bg-gray-50 text-[#526760] border-gray-200"
                  }`}
                >
                  Local Public
                </button>
              </div>
            </div>

            {/* Faculty Search Dropdown */}
            <div>
              <label className="block font-mono uppercase text-[11px] text-[#526760] mb-1.5">
                Faculty / School (UBC Vancouver)
              </label>
              <input
                type="text"
                placeholder="Type to filter faculties..."
                value={facultySearch}
                onChange={(e) => {
                  setFacultySearch(e.target.value);
                  setIsFacultyDropdownOpen(true);
                }}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-white font-medium mb-1"
              />
              <div className="text-[10px] text-gray-500 mb-1">Selected: <span className="font-bold text-[#102f26]">{faculty}</span></div>
              
              {isFacultyDropdownOpen && (
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl bg-white shadow-sm space-y-0.5 p-1">
                  {filteredFaculties.length > 0 ? (
                    filteredFaculties.map((f) => (
                      <button
                        type="button"
                        key={f}
                        onClick={() => {
                          setFaculty(f);
                          setFacultySearch("");
                          setIsFacultyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition ${
                          faculty === f ? "font-bold bg-emerald-50 text-emerald-900" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {f}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-gray-400">No matching faculty found</div>
                  )}
                </div>
              )}
            </div>

            {/* Neighborhood Search Dropdown */}
            <div>
              <label className="block font-mono uppercase text-[11px] text-[#526760] mb-1.5">
                Vancouver Neighborhood / Municipality
              </label>
              <input
                type="text"
                placeholder="Type to filter neighborhoods..."
                value={neighbourhoodSearch}
                onChange={(e) => {
                  setNeighbourhoodSearch(e.target.value);
                  setIsNeighborhoodDropdownOpen(true);
                }}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-white font-medium mb-1"
              />
              <div className="text-[10px] text-gray-500 mb-1">Selected: <span className="font-bold text-[#102f26]">{neighbourhood}</span></div>

              {isNeighborhoodDropdownOpen && (
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl bg-white shadow-sm space-y-0.5 p-1">
                  {filteredNeighborhoods.length > 0 ? (
                    filteredNeighborhoods.map((n) => (
                      <button
                        type="button"
                        key={n}
                        onClick={() => {
                          setNeighbourhood(n);
                          setNeighbourhoodSearch("");
                          setIsNeighborhoodDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition ${
                          neighbourhood === n ? "font-bold bg-emerald-50 text-emerald-900" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {n}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-gray-400">No matching neighborhood found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsReviewOpen(true)}
            disabled={totalSelectedCount === 0 || selectedSectors.length === 0}
            className="w-full py-3.5 bg-[#102f26] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#39705d] transition shadow disabled:opacity-40"
          >
            Review &amp; Log Actions (+{totalPoints} pts) →
          </button>
        </div>
      </section>

      {/* Review Modal */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 bg-[#102f26]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#102f26]/20 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex justify-between items-center border-b border-[#102f26]/10 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#39705d]">Batch Review</span>
                <h3 className="text-lg font-bold">Log {selectedItemsDetails.length} Selected Actions</h3>
              </div>
              <button
                type="button"
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
                  Selected Actions &amp; Scaling:
                </label>
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {selectedItemsDetails.map((item) => {
                    const isTransport = TRANSPORT_IDS.includes(item.id);

                    return (
                      <div
                        key={`review-${item.id}`}
                        className="p-3 bg-[#f1f6f2] rounded-xl text-xs border border-gray-200/60 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-[#102f26]">{item.name}</div>
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

                        {isTransport && (
                          <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                            <span className="text-[11px] text-gray-600 font-medium">
                              {item.id === "active-transit"
                                ? "Cycling/Walking Distance (km):"
                                : item.id === "public-transit"
                                ? "Transit Distance (km):"
                                : item.id === "ev-rideshare"
                                ? "EV Rideshare Distance (km):"
                                : "Carpool Distance (km):"}
                            </span>
                            <input
                              type="number"
                              min="1"
                              max="200"
                              value={commuteDistances[item.id] || 10}
                              onChange={(e) =>
                                setCommuteDistances({
                                  ...commuteDistances,
                                  [item.id]: Math.min(200, Math.max(1, Number(e.target.value))),
                                })
                              }
                              className="w-20 p-1 text-center font-bold text-xs rounded-lg border border-gray-300 bg-white"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
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

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(false)}
                  className="w-1/2 py-2.5 border border-gray-300 rounded-full text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting || selectedItemsDetails.length === 0}
                  className="w-1/2 py-2.5 bg-[#102f26] text-white rounded-full text-xs font-semibold hover:bg-[#39705d] transition disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Confirm & Log All"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
