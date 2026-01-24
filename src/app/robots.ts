import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vishwawellness.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/account/',
                    '/cart',
                    '/checkout',
                    '/auth/',
                    '/api/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
