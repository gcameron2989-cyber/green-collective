import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: Request) {
  try {
    const { to, message } = await req.json()
    const resend = new Resend(process.env.RESEND_API_KEY)

    const data = await resend.emails.send({
      from: 'Green Collective <support@greencollective.ca>',
      to: [to],
      subject: 'Regarding your inquiry to Green Collective',
      text: message,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
