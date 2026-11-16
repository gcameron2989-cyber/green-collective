import { NextResponse } from "next/server";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { toEmail, name, actionType } = await request.json();

    if (!toEmail || !actionType) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const result = await sendConfirmationEmail({ toEmail, name, actionType });

    if (!result.success) {
      throw new Error(result.error);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Confirmation route error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
