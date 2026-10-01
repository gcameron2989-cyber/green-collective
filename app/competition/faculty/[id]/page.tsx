import React from 'react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ACTION_REGISTRY } from '@/lib/actions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FacultyPortalPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: faculty } = await supabase
    .from('faculties')
    .select('name')
    .eq('id', id)
    .single();

  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('faculty_id', id);

  const totalActions = submissions?.length || 0;
  const totalCarbon = submissions?.reduce((sum, sub) => {
    const action = ACTION_REGISTRY.find((a) => a.id === sub.eco_action_id);
    return sum + (action ? action.impactValue : 0);
  }, 0) || 0;

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24 font-sans">
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d] font-medium">
              Institutional Portal · Faculty Challenge
            </p>
            <Link
              href="/competition"
              className="font-mono text-xs uppercase tracking-wider text-[#102f26]/60 hover:text-[#102f26]"
            >
              ← Back to Leaderboards
            </Link>
          </div>
          <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-5xl text-[#102f26]">
            {faculty?.name || 'Faculty Portal'}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#526760] leading-relaxed">
            Aggregated carbon reduction metrics and verified community action logs for department members.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12 space-y-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border border-[#102f26]/15 bg-[#f9f8f6] p-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#39705d]">
              Total Carbon Diverted
            </p>
            <p className="mt-2 text-3xl font-bold text-[#102f26]">
              -{totalCarbon.toFixed(2)} <span className="text-sm font-normal">kg CO₂e</span>
            </p>
          </div>

          <div className="border border-[#102f26]/15 bg-[#f9f8f6] p-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#39705d]">
              Logged Actions
            </p>
            <p className="mt-2 text-3xl font-bold text-[#102f26]">{totalActions}</p>
          </div>

          <div className="border border-[#102f26]/15 bg-[#f9f8f6] p-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#39705d]">
              Verification Status
            </p>
            <p className="mt-2 text-xl font-medium text-[#102f26] pt-1">Active & Verified</p>
          </div>
        </div>

        <div className="border border-[#102f26]/15 bg-[#f9f8f6] p-6">
          <h3 className="text-xl font-medium text-[#102f26] mb-4">Recent Faculty Submissions</h3>
          {submissions && submissions.length > 0 ? (
            <div className="divide-y divide-[#102f26]/10">
              {submissions.map((sub) => {
                const action = ACTION_REGISTRY.find((a) => a.id === sub.eco_action_id);
                return (
                  <div key={sub.id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-[#102f26]">{action?.name || sub.eco_action_id}</p>
                      <p className="text-xs text-[#526760] font-mono mt-0.5">
                        {new Date(sub.created_at).toLocaleDateString()} · Status: {sub.status}
                      </p>
                    </div>
                    {sub.proof_url && (
                      <a
                        href={sub.proof_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs uppercase underline text-[#39705d]"
                      >
                        View Proof →
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[#526760]">No submissions recorded for this faculty yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
