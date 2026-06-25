import { RATE_LIMITS } from "./constants";

interface RateLimitBucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, RateLimitBucket>();

function getWindowKey(identifier: string, windowMs: number): string {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  return `${identifier}:${windowStart}`;
}

function isAllowed(identifier: string, windowMs: number, maxRequests: number): boolean {
  const key = getWindowKey(identifier, windowMs);
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket) {
    buckets.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (bucket.count >= maxRequests) {
    return false;
  }

  bucket.count += 1;
  return true;
}

/**
 * Checks event rate limit for an anonymous installation id.
 * Window: 1 hour.
 */
export function isEventRateLimited(anonymousInstallationId: string): boolean {
  return !isAllowed(
    `event:${anonymousInstallationId}`,
    60 * 60 * 1000,
    RATE_LIMITS.eventsPerAnonIdPerHour
  );
}

/**
 * Checks event rate limit for an IP address.
 * Window: 1 hour.
 */
export function isIpRateLimited(ip: string): boolean {
  return !isAllowed(`ip:${ip}`, 60 * 60 * 1000, RATE_LIMITS.eventsPerIpPerHour);
}

/**
 * Checks heartbeat rate limit for an anonymous installation id.
 * Window: 1 day.
 */
export function isHeartbeatRateLimited(anonymousInstallationId: string): boolean {
  return !isAllowed(
    `heartbeat:${anonymousInstallationId}`,
    24 * 60 * 60 * 1000,
    RATE_LIMITS.heartbeatsPerAnonIdPerDay
  );
}

/**
 * Periodically clean up stale buckets to prevent unbounded memory growth.
 * Not needed for low-traffic P2, but keeps the map bounded.
 */
export function cleanupRateLimitBuckets(): void {
  const now = Date.now();
  const maxAgeMs = 24 * 60 * 60 * 1000;
  Array.from(buckets.entries()).forEach(([key, bucket]) => {
    if (now - bucket.windowStart > maxAgeMs) {
      buckets.delete(key);
    }
  });
}

// Run cleanup every hour in a long-running process. In serverless it is a no-op.
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitBuckets, 60 * 60 * 1000);
}
