import { logger } from "@/lib/logger";

type RateLimitConfig = { maxRequests: number; windowMs: number };
type RateLimitResult = { success: boolean; limitExceeded: boolean };

// ---------------------------------------------------------------------------
// In-memory store (single instance / dev)
// ---------------------------------------------------------------------------
const memStore = new Map<string, { count: number; expiresAt: number }>();

function memLimit(id: string, cfg: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const rec = memStore.get(id);
  if (!rec || rec.expiresAt < now) {
    memStore.set(id, { count: 1, expiresAt: now + cfg.windowMs });
    return { success: true, limitExceeded: false };
  }
  if (rec.count >= cfg.maxRequests) return { success: false, limitExceeded: true };
  rec.count++;
  return { success: true, limitExceeded: false };
}

function memRecordFailed(email: string): { locked: boolean } {
  const id = `lockout:${email.toLowerCase()}`;
  const now = Date.now();
  const rec = memStore.get(id);
  if (rec && rec.expiresAt > now) {
    if (rec.count >= 5) return { locked: true };
    rec.count++;
    if (rec.count >= 5) { rec.expiresAt = now + 15 * 60 * 1000; return { locked: true }; }
    return { locked: false };
  }
  memStore.set(id, { count: 1, expiresAt: now + 15 * 60 * 1000 });
  return { locked: false };
}

function memCheckLockout(email: string): boolean {
  const rec = memStore.get(`lockout:${email.toLowerCase()}`);
  return !!(rec && rec.expiresAt > Date.now() && rec.count >= 5);
}

// ---------------------------------------------------------------------------
// Redis store (multi-instance / production) — optional
// ---------------------------------------------------------------------------
let redis: import("@upstash/redis").Redis | null = null;

function getRedis() {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Redis } = require("@upstash/redis");
    redis = new Redis({ url, token });
    logger.info("Rate limiter: using Upstash Redis");
    return redis;
  } catch {
    logger.warn("Rate limiter: @upstash/redis not available, using in-memory");
    return null;
  }
}

async function redisLimit(
  r: NonNullable<typeof redis>,
  id: string,
  cfg: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `rl:${id}`;
  const count = await r.incr(key);
  if (count === 1) await r.pexpire(key, cfg.windowMs);
  if (count > cfg.maxRequests) return { success: false, limitExceeded: true };
  return { success: true, limitExceeded: false };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export const rateLimiter = {
  async limit(id: string, cfg: RateLimitConfig): Promise<RateLimitResult> {
    const r = getRedis();
    if (r) {
      try { return await redisLimit(r, id, cfg); }
      catch (err) {
        logger.error({ err }, "Redis rate limit error — falling back to memory");
      }
    }
    return memLimit(id, cfg);
  },

  async recordFailedLogin(email: string): Promise<{ locked: boolean }> {
    const r = getRedis();
    if (r) {
      try {
        const key = `lockout:${email.toLowerCase()}`;
        const count = await r.incr(key);
        if (count === 1) await r.pexpire(key, 15 * 60 * 1000);
        return { locked: count >= 5 };
      } catch (err) {
        logger.error({ err }, "Redis recordFailedLogin error — falling back to memory");
      }
    }
    return memRecordFailed(email);
  },

  async checkLockout(email: string): Promise<boolean> {
    const r = getRedis();
    if (r) {
      try {
        const count = await r.get<number>(`lockout:${email.toLowerCase()}`);
        return (count ?? 0) >= 5;
      } catch (err) {
        logger.error({ err }, "Redis checkLockout error — falling back to memory");
      }
    }
    return memCheckLockout(email);
  },

  async resetLoginLockout(email: string): Promise<void> {
    const r = getRedis();
    if (r) {
      try {
        await r.del(`lockout:${email.toLowerCase()}`);
        return;
      } catch (err) {
        logger.error({ err }, "Redis resetLoginLockout error — falling back to memory");
      }
    }
    memStore.delete(`lockout:${email.toLowerCase()}`);
  },
};
