import React from 'react'
import { ShoppingBag, Tag, ExternalLink } from 'lucide-react'

export interface MarketplaceViewProps {
  ecoPoints?: number
  [key: string]: any
}

export function MarketplaceView({ ecoPoints = 1840 }: MarketplaceViewProps) {
  const rewards = [
    { id: 1, title: '15% Off Refillable Goods', vendor: 'Kitsilano Zero Waste Market', points: 300, cat: 'Retail' },
    { id: 2, title: 'Free Oat Milk Upgrade', vendor: 'Local Vancouver Cafe', points: 150, cat: 'Food & Drink' },
    { id: 3, title: 'Day Pass Discount', vendor: 'Mobi Bike Share', points: 500, cat: 'Transit' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Eco Marketplace</h2>
          <p className="text-sm text-muted-foreground">Redeem your eco-points with verified sustainable local partners in Vancouver.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-emerald-600" />
          <span className="font-bold text-emerald-900">{ecoPoints} Points Available</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rewards.map((r) => (
          <div key={r.id} className="border rounded-2xl p-5 bg-card shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                <Tag className="h-3 w-3" /> {r.cat}
              </span>
              <h3 className="font-semibold text-base">{r.title}</h3>
              <p className="text-xs text-muted-foreground">{r.vendor}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm font-bold text-emerald-700">{r.points} pts</span>
              <button type="button" className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1">
                Redeem <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarketplaceView
