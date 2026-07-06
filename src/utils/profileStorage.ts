import { MAX_HISTORY_ITEMS, PROFILE_STORAGE_KEYS } from '@/constants/profile'
import type { HistoryEntry, UserSession } from '@/types/profile'
import type { MediaItem } from '@/types/media'

const DEFAULT_USER: UserSession = {
  name: 'Parul',
  email: 'parul@netflix-ui.dev',
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // quota / private mode
  }
}

export function loadWatchlist(): MediaItem[] {
  return readJson<MediaItem[]>(PROFILE_STORAGE_KEYS.WATCHLIST, [])
}

export function saveWatchlist(items: MediaItem[]): void {
  writeJson(PROFILE_STORAGE_KEYS.WATCHLIST, items)
}

export function loadHistory(): HistoryEntry[] {
  return readJson<HistoryEntry[]>(PROFILE_STORAGE_KEYS.HISTORY, [])
}

export function saveHistory(entries: HistoryEntry[]): void {
  writeJson(PROFILE_STORAGE_KEYS.HISTORY, entries)
}

export function loadSession(): UserSession | null {
  return readJson<UserSession | null>(PROFILE_STORAGE_KEYS.SESSION, null)
}

export function saveSession(user: UserSession): void {
  clearSignedOutFlag()
  writeJson(PROFILE_STORAGE_KEYS.SESSION, user)
}

export function clearSession(): void {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEYS.SESSION)
    localStorage.setItem(PROFILE_STORAGE_KEYS.SIGNED_OUT, '1')
  } catch {
    // ignore
  }
}

export function isSignedOut(): boolean {
  try {
    return localStorage.getItem(PROFILE_STORAGE_KEYS.SIGNED_OUT) === '1'
  } catch {
    return false
  }
}

export function clearSignedOutFlag(): void {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEYS.SIGNED_OUT)
  } catch {
    // ignore
  }
}

export function getDefaultUser(): UserSession {
  return DEFAULT_USER
}

export function trimHistory(entries: HistoryEntry[]): HistoryEntry[] {
  return entries.slice(0, MAX_HISTORY_ITEMS)
}
