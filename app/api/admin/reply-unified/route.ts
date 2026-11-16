import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { to, message, itemId, itemType, subject, userName } = await req.json()

    const apiKey = process.env.RESEND_API_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!apiKey || !supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 })
    }

    const resend = new Resend(apiKey)
    const supabaseAdmin = createClient(supabaseUrl, serviceKey)

    const formattedMessage = (message || "").replace(/\n/g, "<br>")
    const emailSubject = subject ? `Regarding your Green Collective submission: ${subject}` : 'Regarding your Green Collective submission'

    // 1. Send the email via Resend from support@greencollective.ca
    const emailData = await resend.emails.send({
      from: 'Green Collective Support <support@greencollective.ca>',
      to: [to],
      subject: emailSubject,
      html: `
        <div style="font-family: sans-serif; color: #102f26; padding: 24px; max-width: 600px; background: #f9f8f6; border-radius: 12px;">
          <h2 style="color: #102f26; margin-top: 0;">Hi ${userName || "Eco-Champion"},</h2>
          <p style="line-height: 1.6; color: #334842;">
            ${formattedMessage}
          </p>
          <hr style="border: none; border-top: 1px solid #102f26/10; margin: 20px 0;" />
          <p style="font-size: 11px; color: #526760; margin-bottom: 0;">
            Green Collective Support Team<br>
            <a href="https://greencollective.ca" style="color: #39705d; text-decoration: none;">greencollective.ca</a>
          </p>
        </div>
      `,
    })

    // 2. Map itemType to the correct Supabase table and status update
    let tableName = 'contact_inquiries'
    let newStatus = 'replied'

    if (itemType === 'proposal') {
      tableName = 'proposed_actions'
      newStatus = 'approved'
    } else if (itemType === 'initiative') {
      tableName = 'proposed_initiatives'
      newStatus = 'approved'
    } else if (itemType === 'marketplace') {
      tableName = 'marketplace_listings'
      newStatus = 'approved'
    } else if (itemType === 'research') {
      tableName = 'research_posts' // <--- Updated to match your research table name
      newStatus = 'approved'
    }

    const { error: dbError } = await supabaseAdmin
      .from(tableName)
      .update({ status: newStatus })
      .eq('id', itemId)

    if (dbError) throw dbError

    return NextResponse.json({ success: true, emailData })
  } catch (error: any) {
    console.error('Error in unified reply route:', error)
    return NextResponse.json({ error: error.message || 'Failed to send response' }, { status: 500 })
  }
}
