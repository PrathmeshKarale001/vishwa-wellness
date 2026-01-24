import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/razorpay';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, receipt, notes } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        // Check if Razorpay is configured
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return NextResponse.json(
                { error: 'Payment gateway not configured' },
                { status: 503 }
            );
        }

        const order = await createOrder({
            amount,
            receipt,
            notes,
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
