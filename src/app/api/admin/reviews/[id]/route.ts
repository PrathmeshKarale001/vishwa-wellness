import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { ReviewStatus } from '@/types/reviews';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET: Fetch single review details
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

        const { data: review, error } = await supabase
            .from('reviews')
            .select(`
                *,
                profiles (
                    full_name,
                    avatar_url
                )
            `)
            .eq('id', id)
            .single();

        if (error || !review) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(review);
    } catch (error) {
        console.error('Error fetching review:', error);
        return NextResponse.json(
            { error: 'Failed to fetch review' },
            { status: 500 }
        );
    }
}

// PATCH: Update single review (approve/reject/flag)
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
        const { status, moderation_notes } = body as {
            status?: ReviewStatus;
            moderation_notes?: string;
        };

        const updateData: Record<string, unknown> = {
            moderated_by: user.id,
            moderated_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        if (status) {
            updateData.status = status;
            updateData.is_approved = status === 'approved';
        }

        if (moderation_notes !== undefined) {
            updateData.moderation_notes = moderation_notes;
        }

        const { data, error } = await supabase
            .from('reviews')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating review:', error);
            return NextResponse.json(
                { error: 'Failed to update review' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            review: data
        });
    } catch (error) {
        console.error('Error in update review:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE: Delete a review
export async function DELETE(request: Request, { params }: RouteParams) {
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

        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting review:', error);
            return NextResponse.json(
                { error: 'Failed to delete review' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error in delete review:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
