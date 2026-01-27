import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createOrder, getOrders } from '@/lib/orders';
import { CreateOrderSchema, validateRequest } from '@/lib/validations';
import type { CreateOrderInput, Address } from '@/types/orders';

// GET: Fetch user's orders
export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const orders = await getOrders(user.id);

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

// POST: Create a new order
export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        const body = await request.json();

        // Validate request body using Zod
        const validation = validateRequest(CreateOrderSchema, body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    message: validation.error,
                    details: validation.details
                },
                { status: 400 }
            );
        }

        const validatedData = validation.data;

        // Transform validated Zod data to match CreateOrderInput type from types/orders.ts
        const shippingAddress: Address = {
            firstName: validatedData.shipping_address.firstName,
            lastName: validatedData.shipping_address.lastName,
            addressLine1: validatedData.shipping_address.address,
            addressLine2: validatedData.shipping_address.apartment,
            city: validatedData.shipping_address.city,
            state: validatedData.shipping_address.state,
            postalCode: validatedData.shipping_address.pincode,
            country: validatedData.shipping_address.country,
            phone: validatedData.shipping_address.phone,
        };

        const billingAddress: Address | undefined = validatedData.billing_address ? {
            firstName: validatedData.billing_address.firstName,
            lastName: validatedData.billing_address.lastName,
            addressLine1: validatedData.billing_address.address,
            addressLine2: validatedData.billing_address.apartment,
            city: validatedData.billing_address.city,
            state: validatedData.billing_address.state,
            postalCode: validatedData.billing_address.pincode,
            country: validatedData.billing_address.country,
            phone: validatedData.billing_address.phone,
        } : undefined;

        const orderInput: CreateOrderInput = {
            items: validatedData.items.map(item => ({
                product_id: item.productId,
                product_name: item.productTitle,
                product_image: item.productImage,
                quantity: item.quantity,
                unit_price: item.price,
            })),
            customer_email: validatedData.customer_email,
            customer_name: validatedData.customer_name,
            customer_phone: validatedData.customer_phone,
            shipping_address: shippingAddress,
            billing_address: billingAddress,
            subtotal: validatedData.subtotal,
            shipping_cost: validatedData.shipping_cost,
            tax_amount: validatedData.tax,
            discount_amount: validatedData.discount,
            total: validatedData.total,
            notes: validatedData.notes,
        };

        const order = await createOrder(orderInput, user?.id);

        if (!order) {
            return NextResponse.json(
                { error: 'Failed to create order' },
                { status: 500 }
            );
        }

        return NextResponse.json({ order }, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
