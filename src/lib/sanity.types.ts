// Sanity CMS Content Types
export interface HeroSlide {
    _key: string;
    title: string;
    subtitle: string;
    image: {
        url: string;
        alt?: string;
    };
    mobileImage?: {
        url: string;
        alt?: string;
    };
    ctaText: string;
    ctaLink: string;
}

export interface Product {
    _id: string;
    _type: 'product';
    title: string; // Aliased from 'name'
    slug: {
        current: string;
    };
    description: string;
    benefitHeadline?: string;
    price: number;
    comparePrice?: number; // Aliased from 'compareAtPrice'
    discount?: number;
    category?: {
        name: string;
        slug: string;
    };
    tags?: string[];
    images: Array<{
        _key: string;
        url: string;
        alt?: string;
    }>;
    isNew?: boolean;
    isSale?: boolean; // Aliased from 'isOnSale'
    stock: number; // Aliased from 'inventory'
    rating?: number;
    reviewCount?: number;
    ritualType?: 'pana' | 'snan' | 'lepam' | 'home';
    sku?: string;
    variants?: Array<{
        _key: string;
        size: string;
        sku: string;
        price: number;
        inventory: number;
    }>;
    weight?: string;
    dimensions?: string;
    metaTitle?: string;
    metaDescription?: string;
}

export interface Post {
    _id: string;
    title: string;
    slug: string;
    author: {
        name: string;
        image: string;
    };
    mainImage: string;
    excerpt: string;
    publishedAt: string;
}

export interface Retreat {
    _id: string;
    _type: 'retreat';
    title: string;
    slug: {
        current: string;
    };
    subtitle: string;
    description: string;
    duration: string;
    location: string;
    price: number;
    images: Array<{
        _key: string;
        url: string;
        alt?: string;
    }>;
    features: string[];
}

export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    benefitHeadline?: string; // Added based on the instruction's implied change
    image?: string;
    subCategories?: string[];
    categorySegments?: Array<{
        subCategoryName: string;
        segments: string[];
    }>;
    productCount: number;
}

