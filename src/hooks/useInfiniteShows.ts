import { useCallback, useEffect, useRef, useState } from 'react'
import { IMDB_PAGE_SIZE, MAX_BROWSE_SHOWS } from '@/constants/browse'
import { mediaService } from '@/services'
import { ApiError, toApiError } from '@/services/apiError'
import { onReconnect } from '@/services/offlineService'
import type { MediaItem } from '@/types/media'
import { mergeUniqueShows } from '@/utils/mergeShows'

interface UseInfiniteShowsResult {
  shows: MediaItem[]
  loading: boolean
  hasMore: boolean
  error: ApiError | null
  loadMore: () => Promise<void>
  retry: () => Promise<void>
}

export function useInfiniteShows(
  maxItems = MAX_BROWSE_SHOWS,
): UseInfiniteShowsResult {
  const [shows, setShows] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  const nextTokenRef = useRef<string | undefined>(undefined)
  const loadedTokensRef = useRef<(string | undefined)[]>([])
  const loadingRef = useRef(false)
  const hasMoreRef = useRef(true)
  const errorRef = useRef(false)
  const mountedRef = useRef(true)
  const abortRef = useRef<AbortController | null>(null)

  const loadMore = useCallback(async () => {
    // Bail while in-flight, exhausted, or after an error (manual retry clears it).
    // Leaving hasMore true on failure used to let the scroll sentinel re-fire
    // forever and blink empty ↔ skeleton when the API is down.
    if (loadingRef.current || !hasMoreRef.current || errorRef.current) return

    loadingRef.current = true
    if (mountedRef.current) {
      setLoading(true)
      setError(null)
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const pageToken = nextTokenRef.current

    try {
      const { items, nextPageToken } = await mediaService.browseShows({
        pageToken,
        signal: controller.signal,
      })

      if (!mountedRef.current) return

      loadedTokensRef.current.push(pageToken)

      if (items.length === 0) {
        hasMoreRef.current = false
        setHasMore(false)
        return
      }

      setShows((prev) => {
        const merged = mergeUniqueShows(prev, items).slice(0, maxItems)

        if (merged.length >= maxItems) {
          hasMoreRef.current = false
          setHasMore(false)
        }

        return merged
      })

      nextTokenRef.current = nextPageToken

      if (!nextPageToken || items.length < IMDB_PAGE_SIZE) {
        hasMoreRef.current = false
        setHasMore(false)
      }
    } catch (err) {
      if (!mountedRef.current || controller.signal.aborted) return
      errorRef.current = true
      setError(toApiError(err, ENDPOINT_LABEL(pageToken)))
    } finally {
      loadingRef.current = false
      if (mountedRef.current) setLoading(false)
    }
  }, [maxItems])

  const retry = useCallback(async () => {
    errorRef.current = false
    if (mountedRef.current) setError(null)
    await loadMore()
  }, [loadMore])

  useEffect(() => {
    mountedRef.current = true
    void loadMore()

    return () => {
      mountedRef.current = false
      abortRef.current?.abort()
    }
  }, [loadMore])

  useEffect(() => {
    return onReconnect(async () => {
      const tokens = loadedTokensRef.current
      if (tokens.length === 0) {
        // First page never succeeded — clear the error latch and try again.
        errorRef.current = false
        if (mountedRef.current) setError(null)
        void loadMore()
        return
      }

      try {
        let merged: MediaItem[] = []
        for (const token of tokens) {
          const { items } = await mediaService.browseShows({
            pageToken: token,
            forceRefresh: true,
          })
          merged = mergeUniqueShows(merged, items)
        }
        if (mountedRef.current) {
          setShows(merged.slice(0, maxItems))
          errorRef.current = false
          setError(null)
        }
      } catch {
        // keep cached list on failed refresh
      }
    })
  }, [maxItems, loadMore])

  return { shows, loading, hasMore, error, loadMore, retry }
}

function ENDPOINT_LABEL(pageToken?: string) {
  return pageToken ? `titles?pageToken=${pageToken.slice(0, 12)}…` : 'titles'
}
