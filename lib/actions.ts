export interface ActionItem {
  id: string;
  title: string;
  category: 'TRANSPORT' | 'FOOD' | 'ENERGY' | 'WASTE' | 'CIRCULARITY' | 'COMMUNITY';
  shortDescription: string;
  fullDescription: string;
  impactValue: number; // e.g. 2.04 kg CO2e saved per unit
  unitLabel: string; // e.g. "trip", "meal", "load", "day"
  points: number;
  calculationNote?: string;
}

export const ACTION_REGISTRY: ActionItem[] = [
  {
    id: 'public-transit',
    title: 'Public Transit Commute',
    category: 'TRANSPORT',
    shortDescription: 'Share efficient high-capacity transit instead of driving.',
    fullDescription: 'Replaced a personal vehicle trip with SkyTrain, bus, or SeaBus.',
    impactValue: 2.04,
    unitLabel: 'trip',
    points: 25,
    calculationNote: 'Based on 12km average commute replacing gas vehicle emissions.',
  },
  {
    id: 'active-transit',
    title: 'Active Transit (Bike / Walk)',
    category: 'TRANSPORT',
    shortDescription: 'Completely eliminate vehicle emissions by commuting under human power.',
    fullDescription: 'Commuted via bicycle, e-bike, scooter, or walking.',
    impactValue: 2.40,
    unitLabel: 'trip',
    points: 30,
    calculationNote: '0.18 kg CO2e/km direct displacement.',
  },
  {
    id: 'plant-forward-meal',
    title: 'Plant-Forward Meal',
    category: 'FOOD',
    shortDescription: 'Opt for whole plant ingredients over high-emission livestock alternatives.',
    fullDescription: 'Chose a plant-based or vegetarian lunch or dinner option.',
    impactValue: 1.40,
    unitLabel: 'meal',
    points: 20,
    calculationNote: 'Replaces ruminant meat baseline carbon footprint.',
  },
  {
    id: 'locally-sourced-food',
    category: 'FOOD',
    title: 'Locally Sourced / Seasonal Food',
    shortDescription: 'Reduce long-distance cold-chain transport and freight emissions.',
    fullDescription: 'Sourced regional produce or local seasonal food items.',
    impactValue: 0.70,
    unitLabel: 'meal',
    points: 10,
  },
  {
    id: 'line-dry-laundry',
    category: 'ENERGY',
    title: 'Air-Dry Clothing (Line Dry)',
    shortDescription: 'Bypass energy-intensive electric heating elements in clothes dryers.',
    fullDescription: 'Hung laundry to line dry or air dry indoors instead of running a tumble dryer.',
    impactValue: 2.40,
    unitLabel: 'load',
    points: 25,
  },
  {
    id: 'winter-heat-setback',
    category: 'ENERGY',
    title: 'Thermostat Setback (-2°C)',
    shortDescription: 'Lower residential heating setpoints slightly to reduce gas or electric load.',
    fullDescription: 'Maintained a lower residential heating temperature during winter/cool periods.',
    impactValue: 1.80,
    unitLabel: 'day',
    points: 20,
  },
  {
    id: 'cold-water-wash',
    category: 'ENERGY',
    title: 'Cold-Water Laundry Load',
    shortDescription: 'Eliminate water heating during washing machine cycles.',
    fullDescription: 'Washed laundry using cold water settings.',
    impactValue: 0.60,
    unitLabel: 'load',
    points: 10,
  },
  {
    id: 'three-stream-sorting',
    category: 'WASTE',
    title: 'Three-Stream Waste Sorting',
    shortDescription: 'Prevent organic methane generation in landfills by diverting compost and recycling.',
    fullDescription: 'Properly sorted organics, recyclables, and landfill waste throughout the day.',
    impactValue: 0.50,
    unitLabel: 'day',
    points: 10,
  },
  {
    id: 'repair-item',
    category: 'CIRCULARITY',
    title: 'Repair or Mend Clothing / Gear',
    shortDescription: 'Extend product lifespans to offset raw material extraction and manufacturing.',
    fullDescription: 'Repaired footwear, mended garments, or fixed gear instead of replacing.',
    impactValue: 3.20,
    unitLabel: 'item',
    points: 40,
  },
  {
    id: 'second-hand-purchase',
    category: 'CIRCULARITY',
    title: 'Thrift / Second-Hand Purchase',
    shortDescription: 'Source apparel or goods second-hand to avoid supply chain production impacts.',
    fullDescription: 'Purchased pre-owned goods or clothing instead of buying new.',
    impactValue: 4.50,
    unitLabel: 'item',
    points: 50,
  },
];

/** Helper function to calculate total carbon saved for selected action IDs */
export function calculateTotalImpact(selectedIds: string[]): number {
  return ACTION_REGISTRY.filter((action) => selectedIds.includes(action.id)).reduce(
    (sum, action) => sum + action.impactValue,
    0
  );
}

/** Helper function to calculate total points earned */
export function calculateTotalPoints(selectedIds: string[]): number {
  return ACTION_REGISTRY.filter((action) => selectedIds.includes(action.id)).reduce(
    (sum, action) => sum + action.points,
    0
  );
}
