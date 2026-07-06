import {
  AUTOCOMPLETE_LIMIT,
  MIN_NAME_SEARCH_LENGTH,
  YEAR_SEARCH_MAX_PAGES,
} from '@/constants/search'
import { CACHE_KEYS, CACHE_TTL, ENDPOINTS } from '@/constants'
import type { MediaItem, MediaSearchResult } from '@/types/media'
import type { TvMazeSearchResult, TvMazeShow } from '@/types/tvmaze'
import {
  detectSearchMode,
  filterShowsByYear,
  normalizeSearchQuery,
} from '@/utils/search'
import { apiClient } from './apiClient'
import { ApiError } from './apiError'
import { mapSearchResults, mapShowToMediaItem } from './mediaMappers'

export interface BrowseShowsOptions {
  page?: number
  forceRefresh?: boolean
  signal?: AbortSignal
}

export interface SearchShowsOptions {
  query: string
  forceRefresh?: boolean
  signal?: AbortSignal
}

export interface ShowDetailOptions {
  id: string
  forceRefresh?: boolean
  signal?: AbortSignal
}

export interface UnifiedSearchOptions {
  query: string
  signal?: AbortSignal
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

  async searchShows({ query, forceRefresh = false, signal }: SearchShowsOptions) {
    const trimmed = normalizeSearchQuery(query)
    if (!trimmed) {
      return { results: [] as MediaSearchResult[], meta: { fromCache: false, isStale: false } }
    }

    const { data, meta } = await apiClient<TvMazeSearchResult[]>(
      ENDPOINTS.SEARCH_SHOWS(trimmed),
      { signal },
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

  async getShowDetail({ id, forceRefresh = false, signal }: ShowDetailOptions) {
    const { data, meta } = await apiClient<TvMazeShow>(
      ENDPOINTS.SHOW_DETAIL(id),
      { signal },
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

  async searchById(id: string, signal?: AbortSignal, forceRefresh = false): Promise<MediaItem[]> {
    try {
      const { item } = await this.getShowDetail({ id, signal, forceRefresh })
      return [item]
    } catch (error) {
      // bad id, just return empty
      if (error instanceof ApiError && error.status === 404) return []
      throw error
    }
  },

  async searchByYear(
    year: string,
    signal?: AbortSignal,
    forceRefresh = false,
  ): Promise<MediaItem[]> {
    const matches: MediaItem[] = []

    // no year filter on tvmaze, walk browse pages
    for (let page = 0; page < YEAR_SEARCH_MAX_PAGES; page++) {
      const { items } = await this.browseShows({ page, signal, forceRefresh })
      matches.push(...filterShowsByYear(items, year))
      if (items.length === 0) break
    }

    return matches
  },

  async search({
    query,
    signal,
    forceRefresh = false,
  }: UnifiedSearchOptions): Promise<MediaSearchResult[]> {
    const trimmed = normalizeSearchQuery(query)
    const mode = detectSearchMode(trimmed)

    if (mode === 'idle') return []

    if (mode === 'id') {
      const items = await this.searchById(trimmed, signal, forceRefresh)
      return items.map((item) => ({ score: 1, item }))
    }

    if (mode === 'year') {
      const items = await this.searchByYear(trimmed, signal, forceRefresh)
      return items.map((item) => ({ score: 1, item }))
    }

    const { results } = await this.searchShows({ query: trimmed, signal, forceRefresh })
    return results
  },

  async getSuggestions(query: string, signal?: AbortSignal): Promise<MediaItem[]> {
    const trimmed = normalizeSearchQuery(query)
    if (trimmed.length < MIN_NAME_SEARCH_LENGTH) return []
    if (detectSearchMode(trimmed) !== 'name') return []

    const { results } = await this.searchShows({ query: trimmed, signal })
    return results.slice(0, AUTOCOMPLETE_LIMIT).map((r) => r.item)
  },
}
