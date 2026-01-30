import Redis from 'ioredis';

let redis: Redis | null = null;

/**
 * Get Redis client instance (singleton pattern)
 * Falls back gracefully if Redis is unavailable
 */
export function getRedisClient(): Redis | null {
    // If already initialized, return existing instance
    if (redis !== null) {
        return redis;
    }

    try {
        const redisUrl = process.env.REDIS_URL;

        // If no Redis URL configured, return null (graceful fallback)
        if (!redisUrl) {
            console.log('[Redis] No REDIS_URL configured, caching disabled');
            return null;
        }

        // Create Redis client
        redis = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            lazyConnect: true,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
        });

        // Handle connection events
        redis.on('connect', () => {
            console.log('[Redis] Connected successfully');
        });

        redis.on('error', (err) => {
            console.error('[Redis] Connection error:', err.message);
        });

        redis.on('close', () => {
            console.log('[Redis] Connection closed');
        });

        // Attempt to connect
        redis.connect().catch((err) => {
            console.error('[Redis] Failed to connect:', err.message);
            redis = null;
        });

        return redis;
    } catch (error) {
        console.error('[Redis] Initialization error:', error);
        redis = null;
        return null;
    }
}

/**
 * Check if Redis is available
 */
export function isRedisAvailable(): boolean {
    const client = getRedisClient();
    return client !== null && client.status === 'ready';
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
    if (redis) {
        await redis.quit();
        redis = null;
    }
}
