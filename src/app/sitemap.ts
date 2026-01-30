import type { MetadataRoute } from 'next';
import { fetchProducts } from '@/lib/sanity.fetch';
import { client } from '@/lib/sanity';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vishwawellness.com';

    // Static pages with proper priorities and change frequencies
    const staticPages: { route: string; priority: number; changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' }[] = [
        { route: '', priority: 1.0, changeFrequency: 'daily' }, // Homepage
        { route: '/shop', priority: 0.9, changeFrequency: 'daily' },
        { route: '/bhasma-rituals', priority: 0.8, changeFrequency: 'weekly' },
        { route: '/awt-retreats', priority: 0.8, changeFrequency: 'weekly' },
        { route: '/retreats', priority: 0.8, changeFrequency: 'weekly' },
        { route: '/about', priority: 0.7, changeFrequency: 'monthly' },
        { route: '/science-mysticism', priority: 0.7, changeFrequency: 'monthly' },
        { route: '/why-ash', priority: 0.7, changeFrequency: 'monthly' },
        { route: '/ash-water', priority: 0.7, changeFrequency: 'monthly' },
        { route: '/diy-recipes', priority: 0.6, changeFrequency: 'monthly' },
        { route: '/contact', priority: 0.6, changeFrequency: 'monthly' },
        { route: '/faq', priority: 0.5, changeFrequency: 'monthly' },
        { route: '/privacy', priority: 0.4, changeFrequency: 'yearly' },
        { route: '/shipping', priority: 0.4, changeFrequency: 'monthly' },
        { route: '/returns', priority: 0.4, changeFrequency: 'monthly' },
    ];

    const staticRoutes = staticPages.map((page) => ({
        url: `${baseUrl}${page.route}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
    }));

    // Dynamic product pages from Sanity
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
        const products = await fetchProducts();
        productRoutes = products.map((product) => {
            const slugValue = product.slug || '';
            return {
                url: `${baseUrl}/products/${slugValue}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            };
        });
    } catch (error) {
        console.error('Error fetching products for sitemap:', error);
    }

    // Fetch categories for shop pages
    let categoryRoutes: MetadataRoute.Sitemap = [];
    try {
        const categories = await client.fetch(`
            *[_type == "category" && !(_id in path("drafts.**"))] {
                slug,
                _updatedAt
            }
        `);
        categoryRoutes = categories.map((category: any) => ({
            url: `${baseUrl}/shop/${category.slug.current}`,
            lastModified: new Date(category._updatedAt),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Error fetching categories for sitemap:', error);
    }

    return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
