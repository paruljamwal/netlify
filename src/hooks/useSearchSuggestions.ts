import { useEffect, useRef, useState } from 'react'
import { SEARCH_DEBOUNCE_MS } from '@/constants/search'
import { mediaService } from '@/services'
import type { MediaItem } from '@/types/media'
import { detectSearchMode } from '@/utils/search'
import { useDebounce } from './useDebounce'

export function useSearchSuggestions(query: string, debounceMs = SEARCH_DEBOUNCE_MS) {
  const debouncedQuery = useDebounce(query, debounceMs)
  const [suggestions, setSuggestions] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)

  const mountedRef = useRef(true)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    const mode = detectSearchMode(debouncedQuery)
    // autocomplete is title-only
    if (mode !== 'name') {
      setSuggestions([])
      setLoading(false)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)

    mediaService
      .getSuggestions(debouncedQuery, controller.signal)
      .then((items) => {
        if (!mountedRef.current || controller.signal.aborted) return
        setSuggestions(items)
      })
      .catch(() => {
        if (!mountedRef.current || controller.signal.aborted) return
        setSuggestions([])
      })
      .finally(() => {
        if (mountedRef.current && !controller.signal.aborted) {
          setLoading(false)
        }
      })
  }, [debouncedQuery])

  return { suggestions, loadingSuggestions: loading }
}
