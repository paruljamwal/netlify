import { MAX_HISTORY_ITEMS, PROFILE_STORAGE_KEYS } from '@/constants/profile'
import type { HistoryEntry } from '@/types/profile'
import type { MediaItem } from '@/types/media'

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

export function trimHistory(entries: HistoryEntry[]): HistoryEntry[] {
  return entries.slice(0, MAX_HISTORY_ITEMS)
}
