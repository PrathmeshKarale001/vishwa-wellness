import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts, fetchRelatedProducts } from '@/lib/sanity.fetch';
import { sanityProductToFrontend } from '@/lib/sanity.utils';
import type { Product as SanityProduct } from '@/lib/sanity.types';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');
        const exclude = searchParams.get('exclude') || '';
        const limit = parseInt(searchParams.get('limit') || '8');

        let sanityProducts: SanityProduct[] = [];

        // Try to get related products by category first
        if (category) {
            try {
                sanityProducts = await fetchRelatedProducts(category, exclude);
            } catch (err) {
                console.error('Category fetch failed:', err);
            }
        }

        // Fallback: fetch all products if category fetch returns nothing
        if (sanityProducts.length === 0) {
            try {
                const allProducts = await fetchProducts();
                // Filter out the current product by slug or id
                sanityProducts = allProducts.filter(p =>
                    p._id !== exclude && p.slug !== exclude
                );
            } catch (err) {
                console.error('All products fetch failed:', err);
            }
        }

        // Transform and limit products
        const products = sanityProducts
            .slice(0, limit)
            .map(sanityProductToFrontend);

        return NextResponse.json({
            success: true,
            products
        });

    } catch (error) {
        console.error('Error fetching related products:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch related products', products: [] },
            { status: 500 }
        );
    }
}
