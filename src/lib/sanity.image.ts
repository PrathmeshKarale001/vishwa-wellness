import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity';

// Define the image source type to match what's expected
type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>['image']>[0];

// Create the image URL builder instance
const builder = imageUrlBuilder(client);

/**
 * Generate optimized image URLs from Sanity images
 * @param source - Sanity image reference
 * @returns Image URL builder for chaining transformations
 * 
 * @example
 * // Basic usage
 * urlFor(product.image).width(400).url()
 * 
 * // With multiple transformations
 * urlFor(product.image).width(800).height(600).format('webp').quality(80).url()
 */
export function urlFor(source: SanityImageSource) {
    return builder.image(source);
}

/**
 * Get a responsive image URL with automatic format optimization
 * @param source - Sanity image reference
 * @param width - Desired width in pixels
 * @param height - Optional height (maintains aspect ratio if omitted)
 * @returns Optimized image URL string
 */
//Unexpected token '<', "<!DOCTYPE "... is not valid JSON
export function getOptimizedImageUrl(
    source: SanityImageSource,
    width: number,
    height?: number
): string {
    let imageBuilder = builder
        .image(source)
        .width(width)
        .format('webp')
        .quality(85)
        .auto('format');

    if (height) {
        imageBuilder = imageBuilder.height(height);
    }

    return imageBuilder.url();
}

/**
 * Generate srcSet for responsive images
 * @param source - Sanity image reference
 * @param widths - Array of widths for srcset
 * @returns srcSet string for use in <img> or next/image
 */
export function getSrcSet(
    source: SanityImageSource,
    widths: number[] = [320, 640, 960, 1280, 1600]
): string {
    return widths
        .map((w) => `${urlFor(source).width(w).format('webp').url()} ${w}w`)
        .join(', ');
}

/**
 * Get a blurred placeholder data URL for image loading
 * This creates a tiny 20px wide blurred version for blur-up effect
 */
export function getBlurDataUrl(source: SanityImageSource): string {
    return urlFor(source).width(20).blur(10).quality(30).url();
}
