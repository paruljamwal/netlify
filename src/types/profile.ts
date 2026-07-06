import type { MediaItem } from '@/types/media'

export interface UserSession {
  name: string
  email: string
}

export interface HistoryEntry {
  show: MediaItem
  watchedAt: string
}
