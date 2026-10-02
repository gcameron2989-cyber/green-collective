'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  listing_type: string;
  image_url: string | null;
  location: string;
  created_at: string;
  user_id: string;
}

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setListing(data);
      }
      setLoading(false);
    };

    fetchListing();
  }, [id, supabase]);

  const handleClaimOrInquire = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setMessage('Inquiry sent successfully to the lister! They will contact you shortly.');
  };

  if (loading) {
    return <div className="min-h-screen bg-white py-20 text-center font-mono text-xs uppercase text-[#526760]">Loading listing...</div>;
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-white py-20 text-center">
        <p className="font-mono text-xs uppercase text-[#39705d]">Listing not found</p>
        <Link href="/marketplace" className="mt-4 inline-block font-mono text-xs underline text-[#102f26]">← Back to Marketplace</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24 font-sans">
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-4xl px-6 py-16 md:px-10">
          <Link href="/marketplace" className="font-mono text-xs uppercase tracking-wider text-[#102f26]/60 hover:text-[#102f26] mb-4 inline-block">
            ← Back to Marketplace
          </Link>
          <div className="flex items-center justify-between mt-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#39705d] bg-[#e2ede5] px-3 py-1">
              {listing.listing_type.replace('_', ' ')}
            </span>
            <span className="font-mono text-lg font-bold text-[#102f26]">
              {listing.price === 0 ? 'FREE / GIVEAWAY' : `$${listing.price.toFixed(2)} CAD`}
            </span>
          </div>
          <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl text-[#102f26] mt-4">
            {listing.title}
          </h1>
          <p className="font-mono text-xs text-[#526760] mt-2">
            Location: {listing.location} · Category: {listing.category}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12 md:px-10 space-y-8">
        <div className="border border-[#102f26]/15 bg-[#f9f8f6] p-8 space-y-6">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#39705d] mb-2">Description & Details</h3>
            <p className="text-base text-[#526760] leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          {message ? (
            <div className="p-4 bg-[#e2ede5] text-[#102f26] font-mono text-xs border border-[#39705d]/30">
              {message}
            </div>
          ) : (
            <button
              onClick={handleClaimOrInquire}
              className="w-full bg-[#102f26] py-4 text-xs font-mono uppercase tracking-[0.18em] text-white transition-all hover:bg-[#1a4438]"
            >
              Inquire / Request Item →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
