'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewResearchPostPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('UBC Faculty of Forestry');
  const [researchType, setResearchType] = useState<'study_participant' | 'policy_brief' | 'dataset_share'>('study_participant');
  const [contactEmail, setContactEmail] = useState('');

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
    if (!title || !description || !contactEmail) {
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

      const { error: insertError } = await supabase.from('research_posts').insert({
        user_id: user.id,
        title,
        description,
        department,
        research_type: researchType,
        contact_email: contactEmail,
        status: 'active',
      });

      if (insertError) throw insertError;

      setMessage({ type: 'success', text: 'Research post published successfully!' });
      setTimeout(() => {
        router.push('/research');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      console.error('Research post error:', err);
      setMessage({ type: 'error', text: err?.message || 'Failed to publish research post.' });
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
              Research & Policy Hub · New Submission
            </p>
            <Link
              href="/research"
              className="font-mono text-xs uppercase tracking-wider text-[#102f26]/60 hover:text-[#102f26]"
            >
              ← Back to Research Hub
            </Link>
          </div>
          <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl text-[#102f26]">
            Publish Study or Policy Brief
          </h1>
          <p className="mt-2 text-sm text-[#526760] leading-relaxed">
            Recruit study participants, publish environmental policy briefs, or share open-source climate research datasets.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-12 md:px-10">
        <form onSubmit={handleSubmit} className="border border-[#102f26]/15 bg-[#f9f8f6] p-8 shadow-sm space-y-6">
          
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-2">
              Publication Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'study_participant', label: 'Study Recruitment' },
                { id: 'policy_brief', label: 'Policy Brief' },
                { id: 'dataset_share', label: 'Open Dataset' },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setResearchType(type.id as any)}
                  className={`p-3 text-xs font-mono uppercase tracking-wider border transition-all ${
                    researchType === type.id
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
              Title / Headline
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Urban Canopy Thermal Mitigation Study: Participant Sign-Up"
              className="w-full border border-[#102f26]/20 bg-white px-4 py-2.5 text-sm text-[#102f26] focus:border-[#102f26] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-1">
                Department / Institution
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g., UBC Faculty of Forestry"
                className="w-full border border-[#102f26]/20 bg-white px-4 py-2.5 text-sm text-[#102f26] focus:border-[#102f26] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-1">
                Contact Email
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="researcher@ubc.ca"
                className="w-full border border-[#102f26]/20 bg-white px-4 py-2.5 text-sm text-[#102f26] focus:border-[#102f26] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#39705d] mb-1">
              Abstract / Description
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide research objectives, participant time commitment, methodology summary, or access instructions..."
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
            {loading ? 'Publishing Publication...' : 'Publish Research Post →'}
          </button>

        </form>
      </div>
    </main>
  );
}
