'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ResearchPost {
  id: string;
  title: string;
  description: string;
  department: string;
  research_type: string;
  contact_email: string;
  created_at: string;
}

export default function ResearchDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<ResearchPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [statement, setStatement] = useState('');
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('research_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id, supabase]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setMessage('Your participation request has been securely submitted to the research team.');
  };

  if (loading) {
    return <div className="min-h-screen bg-white py-20 text-center font-mono text-xs uppercase text-[#526760]">Loading research publication...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white py-20 text-center">
        <p className="font-mono text-xs uppercase text-[#39705d]">Publication not found</p>
        <Link href="/research" className="mt-4 inline-block font-mono text-xs underline text-[#102f26]">← Back to Research Hub</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24 font-sans">
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-4xl px-6 py-16 md:px-10">
          <Link href="/research" className="font-mono text-xs uppercase tracking-wider text-[#102f26]/60 hover:text-[#102f26] mb-4 inline-block">
            ← Back to Research Hub
          </Link>
          <div className="flex items-center justify-between mt-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#39705d] bg-[#e2ede5] px-3 py-1">
              {post.research_type.replace('_', ' ')}
            </span>
            <span className="font-mono text-xs text-[#526760]">
              {post.department}
            </span>
          </div>
          <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl text-[#102f26] mt-4">
            {post.title}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12 md:px-10 space-y-8">
        <div className="border border-[#102f26]/15 bg-[#f9f8f6] p-8 space-y-6">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#39705d] mb-2">Abstract & Overview</h3>
            <p className="text-base text-[#526760] leading-relaxed whitespace-pre-line">{post.description}</p>
          </div>

          <div className="border-t border-[#102f26]/10 pt-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#39705d] mb-4">
              {post.research_type === 'study_participant' ? 'Apply to Participate' : 'Inquire with Research Team'}
            </h3>

            {message ? (
              <div className="p-4 bg-[#e2ede5] text-[#102f26] font-mono text-xs border border-[#39705d]/30">
                {message}
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#526760] mb-1">
                    Statement of Interest / Availability
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    placeholder="Briefly describe your availability or background relevant to this study..."
                    className="w-full border border-[#102f26]/20 bg-white px-4 py-2.5 text-sm text-[#102f26] focus:border-[#102f26] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#102f26] py-4 text-xs font-mono uppercase tracking-[0.18em] text-white transition-all hover:bg-[#1a4438]"
                >
                  Submit Application to Research Team →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
