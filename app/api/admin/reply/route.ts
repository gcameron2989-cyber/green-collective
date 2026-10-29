import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { inquiryId } = await req.json()

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Mark the inquiry as replied in Supabase
    await supabaseAdmin
      .from('contact_inquiries')
      .update({ status: 'replied' })
      .eq('id', inquiryId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
