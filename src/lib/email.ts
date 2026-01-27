import { Resend } from 'resend';
import { OrderConfirmationEmail } from '../../emails/OrderConfirmation';
import type { Order } from '@/types/orders';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailResult {
    success: boolean;
    emailId?: string;
    error?: string;
}

/**
 * Send order confirmation email to customer
 * @param order - The order object
 * @returns Promise with email sending result
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<EmailResult> {
    try {
        // Validate email configuration
        if (!process.env.RESEND_API_KEY) {
            console.error('[email] RESEND_API_KEY not configured');
            return {
                success: false,
                error: 'Email service not configured',
            };
        }

        // Parse shipping address from JSONB
        const shippingAddress = typeof order.shipping_address === 'string'
            ? JSON.parse(order.shipping_address)
            : order.shipping_address;

        // Get order items (assuming they're already loaded with the order)
        const items = order.items || [];

        // Send email
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Vishwa Wellness <onboarding@resend.dev>',
            to: order.customer_email,
            subject: `Order Confirmation - ${order.order_number}`,
            react: OrderConfirmationEmail({
                orderNumber: order.order_number,
                customerName: order.customer_name || shippingAddress.firstName + ' ' + shippingAddress.lastName,
                customerEmail: order.customer_email,
                items: items.map(item => ({
                    product_name: item.product_name,
                    product_image: item.product_image || undefined,
                    quantity: item.quantity,
                    unit_price: parseFloat(item.unit_price.toString()),
                    total_price: parseFloat(item.total_price.toString()),
                })),
                subtotal: parseFloat(order.subtotal.toString()),
                shippingCost: parseFloat(order.shipping_cost?.toString() || '0'),
                discount: parseFloat(order.discount_amount?.toString() || '0'),
                total: parseFloat(order.total.toString()),
                shippingAddress: {
                    firstName: shippingAddress.firstName,
                    lastName: shippingAddress.lastName,
                    address: shippingAddress.address,
                    apartment: shippingAddress.apartment,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    pincode: shippingAddress.pincode,
                    country: shippingAddress.country || 'India',
                    phone: shippingAddress.phone,
                },
                paymentStatus: order.payment_status,
            }),
        });

        if (error) {
            console.error('[email] Failed to send order confirmation:', error);
            return {
                success: false,
                error: error.message,
            };
        }

        console.log(`[email] Order confirmation sent successfully: ${data?.id}`);
        return {
            success: true,
            emailId: data?.id,
        };

    } catch (error) {
        console.error('[email] Unexpected error sending order confirmation:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
