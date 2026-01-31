import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { validateRequest, ValidateCouponSchema } from '@/lib/validations';

/**
 * POST /api/coupons/validate
 * Validates a coupon code and returns discount info
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validation = validateRequest(ValidateCouponSchema, body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: validation.error },
                { status: 400 }
            );
        }

        const { code, subtotal } = validation.data;
        const supabase = await createServerSupabaseClient();

        // Fetch the coupon
        const { data: coupon, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', code)
            .eq('is_active', true)
            .single();

        if (error || !coupon) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired coupon code' },
                { status: 400 }
            );
        }

        // Check validity dates
        const now = new Date();

        if (coupon.valid_from && new Date(coupon.valid_from) > now) {
            return NextResponse.json(
                { success: false, error: 'This coupon is not yet active' },
                { status: 400 }
            );
        }

        if (coupon.valid_until && new Date(coupon.valid_until) < now) {
            return NextResponse.json(
                { success: false, error: 'This coupon has expired' },
                { status: 400 }
            );
        }

        // Check usage limit
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return NextResponse.json(
                { success: false, error: 'This coupon has reached its usage limit' },
                { status: 400 }
            );
        }

        // Check minimum order value
        if (coupon.min_order_value && subtotal < coupon.min_order_value) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Minimum order value is ₹${coupon.min_order_value}`
                },
                { status: 400 }
            );
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discount_type === 'percentage') {
            discountAmount = Math.round((subtotal * coupon.discount_value) / 100);
        } else if (coupon.discount_type === 'fixed') {
            discountAmount = coupon.discount_value;
        }

        // Apply max discount cap if applicable
        if (coupon.max_discount && discountAmount > coupon.max_discount) {
            discountAmount = coupon.max_discount;
        }

        // Return coupon info
        return NextResponse.json({
            success: true,
            coupon: {
                id: coupon.id,
                code: coupon.code,
                description: coupon.description,
                discount_type: coupon.discount_type,
                discount_value: coupon.discount_value,
                discount_amount: discountAmount,
                max_discount: coupon.max_discount,
            }
        });

    } catch (error) {
        console.error('Error validating coupon:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to validate coupon' },
            { status: 500 }
        );
    }
}
