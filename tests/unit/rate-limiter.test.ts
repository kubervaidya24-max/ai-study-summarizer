import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/rate-limiter";

describe("RateLimiter", () => {
  it("should allow requests within limit", () => {
    const key = `test_ip_${Date.now()}`;
    const result1 = checkRateLimit(key, 3, 10000);
    expect(result1.allowed).toBe(true);
    expect(result1.remaining).toBe(2);

    const result2 = checkRateLimit(key, 3, 10000);
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(1);
  });

  it("should block requests when limit is exceeded", () => {
    const key = `test_ip_block_${Date.now()}`;
    checkRateLimit(key, 2, 10000);
    checkRateLimit(key, 2, 10000);

    const blocked = checkRateLimit(key, 2, 10000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetMs).toBeGreaterThan(0);
  });
});
