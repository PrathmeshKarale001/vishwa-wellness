import { client } from './sanity';
import { cacheGetOrSet, CacheKeys, CacheTTL } from '@/lib/redis';
import type { QueryParams } from 'next-sanity';

/**
 * Cached Sanity fetch with automatic cache management
 * Falls back to direct fetch if Redis is unavailable
 */
export async function cachedSanityFetch<T>(
    query: string,
    params: QueryParams = {},
    options: {
        cacheKey?: string;
        ttl?: number;
        forceRefresh?: boolean;
    } = {}
): Promise<T> {
    const { cacheKey, ttl = CacheTTL.LONG, forceRefresh = false } = options;

    // If no cache key provided, fetch directly (no caching)
    if (!cacheKey) {
        return client.fetch<T>(query, params);
    }

    // Use cache-or-fetch pattern
    return cacheGetOrSet<T>(
        cacheKey,
        () => client.fetch<T>(query, params),
        { ttl, forceRefresh }
    );
}

/**
 * Invalidate cached Sanity data
 */
export async function invalidateSanityCache(pattern: string): Promise<void> {
    const { cacheDelPattern, getCachePattern } = await import('@/lib/redis');
    const fullPattern = getCachePattern(pattern);
    await cacheDelPattern(fullPattern);
}
