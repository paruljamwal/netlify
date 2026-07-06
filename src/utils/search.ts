import type { MediaItem } from '@/types/media'

export type SearchMode = 'id' | 'name' | 'year' | 'idle'

export function detectSearchMode(query: string): SearchMode {
  const trimmed = query.trim()
  if (!trimmed) return 'idle'
  if (/^(19|20)\d{2}$/.test(trimmed)) return 'year'
  if (/^tt\d+$/i.test(trimmed)) return 'id'
  if (/^\d+$/.test(trimmed)) return 'id'
  return 'name'
}

export function filterShowsByYear(shows: MediaItem[], year: string): MediaItem[] {
  return shows.filter((show) => show.premiered?.startsWith(year))
}

export function filterShowsByName(shows: MediaItem[], name: string): MediaItem[] {
  const lower = name.toLowerCase()
  return shows.filter((show) => show.title.toLowerCase().includes(lower))
}

export function normalizeSearchQuery(query: string): string {
  return query.trim()
}

export function toSearchResults(items: MediaItem[]) {
  return items.map((item) => ({ score: 1, item }))
}
