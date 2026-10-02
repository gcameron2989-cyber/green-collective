'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  listing_type: 'bio_product' | 'recycle_p2p' | 'research_study';
  image_url: string | null;
  location: string;
  status: string;
  created_at: string;
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const supabase = createClient();

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setListings(data);
      }
      setLoading(false);
    };

    fetchListings();
  }, [supabase]);

  const filteredListings = listings.filter((item) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'BIO' && item.listing_type === 'bio_product') return true;
    if (activeTab === 'RECYCLE' && item.listing_type === 'recycle_p2p') return true;
    if (activeTab === 'RESEARCH' && item.listing_type === 'research_study') return true;
    return false;
  });

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24 font-sans">
      {/* Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d] font-medium">
              Circular Economy & Research Network
            </p>
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-wider text-[#102f26]/60 hover:text-[#102f26]"
            >
              ← Back to Home
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-5xl text-[#102f26]">
                Community Marketplace
              </h1>
              <p className="mt-4 max-w-2xl text-base text-[#526760] leading-relaxed">
                Exchange sustainable bio-products, rehome items through local P2P recycling, or participate in active campus climate research studies.
              </p>
            </div>
            <Link
              href="/marketplace/new"
              className="inline-flex items-center justify-center bg-[#102f26] px-6 py-3.5 text-xs font-mono uppercase tracking-[0.18em] text-white transition-all hover:bg-[#1a4438] shrink-0"
            >
              + Post Listing →
            </Link>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12 space-y-8">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#102f26]/10 pb-6">
          {[
            { id: 'ALL', label: 'All Listings' },
            { id: 'BIO', label: 'Bio-Products & Goods' },
            { id: 'RECYCLE', label: 'P2P Recycling & Giveaways' },
            { id: 'RESEARCH', label: 'Research Studies & Participants' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-[#102f26] text-white'
                  : 'bg-[#f1f6f2] text-[#102f26]/70 hover:bg-[#e2ede5] hover:text-[#102f26]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-[#526760]">
            Loading marketplace inventory...
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="border border-[#102f26]/15 bg-[#f9f8f6] p-12 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-[#39705d]">
              No active listings found in this category
            </p>
            <p className="mt-2 text-sm text-[#526760]">
              Be the first to list a sustainable item or post a research study for the community.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                className="group border border-[#102f26]/15 bg-[#f9f8f6] p-6 flex flex-col justify-between transition-all hover:border-[#102f26]/40 hover:bg-white"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#39705d] bg-[#e2ede5] px-2.5 py-1">
                      {item.listing_type.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#102f26]">
                      {item.price === 0 ? 'FREE / GIVEAWAY' : `$${item.price.toFixed(2)}`}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-[#102f26] group-hover:text-[#39705d] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#526760] line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#102f26]/10 flex items-center justify-between text-xs font-mono text-[#526760]">
                  <span>{item.location}</span>
                  <span className="text-[#102f26] uppercase group-hover:underline">
                    View Details → <Link href={`/marketplace/${item.id}`} className="text-[#102f26] uppercase group-hover:underline">
  View Details →
</Link>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
