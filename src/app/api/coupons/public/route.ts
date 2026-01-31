import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

/**
 * GET /api/coupons/public
 * Returns active, public-facing coupons for display on PDP/cart
 */
export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();

        // Fetch active coupons - using correct column names from DB schema
        const { data: coupons, error } = await supabase
            .from('coupons')
            .select('id, code, description, discount_type, discount_value, min_order_amount, max_discount, valid_from, valid_until')
            .eq('is_active', true)
            .order('discount_value', { ascending: false })
            .limit(5);

        if (error) {
            console.error('Error fetching public coupons:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch coupons' },
                { status: 500 }
            );
        }

        // Filter coupons that are currently valid (date-wise)
        const now = new Date();
        const validCoupons = (coupons || []).filter(coupon => {
            if (coupon.valid_from && new Date(coupon.valid_from) > now) {
                return false;
            }
            if (coupon.valid_until && new Date(coupon.valid_until) < now) {
                return false;
            }
            return true;
        }).slice(0, 3);

        // Transform to match frontend expectations
        const transformedCoupons = validCoupons.map(coupon => ({
            id: coupon.id,
            code: coupon.code,
            description: coupon.description || null,
            discount_type: coupon.discount_type,
            discount_value: Number(coupon.discount_value),
            min_order_value: coupon.min_order_amount ? Number(coupon.min_order_amount) : null,
            max_discount: coupon.max_discount ? Number(coupon.max_discount) : null,
        }));

        return NextResponse.json({
            success: true,
            coupons: transformedCoupons
        });

    } catch (error) {
        console.error('Error in public coupons API:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
