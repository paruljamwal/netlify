import { API_BASE_URL, API_TIMEOUT_MS, CACHE_TTL } from '@/constants'
import type { ApiRequestConfig } from '@/types/api'
import { getFromCache, isCacheEntryStale, setCache } from '@/utils/cache'
import { isBrowserOnline } from './networkService'
import { ApiError, toApiError } from './apiError'

export interface ApiResponseMeta {
  fromCache: boolean
  isStale: boolean
}

export interface ApiResponse<T> {
  data: T
  meta: ApiResponseMeta
}

async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  const externalSignal = init?.signal
  const onExternalAbort = () => controller.abort()
  externalSignal?.addEventListener('abort', onExternalAbort)

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...init?.headers,
      },
    })
  } finally {
    clearTimeout(timeoutId)
    externalSignal?.removeEventListener('abort', onExternalAbort)
  }
}

export async function apiClient<T>(
  endpoint: string,
  init?: RequestInit,
  config: ApiRequestConfig = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  const cacheKey = config.cacheKey ?? endpoint
  const cacheTtlMs = config.cacheTtlMs ?? CACHE_TTL.DEFAULT
  const offline = !isBrowserOnline()

  if (!config.forceRefresh) {
    const cached = getFromCache<T>(cacheKey, { allowStale: offline })
    if (cached !== null) {
      return {
        data: cached,
        meta: {
          fromCache: true,
          isStale: offline || isCacheEntryStale(cacheKey),
        },
      }
    }
  }

  if (offline) {
    throw new ApiError('No internet connection.', {
      endpoint,
      isNetworkError: true,
    })
  }

  try {
    const response = await fetchWithTimeout(url, init)

    if (!response.ok) {
      throw new ApiError(`Request failed with status ${response.status}`, {
        status: response.status,
        endpoint,
      })
    }

    const data = (await response.json()) as T
    setCache(cacheKey, data, cacheTtlMs)

    return {
      data,
      meta: { fromCache: false, isStale: false },
    }
  } catch (error) {
    const stale = getFromCache<T>(cacheKey, { allowStale: true })

    if (stale !== null) {
      return {
        data: stale,
        meta: { fromCache: true, isStale: true },
      }
    }

    throw toApiError(error, endpoint)
  }
}
