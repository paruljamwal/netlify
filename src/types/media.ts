export type MediaType = 'tv' | 'movie'

export interface MediaItem {
  id: string
  title: string
  type: MediaType
  imageUrl: string | null
  summary: string | null
  rating: number | null
  genres: string[]
  premiered: string | null
  runtime: number | null
  status: string | null
}

export interface MediaSearchResult {
  score: number
  item: MediaItem
}
