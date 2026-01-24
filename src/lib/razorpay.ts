import Razorpay from 'razorpay';

// Initialize Razorpay instance
const getRazorpayInstance = () => {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error('Razorpay credentials not configured');
    }

    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
};

export interface CreateOrderParams {
    amount: number; // Amount in rupees
    currency?: string;
    receipt?: string;
    notes?: Record<string, string>;
}

export interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes: Record<string, string>;
    created_at: number;
}

// Create a new order
export async function createOrder(params: CreateOrderParams): Promise<RazorpayOrder> {
    const razorpay = getRazorpayInstance();

    const options = {
        amount: params.amount * 100, // Convert to paise
        currency: params.currency || 'INR',
        receipt: params.receipt || `order_${Date.now()}`,
        notes: params.notes || {},
    };

    return await razorpay.orders.create(options) as RazorpayOrder;
}

// Verify payment signature
export function verifyPaymentSignature(params: {
    orderId: string;
    paymentId: string;
    signature: string;
}): boolean {
    const crypto = require('crypto');
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
        throw new Error('Razorpay key secret not configured');
    }

    const body = params.orderId + '|' + params.paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body.toString())
        .digest('hex');

    return expectedSignature === params.signature;
}

// Fetch order details
export async function fetchOrder(orderId: string): Promise<RazorpayOrder> {
    const razorpay = getRazorpayInstance();
    return await razorpay.orders.fetch(orderId) as RazorpayOrder;
}

// Fetch payment details
export async function fetchPayment(paymentId: string) {
    const razorpay = getRazorpayInstance();
    return await razorpay.payments.fetch(paymentId);
}
