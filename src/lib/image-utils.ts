import { ProductImage } from '@/types';

/**
 * Image Utilities for Vishwa Wellness
 * 
 * These utilities help with image handling across the site,
 * including automatic optimization via Sanity CDN or Next.js Image.
 */

/**
 * Get image URL from ProductImage object
 * Handles both Sanity format (url) and legacy format (src)
 */
export function getImageUrl(image: ProductImage | undefined): string {
    if (!image) return '/placeholder-product.jpg';
    return image.url || image.src || '/placeholder-product.jpg';
}

/**
 * Get image alt text from ProductImage object
 */
export function getImageAlt(image: ProductImage | undefined, fallback: string = 'Product image'): string {
    return image?.alt || fallback;
}

/**
 * Sanity CDN Image Optimization Parameters
 * Append these to any cdn.sanity.io URL for automatic optimization
 */
export interface SanityImageParams {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
    blur?: number;
}

/**
 * Optimize a Sanity CDN image URL with transformation parameters
 * Sanity CDN automatically handles compression, format conversion, and resizing
 * 
 * @example
 * // Original: https://cdn.sanity.io/images/project/dataset/image-hash.jpg
 * // Optimized: https://cdn.sanity.io/images/project/dataset/image-hash.jpg?w=800&q=80&fm=webp
 */
export function optimizeSanityUrl(
    url: string,
    params: SanityImageParams = {}
): string {
    if (!url || !url.includes('cdn.sanity.io')) {
        return url;
    }

    const {
        width,
        height,
        quality = 80,
        format = 'webp',
        fit,
        blur,
    } = params;

    const searchParams = new URLSearchParams();

    if (width) searchParams.set('w', width.toString());
    if (height) searchParams.set('h', height.toString());
    if (quality) searchParams.set('q', quality.toString());
    if (format) searchParams.set('fm', format);
    if (fit) searchParams.set('fit', fit);
    if (blur) searchParams.set('blur', blur.toString());

    // Auto-format for best browser support
    searchParams.set('auto', 'format');

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${searchParams.toString()}`;
}

/**
 * Get optimized image URL for product displays
 * Automatically applies reasonable defaults for product images
 */
export function getOptimizedProductImage(
    image: ProductImage | undefined,
    size: 'thumbnail' | 'card' | 'detail' | 'full' = 'card'
): string {
    const baseUrl = getImageUrl(image);

    const sizeParams: Record<string, SanityImageParams> = {
        thumbnail: { width: 96, quality: 75 },
        card: { width: 400, quality: 80 },
        detail: { width: 800, quality: 85 },
        full: { width: 1200, quality: 90 },
    };

    return optimizeSanityUrl(baseUrl, sizeParams[size]);
}

/**
 * Generate blur placeholder URL for a smoother loading experience
 */
export function getBlurPlaceholder(image: ProductImage | undefined): string {
    const baseUrl = getImageUrl(image);
    return optimizeSanityUrl(baseUrl, {
        width: 20,
        quality: 30,
        blur: 10,
    });
}

/**
 * Get responsive image sizes for Next.js Image component
 * Returns a sizes prop string for optimal loading
 */
export function getResponsiveSizes(
    type: 'product-card' | 'product-detail' | 'hero' | 'thumbnail' = 'product-card'
): string {
    const sizesMap: Record<string, string> = {
        thumbnail: '96px',
        'product-card': '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
        'product-detail': '(max-width: 768px) 100vw, 50vw',
        hero: '100vw',
    };
    return sizesMap[type];
}

/**
 * Image dimensions helpers for static images in /public
 * For large images (>5MB), consider using Sanity CDN or external image service
 */
export const RECOMMENDED_DIMENSIONS = {
    hero: { width: 1920, height: 800 },
    productCard: { width: 400, height: 400 },
    productDetail: { width: 800, height: 800 },
    thumbnail: { width: 96, height: 96 },
    banner: { width: 1200, height: 400 },
} as const;
