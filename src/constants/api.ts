// api base url - override in .env if needed
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.tvmaze.com'

export const API_TIMEOUT_MS = 10_000

export const ENDPOINTS = {
  SHOWS: (page = 0) => `/shows?page=${page}`,
  SHOW_DETAIL: (id: string | number) => `/shows/${id}`,
  SEARCH_SHOWS: (query: string) =>
    `/search/shows?q=${encodeURIComponent(query)}`,
  SHOW_EPISODES: (id: string | number) => `/shows/${id}/episodes`,
} as const
