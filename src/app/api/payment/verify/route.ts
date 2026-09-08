import { NextResponse } from 'next/server';
import { verifyPaymentSignature, fetchPayment } from '@/lib/razorpay';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { markOrderPaid } from '@/lib/orders';
import { VerifyPaymentSchema, validateRequest } from '@/lib/validations';

/**
 * Verifies a Razorpay payment and marks the internal order as paid.
 *
 * This is the ONLY path by which an order becomes `paid` from a browser.
 * Every one of these must hold before the order is settled:
 *   1. The HMAC signature over `razorpay_order_id|razorpay_payment_id` is valid.
 *   2. Razorpay itself reports the payment as captured (or authorized).
 *   3. The payment belongs to the Razorpay order recorded on our order.
 *   4. The captured amount equals the order's server-validated total.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = validateRequest(VerifyPaymentSchema, body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Missing payment details', message: validation.error },
                { status: 400 }
            );
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
        } = validation.data;

        // 1. Verify the payment signature
        const isValid = verifyPaymentSignature({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
        });

        if (!isValid) {
            console.error(`[payment] Invalid signature for order ${orderId}`);
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // Load our own order record
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

        // Idempotency: the webhook may have settled this already.
        if (order.payment_status === 'paid') {
            return NextResponse.json({
                success: true,
                alreadyPaid: true,
                orderNumber: order.order_number,
            });
        }

        // 3. The payment must belong to the Razorpay order we created for it.
        if (order.razorpay_order_id !== razorpay_order_id) {
            console.error(
                `[payment] Razorpay order mismatch for ${order.order_number}: ` +
                `expected=${order.razorpay_order_id}, received=${razorpay_order_id}`
            );
            return NextResponse.json(
                { error: 'Payment does not belong to this order' },
                { status: 400 }
            );
        }

        // 2. Confirm with Razorpay that the money actually moved.
        const payment = await fetchPayment(razorpay_payment_id);

        if (payment.status !== 'captured' && payment.status !== 'authorized') {
            console.error(
                `[payment] Payment ${razorpay_payment_id} not captured (status: ${payment.status})`
            );
            return NextResponse.json(
                { error: 'Payment was not completed', status: payment.status },
                { status: 400 }
            );
        }

        if (payment.order_id !== razorpay_order_id) {
            console.error(
                `[payment] Payment ${razorpay_payment_id} belongs to a different Razorpay order`
            );
            return NextResponse.json(
                { error: 'Payment does not belong to this order' },
                { status: 400 }
            );
        }

        // 4. The amount paid must match the order total, in paise.
        const expectedAmount = Math.round(order.total * 100);
        const paidAmount = Number(payment.amount);

        if (paidAmount !== expectedAmount) {
            console.error(
                `[payment] Amount mismatch for ${order.order_number}: ` +
                `expected=${expectedAmount}, paid=${paidAmount}`
            );
            return NextResponse.json(
                { error: 'Paid amount does not match the order total' },
                { status: 400 }
            );
        }

        // All checks passed - settle the order.
        const updatedOrder = await markOrderPaid(order.id, {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        if (!updatedOrder) {
            // The money is captured but we failed to record it. The webhook is
            // the safety net here, so report failure without losing the payment.
            console.error(`[payment] Failed to mark order ${order.order_number} as paid`);
            return NextResponse.json(
                { error: 'Payment received but the order could not be updated. Our team has been notified.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            orderNumber: updatedOrder.order_number,
            payment: {
                id: payment.id,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                method: payment.method,
            },
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { error: 'Failed to verify payment' },
            { status: 500 }
        );
    }
}
