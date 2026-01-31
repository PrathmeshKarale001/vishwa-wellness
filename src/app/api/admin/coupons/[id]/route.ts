'use server';

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

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

// GET: Fetch a single coupon by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createServerSupabaseClient();
        const authCheck = await checkAdminAccess(supabase);

        if (!authCheck.authorized) {
            return NextResponse.json(
                { error: authCheck.error },
                { status: authCheck.status }
            );
        }

        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { error: 'Coupon not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ coupon: data });
    } catch (error) {
        console.error('Error fetching coupon:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH: Update a coupon
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createServerSupabaseClient();
        const authCheck = await checkAdminAccess(supabase);

        if (!authCheck.authorized) {
            return NextResponse.json(
                { error: authCheck.error },
                { status: authCheck.status }
            );
        }

        const body = await request.json();

        // Check if coupon exists
        const { data: existing } = await supabase
            .from('coupons')
            .select('id, code')
            .eq('id', id)
            .single();

        if (!existing) {
            return NextResponse.json(
                { error: 'Coupon not found' },
                { status: 404 }
            );
        }

        // If code is being changed, check for duplicates
        if (body.code && body.code.toUpperCase() !== existing.code) {
            const { data: duplicate } = await supabase
                .from('coupons')
                .select('id')
                .eq('code', body.code.toUpperCase())
                .neq('id', id)
                .single();

            if (duplicate) {
                return NextResponse.json(
                    { error: 'A coupon with this code already exists' },
                    { status: 409 }
                );
            }
        }

        // Validate percentage range if updating
        if (body.discount_type === 'percentage' && body.discount_value !== undefined) {
            if (body.discount_value < 0 || body.discount_value > 100) {
                return NextResponse.json(
                    { error: 'Percentage discount must be between 0 and 100' },
                    { status: 400 }
                );
            }
        }

        // Build update object
        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        };

        const allowedFields = [
            'code', 'description', 'discount_type', 'discount_value',
            'min_order_value', 'max_discount', 'valid_from', 'valid_until',
            'usage_limit', 'is_active'
        ];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = field === 'code' ? body[field].toUpperCase() : body[field];
            }
        }

        const { data, error } = await supabase
            .from('coupons')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating coupon:', error);
            return NextResponse.json(
                { error: 'Failed to update coupon' },
                { status: 500 }
            );
        }

        return NextResponse.json({ coupon: data });
    } catch (error) {
        console.error('Error in update coupon API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE: Soft delete a coupon (set is_active = false)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createServerSupabaseClient();
        const authCheck = await checkAdminAccess(supabase);

        if (!authCheck.authorized) {
            return NextResponse.json(
                { error: authCheck.error },
                { status: authCheck.status }
            );
        }

        // Check if only admins can delete (not staff)
        if (authCheck.role === 'staff') {
            return NextResponse.json(
                { error: 'Only admins can delete coupons' },
                { status: 403 }
            );
        }

        // Soft delete by setting is_active = false
        const { error } = await supabase
            .from('coupons')
            .update({
                is_active: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) {
            console.error('Error deleting coupon:', error);
            return NextResponse.json(
                { error: 'Failed to delete coupon' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: 'Coupon deactivated' });
    } catch (error) {
        console.error('Error in delete coupon API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
