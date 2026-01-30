# Performance Optimizations

This document explains the performance optimizations implemented in the Vishwa Wellness e-commerce platform.

## Features Implemented

### 1. Redis Caching Layer ✅

A comprehensive caching system that significantly reduces API calls and improves response times.

#### Components
- `src/lib/redis/client.ts` - Redis connection management with graceful fallback
- `src/lib/redis/keys.ts` - Centralized cache key management
- `src/lib/redis/cache.ts` - Cache utility functions
- `src/lib/sanity.cache.ts` - Cached Sanity CMS queries

#### Features
- **Automatic Fallback**: Works without Redis configuration
- **TTL Management**: Different cache durations for different data types
- **Stale-While-Revalidate**: Returns cached data immediately, updates in background
- **Pattern-Based Invalidation**: Clear related cache entries easily

#### Cache Strategy

| Data Type | TTL | Cache Key Example |
|-----------|-----|-------------------|
| Products | 1 hour | `vishwa:v1:products:all` |
| Product Detail | 1 hour | `vishwa:v1:product:ash-based-cleanser` |
| Sanity Homepage | 30 min | `vishwa:v1:sanity:homepage` |
| API Responses | 5 min | `vishwa:v1:api:pincode:400001` |

#### Usage Example

```typescript
import { cachedSanityFetch } from '@/lib/sanity.cache';
import { CacheKeys, CacheTTL } from '@/lib/redis';
import { allProductsQuery } from '@/lib/sanity.queries';

// Fetch products with automatic caching
const products = await cachedSanityFetch(
    allProductsQuery,
    {},
    {
        cacheKey: CacheKeys.product.all(),
        ttl: CacheTTL.LONG, // 1 hour
    }
);
```

#### Enabling Redis

1. **Option 1: Upstash (Recommended for Production)**
   ```bash
   # Sign up at https://upstash.com (free tier available)
   # Create a Redis database
   # Copy the connection string
   ```
   ```env
   REDIS_URL=rediss://default:[password]@[host]:6379
   ```

2. **Option 2: Local Redis (Development)**
   ```bash
   # Install Redis locally
   # Windows: https://github.com/tporadowski/redis/releases
   # macOS: brew install redis
   # Linux: sudo apt-get install redis-server
   
   # Start Redis
   redis-server
   ```
   ```env
   REDIS_URL=redis://localhost:6379
   ```

### 2. Intelligent Route Prefetching ✅

Smart link prefetching that adapts to user behavior and device type.

#### Component
- `src/components/ui/optimized-link.tsx` - Custom Link component with prefetching

#### Features
- **Desktop**: Prefetch on hover
- **Mobile**: Prefetch when link enters viewport
- **Data Saver Respect**: Doesn't prefetch if user has data saver enabled
- **Priority Levels**: High-priority vs low-priority prefetching
- **Viewport Detection**: Uses IntersectionObserver API

#### Usage Example

```tsx
import OptimizedLink from '@/components/ui/optimized-link';

<OptimizedLink 
    href="/products/ash-based-cleanser"
    prefetchOnHover={true}      // Prefetch on hover (desktop)
    prefetchOnVisible={true}     // Prefetch on viewport (mobile)
    prefetchPriority="high"      // High priority prefetch
>
    View Product
</OptimizedLink>
```

#### Where It's Used
- `src/components/shop/ProductCard.tsx` - Product detail page links
- Can be used anywhere you want intelligent prefetching

## Performance Improvements

### Expected Results

#### Without Caching
- First product load: ~500-800ms
- Subsequent product loads: ~500-800ms each
- Homepage load: ~600-1000ms
- Total API calls: Every page load

#### With Redis Caching
- First product load: ~500-800ms (cache miss)
- Subsequent product loads: ~10-50ms (cache hit)
- Homepage load: ~100-300ms (cache hit)
- Total API calls: Reduced by 70-90%

#### With Route Prefetching
- Product detail navigation: Instant (prefetched)
- Time to Interactive: -200-500ms improvement
- Perceived performance: Significantly faster

## Testing Cache Performance

### Check if Redis is Connected

```typescript
import { isRedisAvailable } from '@/lib/redis';

if (isRedisAvailable()) {
    console.log('Redis is connected and ready');
} else {
    console.log('Redis not available (using fallback)');
}
```

### Monitor Cache Hits/Misses

Add logging to see cache performance:

```typescript
const data = await cacheGet('my-key');
if (data) {
    console.log('✅ Cache HIT for my-key');
} else {
    console.log('❌ Cache MISS for my-key');
}
```

### Invalidate Cache

```typescript
import { cacheDel, cacheDelPattern } from '@/lib/redis';

// Invalidate a single key
await cacheDel(CacheKeys.product.bySlug('my-product'));

// Invalidate all products
await cacheDelPattern('vishwa:v1:products:*');

// Invalidate all Sanity content
await cacheDelPattern('vishwa:v1:sanity:*');
```

## Best Practices

### 1. Cache Invalidation

Always invalidate cache when data changes:

```typescript
// After updating a product in Sanity
await invalidateSanityCache('products:*');

// After updating homepage content
await invalidateSanityCache('sanity:homepage');
```

### 2. TTL Selection

Choose appropriate TTL based on data freshness requirements:

```typescript
// Frequently changing data (stock, prices)
ttl: CacheTTL.SHORT  // 5 minutes

// Moderately changing data (content pages)
ttl: CacheTTL.MEDIUM  // 30 minutes

// Rarely changing data (products, categories)
ttl: CacheTTL.LONG  // 1 hour

// Very static data (site settings)
ttl: CacheTTL.EXTRA_LONG  // 24 hours
```

### 3. Prefetch Priority

Use high priority only for critical routes:

```tsx
// High priority: Main navigation, featured products
<OptimizedLink prefetchPriority="high" href="/shop">

// Low priority: Footer links, related products
<OptimizedLink prefetchPriority="low" href="/about">
```

## Troubleshooting

### Redis Connection Issues

If you see `[Redis] No REDIS_URL configured`:
- **This is normal** if Redis is not set up
- The app works fine without Redis
- To enable caching, add `REDIS_URL` to `.env.local`

If you see `[Redis] Connection error`:
- Check if Redis is running (local setup)
- Verify connection string (cloud setup)
- Check firewall/network settings

### Prefetching Not Working

Check browser console for:
- Network tab: Look for prefetch requests
- Data Saver: Prefetching disabled if enabled
- Browser support: IntersectionObserver API support

## Monitoring

### Recommended Tools

1. **Vercel Analytics** (for deployments on Vercel)
   - Real-time performance metrics
   - Core Web Vitals tracking

2. **Redis Insights** (for Redis monitoring)
   - Download: https://redis.io/insight/
   - Monitor cache hit rates
   - View memory usage

3. **Lighthouse** (for performance audits)
   ```bash
   npm run build
   npm run start
   # Open DevTools > Lighthouse tab
   ```

## Future Enhancements

### Potential Additions
- [ ] Service Worker for offline caching
- [ ] CDN edge caching (Vercel Edge)
- [ ] Database query optimization
- [ ] Image lazy loading optimization
- [ ] Bundle size optimization
- [ ] Code splitting for routes

## Credits

Built with:
- [ioredis](https://github.com/redis/ioredis) - Redis client
- [Next.js](https://nextjs.org) - React framework with built-in optimizations
- [Sanity](https://www.sanity.io) - Headless CMS
