// Order Types

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type UserRole = 'customer' | 'staff' | 'admin' | 'super_admin';

export interface Address {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_slug?: string;
    product_name: string;
    product_image?: string;
    product_sku?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    created_at: string;
}

export interface Order {
    id: string;
    order_number: string;
    user_id: string | null;
    status: OrderStatus;
    payment_status: PaymentStatus;

    // Razorpay
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;

    // Pricing
    subtotal: number;
    shipping_cost: number;
    tax_amount: number;
    discount_amount: number;
    total: number;

    // Customer
    customer_email: string;
    customer_phone?: string;
    customer_name?: string;

    // Addresses
    shipping_address: Address;
    billing_address?: Address;

    // Metadata
    notes?: string;
    admin_notes?: string;
    tracking_number?: string;
    tracking_url?: string;

    // Timestamps
    created_at: string;
    updated_at: string;
    paid_at?: string;
    shipped_at?: string;
    delivered_at?: string;

    // Relations
    items?: OrderItem[];
}

export interface CreateOrderInput {
    items: {
        product_id: string;
        product_slug?: string;
        product_name: string;
        product_image?: string;
        product_sku?: string;
        quantity: number;
        unit_price: number;
    }[];
    shipping_address: Address;
    billing_address?: Address;
    customer_email: string;
    customer_phone?: string;
    customer_name?: string;
    notes?: string;
    subtotal: number;
    shipping_cost?: number;
    tax_amount?: number;
    discount_amount?: number;
    total: number;
}

export interface UserRoleRecord {
    id: string;
    user_id: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

// Status display configuration
export const ORDER_STATUS_CONFIG: Record<OrderStatus, {
    label: string;
    color: string;
    bgColor: string;
}> = {
    pending: { label: 'Pending', color: '#92400e', bgColor: '#fef3c7' },
    confirmed: { label: 'Confirmed', color: '#166534', bgColor: '#dcfce7' },
    processing: { label: 'Processing', color: '#1e40af', bgColor: '#dbeafe' },
    shipped: { label: 'Shipped', color: '#7c3aed', bgColor: '#ede9fe' },
    delivered: { label: 'Delivered', color: '#166534', bgColor: '#dcfce7' },
    cancelled: { label: 'Cancelled', color: '#991b1b', bgColor: '#fee2e2' },
    refunded: { label: 'Refunded', color: '#6b7280', bgColor: '#f3f4f6' },
};

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, {
    label: string;
    color: string;
    bgColor: string;
}> = {
    pending: { label: 'Pending', color: '#92400e', bgColor: '#fef3c7' },
    paid: { label: 'Paid', color: '#166534', bgColor: '#dcfce7' },
    failed: { label: 'Failed', color: '#991b1b', bgColor: '#fee2e2' },
    refunded: { label: 'Refunded', color: '#6b7280', bgColor: '#f3f4f6' },
};
