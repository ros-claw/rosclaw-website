import { createHash, timingSafeEqual } from "crypto"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.rosclaw.io"
const AUTH_ME_URL = `${API_BASE}/wiki/v1/auth/me`
const CACHE_TTL_MS = 60_000
const NEGATIVE_CACHE_TTL_MS = 10_000
const MAX_CACHE_SIZE = 1000

export type ApiIdentity =
  | { kind: "admin" }
  | { kind: "user"; userId: string }
  | null

interface CacheEntry {
  identity: ApiIdentity
  expiresAt: number
}

const identityCache = new Map<string, CacheEntry>()

export function hashApiKey(apiKey: string): string {
  return createHash("sha256").update(apiKey).digest("hex")
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

function getCached(key: string): ApiIdentity | undefined {
  const entry = identityCache.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    identityCache.delete(key)
    return undefined
  }
  return entry.identity
}

function setCached(key: string, identity: ApiIdentity, ttl = CACHE_TTL_MS): void {
  if (!identityCache.has(key) && identityCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = identityCache.keys().next().value
    if (oldestKey !== undefined) {
      identityCache.delete(oldestKey)
    }
  }
  identityCache.set(key, { identity, expiresAt: Date.now() + ttl })
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

async function lookupUserIdByApiKey(apiKey: string): Promise<string | null> {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from("user_api_keys")
    .select("user_id")
    .eq("api_key_hash", hashApiKey(apiKey))
    .single()

  if (error || !data) return null
  return data.user_id
}

async function fetchRwIdentity(apiKey: string): Promise<ApiIdentity> {
  try {
    const res = await fetchWithTimeout(AUTH_ME_URL, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
      },
    })

    if (res.status !== 200) {
      // Definite authentication failure — safe to cache briefly
      if (res.status === 401 || res.status === 403) {
        setCached(apiKey, null, NEGATIVE_CACHE_TTL_MS)
      }
      return null
    }

    const userId = await lookupUserIdByApiKey(apiKey)
    if (!userId) {
      // Key is valid but not registered to a website user
      setCached(apiKey, null, NEGATIVE_CACHE_TTL_MS)
      return null
    }

    const identity: ApiIdentity = { kind: "user", userId }
    setCached(apiKey, identity)
    return identity
  } catch (err) {
    console.error("Failed to validate rw_ API key:", err)
    return null
  }
}

export async function authenticateApiKey(apiKey: string | null): Promise<ApiIdentity> {
  if (!apiKey) return null

  const adminKey = process.env.ADMIN_API_KEY
  if (adminKey && constantTimeCompare(apiKey, adminKey)) {
    return { kind: "admin" }
  }

  const cached = getCached(apiKey)
  if (cached !== undefined) return cached

  return fetchRwIdentity(apiKey)
}

export function isAdminApiKey(apiKey: string | null): boolean {
  if (!apiKey) return false
  const adminKey = process.env.ADMIN_API_KEY
  return !!adminKey && constantTimeCompare(apiKey, adminKey)
}
