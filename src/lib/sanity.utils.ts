import type { Product as FrontendProduct } from '@/types';
import type { Product as SanityProduct } from './sanity.types';

/**
 * Converts a Sanity product to the frontend Product type
 */
export function sanityProductToFrontend(sanityProduct: SanityProduct): FrontendProduct {
    // Calculate discount if comparePrice exists
    const discount = sanityProduct.comparePrice
        ? Math.round(((sanityProduct.comparePrice - sanityProduct.price) / sanityProduct.comparePrice) * 100)
        : undefined;

    return {
        id: sanityProduct._id,
        slug: typeof sanityProduct.slug === 'string' ? sanityProduct.slug : sanityProduct.slug.current,
        title: sanityProduct.title,
        shortDescription: sanityProduct.benefitHeadline || sanityProduct.description?.substring(0, 150) || '',
        description: sanityProduct.description || '',
        price: sanityProduct.price,
        comparePrice: sanityProduct.comparePrice,
        discount,
        category: sanityProduct.category?.name || '',
        tags: sanityProduct.tags || [],
        images: sanityProduct.images?.map((img) => ({
            id: img._key,
            src: img.url || '',
            alt: img.alt || sanityProduct.title,
        })) || [],
        isNew: sanityProduct.isNew,
        isSale: sanityProduct.isSale,
        stock: sanityProduct.stock,
        rating: sanityProduct.rating,
        reviewCount: sanityProduct.reviewCount,
        ritualType: sanityProduct.ritualType,
    };
}

/**
 * Converts an array of Sanity products to frontend products
 */
export function sanityProductsToFrontend(sanityProducts: SanityProduct[]): FrontendProduct[] {
    return sanityProducts.map(sanityProductToFrontend);
}
