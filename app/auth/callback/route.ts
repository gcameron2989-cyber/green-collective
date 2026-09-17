import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/reset-password";

  // Prevent Open Redirect attacks by enforcing relative local paths
  const isRelative = next.startsWith("/") && !next.startsWith("//");
  const safeNext = isRelative ? next : "/reset-password";

  // Construct origin safely handling reverse proxies (Vercel, Cloudflare, etc.)
  const host = request.headers.get("x-forwarded-host") || requestUrl.host;
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const isLocalhost = host.includes("localhost");
  const origin = isLocalhost ? requestUrl.origin : `${protocol}://${host}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Redirect on failure or missing code
  return NextResponse.redirect(
    `${origin}/login?error=Invalid+or+expired+reset+link`
  );
}
