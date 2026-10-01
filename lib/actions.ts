export interface ActionItem {
  id: string;
  category: 'TRANSPORT' | 'FOOD' | 'ENERGY' | 'WASTE' | 'CIRCULARITY' | 'CONSUMPTION' | 'COMMUNITY';
  name: string;
  description: string;
  impactValue: number; // e.g. 2.4 kg CO2e
  unitLabel: string; // e.g. "trip", "meal", "load", "day", "item"
  points: number;
  calculationNote?: string;
}

export const ACTION_REGISTRY: ActionItem[] = [
  {
    id: 'active-transit',
    category: 'TRANSPORT',
    name: 'Active Transit (Cycling / Walking)',
    description: 'Completely eliminate vehicle emissions by commuting under human power.',
    impactValue: 2.4,
    unitLabel: 'trip',
    points: 30,
    calculationNote: 'Based on displacing direct fossil fuel vehicle emissions.',
  },
  {
    id: 'public-transit',
    category: 'TRANSPORT',
    name: 'Public Transit (Bus / SkyTrain)',
    description: 'Share efficient high-capacity transit instead of driving a single-occupancy vehicle.',
    impactValue: 2.04,
    unitLabel: 'trip',
    points: 25,
    calculationNote: 'Calculated using regional bus and SkyTrain grid emission averages.',
  },
  {
    id: 'carpool-trip',
    category: 'TRANSPORT',
    name: 'Carpooling / EV Ride',
    description: 'Shared a vehicle trip with passengers or traveled via electric vehicle.',
    impactValue: 1.8,
    unitLabel: 'trip',
    points: 20,
  },
  {
    id: 'plant-based-meal',
    category: 'FOOD',
    name: 'Plant-Forward Meal',
    description: 'Opt for whole plant ingredients over high-emission livestock alternatives.',
    impactValue: 1.5,
    unitLabel: 'meal',
    points: 20,
    calculationNote: 'Replaces ruminant meat baseline carbon footprint.',
  },
  {
    id: 'local-produce',
    category: 'FOOD',
    name: 'Locally Sourced / Seasonal Food',
    description: 'Reduce long-distance cold-chain transport and freight emissions.',
    impactValue: 0.8,
    unitLabel: 'meal',
    points: 15,
  },
  {
    id: 'zero-food-waste',
    category: 'FOOD',
    name: 'Zero Food Waste Meal',
    description: 'Successfully consumed or repurposed leftovers to prevent food waste.',
    impactValue: 0.6,
    unitLabel: 'meal',
    points: 20,
  },
  {
    id: 'line-dry',
    category: 'ENERGY',
    name: 'Air-Dry Clothing (Line Dry)',
    description: 'Bypass energy-intensive electric heating elements in clothes dryers completely.',
    impactValue: 2.4,
    unitLabel: 'load',
    points: 25,
  },
  {
    id: 'thermostat-setback',
    category: 'ENERGY',
    name: 'Winter Heat Setback (-2°C)',
    description: 'Lower residential heating setpoints slightly to reduce natural gas / electric load.',
    impactValue: 1.8,
    unitLabel: 'day',
    points: 20,
  },
  {
    id: 'cold-water-laundry',
    category: 'ENERGY',
    name: 'Cold-Water Laundry Load',
    description: 'Wash clothing using cold water settings instead of heated water cycles.',
    impactValue: 0.6,
    unitLabel: 'load',
    points: 15,
  },
  {
    id: 'waste-sorting',
    category: 'WASTE',
    name: 'Three-Stream Waste Sorting',
    description: 'Prevent organic methane generation in landfills by diverting compost and recycling.',
    impactValue: 0.5,
    unitLabel: 'action',
    points: 10,
  },
  {
    id: 'repair-item',
    category: 'CIRCULARITY',
    name: 'Repair / Mend Clothing or Gear',
    description: 'Extend product lifespans to offset raw material extraction and manufacturing.',
    impactValue: 3.2,
    unitLabel: 'item',
    points: 40,
  },
  {
    id: 'second-hand',
    category: 'CIRCULARITY',
    name: 'Thrift / Second-Hand Purchase',
    description: 'Source apparel or goods second-hand to avoid supply chain production impacts.',
    impactValue: 4.5,
    unitLabel: 'item',
    points: 50,
  },
  {
    id: 'reusable-cup',
    category: 'CIRCULARITY',
    name: 'Reusable Mug / Container',
    description: 'Eliminate single-use paper cups and takeout packaging footprints.',
    impactValue: 0.2,
    unitLabel: 'use',
    points: 10,
  },
  {
    id: 'campus-cleanup',
    category: 'COMMUNITY',
    name: 'Campus Clean-Up / Eco Event',
    description: 'Participated in campus sustainability clean-up or ecological restoration.',
    impactValue: 4.0,
    unitLabel: 'event',
    points: 50,
  },
];

/** Calculated formatted string (e.g. "~2.4 kg CO₂e / trip") */
export function getFormattedImpact(action: ActionItem): string {
  return `~${action.impactValue.toFixed(2)} kg CO₂e / ${action.unitLabel}`;
}

/** Helper function to calculate total carbon impact for selected action IDs */
export function calculateTotalImpact(selectedIds: string[]): number {
  return ACTION_REGISTRY.filter((action) => selectedIds.includes(action.id)).reduce(
    (sum, action) => sum + action.impactValue,
    0
  );
}

/** Helper function to calculate total points for selected action IDs */
export function calculateTotalPoints(selectedIds: string[]): number {
  return ACTION_REGISTRY.filter((action) => selectedIds.includes(action.id)).reduce(
    (sum, action) => sum + action.points,
    0
  );
}
