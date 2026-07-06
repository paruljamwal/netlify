export interface ImdbPrimaryImage {
  url: string
  width?: number
  height?: number
}

export interface ImdbRating {
  aggregateRating?: number
  voteCount?: number
}

export interface ImdbTitle {
  id: string
  type: string
  primaryTitle: string
  originalTitle?: string
  primaryImage?: ImdbPrimaryImage | null
  startYear?: number
  endYear?: number
  runtimeSeconds?: number
  genres?: string[]
  rating?: ImdbRating
  plot?: string
}

export interface ImdbListTitlesResponse {
  titles: ImdbTitle[]
  totalCount?: number
  nextPageToken?: string
}
