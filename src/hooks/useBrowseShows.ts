import { mediaService } from '@/services'
import type { MediaItem } from '@/types/media'
import { useApi } from './useApi'

interface UseBrowseShowsOptions {
  pageToken?: string
  enabled?: boolean
}

export function useBrowseShows(options: UseBrowseShowsOptions = {}) {
  const { pageToken, enabled = true } = options

  return useApi<MediaItem[]>(
    async () => {
      const { items, meta } = await mediaService.browseShows({ pageToken })
      return { data: items, fromCache: meta.fromCache, isStale: meta.isStale }
    },
    [pageToken],
    { enabled },
  )
}

export function useTrendingShows(pageToken?: string) {
  return useBrowseShows({ pageToken })
}
