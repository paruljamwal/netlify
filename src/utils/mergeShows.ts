import type { MediaItem } from '@/types/media'

export function mergeUniqueShows(
  existing: MediaItem[],
  incoming: MediaItem[],
): MediaItem[] {
  if (incoming.length === 0) return existing

  const ids = new Set(existing.map((s) => s.id))
  const merged = [...existing]

  for (const show of incoming) {
    if (!ids.has(show.id)) {
      ids.add(show.id)
      merged.push(show)
    }
  }

  return merged
}
