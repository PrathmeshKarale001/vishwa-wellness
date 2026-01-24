import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getOrderById, updateOrderStatus, updatePaymentStatus } from '@/lib/orders';
import type { OrderStatus, PaymentStatus } from '@/types/orders';

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

        // Check if user is admin
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

        const body = await request.json();

        let updatedOrder;

        if (body.status) {
            updatedOrder = await updateOrderStatus(id, body.status as OrderStatus, {
                tracking_number: body.tracking_number,
                tracking_url: body.tracking_url,
                admin_notes: body.admin_notes,
            });
        } else if (body.payment_status) {
            updatedOrder = await updatePaymentStatus(id, body.payment_status as PaymentStatus, {
                razorpay_order_id: body.razorpay_order_id,
                razorpay_payment_id: body.razorpay_payment_id,
                razorpay_signature: body.razorpay_signature,
            });
        }

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
