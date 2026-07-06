export interface TvMazeImage {
  medium: string
  original: string
}

export interface TvMazeRating {
  average: number | null
}

export interface TvMazeShow {
  id: number
  name: string
  type: string
  language: string
  genres: string[]
  status: string
  runtime: number | null
  averageRuntime: number | null
  premiered: string | null
  ended: string | null
  officialSite: string | null
  rating: TvMazeRating
  image: TvMazeImage | null
  summary: string | null
  updated: number
}

export interface TvMazeSearchResult {
  score: number
  show: TvMazeShow
}
