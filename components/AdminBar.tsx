"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const ADMIN_EMAIL = "gcameron2989@gmail.com";

export default function AdminBar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      }
      setLoading(false);
    }

    checkAdmin();

    // Listen for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(session?.user?.email === ADMIN_EMAIL);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (loading || !isAdmin) return null;

  return (
    <div className="bg-[#102f26] text-white px-4 py-2 text-xs font-mono flex justify-between items-center shadow-md border-b border-[#39705d]/40 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
          Admin Mode Active
        </span>
        <span className="text-[#f9f8f6]/80 hidden sm:inline">
          Logged in as <strong className="text-white">{ADMIN_EMAIL}</strong>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/inbox"
          className="bg-[#39705d] hover:bg-[#39705d]/80 text-white px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide transition shadow-sm flex items-center gap-1.5"
        >
          <span>Master Inbox Hub</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
