import { ShowCard } from '@/components/media/ShowCard'
import { ShowCardSkeleton } from '@/components/media/ShowCardSkeleton'
import type { MediaSearchResult } from '@/types/media'
import type { MediaItem } from '@/types/media'
import type { SearchMode } from '@/utils/search'

interface SearchResultsProps {
  results: MediaSearchResult[]
  loading: boolean
  mode: SearchMode
  onShowClick?: (show: MediaItem) => void
  isInWatchlist?: (id: string) => boolean
  onToggleWatchlist?: (show: MediaItem) => void
}

export function SearchResults({
  results,
  loading,
  mode,
  onShowClick,
  isInWatchlist,
  onToggleWatchlist,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <ShowCardSkeleton key={i} variant="portrait" />
        ))}
      </div>
    )
  }

  if (results.length === 0) return null

  return (
    <div>
      <p className="mb-4 text-sm text-[#b3b3b3]">
        {results.length} result{results.length !== 1 ? 's' : ''}
        {mode === 'id' && ' · ID lookup'}
        {mode === 'year' && ' · filtered by year'}
        {mode === 'name' && ' · by title'}
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {results.map(({ item }) => (
          <ShowCard
            key={item.id}
            show={item}
            variant="portrait"
            onClick={onShowClick}
            inWatchlist={isInWatchlist?.(item.id)}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>
    </div>
  )
}
