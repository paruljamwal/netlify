import { mediaService } from '@/services'
import type { MediaSearchResult } from '@/types/media'
import { useApi } from './useApi'

interface UseShowSearchOptions {
  query: string
  minLength?: number // wait until user types enough chars
}

export function useShowSearch({ query, minLength = 2 }: UseShowSearchOptions) {
  const trimmed = query.trim()
  const enabled = trimmed.length >= minLength

  return useApi<MediaSearchResult[]>(
    async () => {
      const { results, meta } = await mediaService.searchShows({ query: trimmed })
      return { data: results, fromCache: meta.fromCache, isStale: meta.isStale }
    },
    [trimmed],
    { enabled },
  )
}
