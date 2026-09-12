'use client'

import { useState } from 'react'
import { Flame, MessageSquare, Share2, ShieldCheck, Trophy, CheckCircle2, Camera, QrCode } from 'lucide-react'

interface FacultyRank {
  name: string
  scorePerCapita: number // normalized score
  totalImpactKg: number
  activeUsers: number
  trend: 'up' | 'down' | 'steady'
}

interface FeedItem {
  id: string
  author: string
  role: string
  faculty: string
  avatar: string
  verificationType: 'sso' | 'photo' | 'qr' | 'unverified'
  action: string
  category: 'transit' | 'energy' | 'food' | 'waste' | 'initiative'
  timeAgo: string
  impactMetric: string
  content?: string
  cheersCount: number
}

const mockFacultyRanks: FacultyRank[] = [
  { name: 'Faculty of Forestry', scorePerCapita: 142.8, totalImpactKg: 1240, activeUsers: 320, trend: 'up' },
  { name: 'Faculty of Science', scorePerCapita: 128.4, totalImpactKg: 3820, activeUsers: 1420, trend: 'up' },
  { name: 'Sauder School of Business', scorePerCapita: 115.1, totalImpactKg: 1980, activeUsers: 850, trend: 'down' },
  { name: 'Faculty of Arts', scorePerCapita: 98.6, totalImpactKg: 2150, activeUsers: 1100, trend: 'steady' },
]

const mockFeedItems: FeedItem[] = [
  {
    id: '1',
    author: 'Elena R.',
    role: 'Student',
    faculty: 'Faculty of Science',
    avatar: 'ER',
    verificationType: 'qr',
    action: 'logged campus transit choice',
    category: 'transit',
    timeAgo: '12m ago',
    impactMetric: '2.4 kg CO₂e',
    content: 'Scanned QR at North Parkade Bike Shelter. Commuted via bike from Kitsilano.',
    cheersCount: 18,
  },
  {
    id: '2',
    author: 'Marcus T.',
    role: 'Student',
    faculty: 'Faculty of Forestry',
    avatar: 'MT',
    verificationType: 'photo',
    action: 'logged sustainable dining choice',
    category: 'food',
    timeAgo: '1h ago',
    impactMetric: '1.2 kg CO₂e',
    content: 'Opted for plant-based lunch with reusable container at the Nest.',
    cheersCount: 11,
  },
]

export function CampusNetworkWithFacultyCompetition() {
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard'>('leaderboard')
  const [feed] = useState<FeedItem[]>(mockFeedItems)

  const renderVerificationBadge = (type: FeedItem['verificationType']) => {
    switch (type) {
      case 'qr':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-[#0f382c]/10 text-[#0f382c] px-1.5 py-0.5 rounded font-medium border border-[#0f382c]/20">
            <QrCode className="size-2.5 text-emerald-700" />
            QR Verified
          </span>
        )
      case 'photo':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded font-medium border border-blue-200">
            <Camera className="size-2.5 text-blue-600" />
            Photo Verified
          </span>
        )
      case 'sso':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-purple-50 text-purple-800 px-1.5 py-0.5 rounded font-medium border border-purple-200">
            <ShieldCheck className="size-2.5 text-purple-600" />
            SSO / Auto
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
            Self-Reported
          </span>
        )
    }
  }

  return (
    <div className="space-y-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-900/10">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'leaderboard'
                ? 'bg-[#0f382c] text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Trophy className="size-3.5" />
            Faculty Cup
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'feed'
                ? 'bg-[#0f382c] text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Activity Feed
          </button>
        </div>
        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full border border-emerald-200">
          Normalized Per-Capita Scoring
        </span>
      </div>

      {/* TAB 1: FACULTY LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-3">
          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-900/10 text-xs text-muted-foreground flex items-center justify-between">
            <span>Inter-Faculty Standings (Term 1)</span>
            <span className="font-semibold text-emerald-800">1.5x Multiplier for Verified Actions</span>
          </div>

          <div className="space-y-2">
            {mockFacultyRanks.map((faculty, idx) => (
              <div
                key={faculty.name}
                className="p-3.5 rounded-xl border border-emerald-900/10 bg-card/60 flex items-center justify-between transition-all hover:border-emerald-500/30"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`size-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      idx === 0
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : idx === 1
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-emerald-900/10 text-foreground'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      {faculty.name}
                      {idx === 0 && <Trophy className="size-3 text-amber-600 fill-amber-500" />}
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      {faculty.activeUsers} active participants • {faculty.totalImpactKg} kg total CO₂e
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-1 rounded-md">
                    {faculty.scorePerCapita} pts / cap
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVITY FEED WITH VERIFICATION BADGES */}
      {activeTab === 'feed' && (
        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
          {feed.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-emerald-900/10 bg-card/60 space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-[#0f382c] text-white flex items-center justify-center font-semibold text-xs">
                    {item.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-foreground">{item.author}</span>
                      <span className="text-[10px] text-muted-foreground">({item.faculty})</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {renderVerificationBadge(item.verificationType)}
                      <span className="text-[10px] text-muted-foreground">• {item.timeAgo}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {item.impactMetric}
                </span>
              </div>

              <p className="text-xs text-foreground/90">
                <span className="text-muted-foreground">{item.action}: </span>
                {item.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-900/5 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Flame className="size-3.5 text-emerald-600" />
                  <span>{item.cheersCount} Cheers</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="hover:text-foreground">Discuss</button>
                  <button className="hover:text-foreground">Share</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
