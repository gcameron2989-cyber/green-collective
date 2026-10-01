'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewMarketplaceListingPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0.00');
  const [category, setCategory] = useState('Bio-Based Materials');
  const [listingType, setListingType] = useState<'bio_product' | 'recycle_p2p'>('bio_product');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('Vancouver, BC');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category) {
      setMessage({ type: 'error', text: 'Please fill out all required fields.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { error: insertError } = await supabase.from('listings').insert({
        user_id: user.id,
        title,
        description,
        price: parseFloat(price) || 0,
        category,
        listing_type: listingType,
        image_url: imageUrl || null,
        location,
        status: 'active',
      });

      if (insertError) throw insertError;

      setMessage({ type: 'success', text: 'Listing published successfully!' });
      setTimeout(() => {
        router.push('/marketplace');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      console.error('Marketplace error:', err);
      setMessage({ type: 'error', text: err?.message || 'Failed to publish listing.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24 font-sans">
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d] font-medium">
              Marketplace · New Listing
            </p>
            <Link
              href="/marketplace"
              className="font-mono text-xs uppercase tracking-wider text-[#102f26]/60 hover:text-[#102f26]"
            >
              ← Back to Marketplace
            </Link>
          </div>
          <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl text-[#102f26]">
            Create Marketplace Listing
          </h1>
          <p className="mt-2 text-sm text-[#526760] leading-relaxed">
            List bio-based products, forestry materials, or share reusable eco-goods with the community.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-12 md:px-10">
        <form onSubmit={handleSubmit} className="border border-[#102f26]/15 bg-[#f9f8f6] p-8 shadow-sm space-y-6">
          
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-2">
              Listing Category Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'bio_product', label: 'Bio-Product / Material' },
                { id: 'recycle_p2p', label: 'P2P Recycling / Reusable Good' },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setListingType(type.id as any)}
                  className={`p-3 text-xs font-mono uppercase tracking-wider border transition-all ${
                    listingType === type.id
                      ? 'bg-[#102f26] text-white border-[#102f26]'
                      : 'bg-white text-[#102f26] border-[#102f26]/20 hover:border-[#102f26]/40'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Lignin-infused Bioplastic Pellets or Reusable Mason Jars"
              className="w-full border border-[#102f26]/20 bg-white px-4 py-2.5 text-sm text-[#102f26] focus:border-[#102f26] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-1">
                Category
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Materials, Compostable Packaging, Containers"
                className="w-full border border-[#102f26]/20 bg-white px-4 py-2.5 text-sm text-[#102f26] focus:border-[#102f26] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-1">
                Price ($ CAD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-[#102f26]/20 bg-white px-4 py-2.5 text-sm text-[#102f26] focus:border-[#102f26] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Vancouver, BC"
                className="w-full border border-[#102f26]/20 bg-white px-4 py-2.5 text-sm text-[#102f26] focus:border-[#102f26] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-1">
                Image URL (Optional)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-[#102f26]/20 bg-white px-4 py-2.5 text-sm text-[#102f26] focus:border-[#102f26] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-1">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe condition, pickup details, material composition, or dimensions..."
              className="w-full border border-[#102f26]/20 bg-white px-4 py-2.5 text-sm text-[#102f26] focus:border-[#102f26] focus:outline-none"
            />
          </div>

          {message && (
            <div
              className={`p-3 text-xs font-mono ${
                message.type === 'success'
                  ? 'bg-[#e2ede5] text-[#102f26] border border-[#39705d]/30'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#102f26] py-4 text-xs font-mono uppercase tracking-[0.18em] text-white transition-all hover:bg-[#1a4438] disabled:opacity-50"
          >
            {loading ? 'Publishing Listing...' : 'Publish Listing →'}
          </button>

        </form>
      </div>
    </main>
  );
}
