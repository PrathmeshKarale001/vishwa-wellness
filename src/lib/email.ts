import { Resend } from 'resend';
import { OrderConfirmationEmail } from '../../emails/OrderConfirmation';
import { SubscriptionConfirmationEmail } from '../../emails/SubscriptionConfirmation';
import type { Order } from '@/types/orders';

const CRM_EMAIL = 'CRM@VISHWAGLOBAL.COM';

// Lazy initialize Resend to avoid build errors when API key is missing
let resend: Resend | null = null;

function getResendClient(): Resend | null {
    if (!process.env.RESEND_API_KEY) {
        return null;
    }
    if (!resend) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

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
        // Get Resend client (will be null if API key not configured)
        const resendClient = getResendClient();

        if (!resendClient) {
            console.warn('[email] RESEND_API_KEY not configured - skipping email');
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
        const { data, error } = await resendClient.emails.send({
            from: process.env.RESEND_FROM_EMAIL || `Vishwa Wellness <${CRM_EMAIL}>`,
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

/**
 * Send order status change notification to CRM
 * Called when an admin updates an order's status (processing, shipped, delivered, etc.)
 */
export async function sendOrderStatusNotificationToCRM(order: Order): Promise<EmailResult> {
    try {
        const resendClient = getResendClient();

        if (!resendClient) {
            console.warn('[email] RESEND_API_KEY not configured - skipping CRM notification');
            return { success: false, error: 'Email service not configured' };
        }

        const statusLabels: Record<string, string> = {
            pending: 'Pending',
            confirmed: 'Confirmed',
            processing: 'Processing',
            shipped: 'Shipped',
            delivered: 'Delivered',
            cancelled: 'Cancelled',
            refunded: 'Refunded',
        };

        const paymentLabels: Record<string, string> = {
            pending: 'Pending',
            paid: 'Paid',
            failed: 'Failed',
            refunded: 'Refunded',
        };

        const statusLabel = statusLabels[order.status] || order.status;
        const paymentLabel = paymentLabels[order.payment_status] || order.payment_status;
        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        // Parse shipping address
        const shippingAddress = typeof order.shipping_address === 'string'
            ? JSON.parse(order.shipping_address)
            : order.shipping_address;

        const customerName = order.customer_name ||
            `${shippingAddress?.firstName || ''} ${shippingAddress?.lastName || ''}`.trim() ||
            'Guest';

        const { data, error } = await resendClient.emails.send({
            from: process.env.RESEND_FROM_EMAIL || `Vishwa Wellness <${CRM_EMAIL}>`,
            to: CRM_EMAIL,
            subject: `Order ${order.order_number} — Status: ${statusLabel}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #1a1a2e; padding: 24px 32px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 22px; margin: 0; letter-spacing: 2px;">VISHWA WELLNESS</h1>
                        <p style="color: #d4a574; font-size: 13px; margin: 8px 0 0; font-style: italic;">Order Status Update</p>
                    </div>
                    <div style="padding: 32px; background: #ffffff;">
                        <h2 style="color: #222; font-size: 20px; margin: 0 0 24px;">Order ${order.order_number}</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #777; width: 160px;">Order Status</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #222; font-weight: 600;">${statusLabel}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #777;">Payment Status</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #222; font-weight: 500;">${paymentLabel}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #777;">Customer</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #222;">${customerName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #777;">Email</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #222;"><a href="mailto:${order.customer_email}" style="color: #C73C2E;">${order.customer_email}</a></td>
                            </tr>
                            ${order.customer_phone ? `
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #777;">Phone</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #222;"><a href="tel:${order.customer_phone}" style="color: #C73C2E;">${order.customer_phone}</a></td>
                            </tr>` : ''}
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #777;">Order Total</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #C73C2E; font-weight: 700; font-size: 18px;">₹${parseFloat(order.total.toString()).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; color: #777;">Updated At</td>
                                <td style="padding: 12px 0; color: #222;">${timestamp}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="padding: 16px 32px; background: #f5f2f2; text-align: center;">
                        <p style="color: #999; font-size: 12px; margin: 0;">Vishwa Wellness — Order Management Notification</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('[email] Failed to send CRM notification:', error);
            return { success: false, error: error.message };
        }

        console.log(`[email] CRM notification sent for order ${order.order_number}: ${data?.id}`);
        return { success: true, emailId: data?.id };

    } catch (error) {
        console.error('[email] Unexpected error sending CRM notification:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Send newsletter subscription confirmation email to the subscriber
 * Also notifies CRM about the new subscriber
 */
export async function sendNewsletterConfirmationEmail(subscriberEmail: string): Promise<EmailResult> {
    try {
        const resendClient = getResendClient();

        if (!resendClient) {
            console.warn('[email] RESEND_API_KEY not configured - skipping subscription email');
            return { success: false, error: 'Email service not configured' };
        }

        // Send confirmation to subscriber
        const { data, error } = await resendClient.emails.send({
            from: process.env.RESEND_FROM_EMAIL || `Vishwa Wellness <${CRM_EMAIL}>`,
            to: subscriberEmail,
            subject: 'Welcome to Vishwa Wellness — Sacred Circle',
            react: SubscriptionConfirmationEmail({
                email: subscriberEmail,
            }),
        });

        if (error) {
            console.error('[email] Failed to send subscription confirmation:', error);
            return { success: false, error: error.message };
        }

        console.log(`[email] Subscription confirmation sent to ${subscriberEmail}: ${data?.id}`);

        // Also notify CRM about new subscriber (fire and forget)
        resendClient.emails.send({
            from: process.env.RESEND_FROM_EMAIL || `Vishwa Wellness <${CRM_EMAIL}>`,
            to: CRM_EMAIL,
            subject: `New Newsletter Subscriber — ${subscriberEmail}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #1a1a2e; padding: 24px 32px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 22px; margin: 0; letter-spacing: 2px;">VISHWA WELLNESS</h1>
                        <p style="color: #d4a574; font-size: 13px; margin: 8px 0 0; font-style: italic;">New Newsletter Subscriber</p>
                    </div>
                    <div style="padding: 32px; background: #ffffff;">
                        <p style="color: #222; font-size: 16px; margin: 0 0 16px;">A new user has subscribed to the newsletter:</p>
                        <p style="color: #C73C2E; font-size: 18px; font-weight: 600; margin: 0 0 8px;">
                            <a href="mailto:${subscriberEmail}" style="color: #C73C2E;">${subscriberEmail}</a>
                        </p>
                        <p style="color: #777; font-size: 14px; margin: 0;">
                            Subscribed on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </p>
                    </div>
                    <div style="padding: 16px 32px; background: #f5f2f2; text-align: center;">
                        <p style="color: #999; font-size: 12px; margin: 0;">Vishwa Wellness — Newsletter Notification</p>
                    </div>
                </div>
            `,
        }).catch((err) => {
            console.error('[email] Failed to notify CRM about new subscriber:', err);
        });

        return { success: true, emailId: data?.id };

    } catch (error) {
        console.error('[email] Unexpected error sending subscription confirmation:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

