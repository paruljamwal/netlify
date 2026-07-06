import { useCallback, useEffect, useRef, useState } from 'react'
import type { AsyncState } from '@/types/api'
import { toApiError } from '@/services/apiError'

interface UseApiOptions {
  enabled?: boolean
}

export interface FetchResult<T> {
  data: T
  fromCache: boolean
  isStale: boolean
}

const initialState = <T>(): AsyncState<T> => ({
  data: null,
  loading: true,
  error: null,
  fromCache: false,
  isStale: false,
})

export function useApi<T>(
  fetcher: () => Promise<FetchResult<T>>,
  deps: unknown[],
  options: UseApiOptions = {},
): AsyncState<T> & { refetch: () => Promise<void> } {
  const { enabled = true } = options
  const [state, setState] = useState<AsyncState<T>>(initialState)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const result = await fetcherRef.current()
      setState({
        data: result.data,
        loading: false,
        error: null,
        fromCache: result.fromCache,
        isStale: result.isStale,
      })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: toApiError(error, ''),
        fromCache: false,
        isStale: false,
      })
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      setState({
        data: null,
        loading: false,
        error: null,
        fromCache: false,
        isStale: false,
      })
      return
    }
    void execute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, execute, ...deps])

  return { ...state, refetch: execute }
}
