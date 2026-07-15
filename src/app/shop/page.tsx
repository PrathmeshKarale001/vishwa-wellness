import { fetchProducts, fetchCategories } from '@/lib/sanity.fetch';
import { sanityProductsToFrontend } from '@/lib/sanity.utils';
import ShopPageClient from './ShopPageClient';

interface ShopPageProps {
    searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    // Await searchParams as per Next.js 15 requirements
    const params = await searchParams;
    const initialCategory = params.category || 'all';

    // Fetch products and categories from Sanity
    const [sanityProducts, sanityCategories] = await Promise.all([
        fetchProducts(),
        fetchCategories()
    ]);

    // Convert to frontend format
    const products = sanityProductsToFrontend(sanityProducts);

    return (
        <ShopPageClient
            key={initialCategory}
            products={products}
            categories={sanityCategories}
            initialCategory={initialCategory}
        />
    );
}
