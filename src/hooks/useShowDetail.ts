import { mediaService } from '@/services'
import type { MediaItem } from '@/types/media'
import { useApi } from './useApi'

interface UseShowDetailOptions {
  id: string
  enabled?: boolean
}

export function useShowDetail({ id, enabled = true }: UseShowDetailOptions) {
  return useApi<MediaItem>(
    async () => {
      const { item, meta } = await mediaService.getShowDetail({ id })
      return { data: item, fromCache: meta.fromCache, isStale: meta.isStale }
    },
    [id],
    { enabled: enabled && Boolean(id) },
  )
}
