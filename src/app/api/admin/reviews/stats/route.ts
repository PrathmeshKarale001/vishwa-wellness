import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { ReviewStats } from '@/types/reviews';

// GET: Fetch review statistics for admin dashboard
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

        // Check if user is admin/staff
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

        // Get total reviews count
        const { count: totalReviews } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true });

        // Get pending count
        const { count: pendingCount } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        // Get approved count
        const { count: approvedCount } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'approved');

        // Get rejected count
        const { count: rejectedCount } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'rejected');

        // Get average rating (from approved reviews only)
        const { data: ratingData } = await supabase
            .from('reviews')
            .select('rating')
            .eq('status', 'approved');

        let averageRating = 0;
        if (ratingData && ratingData.length > 0) {
            const totalRating = ratingData.reduce((sum, r) => sum + r.rating, 0);
            averageRating = Math.round((totalRating / ratingData.length) * 10) / 10;
        }

        const stats: ReviewStats = {
            totalReviews: totalReviews || 0,
            pendingCount: pendingCount || 0,
            approvedCount: approvedCount || 0,
            rejectedCount: rejectedCount || 0,
            averageRating
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching review stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch review statistics' },
            { status: 500 }
        );
    }
}
