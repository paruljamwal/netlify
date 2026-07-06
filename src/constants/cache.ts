export const CACHE_KEYS = {
  SHOWS_PAGE: (page: number) => `shows:page:${page}`,
  SHOW_DETAIL: (id: string) => `show:detail:${id}`,
  SEARCH: (query: string) => `search:${query.toLowerCase().trim()}`,
} as const

export const CACHE_TTL = {
  LIST: 5 * 60 * 1000,
  DETAIL: 30 * 60 * 1000,
  SEARCH: 10 * 60 * 1000,
  DEFAULT: 15 * 60 * 1000,
} as const

export const CACHE_STORAGE_KEY = 'netflix-ui-api-cache'
