import { CACHE_KEYS, CACHE_TTL, ENDPOINTS } from '@/constants'
import type { MediaItem, MediaSearchResult } from '@/types/media'
import type { TvMazeSearchResult, TvMazeShow } from '@/types/tvmaze'
import { apiClient } from './apiClient'
import { mapSearchResults, mapShowToMediaItem } from './mediaMappers'

export interface BrowseShowsOptions {
  page?: number
  forceRefresh?: boolean
  signal?: AbortSignal
}

export interface SearchShowsOptions {
  query: string
  forceRefresh?: boolean
}

export interface ShowDetailOptions {
  id: string
  forceRefresh?: boolean
}

export const mediaService = {
  async browseShows({ page = 0, forceRefresh = false, signal }: BrowseShowsOptions = {}) {
    const { data, meta } = await apiClient<TvMazeShow[]>(
      ENDPOINTS.SHOWS(page),
      { signal },
      {
        cacheKey: CACHE_KEYS.SHOWS_PAGE(page),
        cacheTtlMs: CACHE_TTL.LIST,
        forceRefresh,
      },
    )

    return {
      items: data.map(mapShowToMediaItem),
      meta,
    }
  },

  async searchShows({ query, forceRefresh = false }: SearchShowsOptions) {
    const trimmed = query.trim()
    if (!trimmed) {
      return { results: [] as MediaSearchResult[], meta: { fromCache: false, isStale: false } }
    }

    const { data, meta } = await apiClient<TvMazeSearchResult[]>(
      ENDPOINTS.SEARCH_SHOWS(trimmed),
      undefined,
      {
        cacheKey: CACHE_KEYS.SEARCH(trimmed),
        cacheTtlMs: CACHE_TTL.SEARCH,
        forceRefresh,
      },
    )

    return {
      results: mapSearchResults(data),
      meta,
    }
  },

  async getShowDetail({ id, forceRefresh = false }: ShowDetailOptions) {
    const { data, meta } = await apiClient<TvMazeShow>(
      ENDPOINTS.SHOW_DETAIL(id),
      undefined,
      {
        cacheKey: CACHE_KEYS.SHOW_DETAIL(id),
        cacheTtlMs: CACHE_TTL.DETAIL,
        forceRefresh,
      },
    )

    return {
      item: mapShowToMediaItem(data) as MediaItem,
      meta,
    }
  },
}
