import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server';
import type { ReviewStatus } from '@/types/reviews';

// GET: Fetch all reviews with filters (admin only)
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

        // Check if user is admin (with email fallback)
        const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

        // Admin emails fallback (when RLS blocks user_roles query)
        const adminEmails = ['eodonsocial@gmail.com', 'admin@vishwawellness.com'];
        const isAdminEmail = adminEmails.includes(user.email || '');

        const isStaffOrAbove = roleData?.role === 'staff' ||
            roleData?.role === 'admin' ||
            roleData?.role === 'super_admin' ||
            isAdminEmail;

        if (!isStaffOrAbove) {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        const url = new URL(request.url);
        const status = url.searchParams.get('status') as ReviewStatus | 'all' | null;
        const rating = url.searchParams.get('rating');
        const productId = url.searchParams.get('productId');
        const search = url.searchParams.get('search');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const offset = parseInt(url.searchParams.get('offset') || '0');

        // Use service role client to bypass RLS for admin operations
        const adminClient = createServiceRoleClient();

        let query = adminClient
            .from('reviews')
            .select('*', { count: 'exact' });

        // Apply filters
        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        if (rating) {
            query = query.eq('rating', parseInt(rating));
        }

        if (productId) {
            query = query.eq('product_id', productId);
        }

        if (search) {
            query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,user_name.ilike.%${search}%`);
        }

        // Order and paginate
        query = query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        const { data: reviews, error, count } = await query;

        if (error) {
            console.error('Error fetching reviews:', error);
            return NextResponse.json(
                { error: 'Failed to fetch reviews' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            reviews: reviews || [],
            count: count || 0,
            limit,
            offset
        });
    } catch (error) {
        console.error('Error in admin reviews API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH: Bulk update reviews (approve/reject multiple)
export async function PATCH(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user is admin (with email fallback)
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

        const adminEmails = ['eodonsocial@gmail.com', 'admin@vishwawellness.com'];
        const isAdminEmail = adminEmails.includes(user.email || '');

        const isAdmin = roleData?.role === 'admin' ||
            roleData?.role === 'super_admin' ||
            isAdminEmail;

        if (!isAdmin) {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { reviewIds, status, moderation_notes } = body as {
            reviewIds: string[];
            status: ReviewStatus;
            moderation_notes?: string;
        };

        if (!reviewIds || !Array.isArray(reviewIds) || reviewIds.length === 0) {
            return NextResponse.json(
                { error: 'Review IDs are required' },
                { status: 400 }
            );
        }

        if (!status || !['pending', 'approved', 'rejected', 'flagged'].includes(status)) {
            return NextResponse.json(
                { error: 'Valid status is required' },
                { status: 400 }
            );
        }

        const updateData: Record<string, unknown> = {
            status,
            is_approved: status === 'approved',
            moderated_by: user.id,
            moderated_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        if (moderation_notes) {
            updateData.moderation_notes = moderation_notes;
        }

        // Use service role client to bypass RLS
        const adminClient = createServiceRoleClient();

        const { data, error } = await adminClient
            .from('reviews')
            .update(updateData)
            .in('id', reviewIds)
            .select();

        if (error) {
            console.error('Error updating reviews:', error);
            return NextResponse.json(
                { error: 'Failed to update reviews' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            updated: data?.length || 0,
            message: `${data?.length || 0} review(s) updated to ${status}`
        });
    } catch (error) {
        console.error('Error in bulk update reviews:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
