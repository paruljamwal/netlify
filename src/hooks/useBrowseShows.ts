import { mediaService } from '@/services'
import type { MediaItem } from '@/types/media'
import { useApi } from './useApi'

interface UseBrowseShowsOptions {
  page?: number
  enabled?: boolean
}

export function useBrowseShows(options: UseBrowseShowsOptions = {}) {
  const { page = 0, enabled = true } = options

  return useApi<MediaItem[]>(
    async () => {
      const { items, meta } = await mediaService.browseShows({ page })
      return { data: items, fromCache: meta.fromCache, isStale: meta.isStale }
    },
    [page],
    { enabled },
  )
}

// same as browseShows, using page 0 for the home trending row
export function useTrendingShows(page = 0) {
  return useBrowseShows({ page })
}
