"use client";

import { useState } from 'react';
import Link from 'next/link';

type CommunityTrack = 'public' | 'campus';
type PublicAffiliationType = 'neighbourhood' | 'association' | 'company' | 'other';

interface ActionOption {
  id: string;
  title: string;
  category: string;
  points: number;
  co2SavedKg: number;
  unitLabel: string;
}

const ACTION_CATALOG: ActionOption[] = [
  {
    id: 'transit-commute',
    title: 'Transit or Active Bike Commute (99 B-Line / SkyTrain / Cycling)',
    category: 'Sustainable Mobility',
    points: 25,
    co2SavedKg: 2.4,
    unitLabel: 'trips',
  },
  {
    id: 'reusable-container',
    title: 'Zero Single-Use Dining & Merchant Container',
    category: 'Circular Economy',
    points: 30,
    co2SavedKg: 0.8,
    unitLabel: 'containers',
  },
  {
    id: 'stewardship-audit',
    title: 'Community Tree Care & Urban Ecosystem Stewardship',
    category: 'Ecosystem Stewardship',
    points: 50,
    co2SavedKg: 5.0,
    unitLabel: 'sessions',
  },
  {
    id: 'waste-diversion',
    title: 'Residential Organic Composting & Food Waste Diversion',
    category: 'Zero Waste',
    points: 20,
    co2SavedKg: 1.2,
    unitLabel: 'days',
  },
];

const VANCOUVER_NEIGHBOURHOODS = [
  'Kitsilano',
  'Point Grey / West Point Grey',
  'Mount Pleasant',
  'Fairview / South Granville',
  'Downtown / West End',
  'Commercial Drive / Grandview-Woodland',
  'Dunbar-Southlands',
  'Kerrisdale',
  'Yaletown / Coal Harbour',
  'Strathcona / Chinatown',
];

export default function LogActionPage() {
  const [track, setTrack] = useState<CommunityTrack>('public');
  
  // Public sub-affiliation state
  const [affiliationType, setAffiliationType] = useState<PublicAffiliationType>('neighbourhood');
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState(VANCOUVER_NEIGHBOURHOODS[0]);
  const [customEntityName, setCustomEntityName] = useState('');

  // Campus sub-affiliation state
  const [campusFaculty, setCampusFaculty] = useState('Faculty of Forestry');

  // Action logging state
  const [selectedActionId, setSelectedActionId] = useState(ACTION_CATALOG[0].id);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentAction = ACTION_CATALOG.find((a) => a.id === selectedActionId) || ACTION_CATALOG[0];
  const totalPoints = currentAction.points * quantity;
  const totalCO2 = (currentAction.co2SavedKg * quantity).toFixed(1);

  const getResolvedAffiliationLabel = () => {
    if (track === 'campus') {
      return `UBC · ${campusFaculty}`;
    }
    if (affiliationType === 'neighbourhood') {
      return `Vancouver · ${selectedNeighbourhood}`;
    }
    return customEntityName.trim() || `${affiliationType.toUpperCase()} (Unspecified)`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setNotes('');
    setQuantity(1);
  };

  return (
    <main className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-24 font-sans">
      {/* Page Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-4xl px-6 py-12 md:px-10 lg:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d] mb-2">
            Green Collective · Ledger Submission
          </p>
          <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl text-[#102f26]">
            Log Environmental Action
          </h1>
          <p className="mt-2 text-sm text-[#526760]">
            Record verified sustainability actions, attribute impact to your local neighbourhood or association, and contribute to the community ledger.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10 md:px-10 lg:px-12">
        {isSubmitted ? (
          /* Confirmation State */
          <div className="p-8 border border-[#102f26]/20 bg-white shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#102f26] text-white font-mono text-xs">✓</span>
              <div>
                <h2 className="text-xl font-medium text-[#102f26]">Action Logged to Ledger</h2>
                <p className="font-mono text-xs text-[#39705d]">Verification ID: GC-{Math.floor(100000 + Math.random() * 900000)}</p>
              </div>
            </div>

            <div className="p-6 bg-[#f1f6f2] border border-[#102f26]/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#71847d] uppercase tracking-wider block mb-1">Attributed Entity</span>
                <span className="font-medium text-[#102f26] text-sm">{getResolvedAffiliationLabel()}</span>
              </div>
              <div>
                <span className="text-[#71847d] uppercase tracking-wider block mb-1">Impact Credited</span>
                <span className="font-medium text-[#102f26] text-sm">+{totalPoints} pts</span>
              </div>
              <div>
                <span className="text-[#71847d] uppercase tracking-wider block mb-1">Estimated Offset</span>
                <span className="font-medium text-[#102f26] text-sm">{totalCO2} kg CO₂e</span>
              </div>
            </div>

            <p className="text-xs text-[#526760]">
              Logged action: <strong className="text-[#102f26]">{currentAction.title}</strong> ({quantity} {currentAction.unitLabel}).
            </p>

            <div className="flex gap-4 pt-2">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-[#102f26] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#39705d] transition"
              >
                Log Another Action
              </button>
              <Link
                href="/actions"
                className="px-5 py-2.5 bg-white border border-[#102f26]/20 text-[#102f26] font-mono text-xs uppercase tracking-wider hover:bg-[#f1f6f2] transition"
              >
                Return to Directory
              </Link>
            </div>
          </div>
        ) : (
          /* Main Logging Form */
          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 border border-[#102f26]/15 shadow-sm">
            {/* STEP 1: Community Track Selection */}
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#39705d] block mb-3">
                1. Select Primary Sector / Context
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTrack('public')}
                  className={`p-4 text-left border transition ${
                    track === 'public'
                      ? 'border-[#102f26] bg-[#f1f6f2] ring-1 ring-[#102f26]'
                      : 'border-[#102f26]/15 bg-white hover:border-[#102f26]/30'
                  }`}
                >
                  <span className="font-mono text-xs font-bold block text-[#102f26] uppercase tracking-wider">
                    General Public / Community
                  </span>
                  <span className="text-xs text-[#526760] mt-1 block">
                    Residents, neighborhood groups, local businesses &amp; general public.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTrack('campus')}
                  className={`p-4 text-left border transition ${
                    track === 'campus'
                      ? 'border-[#102f26] bg-[#f1f6f2] ring-1 ring-[#102f26]'
                      : 'border-[#102f26]/15 bg-white hover:border-[#102f26]/30'
                  }`}
                >
                  <span className="font-mono text-xs font-bold block text-[#102f26] uppercase tracking-wider">
                    Campus / University
                  </span>
                  <span className="text-xs text-[#526760] mt-1 block">
                    UBC students, faculty, staff, and residence clubs.
                  </span>
                </button>
              </div>
            </div>

            {/* STEP 2: Affiliation / Routing Prompt (Dynamic) */}
            {track === 'public' ? (
              <div className="p-6 border border-[#102f26]/15 bg-[#f1f6f2] space-y-4">
                <div>
                  <label className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#39705d] block mb-2">
                    2. Local Affiliation &amp; Routing
                  </label>
                  <p className="text-xs text-[#526760] mb-3">
                    Specify where this action took place so points credit your local district or organization:
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setAffiliationType('neighbourhood')}
                      className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border transition ${
                        affiliationType === 'neighbourhood'
                          ? 'bg-[#102f26] text-white border-[#102f26]'
                          : 'bg-white text-[#102f26] border-[#102f26]/20'
                      }`}
                    >
                      Neighbourhood / Zone
                    </button>
                    <button
                      type="button"
                      onClick={() => setAffiliationType('association')}
                      className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border transition ${
                        affiliationType === 'association'
                          ? 'bg-[#102f26] text-white border-[#102f26]'
                          : 'bg-white text-[#102f26] border-[#102f26]/20'
                      }`}
                    >
                      Community Association
                    </button>
                    <button
                      type="button"
                      onClick={() => setAffiliationType('company')}
                      className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border transition ${
                        affiliationType === 'company'
                          ? 'bg-[#102f26] text-white border-[#102f26]'
                          : 'bg-white text-[#102f26] border-[#102f26]/20'
                      }`}
                    >
                      Company / Workplace
                    </button>
                    <button
                      type="button"
                      onClick={() => setAffiliationType('other')}
                      className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border transition ${
                        affiliationType === 'other'
                          ? 'bg-[#102f26] text-white border-[#102f26]'
                          : 'bg-white text-[#102f26] border-[#102f26]/20'
                      }`}
                    >
                      Other Entity
                    </button>
                  </div>
                </div>

                {/* Sub-inputs based on selection */}
                {affiliationType === 'neighbourhood' && (
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#102f26] mb-1">
                      Select Neighbourhood Zone:
                    </label>
                    <select
                      value={selectedNeighbourhood}
                      onChange={(e) => setSelectedNeighbourhood(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#102f26]/20 bg-white text-[#102f26] focus:outline-none focus:border-[#102f26]"
                    >
                      {VANCOUVER_NEIGHBOURHOODS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(affiliationType === 'association' || affiliationType === 'company' || affiliationType === 'other') && (
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#102f26] mb-1">
                      Enter Name of {affiliationType.charAt(0).toUpperCase() + affiliationType.slice(1)}:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        affiliationType === 'association'
                          ? 'e.g., Kitsilano Resident Collective, West 4th Merchants'
                          : affiliationType === 'company'
                          ? 'e.g., Bureau Veritas, Patagonia Vancouver'
                          : 'Enter organization or group name'
                      }
                      value={customEntityName}
                      onChange={(e) => setCustomEntityName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#102f26]/20 bg-white text-[#102f26] placeholder-[#526760]/60 focus:outline-none focus:border-[#102f26]"
                    />
                  </div>
                )}
              </div>
            ) : (
              /* Campus Faculty Selection */
              <div className="p-6 border border-[#102f26]/15 bg-[#f1f6f2]">
                <label className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#39705d] block mb-2">
                  2. Select Faculty / Campus Unit
                </label>
                <select
                  value={campusFaculty}
                  onChange={(e) => setCampusFaculty(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#102f26]/20 bg-white text-[#102f26] focus:outline-none focus:border-[#102f26]"
                >
                  <option value="Faculty of Forestry">Faculty of Forestry</option>
                  <option value="Faculty of Science">Faculty of Science</option>
                  <option value="Faculty of Applied Science">Faculty of Applied Science / Engineering</option>
                  <option value="Sauder School of Business">Sauder School of Business</option>
                  <option value="Faculty of Arts">Faculty of Arts</option>
                  <option value="Campus & Community Planning">Campus &amp; Community Planning Staff</option>
                </select>
              </div>
            )}

            {/* STEP 3: Action Selection & Metric */}
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#39705d] block mb-3">
                3. Select Verified Action
              </label>

              <div className="space-y-3 mb-6">
                {ACTION_CATALOG.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start justify-between p-4 border cursor-pointer transition ${
                      selectedActionId === item.id
                        ? 'border-[#102f26] bg-[#f1f6f2]'
                        : 'border-[#102f26]/15 bg-white hover:border-[#102f26]/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="actionSelect"
                        value={item.id}
                        checked={selectedActionId === item.id}
                        onChange={() => setSelectedActionId(item.id)}
                        className="mt-1 text-[#102f26] focus:ring-[#102f26]"
                      />
                      <div>
                        <span className="font-medium text-sm text-[#102f26] block">{item.title}</span>
                        <span className="font-mono text-[10px] text-[#39705d]">{item.category}</span>
                      </div>
                    </div>

                    <span className="font-mono text-xs font-bold text-[#102f26] bg-white border border-[#102f26]/15 px-2 py-1 shrink-0">
                      +{item.points} pts / {item.unitLabel}
                    </span>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#102f26] mb-1">
                    Quantity ({currentAction.unitLabel}):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-xs border border-[#102f26]/20 bg-white text-[#102f26] focus:outline-none focus:border-[#102f26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#102f26] mb-1">
                    Notes / Verification Context (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 99 B-Line from Kits to UBC, or glass container at merchant"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#102f26]/20 bg-white text-[#102f26] placeholder-[#526760]/60 focus:outline-none focus:border-[#102f26]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button & Impact Summary */}
            <div className="pt-6 border-t border-[#102f26]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-mono text-xs">
                <span className="text-[#71847d] uppercase tracking-wider block">Routing Impact To:</span>
                <span className="font-bold text-[#102f26] text-sm">{getResolvedAffiliationLabel()}</span>
                <span className="text-[#39705d] ml-2">({totalPoints} pts · {totalCO2} kg CO₂e)</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-[#102f26] text-white font-mono text-xs uppercase tracking-widest hover:bg-[#39705d] transition shadow-sm"
              >
                Submit Action to Ledger →
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
