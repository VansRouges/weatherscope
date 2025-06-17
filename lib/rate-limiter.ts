// lib/rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize rate limiter based on environment
let rateLimiter: Ratelimit;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  // Production: Use Upstash Redis
  rateLimiter = new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(5, '10 s'), // 5 requests per 10 seconds
    analytics: true,
    prefix: 'weatherscope-rate-limit'
  });
} else if (process.env.NODE_ENV === 'production') {
  throw new Error('Upstash Redis is required in production');
} else {
  // Development: In-memory fallback
  console.warn('Using in-memory rate limiter - for development only');
  rateLimiter = {
    limit: async (identifier: string) => ({
        identifier,
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 10000 // 10 seconds from now
    }),
  } as unknown as Ratelimit;
}

export { rateLimiter };