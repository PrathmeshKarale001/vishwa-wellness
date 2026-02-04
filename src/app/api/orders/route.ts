import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createOrder, getOrders } from '@/lib/orders';
import { CreateOrderSchema, validateRequest } from '@/lib/validations';
import { client, isSanityConfigured } from '@/lib/sanity';
import type { CreateOrderInput, Address } from '@/types/orders';

// Price tolerance for floating point comparison (in rupees)
const PRICE_TOLERANCE = 1;

// Shipping thresholds
const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_COST = 99;

interface SanityProduct {
    _id: string;
    price: number;
    comparePrice?: number;
    stock?: number;
}

// Fetch product prices from Sanity for validation
async function fetchProductPrices(productIds: string[]): Promise<Map<string, SanityProduct>> {
    if (!isSanityConfigured() || productIds.length === 0) {
        return new Map();
    }

    const query = `*[_type == "product" && _id in $ids] {
        _id,
        price,
        "comparePrice": compareAtPrice,
        "stock": inventory
    }`;

    const products = await client.fetch<SanityProduct[]>(query, { ids: productIds });
    return new Map(products.map(p => [p._id, p]));
}

// Validate coupon server-side
async function validateCouponServerSide(
    supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
    couponCode: string,
    subtotal: number
): Promise<{ valid: boolean; discountAmount: number; error?: string }> {
    const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

    if (error || !coupon) {
        return { valid: false, discountAmount: 0, error: 'Invalid coupon code' };
    }

    // Check validity dates
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
        return { valid: false, discountAmount: 0, error: 'Coupon not yet active' };
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
        return { valid: false, discountAmount: 0, error: 'Coupon expired' };
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return { valid: false, discountAmount: 0, error: 'Coupon usage limit reached' };
    }

    // Check minimum order value
    if (coupon.min_order_value && subtotal < coupon.min_order_value) {
        return { valid: false, discountAmount: 0, error: `Minimum order value is ${coupon.min_order_value}` };
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
        discountAmount = Math.round((subtotal * coupon.discount_value) / 100);
    } else if (coupon.discount_type === 'fixed') {
        discountAmount = coupon.discount_value;
    }

    // Apply max discount cap
    if (coupon.max_discount && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount;
    }

    return { valid: true, discountAmount };
}

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
        // Start both operations in parallel - eliminates waterfall
        const supabasePromise = createServerSupabaseClient();
        const bodyPromise = request.json();

        const [supabase, body] = await Promise.all([supabasePromise, bodyPromise]);
        const { data: { user } } = await supabase.auth.getUser();

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

        // ==== SERVER-SIDE PRICE VALIDATION ====
        // Fetch actual product prices from Sanity to prevent price manipulation
        const productIds = validatedData.items.map(item => item.productId);
        const productPrices = await fetchProductPrices(productIds);

        // Calculate server-side subtotal based on actual prices
        let serverSubtotal = 0;
        const validatedItems: Array<{
            product_id: string;
            product_name: string;
            product_image?: string;
            quantity: number;
            unit_price: number;
        }> = [];

        for (const item of validatedData.items) {
            const product = productPrices.get(item.productId);

            if (!product) {
                // If we can't find the product in Sanity, log warning but continue
                // This handles edge cases where products might not be in CMS
                console.warn(`[order] Product ${item.productId} not found in Sanity, using client price`);
                serverSubtotal += item.price * item.quantity;
                validatedItems.push({
                    product_id: item.productId,
                    product_name: item.productTitle,
                    product_image: item.productImage,
                    quantity: item.quantity,
                    unit_price: item.price,
                });
                continue;
            }

            // Use the actual price from Sanity
            const actualPrice = product.price;

            // Check if client-provided price matches server price (with tolerance)
            if (Math.abs(item.price - actualPrice) > PRICE_TOLERANCE) {
                console.warn(`[order] Price mismatch for ${item.productId}: client=${item.price}, server=${actualPrice}`);
            }

            serverSubtotal += actualPrice * item.quantity;
            validatedItems.push({
                product_id: item.productId,
                product_name: item.productTitle,
                product_image: item.productImage,
                quantity: item.quantity,
                unit_price: actualPrice, // Use server-validated price
            });
        }

        // Calculate server-side shipping
        const serverShipping = serverSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;

        // Validate coupon and calculate server-side discount
        let serverDiscount = 0;
        if (validatedData.coupon_code) {
            const couponValidation = await validateCouponServerSide(
                supabase,
                validatedData.coupon_code,
                serverSubtotal
            );

            if (!couponValidation.valid) {
                return NextResponse.json(
                    { error: 'Invalid coupon', message: couponValidation.error },
                    { status: 400 }
                );
            }

            serverDiscount = couponValidation.discountAmount;
        }

        // Calculate server-side total
        const serverTotal = serverSubtotal + serverShipping - serverDiscount;

        // Check if client-provided total significantly differs from server calculation
        // Allow some tolerance for rounding differences
        if (Math.abs(validatedData.total - serverTotal) > PRICE_TOLERANCE) {
            console.error(`[order] Total mismatch: client=${validatedData.total}, server=${serverTotal}`);
            return NextResponse.json(
                {
                    error: 'Price validation failed',
                    message: 'Order total does not match calculated total. Please refresh and try again.',
                    details: {
                        clientTotal: validatedData.total,
                        serverTotal: serverTotal,
                    }
                },
                { status: 400 }
            );
        }

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

        // Use SERVER-VALIDATED prices and totals
        const orderInput: CreateOrderInput = {
            items: validatedItems,
            customer_email: validatedData.customer_email,
            customer_name: validatedData.customer_name,
            customer_phone: validatedData.customer_phone,
            shipping_address: shippingAddress,
            billing_address: billingAddress,
            subtotal: serverSubtotal, // Server-calculated
            shipping_cost: serverShipping, // Server-calculated
            tax_amount: 0, // Calculate if needed
            discount_amount: serverDiscount, // Server-calculated
            total: serverTotal, // Server-calculated
            notes: validatedData.notes,
        };

        const order = await createOrder(orderInput, user?.id);

        if (!order) {
            return NextResponse.json(
                { error: 'Failed to create order' },
                { status: 500 }
            );
        }

        // Increment coupon usage if a coupon was applied
        if (validatedData.coupon_code) {
            try {
                // Increment the used_count for the coupon
                await supabase.rpc('increment_coupon_usage', {
                    coupon_code_param: validatedData.coupon_code.toUpperCase()
                });
            } catch (couponError) {
                // Log but don't fail the order if coupon increment fails
                console.error('Failed to increment coupon usage:', couponError);
            }
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
