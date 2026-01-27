import type { MetadataRoute } from 'next';
import { fetchProducts } from '@/lib/sanity.fetch';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vishwawellness.com';

    // Static pages
    const staticPages = [
        '',
        '/about',
        '/shop',
        '/why-ash',
        '/bhasma-rituals',
        '/diy-recipes',
        '/science-mysticism',
        '/ash-water',
        '/awt-retreats',
        '/contact',
        '/faq',
        '/privacy',
        '/shipping',
        '/returns',
    ];

    const staticRoutes = staticPages.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic product pages from Sanity
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
        const products = await fetchProducts();
        productRoutes = products.map((product) => {
            // Slug is already normalized to string by sanity.fetch
            const slugValue = product.slug || '';
            return {
                url: `${baseUrl}/products/${slugValue}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            };
        });
    } catch (error) {
        console.error('Error fetching products for sitemap:', error);
    }

    return [...staticRoutes, ...productRoutes];
}
