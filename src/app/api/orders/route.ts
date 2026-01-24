import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createOrder, getOrders } from '@/lib/orders';
import type { CreateOrderInput } from '@/types/orders';

// GET: Fetch user's orders
export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const orders = await getOrders(user.id);

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

// POST: Create a new order
export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        const body = await request.json() as CreateOrderInput;

        // Validate required fields
        if (!body.items || body.items.length === 0) {
            return NextResponse.json(
                { error: 'Order must have at least one item' },
                { status: 400 }
            );
        }

        if (!body.shipping_address) {
            return NextResponse.json(
                { error: 'Shipping address is required' },
                { status: 400 }
            );
        }

        if (!body.customer_email) {
            return NextResponse.json(
                { error: 'Customer email is required' },
                { status: 400 }
            );
        }

        const order = await createOrder(body, user?.id);

        if (!order) {
            return NextResponse.json(
                { error: 'Failed to create order' },
                { status: 500 }
            );
        }

        return NextResponse.json({ order }, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
