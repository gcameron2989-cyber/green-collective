import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, category, listing_type, image_url, location, userId } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: 'Missing environment variables (SUPABASE_URL or SERVICE_ROLE_KEY)' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // Insert the listing with 'pending' status so it requires admin approval
    const { data, error } = await supabaseAdmin
      .from('marketplace_listings')
      .insert({
        title,
        description,
        price: parseFloat(price) || 0,
        category,
        listing_type,
        image_url,
        location,
        user_id: userId,
        status: 'pending', // <--- Key: held for admin review in your Master Admin Hub
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error creating marketplace listing:', error);
    return NextResponse.json({ error: error.message || 'Failed to create listing' }, { status: 500 });
  }
}
