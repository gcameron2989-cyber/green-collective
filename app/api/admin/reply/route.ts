import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { toEmail, name, message } = await request.json();

    if (!toEmail || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'Green Collective Support <support@greencollective.ca>',
      to: [toEmail],
      subject: 'Re: Your inquiry to Green Collective',
      text: `Hi ${name},\n\n${message}\n\nBest regards,\nGreen Collective Support Team\nsupport@greencollective.ca`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resend reply error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
