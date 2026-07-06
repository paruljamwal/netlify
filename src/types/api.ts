import type { ApiError } from '@/services/apiError'

export interface ApiRequestConfig {
  cacheKey?: string
  cacheTtlMs?: number
  forceRefresh?: boolean
}

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  fromCache: boolean
  isStale: boolean // expired cache, used when offline
}
