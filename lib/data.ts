import {
  Bike,
  Recycle,
  Salad,
  Bus,
  Sprout,
  Sun,
  type LucideIcon,
} from 'lucide-react'

export type ActionCategory = {
  id: string
  label: string
  icon: LucideIcon
  points: number
  co2: number // kg CO2 saved per action
  blurb: string
}

export const ACTION_CATEGORIES: ActionCategory[] = [
  { id: 'biking', label: 'Biking', icon: Bike, points: 40, co2: 2.6, blurb: 'Replace a car trip with a ride.' },
  { id: 'composting', label: 'Composting', icon: Recycle, points: 25, co2: 0.9, blurb: 'Divert food scraps from landfill.' },
  { id: 'meal-prep', label: 'Meal Prep', icon: Salad, points: 30, co2: 1.4, blurb: 'Plant-forward, low-waste meals.' },
  { id: 'transit', label: 'Public Transit', icon: Bus, points: 20, co2: 1.1, blurb: 'Take the bus or train.' },
  { id: 'gardening', label: 'Gardening', icon: Sprout, points: 15, co2: 0.4, blurb: 'Grow your own greens.' },
  { id: 'line-dry', label: 'Line Dry', icon: Sun, points: 10, co2: 0.7, blurb: 'Skip the dryer, use the sun.' },
]

export type VerificationStatus = 'verified' | 'pending'

export type Activity = {
  id: string
  categoryId: string
  title: string
  points: number
  co2: number
  timeAgo: string
  status: VerificationStatus
}

export const RECENT_ACTIVITY: Activity[] = [
  { id: 'a1', categoryId: 'biking', title: 'Biked to work — 8.2 km', points: 40, co2: 2.6, timeAgo: '2h ago', status: 'verified' },
  { id: 'a2', categoryId: 'meal-prep', title: 'Cooked 3 plant-based meals', points: 30, co2: 1.4, timeAgo: '5h ago', status: 'verified' },
  { id: 'a3', categoryId: 'composting', title: 'Weekly compost drop-off', points: 25, co2: 0.9, timeAgo: 'Yesterday', status: 'pending' },
  { id: 'a4', categoryId: 'transit', title: 'Took the tram downtown', points: 20, co2: 1.1, timeAgo: 'Yesterday', status: 'verified' },
  { id: 'a5', categoryId: 'line-dry', title: 'Line-dried two loads', points: 10, co2: 0.7, timeAgo: '2 days ago', status: 'pending' },
]

export type Product = {
  id: string
  name: string
  vendor: string
  image: string
  pointsForDiscount: number
  discount: string
  price: string
}

export const FEATURED_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Organic Canvas Tote', vendor: 'Fern & Field', image: '/products/tote.png', pointsForDiscount: 250, discount: '20% off', price: '$18' },
  { id: 'p2', name: 'Sage Steel Bottle', vendor: 'Rill Goods', image: '/products/bottle.png', pointsForDiscount: 400, discount: '25% off', price: '$29' },
  { id: 'p3', name: 'Beeswax Food Wraps', vendor: 'Hive Home', image: '/products/wraps.png', pointsForDiscount: 180, discount: '15% off', price: '$14' },
]

export type Collective = {
  id: string
  name: string
  description: string
  members: number
  weeklyGoal: number
  weeklyProgress: number
  joined: boolean
}

export const COLLECTIVES: Collective[] = [
  { id: 'c1', name: 'Bike Commuters Club', description: 'Two wheels, zero emissions. Weekly ride challenges.', members: 342, weeklyGoal: 500, weeklyProgress: 380, joined: true },
  { id: 'c2', name: 'Zero-Waste Kitchen', description: 'Composting, meal prep, and pantry swaps.', members: 218, weeklyGoal: 400, weeklyProgress: 265, joined: true },
  { id: 'c3', name: 'Urban Gardeners', description: 'Balcony beds to community plots.', members: 176, weeklyGoal: 300, weeklyProgress: 140, joined: false },
  { id: 'c4', name: 'Transit Advocates', description: 'Ditch the car, ride together.', members: 128, weeklyGoal: 350, weeklyProgress: 210, joined: false },
]

export const USER = {
  name: 'Maya Okafor',
  handle: '@mayagrows',
  location: 'Portland, OR',
  memberSince: 'Mar 2024',
  ecoPoints: 1840,
  dayStreak: 12,
  co2Saved: 148.6, // kg
  actionsLogged: 96,
  rank: 'Sprout Guardian',
}
