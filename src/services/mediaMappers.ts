import type { MediaItem, MediaSearchResult, MediaType } from '@/types/media'
import type { ImdbTitle } from '@/types/imdbapi'

function mapTitleType(type: string): MediaType {
  if (type === 'movie' || type === 'tvMovie' || type === 'short') return 'movie'
  return 'tv'
}

function inferStatus(title: ImdbTitle): string | null {
  if (title.endYear) return 'Ended'
  if (title.startYear) return 'Released'
  return null
}

export function mapImdbTitleToMediaItem(title: ImdbTitle): MediaItem {
  return {
    id: title.id,
    title: title.primaryTitle,
    type: mapTitleType(title.type),
    imageUrl: title.primaryImage?.url ?? null,
    summary: title.plot ?? null,
    rating: title.rating?.aggregateRating ?? null,
    genres: title.genres ?? [],
    premiered: title.startYear ? String(title.startYear) : null,
    runtime: title.runtimeSeconds
      ? Math.round(title.runtimeSeconds / 60)
      : null,
    status: inferStatus(title),
  }
}

export function mapImdbTitlesToSearchResults(
  titles: ImdbTitle[],
): MediaSearchResult[] {
  return titles.map((title, index) => ({
    score: titles.length - index,
    item: mapImdbTitleToMediaItem(title),
  }))
}
