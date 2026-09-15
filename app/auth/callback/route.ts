import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Default to /reset-password if no next query param is present
  const next = searchParams.get("next") ?? "/reset-password";

  if (code) {
    const supabase = await createClient();
    
    // Exchange the temporal code for a logged-in session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Forward the authenticated user to the reset password form
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return user to login page with an error message if the code exchange fails or expires
  return NextResponse.redirect(
    `${origin}/login?error=Invalid+or+expired+reset+link`
  );
}
