import { client, isSanityConfigured } from './sanity';
import type { HeroSlide, Product, Retreat, Category } from './sanity.types';

// Fetch with Next.js caching
export async function sanityFetch<T>({
    query,
    params = {},
    tags = [],
}: {
    query: string;
    params?: Record<string, any>;
    tags?: string[];
}): Promise<T> {
    if (!isSanityConfigured()) {
        console.warn('Sanity is not configured. Returning empty data.');
        return [] as T;
    }

    try {
        return await client.fetch<T>(query, params, {
            next: {
                revalidate: 60, // Revalidate every 60 seconds
                tags,
            },
        });
    } catch (error) {
        console.error('Sanity fetch error:', error);
        throw error;
    }
}

// Convenience wrappers
export async function fetchHeroSlides(): Promise<HeroSlide[]> {
    const { heroSlidesQuery } = await import('./sanity.queries');
    if (!isSanityConfigured()) return [];

    try {
        return await sanityFetch<HeroSlide[]>({
            query: heroSlidesQuery,
            tags: ['hero'],
        });
    } catch {
        return [];
    }
}

export async function fetchProducts(): Promise<Product[]> {
    const { allProductsQuery } = await import('./sanity.queries');
    if (!isSanityConfigured()) return [];

    try {
        return await sanityFetch<Product[]>({
            query: allProductsQuery,
            tags: ['product'],
        });
    } catch (error) {
        console.error('Sanity fetchProducts error:', error);
        return [];
    }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
    const { productBySlugQuery } = await import('./sanity.queries');
    if (!isSanityConfigured()) return null;

    try {
        return await sanityFetch<Product>({
            query: productBySlugQuery(slug),
            tags: ['product', slug],
        });
    } catch {
        return null;
    }
}

export async function fetchRetreats(): Promise<Retreat[]> {
    const { retreatsQuery } = await import('./sanity.queries');
    if (!isSanityConfigured()) return [];

    try {
        return await sanityFetch<Retreat[]>({
            query: retreatsQuery,
            tags: ['retreat'],
        });
    } catch {
        return [];
    }
}

export async function fetchCategories(): Promise<Category[]> {
    const { allCategoriesQuery } = await import('./sanity.queries');
    if (!isSanityConfigured()) return [];

    try {
        return await sanityFetch<Category[]>({
            query: allCategoriesQuery,
            tags: ['category'],
        });
    } catch {
        return [];
    }
}

export async function fetchProductDetail(slug: string): Promise<any | null> {
    const { productDetailQuery } = await import('./sanity.queries');
    if (!isSanityConfigured()) return null;

    try {
        return await sanityFetch<any>({
            query: productDetailQuery(slug),
            tags: ['product', slug],
        });
    } catch {
        return null;
    }
}

export async function fetchRelatedProducts(categorySlug: string, excludeId: string): Promise<any[]> {
    const { relatedProductsQuery } = await import('./sanity.queries');
    if (!isSanityConfigured()) return [];

    try {
        const result = await sanityFetch<any[]>({
            query: relatedProductsQuery(categorySlug, excludeId),
            tags: ['product', 'related'],
        });
        return result || [];
    } catch {
        return [];
    }
}
