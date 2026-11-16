import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Server-side Supabase client for backend inserts
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Or your standard anon key if RLS allows public inserts
);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!email || !message) {
      return NextResponse.json({ success: false, error: "Email and message are required." }, { status: 400 });
    }

    // 1. Save inquiry to Supabase contact_inquiries table
    const { error: dbError } = await supabase.from("contact_inquiries").insert({
      name,
      email,
      subject: subject || "General Inquiry",
      message,
      status: "pending",
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }

    // 2. Send instant confirmation email to the user
    await resend.emails.send({
      from: "Green Collective Support <support@greencollective.ca>",
      to: [email],
      subject: "We received your message – Green Collective",
      html: `
        <div style="font-family: sans-serif; color: #102f26; padding: 24px; max-width: 600px; background: #f9f8f6; border-radius: 12px;">
          <h2 style="color: #102f26; margin-top: 0;">Thanks for reaching out, ${name || "Eco-Champion"}! 🌱</h2>
          <p style="line-height: 1.6; color: #334842;">
            We have received your message regarding <em>"${subject || "General Inquiry"}"</em> and our team will respond shortly via <strong>inquiries@greencollective.ca</strong> if follow-up is needed.
          </p>
          <p style="line-height: 1.6; color: #334842;">
            Thank you for connecting with the Green Collective platform.
          </p>
          <hr style="border: none; border-top: 1px solid #102f26/10; margin: 20px 0;" />
          <p style="font-size: 11px; color: #526760; margin-bottom: 0;">
            Green Collective Support Team<br>
            <a href="https://greencollective.ca" style="color: #39705d; text-decoration: none;">greencollective.ca</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
