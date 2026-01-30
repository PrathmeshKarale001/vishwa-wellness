import { getRedisClient, isRedisAvailable } from './client';
import { CacheTTL } from './keys';

export interface CacheOptions {
    ttl?: number; // TTL in seconds
    forceRefresh?: boolean; // Bypass cache and fetch fresh data
}

/**
 * Get value from cache
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
    try {
        const client = getRedisClient();
        if (!client || !isRedisAvailable()) {
            return null;
        }

        const cached = await client.get(key);
        if (!cached) {
            return null;
        }

        return JSON.parse(cached) as T;
    } catch (error) {
        console.error('[Cache] Get error:', error);
        return null;
    }
}

/**
 * Set value in cache
 */
export async function cacheSet(
    key: string,
    value: any,
    ttl: number = CacheTTL.MEDIUM
): Promise<boolean> {
    try {
        const client = getRedisClient();
        if (!client || !isRedisAvailable()) {
            return false;
        }

        const serialized = JSON.stringify(value);
        await client.setex(key, ttl, serialized);
        return true;
    } catch (error) {
        console.error('[Cache] Set error:', error);
        return false;
    }
}

/**
 * Delete value from cache
 */
export async function cacheDel(key: string): Promise<boolean> {
    try {
        const client = getRedisClient();
        if (!client || !isRedisAvailable()) {
            return false;
        }

        await client.del(key);
        return true;
    } catch (error) {
        console.error('[Cache] Delete error:', error);
        return false;
    }
}

/**
 * Check if key exists in cache
 */
export async function cacheExists(key: string): Promise<boolean> {
    try {
        const client = getRedisClient();
        if (!client || !isRedisAvailable()) {
            return false;
        }

        const exists = await client.exists(key);
        return exists === 1;
    } catch (error) {
        console.error('[Cache] Exists error:', error);
        return false;
    }
}

/**
 * Delete keys matching pattern
 */
export async function cacheDelPattern(pattern: string): Promise<number> {
    try {
        const client = getRedisClient();
        if (!client || !isRedisAvailable()) {
            return 0;
        }

        const keys = await client.keys(pattern);
        if (keys.length === 0) {
            return 0;
        }

        await client.del(...keys);
        return keys.length;
    } catch (error) {
        console.error('[Cache] Delete pattern error:', error);
        return 0;
    }
}

/**
 * Flush all cache
 */
export async function cacheFlush(): Promise<boolean> {
    try {
        const client = getRedisClient();
        if (!client || !isRedisAvailable()) {
            return false;
        }

        await client.flushdb();
        return true;
    } catch (error) {
        console.error('[Cache] Flush error:', error);
        return false;
    }
}

/**
 * Cache wrapper with stale-while-revalidate pattern
 * Fetches from cache, returns stale data immediately, and revalidates in background
 */
export async function cacheGetOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
): Promise<T> {
    const { ttl = CacheTTL.MEDIUM, forceRefresh = false } = options;

    // If force refresh, skip cache
    if (forceRefresh) {
        const freshData = await fetcher();
        await cacheSet(key, freshData, ttl);
        return freshData;
    }

    // Try to get from cache
    const cached = await cacheGet<T>(key);
    if (cached !== null) {
        return cached;
    }

    // Cache miss - fetch fresh data
    const freshData = await fetcher();
    await cacheSet(key, freshData, ttl);
    return freshData;
}

/**
 * Stale-while-revalidate: Return cached data immediately and revalidate in background
 */
export async function cacheGetWithRevalidate<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = CacheTTL.MEDIUM
): Promise<T> {
    const cached = await cacheGet<T>(key);

    // If cache exists, return it immediately and revalidate in background
    if (cached !== null) {
        // Revalidate in background (fire and forget)
        fetcher()
            .then((freshData) => cacheSet(key, freshData, ttl))
            .catch((error) => console.error('[Cache] Background revalidation error:', error));

        return cached;
    }

    // Cache miss - fetch and cache
    const freshData = await fetcher();
    await cacheSet(key, freshData, ttl);
    return freshData;
}
