import { mediaService } from '@/services'
import type { MediaSearchResult } from '@/types/media'
import { useApi } from './useApi'

interface UseShowSearchOptions {
  query: string
  minLength?: number
}

export function useShowSearch({ query, minLength = 2 }: UseShowSearchOptions) {
  const trimmed = query.trim()
  const enabled = trimmed.length >= minLength

  return useApi<MediaSearchResult[]>(
    async () => {
      const results = await mediaService.search({ query: trimmed })
      return { data: results, fromCache: false, isStale: false }
    },
    [trimmed],
    { enabled },
  )
}
