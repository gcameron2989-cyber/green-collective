"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logBatchUserActions, AffiliationType } from '@/actions/user-actions';

type CommunityTrack = 'public' | 'campus';
type PublicAffiliationType = 'neighbourhood' | 'association' | 'company' | 'other';

interface ActionOption {
  id: string;
  title: string;
  category: string;
  points: number;
  co2SavedKg: number;
  unitLabel: string;
  description: string;
}

const ACTION_CATALOG: ActionOption[] = [
  {
    id: 'transit-commute',
    title: 'Transit or Active Bike Commute',
    category: 'Sustainable Mobility',
    points: 25,
    co2SavedKg: 2.1,
    unitLabel: 'trips',
    description: 'Replaced single-occupancy vehicle driving with transit, cycling, or walking.',
  },
  {
    id: 'reusable-container',
    title: 'Zero Single-Use Container',
    category: 'Circular Economy',
    points: 30,
    co2SavedKg: 0.5,
    unitLabel: 'containers',
    description: 'Used a reusable cup, mug, or food container at local businesses or dining halls.',
  },
  {
    id: 'tree-care',
    title: 'Urban Tree & Ecosystem Stewardship',
    category: 'Ecosystem Stewardship',
    points: 50,
    co2SavedKg: 3.5,
    unitLabel: 'sessions',
    description: 'Participated in canopy care, invasive species removal, or community garden maintenance.',
  },
  {
    id: 'plant-based-meal',
    title: 'Plant-Based Meal Choice',
    category: 'Food & Agriculture',
    points: 20,
    co2SavedKg: 1.4,
    unitLabel: 'meals',
    description: 'Chose a fully plant-based meal over animal-intensive protein options.',
  },
  {
    id: 'food-waste-compost',
    title: 'Organic Waste Diversion & Composting',
    category: 'Food & Agriculture',
    points: 15,
    co2SavedKg: 0.4,
    unitLabel: 'days',
    description: 'Diverted 100% of household food scraps to municipal green bins or home compost.',
  },
  {
    id: 'cold-water-laundry',
    title: 'Cold Water Wash & Line Dry',
    category: 'Energy & Water',
    points: 15,
    co2SavedKg: 0.9,
    unitLabel: 'loads',
    description: 'Washed laundry in cold water and air-dried garments instead of using a heated dryer.',
  },
  {
    id: 'energy-conservation',
    title: 'Home & Office Energy Reduction',
    category: 'Energy & Water',
    points: 20,
    co2SavedKg: 1.2,
    unitLabel: 'days',
    description: 'Lowered thermostat, eliminated phantom power loads, or installed high-efficiency LEDs.',
  },
  {
    id: 'repair-upcycle',
    title: 'Repair, Upcycle, or Thrift Goods',
    category: 'Circular Economy',
    points: 40,
    co2SavedKg: 2.5,
    unitLabel: 'items',
    description: 'Repaired clothing, electronics, or furniture instead of purchasing new items.',
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
];

const UBC_FACULTIES = [
  'Faculty of Forestry',
  'Faculty of Science',
  'Faculty of Applied Science / Engineering',
  'Sauder School of Business',
  'Faculty of Arts',
  'Faculty of Land and Food Systems',
];

export default function LogActionPage() {
  const router = useRouter();
  const [track, setTrack] = useState<CommunityTrack>('campus');
  
  // Public sub-affiliation state
  const [affiliationType, setAffiliationType] = useState<PublicAffiliationType>('neighbourhood');
  const [neighbourhood, setNeighbourhood] = useState(VANCOUVER_NEIGHBOURHOODS[0]);
  const [customEntityName, setCustomEntityName] = useState('');

  // Campus sub-affiliation state
  const [faculty, setFaculty] = useState(UBC_FACULTIES[0]);

  // Action logging state
  const [selectedActionId, setSelectedActionId] = useState(ACTION_CATALOG[0].id);
  const [quantity, setQuantity] = useState(1);
  const [distanceKm, setDistanceKm] = useState(5);
  const [notes, setNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentAction = ACTION_CATALOG.find((a) => a.id === selectedActionId) || ACTION_CATALOG[0];

  // Dynamic calculation for commute distance vs static items
  let calculatedPoints = currentAction.points * quantity;
  let calculatedCO2 = currentAction.co2SavedKg * quantity;

  if (selectedActionId === 'transit-commute') {
    calculatedPoints = Math.round((15 + distanceKm * 1.8) * quantity);
    calculatedCO2 = Number((distanceKm * 0.22 * quantity).toFixed(2));
  }

  const getResolvedAffiliationName = () => {
    const primary = track === 'campus' ? faculty : neighbourhood;
    return `${primary} [Neighborhood: ${neighbourhood} | Faculty: ${faculty}]`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const finalAffiliationType: AffiliationType = track === 'campus' ? 'faculty' : affiliationType;
      const affiliationName = getResolvedAffiliationName();

      await logBatchUserActions({
        items: [
          {
            actionId: currentAction.id,
            actionTitle: currentAction.title,
            points: calculatedPoints,
            quantity: quantity,
            distanceKm: selectedActionId === 'transit-commute' ? distanceKm : undefined,
            notes: `${notes} | Neighborhood: ${neighbourhood} | Faculty: ${faculty}`,
          },
        ],
        sector: track,
        affiliationType: finalAffiliationType,
        affiliationName: affiliationName,
      });

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit action.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f8f6] text-[#102f26] pb-24 font-sans">
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-4xl px-6 py-12 md:px-10 lg:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d] mb-2">
            Green Collective · Ledger Submission
          </p>
          <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl text-[#102f26]">
            Log Environmental Action
          </h1>
          <p className="mt-2 text-sm text-[#526760]">
            Record verified sustainability actions with precise commute metrics and dual community-faculty attribution.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10 md:px-10 lg:px-12">
        {isSubmitted ? (
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
                <span className="font-medium text-[#102f26] text-sm">{getResolvedAffiliationName()}</span>
              </div>
              <div>
                <span className="text-[#71847d] uppercase tracking-wider block mb-1">Impact Credited</span>
                <span className="font-medium text-[#102f26] text-sm">+{calculatedPoints} pts</span>
              </div>
              <div>
                <span className="text-[#71847d] uppercase tracking-wider block mb-1">Estimated Offset</span>
                <span className="font-medium text-[#102f26] text-sm">{calculatedCO2} kg CO₂e</span>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => { setIsSubmitted(false); setNotes(''); }}
                className="px-5 py-2.5 bg-[#102f26] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#39705d] transition"
              >
                Log Another Action
              </button>
              <Link
                href={`[competition](https://www.greencollective.ca/)`}
                className="px-5 py-2.5 bg-white border border-[#102f26]/20 text-[#102f26] font-mono text-xs uppercase tracking-wider hover:bg-[#f1f6f2] transition"
              >
                View Leaderboard →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 border border-[#102f26]/15 shadow-sm">
            {errorMsg && <div className="p-3 bg-red-50 text-red-700 text-xs font-mono">{errorMsg}</div>}

            {/* STEP 1: Track Selection */}
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#39705d] block mb-3">
                1. Select Primary Sector / Context
              </label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setTrack('campus')}
                  className={`p-4 text-left border transition ${track === 'campus' ? 'border-[#102f26] bg-[#f1f6f2] ring-1 ring-[#102f26]' : 'border-gray-200 bg-white'}`}
                >
                  <span className="font-mono text-xs font-bold block text-[#102f26]">Campus / UBC</span>
                  <span className="text-xs text-[#526760] mt-1 block">UBC students &amp; faculty units.</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTrack('public')}
                  className={`p-4 text-left border transition ${track === 'public' ? 'border-[#102f26] bg-[#f1f6f2] ring-1 ring-[#102f26]' : 'border-gray-200 bg-white'}`}
                >
                  <span className="font-mono text-xs font-bold block text-[#102f26]">General Public</span>
                  <span className="text-xs text-[#526760] mt-1 block">Vancouver neighborhood hubs.</span>
                </button>
              </div>

              {/* Dual Attribution Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#f1f6f2] border border-[#102f26]/10 rounded-xl">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#102f26] mb-1">Vancouver Neighborhood:</label>
                  <select
                    value={neighbourhood}
                    onChange={(e) => setNeighbourhood(e.target.value)}
                    className="w-full p-2.5 text-xs border border-gray-300 bg-white font-medium"
                  >
                    {VANCOUVER_NEIGHBOURHOODS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#102f26] mb-1">UBC Faculty Unit:</label>
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full p-2.5 text-xs border border-gray-300 bg-white font-medium"
                  >
                    {UBC_FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* STEP 2: Action Selection */}
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#39705d] block mb-3">
                2. Select Verified Action
              </label>

              <div className="space-y-3 mb-6">
                {ACTION_CATALOG.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start justify-between p-4 border cursor-pointer transition ${
                      selectedActionId === item.id ? 'border-[#102f26] bg-[#f1f6f2]' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="actionSelect"
                        value={item.id}
                        checked={selectedActionId === item.id}
                        onChange={() => setSelectedActionId(item.id)}
                        className="mt-1 text-[#102f26]"
                      />
                      <div>
                        <span className="font-medium text-sm text-[#102f26] block">{item.title}</span>
                        <span className="text-xs text-[#526760]">{item.description}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#102f26] bg-white border border-gray-200 px-2 py-1 shrink-0">
                      +{item.points} pts
                    </span>
                  </label>
                ))}
              </div>

              {selectedActionId === 'transit-commute' && (
                <div className="p-4 bg-gray-50 border border-gray-200 space-y-3 mb-4">
                  <label className="block text-xs font-mono uppercase">Commute Distance (km):</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="w-full p-2 text-xs border border-gray-300 bg-white"
                  />
                  <div className="text-[11px] text-emerald-700 font-mono">
                    Dynamic calculation: ~{calculatedCO2} kg CO₂e offset for {distanceKm} km.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#102f26] mb-1">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2.5 text-xs border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#102f26] mb-1">Notes (Optional):</label>
                  <input
                    type="text"
                    placeholder="e.g. 99 B-Line or reusable mug"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 text-xs border border-gray-300 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#102f26]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-mono text-xs">
                <span className="text-[#71847d] uppercase tracking-wider block">Total Impact:</span>
                <span className="font-bold text-[#102f26] text-sm">+{calculatedPoints} pts · {calculatedCO2} kg CO₂e</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3 bg-[#102f26] text-white font-mono text-xs uppercase tracking-widest hover:bg-[#39705d] transition shadow-sm"
              >
                {submitting ? 'Submitting...' : 'Submit Action to Ledger →'}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
