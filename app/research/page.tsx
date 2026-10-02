'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface ResearchPost {
  id: string;
  title: string;
  description: string;
  department: string;
  research_type: 'study_participant' | 'policy_brief' | 'dataset_share';
  contact_email: string;
  created_at: string;
}

export default function ResearchHubPage() {
  const [posts, setPosts] = useState<ResearchPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const supabase = createClient();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('research_posts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [supabase]);

  const filteredPosts = posts.filter((item) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'STUDY' && item.research_type === 'study_participant') return true;
    if (activeTab === 'POLICY' && item.research_type === 'policy_brief') return true;
    if (activeTab === 'DATA' && item.research_type === 'dataset_share') return true;
    return false;
  });

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24 font-sans">
      {/* Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d] font-medium">
              Academic & Institutional Portal
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
                Research & Policy Hub
              </h1>
              <p className="mt-4 max-w-2xl text-base text-[#526760] leading-relaxed">
                Explore peer-reviewed climate insights, examine environmental policy briefs, or participate in active campus field and survey research.
              </p>
            </div>
            <Link
              href="/research/new"
              className="inline-flex items-center justify-center bg-[#102f26] px-6 py-3.5 text-xs font-mono uppercase tracking-[0.18em] text-white transition-all hover:bg-[#1a4438] shrink-0"
            >
              + Post Study / Brief →
            </Link>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12 space-y-8">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#102f26]/10 pb-6">
          {[
            { id: 'ALL', label: 'All Publications' },
            { id: 'STUDY', label: 'Study Participant Recruitment' },
            { id: 'POLICY', label: 'Policy Briefs' },
            { id: 'DATA', label: 'Open Datasets' },
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
            Loading research publications...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="border border-[#102f26]/15 bg-[#f9f8f6] p-12 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-[#39705d]">
              No active research entries found
            </p>
            <p className="mt-2 text-sm text-[#526760]">
              Contribute a policy brief or invite participants to an ongoing campus study.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredPosts.map((item) => (
              <div
                key={item.id}
                className="group border border-[#102f26]/15 bg-[#f9f8f6] p-8 flex flex-col justify-between transition-all hover:border-[#102f26]/40 hover:bg-white"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#39705d] bg-[#e2ede5] px-2.5 py-1">
                      {item.research_type.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-xs text-[#526760] font-medium">
                      {item.department}
                    </span>
                  </div>
                  <h3 className="text-2xl font-medium text-[#102f26] tracking-tight group-hover:text-[#39705d] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#526760] leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#102f26]/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#526760]">Contact: {item.contact_email}</span>
                  <Link
                    href={`/research/${item.id}`}
                    className="text-[#102f26] font-semibold uppercase group-hover:underline"
                  >
                    Read & Inquire →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
