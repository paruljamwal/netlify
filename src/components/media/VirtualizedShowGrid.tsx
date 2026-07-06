import type { MediaItem } from '@/types/media'
import { ShowCard } from './ShowCard'

interface ShowGridProps {
  shows: MediaItem[]
  onShowClick?: (show: MediaItem) => void
  isInWatchlist?: (id: string) => boolean
  onToggleWatchlist?: (show: MediaItem) => void
  loading?: boolean
}

export function VirtualizedShowGrid({
  shows,
  onShowClick,
  isInWatchlist,
  onToggleWatchlist,
  loading = false,
}: ShowGridProps) {
  return (
    <div className="mx-auto w-full max-w-content px-page-x pb-20">
      <div className="grid grid-cols-2 gap-x-2 gap-y-5 sm:grid-cols-3 md:grid-cols-4 md:gap-x-2.5 lg:grid-cols-5 xl:grid-cols-6">
        {shows.map((show) => (
          <ShowCard
            key={show.id}
            show={show}
            variant="portrait"
            layout="grid"
            onClick={onShowClick}
            inWatchlist={isInWatchlist?.(show.id)}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-white" />
          Loading shows…
        </div>
      )}
    </div>
  )
}
