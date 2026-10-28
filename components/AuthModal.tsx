"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<"magic" | "password" | "signup">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  if (!isOpen) return null;

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Magic link sent! Check your email inbox to log in immediately.",
      });
    }
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (authMode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      setLoading(false);
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Account created! Check your email to confirm registration.",
        });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        onClose();
      }
    }
  };

  const handleOAuth = async (provider: "google") => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setMessage({ type: "error", text: error.message });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-300 w-full max-w-md p-6 shadow-xl relative font-sans">
        
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-900">
            {authMode === "magic" && "Sign In with Magic Link"}
            {authMode === "password" && "Sign In with Password"}
            {authMode === "signup" && "Create Green Collective Account"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black font-mono text-xs"
          >
            ✕ CLOSE
          </button>
        </div>

        {message && (
          <div
            className={`p-3 mb-4 font-mono text-xs border ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          onClick={() => handleOAuth("google")}
          disabled={loading}
          className="w-full mb-4 py-2.5 bg-white border border-gray-300 hover:border-black text-gray-800 font-mono text-xs font-bold uppercase transition flex items-center justify-center gap-2"
        >
          <span>Continue with Google / UBC</span>
        </button>

        <div className="relative my-4 text-center">
          <span className="bg-white px-2 text-[10px] font-mono text-gray-400 uppercase relative z-10">
            OR USE EMAIL
          </span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
        </div>

        {authMode === "magic" && (
          <form onSubmit={handleMagicLink} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[11px] text-gray-500 uppercase mb-1">
                Student / Faculty Email *
              </label>
              <input
                type="email"
                required
                placeholder="student@mail.ubc.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0F2C23] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition"
            >
              {loading ? "SENDING LINK..." : "SEND MAGIC LINK ↗"}
            </button>
          </form>
        )}

        {(authMode === "password" || authMode === "signup") && (
          <form onSubmit={handlePasswordAuth} className="space-y-3 font-mono text-xs">
            {authMode === "signup" && (
              <div>
                <label className="block text-[11px] text-gray-500 uppercase mb-1">
                  Display Name / Alias *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Alex K."
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans"
                />
              </div>
            )}
            <div>
              <label className="block text-[11px] text-gray-500 uppercase mb-1">Email *</label>
              <input
                type="email"
                required
                placeholder="student@mail.ubc.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 uppercase mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 border border-gray-300 focus:outline-none focus:border-black text-xs font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0F2C23] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition"
            >
              {loading
                ? "PROCESSING..."
                : authMode === "signup"
                ? "CREATE ACCOUNT"
                : "SIGN IN"}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center font-mono text-[11px]">
          {authMode === "magic" ? (
            <button
              onClick={() => setAuthMode("password")}
              className="text-gray-500 hover:text-black underline"
            >
              Use password instead
            </button>
          ) : (
            <button
              onClick={() => setAuthMode("magic")}
              className="text-gray-500 hover:text-black underline"
            >
              Use magic link
            </button>
          )}

          {authMode === "signup" ? (
            <button
              onClick={() => setAuthMode("password")}
              className="text-[#0F2C23] font-bold hover:underline"
            >
              Already have an account? Sign in
            </button>
          ) : (
            <button
              onClick={() => setAuthMode("signup")}
              className="text-[#0F2C23] font-bold hover:underline"
            >
              Need an account? Register
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
