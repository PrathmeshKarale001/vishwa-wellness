import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { markOrderPaid, markPaymentFailed } from '@/lib/orders';

/**
 * Razorpay Webhook Handler
 *
 * This endpoint receives webhook events from Razorpay to ensure orders are
 * updated even if the user closes their browser after payment.
 *
 * Supported events:
 * - payment.captured: Payment was successful
 * - payment.failed: Payment failed
 * - order.paid: Order has been fully paid
 *
 * Setup in Razorpay Dashboard:
 * 1. Go to Settings > Webhooks
 * 2. Add webhook URL: https://yourdomain.com/api/webhooks/razorpay
 * 3. Select events: payment.captured, payment.failed, order.paid
 * 4. Copy the webhook secret to RAZORPAY_WEBHOOK_SECRET env var
 */

interface RazorpayWebhookPayload {
    entity: string;
    account_id: string;
    event: string;
    contains: string[];
    payload: {
        payment?: {
            entity: {
                id: string;
                amount: number;
                currency: string;
                status: string;
                order_id: string;
                method: string;
                email: string;
                contact: string;
                notes: Record<string, string>;
                error_code?: string;
                error_description?: string;
                error_reason?: string;
            };
        };
        order?: {
            entity: {
                id: string;
                amount: number;
                amount_paid: number;
                amount_due: number;
                currency: string;
                status: string;
                notes: Record<string, string>;
            };
        };
    };
    created_at: number;
}

function verifyWebhookSignature(
    body: string,
    signature: string,
    secret: string
): boolean {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');

    const received = Buffer.from(signature, 'utf8');
    const expected = Buffer.from(expectedSignature, 'utf8');

    // timingSafeEqual throws if the lengths differ, so check that first.
    if (received.length !== expected.length) {
        return false;
    }

    return crypto.timingSafeEqual(received, expected);
}

export async function POST(request: NextRequest) {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('[webhook] RAZORPAY_WEBHOOK_SECRET not configured');
            return NextResponse.json(
                { error: 'Webhook not configured' },
                { status: 500 }
            );
        }

        // Get raw body for signature verification
        const body = await request.text();
        const signature = request.headers.get('x-razorpay-signature');

        if (!signature) {
            console.error('[webhook] Missing signature header');
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 400 }
            );
        }

        // Verify webhook signature
        const isValid = verifyWebhookSignature(body, signature, webhookSecret);

        if (!isValid) {
            console.error('[webhook] Invalid signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        // Parse the webhook payload
        const payload: RazorpayWebhookPayload = JSON.parse(body);
        const event = payload.event;

        console.log(`[webhook] Received event: ${event}`);

        // Handle different event types
        switch (event) {
            case 'payment.captured':
                await handlePaymentCaptured(payload);
                break;

            case 'payment.failed':
                await handlePaymentFailed(payload);
                break;

            case 'order.paid':
                await handleOrderPaid(payload);
                break;

            default:
                console.log(`[webhook] Unhandled event type: ${event}`);
        }

        // Always return 200 to acknowledge receipt
        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('[webhook] Error processing webhook:', error);
        // Return 200 to prevent Razorpay from retrying (we've logged the error)
        return NextResponse.json({ received: true, error: 'Processing error' });
    }
}

async function handlePaymentCaptured(payload: RazorpayWebhookPayload) {
    const payment = payload.payload.payment?.entity;

    if (!payment) {
        console.error('[webhook] Missing payment entity in payload');
        return;
    }

    const razorpayOrderId = payment.order_id;
    const razorpayPaymentId = payment.id;

    console.log(`[webhook] Payment captured: ${razorpayPaymentId} for order ${razorpayOrderId}`);

    const supabase = createAdminSupabaseClient();

    // Find order by razorpay_order_id. This is written before checkout opens,
    // so it is always present for a genuine payment.
    const { data: order, error: findError } = await supabase
        .from('orders')
        .select('id, order_number, total, payment_status')
        .eq('razorpay_order_id', razorpayOrderId)
        .single();

    if (findError || !order) {
        console.error(`[webhook] Order not found for razorpay_order_id: ${razorpayOrderId}`);
        return;
    }

    // Skip if already paid (idempotency)
    if (order.payment_status === 'paid') {
        console.log(`[webhook] Order ${order.order_number} already marked as paid, skipping`);
        return;
    }

    // The captured amount must match the order's server-validated total.
    const expectedAmount = Math.round(order.total * 100);
    if (Number(payment.amount) !== expectedAmount) {
        console.error(
            `[webhook] Amount mismatch for ${order.order_number}: ` +
            `expected=${expectedAmount}, paid=${payment.amount}. Not settling.`
        );
        return;
    }

    const updated = await markOrderPaid(order.id, {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
    });

    if (!updated) {
        console.error(`[webhook] Failed to update order ${order.order_number}`);
        return;
    }

    console.log(`[webhook] Order ${order.order_number} marked as paid`);
}

async function handlePaymentFailed(payload: RazorpayWebhookPayload) {
    const payment = payload.payload.payment?.entity;

    if (!payment) {
        console.error('[webhook] Missing payment entity in payload');
        return;
    }

    const razorpayOrderId = payment.order_id;
    const errorDescription = payment.error_description || 'Payment failed';

    console.log(`[webhook] Payment failed for order ${razorpayOrderId}: ${errorDescription}`);

    const supabase = createAdminSupabaseClient();

    // Find order by razorpay_order_id
    const { data: order, error: findError } = await supabase
        .from('orders')
        .select('id, order_number, payment_status')
        .eq('razorpay_order_id', razorpayOrderId)
        .single();

    if (findError || !order) {
        console.log(`[webhook] Order not found for razorpay_order_id: ${razorpayOrderId}`);
        return;
    }

    // Skip if already processed
    if (order.payment_status !== 'pending') {
        console.log(`[webhook] Order ${order.order_number} already processed (status: ${order.payment_status}), skipping`);
        return;
    }

    const updated = await markPaymentFailed(order.id, errorDescription);

    if (!updated) {
        console.error(`[webhook] Failed to update order ${order.order_number}`);
        return;
    }

    console.log(`[webhook] Order ${order.order_number} marked as payment failed`);
}

async function handleOrderPaid(payload: RazorpayWebhookPayload) {
    const order = payload.payload.order?.entity;

    if (!order) {
        console.error('[webhook] Missing order entity in payload');
        return;
    }

    const razorpayOrderId = order.id;

    console.log(`[webhook] Order paid: ${razorpayOrderId}`);

    // This event is similar to payment.captured but for the order level
    // The payment.captured handler should have already updated the order
    // This is here for redundancy

    const supabase = createAdminSupabaseClient();

    const { data: dbOrder, error: findError } = await supabase
        .from('orders')
        .select('id, order_number, total, payment_status, razorpay_payment_id')
        .eq('razorpay_order_id', razorpayOrderId)
        .single();

    if (findError || !dbOrder) {
        console.log(`[webhook] Order not found for razorpay_order_id: ${razorpayOrderId}`);
        return;
    }

    if (dbOrder.payment_status === 'paid') {
        return;
    }

    // The amount Razorpay reports as paid must match the order total.
    const expectedAmount = Math.round(dbOrder.total * 100);
    if (Number(order.amount_paid) !== expectedAmount) {
        console.error(
            `[webhook] Amount mismatch for ${dbOrder.order_number}: ` +
            `expected=${expectedAmount}, paid=${order.amount_paid}. Not settling.`
        );
        return;
    }

    const updated = await markOrderPaid(dbOrder.id, {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: dbOrder.razorpay_payment_id,
    });

    if (!updated) {
        console.error(`[webhook] Failed to update order ${dbOrder.order_number}`);
        return;
    }

    console.log(`[webhook] Order ${dbOrder.order_number} marked as paid via order.paid event`);
}
