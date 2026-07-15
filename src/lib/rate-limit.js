import { headers } from "next/headers";

// In-memory fallback for development (single-instance only)
const rateMap = new Map();

function getClientIp() {
  try {
    const h = headers();
    return (
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      "unknown"
    );
  } catch {
    return "unknown";
  }
}

let upstashRatelimit = null;

async function getUpstashRatelimit() {
  if (upstashRatelimit) return upstashRatelimit;

  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });

      upstashRatelimit = {
        rateLimit: async ({ key, max, windowMs }) => {
          const requests = max;
          const windowStr = String(windowMs) + " ms";
          const limiter = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(requests, windowStr),
            analytics: true,
          });
          const result = await limiter.limit(key);
          return { allowed: result.success };
        },
      };
      return upstashRatelimit;
    }
  } catch {
    // Upstash not configured or installed; fall back to in-memory
  }

  return null;
}

export async function rateLimit({ action, max = 5, windowMs = 60000, ip } = {}) {
  const clientIp = ip || getClientIp();
  const key = clientIp + ":" + action;

  // Try Upstash first (production-ready, multi-instance)
  const upstash = await getUpstashRatelimit();
  if (upstash) {
    return upstash.rateLimit({ key, max, windowMs });
  }

  // Fall back to in-memory (single-instance dev only)
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now - entry.start > windowMs) {
    rateMap.set(key, { count: 1, start: now });
    return { allowed: true };
  }

  if (entry.count >= max) {
    return { allowed: false };
  }

  entry.count++;
  return { allowed: true };
}

// Periodic cleanup for in-memory fallback
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateMap) {
      if (now - entry.start > 120000) rateMap.delete(key);
    }
  }, 60000);
}
