"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// Set your admin email address here
const ADMIN_EMAIL = "gcameron2989@gmail.com"; // Replace with your actual admin email if different

export default function MasterAdminHub() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ id: string; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function checkAuthAndFetch() {
      // 1. Check current logged-in user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const email = session.user.email;
      setUserEmail(email);

      // 2. Verify against your admin email whitelist
      if (email !== ADMIN_EMAIL) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setAuthorized(true);

      // 3. Fetch all five submission tables concurrently if authorized
      const [inquiriesRes, actionsRes, initiativesRes, marketRes, researchRes] = await Promise.all([
        supabase.from("contact_inquiries").select("*"),
        supabase.from("proposed_actions").select("*, profiles:user_id(full_name, email)"),
        supabase.from("proposed_initiatives").select("*, profiles:user_id(full_name, email)"),
        supabase.from("marketplace_listings").select("*, profiles:user_id(full_name, email)"),
        supabase.from("research_submissions").select("*, profiles:user_id(full_name, email)"),
      ]);

      const inquiries = (inquiriesRes.data || []).map((item) => ({
        ...item,
        type: "inquiry",
        title: item.subject || "General Contact Inquiry",
        userEmail: item.email,
        userName: item.name,
        sortDate: new Date(item.created_at).getTime(),
      }));

      const proposals = (actionsRes.data || []).map((item) => ({
        ...item,
        type: "proposal",
        title: `Action Proposal: ${item.action_title}`,
        userEmail: item.profiles?.email || item.user_email || "User",
        userName: item.profiles?.full_name || "Eco-Champion",
        message: `Category: ${item.category}\nDescription: ${item.description}\nEstimated Impact: ${item.estimated_impact} kg CO₂e`,
        sortDate: new Date(item.created_at).getTime(),
      }));

      const initiatives = (initiativesRes.data || []).map((item) => ({
        ...item,
        type: "initiative",
        title: `Initiative: ${item.title || item.initiative_title || "Campus Initiative"}`,
        userEmail: item.profiles?.email || item.user_email || "User",
        userName: item.profiles?.full_name || "Eco-Champion",
        message: `Description: ${item.description || item.summary}`,
        sortDate: new Date(item.created_at).getTime(),
      }));

      const marketplace = (marketRes.data || []).map((item) => ({
        ...item,
        type: "marketplace",
        title: `Marketplace Listing: ${item.title || item.item_name || "Eco Item"}`,
        userEmail: item.profiles?.email || item.user_email || "User",
        userName: item.profiles?.full_name || "Eco-Champion",
        message: `Price: $${item.price || 0}\nDescription: ${item.description || item.details}`,
        sortDate: new Date(item.created_at).getTime(),
      }));

      const research = (researchRes.data || []).map((item) => ({
        ...item,
        type: "research",
        title: `Research Submission: ${item.title || item.project_title || "Study"}`,
        userEmail: item.profiles?.email || item.user_email || "User",
        userName: item.profiles?.full_name || "Eco-Champion",
        message: `Abstract/Details: ${item.abstract || item.description || item.details}`,
        sortDate: new Date(item.created_at).getTime(),
      }));

      const combined = [...inquiries, ...proposals, ...initiatives, ...marketplace, ...research].sort(
        (a, b) => b.sortDate - a.sortDate
      );
      setItems(combined);
      setLoading(false);
    }

    checkAuthAndFetch();
  }, [supabase]);

  const handleSendResponse = async (item: any) => {
    const message = replyTexts[item.id];
    if (!message) return;

    setSendingId(item.id);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/reply-unified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: item.userEmail,
          userName: item.userName,
          subject: item.title,
          message: message,
          itemId: item.id,
          itemType: item.type,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to send response");

      const resolvedStatus = item.type === "inquiry" ? "replied" : "approved";
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: resolvedStatus } : i))
      );
      setReplyTexts((prev) => ({ ...prev, [item.id]: "" }));
      setStatusMsg({ id: item.id, text: "✓ Response sent & email dispatched!" });
    } catch (err: any) {
      setStatusMsg({ id: item.id, text: err.message || "Failed to send." });
    } finally {
      setSendingId(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#f9f8f6] p-12 text-xs font-mono text-[#526760]">Verifying admin authorization...</div>;
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-[#f9f8f6] text-[#102f26] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white border border-[#102f26]/15 rounded-2xl p-8 shadow-sm text-center space-y-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-red-600 block">
            Access Restricted · 403 Forbidden
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">Admin Portal Locked</h1>
          <p className="text-xs text-[#526760] leading-relaxed">
            {userEmail 
              ? `Signed in as ${userEmail}. This account does not have administrator privileges for Green Collective.`
              : `You must be logged into an authorized administrator account to access this page.`}
          </p>
          <div className="pt-2">
            <a
              href="/login"
              className="inline-block px-5 py-2.5 bg-[#102f26] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#39705d] transition shadow"
            >
              Sign In With Admin Account →
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f9f8f6] text-[#102f26] p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#39705d] block mb-1">
              Admin Hub · Master Management
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">Master Submissions &amp; Inbox Hub</h1>
            <p className="text-xs text-[#526760] mt-1">
              Manage contact forms, action proposals, campus initiatives, marketplace listings, and research submissions in one place.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg block font-bold">
              Authenticated: {userEmail}
            </span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl border border-[#102f26]/10 text-center text-xs text-[#526760]">
            No submissions found across any platform tables.
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => {
              const isResolved = item.status === "replied" || item.status === "approved";
              const badgeColor =
                item.type === "proposal"
                  ? "bg-emerald-100 text-emerald-900"
                  : item.type === "initiative"
                  ? "bg-purple-100 text-purple-900"
                  : item.type === "marketplace"
                  ? "bg-amber-100 text-amber-900"
                  : item.type === "research"
                  ? "bg-indigo-100 text-indigo-900"
                  : "bg-sky-100 text-sky-900";

              return (
                <div key={`${item.type}-${item.id}`} className="bg-white border border-[#102f26]/15 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${badgeColor}`}>
                        {item.type}
                      </span>
                      <span className="font-bold text-base text-[#102f26]">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-gray-400">{new Date(item.created_at).toLocaleString()}</span>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        isResolved ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}>
                        {item.status || "pending"}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-[#526760]">
                    Submitted by: <strong className="text-[#102f26]">{item.userName}</strong> ({item.userEmail})
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#39705d] mb-1 font-mono uppercase">Submission Details:</p>
                    <p className="text-sm text-[#102f26] bg-[#f9f8f6] p-4 rounded-xl border border-gray-200/60 leading-relaxed whitespace-pre-wrap">
                      {item.message || item.description || "No description provided."}
                    </p>
                  </div>

                  <div className="pt-2 space-y-3">
                    <textarea
                      rows={3}
                      placeholder={`Type response / approval note to ${item.userName}...`}
                      value={replyTexts[item.id] || ""}
                      onChange={(e) => setReplyTexts({ ...replyTexts, [item.id]: e.target.value })}
                      className="w-full p-3 text-xs rounded-xl border border-gray-200 bg-white font-sans text-[#102f26]"
                    />
                    <div className="flex justify-between items-center">
                      {statusMsg && statusMsg.id === item.id && (
                        <span className="text-xs font-mono text-emerald-700">{statusMsg.text}</span>
                      )}
                      <div className="ml-auto">
                        <button
                          type="button"
                          onClick={() => handleSendResponse(item)}
                          disabled={sendingId === item.id || !replyTexts[item.id]}
                          className="px-5 py-2.5 bg-[#102f26] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#39705d] transition shadow disabled:opacity-40"
                        >
                          {sendingId === item.id ? "Sending..." : "Send Response & Approve →"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
