export class ApiError extends Error {
  readonly status: number | null
  readonly endpoint: string
  readonly isNetworkError: boolean
  readonly isOfflineFallback: boolean

  constructor(
    message: string,
    options: {
      status?: number | null
      endpoint?: string
      isNetworkError?: boolean
      isOfflineFallback?: boolean
      cause?: unknown
    } = {},
  ) {
    super(message, { cause: options.cause })
    this.name = 'ApiError'
    this.status = options.status ?? null
    this.endpoint = options.endpoint ?? ''
    this.isNetworkError = options.isNetworkError ?? false
    this.isOfflineFallback = options.isOfflineFallback ?? false
  }

  get userMessage(): string {
    if (this.isOfflineFallback) {
      return 'Showing saved data. You appear to be offline.'
    }
    if (this.isNetworkError || !navigator.onLine) {
      return 'Network error. Check your connection and try again.'
    }
    if (this.status === 404) {
      return 'Content not found.'
    }
    if (this.status && this.status >= 500) {
      return 'Server error. Please try again later.'
    }
    return this.message || 'Something went wrong.'
  }
}

export function toApiError(
  error: unknown,
  endpoint: string,
): ApiError {
  if (error instanceof ApiError) return error

  if (error instanceof DOMException && error.name === 'AbortError') {
    return new ApiError('Request timed out.', {
      endpoint,
      isNetworkError: true,
      cause: error,
    })
  }

  if (error instanceof TypeError) {
    return new ApiError('Unable to reach the server.', {
      endpoint,
      isNetworkError: true,
      cause: error,
    })
  }

  return new ApiError(
    error instanceof Error ? error.message : 'An unexpected error occurred.',
    { endpoint, cause: error },
  )
}
