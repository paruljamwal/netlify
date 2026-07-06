/** API-related constants — base URLs, endpoints, cache keys */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const ENDPOINTS = {
  TRENDING: '/trending',
  SEARCH: '/search',
  DETAIL: (id: string) => `/title/${id}`,
} as const
