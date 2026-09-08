import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createOrder } from '@/lib/razorpay';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/ratelimit';
import { CreatePaymentOrderSchema, validateRequest } from '@/lib/validations';

/**
 * Creates a Razorpay order for an existing internal order.
 *
 * The charge amount is derived from the internal order's server-validated
 * total. The client never supplies an amount, so it cannot be tampered with.
 *
 * The resulting razorpay_order_id is written back to the internal order
 * BEFORE checkout opens, so the webhook can always locate the order even if
 * the customer closes the browser mid-payment.
 */
export async function POST(request: Request) {
    try {
        // Rate limiting
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
            headersList.get('x-real-ip') ||
            'unknown';

        const rateLimit = await checkRateLimit(ip, 'payment');
        if (!rateLimit.success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429, headers: getRateLimitHeaders(rateLimit) }
            );
        }

        // Check if Razorpay is configured
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return NextResponse.json(
                { error: 'Payment gateway not configured' },
                { status: 503 }
            );
        }

        const body = await request.json();
        const validation = validateRequest(CreatePaymentOrderSchema, body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', message: validation.error },
                { status: 400 }
            );
        }

        const { orderId, currency } = validation.data;

        // Look up the internal order. Its `total` was already validated against
        // Sanity prices when the order was created.
        const supabase = createAdminSupabaseClient();
        const { data: order, error: findError } = await supabase
            .from('orders')
            .select('id, order_number, total, payment_status, razorpay_order_id')
            .eq('id', orderId)
            .single();

        if (findError || !order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Never re-charge an order that is already settled.
        if (order.payment_status === 'paid') {
            return NextResponse.json(
                { error: 'This order has already been paid' },
                { status: 409 }
            );
        }

        if (!order.total || order.total <= 0) {
            return NextResponse.json(
                { error: 'Order has an invalid total' },
                { status: 400 }
            );
        }

        const razorpayOrder = await createOrder({
            amount: order.total,
            currency,
            receipt: order.order_number,
            notes: {
                order_id: order.id,
                order_number: order.order_number,
            },
        });

        // Persist the Razorpay order id up front so the webhook can find this
        // order regardless of what the client does next.
        const { error: updateError } = await supabase
            .from('orders')
            .update({ razorpay_order_id: razorpayOrder.id })
            .eq('id', order.id);

        if (updateError) {
            console.error('[payment] Failed to persist razorpay_order_id:', updateError);
            return NextResponse.json(
                { error: 'Failed to initialise payment. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to create Razorpay order', message: errorMessage },
            { status: 500 }
        );
    }
}
