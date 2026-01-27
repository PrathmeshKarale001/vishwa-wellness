import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('wishlists')
            .select('product_id, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ items: data || [] });
    } catch (error) {
        console.error('Wishlist GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('wishlists')
            .insert({
                user_id: user.id,
                product_id: productId,
            })
            .select()
            .single();

        if (error) {
            // Check if already exists
            if (error.code === '23505') {
                return NextResponse.json({ message: 'Already in wishlist' }, { status: 200 });
            }
            throw error;
        }

        return NextResponse.json({ item: data });
    } catch (error) {
        console.error('Wishlist POST error:', error);
        return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId);

        if (error) throw error;

        return NextResponse.json({ message: 'Removed from wishlist' });
    } catch (error) {
        console.error('Wishlist DELETE error:', error);
        return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
    }
}
