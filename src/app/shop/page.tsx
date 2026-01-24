import { fetchProducts, fetchCategories } from '@/lib/sanity.fetch';
import { sanityProductsToFrontend } from '@/lib/sanity.utils';
import { Product } from '@/types';
import ShopPageClient from './ShopPageClient';



export default async function ShopPage() {
    // Fetch products and categories from Sanity
    const [sanityProducts, sanityCategories] = await Promise.all([
        fetchProducts(),
        fetchCategories()
    ]);

    // Convert to frontend format
    const products = sanityProductsToFrontend(sanityProducts);

    return <ShopPageClient products={products} categories={sanityCategories} />;
}
