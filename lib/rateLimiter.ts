/**
 * Simple in-process rate limiter using a memory map.
 *
 * For production scaling, swap the in-memory map for Upstash Redis:
 *   import { Redis } from "@upstash/redis";
 *   const redis = Redis.fromEnv();
 *   // Replace map operations with redis.incr() and redis.expire()
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// In-memory store: key (userId+action) -> usage data
const store = new Map<string, RateLimitEntry>();

/**
 * Check rate limit for a specific user action.
 * @param userId - Unique user identifier.
 * @param action - Action name, e.g. "recommendations" | "roadmap".
 * @param maxRequests - Max allowed requests in the time window.
 * @param windowMs - Rolling window in milliseconds (default: 24h).
 * @returns { allowed: boolean, remaining: number, resetInMs: number }
 */
export function checkRateLimit(
  userId: string,
  action: string,
  maxRequests: number,
  windowMs: number = 24 * 60 * 60 * 1000
): { allowed: boolean; remaining: number; resetInMs: number } {
  const key = `${userId}:${action}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    // First request or window has expired — reset
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1, resetInMs: windowMs };
  }

  if (entry.count >= maxRequests) {
    const resetInMs = windowMs - (now - entry.windowStart);
    return { allowed: false, remaining: 0, resetInMs };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetInMs: windowMs - (now - entry.windowStart),
  };
}
