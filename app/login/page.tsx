"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Proceed to personal/institutional dashboard upon submit
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Background Radial Glow & Grid Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Header */}
      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link
          href="/"
          className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2 hover:opacity-80 transition"
        >
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
        <Link
          href="/habits"
          className="text-xs font-semibold text-emerald-800 hover:underline"
        >
          &larr; Back to Guest Preview
        </Link>
      </header>

      {/* Auth Card Container */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 z-10 w-full">
        <div className="w-full max-w-md border border-emerald-900/10 rounded-2xl bg-card/90 backdrop-blur p-8 shadow-xl">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-3 border border-emerald-200">
              {isSignUp ? "Join the Network" : "Welcome Back"}
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {isSignUp ? "Create your account" : "Sign in to Green Collective"}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {isSignUp
                ? "Track personal habit momentum and connect with institutional initiatives."
                : "Access your personal impact analytics and community feeds."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Institution / Organization (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. University, Workplace, or Local Chapter"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-emerald-900/20 bg-background focus:outline-none focus:border-[#0f382c] transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-emerald-900/20 bg-background focus:outline-none focus:border-[#0f382c] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-emerald-900/20 bg-background focus:outline-none focus:border-[#0f382c] transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0f382c] text-white font-semibold rounded-full hover:bg-emerald-900 transition shadow-md shadow-emerald-950/10 text-xs mt-2"
            >
              {isSignUp ? "Create Account & Continue" : "Sign In"}
            </button>
          </form>

          {/* Toggle Sign Up vs Sign In */}
          <div className="mt-6 text-center text-xs text-muted-foreground pt-4 border-t border-emerald-900/10">
            {isSignUp ? (
              <span>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="font-bold text-[#0f382c] hover:underline"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New to Green Collective?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="font-bold text-[#0f382c] hover:underline"
                >
                  Create Account
                </button>
              </span>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/50 backdrop-blur z-10">
        © {new Date().getFullYear()} Green Collective. All rights reserved.
      </footer>
    </div>
  );
}
