// Product Types
export interface ProductImage {
    id: string;
    src: string;
    alt: string;
}

export interface ProductVariant {
    id: string;
    size?: string;
    color?: string;
    price: number;
    stock: number;
}

export interface Product {
    id: string;
    slug: string;
    title: string;
    description: string;
    shortDescription?: string;
    price: number;
    comparePrice?: number;
    discount?: number;
    category: string;
    subcategory?: string;
    tags: string[];
    images: ProductImage[];
    variants?: ProductVariant[];
    isNew?: boolean;
    isSale?: boolean;
    isFeatured?: boolean;
    stock: number;
    rating?: number;
    reviewCount?: number;
    benefits?: string[];
    ingredients?: string[];
    howToUse?: string;
    ritualType?: 'snan' | 'lepam' | 'pana' | 'home';
}

// Retreat Types
export interface Retreat {
    id: string;
    slug: string;
    title: string;
    duration: string;
    price: number;
    description: string;
    highlights: string[];
    includes: string[];
    image: string;
    tier: 'essential' | 'immersive' | 'transformative';
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
    id: string;
    slug: string;
    name: string;
    sanskritName: string;
    subtitle: string;
    description: string;
    benefits: string[];
    steps: string[];
    frequency: string;
    duration: string;
    products: Product[];
    image: string;
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
