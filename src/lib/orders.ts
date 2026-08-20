import { createServerSupabaseClient } from './supabase-server';
import { createAdminSupabaseClient } from './supabase-admin';
import { sendOrderConfirmationEmail, sendNewOrderNotificationToCRM, sendOrderStatusNotificationToCRM } from './email';
import type { Order, OrderItem, CreateOrderInput, OrderStatus, PaymentStatus } from '@/types/orders';

// Create a new order (uses admin client to bypass RLS for guest checkout)
export async function createOrder(input: CreateOrderInput, userId?: string): Promise<Order | null> {
    // Use admin client to bypass RLS - allows guest orders
    const supabase = await createAdminSupabaseClient();

    // Create the order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: userId || null,
            status: 'pending' as OrderStatus,
            payment_status: 'pending' as PaymentStatus,
            subtotal: input.subtotal,
            shipping_cost: input.shipping_cost || 0,
            tax_amount: input.tax_amount || 0,
            discount_amount: input.discount_amount || 0,
            total: input.total,
            customer_email: input.customer_email,
            customer_phone: input.customer_phone,
            customer_name: input.customer_name,
            shipping_address: input.shipping_address,
            billing_address: input.billing_address || input.shipping_address,
            notes: input.notes,
        })
        .select()
        .single();

    if (orderError || !order) {
        console.error('Error creating order:', orderError);
        return null;
    }

    // Create order items
    const orderItems = input.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_slug: item.product_slug,
        product_name: item.product_name,
        product_image: item.product_image,
        product_sku: item.product_sku,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
    }));

    const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();

    if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Rollback order
        await supabase.from('orders').delete().eq('id', order.id);
        return null;
    }

    // Attach items to order for email
    const orderWithItems: Order = {
        ...order,
        items: items || [],
    };

    // Send order confirmation email to customer (don't block on this)
    sendOrderConfirmationEmail(orderWithItems)
        .then((result) => {
            if (result.success) {
                console.log(`[order] Confirmation email sent for order ${order.order_number}`);
            } else {
                console.warn(`[order] Failed to send confirmation email for ${order.order_number}:`, result.error);
            }
        })
        .catch((error) => {
            console.error(`[order] Unexpected error sending confirmation email:`, error);
        });

    // Send new order notification to CRM with full details (don't block on this)
    sendNewOrderNotificationToCRM(orderWithItems)
        .then((result) => {
            if (result.success) {
                console.log(`[order] CRM notification sent for new order ${order.order_number}`);
            } else {
                console.warn(`[order] Failed to send CRM notification for ${order.order_number}:`, result.error);
            }
        })
        .catch((error) => {
            console.error(`[order] Unexpected error sending CRM notification:`, error);
        });

    return orderWithItems;
}

// Get user's orders
export async function getOrders(userId: string): Promise<Order[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      items:order_items(*)
    `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }

    return data as Order[];
}

// Get single order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      items:order_items(*)
    `)
        .eq('id', orderId)
        .single();

    if (error) {
        console.error('Error fetching order:', error);
        return null;
    }

    return data as Order;
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      items:order_items(*)
    `)
        .eq('order_number', orderNumber)
        .single();

    if (error) {
        console.error('Error fetching order:', error);
        return null;
    }

    return data as Order;
}

// Update order status (admin)
export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    additionalData?: Partial<Order>
): Promise<Order | null> {
    const supabase = await createServerSupabaseClient();

    const updateData: Record<string, unknown> = { status, ...additionalData };

    // Set timestamps based on status
    if (status === 'shipped' && !additionalData?.shipped_at) {
        updateData.shipped_at = new Date().toISOString();
    }
    if (status === 'delivered' && !additionalData?.delivered_at) {
        updateData.delivered_at = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select(`
            *,
            items:order_items(*)
        `)
        .single();

    if (error) {
        console.error('Error updating order status:', error);
        return null;
    }

    const updatedOrder = data as Order;

    // Send CRM notification about status change (don't block on this)
    sendOrderStatusNotificationToCRM(updatedOrder)
        .then((result) => {
            if (result.success) {
                console.log(`[order] CRM notified about status change for ${updatedOrder.order_number}`);
            } else {
                console.warn(`[order] Failed to notify CRM about ${updatedOrder.order_number}:`, result.error);
            }
        })
        .catch((err) => {
            console.error(`[order] Unexpected error notifying CRM:`, err);
        });

    return updatedOrder;
}

// Update payment status
export async function updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    razorpayData?: {
        razorpay_order_id?: string;
        razorpay_payment_id?: string;
        razorpay_signature?: string;
    }
): Promise<Order | null> {
    const supabase = await createServerSupabaseClient();

    const updateData: Record<string, unknown> = {
        payment_status: paymentStatus,
        ...razorpayData
    };

    if (paymentStatus === 'paid') {
        updateData.paid_at = new Date().toISOString();
        updateData.status = 'confirmed';
    }

    const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select(`
            *,
            items:order_items(*)
        `)
        .single();

    if (error) {
        console.error('Error updating payment status:', error);
        return null;
    }

    const updatedOrder = data as Order;

    // Send CRM notification when payment is confirmed (don't block on this)
    if (paymentStatus === 'paid') {
        sendOrderStatusNotificationToCRM(updatedOrder)
            .then((result) => {
                if (result.success) {
                    console.log(`[order] CRM notified about payment for ${updatedOrder.order_number}`);
                } else {
                    console.warn(`[order] Failed to notify CRM about payment for ${updatedOrder.order_number}:`, result.error);
                }
            })
            .catch((err) => {
                console.error(`[order] Unexpected error notifying CRM about payment:`, err);
            });
    }

    return updatedOrder;
}

// Get all orders (admin)
export async function getAllOrders(filters?: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    limit?: number;
    offset?: number;
}): Promise<{ orders: Order[]; count: number }> {
    const supabase = await createServerSupabaseClient();

    let query = supabase
        .from('orders')
        .select(`
      *,
      items:order_items(*)
    `, { count: 'exact' });

    if (filters?.status) {
        query = query.eq('status', filters.status);
    }
    if (filters?.paymentStatus) {
        query = query.eq('payment_status', filters.paymentStatus);
    }

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) {
        query = query.limit(filters.limit);
    }
    if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching all orders:', error);
        return { orders: [], count: 0 };
    }

    return { orders: data as Order[], count: count || 0 };
}

// Get order statistics (admin)
export async function getOrderStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    todayOrders: number;
}> {
    const supabase = await createServerSupabaseClient();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalResult, revenueResult, pendingResult, todayResult] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total').eq('payment_status', 'paid'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    ]);

    const totalRevenue = (revenueResult.data || []).reduce(
        (sum, order) => sum + (order.total || 0), 0
    );

    return {
        totalOrders: totalResult.count || 0,
        totalRevenue,
        pendingOrders: pendingResult.count || 0,
        todayOrders: todayResult.count || 0,
    };
}
