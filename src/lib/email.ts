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
 * Send new order notification email to CRM
 * Called when a new order is created, sends full product details + customer info
 */
export async function sendNewOrderNotificationToCRM(order: Order): Promise<EmailResult> {
    try {
        const resendClient = getResendClient();

        if (!resendClient) {
            console.warn('[email] RESEND_API_KEY not configured - skipping new order CRM notification');
            return { success: false, error: 'Email service not configured' };
        }

        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        // Parse shipping address
        const shippingAddress = typeof order.shipping_address === 'string'
            ? JSON.parse(order.shipping_address)
            : order.shipping_address;

        const customerName = order.customer_name ||
            `${shippingAddress?.firstName || ''} ${shippingAddress?.lastName || ''}`.trim() ||
            'Guest';

        const items = order.items || [];

        // Build product rows HTML
        const productRowsHtml = items.map((item, index) => `
            <tr style="background: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                <td style="padding: 12px 16px; border-bottom: 1px solid #eee; color: #222; font-weight: 500;">${item.product_name}</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #eee; color: #555; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #eee; color: #555; text-align: right;">₹${parseFloat(item.unit_price.toString()).toFixed(2)}</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #eee; color: #222; font-weight: 600; text-align: right;">₹${parseFloat(item.total_price.toString()).toFixed(2)}</td>
            </tr>
        `).join('');

        // Build full address string
        const addressParts = [
            shippingAddress?.address || shippingAddress?.addressLine1 || '',
            shippingAddress?.apartment || shippingAddress?.addressLine2 || '',
            shippingAddress?.city || '',
            shippingAddress?.state || '',
            shippingAddress?.pincode || shippingAddress?.postalCode || '',
            shippingAddress?.country || 'India',
        ].filter(Boolean);
        const fullAddress = addressParts.join(', ');

        const subtotal = parseFloat(order.subtotal.toString());
        const shippingCost = parseFloat(order.shipping_cost?.toString() || '0');
        const discount = parseFloat(order.discount_amount?.toString() || '0');
        const total = parseFloat(order.total.toString());

        const { data, error } = await resendClient.emails.send({
            from: process.env.RESEND_FROM_EMAIL || `Vishwa Wellness <${CRM_EMAIL}>`,
            to: CRM_EMAIL,
            subject: `🛒 New Order Received — ${order.order_number} | ₹${total.toFixed(2)} | ${customerName}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; background: #f5f2f2;">
                    <!-- Header -->
                    <div style="background: #1a1a2e; padding: 28px 32px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 22px; margin: 0; letter-spacing: 2px;">VISHWA WELLNESS</h1>
                        <p style="color: #d4a574; font-size: 13px; margin: 8px 0 0; font-style: italic;">New Order Received</p>
                    </div>

                    <div style="padding: 32px; background: #ffffff;">
                        <!-- Order Summary Banner -->
                        <div style="background: linear-gradient(135deg, #C73C2E 0%, #a83028 100%); border-radius: 10px; padding: 20px 24px; margin-bottom: 28px; color: #ffffff;">
                            <table style="width: 100%;">
                                <tr>
                                    <td>
                                        <p style="margin: 0; font-size: 13px; opacity: 0.85;">ORDER NUMBER</p>
                                        <p style="margin: 4px 0 0; font-size: 18px; font-weight: 700;">${order.order_number}</p>
                                    </td>
                                    <td style="text-align: right;">
                                        <p style="margin: 0; font-size: 13px; opacity: 0.85;">TOTAL</p>
                                        <p style="margin: 4px 0 0; font-size: 22px; font-weight: 700;">₹${total.toFixed(2)}</p>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <!-- Customer Details -->
                        <h2 style="color: #222; font-size: 16px; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #C73C2E; padding-bottom: 8px;">Customer Details</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #777; width: 140px;">Name</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-weight: 600;">${customerName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #777;">Email</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222;">
                                    <a href="mailto:${order.customer_email}" style="color: #C73C2E; text-decoration: none;">${order.customer_email}</a>
                                </td>
                            </tr>
                            ${order.customer_phone ? `
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #777;">Phone</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222;">
                                    <a href="tel:${order.customer_phone}" style="color: #C73C2E; text-decoration: none;">${order.customer_phone}</a>
                                </td>
                            </tr>` : ''}
                            ${(shippingAddress?.phone && shippingAddress.phone !== order.customer_phone) ? `
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #777;">Shipping Phone</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222;">
                                    <a href="tel:${shippingAddress.phone}" style="color: #C73C2E; text-decoration: none;">${shippingAddress.phone}</a>
                                </td>
                            </tr>` : ''}
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #777; vertical-align: top;">Shipping Address</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; line-height: 1.5;">
                                    ${shippingAddress?.firstName || ''} ${shippingAddress?.lastName || ''}<br>
                                    ${fullAddress}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #777;">Order Date</td>
                                <td style="padding: 10px 0; color: #222;">${timestamp}</td>
                            </tr>
                        </table>

                        <!-- Products Table -->
                        <h2 style="color: #222; font-size: 16px; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #C73C2E; padding-bottom: 8px;">Products Ordered</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <thead>
                                <tr style="background: #1a1a2e;">
                                    <th style="padding: 12px 16px; text-align: left; color: #ffffff; font-size: 13px; font-weight: 600;">Product</th>
                                    <th style="padding: 12px 16px; text-align: center; color: #ffffff; font-size: 13px; font-weight: 600;">Qty</th>
                                    <th style="padding: 12px 16px; text-align: right; color: #ffffff; font-size: 13px; font-weight: 600;">Unit Price</th>
                                    <th style="padding: 12px 16px; text-align: right; color: #ffffff; font-size: 13px; font-weight: 600;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productRowsHtml}
                            </tbody>
                        </table>

                        <!-- Price Summary -->
                        <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 6px 0; color: #555; font-size: 14px;">Subtotal</td>
                                    <td style="padding: 6px 0; color: #222; font-size: 14px; text-align: right;">₹${subtotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; color: #555; font-size: 14px;">Shipping</td>
                                    <td style="padding: 6px 0; color: #222; font-size: 14px; text-align: right;">₹${shippingCost.toFixed(2)}</td>
                                </tr>
                                ${discount > 0 ? `
                                <tr>
                                    <td style="padding: 6px 0; color: #27ae60; font-size: 14px;">Discount</td>
                                    <td style="padding: 6px 0; color: #27ae60; font-size: 14px; text-align: right;">-₹${discount.toFixed(2)}</td>
                                </tr>` : ''}
                                <tr>
                                    <td colspan="2" style="padding: 0;"><hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0;"></td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; color: #222; font-size: 18px; font-weight: 700;">Total</td>
                                    <td style="padding: 6px 0; color: #C73C2E; font-size: 18px; font-weight: 700; text-align: right;">₹${total.toFixed(2)}</td>
                                </tr>
                            </table>
                        </div>

                        <!-- Payment Status -->
                        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px 16px; text-align: center;">
                            <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">
                                Payment Status: <strong>${order.payment_status === 'paid' ? '✅ Paid' : '⏳ ' + (order.payment_status || 'Pending')}</strong>
                            </p>
                        </div>

                        ${order.notes ? `
                        <!-- Customer Notes -->
                        <div style="margin-top: 20px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 12px 16px;">
                            <p style="margin: 0 0 4px; color: #0369a1; font-size: 13px; font-weight: 600;">Customer Notes:</p>
                            <p style="margin: 0; color: #0c4a6e; font-size: 14px;">${order.notes}</p>
                        </div>` : ''}
                    </div>

                    <!-- Footer -->
                    <div style="padding: 16px 32px; text-align: center;">
                        <p style="color: #999; font-size: 12px; margin: 0;">Vishwa Wellness — New Order Notification</p>
                        <p style="color: #999; font-size: 11px; margin: 4px 0 0;">This is an automated email. Please process this order promptly.</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('[email] Failed to send new order CRM notification:', error);
            return { success: false, error: error.message };
        }

        console.log(`[email] New order CRM notification sent for ${order.order_number}: ${data?.id}`);
        return { success: true, emailId: data?.id };

    } catch (error) {
        console.error('[email] Unexpected error sending new order CRM notification:', error);
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

