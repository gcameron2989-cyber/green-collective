"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthView = "signin" | "signup" | "forgot";

export default function LoginPage() {
  const [view, setView] = useState<AuthView>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const switchView = (newView: AuthView) => {
    setView(newView);
    setEmail("");
    setPassword("");
    setInstitution("");
    setErrorMsg(null);
    setInfoMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);

    if (view === "forgot") {
      const origin = window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setInfoMsg("Password reset link sent! Check your inbox.");
      }
      setLoading(false);
      return;
    }

    if (view === "signup") {
      const origin = window.location.origin;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/login`,
          data: {
            institution: institution || "Independent Member",
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // Supabase requires email confirmation by default
      if (data.user && !data.session) {
        setInfoMsg("Verification link sent! Please check your email to activate your account.");
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
        <Link href="/habits" className="text-xs font-semibold text-emerald-800 hover:underline">
          &larr; Back to Guest Preview
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12 z-10 w-full">
        <div className="w-full max-w-md border border-emerald-900/10 rounded-2xl bg-card/90 backdrop-blur p-8 shadow-xl">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0f382c] rounded-full mb-3 border border-emerald-200">
              {view === "signup" ? "Join the Network" : view === "forgot" ? "Account Recovery" : "Welcome Back"}
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {view === "signup"
                ? "Create your account"
                : view === "forgot"
                ? "Reset your password"
                : "Sign in to Green Collective"}
            </h1>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-700 text-center">
              {errorMsg}
            </div>
          )}

          {infoMsg && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-800 text-center font-medium">
              {infoMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" key={view}>
            {view === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Institution / Organization (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. University, Workplace, or Local Chapter"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-emerald-900/20 bg-background focus:outline-none focus:border-[#0f382c]"
                />
              </div>
            )}

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

            {view !== "forgot" && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-foreground">Password</label>
                  {view === "signin" && (
                    <button
                      type="button"
                      onClick={() => switchView("forgot")}
                      className="text-[11px] font-medium text-emerald-800 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  autoComplete={view === "signup" ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-emerald-900/20 bg-background focus:outline-none focus:border-[#0f382c]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0f382c] text-white font-semibold rounded-full hover:bg-emerald-900 transition shadow-md text-xs mt-2 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : view === "signup"
                ? "Create Account & Continue"
                : view === "forgot"
                ? "Send Password Reset Link"
                : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground pt-4 border-t border-emerald-900/10 space-y-2">
            {view === "signup" && (
              <div>
                Already have an account?{" "}
                <button onClick={() => switchView("signin")} className="font-bold text-[#0f382c] hover:underline">
                  Sign In
                </button>
              </div>
            )}
            {view === "signin" && (
              <div>
                New to Green Collective?{" "}
                <button onClick={() => switchView("signup")} className="font-bold text-[#0f382c] hover:underline">
                  Create Account
                </button>
              </div>
            )}
            {view === "forgot" && (
              <div>
                Remembered your password?{" "}
                <button onClick={() => switchView("signin")} className="font-bold text-[#0f382c] hover:underline">
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

   
    </div>
  );
}
