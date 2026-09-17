"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Instantiate the Supabase client once outside the render lifecycle
const supabase = createClient();

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Safely listen for the PASSWORD_RECOVERY event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecoveryMode(true);
      }
    });

    // Check if an authenticated session already exists (e.g., set up by /auth/callback)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsRecoveryMode(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Step 1: Request Password Reset Email
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setMessage(null);
    setLoading(true);

    const origin = window.location.origin;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setMessage("Reset link sent! Please check your email inbox.");
    setLoading(false);
  };

  // Step 2: Set New Password After Clicking Email Link
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setMessage("Password updated successfully! Redirecting to login...");
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12 z-10 w-full">
        <div className="w-full max-w-md border border-emerald-900/10 rounded-2xl bg-card/90 backdrop-blur p-8 shadow-xl">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-3 border border-emerald-200">
              Account Security
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {isRecoveryMode ? "Set New Password" : "Reset Your Password"}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {isRecoveryMode
                ? "Enter your new password below to complete the reset."
                : "Enter your account email to receive a password recovery link."}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-700 text-center">
              {errorMsg}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-800 text-center font-medium">
              {message}
            </div>
          )}

          {isRecoveryMode ? (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">New Password</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-emerald-900/20 bg-background focus:outline-none focus:border-[#0f382c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-emerald-900/20 bg-background focus:outline-none focus:border-[#0f382c]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0f382c] text-white font-semibold rounded-full hover:bg-emerald-900 transition shadow-md text-xs mt-2 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendResetEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-emerald-900/20 bg-background focus:outline-none focus:border-[#0f382c]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0f382c] text-white font-semibold rounded-full hover:bg-emerald-900 transition shadow-md text-xs mt-2 disabled:opacity-50"
              >
                {loading ? "Sending Link..." : "Send Reset Link"}
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground transition">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  );
}
