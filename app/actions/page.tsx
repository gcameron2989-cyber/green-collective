"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logUserAction } from "@/actions/user-actions";

type SectorTrack = "public" | "campus";
type PublicAffiliationType = "neighbourhood" | "association" | "company" | "other";

interface ActionItem {
  id: string;
  title: string;
  category: string;
  points: number;
  co2SavedKg: number;
  unitLabel: string;
  description: string;
}

const ACTIONS_CATALOG: ActionItem[] = [
  {
    id: "transit-commute",
    title: "Transit or Active Bike Commute",
    category: "Sustainable Mobility",
    points: 25,
    co2SavedKg: 2.4,
    unitLabel: "trips",
    description: "Replaced single-occupancy vehicle commute with 99 B-Line, SkyTrain, or active cycling.",
  },
  {
    id: "reusable-container",
    title: "Zero Single-Use Container",
    category: "Circular Economy",
    points: 30,
    co2SavedKg: 0.8,
    unitLabel: "containers",
    description: "Used reusable container or mug at participating food vendor or merchant.",
  },
  {
    id: "stewardship-audit",
    title: "Urban Tree & Ecosystem Care",
    category: "Ecosystem Stewardship",
    points: 50,
    co2SavedKg: 5.0,
    unitLabel: "sessions",
    description: "Participated in canopy monitoring, invasive weeding, or local plot care.",
  },
];

const VANCOUVER_NEIGHBOURHOODS = [
  "Kitsilano",
  "Point Grey / West Point Grey",
  "Mount Pleasant",
  "Fairview / South Granville",
  "Downtown / West End",
  "Commercial Drive / Grandview-Woodland",
  "Dunbar-Southlands",
  "Kerrisdale",
];

export default function ActionsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form selections
  const [sectorTrack, setSectorTrack] = useState<SectorTrack>("public");
  const [affiliationType, setAffiliationType] = useState<PublicAffiliationType>("neighbourhood");
  const [neighbourhood, setNeighbourhood] = useState(VANCOUVER_NEIGHBOURHOODS[0]);
  const [customEntity, setCustomEntity] = useState("");
  const [faculty, setFaculty] = useState("Faculty of Forestry");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  // Check auth state & restore pending actions from localStorage
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const pendingData = localStorage.getItem("pending_log_action");
    if (pendingData) {
      try {
        const parsed = JSON.parse(pendingData);
        const matched = ACTIONS_CATALOG.find((a) => a.id === parsed.actionId);
        if (matched) {
          setSelectedAction(matched);
          if (parsed.sectorTrack) setSectorTrack(parsed.sectorTrack);
          if (parsed.affiliationType) setAffiliationType(parsed.affiliationType);
          if (parsed.neighbourhood) setNeighbourhood(parsed.neighbourhood);
          if (parsed.customEntity) setCustomEntity(parsed.customEntity);
          if (parsed.faculty) setFaculty(parsed.faculty);
          if (parsed.quantity) setQuantity(parsed.quantity);
        }
      } catch (err) {
        console.error("Error restoring pending action:", err);
      }
      localStorage.removeItem("pending_log_action");
    }
  }, []);

  const getAffiliationName = () => {
    if (sectorTrack === "campus") return faculty;
    if (affiliationType === "neighbourhood") return neighbourhood;
    return customEntity.trim() || "Unspecified Group";
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;

    // If signed out, save pending state and route to login with return target
    if (!user) {
      const pendingPayload = {
        actionId: selectedAction.id,
        sectorTrack,
        affiliationType,
        neighbourhood,
        customEntity,
        faculty,
        quantity,
      };
      localStorage.setItem("pending_log_action", JSON.stringify(pendingPayload));
      router.push(`/login?redirectTo=${encodeURIComponent("/actions")}`);
      return;
    }

    setSubmitting(true);
    try {
      await logUserAction({
        actionId: selectedAction.id,
        sector: sectorTrack,
        affiliationType: sectorTrack === "campus" ? "faculty" : affiliationType,
        affiliationName: getAffiliationName(),
        quantity,
        notes,
      });

      alert(`Action logged! Credited to ${getAffiliationName()}`);
      setSelectedAction(null);
    } catch (err: any) {
      alert(err.message || "Failed to log action.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-24 font-sans">
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d] mb-2">
            Green Collective · Action Directory
          </p>
          <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-5xl text-[#102f26]">
            Verified Impact Actions
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#526760]">
            Log verified sustainable actions, assign impact credit to your local neighbourhood, workplace, or campus faculty, and track collective decarbonization.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ACTIONS_CATALOG.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-white border border-[#102f26]/15 flex flex-col justify-between shadow-sm hover:border-[#102f26]/40 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#39705d] bg-[#f1f6f2] px-2 py-0.5">
                    {item.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#102f26]">
                    +{item.points} pts
                  </span>
                </div>
                <h3 className="text-lg font-medium text-[#102f26] mb-2">{item.title}</h3>
                <p className="text-xs text-[#526760] leading-relaxed mb-6">{item.description}</p>
              </div>

              <button
                onClick={() => setSelectedAction(item)}
                className="w-full py-2.5 bg-[#102f26] text-white font-mono text-[11px] uppercase tracking-wider hover:bg-[#39705d] transition"
              >
                Log Action +
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Drawer */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 bg-[#102f26]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#102f26]/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#102f26]/10 pb-4 mb-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#39705d]">
                  Logging Action
                </span>
                <h2 className="text-xl font-medium text-[#102f26]">{selectedAction.title}</h2>
              </div>
              <button
                onClick={() => setSelectedAction(null)}
                className="text-lg font-mono text-[#526760] hover:text-[#102f26]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSubmit} className="space-y-6">
              {/* Sector Selection */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#39705d] block mb-2">
                  1. Select Sector / Context
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSectorTrack("public")}
                    className={`p-3 text-left border text-xs font-mono transition ${
                      sectorTrack === "public"
                        ? "border-[#102f26] bg-[#f1f6f2] font-bold"
                        : "border-[#102f26]/15 bg-white text-[#526760]"
                    }`}
                  >
                    General Public / Community
                  </button>
                  <button
                    type="button"
                    onClick={() => setSectorTrack("campus")}
                    className={`p-3 text-left border text-xs font-mono transition ${
                      sectorTrack === "campus"
                        ? "border-[#102f26] bg-[#f1f6f2] font-bold"
                        : "border-[#102f26]/15 bg-white text-[#526760]"
                    }`}
                  >
                    Campus / University
                  </button>
                </div>
              </div>

              {/* Affiliation Selection */}
              {sectorTrack === "public" ? (
                <div className="p-4 bg-[#f1f6f2] border border-[#102f26]/10 space-y-3">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#39705d] block">
                    2. Choose Neighbourhood, Association, or Company
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {(["neighbourhood", "association", "company", "other"] as PublicAffiliationType[]).map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAffiliationType(type)}
                          className={`px-3 py-1 font-mono text-[10px] uppercase border transition ${
                            affiliationType === type
                              ? "bg-[#102f26] text-white border-[#102f26]"
                              : "bg-white text-[#102f26] border-[#102f26]/20"
                          }`}
                        >
                          {type}
                        </button>
                      )
                    )}
                  </div>

                  {affiliationType === "neighbourhood" ? (
                    <div>
                      <label className="block text-[11px] font-mono text-[#526760] mb-1">
                        Select Neighbourhood Zone:
                      </label>
                      <select
                        value={neighbourhood}
                        onChange={(e) => setNeighbourhood(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#102f26]/20 bg-white text-[#102f26]"
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
                      <label className="block text-[11px] font-mono text-[#526760] mb-1">
                        Enter Name of {affiliationType.toUpperCase()}:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Kitsilano Resident Collective, Business Name"
                        value={customEntity}
                        onChange={(e) => setCustomEntity(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#102f26]/20 bg-white text-[#102f26]"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-[#f1f6f2] border border-[#102f26]/10">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#39705d] block mb-2">
                    2. Select Faculty / Unit
                  </label>
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#102f26]/20 bg-white text-[#102f26]"
                  >
                    <option value="Faculty of Forestry">Faculty of Forestry</option>
                    <option value="Faculty of Science">Faculty of Science</option>
                    <option value="Faculty of Applied Science">Faculty of Applied Science</option>
                    <option value="Sauder School of Business">Sauder School of Business</option>
                  </select>
                </div>
              )}

              {/* Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#102f26] mb-1">
                    Quantity ({selectedAction.unitLabel}):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs border border-[#102f26]/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#102f26] mb-1">
                    Calculated Impact:
                  </label>
                  <div className="px-3 py-2 bg-[#f1f6f2] text-xs font-mono text-[#102f26]">
                    +{selectedAction.points * quantity} pts (
                    {(selectedAction.co2SavedKg * quantity).toFixed(1)} kg CO₂)
                  </div>
                </div>
              </div>

              {!user && (
                <p className="text-[11px] font-mono text-[#39705d] bg-[#f1f6f2] p-2.5 border border-[#102f26]/10">
                  ℹ You are currently signed out. Clicking confirm will save your action details and prompt you to sign in, then automatically return you here.
                </p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-[#102f26]/10">
                <button
                  type="button"
                  onClick={() => setSelectedAction(null)}
                  className="px-4 py-2 border border-[#102f26]/20 text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#102f26] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#39705d] disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : user
                    ? "Confirm & Log Action"
                    : "Sign In to Log Action →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
