import { NextRequest, NextResponse } from 'next/server';
import { sanityFetch } from '@/lib/sanity.fetch';

interface CartItemInput {
    productId: string;
    variantId?: string;
    quantity: number;
}

interface SanityProduct {
    _id: string;
    price: number;
    stock?: number;
    inStock: boolean;
}

// POST: Validate cart items against current inventory
export async function POST(request: NextRequest) {
    try {
        const { items } = await request.json() as { items: CartItemInput[] };

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ valid: true, invalidItems: [] });
        }

        // Fetch current product data from Sanity
        const productIds = items.map((i) => i.productId);

        const products = await sanityFetch<SanityProduct[]>({
            query: `*[_type == "product" && _id in $ids]{
                _id,
                price,
                stock,
                inStock
            }`,
            params: { ids: productIds },
        });

        const productMap = new Map(products.map((p) => [p._id, p]));
        const invalidItems: string[] = [];
        const updatedItems: { productId: string; maxQuantity: number }[] = [];

        for (const item of items) {
            const product = productMap.get(item.productId);

            if (!product) {
                // Product no longer exists
                invalidItems.push(item.productId);
                continue;
            }

            if (product.inStock === false) {
                // Product out of stock
                invalidItems.push(item.productId);
                continue;
            }

            const maxStock = product.stock ?? 999;
            if (item.quantity > maxStock) {
                // Quantity exceeds stock - report max available
                updatedItems.push({
                    productId: item.productId,
                    maxQuantity: maxStock,
                });
            }
        }

        return NextResponse.json({
            valid: invalidItems.length === 0 && updatedItems.length === 0,
            invalidItems,
            updatedItems,
        });
    } catch (error) {
        console.error('Cart validation error:', error);
        return NextResponse.json({ valid: true, invalidItems: [], updatedItems: [] });
    }
}
