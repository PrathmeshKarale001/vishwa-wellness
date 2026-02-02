// Product Types
export interface ProductImage {
    _key?: string;
    id?: string;
    url?: string;  // From Sanity
    src?: string;  // Legacy/fallback
    alt?: string;
}

export interface ProductVariant {
    id: string;
    size?: string;
    color?: string;
    price: number;
    stock: number;
}

export interface Ingredient {
    name: string;
    scientificName?: string;
    sanskritName?: string;
    benefits?: string[];
    description?: string;
}

export interface InfoSection {
    title: string;
    layout: 'text' | 'benefits' | 'ingredients' | 'usage' | 'certifications';
    content?: string;
    listItems?: string[];
    ingredients?: Ingredient[];
}

export interface Product {
    id: string;
    slug: string;
    title: string;
    description: string;
    shortDescription?: string;
    benefitHeadline?: string;
    price: number;
    comparePrice?: number;
    discount?: number;
    category: string;
    categorySlug?: string;
    subcategory?: string;
    tags: string[];
    images: ProductImage[];
    variants?: ProductVariant[];
    isNew?: boolean;
    isSale?: boolean;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    stock: number;
    rating?: number;
    reviewCount?: number;
    benefits?: string[];
    ingredients?: string[];
    howToUse?: string;
    ritualType?: 'snan' | 'lepam' | 'pana' | 'home';
    sections?: InfoSection[]; // Rich structured content
    sku?: string;
}

// Retreat Types
export interface Retreat {
    _id: string;
    slug: string;
    title: string;
    subtitle?: string;
    duration: string;
    location?: string;
    price: number;
    description: string;
    features: string[]; // Replacing highlights/includes
    images: ProductImage[];
    tier?: 'essential' | 'immersive' | 'transformative';
}

// Recipe Types
export interface Recipe {
    id: string;
    slug: string;
    title: string;
    category: 'skin-beauty' | 'health-first-aid' | 'home-aura';
    difficulty: 'easy' | 'medium' | 'advanced';
    time: string;
    ingredients: string[];
    steps: string[];
    benefits: string[];
    image: string;
}

// Ritual Types
export interface Ritual {
    _id: string;
    slug: string;
    name: string;
    sanskritName?: string;
    subtitle?: string;
    description: string;
    benefits: string[];
    steps: {
        stepNumber: number;
        content: string;
    }[];
    frequency: string;
    temperature?: string;
    duration?: string; // Legacy/optional
    products: Array<{ _ref?: string; _id?: string; id?: string; title?: string; slug?: string }>; // Can be references or small product objects
    image: string;
    iconImage?: string;
}

// Cart Types
export interface CartItem {
    product: Product;
    quantity: number;
    variant?: ProductVariant;
}

export interface Cart {
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
}

// Filter Types
export interface FilterState {
    category: string | null;
    priceRange: { min: number; max: number };
    colors: string[];
    sizes: string[];
    sortBy: 'newest' | 'price-low' | 'price-high' | 'popular';
}
