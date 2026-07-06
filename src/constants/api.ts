export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.imdbapi.dev'

export const API_TIMEOUT_MS = 10_000

export const IMDB_DEFAULT_PAGE_SIZE = 50

export interface TitlesQueryParams {
  pageSize?: number
  pageToken?: string
  startYear?: number
  endYear?: number
}

function buildTitlesQuery(params: TitlesQueryParams = {}): string {
  const search = new URLSearchParams()
  search.set('pageSize', String(params.pageSize ?? IMDB_DEFAULT_PAGE_SIZE))
  if (params.pageToken) search.set('pageToken', params.pageToken)
  if (params.startYear != null) search.set('startYear', String(params.startYear))
  if (params.endYear != null) search.set('endYear', String(params.endYear))
  return search.toString()
}

export const ENDPOINTS = {
  TITLES: (params: TitlesQueryParams = {}) => `/titles?${buildTitlesQuery(params)}`,
  TITLE_DETAIL: (id: string) => `/titles/${encodeURIComponent(id)}`,
  SEARCH_TITLES: (query: string, pageSize = 25) =>
    `/search/titles?${new URLSearchParams({
      query,
      pageSize: String(pageSize),
    })}`,
} as const
