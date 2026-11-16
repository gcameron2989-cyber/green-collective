import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, abstract, description, category, author_name, user_id, document_url } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const { data, error } = await supabaseAdmin
      .from('research_submissions')
      .insert({
        title,
        abstract: abstract || description,
        category,
        author_name,
        user_id,
        document_url,
        status: 'pending', // <--- Held for admin review in your Master Admin Hub
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error creating research submission:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit research' }, { status: 500 });
  }
}
