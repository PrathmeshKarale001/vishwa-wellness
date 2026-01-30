/**
 * Centralized cache key management
 * Provides consistent namespacing and key generation
 */

const CACHE_PREFIX = 'vishwa';
const CACHE_VERSION = 'v1';

export const CacheKeys = {
    /**
     * Product cache keys
     */
    product: {
        all: () => `${CACHE_PREFIX}:${CACHE_VERSION}:products:all`,
        bySlug: (slug: string) => `${CACHE_PREFIX}:${CACHE_VERSION}:product:${slug}`,
        byCategory: (category: string) => `${CACHE_PREFIX}:${CACHE_VERSION}:products:category:${category}`,
        search: (query: string) => `${CACHE_PREFIX}:${CACHE_VERSION}:products:search:${encodeURIComponent(query)}`,
        featured: () => `${CACHE_PREFIX}:${CACHE_VERSION}:products:featured`,
    },

    /**
     * Sanity CMS content cache keys
     */
    sanity: {
        homepage: () => `${CACHE_PREFIX}:${CACHE_VERSION}:sanity:homepage`,
        navigation: () => `${CACHE_PREFIX}:${CACHE_VERSION}:sanity:navigation`,
        page: (slug: string) => `${CACHE_PREFIX}:${CACHE_VERSION}:sanity:page:${slug}`,
        settings: () => `${CACHE_PREFIX}:${CACHE_VERSION}:sanity:settings`,
    },

    /**
     * API response cache keys
     */
    api: {
        pincode: (pincode: string) => `${CACHE_PREFIX}:${CACHE_VERSION}:api:pincode:${pincode}`,
        availability: (productId: string) => `${CACHE_PREFIX}:${CACHE_VERSION}:api:availability:${productId}`,
    },

    /**
     * Session and user cache keys
     */
    user: {
        session: (userId: string) => `${CACHE_PREFIX}:${CACHE_VERSION}:user:session:${userId}`,
        preferences: (userId: string) => `${CACHE_PREFIX}:${CACHE_VERSION}:user:preferences:${userId}`,
    },
} as const;

/**
 * Cache TTL (Time To Live) in seconds
 */
export const CacheTTL = {
    SHORT: 5 * 60,        // 5 minutes
    MEDIUM: 30 * 60,      // 30 minutes
    LONG: 60 * 60,        // 1 hour
    EXTRA_LONG: 24 * 60 * 60, // 24 hours
} as const;

/**
 * Get cache pattern for bulk operations
 */
export function getCachePattern(pattern: string): string {
    return `${CACHE_PREFIX}:${CACHE_VERSION}:${pattern}*`;
}
