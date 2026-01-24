import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getAllOrders, getOrderStats } from '@/lib/orders';
import type { OrderStatus, PaymentStatus } from '@/types/orders';

// GET: Fetch all orders (admin only)
export async function GET(request: Request) {
    try {
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

        const isStaffOrAbove = roleData?.role === 'staff' ||
            roleData?.role === 'admin' ||
            roleData?.role === 'super_admin';

        if (!isStaffOrAbove) {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        const url = new URL(request.url);
        const status = url.searchParams.get('status') as OrderStatus | null;
        const paymentStatus = url.searchParams.get('paymentStatus') as PaymentStatus | null;
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const offset = parseInt(url.searchParams.get('offset') || '0');
        const includeStats = url.searchParams.get('stats') === 'true';

        const { orders, count } = await getAllOrders({
            status: status || undefined,
            paymentStatus: paymentStatus || undefined,
            limit,
            offset,
        });

        const response: any = { orders, count };

        if (includeStats) {
            response.stats = await getOrderStats();
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
