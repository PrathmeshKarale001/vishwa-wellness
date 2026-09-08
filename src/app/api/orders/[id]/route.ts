import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getOrderById, updateOrderStatus } from '@/lib/orders';
import type { OrderStatus } from '@/types/orders';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET: Fetch single order
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const order = await getOrderById(id);

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Check if user owns the order or is admin
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

        const isAdmin = roleData?.role === 'admin' || roleData?.role === 'super_admin';

        if (order.user_id !== user.id && !isAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { error: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

// PATCH: Update order (admin only)
//
// SECURITY: Payment state is NOT settable through this endpoint. An order only
// becomes `paid` via /api/payment/verify or the Razorpay webhook, both of which
// verify the payment with Razorpay first. Accepting `payment_status` from a
// request body here would let anyone mark their own order as paid.
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Get the order first
        const order = await getOrderById(id);
        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Only admins may mutate orders.
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

        const isAdmin = roleData?.role === 'admin' || roleData?.role === 'super_admin';

        if (!isAdmin) {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        // Reject any attempt to set payment state through this route.
        if (body.payment_status || body.razorpay_payment_id || body.razorpay_order_id || body.razorpay_signature || body.paid_at) {
            return NextResponse.json(
                {
                    error: 'Payment status cannot be set through this endpoint',
                    message: 'Payments are settled only after verification with Razorpay.',
                },
                { status: 400 }
            );
        }

        if (!body.status) {
            return NextResponse.json(
                { error: 'No supported fields to update' },
                { status: 400 }
            );
        }

        const updatedOrder = await updateOrderStatus(id, body.status as OrderStatus, {
            tracking_number: body.tracking_number,
            tracking_url: body.tracking_url,
            admin_notes: body.admin_notes,
        });

        if (!updatedOrder) {
            return NextResponse.json(
                { error: 'Failed to update order' },
                { status: 500 }
            );
        }

        return NextResponse.json({ order: updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        );
    }
}
