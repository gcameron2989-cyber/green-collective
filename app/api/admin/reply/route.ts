import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { to, message, inquiryId } = await req.json()

    const apiKey = process.env.RESEND_API_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!apiKey || !supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: 'Missing environment variables (RESEND_API_KEY, SUPABASE_URL, or SERVICE_ROLE_KEY)' },
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)
    const supabaseAdmin = createClient(supabaseUrl, serviceKey)

    // Send the email using your verified domain
    const emailData = await resend.emails.send({
      from: 'Green Collective <noreply@greencollective.ca>',
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
