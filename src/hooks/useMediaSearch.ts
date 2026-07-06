import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SEARCH_DEBOUNCE_MS } from '@/constants/search'
import { mediaService } from '@/services'
import { isBrowserOnline } from '@/services/networkService'
import { ApiError, toApiError } from '@/services/apiError'
import { onReconnect } from '@/services/offlineService'
import type { MediaSearchResult } from '@/types/media'
import { detectSearchMode, type SearchMode } from '@/utils/search'
import { useDebounce } from './useDebounce'

interface UseMediaSearchOptions {
  query: string
  debounceMs?: number
}

interface UseMediaSearchResult {
  results: MediaSearchResult[]
  loading: boolean
  error: ApiError | null
  mode: SearchMode
  debouncedQuery: string
  hasSearched: boolean
  isStale: boolean
}

export function useMediaSearch({
  query,
  debounceMs = SEARCH_DEBOUNCE_MS,
}: UseMediaSearchOptions): UseMediaSearchResult {
  const debouncedQuery = useDebounce(query, debounceMs)
  const mode = useMemo(() => detectSearchMode(debouncedQuery), [debouncedQuery])

  const [results, setResults] = useState<MediaSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isStale, setIsStale] = useState(false)

  const mountedRef = useRef(true)
  const abortRef = useRef<AbortController | null>(null)

  const runSearch = useCallback(
    async (forceRefresh = false) => {
      if (mode === 'idle') return

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setLoading(true)
      setError(null)

      try {
        const data = await mediaService.search({
          query: debouncedQuery,
          signal: controller.signal,
          forceRefresh,
        })
        if (!mountedRef.current || controller.signal.aborted) return
        setResults(data)
        setIsStale(!isBrowserOnline())
        setHasSearched(true)
      } catch (err) {
        if (!mountedRef.current || controller.signal.aborted) return
        setResults([])
        setError(toApiError(err, debouncedQuery))
        setIsStale(false)
        setHasSearched(true)
      } finally {
        if (mountedRef.current && !controller.signal.aborted) {
          setLoading(false)
        }
      }
    },
    [debouncedQuery, mode],
  )

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (mode === 'idle') {
      setResults([])
      setError(null)
      setLoading(false)
      setHasSearched(false)
      setIsStale(false)
      return
    }
    void runSearch()
  }, [mode, runSearch])

  useEffect(() => {
    if (mode === 'idle') return
    return onReconnect(() => {
      void runSearch(true)
    })
  }, [mode, runSearch])

  return { results, loading, error, mode, debouncedQuery, hasSearched, isStale }
}
