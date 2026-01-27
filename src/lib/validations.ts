import { z } from 'zod';

/**
 * Validation schemas for API routes using Zod
 * Provides type-safe validation for incoming requests
 */

// ========================================
// Shared Schemas
// ========================================

export const AddressSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    address: z.string().min(1, 'Address is required'),
    apartment: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'PIN code must be 6 digits'),
    country: z.string().default('India'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
});

export const OrderItemSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    productSlug: z.string().optional(),
    productTitle: z.string().min(1, 'Product title is required'),
    productImage: z.string().optional(), // Allow empty or relative paths
    quantity: z.number().int().positive('Quantity must be positive'),
    price: z.number().positive('Price must be positive'),
    comparePrice: z.number().optional(),
});

// ========================================
// Order Schemas
// ========================================

export const CreateOrderSchema = z.object({
    items: z.array(OrderItemSchema).min(1, 'Order must have at least one item'),
    customer_email: z.string().email('Valid email is required'),
    customer_name: z.string().optional(),
    customer_phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits').optional(),
    shipping_address: AddressSchema,
    billing_address: AddressSchema.optional(),
    subtotal: z.number().nonnegative('Subtotal must be non-negative'),
    shipping_cost: z.number().nonnegative('Shipping cost must be non-negative').default(0),
    discount: z.number().nonnegative('Discount must be non-negative').default(0),
    tax: z.number().nonnegative('Tax must be non-negative').default(0),
    total: z.number().positive('Total must be positive'),
    payment_method: z.enum(['razorpay', 'cod', 'upi']).default('razorpay'),
    coupon_code: z.string().optional(),
    notes: z.string().optional(),
});

export const UpdateOrderStatusSchema = z.object({
    status: z.enum([
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'returned',
        'refunded',
    ]),
    tracking_number: z.string().optional(),
    tracking_url: z.string().url().optional(),
    notes: z.string().optional(),
});

// ========================================
// Payment Schemas
// ========================================

export const CreatePaymentOrderSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().length(3).default('INR'),
    orderId: z.string().min(1, 'Order ID is required'),
    receipt: z.string().optional(),
    notes: z.record(z.string(), z.string()).optional(),
});

export const VerifyPaymentSchema = z.object({
    razorpay_order_id: z.string().min(1, 'Razorpay order ID is required'),
    razorpay_payment_id: z.string().min(1, 'Razorpay payment ID is required'),
    razorpay_signature: z.string().min(1, 'Razorpay signature is required'),
    orderId: z.string().min(1, 'Order ID is required'),
});

// ========================================
// Product Review Schemas
// ========================================

export const CreateReviewSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
    title: z.string().min(3, 'Title must be at least 3 characters').max(100),
    content: z.string().min(10, 'Review must be at least 10 characters').max(2000),
    pros: z.array(z.string()).optional(),
    cons: z.array(z.string()).optional(),
    images: z.array(z.string().url()).max(5, 'Maximum 5 images allowed').optional(),
    recommended: z.boolean().optional(),
});

export const UpdateReviewSchema = CreateReviewSchema.partial().omit({ productId: true });

// ========================================
// Coupon Schemas
// ========================================

export const ValidateCouponSchema = z.object({
    code: z.string().min(1, 'Coupon code is required').toUpperCase(),
    subtotal: z.number().positive('Subtotal must be positive'),
});

// ========================================
// Contact/Inquiry Schemas
// ========================================

export const ContactFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Valid email is required'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits').optional(),
    subject: z.string().min(3, 'Subject must be at least 3 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

// ========================================
// Utility Types from Schemas
// ========================================

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
export type CreatePaymentOrderInput = z.infer<typeof CreatePaymentOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
export type ContactFormInput = z.infer<typeof ContactFormSchema>;
export type ValidateCouponInput = z.infer<typeof ValidateCouponSchema>;

// ========================================
// Validation Helper
// ========================================

export function validateRequest<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; error: string; details?: z.ZodIssue[] } {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    // Format error message
    const errorMessage = result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ');

    return {
        success: false,
        error: errorMessage,
        details: result.error.issues,
    };
}
