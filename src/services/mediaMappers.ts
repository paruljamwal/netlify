import type { MediaItem, MediaSearchResult } from '@/types/media'
import type { TvMazeSearchResult, TvMazeShow } from '@/types/tvmaze'

function stripHtml(html: string | null): string | null {
  if (!html) return null
  // tvmaze summaries come with html tags
  return html.replace(/<[^>]*>/g, '').trim()
}

export function mapShowToMediaItem(show: TvMazeShow): MediaItem {
  return {
    id: String(show.id),
    title: show.name,
    type: 'tv',
    imageUrl: show.image?.medium ?? show.image?.original ?? null,
    summary: stripHtml(show.summary),
    rating: show.rating?.average ?? null,
    genres: show.genres ?? [],
    premiered: show.premiered,
    runtime: show.runtime ?? show.averageRuntime ?? null,
    status: show.status ?? null,
  }
}

export function mapSearchResults(
  results: TvMazeSearchResult[],
): MediaSearchResult[] {
  return results.map(({ score, show }) => ({
    score,
    item: mapShowToMediaItem(show),
  }))
}
