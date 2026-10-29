import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { to, message, inquiryId } = await req.json()

    // Lazy initialization prevents Vercel build crashes
    const resend = new Resend(process.env.RESEND_API_KEY)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Send the email via Resend
    const data = await resend.emails.send({
      from: 'Green Collective <support@greencollective.ca>',
      to: [to],
      subject: 'Regarding your inquiry to Green Collective',
      text: message,
    })

    // 2. Mark the inquiry as replied in Supabase
    await supabaseAdmin
      .from('contact_inquiries')
      .update({ status: 'replied' })
      .eq('id', inquiryId)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error sending reply:', error)
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 })
  }
}
