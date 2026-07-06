import {
  AUTOCOMPLETE_LIMIT,
  MIN_NAME_SEARCH_LENGTH,
  YEAR_SEARCH_MAX_PAGES,
} from '@/constants/search'
import { CACHE_KEYS, CACHE_TTL, ENDPOINTS } from '@/constants'
import type { MediaItem, MediaSearchResult } from '@/types/media'
import type { ImdbListTitlesResponse, ImdbTitle } from '@/types/imdbapi'
import {
  detectSearchMode,
  filterShowsByYear,
  normalizeSearchQuery,
} from '@/utils/search'
import { apiClient } from './apiClient'
import { ApiError } from './apiError'
import {
  mapImdbTitleToMediaItem,
  mapImdbTitlesToSearchResults,
} from './mediaMappers'

export interface BrowseShowsOptions {
  pageToken?: string
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

export interface BrowseShowsResult {
  items: MediaItem[]
  nextPageToken?: string
  meta: { fromCache: boolean; isStale: boolean }
}

function normalizeImdbId(id: string): string {
  const trimmed = id.trim()
  if (/^tt\d+$/i.test(trimmed)) return trimmed.toLowerCase()
  if (/^\d+$/.test(trimmed)) return `tt${trimmed.padStart(7, '0')}`
  return trimmed
}

export const mediaService = {
  async browseShows({
    pageToken,
    forceRefresh = false,
    signal,
  }: BrowseShowsOptions = {}): Promise<BrowseShowsResult> {
    const { data, meta } = await apiClient<ImdbListTitlesResponse>(
      ENDPOINTS.TITLES({ pageToken }),
      { signal },
      {
        cacheKey: CACHE_KEYS.SHOWS_PAGE(pageToken),
        cacheTtlMs: CACHE_TTL.LIST,
        forceRefresh,
      },
    )

    return {
      items: (data.titles ?? []).map(mapImdbTitleToMediaItem),
      nextPageToken: data.nextPageToken,
      meta,
    }
  },

  async searchShows({ query, forceRefresh = false, signal }: SearchShowsOptions) {
    const trimmed = normalizeSearchQuery(query)
    if (!trimmed) {
      return { results: [] as MediaSearchResult[], meta: { fromCache: false, isStale: false } }
    }

    const { data, meta } = await apiClient<ImdbListTitlesResponse>(
      ENDPOINTS.SEARCH_TITLES(trimmed),
      { signal },
      {
        cacheKey: CACHE_KEYS.SEARCH(trimmed),
        cacheTtlMs: CACHE_TTL.SEARCH,
        forceRefresh,
      },
    )

    return {
      results: mapImdbTitlesToSearchResults(data.titles ?? []),
      meta,
    }
  },

  async getShowDetail({ id, forceRefresh = false, signal }: ShowDetailOptions) {
    const normalizedId = normalizeImdbId(id)
    const { data, meta } = await apiClient<ImdbTitle>(
      ENDPOINTS.TITLE_DETAIL(normalizedId),
      { signal },
      {
        cacheKey: CACHE_KEYS.SHOW_DETAIL(normalizedId),
        cacheTtlMs: CACHE_TTL.DETAIL,
        forceRefresh,
      },
    )

    return {
      item: mapImdbTitleToMediaItem(data),
      meta,
    }
  },

  async searchById(id: string, signal?: AbortSignal, forceRefresh = false): Promise<MediaItem[]> {
    try {
      const { item } = await this.getShowDetail({
        id: normalizeImdbId(id),
        signal,
        forceRefresh,
      })
      return [item]
    } catch (error) {
      if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
        return []
      }
      throw error
    }
  },

  async searchByYear(
    year: string,
    signal?: AbortSignal,
    forceRefresh = false,
  ): Promise<MediaItem[]> {
    const yearNum = Number.parseInt(year, 10)
    const matches: MediaItem[] = []
    let pageToken: string | undefined

    for (let page = 0; page < YEAR_SEARCH_MAX_PAGES; page++) {
      const { data } = await apiClient<ImdbListTitlesResponse>(
        ENDPOINTS.TITLES({ startYear: yearNum, endYear: yearNum, pageToken }),
        { signal },
        {
          cacheKey: CACHE_KEYS.YEAR(year, pageToken),
          cacheTtlMs: CACHE_TTL.SEARCH,
          forceRefresh,
        },
      )

      const items = (data.titles ?? []).map(mapImdbTitleToMediaItem)
      matches.push(...filterShowsByYear(items, year))

      if (!data.nextPageToken || items.length === 0) break
      pageToken = data.nextPageToken
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
