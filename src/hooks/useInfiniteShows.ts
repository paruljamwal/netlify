import { useCallback, useEffect, useRef, useState } from 'react'
import { MAX_BROWSE_SHOWS, TVMAZE_PAGE_SIZE } from '@/constants/browse'
import { mediaService } from '@/services'
import { ApiError, toApiError } from '@/services/apiError'
import type { MediaItem } from '@/types/media'
import { mergeUniqueShows } from '@/utils/mergeShows'

interface UseInfiniteShowsResult {
  shows: MediaItem[]
  loading: boolean
  hasMore: boolean
  error: ApiError | null
  loadMore: () => Promise<void>
}

export function useInfiniteShows(
  maxItems = MAX_BROWSE_SHOWS,
): UseInfiniteShowsResult {
  const [shows, setShows] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  const pageRef = useRef(0)
  const loadingRef = useRef(false)
  const hasMoreRef = useRef(true)
  const mountedRef = useRef(true)
  const abortRef = useRef<AbortController | null>(null)

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return

    loadingRef.current = true
    if (mountedRef.current) {
      setLoading(true)
      setError(null)
    }

    abortRef.current?.abort() // fast scroll
    const controller = new AbortController()
    abortRef.current = controller

    const page = pageRef.current

    try {
      const { items } = await mediaService.browseShows({
        page,
        signal: controller.signal,
      })

      if (!mountedRef.current) return

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

      pageRef.current = page + 1

      if (items.length < TVMAZE_PAGE_SIZE) {
        hasMoreRef.current = false
        setHasMore(false)
      }
    } catch (err) {
      if (!mountedRef.current || controller.signal.aborted) return
      setError(toApiError(err, `shows?page=${page}`))
    } finally {
      loadingRef.current = false
      if (mountedRef.current) setLoading(false)
    }
  }, [maxItems])

  useEffect(() => {
    mountedRef.current = true
    void loadMore()

    return () => {
      mountedRef.current = false
      abortRef.current?.abort()
    }
  }, [loadMore])

  return { shows, loading, hasMore, error, loadMore }
}
