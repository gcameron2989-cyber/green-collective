import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { to, message, inquiryId } = await req.json()

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY is missing in environment variables' }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Send the email using Resend's verified testing domain
    const emailData = await resend.emails.send({
      from: 'Green Collective <onboarding@resend.dev>',
      to: [to],
      subject: 'Regarding your inquiry to Green Collective',
      text: message,
    })

    // Update database status to 'replied'
    const { error: dbError } = await supabaseAdmin
      .from('contact_inquiries')
      .update({ status: 'replied' })
      .eq('id', inquiryId)

    if (dbError) throw dbError

    return NextResponse.json({ success: true, emailData })
  } catch (error: any) {
    console.error('Error in reply route:', error)
    return NextResponse.json({ error: error.message || 'Failed to send reply' }, { status: 500 })
  }
}
