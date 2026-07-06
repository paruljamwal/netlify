import { CACHE_STORAGE_KEY } from '@/constants'

interface CacheEntry<T> {
  data: T
  expiresAt: number
  cachedAt: number
}

interface CacheStore {
  [key: string]: CacheEntry<unknown>
}

function readStore(): CacheStore {
  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CacheStore) : {}
  } catch {
    return {}
  }
}

function writeStore(store: CacheStore): void {
  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(store))
  } catch {
    // localStorage full or disabled
  }
}

export function getFromCache<T>(
  key: string,
  options?: { allowStale?: boolean },
): T | null {
  const store = readStore()
  const entry = store[key] as CacheEntry<T> | undefined

  if (!entry) return null

  const isExpired = Date.now() > entry.expiresAt
  if (isExpired && !options?.allowStale) {
    delete store[key]
    writeStore(store)
    return null
  }

  return entry.data
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  const store = readStore()
  const now = Date.now()

  store[key] = {
    data,
    cachedAt: now,
    expiresAt: now + ttlMs,
  }

  writeStore(store)
}

export function removeFromCache(key: string): void {
  const store = readStore()
  delete store[key]
  writeStore(store)
}

export function clearCache(): void {
  try {
    localStorage.removeItem(CACHE_STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function isCacheEntryStale(key: string): boolean {
  const store = readStore()
  const entry = store[key]
  if (!entry) return true
  return Date.now() > entry.expiresAt
}
