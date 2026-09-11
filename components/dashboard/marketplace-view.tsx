import React from "react"

export interface MarketplaceViewProps {
  ecoPoints?: number
  [key: string]: any
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ ecoPoints }) => {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
      <h3 className="font-semibold text-lg">Local Green Marketplace</h3>
      <p className="text-sm text-muted-foreground">Discover verified sustainable vendors in Vancouver, BC.</p>
      {ecoPoints !== undefined && <p className="text-xs text-emerald-600 font-medium">Points: {ecoPoints}</p>}
    </div>
  )
}

export default MarketplaceView
