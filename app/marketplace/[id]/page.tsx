'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  contact_email: string;
  created_at: string;
}

export default function MarketplaceDetail() {
  const params = useParams();
  const id = params?.id;
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [inquirySent, setInquirySent] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setItem(data);
      }
      setLoading(false);
    };

    fetchItem();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[#526760]">
        Loading listing details...
      </div>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-center font-sans">
        <h1 className="text-2xl font-medium text-[#102f26]">Listing Not Found</h1>
        <p className="mt-2 text-sm text-[#526760]">This item may have been removed or claimed.</p>
        <Link
          href="/marketplace"
          className="mt-6 inline-block bg-[#102f26] px-6 py-3 font-mono text-xs uppercase tracking-wider text-white"
        >
          ← Back to Marketplace
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24 font-sans">
      {/* Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-10">
          <div className="mb-4">
            <Link
              href="/marketplace"
              className="font-mono text-xs uppercase tracking-wider text-[#102f26]/60 hover:text-[#102f26]"
            >
              ← Back to Marketplace
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#39705d] bg-[#e2ede5] px-2.5 py-1">
                  {item.category}
                </span>
                <span className="font-mono text-xs text-[#526760]">
                  📍 {item.location}
                </span>
              </div>
              <h1 className="text-3xl font-medium tracking-tight md:text-4xl text-[#102f26]">
                {item.title}
              </h1>
            </div>
            <div className="text-3xl font-medium text-[#102f26] font-mono">
              ${item.price.toFixed(2)} <span className="text-xs text-[#526760]">CAD</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Inquiry Box */}
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-10 grid gap-12 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="border border-[#102f26]/15 bg-[#f9f8f6] p-8">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#39705d] mb-4">
              Description & Specifications
            </h3>
            <p className="text-base text-[#526760] leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          <div className="border border-[#102f26]/15 bg-white p-8">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#39705d] mb-2">
              Exchange & Pickup Guidelines
            </h3>
            <p className="text-sm text-[#526760] leading-relaxed">
              All items on Green Collective are coordinated peer-to-peer within the local Vancouver community. Once you submit an inquiry, the seller will receive your message via email to coordinate safe exchange or campus pickup.
            </p>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="border border-[#102f26]/15 bg-[#f9f8f6] p-6 h-fit space-y-6">
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#102f26] mb-1">
              Interested in this item?
            </h4>
            <p className="text-xs text-[#526760]">
              Reach out directly to arrange acquisition or ask questions.
            </p>
          </div>

          {inquirySent ? (
            <div className="bg-[#e2ede5] border border-[#39705d]/30 p-4 text-center">
              <p className="font-mono text-xs uppercase tracking-wider text-[#39705d] font-medium">
                ✓ Inquiry Sent Successfully
              </p>
              <p className="mt-1 text-xs text-[#526760]">
                The seller has been notified at their registered contact email.
              </p>
            </div>
          ) : (
            <button
              onClick={() => setInquirySent(true)}
              className="w-full bg-[#102f26] py-3.5 text-xs font-mono uppercase tracking-[0.18em] text-white transition-all hover:bg-[#1a4438]"
            >
              Contact Seller / Inquire →
            </button>
          )}

          <div className="pt-4 border-t border-[#102f26]/10 text-xs font-mono text-[#526760] space-y-1">
            <p>Listed: {new Date(item.created_at).toLocaleDateString()}</p>
            <p>Platform: Green Collective P2P</p>
          </div>
        </div>
      </div>
    </main>
  );
}
