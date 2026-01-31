'use server';

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export interface Coupon {
    id: string;
    code: string;
    description: string | null;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_value: number | null;
    max_discount: number | null;
    valid_from: string | null;
    valid_until: string | null;
    usage_limit: number | null;
    used_count: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Helper to check if user is staff or above
async function checkAdminAccess(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { authorized: false, error: 'Unauthorized', status: 401 };
    }

    const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    const isStaffOrAbove = roleData?.role === 'staff' ||
        roleData?.role === 'admin' ||
        roleData?.role === 'super_admin';

    if (!isStaffOrAbove) {
        return { authorized: false, error: 'Admin access required', status: 403 };
    }

    return { authorized: true, user, role: roleData?.role };
}

// GET: Fetch all coupons with optional filtering
export async function GET(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const authCheck = await checkAdminAccess(supabase);

        if (!authCheck.authorized) {
            return NextResponse.json(
                { error: authCheck.error },
                { status: authCheck.status }
            );
        }

        const url = new URL(request.url);
        const status = url.searchParams.get('status'); // 'active', 'inactive', 'all'
        const search = url.searchParams.get('search');
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = parseInt(url.searchParams.get('offset') || '0');

        let query = supabase
            .from('coupons')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // Filter by status
        if (status === 'active') {
            query = query.eq('is_active', true);
        } else if (status === 'inactive') {
            query = query.eq('is_active', false);
        }
        // 'all' or no status = no filter

        // Search by code or description
        if (search) {
            query = query.or(`code.ilike.%${search}%,description.ilike.%${search}%`);
        }

        const { data, count, error } = await query;

        if (error) {
            console.error('Error fetching coupons:', error);
            return NextResponse.json(
                { error: 'Failed to fetch coupons' },
                { status: 500 }
            );
        }

        // Calculate stats
        const { data: statsData } = await supabase
            .from('coupons')
            .select('is_active, used_count');

        const stats = {
            total: statsData?.length || 0,
            active: statsData?.filter(c => c.is_active).length || 0,
            inactive: statsData?.filter(c => !c.is_active).length || 0,
            totalUsage: statsData?.reduce((sum, c) => sum + (c.used_count || 0), 0) || 0,
        };

        return NextResponse.json({
            coupons: data as Coupon[],
            count,
            stats,
        });
    } catch (error) {
        console.error('Error in coupons API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST: Create a new coupon
export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const authCheck = await checkAdminAccess(supabase);

        if (!authCheck.authorized) {
            return NextResponse.json(
                { error: authCheck.error },
                { status: authCheck.status }
            );
        }

        const body = await request.json();

        // Validate required fields
        const { code, discount_type, discount_value } = body;

        if (!code || !discount_type || discount_value === undefined) {
            return NextResponse.json(
                { error: 'Code, discount_type, and discount_value are required' },
                { status: 400 }
            );
        }

        // Validate discount type
        if (!['percentage', 'fixed'].includes(discount_type)) {
            return NextResponse.json(
                { error: 'discount_type must be "percentage" or "fixed"' },
                { status: 400 }
            );
        }

        // Validate percentage range
        if (discount_type === 'percentage' && (discount_value < 0 || discount_value > 100)) {
            return NextResponse.json(
                { error: 'Percentage discount must be between 0 and 100' },
                { status: 400 }
            );
        }

        // Check if code already exists
        const { data: existing } = await supabase
            .from('coupons')
            .select('id')
            .eq('code', code.toUpperCase())
            .single();

        if (existing) {
            return NextResponse.json(
                { error: 'A coupon with this code already exists' },
                { status: 409 }
            );
        }

        // Create the coupon
        const couponData = {
            code: code.toUpperCase(),
            description: body.description || null,
            discount_type,
            discount_value,
            min_order_value: body.min_order_value || null,
            max_discount: body.max_discount || null,
            valid_from: body.valid_from || null,
            valid_until: body.valid_until || null,
            usage_limit: body.usage_limit || null,
            used_count: 0,
            is_active: body.is_active !== false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('coupons')
            .insert(couponData)
            .select()
            .single();

        if (error) {
            console.error('Error creating coupon:', error);
            return NextResponse.json(
                { error: 'Failed to create coupon' },
                { status: 500 }
            );
        }

        return NextResponse.json({ coupon: data }, { status: 201 });
    } catch (error) {
        console.error('Error in create coupon API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
