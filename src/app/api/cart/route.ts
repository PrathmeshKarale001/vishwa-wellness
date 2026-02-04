import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { sanityFetch } from '@/lib/sanity.fetch';

interface CartItemInput {
    productId: string;
    variantId?: string;
    quantity: number;
}

// GET: Load cart from database for logged-in user
export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('user_carts')
        .select('cart_data')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        return NextResponse.json({ error: 'Failed to load cart' }, { status: 500 });
    }

    return NextResponse.json({ items: data?.cart_data?.items ?? [] });
}

// POST: Save cart to database for logged-in user
export async function POST(request: NextRequest) {
    try {
        const { userId, items } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const supabase = await createServerSupabaseClient();

        // Upsert cart data
        const { error } = await supabase
            .from('user_carts')
            .upsert({
                user_id: userId,
                cart_data: { items },
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id',
            });

        if (error) {
            console.error('Failed to save cart:', error);
            return NextResponse.json({ error: 'Failed to save cart' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Cart save error:', error);
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

// DELETE: Clear cart for logged-in user
export async function DELETE(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
        .from('user_carts')
        .delete()
        .eq('user_id', userId);

    if (error) {
        return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
