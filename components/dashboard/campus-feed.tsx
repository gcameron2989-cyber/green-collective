'use client'

import { useState } from 'react'
import { Flame, MessageSquare, Share2, ShieldCheck, Users, TreePine, Award } from 'lucide-react'

interface FeedItem {
  id: string
  author: string
  role: string
  avatar: string
  badge?: string
  action: string
  category: 'transit' | 'energy' | 'food' | 'waste' | 'circularity' | 'initiative'
  timeAgo: string
  impactMetric: string
  content?: string
  cheersCount: number
}

const mockFeedItems: FeedItem[] = [
  {
    id: '1',
    author: 'UBC Cycling Club',
    role: 'Campus Organization',
    avatar: '🚲',
    badge: 'Verified Org',
    action: 'launched a group initiative',
    category: 'initiative',
    timeAgo: '12m ago',
    impactMetric: '42 participants registered',
    content: 'Join us for the Fall Bike Commuter Challenge! Log your zero-emission commutes all week to power UBC’s regional transit offset metrics.',
    cheersCount: 38,
  },
  {
    id: '2',
    author: 'Elena R.',
    role: 'Faculty of Science',
    avatar: 'ER',
    action: 'logged 2 green choices',
    category: 'transit',
    timeAgo: '45m ago',
    impactMetric: '2.4 kg CO₂e offset',
    content: 'Biked to campus and used a reusable coffee cup at Blue Chip.',
    cheersCount: 14,
  },
  {
    id: '3',
    author: 'Department of Economics',
    role: 'Institutional Partner',
    avatar: '📊',
    badge: 'Scope 1-3 Leader',
    action: 'achieved 85% paperless operations',
    category: 'waste',
    timeAgo: '2h ago',
    impactMetric: '120 kg paper saved',
    content: 'Successfully completed the digital-first grading transition across all undergraduate seminars this term.',
    cheersCount: 52,
  },
  {
    id: '4',
    author: 'Marcus T.',
    role: 'Faculty of Forestry',
    avatar: 'MT',
    action: 'logged a green choice',
    category: 'food',
    timeAgo: '3h ago',
    impactMetric: '1.2 kg CO₂e offset',
    content: 'Opted for a locally-sourced plant-based lunch at the Nest.',
    cheersCount: 9,
  },
]

export function CampusFeed() {
  const [feed, setFeed] = useState<FeedItem[]>(mockFeedItems)
  const [cheeredIds, setCheeredIds] = useState<string[]>([])

  const toggleCheer = (id: string) => {
    setFeed((prevFeed) =>
      prevFeed.map((item) => {
        if (item.id === id) {
          const hasCheered = cheeredIds.includes(id)
          return {
            ...item,
            cheersCount: hasCheered ? item.cheersCount - 1 : item.cheersCount + 1,
          }
        }
        return item
      })
    )

    setCheeredIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-900/10">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-emerald-700" />
          <h3 className="font-semibold text-sm text-foreground">Campus Network Feed</h3>
        </div>
        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
          UBC Hub Live
        </span>
      </div>

      {/* Feed List */}
      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
        {feed.map((item) => {
          const hasCheered = cheeredIds.includes(item.id)

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-emerald-900/10 bg-card/60 backdrop-blur-sm space-y-2.5 transition-all hover:border-emerald-500/20"
            >
              {/* Author Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-[#0f382c] text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                    {item.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-foreground">{item.author}</span>
                      {item.badge && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-100 text-[#0f382c] px-1.5 py-0.2 rounded font-medium border border-emerald-200">
                          <ShieldCheck className="size-2.5 text-emerald-600" />
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{item.role} • {item.timeAgo}</p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                  {item.impactMetric}
                </span>
              </div>

              {/* Action Description */}
              <p className="text-xs text-foreground/90 leading-normal">
                <span className="text-muted-foreground">{item.action}: </span>
                {item.content}
              </p>

              {/* Action Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-emerald-900/5 text-[11px]">
                <button
                  onClick={() => toggleCheer(item.id)}
                  className={`flex items-center gap-1.5 font-medium transition-colors ${
                    hasCheered ? 'text-emerald-700 font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Flame className={`size-3.5 ${hasCheered ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                  <span>{item.cheersCount} Momentum Cheers</span>
                </button>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <button className="hover:text-foreground transition-colors flex items-center gap-1">
                    <MessageSquare className="size-3" />
                    <span>Discuss</span>
                  </button>
                  <button className="hover:text-foreground transition-colors flex items-center gap-1">
                    <Share2 className="size-3" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
