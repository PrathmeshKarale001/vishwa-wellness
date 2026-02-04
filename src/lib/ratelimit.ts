/**
 * Rate Limiting Utility
 * 
 * Uses Upstash Redis for distributed rate limiting.
 * Falls back gracefully if Redis is not configured.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Rate limit configurations for different endpoints
export const rateLimitConfigs = {
    // Payment endpoints - strict limits
    payment: {
        requests: 5,
        window: '1 m' as const,
    },
    // Order endpoints - moderate limits
    order: {
        requests: 10,
        window: '1 m' as const,
    },
    // Coupon validation - prevent brute force
    coupon: {
        requests: 10,
        window: '1 m' as const,
    },
    // General API - relaxed limits
    api: {
        requests: 60,
        window: '1 m' as const,
    },
};

type RateLimitType = keyof typeof rateLimitConfigs;

let redis: Redis | null = null;
let rateLimiters: Map<RateLimitType, Ratelimit> = new Map();

function initRedis() {
    if (redis) return redis;

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        console.warn('[RateLimit] Upstash not configured, rate limiting disabled');
        return null;
    }

    try {
        redis = new Redis({ url, token });
        return redis;
    } catch (error) {
        console.error('[RateLimit] Failed to initialize Redis:', error);
        return null;
    }
}

function getRateLimiter(type: RateLimitType): Ratelimit | null {
    if (rateLimiters.has(type)) {
        return rateLimiters.get(type) || null;
    }

    const redisClient = initRedis();
    if (!redisClient) return null;

    const config = rateLimitConfigs[type];
    const limiter = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(config.requests, config.window),
        analytics: true,
        prefix: `vishwa:ratelimit:${type}`,
    });

    rateLimiters.set(type, limiter);
    return limiter;
}

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
}

/**
 * Check rate limit for an identifier (usually IP or user ID)
 */
export async function checkRateLimit(
    identifier: string,
    type: RateLimitType = 'api'
): Promise<RateLimitResult> {
    const limiter = getRateLimiter(type);

    if (!limiter) {
        // Rate limiting disabled - allow all
        return {
            success: true,
            limit: 9999,
            remaining: 9999,
            reset: Date.now() + 60000,
        };
    }

    try {
        const result = await limiter.limit(identifier);
        return {
            success: result.success,
            limit: result.limit,
            remaining: result.remaining,
            reset: result.reset,
        };
    } catch (error) {
        console.error('[RateLimit] Error checking rate limit:', error);
        // Fail open - allow request if rate limiting fails
        return {
            success: true,
            limit: 9999,
            remaining: 9999,
            reset: Date.now() + 60000,
        };
    }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    return {
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset),
    };
}
