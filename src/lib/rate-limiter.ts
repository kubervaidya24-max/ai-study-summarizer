interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      const valid = entry.timestamps.filter((t) => now - t < 600000); // 10 minutes
      if (valid.length === 0) {
        store.delete(key);
      } else {
        entry.timestamps = valid;
      }
    }
  }, 300000);
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

/**
 * In-memory sliding window rate limiter.
 * @param key Identifier (e.g., client IP or User ID)
 * @param limit Maximum allowed requests in the time window
 * @param windowMs Window duration in milliseconds (default: 60,000ms / 1 min)
 */
export function checkRateLimit(
  key: string,
  limit = 20,
  windowMs = 60000
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key) || { timestamps: [] };

  // Filter timestamps within the current window
  const windowStart = now - windowMs;
  const recentTimestamps = entry.timestamps.filter((t) => t > windowStart);

  if (recentTimestamps.length >= limit) {
    const oldest = recentTimestamps[0];
    const resetMs = Math.max(0, oldest + windowMs - now);
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetMs,
    };
  }

  // Record this request
  recentTimestamps.push(now);
  store.set(key, { timestamps: recentTimestamps });

  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - recentTimestamps.length),
    resetMs: windowMs,
  };
}
